import { createSignal, onMount, onCleanup, Show, For } from '@/utils/ui';
import { haptic } from '@/utils/haptics';
import type { HadacardProps, CardMeta } from '@/types';
import { splitToLetterBlocks } from '@/utils/letters';

export default function Hadacard(props: HadacardProps) {
  // Holographic interaction state (the living letter)
  const [pointerX, setPointerX] = createSignal(50);
  const [pointerY, setPointerY] = createSignal(50);
  const [cardOpacity, setCardOpacity] = createSignal(0.4);
  const [isInteracting, setIsInteracting] = createSignal(false);

  // Open mode (new in refactor-hadacard.2): wide smooth pretty letter unfold.
  // Controlled via prop or internal (default open so existing usage is unchanged).
  const controlledOpen = () => props.open;
  const [uncontrolledOpen, setUncontrolledOpen] = createSignal(true);
  const isOpen = () => (controlledOpen() !== undefined ? Boolean(controlledOpen()) : uncontrolledOpen());
  const setOpen = (next: boolean) => {
    if (controlledOpen() === undefined) {
      setUncontrolledOpen(next);
    }
    props.onOpenChange?.(next);
    if (next) haptic.trigger('success');
  };
  const toggleOpen = () => setOpen(!isOpen());

  // Landscape mode (hadacard-landscape-arrow): special glassy arrow button expands the open letter
  // into a wider "sheet" and reveals cool new features (scrollMsg banner + P.S. dedication).
  // Only meaningful when open; controlled/uncontrolled like the open mode.
  const controlledLandscape = () => props.landscape;
  const [uncontrolledLandscape, setUncontrolledLandscape] = createSignal(false);
  const isLandscape = () => (controlledLandscape() !== undefined ? Boolean(controlledLandscape()) : uncontrolledLandscape());
  const setLandscape = (next: boolean) => {
    if (controlledLandscape() === undefined) {
      setUncontrolledLandscape(next);
    }
    props.onLandscapeChange?.(next);
    haptic.trigger(next ? 'success' : 'light');
  };
  const toggleLandscape = () => setLandscape(!isLandscape());
  
  let cardRef: HTMLDivElement | undefined;
  let autoShimmerRaf: number | undefined;

  // Resolve properties with defaults (affectionate, in-project)
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
  const scrollMsg = () => props.scrollMsg || "Every star still pauses when you smile.";

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
    <div class="w-full h-full backdrop-blur-sm opacity-80 flex flex-col items-center justify-center gap-3">
      {/* 3D Holographic Card Viewport (No outer box container, perfectly centered) */}
      <div class="w-full flex items-center justify-center shrink-0">
        <div
          class={`holo-card cursor-grab active:cursor-grabbing select-none transition-all duration-300 ${isOpen() ? 'holo-card--open' : 'holo-card--closed'} ${isLandscape() ? 'holo-card--landscape' : ''}`}
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={() => { if (!isOpen()) toggleOpen(); }}
          style={`${cardStyles()}; touch-action: none;`}
        >
          <div class="holo-card__inner">
            {/* Background Texture */}
            <div class="absolute inset-0 bg-cover bg-center opacity-25 rounded-2xl"
                 style={{ "background-image": "url(/resources/img/jaja.png)" }}>
            </div>
            <div class="absolute inset-0 bg-gradient-to-b opacity-50 from-blue-900/70 via-pink-900/50 to-indigo-900/80 rounded-2xl"></div>

            {/* Holographic foil overlays */}
            <div class="holo-card__glitter"></div>
            <div class="holo-card__shine"></div>
            <div class="holo-card__glare"></div>

            {/* Content layout inside the card (open mode: wide smooth pretty letter; closed: elegant sealed front) */}
            <div class="relative z-10 flex flex-col items-center text-center p-4 h-full">
              {!isOpen() ? (
                /* Closed face — pretty sealed letter invitation, still fully holographic */
                <div class="flex flex-col items-center justify-center h-full py-2">
                  <div class="text-[9px] text-pink-200/50 font-mono tracking-[1px] mb-1">{cardMeta().id}</div>

                  {/* Smaller profile peek for closed state */}
                  <div class="relative w-16 h-16 mb-2 animate-float z-10 shrink-0">
                    <img src="/resources/img/bday-cap.svg"
                         class="absolute -top-3 -right-1.5 w-7 h-7 z-20 rotate-12 drop-shadow" alt="" />
                    <div class="w-full h-full rounded-full border-[2px] border-pink-300/50 overflow-hidden"
                         style={{ "box-shadow": "0 0 10px rgba(255,102,196,0.35), inset 0 0 6px rgba(0,0,0,0.25)" }}>
                      <img src={picUrl()} alt={name()} class="w-full h-full object-cover" />
                    </div>
                  </div>

                  <h2 class="text-2xl font-normal leading-none text-white drop-shadow"
                      style={{ "font-family": "'Great Vibes', cursive", "text-shadow": "0 0 12px rgba(255,102,196,0.45)" }}>
                    {name()}
                  </h2>
                  {nickname() && (
                    <p class="text-pink-200/60 text-[9px] italic mt-0.5">aka {nickname()}</p>
                  )}

                  <div class="mt-3 text-[10px] text-pink-200/70 tracking-wider font-semibold">TAP TO OPEN</div>
                  <div class="text-[11px] mt-0.5">✉︎</div>
                </div>
              ) : (
                /* Open — the full wide, breathing, personal letter (centerpiece) */
                <>
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

                  {/* Landscape-only cool new features (hadacard-landscape-arrow).
                      These arrive only when the glassy arrow has transitioned the letter wide — the "extra page"
                      that feels discovered, not bolted on. scrollMsg (previously unused) + a short P.S. dedication. */}
                  {isLandscape() && (
                    <>
                      {/* Flowing wide scrollMsg banner — the wish carried on the open sheet */}
                      <div class="w-full mb-1 text-[12px] md:text-[14px] text-pink-200/85 tracking-[0.5px] italic"
                           style={{ "font-family": "'Patrick Hand', cursive" }}>
                        <For each={splitToLetterBlocks(scrollMsg(), 22)}>
                          {(letter) => (
                            <span class={letter.char === ' ' ? 'letter-space' : 'letter-block'}>
                              {letter.char === ' ' ? '\u00A0' : letter.char}
                            </span>
                          )}
                        </For>
                      </div>

                      {/* P.S. dedication — the private extra paragraph that only appears in the wide view */}
                      <div class="w-full text-[11px] md:text-[12px] text-pink-200/75 italic mb-1 px-1">
                        P.S. I would choose this lifetime again if it meant one more moment with you.
                      </div>
                    </>
                  )}

                  {/* Confetti overlay */}
                  <img src="/resources/img/confetti.svg"
                       class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0 rounded-2xl"
                       alt="" />

                  {/* Message body — flowing personal letter feel (wide + breathing for centerpiece) */}
                  <div class="flex-1 flex items-center overflow-y-auto px-3 py-1">
                    <p class="text-blue-100/95 leading-relaxed text-[26px] md:text-[30px] italic"
                       style={{ "font-family": "'Patrick Hand', cursive" }}>
                      {hbdMessage() || "Wishing you a day filled with joy, sparkles, and infinite beauty."}
                    </p>
                  </div>

                  {/* Personal sign-off (letter profile, not trading card) */}
                  <div class="w-full mt-1 pt-2 border-t border-white/10 text-[10px] text-pink-200/60 font-mono flex justify-between items-center">
                    <div>— with love, always</div>
                    <div class="text-right">{cardMeta().artist} · {cardMeta().year}</div>
                  </div>

                  {/* Special glassy arrow button (hadacard-landscape-arrow) — only in open state.
                      Matches the card: aero-glass + holo palette, big elegant arrow, perfect touch target.
                      Toggles landscape "wide letter sheet" + reveals the cool new features below. */}
                  <button
                    class="absolute bottom-2 right-2 z-30 aero-glass rounded-full w-9 h-9 flex items-center justify-center text-xl leading-none text-aero-cyan border border-white/20 shadow-md active:scale-90 transition-all hover:border-aero-pink/50 select-none"
                    onClick={(e) => { e.stopPropagation(); toggleLandscape(); }}
                    aria-label={isLandscape() ? "Return to portrait letter view" : "Expand letter to landscape view"}
                  >
                    {isLandscape() ? '⟵' : '⟶'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* letter-leaning holographic card (profile > trading card) */
        /* open mode polish (refactor-hadacard.2): wide breathing + smooth unfold feel */
        .holo-card--closed {
          --card-aspect: 0.72;
          cursor: pointer;
        }
        .holo-card--open {
          /* "open up wide" — the letter breathes; parent container still controls outer bounds */
        }
        .holo-card--closed .holo-card__inner,
        .holo-card--open .holo-card__inner {
          transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        /* subtle lift + presence when opening */
        .holo-card--open {
          filter: saturate(1.05);
        }

        /* Landscape (hadacard-landscape-arrow): the letter "unfolds" into a generous wide sheet.
           Smooth aspect transition + the new banner/P.S. feel like discovered pages. */
        .holo-card--landscape {
          --card-aspect: 1.62;
        }
        .holo-card--landscape .holo-card__inner {
          transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 320ms ease;
        }
        /* A touch more presence + the new elements breathe with the wider format */
        .holo-card--landscape {
          filter: saturate(1.08);
        }
        /* The glassy arrow is already styled inline to feel native; these rules just ensure it participates */
        .holo-card--landscape .aero-glass {
          border-color: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </div>
  );
}
