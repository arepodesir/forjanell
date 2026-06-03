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
  let sfxBubble: HTMLAudioElement | undefined;
  let sfxPop: HTMLAudioElement | undefined;
  let sfxHbd: HTMLAudioElement | undefined;

  onMount(() => {
    // Time Gate Check
    if (props.openDate) {
      const startTime = new Date(props.openDate + "T00:00").getTime();
      const endTime = startTime + 24 * 60 * 60 * 1000;
      const now = Date.now();
      if (now < startTime) setTimeStatus('EARLY');
      else if (now > endTime) setTimeStatus('LATE');
    }

    // Initialize Audio
    sfxBubble = new Audio(props.audio.bubble);
    sfxBubble.loop = true;
    sfxBubble.volume = 0.45;

    sfxPop = new Audio(props.audio.pop);
    sfxPop.volume = 0.6;

    sfxHbd = new Audio(props.audio.hbd);
    sfxHbd.loop = true;
    sfxHbd.volume = 0.5;

    // Start soft bubble ambient sound
    sfxBubble.play().catch(e => console.log("Ambient audio deferred:", e));

    if (timeStatus() === 'ON_TIME') {
      runMessages();
    }
  });

  onCleanup(() => {
    clearAllTimers();
    if (sfxBubble) sfxBubble.pause();
    if (sfxPop) sfxPop.pause();
    if (sfxHbd) sfxHbd.pause();
    // Re-enable global bgm if available
    if (typeof window !== 'undefined' && (window as any).globalBgmAudio && sessionStorage.getItem('bgm_muted') !== 'true') {
      (window as any).globalBgmAudio.play().catch(() => {});
    }
  });

  const clearAllTimers = () => {
    activeTimers.forEach(t => clearTimeout(t));
    activeTimers = [];
  };

  // Run the single scene's dialogue flow
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
    
    // Play pop SFX
    if (sfxPop) sfxPop.play().catch(() => {});

    // Disable ambient sound
    if (sfxBubble) sfxBubble.pause();

    // Trigger flash transition
    setIsTransitioning(true);

    const t = window.setTimeout(() => {
      // Transition to final card stage
      setScene(2);
      setIsTransitioning(false);

      // Play main birthday song
      if (sfxHbd) {
        // Pause global bgm to prevent double music
        if ((window as any).globalBgmAudio) {
          (window as any).globalBgmAudio.pause();
        }
        sfxHbd.play().catch(e => console.log("Main music deferred:", e));
      }
    }, 900);
    activeTimers.push(t);
  };

  // ─── Early/Late Guard Pages ──────────────────
  if (timeStatus() === 'EARLY') {
    return (
      <div class="relative flex flex-col items-center justify-center h-full text-center text-white p-6 bg-cover bg-center"
           style={{ "background-image": `url(${props.sceneBackgrounds[1]})`, "font-family": "'Patrick Hand', cursive" }}>
        <div class="absolute inset-0 bg-blue-900/70"></div>
        <div class="relative z-10">
          <h1 class="text-4xl font-extrabold mb-6 drop-shadow-lg" style={{ "font-family": "'Great Vibes', cursive" }}>Come Back Later...</h1>
          <div class="aero-glass p-6 rounded-2xl max-w-md">
            <p class="text-xl">I know you're excited for your special day, but you need to be patient! ✨</p>
          </div>
        </div>
      </div>
    );
  }

  if (timeStatus() === 'LATE') {
    return (
      <div class="relative flex flex-col items-center justify-center h-full text-center text-white p-6 bg-cover bg-center"
           style={{ "background-image": `url(${props.sceneBackgrounds[2]})`, "font-family": "'Patrick Hand', cursive" }}>
        <div class="absolute inset-0 bg-pink-900/60"></div>
        <div class="relative z-10">
          <h1 class="text-4xl font-extrabold mb-6 drop-shadow-lg text-pink-300" style={{ "font-family": "'Great Vibes', cursive" }}>The Party is Over</h1>
          <div class="aero-glass p-6 rounded-2xl max-w-md">
            <p class="text-xl">You missed it! But the gift was meant for you. Happy Belated Birthday! 💖</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      
      {/* ─── Background Gifs ─── */}
      <div
        class={`absolute inset-0 transition-opacity duration-1000 bg-cover bg-center ${
          scene() === 1 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ "background-image": `url(${props.sceneBackgrounds[1]})` }}
      ></div>

      <div
        class={`absolute inset-0 transition-opacity duration-1000 bg-cover bg-center ${
          scene() === 2 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ "background-image": `url(${props.sceneBackgrounds[2]})` }}
      ></div>

      {/* Glass gradient tint overlays */}
      <div class="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-cyan-950/20 to-indigo-950/60 pointer-events-none"></div>

      {/* Bubble pop flash layer */}
      <div class={`absolute inset-0 bg-white z-40 transition-opacity duration-700 pointer-events-none ${
        isTransitioning() ? 'opacity-100' : 'opacity-0'
      }`}></div>

      {/* ─── Stage 1: Intro Scene (Magical Bubble) ─── */}
      <Show when={scene() === 1}>
        <div class="z-10 flex flex-col items-center text-center px-4 w-full max-w-md gap-6 select-none">
          {/* Glass text bubble container */}
          <div class="aero-glass rounded-3xl px-6 py-5 w-full border-white/20 min-h-[110px] flex items-center justify-center shadow-xl">
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

      {/* ─── Stage 2: Final Card Stage (3D Holographic Card) ─── */}
      <Show when={scene() === 2}>
        <div class="z-10 w-full min-h-[100dvh] overflow-y-auto flex flex-col items-center justify-start p-4 py-8">
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
    </div>
  );
}
