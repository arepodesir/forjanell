import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import PretextShift from '@/components/Pretext/PretextShift';
import Hadacard from '@/components/Hadacard/Hadacard';
import OrchidViewer from '@/components/SentientOrchid/OrchidViewer';
import MusicTitlebar from '@/components/MusicTitlebar';
import { haptic } from '@/utils/haptics';

type CardMeta = {
  edition: string;
  series: string;
  id: string;
  rarity: string;
  year: string;
  artist: string;
};

type EnvProps = {
  name: string;
  nickname: string;
  picUrl: string;
  scrollMsg: string;
  hbdMessage: string;
  openDate: string;
  birthDate: string;
  cardMeta: CardMeta;
  sceneBackgrounds: Record<number, string>;
  sceneMessages: Record<number, string[]>;
  sceneActions: Record<number, { emoji: string; label: string }>;
  audio: {
    bubble: string;
    pop: string;
    hbd: string;
  };
  // egift removed completely (no voucher)
};

export default function FrutigerScenes(props: EnvProps) {
  const [timeStatus, setTimeStatus] = createSignal<'EARLY' | 'LATE' | 'ON_TIME'>('ON_TIME');
  const [scene, setScene] = createSignal<number>(1);
  const [msgIndex, setMsgIndex] = createSignal<number>(0);
  const [showAction, setShowAction] = createSignal<boolean>(false);
  const [isTransitioning, setIsTransitioning] = createSignal<boolean>(false);
  const [endAudio, setEndAudio] = createSignal<HTMLAudioElement | undefined>();

  let activeTimers: number[] = [];

  // Create the main wave song player (from config / public/assets) *synchronously*
  // so that children like MusicTitlebar and OrchidViewer receive a stable externalAudio ref
  // on their first mount. This fixes hooking/timing issues for auto-play and pause UI.
  // The actual .play() attempt happens on mount (or on user gesture for the reveal).
  let sfxHbd: HTMLAudioElement | undefined;
  if (typeof window !== 'undefined') {
    sfxHbd = new Audio(props.audio.hbd);
    sfxHbd.loop = true;
    sfxHbd.volume = 0.5;
  }

  // Particle background references
  let canvasRef: HTMLCanvasElement | undefined;
  const mousePos = { x: -9999, y: -9999 };

  onMount(() => {
    // Time Gate Check
    if (props.openDate) {
      const startTime = new Date(props.openDate + "T00:00").getTime();
      const endTime = startTime + 24 * 60 * 60 * 1000;
      const now = Date.now();
      if (now < startTime) setTimeStatus('EARLY');
      else if (now > endTime) setTimeStatus('LATE');
    }

    // Pause global BGM to avoid overlapping audio (the main wave is now owned here for the gift)
    if (typeof window !== 'undefined' && (window as any).globalBgmAudio) {
      (window as any).globalBgmAudio.pause();
    }

    // Attempt to play the main wave song (from config). This may be deferred by browser
    // until a user gesture; the "Open the Letter" tap below provides one for the reveal.
    if (sfxHbd) {
      sfxHbd.play().catch(e => console.log("Main BGM deferred (will retry on gesture):", e));
    }

    if (timeStatus() === 'ON_TIME') {
      runMessages();
    }

    // Initialize Canvas Particle Background
    if (canvasRef) {
      const ctx = canvasRef.getContext('2d');
      if (ctx) {
        let width = (canvasRef.width = window.innerWidth);
        let height = (canvasRef.height = window.innerHeight);

        const handleResize = () => {
          if (!canvasRef) return;
          width = canvasRef.width = window.innerWidth;
          height = canvasRef.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        // Stylized "sea of Perlin noise" particles bg (T-004): gradients for depth, animation noisiness via layered sin (SVG-like noise func for jitter/flow), well distributed (grid + noise offsets for organic sea, not uniform/clumpy). Multiple layers implicit in noise freq. Fits gift "sea" while keeping interactive/girly elements.
        const particleCount = 140;
        const particles: Array<{
          x: number;
          y: number;
          vx: number;
          vy: number;
          radius: number;
          baseRadius: number;
          color: string;
          alpha: number;
          kind: 'dot' | 'heart' | 'spark' | 'orb';
        }> = [];

        const colors = [
          'rgba(255, 102, 196, ', // aero-pink
          'rgba(255, 182, 193, ', // blush
          'rgba(255, 143, 191, ', // rose
          'rgba(255, 215, 0, ',   // gold
          'rgba(255, 255, 255, ', // star white
          'rgba(188, 19, 254, ',  // accent purple
        ];

        // Simple Perlin-ish noise for distribution + animation noisiness (layered sin, cheap, SVG-filter like jitter)
        const noise = (x: number, y: number, t: number, oct = 3) => {
          let n = 0; let amp = 1; let f = 1;
          for (let o = 0; o < oct; o++) {
            n += Math.sin(x * f * 0.008 + t) * amp + Math.sin(y * f * 0.005 - t * 0.7) * amp * 0.6;
            amp *= 0.5; f *= 1.9;
          }
          return n;
        };

        for (let i = 0; i < particleCount; i++) {
          const radius = Math.random() * 3.2 + 0.7;
          const r = Math.random();
          const kind: 'dot' | 'heart' | 'spark' | 'orb' = r < 0.12 ? 'orb' : (r < 0.28 ? 'heart' : (r < 0.45 ? 'spark' : 'dot'));
          // Well distributed sea: base grid + noise offset for organic Perlin flow (not random clump)
          const gx = (i % 12) * (width / 12) + 8;
          const gy = Math.floor(i / 12) * (height / 12) + 8;
          const nx = noise(gx * 0.9, gy * 0.7, 0, 2) * 14;
          const ny = noise(gy * 0.8, gx * 0.6, 1.2, 2) * 12;
          particles.push({
            x: gx + nx,
            y: gy + ny,
            vx: (Math.random() - 0.5) * 0.42,
            vy: (Math.random() - 0.5) * 0.36 - 0.04,
            radius,
            baseRadius: radius,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.55 + 0.18,
            kind
          });
        }

        // burst helper — called on pop action + pointer taps for powerful girly feedback
        const burst = (bx: number, by: number, count = 14) => {
          for (let i = 0; i < count; i++) {
            const r = Math.random() * 2.2 + 1.1;
            particles.push({
              x: bx + (Math.random() - 0.5) * 18,
              y: by + (Math.random() - 0.5) * 18,
              vx: (Math.random() - 0.5) * 1.8,
              vy: (Math.random() - 0.8) * 1.6 - 0.4,
              radius: r,
              baseRadius: r,
              color: colors[Math.floor(Math.random() * 3)], // prefer pinks
              alpha: 0.7 + Math.random() * 0.3,
              kind: Math.random() < 0.5 ? 'heart' : 'spark'
            });
          }
          // trim old if too many
          while (particles.length > particleCount + 55) particles.shift();
        };

        // expose for action
        (window as any)._giftBurst = burst;

        let animationFrameId: number;

        const animate = () => {
          ctx.clearRect(0, 0, width, height);

          // Render connecting lines
          for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
              const p1 = particles[i];
              const p2 = particles[j];
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < 115) {
                const alpha = (1 - dist / 115) * 0.1;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(137, 196, 255, ${alpha})`;
                ctx.lineWidth = 0.7;
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          }

          // Render and update particles (girly: hearts, sparks, stronger attract + twinkle + bursts)
          particles.forEach((p, idx) => {
            // noisiness in vel/alpha (Perlin-like via noise func for sea surface animation)
            p.vx += noise(p.x * 0.004, p.y * 0.003, now * 0.001) * 0.12;
            p.vy += noise(p.y * 0.003, p.x * 0.004, now * 0.0009 + 2) * 0.09;
            p.alpha = Math.max(0.15, Math.min(0.9, p.alpha + noise(p.x * 0.01, now * 0.002, p.y * 0.005) * 0.04));

            p.x += p.vx;
            p.y += p.vy;

            // soft drift up for petals/hearts
            if (p.kind !== 'dot') p.vy -= 0.0035;

            // Bounce / wrap
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -0.6;

            // Mouse/touch attract + repel mix (powerful interactive)
            if (mousePos.x !== -9999 && mousePos.y !== -9999) {
              const mdx = p.x - mousePos.x;
              const mdy = p.y - mousePos.y;
              const mdist = Math.sqrt(mdx * mdx + mdy * mdy) || 1;

              if (mdist < 160) {
                const force = (160 - mdist) / 160;
                const angle = Math.atan2(mdy, mdx);
                // attract toward finger + slight swirl
                p.x += Math.cos(angle) * force * 0.9;
                p.y += Math.sin(angle) * force * 0.9;
                p.radius = p.baseRadius + force * 1.6;
                p.alpha = Math.min(0.95, p.alpha + force * 0.1);
              } else if (p.radius > p.baseRadius) {
                p.radius -= 0.06;
              }
            }

            // gentle twinkle
            if (p.kind === 'spark' && Math.random() < 0.06) {
              p.alpha = 0.35 + Math.random() * 0.55;
            }

            // draw - more exciting particle field (orbs glow, hearts bigger, sparks with extra rays, dots with soft halo for gift magic)
            // draw with gradient (for stylized depth/sea feel)
            ctx.save();
            ctx.globalAlpha = Math.max(0.08, p.alpha);
            const g = ctx.createRadialGradient(
              p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.15,
              p.x, p.y, p.radius * 1.7
            );
            g.addColorStop(0, p.color + (p.alpha * 0.95) + ')');
            g.addColorStop(0.55, p.color + (p.alpha * 0.55) + ')');
            g.addColorStop(1, p.color + '0)');
            ctx.fillStyle = g;
            if (p.kind === 'heart') {
              const s = p.radius * 1.45;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y + s * 0.3);
              ctx.arc(p.x - s * 0.28, p.y - s * 0.1, s * 0.34, 0, Math.PI * 2);
              ctx.arc(p.x + s * 0.28, p.y - s * 0.1, s * 0.34, 0, Math.PI * 2);
              ctx.lineTo(p.x, p.y + s * 0.9);
              ctx.closePath();
              ctx.fill();
            } else if (p.kind === 'spark') {
              // gradient already set above for sea depth
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius * 0.55, 0, Math.PI * 2);
              ctx.fill();
              // extra rays for excitement
              ctx.fillRect(p.x - p.radius * 1.8, p.y - 0.5, p.radius * 3.6, 1);
              ctx.fillRect(p.x - 0.5, p.y - p.radius * 1.8, 1, p.radius * 3.6);
              ctx.fillRect(p.x - p.radius * 1.1, p.y - p.radius * 1.1, p.radius * 2.2, p.radius * 2.2 * 0.12);
            } else if (p.kind === 'orb') {
              // glowing orb for depth/excitement
              const g = ctx.createRadialGradient(p.x - 1, p.y - 1, p.radius * 0.2, p.x, p.y, p.radius * 1.8);
              g.addColorStop(0, p.color + '0.95)');
              g.addColorStop(0.5, p.color + (p.alpha * 0.6) + ')');
              g.addColorStop(1, p.color + '0)');
              ctx.fillStyle = g;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius * 1.6, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = p.color + (p.alpha * 0.9) + ')';
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius * 0.7, 0, Math.PI * 2);
              ctx.fill();
            } else {
              // soft halo dot
              ctx.fillStyle = p.color + (p.alpha * 0.35) + ')';
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius * 1.7, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = p.color + p.alpha + ')';
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          });

          animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Save handleResize cleanup reference
        (window as any)._particleResizeHandler = handleResize;
        (window as any)._particleAnimId = animationFrameId;
      }
    }
  });

  onCleanup(() => {
    clearAllTimers();
    if (sfxHbd) sfxHbd.pause();
    const ea = endAudio();
    if (ea) {
      try { ea.pause(); } catch {}
    }

    // Clean up particles
    if (typeof window !== 'undefined') {
      if ((window as any)._particleResizeHandler) {
        window.removeEventListener('resize', (window as any)._particleResizeHandler);
      }
      if ((window as any)._particleAnimId) {
        cancelAnimationFrame((window as any)._particleAnimId);
      }
    }

    // Re-enable global bgm if available (components that need silence pause it themselves)
    if (typeof window !== 'undefined' && (window as any).globalBgmAudio) {
      (window as any).globalBgmAudio.play().catch(() => {});
    }
  });

  const clearAllTimers = () => {
    activeTimers.forEach(t => clearTimeout(t));
    activeTimers = [];
  };

  const runMessages = () => {
    clearAllTimers();
    setMsgIndex(0);
    setShowAction(false);

    const msgs = props.sceneMessages[1] || [];
    msgs.forEach((_, i) => {
      const t = window.setTimeout(() => {
        setMsgIndex(i);
        if (i === msgs.length - 1) {
          const t2 = window.setTimeout(() => setShowAction(true), 1200);
          activeTimers.push(t2);
        }
      }, i * 3200);
      activeTimers.push(t);
    });
  };

  const handleAction = () => {
    haptic.trigger('heavy');

    // More exciting burst for gift open (larger, multi type, trails for wow)
    const burstFn = (window as any)._giftBurst;
    if (burstFn && canvasRef) {
      const rect = canvasRef.getBoundingClientRect();
      burstFn(rect.width * 0.5, rect.height * 0.42, 38); // bigger for gift magic
      // secondary burst for depth
      setTimeout(() => {
        if (burstFn && canvasRef) burstFn(rect.width * 0.5, rect.height * 0.55, 18);
      }, 180);
    }

    // Switch to the special end gift song at the "gift open at the end"
    // Pause any previous BGM (the hadacard stage audio)
    if (sfxHbd && !sfxHbd.paused) {
      try { sfxHbd.pause(); } catch {}
    }

    // Load and play "what-friends-are-for.wav" automatically (user gesture from the open button guarantees autoplay works)
    const newEndAudio = new Audio('/assets/audio/what-friends-are-for.wav');
    newEndAudio.loop = true;  // keep it looping nicely for the reveal experience
    newEndAudio.volume = 0.5;
    newEndAudio.play().catch(e => console.log("End gift song play deferred:", e));
    setEndAudio(newEndAudio);

    // Trigger transition without pop sounds or ambient loops pausing
    setIsTransitioning(true);

    const t = window.setTimeout(() => {
      // Transition to orchid end scene (no more card/egift)
      setScene(2);
      setIsTransitioning(false);
    }, 900);
    activeTimers.push(t);
  };

  return (
    <div 
      class="relative w-full h-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ "background": "linear-gradient(135deg, #090c21 0%, #05060f 50%, #0d071a 100%)" }}
      onPointerMove={(e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
      }}
      onPointerLeave={() => {
        mousePos.x = -9999;
        mousePos.y = -9999;
      }}
      onPointerDown={(e) => {
        const burstFn = (window as any)._giftBurst;
        if (burstFn) burstFn(e.clientX, e.clientY - (window.scrollY || 0), 9);
      }}
    >
      {/* Fullscreen interactive particle canvas */}
      <canvas ref={canvasRef} class="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Glass gradient tint overlay */}
      <div class="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-transparent to-purple-950/40 pointer-events-none z-10"></div>

      {/* Super cool full screen gradual backdrop blur decrease to 0 (replaces white flash to gift).
          Dreamy sharpening reveal as the gift opens - full aspect, elegant, no harsh white. */}
      <div 
        class={`absolute inset-0 z-40 pointer-events-none bg-white/5 transition-all duration-[1600ms] ease-out ${isTransitioning() ? 'opacity-90' : 'opacity-0'}`}
        style={{ 
          'backdrop-filter': isTransitioning() ? 'blur(28px) saturate(0.7)' : 'blur(0px) saturate(1)',
          'transition': 'backdrop-filter 1600ms cubic-bezier(0.23,1,0.32,1), opacity 900ms ease'
        }}
      ></div>

      {/* Early Guard Screen */}
      <Show when={timeStatus() === 'EARLY'}>
        <div class="relative z-20 flex flex-col items-center justify-center text-center text-white p-6"
             style={{ "font-family": "'Patrick Hand', cursive" }}>
          <h1 class="text-4xl font-extrabold mb-6 drop-shadow-lg" style={{ "font-family": "'Great Vibes', cursive" }}>Come Back Later...</h1>
          <div class="aero-glass p-6 rounded-2xl max-w-md border border-white/10">
            <p class="text-xl">I know you're excited for your special day, but you need to be patient! ✨</p>
          </div>
        </div>
      </Show>

      {/* Late Guard Screen */}
      <Show when={timeStatus() === 'LATE'}>
        <div class="relative z-20 flex flex-col items-center justify-center text-center text-white p-6"
             style={{ "font-family": "'Patrick Hand', cursive" }}>
          <h1 class="text-4xl font-extrabold mb-6 drop-shadow-lg text-pink-300" style={{ "font-family": "'Great Vibes', cursive" }}>The Party is Over</h1>
          <div class="aero-glass p-6 rounded-2xl max-w-md border border-white/10">
            <p class="text-xl">You missed it! But the gift was meant for you. Happy Belated Birthday! 💖</p>
          </div>
        </div>
      </Show>

      {/* On-Time Main Content Flow */}
      <Show when={timeStatus() === 'ON_TIME'}>
        {/* Precede removed per job: simply the Hadacard (open mode available) then the sentient orchid.
            The "letter" is now the direct gateway (home still uses portrait Hadacard). */}
        <Show when={scene() === 1}>
          {/* Large immersive card container for the gift. The Hadacard renders a big card surface whose *internal* video background + holo layers + letter elements (profile, confetti, message) fill most of the view.
              Video is on the card (inside its surface), not a site-wide background. Action CTA fixed at bottom. */}
          <div class="z-20 absolute inset-0 flex items-center justify-center select-none">
            <Hadacard 
              client:load
              name={props.name}
              nickname={props.nickname}
              picUrl={props.picUrl}
              hbdMessage={props.hbdMessage}
              cardMeta={props.cardMeta}
              mode="open-letter"
              // Gift video bg (horsey) — now auto-playing + full viewport (see Hadacard).
              videoBg="/assets/video/horsey.optimized.webm"
              centerImage="/assets/img/janell.png"
              confettiImage="/assets/img/Confetti.png"
            />
          </div>
          <button
            onPointerDown={handleAction}
            class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] aero-btn text-xs tracking-wider px-6 py-2"
            style={{ "font-family": "'Comfortaa', sans-serif" }}
          >
            Open the Letter &amp; Meet Your Orchid 🌸
          </button>
        </Show>

        {/* Stage 2: Orchid Reveal (end scene — 3D interactive orchid, mobile friendly, no egift/voucher).
            Positioned + sized to fill much more of the window with a nice zoom feel (larger canvas + less chrome around it). */}
        <Show when={scene() === 2}>
          <div class="z-20 w-full flex flex-col items-center justify-center p-3 pt-5 pb-6 gap-2 min-h-[82vh]">
            {/* Soft message above the 3D bloom (kept small so the orchid can dominate) */}
            <div class="aero-glass rounded-3xl px-4 py-2.5 max-w-xs text-center border border-white/15 mb-1">
              <p class="text-aero-cyan text-[10px] tracking-wider uppercase mb-0.5" style={{ "font-family": "'Comfortaa', sans-serif" }}>Your gift has opened</p>
              <div class="text-white/90 text-xs leading-snug" style={{ "font-family": "'Patrick Hand', cursive" }}>
                A virtual orchid just for you.
              </div>
              {/* Gift tag for Janell */}
              <div class="mt-1 inline-flex items-center gap-1 text-[8px] tracking-[1.5px] text-pink-300/70">
                <span class="border border-pink-300/40 px-2 py-px rounded-sm">FOR JANELL</span>
              </div>
            </div>

            {/* The orchid "player" — now much larger to fill the view + feel zoomed/immersive. */}
            <OrchidViewer
              client:load
              class="w-full max-w-[min(96vw,980px)] h-[64vh] md:h-[70vh] lg:h-[74vh]"
              externalAudio={endAudio()}
            />

            <p class="text-[10px] text-white/40 tracking-[2px] mt-0.5">TAP THE ORCHID • DRAG TO ORBIT • PINCH TO ZOOM</p>

            {/* End scene music titlebar — integrated with the player component (in its own folder src/components/MusicTitlebar/).
                Uses externalAudio for the what-friends-are-for.wav that auto-plays at gift open.
                Shows the correct title "What Friends Are For" by Dionne Warwick. */}
            <MusicTitlebar
              externalAudio={endAudio()}
              src="/assets/audio/what-friends-are-for.wav"
              title="What Friends Are For"
              artist="Dionne Warwick"
              class="fixed bottom-3 left-1/2 -translate-x-1/2 z-[55] w-[min(92vw,420px)]"
            />
          </div>
        </Show>
      </Show>
    </div>
  );
}
