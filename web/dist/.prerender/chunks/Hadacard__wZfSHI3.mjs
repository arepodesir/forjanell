import { ssr, ssrHydrationKey, escape, ssrStyle, ssrAttribute, ssrStyleProperty, createComponent } from 'solid-js/web';
import { createSignal, onMount, onCleanup, For } from 'solid-js';

function splitToLetterBlocks(text, baseDelay = 30) {
  const letters = [];
  let idx = 0;
  for (const char of text) {
    letters.push({ char, delay: idx * baseDelay });
    idx++;
  }
  return letters;
}

var _tmpl$ = ["<div", ' class="w-full h-full backdrop-blur-sm opacity-80 flex flex-col items-center justify-center gap-3"><div class="w-full flex items-center justify-center shrink-0"><div class="', '" style="', '"><div class="holo-card__inner"><!--$-->', '<!--/--><div class="absolute inset-0 bg-gradient-to-b opacity-50 from-blue-900/70 via-pink-900/50 to-indigo-900/80 rounded-2xl z-10"></div><div class="holo-card__glitter"></div><div class="holo-card__shine"></div><div class="holo-card__glare"></div><div class="relative z-10 flex flex-col items-center text-center p-4 h-full">', `</div></div></div></div><style>
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
      </style></div>`], _tmpl$2 = ["<video", ' class="absolute inset-0 w-full h-full object-cover rounded-2xl z-0" autoplay loop muted playsinline style="', '"></video>'], _tmpl$3 = ["<div", ' class="absolute inset-0 bg-cover bg-center opacity-25 rounded-2xl" style="', '"></div>'], _tmpl$4 = ["<div", ' class="flex flex-col items-center justify-center h-full py-2"><div class="text-[9px] text-pink-200/55 tracking-wider mb-0.5" style="', '">2026</div><div class="relative w-16 h-16 mb-2 animate-float z-10 shrink-0"><img src="/resources/img/bday-cap.svg" class="absolute -top-3 -right-1.5 w-7 h-7 z-20 rotate-12 drop-shadow" alt><div class="w-full h-full rounded-full border-[2px] border-pink-300/50 overflow-hidden" style="', '"><img', ' class="w-full h-full object-cover"></div></div><h2 class="text-2xl font-normal leading-none text-white drop-shadow" style="', '">', "</h2><!--$-->", '<!--/--><div class="mt-3 text-[10px] text-pink-200/70 tracking-wider font-semibold">TAP TO OPEN</div><div class="text-[11px] mt-0.5">✉︎</div></div>'], _tmpl$5 = ["<p", ' class="text-pink-200/60 text-[9px] italic mt-0.5">aka <!--$-->', "<!--/--></p>"], _tmpl$6 = ["<div", ' class="w-full text-[9px] text-pink-200/60 tracking-[1px] mb-1 text-right" style="', '">For Janell • 2026</div>'], _tmpl$7 = ["<div", ' class="relative w-24 h-24 mb-3 animate-float z-10 shrink-0"><img src="/resources/img/bday-cap.svg" class="absolute -top-4 -right-2 w-9 h-9 z-20 rotate-12 drop-shadow-lg" alt><div class="w-full h-full rounded-full border-[3px] border-pink-300/60 overflow-hidden" style="', '"><img', ' class="w-full h-full object-cover"></div><div class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-20">', "</div></div>"], _tmpl$8 = ["<h1", ' class="text-3xl font-normal mb-1 leading-tight text-white drop-shadow-md text-glow" style="', '">', "</h1>"], _tmpl$9 = ["<h2", ' class="text-2xl font-normal mb-0.5" style="', '">', "</h2>"], _tmpl$0 = ["<img", ' class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0 rounded-2xl hadacard-confetti-anim" alt>'], _tmpl$1 = ["<div", ' class="flex-1 flex items-center overflow-y-auto px-3 py-1"><p class="text-blue-100/95 leading-relaxed text-[26px] md:text-[30px] italic" style="', '">', "</p></div>"], _tmpl$10 = ["<div", ' class="w-full mt-1 pt-2 border-t border-white/10 text-[10px] text-pink-200/60 font-mono flex justify-between items-center"><div>— with love, always</div><div class="text-right"><!--$-->', "<!--/--> · <!--$-->", "<!--/--></div></div>"], _tmpl$11 = ["<button", ' class="absolute bottom-3 right-4 z-30 aero-glass rounded-full w-11 h-11 flex items-center justify-center text-2xl leading-none text-aero-cyan border border-white/25 shadow-md active:scale-90 transition-all hover:border-aero-pink/60 hover:scale-105 select-none"', ">", "</button>"], _tmpl$12 = ["<div", ' class="w-1 h-4 bg-gradient-to-b from-white to-pink-300 rounded-sm relative shadow-md"><div class="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2.5 bg-orange-400 rounded-full blur-[1px] animate-pulse"></div><div class="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-yellow-200 rounded-full"></div></div>'], _tmpl$13 = ["<span", ">", "</span>"], _tmpl$14 = ["<p", ' class="text-pink-200/80 text-[10px] font-semibold italic mb-2">aka "<!--$-->', '<!--/-->"</p>'], _tmpl$15 = ["<div", ' class="w-full mb-1 text-[12px] md:text-[14px] text-pink-200/85 tracking-[0.5px] italic" style="', '">', "</div>"], _tmpl$16 = ["<div", ' class="w-full text-[11px] md:text-[12px] text-pink-200/75 italic mb-1 px-1">P.S. I would choose this lifetime again if it meant one more moment with you.</div>'];
function Hadacard(props) {
  const [pointerX, setPointerX] = createSignal(50);
  const [pointerY, setPointerY] = createSignal(50);
  const [cardOpacity, setCardOpacity] = createSignal(0.4);
  const [isInteracting, setIsInteracting] = createSignal(false);
  const controlledOpen = () => props.open;
  const [uncontrolledOpen, setUncontrolledOpen] = createSignal(false);
  const isOpen = () => controlledOpen() !== void 0 ? Boolean(controlledOpen()) : uncontrolledOpen();
  const controlledLandscape = () => props.landscape;
  const [uncontrolledLandscape, setUncontrolledLandscape] = createSignal(false);
  const isLandscape = () => controlledLandscape() !== void 0 ? Boolean(controlledLandscape()) : uncontrolledLandscape();
  let autoShimmerRaf;
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
  const videoBg = () => props.videoBg || "";
  const centerImage = () => props.centerImage || picUrl();
  const confettiImage = () => props.confettiImage || "/resources/img/Confetti.png";
  const getHadacardStateClasses = () => {
    const states = ["holo-card", isOpen() ? "holo-card--open" : "holo-card--closed", isLandscape() ? "holo-card--landscape" : "", videoBg() ? "hadacard-with-video" : ""];
    return states.filter(Boolean).join(" ");
  };
  const stopAutoShimmer = () => {
    if (autoShimmerRaf) {
      cancelAnimationFrame(autoShimmerRaf);
      autoShimmerRaf = void 0;
    }
  };
  const startAutoShimmer = () => {
    stopAutoShimmer();
    let t = 0;
    const tick = () => {
      t += 6e-3;
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
    --rotate-x: ${(pointerX() - 50) / 50 * 14}deg;
    --rotate-y: ${(pointerY() - 50) / 50 * -14}deg;
  `;
  return ssr(_tmpl$, ssrHydrationKey(), `holo-card cursor-grab active:cursor-grabbing select-none transition-all duration-300 ${escape(getHadacardStateClasses(), true)}`, ssrStyle(`${cardStyles()}; touch-action: none;`), videoBg() ? ssr(_tmpl$2, ssrHydrationKey() + ssrAttribute("src", escape(videoBg(), true), false), ssrStyleProperty("object-fit:", "cover")) : (
    /* Fallback background texture */
    ssr(_tmpl$3, ssrHydrationKey(), ssrStyleProperty("background-image:", "url(/resources/img/jaja.png)"))
  ), !isOpen() ? (
    /* Closed face — pretty sealed letter invitation, still fully holographic.
       Clean top (no random trading-card meta) — meaningful minimal signifier only. */
    ssr(_tmpl$4, ssrHydrationKey(), ssrStyleProperty("font-family:", "'Patrick Hand', cursive"), ssrStyleProperty("box-shadow:", "0 0 10px rgba(255,102,196,0.35), inset 0 0 6px rgba(0,0,0,0.25)"), ssrAttribute("src", escape(centerImage(), true), false) + ssrAttribute("alt", escape(name(), true), false), ssrStyleProperty("font-family:", "'Great Vibes', cursive") + ssrStyleProperty(";text-shadow:", "0 0 12px rgba(255,102,196,0.45)"), escape(name()), nickname() && ssr(_tmpl$5, ssrHydrationKey(), escape(nickname())))
  ) : escape(
    /* Open — the full wide, breathing, personal letter (centerpiece).
       More like a real letter now: meaningful top text (no random corner trading-card badges),
       cleaner flow, primary body message, discovered extras only when widened. */
    [ssr(_tmpl$6, ssrHydrationKey(), ssrStyleProperty("font-family:", "'Patrick Hand', cursive")), ssr(_tmpl$7, ssrHydrationKey(), ssrStyleProperty("box-shadow:", "0 0 15px rgba(255,102,196,0.5), 0 0 30px rgba(188,19,254,0.2), inset 0 0 8px rgba(0,0,0,0.3)"), ssrAttribute("src", escape(centerImage(), true), false) + ssrAttribute("alt", escape(name(), true), false), escape(createComponent(For, {
      each: [1, 2, 3, 4, 5],
      children: () => ssr(_tmpl$12, ssrHydrationKey())
    }))), ssr(_tmpl$8, ssrHydrationKey(), ssrStyleProperty("font-family:", "'Great Vibes', cursive") + ssrStyleProperty(";text-shadow:", "0 0 15px rgba(255,102,196,0.5)"), escape(createComponent(For, {
      get each() {
        return hbdLetters();
      },
      children: (letter) => ssr(_tmpl$13, ssrHydrationKey() + ssrAttribute("class", letter.char === " " ? "letter-space" : "letter-block", false), letter.char === " " ? " " : escape(letter.char))
    }))), ssr(_tmpl$9, ssrHydrationKey(), ssrStyleProperty("font-family:", "'Great Vibes', cursive"), escape(createComponent(For, {
      get each() {
        return nameLetters();
      },
      children: (letter) => ssr(_tmpl$13, ssrHydrationKey() + ssrAttribute("class", letter.char === " " ? "letter-space" : "letter-block letter-gradient", false), letter.char === " " ? " " : escape(letter.char))
    }))), nickname() && ssr(_tmpl$14, ssrHydrationKey(), escape(nickname())), isLandscape() && [ssr(_tmpl$15, ssrHydrationKey(), ssrStyleProperty("font-family:", "'Patrick Hand', cursive"), escape(createComponent(For, {
      get each() {
        return splitToLetterBlocks(scrollMsg(), 22);
      },
      children: (letter) => ssr(_tmpl$13, ssrHydrationKey() + ssrAttribute("class", letter.char === " " ? "letter-space" : "letter-block", false), letter.char === " " ? " " : escape(letter.char))
    }))), ssr(_tmpl$16, ssrHydrationKey())], ssr(_tmpl$0, ssrHydrationKey() + ssrAttribute("src", escape(confettiImage(), true), false)), ssr(_tmpl$1, ssrHydrationKey(), ssrStyleProperty("font-family:", "'Patrick Hand', cursive"), escape(hbdMessage())), ssr(_tmpl$10, ssrHydrationKey(), escape(cardMeta().artist), escape(cardMeta().year)), ssr(_tmpl$11, ssrHydrationKey(), ssrAttribute("aria-label", isLandscape() ? "Return to portrait letter view" : "Expand letter to landscape view", false), isLandscape() ? "⟵" : "⟶")]
  ));
}

export { Hadacard as H };
