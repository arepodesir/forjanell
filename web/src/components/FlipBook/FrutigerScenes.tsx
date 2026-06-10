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

        // GIRLY POWERFUL PARTICLES (configs-to-toml-2): more, blush/pink/rose/gold + sparkle, interactive bursts
        const particleCount = 92;
        const particles: Array<{
          x: number;
          y: number;
          vx: number;
          vy: number;
          radius: number;
          baseRadius: number;
          color: string;
          alpha: number;
          kind: 'dot' | 'heart' | 'spark';
        }> = [];

        const colors = [
          'rgba(255, 102, 196, ', // aero-pink
          'rgba(255, 182, 193, ', // blush
          'rgba(255, 143, 191, ', // rose
          'rgba(255, 215, 0, ',   // gold
          'rgba(255, 255, 255, ', // star white
          'rgba(188, 19, 254, ',  // accent purple
        ];

        for (let i = 0; i < particleCount; i++) {
          const radius = Math.random() * 2.6 + 0.9;
          const kind: 'dot' | 'heart' | 'spark' = Math.random() < 0.18 ? 'heart' : (Math.random() < 0.22 ? 'spark' : 'dot');
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.32,
            vy: (Math.random() - 0.5) * 0.28 - 0.03,
            radius,
            baseRadius: radius,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.42 + 0.22,
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

            // draw
            ctx.save();
            ctx.globalAlpha = Math.max(0.08, p.alpha);
            if (p.kind === 'heart') {
              // simple heart using two arcs + triangle
              const s = p.radius * 1.35;
              ctx.fillStyle = p.color + p.alpha + ')';
              ctx.beginPath();
              ctx.moveTo(p.x, p.y + s * 0.3);
              ctx.arc(p.x - s * 0.28, p.y - s * 0.1, s * 0.32, 0, Math.PI * 2);
              ctx.arc(p.x + s * 0.28, p.y - s * 0.1, s * 0.32, 0, Math.PI * 2);
              ctx.lineTo(p.x, p.y + s * 0.85);
              ctx.closePath();
              ctx.fill();
            } else if (p.kind === 'spark') {
              // 4-point sparkle
              ctx.fillStyle = p.color + (p.alpha * 0.9) + ')';
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillRect(p.x - p.radius * 1.6, p.y - 0.6, p.radius * 3.2, 1.2);
              ctx.fillRect(p.x - 0.6, p.y - p.radius * 1.6, 1.2, p.radius * 3.2);
            } else {
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

    // Clean up particles
    if (typeof window !== 'undefined') {
      if ((window as any)._particleResizeHandler) {
        window.removeEventListener('resize', (window as any)._particleResizeHandler);
      }
      if ((window as any)._particleAnimId) {
        cancelAnimationFrame((window as any)._particleAnimId);
      }
    }

    // Re-enable global bgm if available
    if (typeof window !== 'undefined' && (window as any).globalBgmAudio && sessionStorage.getItem('bgm_muted') !== 'true') {
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

    // Girly powerful burst at the bubble location (centerish)
    const burstFn = (window as any)._giftBurst;
    if (burstFn && canvasRef) {
      const rect = canvasRef.getBoundingClientRect();
      burstFn(rect.width * 0.5, rect.height * 0.42, 22);
    }

    // Ensure the main wave song (config's main.wav) plays automatically for the orchid reveal.
    // The tap on this button is a user gesture, so play() will succeed (or resume).
    if (sfxHbd) {
      sfxHbd.play().catch(e => console.log("Main BGM play on reveal gesture:", e));
    }

    // Trigger transition without pop sounds or ambient loops pausing
    setIsTransitioning(true);

    const t = window.setTimeout(() => {
      // Transition to orchid end scene (no more card/egift)
      setScene(2);
      setIsTransitioning(false);
      // Looping main.wav (sfxHbd) continues playing smoothly
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

      {/* Bubble pop flash layer */}
      <div class={`absolute inset-0 bg-white z-40 transition-opacity duration-700 pointer-events-none ${
        isTransitioning() ? 'opacity-100' : 'opacity-0'
      }`}></div>

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
          <div class="z-20 flex flex-col items-center text-center px-4 w-full max-w-md gap-4 select-none animate-reveal-up">
            <Hadacard 
              client:load
              name={props.name}
              nickname={props.nickname}
              picUrl={props.picUrl}
              hbdMessage={props.hbdMessage}
              cardMeta={props.cardMeta}
              mode="open-letter"
            />
            <button
              onPointerDown={handleAction}
              class="mt-2 aero-btn text-xs tracking-wider px-6 py-2"
              style={{ "font-family": "'Comfortaa', sans-serif" }}
            >
              Open the Letter &amp; Meet Your Orchid 🌸
            </button>
          </div>
        </Show>

        {/* Stage 2: Orchid Reveal (end scene — 3D interactive orchid, mobile friendly, no egift/voucher) */}
        <Show when={scene() === 2}>
          <div class="z-20 w-full flex flex-col items-center justify-start p-4 pt-8 pb-12 gap-5">
            {/* Soft message above the 3D bloom */}
            <div class="aero-glass rounded-3xl px-5 py-4 max-w-md text-center border border-white/15">
              <p class="text-aero-cyan text-sm tracking-wider uppercase mb-1" style={{ "font-family": "'Comfortaa', sans-serif" }}>Your gift has opened</p>
              <div class="text-white/90 text-[15px] leading-snug" style={{ "font-family": "'Patrick Hand', cursive" }}>
                A living orchid, grown just for you. Touch it. Turn it. Let it catch the light.
              </div>
            </div>

            {/* The orchid "player" is connected to the single main wave song instance (sfxHbd) owned by this scene
                (which comes from props.audio.hbd = config main from assets.toml / public/assets/audio/main.wav). */}
            <OrchidViewer
              client:load
              class="w-full max-w-[min(92vw,520px)] h-[460px] md:h-[560px] rounded-3xl"
              externalAudio={sfxHbd}
            />

            <p class="text-[10px] text-white/40 tracking-[2px] mt-1">TAP THE ORCHID • DRAG TO ORBIT • PINCH TO ZOOM</p>

            {/* End scene music titlebar — appears with the persistent BGM (sfxHbd).
                Uses externalAudio so we hook the single looping instance owned here.
                Acts as the neat "music footer" for the orchid reveal (per mach-2 job). */}
            <MusicTitlebar
              externalAudio={sfxHbd}
              src={props.audio.hbd}
              title="Bubbly Reverie"
              artist="AREPO for Janell"
              class="fixed bottom-3 left-1/2 -translate-x-1/2 z-[55] w-[min(92vw,420px)]"
            />
          </div>
        </Show>
      </Show>
    </div>
  );
}
