import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import AeroCard from './AeroCard';
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
  audio: Record<string, string>;
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

  // Track all timers for cleanup
  let activeTimers: number[] = [];

  // Audio instances
  let sfxSwitch: HTMLAudioElement;
  let sfxDoor: HTMLAudioElement;
  let sfxMystic: HTMLAudioElement;
  let sfxBlast: HTMLAudioElement;
  let sfxHbd: HTMLAudioElement;
  let sfxAmbient: HTMLAudioElement;

  onMount(() => {
    // Time Gate Check
    if (props.openDate) {
      const startTime = new Date(props.openDate + "T00:00").getTime();
      const endTime = startTime + 24 * 60 * 60 * 1000;
      const now = Date.now();
      if (now < startTime) setTimeStatus('EARLY');
      else if (now > endTime) setTimeStatus('LATE');
    }

    // Init Audio from config
    sfxSwitch = new Audio(props.audio.switch);
    sfxDoor = new Audio(props.audio.door);
    sfxMystic = new Audio(props.audio.mystic);
    sfxMystic.loop = true;
    sfxBlast = new Audio(props.audio.blast);
    sfxHbd = new Audio(props.audio.hbd);
    sfxHbd.loop = true;
    sfxAmbient = new Audio(props.audio.ambient);
    sfxAmbient.loop = true;
    sfxAmbient.volume = 0.3;
    sfxAmbient.play().catch(() => {});

    // Preload background images for smooth transitions
    Object.values(props.sceneBackgrounds).forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    if (timeStatus() === 'ON_TIME') {
      runMessages(1);
    }
  });

  onCleanup(() => {
    clearAllTimers();
    if (sfxAmbient) sfxAmbient.pause();
    if (sfxMystic) sfxMystic.pause();
    if (sfxHbd) sfxHbd.pause();
  });

  const clearAllTimers = () => {
    activeTimers.forEach(t => clearTimeout(t));
    activeTimers = [];
  };

  /** Run the message sequence for a specific scene number (avoids stale closure) */
  const runMessages = (sceneNum: number) => {
    clearAllTimers();
    setMsgIndex(0);
    setShowAction(false);

    const msgs = props.sceneMessages[sceneNum];
    if (!msgs) return;

    msgs.forEach((_, i) => {
      const t = window.setTimeout(() => {
        setMsgIndex(i);
        if (i === msgs.length - 1) {
          const t2 = window.setTimeout(() => setShowAction(true), 1500);
          activeTimers.push(t2);
        }
      }, i * 3500);
      activeTimers.push(t);
    });
  };

  const handleAction = () => {
    const current = scene();
    haptic.trigger('success');

    if (current === 1) {
      sfxSwitch.play().catch(() => {});
      setScene(2);
      runMessages(2);
    } else if (current === 2) {
      sfxDoor.play().catch(() => {});
      setScene(3);
      if (sfxAmbient) sfxAmbient.pause();
      sfxMystic.play().catch(() => {});
      runMessages(3);
    } else if (current === 3) {
      sfxBlast.play().catch(() => {});
      sfxMystic.pause();
      if (sfxAmbient) sfxAmbient.play().catch(() => {});
      setScene(4);
      runMessages(4);
    } else if (current === 4) {
      sfxBlast.play().catch(() => {});
      if (sfxAmbient) sfxAmbient.pause();
      setShowAction(false);
      setScene(5); // Flash / Bubble burst

      const t = window.setTimeout(() => {
        setScene(6); // Final Card
        sfxHbd.play().catch(() => {});
      }, 1500);
      activeTimers.push(t);
    }
  };

  // ─── Early/Late Guard Pages ──────────────────
  if (timeStatus() === 'EARLY') {
    return (
      <div class="relative flex flex-col items-center justify-center h-full text-center text-white p-6 bg-cover bg-center"
           style={{ "background-image": `url(${props.sceneBackgrounds[1]})`, "font-family": "'Patrick Hand', cursive" }}>
        <div class="absolute inset-0 bg-blue-900/70"></div>
        <div class="relative z-10">
          <h1 class="text-4xl font-extrabold mb-6 drop-shadow-lg" style={{ "font-family": "'Caveat', cursive" }}>Come Back Later...</h1>
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
           style={{ "background-image": `url(${props.sceneBackgrounds[4]})`, "font-family": "'Patrick Hand', cursive" }}>
        <div class="absolute inset-0 bg-pink-900/60"></div>
        <div class="relative z-10">
          <h1 class="text-4xl font-extrabold mb-6 drop-shadow-lg text-pink-300" style={{ "font-family": "'Caveat', cursive" }}>The Party is Over</h1>
          <div class="aero-glass p-6 rounded-2xl max-w-md">
            <p class="text-xl">You missed it! But the gift was meant for you. Happy Belated Birthday! 💖</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Scene Renderer ─────────────────────
  return (
    <div class="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">

      {/* ─── Background Images (Visual Novel themed) ─── */}
      {[1, 2, 3, 4].map((s) => (
        <div
          class={`absolute inset-0 transition-opacity duration-1000 bg-cover bg-center ${
            scene() === s || (scene() >= 5 && s === 4) ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ "background-image": `url(${props.sceneBackgrounds[s]})` }}
        ></div>
      ))}

      {/* ─── Gradient Overlays (tinting the backgrounds) ─── */}
      <div class={`absolute inset-0 transition-opacity duration-1000 ${scene() === 1 ? 'opacity-100' : 'opacity-0'}`}
           style={{ background: "linear-gradient(135deg, rgba(10,11,24,0.65) 0%, rgba(30,10,50,0.55) 100%)" }}></div>
      <div class={`absolute inset-0 transition-opacity duration-1000 ${scene() === 2 ? 'opacity-100' : 'opacity-0'}`}
           style={{ background: "linear-gradient(180deg, rgba(0,200,255,0.15) 0%, rgba(100,200,255,0.1) 100%)" }}></div>
      <div class={`absolute inset-0 transition-opacity duration-1000 ${scene() === 3 ? 'opacity-100' : 'opacity-0'}`}
           style={{ background: "linear-gradient(135deg, rgba(80,0,120,0.4) 0%, rgba(200,50,100,0.25) 50%, rgba(255,120,50,0.2) 100%)" }}></div>
      <div class={`absolute inset-0 transition-opacity duration-1000 ${scene() >= 4 && scene() !== 5 ? 'opacity-100' : 'opacity-0'}`}
           style={{ background: "linear-gradient(135deg, rgba(0,200,255,0.15) 0%, rgba(255,102,196,0.15) 100%)" }}></div>

      {/* ─── Flash / Blast Layer ─── */}
      <div class={`absolute inset-0 bg-white z-40 ${
        scene() === 5 ? 'opacity-100 animate-bubble-burst' : 'opacity-0 pointer-events-none'
      }`}></div>

      {/* ─── Interactive Scene Stage ─── */}
      <Show when={scene() >= 1 && scene() <= 4}>
        <div class="z-10 flex flex-col items-center text-center px-6 w-full max-w-md">
          {/* Message bubble with glass background for better readability */}
          <div class="aero-glass rounded-3xl px-6 py-5 mb-8 w-full border-white/20 min-h-[90px] flex items-center justify-center shadow-lg">
            <PretextShift 
              text={props.sceneMessages[scene() as 1|2|3|4]?.[msgIndex()] || ""} 
              font="20px 'Comfortaa'" 
              lineHeight={28}
              class="text-xl font-bold text-white text-center leading-relaxed"
            />
          </div>

          <Show when={showAction()}>
            <button
              onPointerDown={handleAction}
              class="w-20 h-20 rounded-full aero-glass flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110 active:scale-95 animate-pulse-gloss border-white/30"
              style={{ "touch-action": "none" }}
            >
              <span class="text-3xl drop-shadow-md">
                {props.sceneActions[scene() as 1|2|3|4]?.emoji}
              </span>
            </button>
            <p class="mt-4 text-white/95 font-bold text-sm tracking-wider uppercase"
               style={{ "font-family": "'Comfortaa', sans-serif", "text-shadow": "0 1px 4px rgba(0,0,0,0.8)" }}>
              {props.sceneActions[scene() as 1|2|3|4]?.label}
            </p>
          </Show>
        </div>
      </Show>

      {/* ─── Final Card Stage ─── */}
      <Show when={scene() === 6}>
        <AeroCard
          name={props.name}
          nickname={props.nickname}
          picUrl={props.picUrl}
          scrollMsg={props.scrollMsg}
          hbdMessage={props.hbdMessage}
          cardMeta={props.cardMeta}
          egift={props.egift}
        />
      </Show>
    </div>
  );
}
