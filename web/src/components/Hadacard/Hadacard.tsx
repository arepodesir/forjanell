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

  // Open mode (refactor-hadacard.2 + hadacard-invert-letter): wide smooth pretty letter unfold.
  // Inverted default (per this job): starts closed/sealed so the recipient must deliberately open the letter.
  // Controlled via prop or internal. Landscape button + its features still require isOpen() first ("has to be open").
  const controlledOpen = () => props.open;
  const [uncontrolledOpen, setUncontrolledOpen] = createSignal(false);
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
  const picUrl = () => props.picUrl || "/assets/img/janell.png";
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

  // Gift video background connection (horsey optimized from assets/video, janell center, confetti overlay)
  const videoBg = () => props.videoBg || '';
  const centerImage = () => props.centerImage || picUrl();
  const confettiImage = () => props.confettiImage || '/assets/img/Confetti.png';

  // State machine for Hadacard theme (preferred colocation with Tailwind-like generator + scoped styles)
  // States: closed (sealed letter), open (unfolded personal letter), landscape (wide sheet + extras), withVideo (gift video bg mode)
  const getHadacardStateClasses = () => {
    const states = [
      'holo-card',
      isOpen() ? 'holo-card--open' : 'holo-card--closed',
      isLandscape() ? 'holo-card--landscape' : '',
      videoBg() ? 'hadacard-with-video' : '',
    ];
    return states.filter(Boolean).join(' ');
  };

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
          class={`holo-card cursor-grab active:cursor-grabbing select-none transition-all duration-300 ${getHadacardStateClasses()}`}
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={() => { if (!isOpen()) toggleOpen(); }}
          style={`${cardStyles()}; touch-action: none;`}
        >
          <div class="holo-card__inner">
            {/* Video background for gift (horsey.optimized.webm connected via config/props to Hadacard) - full aspect, scales well, loops muted */}
            {videoBg() ? (
              <video
                src={videoBg()}
                class="absolute inset-0 w-full h-full object-cover rounded-2xl z-[-1] pointer-events-none"
                autoplay
                loop
                muted
                playsinline
              />
            ) : (
              /* Fallback background texture */
              <div class="absolute inset-0 bg-cover bg-center opacity-25 rounded-2xl"
                   style={{ "background-image": "url(/resources/img/jaja.png)" }}>
              </div>
            )}
            <div class="absolute inset-0 bg-gradient-to-b opacity-50 from-blue-900/70 via-pink-900/50 to-indigo-900/80 rounded-2xl z-5"></div>

            {/* Holographic foil overlays - on top of video bg */}
            <div class="holo-card__glitter z-10"></div>
            <div class="holo-card__shine z-10"></div>
            <div class="holo-card__glare z-10"></div>

            {/* Content layout inside the card (open mode: wide smooth pretty letter; closed: elegant sealed front) */}
            <div class="relative z-20 flex flex-col items-center text-center p-4 h-full">
              {!isOpen() ? (
                /* Closed face — pretty sealed letter invitation, still fully holographic.
                   Clean top (no random trading-card meta) — meaningful minimal signifier only. */
                <div class="flex flex-col items-center justify-center h-full py-2">
                  <div class="text-[9px] text-pink-200/55 tracking-wider mb-0.5" style={{ "font-family": "'Patrick Hand', cursive" }}>2026</div>

                  {/* Smaller profile peek for closed state */}
                  <div class="relative w-20 h-20 mb-2 animate-float z-10 shrink-0">
                    <img src="/resources/img/bday-cap.svg"
                         class="absolute -top-3 -right-1.5 w-7 h-7 z-20 rotate-12 drop-shadow" alt="" />
                    <div class="w-full h-full rounded-full border-[2px] border-pink-300/50 overflow-hidden"
                         style={{ "box-shadow": "0 0 10px rgba(255,102,196,0.35), inset 0 0 6px rgba(0,0,0,0.25)" }}>
                      <img src={centerImage()} alt={name()} class="w-full h-full object-cover" />
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
                /* Open — the full wide, breathing, personal letter (centerpiece).
                   More like a real letter now: meaningful top text (no random corner trading-card badges),
                   cleaner flow, primary body message, discovered extras only when widened. */
                <>
                  {/* Meaningful top signifier (replaces the previous random id/rarity corner text) */}
                  <div class="w-full text-[9px] text-pink-200/60 tracking-[1px] mb-1 text-right" style={{ "font-family": "'Patrick Hand', cursive" }}>
                    For Janell • 2026
                  </div>

                  {/* Profile picture with cap */}
                  <div class="relative w-28 h-28 mb-3 animate-float z-10 shrink-0">
                    <img src="/resources/img/bday-cap.svg"
                         class="absolute -top-4 -right-2 w-9 h-9 z-20 rotate-12 drop-shadow-lg" alt="" />
                    <div class="w-full h-full rounded-full border-[3px] border-pink-300/60 overflow-hidden"
                         style={{ "box-shadow": "0 0 15px rgba(255,102,196,0.5), 0 0 30px rgba(188,19,254,0.2), inset 0 0 8px rgba(0,0,0,0.3)" }}>
                      <img src={centerImage()} alt={name()} class="w-full h-full object-cover" />
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

                  {/* Confetti image above her profile - decorative fixed overlay with animation */}
                  <img 
                    src={confettiImage()} 
                    class="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 object-contain opacity-70 pointer-events-none z-30 hadacard-confetti-anim"
                    alt="" 
                  />

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

                  {/* Special glassy arrow button (hadacard-invert-letter + prior landscape work).
                      Larger, better positioned, and strictly only available once the card is open ("has to be open").
                      Integrated as an elegant right-side "unfold further" element with breathing room inside the letter.
                      Still matches the card (aero-glass + holo palette) but now more prominent and deliberate. */}
                  <button
                    class="absolute bottom-3 right-4 z-30 aero-glass rounded-full w-11 h-11 flex items-center justify-center text-2xl leading-none text-aero-cyan border border-white/25 shadow-md active:scale-90 transition-all hover:border-aero-pink/60 hover:scale-105 select-none"
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
        /* Colocated Hadacard styles (state machine preferred: closed/open/landscape/withVideo).
           All theme variants defined here for the component. Global holo base kept minimal. */
        .holo-card--closed {
          --card-aspect: 0.72;
          cursor: pointer;
        }
        .holo-card--open {
          /* "open up wide" — the letter breathes; parent container still controls outer bounds */
        }
        .holo-card--closed .holo-card__inner,
        .holo-card--open .holo-card__inner {
          /* Slower, more deliberate (hadacard-invert-letter): feels like carefully unfolding a real letter */
          transition: transform 720ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        /* subtle lift + presence when opening */
        .holo-card--open {
          filter: saturate(1.05);
        }

        /* Landscape (hadacard-invert-letter + prior): the letter "unfolds" into a generous wide sheet.
           Slower and more deliberate aspect transition + the new banner/P.S. feel like discovered pages. */
        .holo-card--landscape {
          --card-aspect: 1.62;
        }
        .holo-card--landscape .holo-card__inner {
          transition: transform 820ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 820ms ease;
        }
        /* A touch more presence + the new elements breathe with the wider format */
        .holo-card--landscape {
          filter: saturate(1.08);
        }
        /* The glassy arrow is already styled inline to feel native; these rules just ensure it participates */
        .holo-card--landscape .aero-glass {
          border-color: rgba(255, 255, 255, 0.25);
        }

        /* Video background state (gift horsey) - full aspect, scales, sits behind holo layers */
        .hadacard-with-video .holo-card__inner {
          background: transparent;
        }
        .hadacard-with-video video {
          filter: saturate(0.85) contrast(1.05);
        }

        /* Nice animation for fixed confetti image above center (subtle drift + sparkle) */
        .hadacard-confetti-anim {
          animation: confettiDrift 9s ease-in-out infinite, confettiSparkle 3.5s linear infinite;
          will-change: transform, opacity;
        }
        @keyframes confettiDrift {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
        }
        @keyframes confettiSparkle {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.18; }
        }

        /* More exciting particle field for Hadacard (colocated, on the holo surface when video/gift mode) */
        .hadacard-with-video .holo-card__glitter::after {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(255,102,196,0.12) 0%, transparent 60%);
          animation: particleField 4s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: screen;
        }
        @keyframes particleField {
          0%, 100% { opacity: 0.6; transform: translate(0, 0); }
          50% { opacity: 1; transform: translate(1px, -1px); }
        }
      `}</style>
    </div>
  );
}
