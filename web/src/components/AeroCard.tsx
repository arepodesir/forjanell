import { createSignal, onMount, onCleanup, Show, For } from 'solid-js';
import { haptic } from '../utils/haptics';

type CardMeta = {
  edition: string;
  series: string;
  id: string;
  rarity: string;
  year: string;
  artist: string;
};

type AeroCardProps = {
  name: string;
  nickname: string;
  picUrl: string;
  scrollMsg: string;
  hbdMessage: string;
  cardMeta: CardMeta;
  egift?: {
    title: string;
    value: string;
    merchant: string;
    code: string;
    instructions: string;
  };
};

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

export default function AeroCard(props: AeroCardProps) {
  const [showScroll, setShowScroll] = createSignal(!!props.scrollMsg);
  const [showCard, setShowCard] = createSignal(!props.scrollMsg);
  const [readTimeSecs, setReadTimeSecs] = createSignal(12);
  const [showVoucher, setShowVoucher] = createSignal(false);
  const [isFlipped, setIsFlipped] = createSignal(false);

  // Holographic interaction state
  const [pointerX, setPointerX] = createSignal(50);
  const [pointerY, setPointerY] = createSignal(50);
  const [cardOpacity, setCardOpacity] = createSignal(0);
  const [isInteracting, setIsInteracting] = createSignal(false);
  let cardRef: HTMLDivElement | undefined;
  let autoShimmerRaf: number | undefined;

  // Split the HBD message into letter blocks for the animation
  const hbdLetters = () => splitToLetterBlocks(props.hbdMessage, 50);
  const nameLetters = () => splitToLetterBlocks(props.name, 40);

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
    setCardOpacity(0.4);
    startAutoShimmer();
  };

  const startAutoShimmer = () => {
    stopAutoShimmer();
    let t = 0;
    const tick = () => {
      t += 0.006;
      setPointerX(50 + Math.sin(t) * 35);
      setPointerY(50 + Math.cos(t * 0.7) * 35);
      setCardOpacity(0.4);
      autoShimmerRaf = requestAnimationFrame(tick);
    };
    autoShimmerRaf = requestAnimationFrame(tick);
  };

  onMount(() => {
    if (props.scrollMsg) {
      const words = props.scrollMsg.split(' ').length;
      const time = Math.max(10, Math.ceil(words / 3));
      setReadTimeSecs(time);

      setTimeout(() => {
        setShowScroll(false);
        setShowCard(true);
        startAutoShimmer();
      }, time * 1000);
    } else {
      startAutoShimmer();
    }
  });

  onCleanup(() => {
    stopAutoShimmer();
  });

  const cardStyles = () => `
    --pointer-x: ${pointerX()}%;
    --pointer-y: ${pointerY()}%;
    --card-opacity: ${cardOpacity()};
    --rotate-x: ${((pointerX() - 50) / 50) * 6}deg;
    --rotate-y: ${((pointerY() - 50) / 50) * -6}deg;
  `;

  return (
    <div class="absolute inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ "font-family": "'Patrick Hand', cursive" }}>
      {/* Scroll Message Phase */}
      <Show when={showScroll()}>
        <div class="relative w-full max-w-lg h-[65vh] overflow-hidden aero-glass rounded-3xl p-6">
          <div
            class="absolute bottom-0 w-full animate-move-up pr-12"
            style={{ "animation-duration": `${readTimeSecs()}s` }}
          >
            <p class="text-xl font-bold text-white drop-shadow-md text-center leading-relaxed"
               style={{ "font-family": "'Patrick Hand', cursive" }}>
              {props.scrollMsg}
            </p>
          </div>
        </div>
      </Show>

      {/* Final Holographic Birthday Card */}
      <Show when={showCard()}>
        <div class="w-full max-w-[420px] flex flex-col items-center animate-reveal-up">
          <div
            class="holo-card cursor-grab active:cursor-grabbing"
            ref={cardRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            style={`${cardStyles()}; touch-action: none;`}
          >
            <div class="holo-card__inner">
              {/* ─── Background Image ──────── */}
              <div class="absolute inset-0 bg-cover bg-center opacity-25 rounded-2xl"
                   style={{ "background-image": "url(/resources/img/nature.jpg)" }}>
              </div>
              <div class="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-pink-900/50 to-indigo-900/80 rounded-2xl"></div>

              {/* ─── Holographic Layers ─── */}
              <div class="holo-card__glitter"></div>
              <div class="holo-card__shine"></div>
              <div class="holo-card__glare"></div>

              {/* ─── Card Content ──────────── */}
              <div class="relative z-10 flex flex-col items-center text-center p-4 h-full">
                {/* Top metadata bar */}
                <div class="w-full flex justify-between items-start mb-2 text-[10px] text-pink-200/70 font-mono">
                  <span>{props.cardMeta.id}</span>
                  <span>{props.cardMeta.rarity}</span>
                </div>

                {/* Profile picture with cap */}
                <div class="relative w-24 h-24 mb-3 animate-float z-10 shrink-0">
                  <img src="/resources/img/bday-cap.svg"
                       class="absolute -top-4 -right-2 w-9 h-9 z-20 rotate-12 drop-shadow-lg" alt="" />
                  <div class="w-full h-full rounded-full border-[3px] border-pink-300/60 overflow-hidden"
                       style={{ "box-shadow": "0 0 15px rgba(255,102,196,0.5), 0 0 30px rgba(188,19,254,0.2), inset 0 0 8px rgba(0,0,0,0.3)" }}>
                    <img src={props.picUrl} alt={props.name} class="w-full h-full object-cover" />
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

                {/* HBD Text — letter-block animated */}
                <h1 class="text-2xl font-extrabold mb-1 leading-tight text-white"
                    style={{ "font-family": "'Caveat', cursive", "text-shadow": "0 0 15px rgba(255,102,196,0.5)" }}>
                  <For each={hbdLetters()}>
                    {(letter) => (
                      <span
                        class={letter.char === ' ' ? 'letter-space' : 'letter-block'}
                        style={{ "animation-delay": `${letter.delay}ms` }}
                      >
                        {letter.char === ' ' ? '\u00A0' : letter.char}
                      </span>
                    )}
                  </For>
                </h1>

                {/* Name — letter-block animated with inline gradient */}
                <h2 class="text-xl font-bold mb-0.5"
                    style={{ "font-family": "'Caveat', cursive" }}>
                  <For each={nameLetters()}>
                    {(letter) => (
                      <span
                        class={letter.char === ' ' ? 'letter-space' : 'letter-block letter-gradient'}
                        style={{ "animation-delay": `${letter.delay + 800}ms` }}
                      >
                        {letter.char === ' ' ? '\u00A0' : letter.char}
                      </span>
                    )}
                  </For>
                </h2>

                {props.nickname && (
                  <p class="text-pink-200/80 text-[10px] font-semibold italic mb-2">
                    aka "{props.nickname}"
                  </p>
                )}

                {/* Confetti overlay */}
                <img src="/resources/img/confetti.svg"
                     class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0 rounded-2xl"
                     alt="" />

                {/* Message body */}
                <div class="flex-1 flex items-center overflow-y-auto px-2">
                  <p class="text-blue-100/90 leading-relaxed text-sm"
                     style={{ "font-family": "'Patrick Hand', cursive" }}>
                    Wishing you a day filled with joy, sparkles, and infinite beauty! ✨🎂
                  </p>
                </div>

                {/* Bottom metadata bar (envelope style) */}
                <div class="w-full mt-2 pt-2 border-t border-white/10">
                  <div class="flex justify-between items-end text-[8px] text-pink-200/50 font-mono">
                    <div class="text-left leading-tight">
                      <div>{props.cardMeta.series}</div>
                      <div>{props.cardMeta.edition}</div>
                    </div>
                    <div class="text-right leading-tight">
                      <div>Art: {props.cardMeta.artist}</div>
                      <div>© {props.cardMeta.year} Hadacard</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons below the card */}
          <div class="flex gap-4 w-full justify-center px-4" style={{ "font-family": "'Comfortaa', sans-serif" }}>
            <button 
              onPointerDown={() => haptic.trigger('success')}
              class="aero-btn mt-4 text-xs tracking-wider select-none cursor-pointer px-4 py-2.5" 
              onClick={() => alert("🎉 The Party Never Ends! 🎉")}
            >
              Enjoy Day! 🎉
            </button>
            <Show when={props.egift}>
              <button 
                onPointerDown={() => haptic.trigger('heavy')}
                class="aero-btn mt-4 text-xs tracking-wider select-none cursor-pointer px-4 py-2.5" 
                onClick={() => setShowVoucher(true)}
              >
                🎁 Claim e-Gift!
              </button>
            </Show>
          </div>
        </div>
      </Show>

      {/* ─── e-Gift Voucher Modal Overlay ─── */}
      <Show when={showVoucher()}>
        <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center p-4">
          
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
              <div class="absolute inset-0 w-full h-full rounded-2xl p-5 flex flex-col justify-between backface-hidden bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 border-2 border-yellow-200/50 shadow-[0_0_20px_rgba(245,158,11,0.4)] text-amber-950">
                {/* Gloss overlay */}
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
                  <div class="text-right font-bold italic animate-pulse">
                    Tap to Flip 🔄
                  </div>
                </div>
              </div>

              {/* BACK Side */}
              <div class="absolute inset-0 w-full h-full rounded-2xl p-5 flex flex-col justify-between backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-2 border-pink-400/50 shadow-[0_0_20px_rgba(244,63,94,0.4)] text-white">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-base font-bold tracking-wide leading-none text-aero-cyan" style={{ "font-family": "'Comfortaa', sans-serif" }}>VOUCHER CODE</h3>
                    <span class="text-[7px] font-mono text-pink-300">SCANNABLE OR ONLINE REDEMPTION</span>
                  </div>
                  <span class="text-2xl text-pink-300">✨</span>
                </div>

                {/* Claim Code with neon glow */}
                <div class="my-auto text-center py-1.5 px-3 bg-black/40 rounded-lg border border-white/10">
                  <span class="text-lg font-mono font-extrabold tracking-wider text-aero-cyan" style={{ "text-shadow": "0 0 10px rgba(0,243,255,0.6)" }}>
                    {props.egift?.code || "CLAIM-CODE-ERROR"}
                  </span>
                </div>

                {/* Instructions */}
                <p class="text-[8px] text-blue-100/90 leading-tight my-1 text-center">
                  {props.egift?.instructions || "Show code to merchant."}
                </p>

                {/* Mock Barcode */}
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

          {/* Close button */}
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

      {/* Balloons — only show with final card */}
      <Show when={showCard()}>
        <img src="/resources/img/balloon-left.png"
             class="absolute bottom-0 left-0 w-16 h-auto animate-float opacity-70 pointer-events-none"
             style={{ "animation-delay": "0.5s" }} alt="" />
        <img src="/resources/img/balloon-right.png"
             class="absolute bottom-10 right-0 w-16 h-auto animate-float opacity-70 pointer-events-none"
             style={{ "animation-delay": "1.5s" }} alt="" />
        {/* Flags — only show with final card */}
        <img src="/resources/img/flag-left.png"
             class="absolute top-0 left-0 w-24 h-auto opacity-50 pointer-events-none" alt="" />
        <img src="/resources/img/flag-right.png"
             class="absolute top-0 right-0 w-24 h-auto opacity-50 pointer-events-none" alt="" />
      </Show>
    </div>
  );
}
