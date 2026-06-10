import { c as createComponent$1, $ as $$Application } from './Application_WF1Dr1M_.mjs';
import 'piccolore';
import { r as renderComponent, a as renderTemplate, m as maybeRenderHead } from './prerender_BOSDH4Xw.mjs';
import { ssr, ssrHydrationKey, escape, ssrStyleProperty, ssrAttribute, createComponent } from 'solid-js/web';
import { createSignal, onMount, onCleanup, createEffect, Show } from 'solid-js';
import { H as Hadacard } from './Hadacard__wZfSHI3.mjs';
import { A as APP_CONFIG } from './config_CbvXcl0W.mjs';
import { B as BackButton } from './BackButton_Lu0ppxms.mjs';

var _tmpl$$2 = ["<div", ' class="', '" style="', '"><canvas class="absolute inset-0 w-full h-full"></canvas><!--$-->', "<!--/--><!--$-->", '<!--/--><div class="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 text-[9px] font-mono tracking-widest">', '</div><div class="absolute bottom-9 right-4 text-[9px] text-white/30 font-mono tracking-widest pointer-events-none z-10 select-none">SPIN THE PEDESTAL • PINCH TO SCALE • TAP FOR MAGIC</div></div>'], _tmpl$2$1 = ["<div", ' class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"><div class="aero-glass px-5 py-2 rounded-full text-xs tracking-[3px] text-aero-cyan/90">blooming the orchid...</div></div>'], _tmpl$3$1 = ["<div", ' class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-[10px] text-white/50 font-mono bg-black/40 px-3 py-1 rounded">', "</div>"], _tmpl$4$1 = ["<button", ' class="aero-glass px-2.5 py-0.5 rounded-full text-white/80 active:scale-95 transition select-none cursor-pointer border border-white/10" style="', '">', "</button>"];
function OrchidViewer(props) {
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [orchidState, setOrchidState] = createSignal("idle");
  let renderer = null;
  let scene = null;
  let model = null;
  let pointerDown = false;
  let lastX = 0;
  const disposeAll = () => {
    if (renderer) {
      renderer.dispose();
      const dom = renderer.domElement;
      if (dom && dom.parentNode) dom.parentNode.removeChild(dom);
    }
    if (scene) {
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose?.();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose?.());
          else obj.material.dispose?.();
        }
      });
    }
    renderer = null;
    scene = null;
    model = null;
  };
  const onPointerMove = (e) => {
    if (!pointerDown || !model) return;
    const ev = "touches" in e ? e.touches[0] : e;
    ev.clientX - lastX;
    lastX = ev.clientX;
    ev.clientY;
  };
  const onPointerUp = () => {
    pointerDown = false;
    setTimeout(() => {
    }, 1200);
  };
  const setup = async () => {
    return;
  };
  onMount(() => {
    setup();
  });
  onCleanup(() => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    if (window._orchidResize) {
      window.removeEventListener("resize", window._orchidResize);
      delete window._orchidResize;
    }
    disposeAll();
  });
  return ssr(_tmpl$$2, ssrHydrationKey(), `relative w-full overflow-hidden rounded-3xl bg-[#0a0b18] ${escape(props.class || "h-[520px] md:h-[620px]", true)}`, ssrStyleProperty("touch-action:", "none"), isLoading() && _tmpl$2$1[0] + ssrHydrationKey() + _tmpl$2$1[1], error() && ssr(_tmpl$3$1, ssrHydrationKey(), escape(error())), escape(["Front", "Side", "Back", "Close"].map((label) => ssr(_tmpl$4$1, ssrHydrationKey(), ssrStyleProperty("font-family:", "'Comfortaa', sans-serif"), escape(label)))));
}

var _tmpl$$1 = ["<div", ' class="', '" role="button" aria-label="', '" tabindex="0"><div class="mtb-inner aero-glass rounded-3xl px-3 py-2.5 flex items-center gap-3 border border-white/20 shadow-lg"><button type="button" class="mtb-play flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-xl leading-none transition-all active:scale-95 bg-gradient-to-br from-aero-pink/90 via-aero-magenta/80 to-aero-cyan/90 text-white shadow-md border border-white/30"', '><span class="mtb-play-icon" style="', '">', '</span></button><div class="min-w-0 flex-1 flex flex-col gap-1"><div class="flex items-baseline gap-2 overflow-hidden"><div class="', '" title="', '"><span class="mtb-artist text-aero-cyan/90">', '</span><span class="mx-1.5 text-white/40">—</span><span class="mtb-title">', '</span></div><div class="', '">', '</div></div><div class="mtb-lyric text-[11px] text-aero-blush/90 leading-tight tracking-wide min-h-[14px] transition-opacity duration-200">', '</div><div class="mtb-progress-wrap flex items-center gap-2"><div class="mtb-progress relative flex-1 h-2 rounded-full bg-white/15 border border-white/10 overflow-hidden cursor-pointer active:bg-white/20" role="slider" aria-valuemin="0"', ' aria-label="Seek"><div class="mtb-progress-fill absolute inset-y-0 left-0 bg-gradient-to-r from-aero-pink via-aero-rose to-aero-cyan transition-[width] duration-75" style="', '"></div><div class="', '" style="', '"></div></div><div class="mtb-times flex-shrink-0 font-mono text-[9px] tabular-nums text-white/60 tracking-tight min-w-[66px] text-right"><!--$-->', '<!--/--><span class="text-white/30 mx-0.5">/</span><!--$-->', '<!--/--></div></div></div><div class="', `" aria-hidden="true">♪</div></div><style>
        .music-titlebar {
          font-family: 'Patrick Hand', 'Comfortaa', cursive, sans-serif;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
        }
        .music-titlebar:focus-visible {
          outline: 2px solid var(--color-aero-cyan);
          outline-offset: 2px;
          border-radius: 18px;
        }
        .mtb-inner {
          box-shadow: 0 8px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.35);
        }
        .mtb-play {
          box-shadow: 0 4px 14px rgba(255, 102, 196, 0.45), inset 0 1px 0 rgba(255,255,255,0.4);
        }
        .mtb-play:active {
          transform: scale(0.92);
        }
        .mtb-marquee {
          max-width: 100%;
          overflow: hidden;
          position: relative;
        }
        .mtb-marquee.is-playing {
          /* gentle continuous scroll when playing — feels like a real title bar */
          animation: mtb-marquee 7.5s linear infinite;
        }
        .mtb-marquee span {
          display: inline-block;
          padding-right: 2.25rem;
        }
        @keyframes mtb-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .mtb-lyric {
          font-family: 'Patrick Hand', cursive;
          letter-spacing: 0.2px;
        }
        .mtb-progress {
          transition: background-color 80ms ease;
        }
        .mtb-progress:active {
          background-color: rgba(255,255,255,0.22);
        }
        .mtb-progress-fill {
          box-shadow: 0 0 8px rgba(255, 102, 196, 0.5);
        }
        .mtb-thumb {
          box-shadow: 0 0 0 3px rgba(0, 243, 255, 0.2);
        }
        .mtb-now {
          font-family: 'Comfortaa', system-ui, sans-serif;
        }
      </style></div>`];
const DEFAULT_TITLE = "Bubbly Reverie";
const DEFAULT_ARTIST = "AREPO for Janell";
const DEFAULT_LYRICS = ["Happy belated, my love...", "Every bubble holds a wish for you", "Stars paused just to watch you smile", "Pink and cyan lights on your skin", "You make time feel like 1993 again", "Dance with me in the hallway of forever"];
function MusicTitlebar(props) {
  const [playing, setPlaying] = createSignal(false);
  const [currentTime, setCurrentTime] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [lyricIndex, setLyricIndex] = createSignal(0);
  const [isScrubbing, setIsScrubbing] = createSignal(false);
  let audioRef;
  const title = () => props.title || DEFAULT_TITLE;
  const artist = () => props.artist || DEFAULT_ARTIST;
  const lyrics = () => props.lyrics && props.lyrics.length ? props.lyrics : DEFAULT_LYRICS;
  const vol = () => typeof props.volume === "number" ? Math.max(0, Math.min(1, props.volume)) : 0.6;
  const fmt = (t) => {
    if (!isFinite(t) || t < 0) t = 0;
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };
  const progressPct = () => {
    const d = duration();
    return d > 0 ? Math.min(100, currentTime() / d * 100) : 0;
  };
  const currentLyric = () => lyrics()[lyricIndex()] || lyrics()[0] || "...";
  const attachListeners = (a) => {
    a.onloadedmetadata = () => {
      setDuration(a.duration || 0);
    };
    a.ontimeupdate = () => {
      if (!a || isScrubbing()) return;
      setCurrentTime(a.currentTime);
      const d = a.duration || 1;
      const pct = a.currentTime / d;
      const idx = Math.min(lyrics().length - 1, Math.floor(pct * lyrics().length));
      if (idx !== lyricIndex()) setLyricIndex(idx);
    };
    a.onplay = () => {
      setPlaying(true);
      props.onPlayStateChange?.(true);
      const g = typeof window !== "undefined" && window.globalBgmAudio || null;
      if (g && !g.paused) {
        try {
          g.pause();
        } catch {
        }
      }
    };
    a.onpause = () => {
      setPlaying(false);
      props.onPlayStateChange?.(false);
    };
    a.onended = () => {
      setPlaying(false);
      setCurrentTime(0);
      setLyricIndex(0);
      props.onPlayStateChange?.(false);
    };
  };
  const initOrAttachAudio = () => {
    if (audioRef) return audioRef;
    if (props.externalAudio) {
      const a2 = props.externalAudio;
      audioRef = a2;
      setDuration(a2.duration || 0);
      setCurrentTime(a2.currentTime || 0);
      setPlaying(!a2.paused);
      attachListeners(a2);
      return a2;
    }
    if (!props.src) {
      console.warn("MusicTitlebar: src prop is required when no externalAudio is provided");
      return void 0;
    }
    const a = new Audio(props.src);
    a.loop = false;
    a.volume = vol();
    a.preload = "metadata";
    attachListeners(a);
    audioRef = a;
    return a;
  };
  onMount(() => {
    if (props.autoStart) {
      initOrAttachAudio();
    }
    if (props.externalAudio) {
      initOrAttachAudio();
    }
  });
  onCleanup(() => {
    if (audioRef && !props.externalAudio) {
      try {
        audioRef.pause();
        audioRef.src = "";
      } catch {
      }
      audioRef = void 0;
    }
  });
  createEffect(() => {
    if (audioRef && !props.externalAudio) {
      audioRef.volume = vol();
    }
  });
  const playIcon = () => playing() ? "⏸︎" : "▶︎";
  const playLabel = () => playing() ? "Pause" : "Play";
  return ssr(_tmpl$$1, ssrHydrationKey(), `music-titlebar select-none ${escape(props.class || "", true)}`, `${escape(title(), true)} by ${escape(artist(), true)}. ${playing() ? "Now playing" : "Paused"}. Tap to ${escape(playLabel().toLowerCase(), true)}.`, ssrAttribute("aria-label", escape(playLabel(), true), false) + ssrAttribute("title", escape(playLabel(), true), false), ssrStyleProperty("transform:", playing() ? "none" : "translateX(1px)"), escape(playIcon()), `mtb-marquee text-[13px] font-semibold tracking-wide text-white/95 whitespace-nowrap ${playing() ? "is-playing" : ""}`, `${escape(artist(), true)} — ${escape(title(), true)}`, escape(artist()), escape(title()), `mtb-now text-[9px] font-mono tracking-[1.5px] uppercase flex-shrink-0 transition-opacity ${playing() ? "opacity-70" : "opacity-30"}`, playing() ? "LIVE" : "READY", escape(currentLyric()), ssrAttribute("aria-valuemax", escape(duration() || 100, true), false) + ssrAttribute("aria-valuenow", escape(currentTime(), true), false), ssrStyleProperty("width:", `${escape(progressPct(), true)}%`), `mtb-thumb absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] transition-all ${playing() || isScrubbing() ? "opacity-90 scale-100" : "opacity-60 scale-75"}`, ssrStyleProperty("left:", `calc(${escape(progressPct(), true)}% - 5px)`), escape(fmt(currentTime())), escape(fmt(duration())), `mtb-side text-lg opacity-60 flex-shrink-0 transition-transform ${playing() ? "animate-pulse" : ""}`);
}

var _tmpl$ = ["<div", ' class="relative z-20 flex flex-col items-center justify-center text-center text-white p-6" style="', '"><h1 class="text-4xl font-extrabold mb-6 drop-shadow-lg" style="', `">Come Back Later...</h1><div class="aero-glass p-6 rounded-2xl max-w-md border border-white/10"><p class="text-xl">I know you're excited for your special day, but you need to be patient! ✨</p></div></div>`], _tmpl$2 = ["<div", ' class="relative z-20 flex flex-col items-center justify-center text-center text-white p-6" style="', '"><h1 class="text-4xl font-extrabold mb-6 drop-shadow-lg text-pink-300" style="', '">The Party is Over</h1><div class="aero-glass p-6 rounded-2xl max-w-md border border-white/10"><p class="text-xl">You missed it! But the gift was meant for you. Happy Belated Birthday! 💖</p></div></div>'], _tmpl$3 = ["<div", ' class="z-20 flex flex-col items-center text-center px-4 w-full max-w-md gap-4 select-none animate-reveal-up"><!--$-->', '<!--/--><button class="mt-2 aero-btn text-xs tracking-wider px-6 py-2" style="', '">Open the Letter &amp; Meet Your Orchid 🌸</button></div>'], _tmpl$4 = ["<div", ' class="z-20 w-full flex flex-col items-center justify-start p-4 pt-8 pb-12 gap-5"><div class="aero-glass rounded-3xl px-5 py-4 max-w-md text-center border border-white/15"><p class="text-aero-cyan text-sm tracking-wider uppercase mb-1" style="', '">Your gift has opened</p><div class="text-white/90 text-[15px] leading-snug" style="', '">A living orchid, grown just for you. Touch it. Turn it. Let it catch the light.</div></div><!--$-->', '<!--/--><p class="text-[10px] text-white/40 tracking-[2px] mt-1">TAP THE ORCHID • DRAG TO ORBIT • PINCH TO ZOOM</p><!--$-->', "<!--/--></div>"], _tmpl$5 = ["<div", ' class="relative w-full h-full min-h-screen flex flex-col items-center justify-center overflow-hidden" style="', '"><canvas class="absolute inset-0 w-full h-full pointer-events-none z-0"></canvas><div class="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-transparent to-purple-950/40 pointer-events-none z-10"></div><div class="', '" style="', '"></div><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"];
function FrutigerScenes(props) {
  const [timeStatus, setTimeStatus] = createSignal("ON_TIME");
  const [scene, setScene] = createSignal(1);
  const [msgIndex, setMsgIndex] = createSignal(0);
  const [showAction, setShowAction] = createSignal(false);
  const [isTransitioning, setIsTransitioning] = createSignal(false);
  const [endAudio, setEndAudio] = createSignal();
  let activeTimers = [];
  let sfxHbd;
  if (typeof window !== "undefined") {
    sfxHbd = new Audio(props.audio.hbd);
    sfxHbd.loop = true;
    sfxHbd.volume = 0.5;
  }
  onMount(() => {
    if (props.openDate) {
      const startTime = (/* @__PURE__ */ new Date(props.openDate + "T00:00")).getTime();
      const endTime = startTime + 24 * 60 * 60 * 1e3;
      const now = Date.now();
      if (now < startTime) setTimeStatus("EARLY");
      else if (now > endTime) setTimeStatus("LATE");
    }
    if (typeof window !== "undefined" && window.globalBgmAudio) {
      window.globalBgmAudio.pause();
    }
    if (sfxHbd) {
      sfxHbd.play().catch((e) => console.log("Main BGM deferred (will retry on gesture):", e));
    }
    if (timeStatus() === "ON_TIME") {
      runMessages();
    }
  });
  onCleanup(() => {
    clearAllTimers();
    if (sfxHbd) sfxHbd.pause();
    const ea = endAudio();
    if (ea) {
      try {
        ea.pause();
      } catch {
      }
    }
    if (typeof window !== "undefined") {
      if (window._particleResizeHandler) {
        window.removeEventListener("resize", window._particleResizeHandler);
      }
      if (window._particleAnimId) {
        cancelAnimationFrame(window._particleAnimId);
      }
    }
    if (typeof window !== "undefined" && window.globalBgmAudio) {
      window.globalBgmAudio.play().catch(() => {
      });
    }
  });
  const clearAllTimers = () => {
    activeTimers.forEach((t) => clearTimeout(t));
    activeTimers = [];
  };
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
  return ssr(_tmpl$5, ssrHydrationKey(), ssrStyleProperty("background:", "linear-gradient(135deg, #090c21 0%, #05060f 50%, #0d071a 100%)"), `absolute inset-0 z-40 pointer-events-none bg-white/5 transition-all duration-[1600ms] ease-out ${isTransitioning() ? "opacity-90" : "opacity-0"}`, ssrStyleProperty("backdrop-filter:", isTransitioning() ? "blur(28px) saturate(0.7)" : "blur(0px) saturate(1)") + ssrStyleProperty(";transition:", "backdrop-filter 1600ms cubic-bezier(0.23,1,0.32,1), opacity 900ms ease"), escape(createComponent(Show, {
    get when() {
      return timeStatus() === "EARLY";
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), ssrStyleProperty("font-family:", "'Patrick Hand', cursive"), ssrStyleProperty("font-family:", "'Great Vibes', cursive"));
    }
  })), escape(createComponent(Show, {
    get when() {
      return timeStatus() === "LATE";
    },
    get children() {
      return ssr(_tmpl$2, ssrHydrationKey(), ssrStyleProperty("font-family:", "'Patrick Hand', cursive"), ssrStyleProperty("font-family:", "'Great Vibes', cursive"));
    }
  })), escape(createComponent(Show, {
    get when() {
      return timeStatus() === "ON_TIME";
    },
    get children() {
      return [createComponent(Show, {
        get when() {
          return scene() === 1;
        },
        get children() {
          return ssr(_tmpl$3, ssrHydrationKey(), escape(createComponent(Hadacard, {
            "client:load": true,
            get name() {
              return props.name;
            },
            get nickname() {
              return props.nickname;
            },
            get picUrl() {
              return props.picUrl;
            },
            get hbdMessage() {
              return props.hbdMessage;
            },
            get cardMeta() {
              return props.cardMeta;
            },
            mode: "open-letter",
            videoBg: "/assets/video/horsey.optimized.webm",
            centerImage: "/assets/img/janell.png",
            confettiImage: "/assets/img/Confetti.png"
          })), ssrStyleProperty("font-family:", "'Comfortaa', sans-serif"));
        }
      }), createComponent(Show, {
        get when() {
          return scene() === 2;
        },
        get children() {
          return ssr(_tmpl$4, ssrHydrationKey(), ssrStyleProperty("font-family:", "'Comfortaa', sans-serif"), ssrStyleProperty("font-family:", "'Patrick Hand', cursive"), escape(createComponent(OrchidViewer, {
            "client:load": true,
            "class": "w-full max-w-[min(94vw,540px)] h-[490px] md:h-[600px] rounded-3xl",
            get externalAudio() {
              return endAudio();
            }
          })), escape(createComponent(MusicTitlebar, {
            get externalAudio() {
              return endAudio();
            },
            src: "/assets/audio/what-friends-are-for.wav",
            title: "What Friends Are For",
            artist: "Dionne Warwick",
            "class": "fixed bottom-3 left-1/2 -translate-x-1/2 z-[55] w-[min(92vw,420px)]"
          })));
        }
      })];
    }
  })));
}

const $$Index = createComponent$1(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Application", $$Application, { "title": "For Janell", "subTitle": " | Gift 2026" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="relative w-full h-screen overflow-hidden flex flex-col justify-between pb-safe pt-safe">  ${renderComponent($$result2, "BackButton", BackButton, { "client:load": true, "to": "/gifts", "label": "Gift Vault", "emoji": "🎁", "client:component-hydration": "load", "client:component-path": "@/components/Navigator/BackButton", "client:component-export": "default" })} <div class="flex-1 w-full relative"> ${renderComponent($$result2, "FrutigerScenes", FrutigerScenes, { "client:load": true, ...APP_CONFIG, "client:component-hydration": "load", "client:component-path": "@/components/FlipBook/FrutigerScenes", "client:component-export": "default" })} </div> </div> ` })}`;
}, "/home/arepo/LOGOS/SOFTWARE/DOGMA/FORJANELL/CODE/web/src/pages/gifts/circa-1993/index.astro", void 0);

const $$file = "/home/arepo/LOGOS/SOFTWARE/DOGMA/FORJANELL/CODE/web/src/pages/gifts/circa-1993/index.astro";
const $$url = "/gifts/circa-1993";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
