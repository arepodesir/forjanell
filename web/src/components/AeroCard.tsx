import { createSignal, onMount, onCleanup, Show, For } from 'solid-js';

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
    <div class="absolute inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Scroll Message Phase */}
      <Show when={showScroll()}>
        <div class="relative w-full max-w-lg h-[70vh] overflow-hidden aero-glass rounded-3xl p-8">
          <div
            class="absolute bottom-0 w-full animate-move-up pr-12"
            style={{ "animation-duration": `${readTimeSecs()}s` }}
          >
            <p class="text-xl font-bold text-white drop-shadow-md text-center leading-relaxed"
               style={{ "font-family": "'Outfit', sans-serif" }}>
              {props.scrollMsg}
            </p>
          </div>
        </div>
      </Show>

      {/* Final Holographic Birthday Card */}
      <Show when={showCard()}>
        <div class="w-full max-w-[460px] flex flex-col items-center animate-reveal-up">
          <div
            class="holo-card"
            ref={cardRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            style={cardStyles()}
          >
            <div class="holo-card__inner">
              {/* ─── Background Image ──────── */}
              <div class="absolute inset-0 bg-cover bg-center opacity-25 rounded-2xl"
                   style={{ "background-image": "url(/resources/img/nature.jpg)" }}>
              </div>
              <div class="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-pink-900/50 to-indigo-900/80 rounded-2xl"></div>

              {/* ─── Holographic Layers (from pokecards) ─── */}
              <div class="holo-card__glitter"></div>
              <div class="holo-card__shine"></div>
              <div class="holo-card__glare"></div>

              {/* ─── Card Content ──────────── */}
              <div class="relative z-10 flex flex-col items-center text-center p-5 h-full">
                {/* Top metadata bar */}
                <div class="w-full flex justify-between items-start mb-3 text-[11px] text-pink-200/70 font-mono">
                  <span>{props.cardMeta.id}</span>
                  <span>{props.cardMeta.rarity}</span>
                </div>

                {/* Profile picture with cap */}
                <div class="relative w-28 h-28 mb-3 animate-float z-10 shrink-0">
                  <img src="/resources/img/bday-cap.svg"
                       class="absolute -top-5 -right-3 w-11 h-11 z-20 rotate-12 drop-shadow-lg" alt="" />
                  <div class="w-full h-full rounded-full border-[3px] border-pink-300/60 overflow-hidden"
                       style={{ "box-shadow": "0 0 20px rgba(255,102,196,0.5), 0 0 40px rgba(188,19,254,0.2), inset 0 0 10px rgba(0,0,0,0.3)" }}>
                    <img src={props.picUrl} alt={props.name} class="w-full h-full object-cover" />
                  </div>

                  {/* Candles */}
                  <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                    <For each={[1,2,3,4,5]}>
                      {() => (
                        <div class="w-1.5 h-5 bg-gradient-to-b from-white to-pink-300 rounded-sm relative shadow-md">
                          <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 w-2.5 h-3 bg-orange-400 rounded-full blur-[1px] animate-pulse"></div>
                          <div class="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1 h-1.5 bg-yellow-200 rounded-full"></div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>

                {/* HBD Text — letter-block animated (Pretext-inspired) */}
                <h1 class="text-3xl font-extrabold mb-1 leading-tight text-white"
                    style={{ "font-family": "'Outfit', sans-serif", "text-shadow": "0 0 20px rgba(255,102,196,0.5)" }}>
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
                <h2 class="text-2xl font-bold mb-1"
                    style={{ "font-family": "'Outfit', sans-serif" }}>
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
                  <p class="text-pink-200/80 text-xs font-semibold italic mb-3">
                    aka "{props.nickname}"
                  </p>
                )}

                {/* Confetti overlay */}
                <img src="/resources/img/confetti.svg"
                     class="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none z-0 rounded-2xl"
                     alt="" />

                {/* Message body */}
                <div class="flex-1 flex items-center overflow-y-auto px-2">
                  <p class="text-blue-100/90 leading-relaxed text-sm"
                     style={{ "font-family": "'Inter', sans-serif" }}>
                    Wishing you a day filled with joy, sparkles, and infinite beauty! ✨🎂
                  </p>
                </div>

                {/* Bottom metadata bar (envelope style) */}
                <div class="w-full mt-3 pt-2 border-t border-white/10">
                  <div class="flex justify-between items-end text-[9px] text-pink-200/50 font-mono">
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

          {/* Enjoy button below the card */}
          <button class="aero-btn mt-5 text-sm tracking-wider" onClick={() => alert("🎉 The Party Never Ends! 🎉")}>
            Enjoy your Day! 🎉
          </button>
        </div>
      </Show>

      {/* Balloons — only show with final card */}
      <Show when={showCard()}>
        <img src="/resources/img/balloon-left.png"
             class="absolute bottom-0 left-0 w-20 h-auto animate-float opacity-70 pointer-events-none"
             style={{ "animation-delay": "0.5s" }} alt="" />
        <img src="/resources/img/balloon-right.png"
             class="absolute bottom-10 right-0 w-20 h-auto animate-float opacity-70 pointer-events-none"
             style={{ "animation-delay": "1.5s" }} alt="" />
        {/* Flags — only show with final card */}
        <img src="/resources/img/flag-left.png"
             class="absolute top-0 left-0 w-28 h-auto opacity-50 pointer-events-none" alt="" />
        <img src="/resources/img/flag-right.png"
             class="absolute top-0 right-0 w-28 h-auto opacity-50 pointer-events-none" alt="" />
      </Show>
    </div>
  );
}
