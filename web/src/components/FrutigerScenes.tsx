import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import ThreeCard from './ThreeCard';
import PretextShift from './PretextShift';
import { haptic } from '../utils/haptics';

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
  egift?: {
    title: string;
    value: string;
    merchant: string;
    code: string;
    instructions: string;
  };
};

export default function FrutigerScenes(props: EnvProps) {
  const [timeStatus, setTimeStatus] = createSignal<'EARLY' | 'LATE' | 'ON_TIME'>('ON_TIME');
  const [scene, setScene] = createSignal<number>(1);
  const [msgIndex, setMsgIndex] = createSignal<number>(0);
  const [showAction, setShowAction] = createSignal<boolean>(false);
  const [isTransitioning, setIsTransitioning] = createSignal<boolean>(false);

  let activeTimers: number[] = [];

  // Audio references
  let sfxHbd: HTMLAudioElement | undefined;

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

    // Initialize & play looping BGM (main.wav) right from the start
    sfxHbd = new Audio(props.audio.hbd);
    sfxHbd.loop = true;
    sfxHbd.volume = 0.5;

    // Pause global BGM to avoid overlapping audio
    if (typeof window !== 'undefined' && (window as any).globalBgmAudio) {
      (window as any).globalBgmAudio.pause();
    }

    sfxHbd.play().catch(e => console.log("Main BGM deferred:", e));

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

        const particleCount = 65;
        const particles: Array<{
          x: number;
          y: number;
          vx: number;
          vy: number;
          radius: number;
          baseRadius: number;
          color: string;
          alpha: number;
        }> = [];

        const colors = [
          'rgba(0, 243, 255, ',   // cyan glow
          'rgba(255, 102, 196, ', // pink glow
          'rgba(188, 19, 254, ',  // purple glow
          'rgba(255, 255, 255, '  // clean white
        ];

        for (let i = 0; i < particleCount; i++) {
          const radius = Math.random() * 2 + 1;
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            radius,
            baseRadius: radius,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.35 + 0.15
          });
        }

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

          // Render and update particles
          particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;

            // Bounce on boundaries
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // Repel particles from mouse pointer
            if (mousePos.x !== -9999 && mousePos.y !== -9999) {
              const mdx = p.x - mousePos.x;
              const mdy = p.y - mousePos.y;
              const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

              if (mdist < 130) {
                const force = (130 - mdist) / 130;
                const angle = Math.atan2(mdy, mdx);
                p.x += Math.cos(angle) * force * 1.5;
                p.y += Math.sin(angle) * force * 1.5;
                p.radius = p.baseRadius + force * 1.2;
              } else {
                if (p.radius > p.baseRadius) {
                  p.radius -= 0.08;
                }
              }
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ')';
            ctx.fill();
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
    
    // Trigger transition without pop sounds or ambient loops pausing
    setIsTransitioning(true);

    const t = window.setTimeout(() => {
      // Transition to final card stage
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
        {/* Stage 1: Intro Scene (Magical Bubble) */}
        <Show when={scene() === 1}>
          <div class="z-20 flex flex-col items-center text-center px-4 w-full max-w-md gap-6 select-none animate-reveal-up">
            {/* Glass text bubble container */}
            <div class="aero-glass rounded-3xl px-6 py-5 w-full border border-white/20 min-h-[110px] flex items-center justify-center shadow-xl">
              <PretextShift 
                text={props.sceneMessages[1]?.[msgIndex()] || ""} 
                font="20px 'Comfortaa'" 
                lineHeight={28}
                class="text-lg font-bold text-white text-center leading-relaxed"
              />
            </div>

            {/* Glowing Bubble pop action trigger */}
            <Show when={showAction()}>
              <div class="flex flex-col items-center gap-3 animate-reveal-up">
                <button
                  onPointerDown={handleAction}
                  class="w-24 h-24 rounded-full gc-cyan flex items-center justify-center cursor-pointer shadow-[0_8px_32px_rgba(0,243,255,0.4)] transition-all duration-300 hover:scale-110 active:scale-90 border-2 border-white/40 hover:shadow-[0_12px_48px_rgba(0,243,255,0.7)]"
                  style={{ "touch-action": "none" }}
                >
                  <span class="text-4xl drop-shadow-md animate-pulse">🫧</span>
                </button>
                <p class="text-white font-black text-xs tracking-wider uppercase drop-shadow-lg"
                   style={{ "font-family": "'Comfortaa', sans-serif", "text-shadow": "0 2px 8px rgba(0,0,0,0.8)" }}>
                  POP BUBBLE
                </p>
              </div>
            </Show>
          </div>
        </Show>

        {/* Stage 2: Final Card Stage (3D Holographic Card) */}
        <Show when={scene() === 2}>
          <div class="z-20 w-full min-h-[100dvh] overflow-y-auto flex flex-col items-center justify-start p-4 py-8">
            <ThreeCard 
              client:load
              name={props.name}
              nickname={props.nickname}
              picUrl={props.picUrl}
              hbdMessage={props.hbdMessage}
              scrollMsg={props.scrollMsg}
              cardMeta={props.cardMeta}
              egift={props.egift}
              isFinalCard={true}
            />
          </div>
        </Show>
      </Show>
    </div>
  );
}
