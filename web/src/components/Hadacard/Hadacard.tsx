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
  let videoRef: HTMLVideoElement | undefined;

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

  const ensureVideoPlays = () => {
    if (videoRef && videoBg()) {
      videoRef.play().catch(() => {});
    }
  };

  onMount(() => {
    startAutoShimmer();
    // Make video on the card play automatically (muted + playsinline + force).
    // Browser policies often require this even with autoplay attr.
    if (videoBg()) {
      // slight delay helps on some mobile/strict policies
      setTimeout(ensureVideoPlays, 50);
      setTimeout(ensureVideoPlays, 280);
    }
  });

  onCleanup(() => {
    stopAutoShimmer();
  });

  const cardStyles = () => `
    --pointer-x: ${pointerX()}%;
    --pointer-y: ${pointerY()}%;
    --card-opacity: ${cardOpacity()};
    --rotate-x: ${((pointerX() - 50) / 50) * 20}deg;
    --rotate-y: ${((pointerY() - 50) / 50) * -20}deg;
  `;

  return (
    <div class={`w-full h-full flex flex-col items-center justify-center gap-3 ${videoBg() ? '' : 'backdrop-blur-sm opacity-80'}`}>
      {/* 3D Holographic Card Viewport (No outer box container, perfectly centered).
          In video gift mode the card surface itself is large (fills most of the window) and the video lives *inside* it as the card's background. */}
      <div class="w-full flex items-center justify-center shrink-0">
        <div
          class={`holo-card cursor-grab active:cursor-grabbing select-none transition-all duration-300 ${getHadacardStateClasses()}`}
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={() => { if (!isOpen()) toggleOpen(); ensureVideoPlays(); }}
          style={`${cardStyles()}; touch-action: none;`}
        >
          <div class="holo-card__inner">
            {/* Video background lives on the card (inside the holo surface) for gift mode.
                Full cover of the (now large) card, holo layers + letter content sit on top of it. */}
            {videoBg() && (
              <video
                ref={(el) => { videoRef = el || undefined; }}
                src={videoBg()}
                class="absolute inset-0 w-full h-full object-cover z-[-1] pointer-events-none"
                autoplay
                loop
                muted
                playsinline
              />
            )}
            {!videoBg() && (
              <div class="absolute inset-0 bg-cover bg-center opacity-25 rounded-2xl"
                   style={{ "background-image": "url(/assets/img/jaja.png)" }}>
              </div>
            )}
            <div class="absolute inset-0 bg-gradient-to-b opacity-40 from-blue-900/60 via-pink-900/40 to-indigo-900/70 rounded-2xl z-5"></div>

            {/* Holographic foil overlays - on top of video bg (or fallback) */}
            <div class="holo-card__glitter z-10"></div>
            <div class="holo-card__shine z-10"></div>
            <div class="holo-card__glare z-10"></div>

            {/* Content layout inside the card (open mode: wide smooth pretty letter; closed: elegant sealed front) */}
            <div class="relative z-20 flex flex-col items-center text-center p-4 h-full">
              {!isOpen() ? (
                /* Closed face — pretty sealed letter invitation, still fully holographic.
                   Clean top (no random trading-card meta) — meaningful minimal signifier only. */
                <div class="flex flex-col items-center justify-start h-full pt-5 pb-2">
                  <div class="text-[9px] text-pink-200/55 tracking-wider mb-0.5" style={{ "font-family": "'Patrick Hand', cursive" }}>2026</div>

                  {/* Smaller profile peek for closed state — centered + moved down for better visual balance on the card face */}
                  <div class="relative w-20 h-20 mt-2 mb-2 animate-float z-10 shrink-0">
                    <img src="/assets/img/bday-cap.svg"
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
                    <img src="/assets/img/bday-cap.svg"
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

                    {/* Floating confetti asset above profile image - decorative, now inside relative profile for reliable 'above' positioning */}
                    <img 
                      src={confettiImage()} 
                      class="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 object-contain opacity-70 pointer-events-none z-40 hadacard-confetti-anim"
                      alt="" 
                    />
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

                  {/* Special glassy arrow/heart button (hadacard-invert-letter + landscape + this job).
                      Moved to center for easy access. Different icon: letter heart (💌 opens more / ♡ collapses).
                      "Easier to rotate": button no longer hugs the right edge (frees space for pointer tilt); we also bumped the 3D rotate range.
                      Still strictly only after the letter is open ("has to be open"). */}
                  <button
                    class="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 aero-glass rounded-full w-10 h-10 flex items-center justify-center text-xl leading-none text-aero-cyan border border-white/25 shadow-md active:scale-90 transition-all hover:border-aero-pink/60 hover:scale-105 select-none"
                    onClick={(e) => { e.stopPropagation(); toggleLandscape(); ensureVideoPlays(); }}
                    aria-label={isLandscape() ? "Return to portrait letter view" : "Expand letter to landscape view"}
                    onPointerDown={ensureVideoPlays}
                  >
                    {isLandscape() ? '♡' : '💌'}
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

        /* Video gift mode: video lives *inside* the card (as the card's own background).
           The .holo-card surface is intentionally large (fills most of the window) so the video + holo + letter elements feel immersive.
           Inner has no border so video reaches the card edges; holo layers + content overlay the video. */
        .hadacard-with-video .holo-card {
          width: 94vw;
          height: 78vh;
          max-width: none;
          aspect-ratio: unset;
          border-radius: 18px;
        }
        .hadacard-with-video .holo-card__inner {
          background: transparent;
          border: none;
          box-shadow: none;
          border-radius: 18px;
          overflow: hidden; /* keep video contained to card shape */
        }
        .hadacard-with-video video {
          filter: saturate(0.9) contrast(1.08);
        }

        /* Confetti decoration above profile - a bit stronger on the video card */
        .hadacard-with-video .hadacard-confetti-anim {
          width: 4.75rem;
          height: 4.75rem;
          top: -1.1rem;
          opacity: 0.82;
        }

        /* Nice animation for confetti image above center (subtle drift + sparkle) */
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
