import { createSignal, For, Show } from 'solid-js';
import { haptic } from '../utils/haptics';

const WISHES = [
  "May all your dreams sparkle and come true this year! 🌟",
  "Wishing you infinite happiness, joy, and amazing memories! 💖",
  "May your year be filled with exciting new adventures and success! 🚀",
  "Wishing you good health, peace of mind, and lots of laughter! 🌸",
  "May you always stay as bright and wonderful as you are! 🦄",
  "Cheers to another beautiful chapter in your life! 🥂"
];

export default function BubbleWishes() {
  const [bubbles, setBubbles] = createSignal(
    WISHES.map((wish, id) => ({
      id,
      wish,
      popped: false,
      x: Math.random() * 65 + 10, // percentage left
      y: Math.random() * 45 + 15, // percentage top
      size: Math.random() * 20 + 80, // size in pixels (slightly smaller for mobile)
      delay: Math.random() * 3 // float delay
    }))
  );

  const [activeWish, setActiveWish] = createSignal<string | null>(null);
  let audioPop: HTMLAudioElement;

  const handlePop = (id: number) => {
    // Acoustic & physical haptic
    haptic.trigger('success');

    // Play sound
    if (!audioPop) {
      audioPop = new Audio('/resources/sfx/blast.mp3');
      audioPop.volume = 0.5;
    }
    audioPop.currentTime = 0;
    audioPop.play().catch(() => {});

    // Update state
    setBubbles(prev =>
      prev.map(b => (b.id === id ? { ...b, popped: true } : b))
    );

    const poppedWish = WISHES[id];
    setActiveWish(poppedWish);
  };

  return (
    <div class="relative w-full flex flex-col items-center justify-center overflow-hidden py-2" style={{ "font-family": "'Patrick Hand', cursive" }}>
      {/* Instructions */}
      <div class="z-10 text-center mb-6 px-4">
        <h2 class="text-xl font-black text-white mb-2 drop-shadow-md" style={{ "font-family": "'Comfortaa', sans-serif" }}>
          Pop the Bubbles for Wishes! 🫧🎈
        </h2>
        <p class="text-blue-100/90 text-sm font-semibold">
          Tap on any floating bubble below to release its hidden blessing.
        </p>
      </div>

      {/* Floating Bubbles Stage */}
      <div class="relative w-full h-[50vh] max-w-lg border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md overflow-hidden p-4 shadow-2xl">
        <For each={bubbles()}>
          {(bubble) => (
            <Show when={!bubble.popped}>
              <button
                onPointerDown={() => handlePop(bubble.id)}
                class="absolute cursor-pointer rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-90"
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95) 0%, rgba(0,243,255,0.55) 45%, rgba(188,19,254,0.3) 75%, rgba(10,11,24,0.2) 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.7)',
                  'box-shadow': '0 8px 20px rgba(0, 243, 255, 0.3), inset 0 4px 6px rgba(255, 255, 255, 0.6)',
                  animation: `float-bubble 6s infinite ease-in-out alternate`,
                  'animation-delay': `${bubble.delay}s`,
                  'touch-action': 'none'
                }}
              >
                {/* Bubble Gloss Reflection */}
                <div class="absolute top-[8%] left-[15%] w-[70%] h-[35%] rounded-full bg-gradient-to-b from-white/80 to-transparent -rotate-12 pointer-events-none"></div>
                <span class="text-2xl filter drop-shadow-md select-none">✨</span>
              </button>
            </Show>
          )}
        </For>

        {/* Wish Card Overlay */}
        <Show when={activeWish()}>
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-20">
            <div class="aero-glass rounded-3xl p-6 max-w-[280px] w-full text-center border-2 border-aero-cyan shadow-aero-cyan/20 animate-reveal-up">
              <span class="text-4xl block mb-3">🎉</span>
              <p class="text-lg font-bold text-white leading-relaxed mb-5" style={{ "font-family": "'Comfortaa', sans-serif" }}>
                {activeWish()}
              </p>
              <button
                onPointerDown={() => {
                  haptic.trigger('light');
                  setActiveWish(null);
                }}
                class="aero-btn text-[10px] uppercase tracking-wider px-5 py-2 w-full"
                style={{ "font-family": "'Comfortaa', sans-serif" }}
              >
                Keep Popping! 🫧
              </button>
            </div>
          </div>
        </Show>
      </div>

      <style>{`
        @keyframes float-bubble {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(10px, -20px) rotate(4deg); }
        }
      `}</style>
    </div>
  );
}
