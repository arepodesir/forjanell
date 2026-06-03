import { createSignal, onMount, onCleanup, Show, For } from 'solid-js';
import { haptic } from '../utils/haptics';
import PretextShift from './PretextShift';

interface CardMeta {
  edition: string;
  series: string;
  id: string;
  rarity: string;
  year: string;
  artist: string;
}

interface ThreeCardProps {
  name?: string;
  nickname?: string;
  picUrl?: string;
  hbdMessage?: string;
  scrollMsg?: string;
  cardMeta?: CardMeta;
  egift?: {
    title: string;
    value: string;
    merchant: string;
    code: string;
    instructions: string;
  };
  isFinalCard?: boolean;
}

/** Splits text into an array of {char, delay} for the letter-block animation */
function splitToLetterBlocks(text: string, baseDelay: number = 30) {
  const letters: { char: string; delay: number }[] = [];
  let idx = 0;
  for (const char of text) {
    letters.push({ char, delay: idx * baseDelay });
    idx++;
  }
  return letters;
}

export default function ThreeCard(props: ThreeCardProps) {
  const [showVoucher, setShowVoucher] = createSignal(false);
  const [isFlipped, setIsFlipped] = createSignal(false);

  // Holographic interaction state
  const [pointerX, setPointerX] = createSignal(50);
  const [pointerY, setPointerY] = createSignal(50);
  const [cardOpacity, setCardOpacity] = createSignal(0.4);
  const [isInteracting, setIsInteracting] = createSignal(false);
  
  let cardRef: HTMLDivElement | undefined;
  let autoShimmerRaf: number | undefined;

  // Resolve properties with defaults
  const name = () => props.name || "For Janell";
  const nickname = () => props.nickname || "Janell";
  const picUrl = () => props.picUrl || "/resources/img/janell.png";
  const hbdMessage = () => props.hbdMessage || "Happy Belated Birthday!";
  const cardMeta = () => props.cardMeta || {
    edition: "Quantum Extract · First Edition",
    series: "Hadacard™ Crystalline Series",
    id: "HC-001",
    rarity: "✦ Ultra Rare Holo",
    year: "2026",
    artist: "The Universe"
  };

  const hbdLetters = () => splitToLetterBlocks(hbdMessage(), 50);
  const nameLetters = () => splitToLetterBlocks(name(), 40);

  const stopAutoShimmer = () => {
    if (autoShimmerRaf) {
      cancelAnimationFrame(autoShimmerRaf);
      autoShimmerRaf = undefined;
    }
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!cardRef) return;
    setIsInteracting(true);
    stopAutoShimmer();

    const rect = cardRef.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPointerX(Math.max(0, Math.min(100, x)));
    setPointerY(Math.max(0, Math.min(100, y)));
    setCardOpacity(1);
  };

  const handlePointerLeave = () => {
    setIsInteracting(false);
    setCardOpacity(0.45);
    startAutoShimmer();
  };

  const startAutoShimmer = () => {
    stopAutoShimmer();
    let t = 0;
    const tick = () => {
      t += 0.006;
      setPointerX(50 + Math.sin(t) * 35);
      setPointerY(50 + Math.cos(t * 0.7) * 35);
      autoShimmerRaf = requestAnimationFrame(tick);
    };
    autoShimmerRaf = requestAnimationFrame(tick);
  };

  onMount(() => {
    startAutoShimmer();
  });

  onCleanup(() => {
    stopAutoShimmer();
  });

  const cardStyles = () => `
    --pointer-x: ${pointerX()}%;
    --pointer-y: ${pointerY()}%;
    --card-opacity: ${cardOpacity()};
    --rotate-x: ${((pointerX() - 50) / 50) * 14}deg;
    --rotate-y: ${((pointerY() - 50) / 50) * -14}deg;
  `;

  return (
    <div class="w-full h-full flex flex-col items-center justify-center gap-3">
      {/* 3D Holographic Card Viewport (No outer box container, perfectly centered) */}
      <div class="w-full flex items-center justify-center shrink-0">
        <div
          class="holo-card cursor-grab active:cursor-grabbing select-none"
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={`${cardStyles()}; touch-action: none;`}
        >
          <div class="holo-card__inner">
            {/* Background Texture */}
            <div class="absolute inset-0 bg-cover bg-center opacity-25 rounded-2xl"
                 style={{ "background-image": "url(/resources/img/nature.jpg)" }}>
            </div>
            <div class="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-pink-900/50 to-indigo-900/80 rounded-2xl"></div>

            {/* Holographic foil overlays */}
            <div class="holo-card__glitter"></div>
            <div class="holo-card__shine"></div>
            <div class="holo-card__glare"></div>

            {/* Content layout inside the card */}
            <div class="relative z-10 flex flex-col items-center text-center p-4 h-full">
              {/* Header meta */}
              <div class="w-full flex justify-between items-start mb-2 text-[10px] text-pink-200/70 font-mono">
                <span>{cardMeta().id}</span>
                <span>{cardMeta().rarity}</span>
              </div>

              {/* Profile picture with cap */}
              <div class="relative w-24 h-24 mb-3 animate-float z-10 shrink-0">
                <img src="/resources/img/bday-cap.svg"
                     class="absolute -top-4 -right-2 w-9 h-9 z-20 rotate-12 drop-shadow-lg" alt="" />
                <div class="w-full h-full rounded-full border-[3px] border-pink-300/60 overflow-hidden"
                     style={{ "box-shadow": "0 0 15px rgba(255,102,196,0.5), 0 0 30px rgba(188,19,254,0.2), inset 0 0 8px rgba(0,0,0,0.3)" }}>
                  <img src={picUrl()} alt={name()} class="w-full h-full object-cover" />
                </div>

                {/* Candles */}
                <div class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                  <For each={[1,2,3,4,5]}>
                    {() => (
                      <div class="w-1 h-4 bg-gradient-to-b from-white to-pink-300 rounded-sm relative shadow-md">
                        <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2.5 bg-orange-400 rounded-full blur-[1px] animate-pulse"></div>
                        <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-yellow-200 rounded-full"></div>
                      </div>
                    )}
                  </For>
                </div>
              </div>

              {/* Card Title - using Great Vibes handwriting font */}
              <h1 class="text-3xl font-normal mb-1 leading-tight text-white drop-shadow-md text-glow"
                  style={{ "font-family": "'Great Vibes', cursive", "text-shadow": "0 0 15px rgba(255,102,196,0.5)" }}>
                <For each={hbdLetters()}>
                  {(letter) => (
                    <span
                      class={letter.char === ' ' ? 'letter-space' : 'letter-block'}
                    >
                      {letter.char === ' ' ? '\u00A0' : letter.char}
                    </span>
                  )}
                </For>
              </h1>

              {/* Name - using Great Vibes handwriting font */}
              <h2 class="text-2xl font-normal mb-0.5"
                  style={{ "font-family": "'Great Vibes', cursive" }}>
                <For each={nameLetters()}>
                  {(letter) => (
                    <span
                      class={letter.char === ' ' ? 'letter-space' : 'letter-block letter-gradient'}
                    >
                      {letter.char === ' ' ? '\u00A0' : letter.char}
                    </span>
                  )}
                </For>
              </h2>

              {nickname() && (
                <p class="text-pink-200/80 text-[10px] font-semibold italic mb-2">
                  aka "{nickname()}"
                </p>
              )}

              {/* Confetti overlay */}
              <img src="/resources/img/confetti.svg"
                   class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0 rounded-2xl"
                   alt="" />

              {/* Message body */}
              <div class="flex-1 flex items-center overflow-y-auto px-2">
                <p class="text-blue-100/90 leading-relaxed text-[13px]"
                   style={{ "font-family": "'Patrick Hand', cursive" }}>
                  Wishing you a day filled with joy, sparkles, and infinite beauty! ✨🎂
                </p>
              </div>

              {/* Footer metadata */}
              <div class="w-full mt-2 pt-2 border-t border-white/10">
                <div class="flex justify-between items-end text-[8px] text-pink-200/50 font-mono">
                  <div class="text-left leading-tight">
                    <div>{cardMeta().series}</div>
                    <div>{cardMeta().edition}</div>
                  </div>
                  <div class="text-right leading-tight">
                    <div>Art: {cardMeta().artist}</div>
                    <div>© {cardMeta().year} Hadacard</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Visual Novel Final Card Text & Button Overlays */}
      <Show when={props.isFinalCard}>
        {/* Shifting description text bubble using PretextShift and Great Vibes/Patrick Hand */}
        <div class="aero-glass rounded-3xl p-3 text-white w-full border-white/20 shadow-lg text-center select-none max-w-md shrink-0">
          <h3 
            class="text-2xl font-extrabold text-[#00f3ff] leading-none mb-1 text-glow"
            style={{ "font-family": "'Great Vibes', cursive", "text-shadow": "0 0 10px rgba(0, 243, 255, 0.5)" }}
          >
            {hbdMessage()}
          </h3>
          <div class="flex justify-center w-full">
            <PretextShift 
              client:load 
              text="Wishing you a day filled with joy, sparkles, and infinite beauty! May your dreams glow and your heart beat with happiness! ✨🎂" 
              font="13px 'Patrick Hand'" 
              lineHeight={18} 
              class="text-center text-blue-100/95 leading-relaxed font-medium justify-center items-center flex" 
            />
          </div>
        </div>

        {/* Claim Buttons */}
        <div class="flex gap-4 w-full justify-center px-4 shrink-0" style={{ "font-family": "'Comfortaa', sans-serif" }}>
          <button 
            onPointerDown={() => haptic.trigger('success')}
            class="aero-btn text-xs tracking-wider select-none cursor-pointer px-5 py-2.5" 
            onClick={() => {
              const audio = new Audio('/resources/sfx/bubble.wav');
              audio.volume = 0.5;
              audio.play().catch(() => {});
              alert("🎉 The Party Never Ends! Wishing you the best day, Janell! 🎉");
            }}
          >
            Enjoy Day! 🎉
          </button>
          <Show when={props.egift}>
            <button 
              onPointerDown={() => haptic.trigger('heavy')}
              class="aero-btn text-xs tracking-wider select-none cursor-pointer px-5 py-2.5" 
              onClick={() => {
                const audio = new Audio('/resources/sfx/bubble.wav');
                audio.volume = 0.5;
                audio.play().catch(() => {});
                setShowVoucher(true);
              }}
            >
              🎁 Claim e-Gift!
            </button>
          </Show>
        </div>

        {/* Floating background decorations */}
        <img src="/resources/img/balloon-left.png"
             class="absolute bottom-0 left-0 w-16 h-auto animate-float opacity-70 pointer-events-none z-0"
             style={{ "animation-delay": "0.5s" }} alt="" />
        <img src="/resources/img/balloon-right.png"
             class="absolute bottom-10 right-0 w-16 h-auto animate-float opacity-70 pointer-events-none z-0"
             style={{ "animation-delay": "1.5s" }} alt="" />
        <img src="/resources/img/flag-left.png"
             class="absolute top-0 left-0 w-24 h-auto opacity-50 pointer-events-none z-0" alt="" />
        <img src="/resources/img/flag-right.png"
             class="absolute top-0 right-0 w-24 h-auto opacity-50 pointer-events-none z-0" alt="" />
      </Show>

      {/* ─── e-Gift Voucher Modal Overlay ─── */}
      <Show when={showVoucher()}>
        <div class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
          {/* Front/Back flipping ticket Container */}
          <div 
            class="relative w-full max-w-[340px] aspect-[1.6/1] cursor-pointer perspective-1000 mb-6 select-none" 
            onPointerDown={() => {
              haptic.trigger('medium');
              setIsFlipped(!isFlipped());
            }}
          >
            <div class={`w-full h-full relative transition-transform duration-700 transform-style-3d ${isFlipped() ? 'rotate-y-180' : ''}`}>
              
              {/* FRONT Side */}
              <div class="absolute inset-0 w-full h-full rounded-2xl p-5 flex flex-col justify-between backface-hidden bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 border-2 border-yellow-200/50 shadow-[0_0_25px_rgba(245,158,11,0.5)] text-amber-950">
                <div class="absolute top-[8%] left-[10%] w-[80%] h-[35%] rounded-full bg-gradient-to-b from-white/60 to-transparent -rotate-12 pointer-events-none"></div>
                
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-xl font-black tracking-wider uppercase leading-none font-sans" style={{ "font-family": "'Comfortaa', sans-serif" }}>GOLDEN TICKET</h3>
                    <span class="text-[9px] font-bold tracking-widest uppercase opacity-70">Janell's Bday Pass</span>
                  </div>
                  <span class="text-3xl">🎟️</span>
                </div>

                <div class="my-auto">
                  <span class="text-[9px] font-bold block uppercase opacity-80">CLAIMABLE VALUE</span>
                  <span class="text-3xl font-extrabold tracking-tight">{props.egift?.value || "$100"}</span>
                </div>

                <div class="flex justify-between items-end border-t border-amber-950/20 pt-2 text-[9px] font-mono">
                  <div>
                    <span class="block opacity-65">MERCHANT</span>
                    <span class="font-bold">{props.egift?.merchant || "Spa Day & Coffee"}</span>
                  </div>
                  <div class="text-right font-bold italic animate-pulse text-amber-900">
                    Tap to Flip 🔄
                  </div>
                </div>
              </div>

              {/* BACK Side */}
              <div class="absolute inset-0 w-full h-full rounded-2xl p-5 flex flex-col justify-between backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-2 border-pink-400/50 shadow-[0_0_25px_rgba(244,63,94,0.5)] text-white">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-base font-bold tracking-wide leading-none text-aero-cyan" style={{ "font-family": "'Comfortaa', sans-serif" }}>VOUCHER CODE</h3>
                    <span class="text-[7px] font-mono text-pink-300">SCANNABLE OR ONLINE REDEMPTION</span>
                  </div>
                  <span class="text-2xl text-pink-300">✨</span>
                </div>

                <div class="my-auto text-center py-1.5 px-3 bg-black/40 rounded-lg border border-white/10">
                  <span class="text-lg font-mono font-extrabold tracking-wider text-aero-cyan" style={{ "text-shadow": "0 0 10px rgba(0,243,255,0.6)" }}>
                    {props.egift?.code || "CLAIM-CODE-ERROR"}
                  </span>
                </div>

                <p class="text-[8px] text-blue-100/90 leading-tight my-1 text-center font-mono">
                  {props.egift?.instructions || "Show code to merchant."}
                </p>

                <div class="flex flex-col items-center gap-1 border-t border-white/10 pt-2">
                  <div class="h-5 w-full max-w-[180px] bg-white rounded-sm p-0.5 flex justify-between gap-[1px]">
                    <For each={[1,3,1,2,4,1,3,2,1,4,2,3,1,1,2,4,2,1,3]}>
                      {(width) => (
                        <div class="h-full bg-black" style={{ width: `${width}px` }}></div>
                      )}
                    </For>
                  </div>
                  <span class="text-[7px] font-mono text-white/50">🔄 Tap to Flip Back</span>
                </div>
              </div>

            </div>
          </div>

          <button 
            onPointerDown={() => haptic.trigger('light')}
            class="aero-btn text-[10px] px-6 py-2 bg-gradient-to-r from-aero-pink to-aero-cyan hover:scale-105 select-none cursor-pointer" 
            style={{ "font-family": "'Comfortaa', sans-serif" }}
            onClick={() => setShowVoucher(false)}
          >
            Close Voucher
          </button>
        </div>
      </Show>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
