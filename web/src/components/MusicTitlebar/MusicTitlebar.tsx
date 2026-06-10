import { createSignal, onMount, onCleanup } from '@/utils/ui';
import { createEffect } from 'solid-js';
import { haptic } from '@/utils/haptics';

export interface MusicTitlebarProps {
  /** Audio source URL. Required when no externalAudio is supplied. */
  src?: string;
  title?: string;
  artist?: string;
  lyrics?: string[];
  class?: string;
  /** Volume 0-1 (default 0.6). Only applies when we own the audio instance. */
  volume?: number;
  /** Start playing on first user gesture automatically (still gated by browser) */
  autoStart?: boolean;
  onPlayStateChange?: (playing: boolean) => void;

  /**
   * When provided, the component becomes a control surface + visualizer
   * for this existing HTMLAudioElement instead of creating its own.
   * This implements "hooks to a audio" (e.g. the end-scene BGM owned by FrutigerScenes).
   * Lifecycle (play/pause/seek/loop) stays with the caller; we only attach listeners
   * and drive our UI state from the external instance.
   */
  externalAudio?: HTMLAudioElement;
}

const DEFAULT_TITLE = "Bubbly Reverie";
const DEFAULT_ARTIST = "AREPO for Janell";
const DEFAULT_LYRICS = [
  "Happy belated, my love...",
  "Every bubble holds a wish for you",
  "Stars paused just to watch you smile",
  "Pink and cyan lights on your skin",
  "You make time feel like 1993 again",
  "Dance with me in the hallway of forever",
];

/**
 * Cute mobile-first Music titlebar / mp3-player-style scroll component.
 *
 * - Shows song title + artist with a gentle scrolling marquee.
 * - Highlights current lyric line driven by playback progress.
 * - Play/pause, draggable progress scrub, time display.
 * - Bubbly aero-glass + pastel aero palette, large touch targets, haptics.
 * - Coordinates with globalBgmAudio (pauses it when this plays its own track).
 *
 * Hooking to audio:
 * - By default (no externalAudio) it self-manages an HTMLAudioElement (backward compat).
 * - When externalAudio is passed, we attach as a pure UI + control surface for the
 *   caller's instance. Perfect for "appears with the end scene music" while a parent
 *   (FrutigerScenes) owns the looping BGM.
 *
 * Future: can be wired to a central services/audio.ts or useAudioPlayer hook
 * by accepting a controller instead of raw `src` or external element.
 */
export default function MusicTitlebar(props: MusicTitlebarProps) {
  const [playing, setPlaying] = createSignal(false);
  const [currentTime, setCurrentTime] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [lyricIndex, setLyricIndex] = createSignal(0);
  const [isScrubbing, setIsScrubbing] = createSignal(false);

  let audioRef: HTMLAudioElement | undefined;
  let progressRef: HTMLDivElement | undefined;
  let marqueeRef: HTMLDivElement | undefined;

  const title = () => props.title || DEFAULT_TITLE;
  const artist = () => props.artist || DEFAULT_ARTIST;
  const lyrics = () => (props.lyrics && props.lyrics.length ? props.lyrics : DEFAULT_LYRICS);
  const vol = () => (typeof props.volume === 'number' ? Math.max(0, Math.min(1, props.volume)) : 0.6);

  const fmt = (t: number) => {
    if (!isFinite(t) || t < 0) t = 0;
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPct = () => {
    const d = duration();
    return d > 0 ? Math.min(100, (currentTime() / d) * 100) : 0;
  };

  const currentLyric = () => lyrics()[lyricIndex()] || lyrics()[0] || "...";

  // Attach (or re-attach) the UI-driving listeners to whichever audio we are using.
  const attachListeners = (a: HTMLAudioElement) => {
    a.onloadedmetadata = () => {
      setDuration(a.duration || 0);
    };

    a.ontimeupdate = () => {
      if (!a || isScrubbing()) return;
      setCurrentTime(a.currentTime);

      // Drive lyric by rough percentage (simple & reliable, no timestamps needed)
      const d = a.duration || 1;
      const pct = a.currentTime / d;
      const idx = Math.min(
        lyrics().length - 1,
        Math.floor(pct * lyrics().length)
      );
      if (idx !== lyricIndex()) setLyricIndex(idx);
    };

    a.onplay = () => {
      setPlaying(true);
      props.onPlayStateChange?.(true);
      // Pause any global background music (audio discipline) — safe even for external
      const g = (typeof window !== 'undefined' && (window as any).globalBgmAudio) || null;
      if (g && !g.paused) {
        try { g.pause(); } catch {}
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
      const a = props.externalAudio;
      audioRef = a;

      // Prime UI state from whatever the external is currently doing
      setDuration(a.duration || 0);
      setCurrentTime(a.currentTime || 0);
      setPlaying(!a.paused);

      attachListeners(a);
      return a;
    }

    // Own instance path (original behavior)
    if (!props.src) {
      console.warn('MusicTitlebar: src prop is required when no externalAudio is provided');
      return undefined;
    }
    const a = new Audio(props.src);
    a.loop = false;
    a.volume = vol();
    a.preload = 'metadata';

    attachListeners(a);

    audioRef = a;
    return a;
  };

  const togglePlay = (e?: Event) => {
    if (e) e.stopPropagation();
    const a = initOrAttachAudio();
    if (!a) return;

    haptic.trigger(playing() ? 'light' : 'medium');

    if (playing()) {
      a.pause();
    } else {
      a.play().catch((err) => {
        // Autoplay blocked or other transient — user can tap again
        console.log('MusicTitlebar play deferred:', err);
      });
    }
  };

  // Seek helpers (tap or drag)
  const computeSeek = (clientX: number) => {
    if (!progressRef || !audioRef) return;
    const rect = progressRef.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const d = duration() || 0;
    const newTime = x * d;
    audioRef.currentTime = newTime;
    setCurrentTime(newTime);

    // Update lyric immediately for responsiveness
    const pct = d > 0 ? newTime / d : 0;
    const idx = Math.min(lyrics().length - 1, Math.floor(pct * lyrics().length));
    setLyricIndex(idx);
  };

  const onProgressPointerDown = (e: PointerEvent) => {
    e.stopPropagation();
    setIsScrubbing(true);
    haptic.trigger('light');
    computeSeek(e.clientX);

    const onMove = (ev: PointerEvent) => {
      computeSeek(ev.clientX);
    };
    const onUp = () => {
      setIsScrubbing(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      // If we were playing before scrub, resume (keeps feel of "live radio")
      if (playing() && audioRef) {
        audioRef.play().catch(() => {});
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  // Whole bar (except progress) toggles play — nice big target on mobile
  const onBarClick = (e: MouseEvent) => {
    // Ignore clicks that originated inside the progress zone
    if ((e.target as HTMLElement)?.closest?.('.mtb-progress')) return;
    togglePlay();
  };

  // Keyboard support (space/enter on focused bar)
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      togglePlay();
    }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && audioRef) {
      e.preventDefault();
      const step = e.key === 'ArrowLeft' ? -5 : 5;
      const a = audioRef;
      a.currentTime = Math.max(0, Math.min(duration() || 0, a.currentTime + step));
      setCurrentTime(a.currentTime);
    }
  };

  onMount(() => {
    // If autoStart requested, we still wait for a real gesture elsewhere or first toggle
    if (props.autoStart) {
      // Prime the element so first toggle is snappier
      initOrAttachAudio();
    }
    // If an externalAudio was already passed and is playing, make sure our initial
    // signals reflect reality (the attach in initOrAttachAudio also does this).
    if (props.externalAudio) {
      initOrAttachAudio();
    }
  });

  onCleanup(() => {
    // Only destroy/pause if *we* created the audio. External owner (e.g. FrutigerScenes)
    // is responsible for its own lifecycle.
    if (audioRef && !props.externalAudio) {
      try {
        audioRef.pause();
        audioRef.src = '';
      } catch {}
      audioRef = undefined;
    }
    // Listeners on external are left in place (they are cheap and the element may live longer).
  });

  // Keep volume in sync if prop changes (only meaningful for owned audio)
  createEffect(() => {
    if (audioRef && !props.externalAudio) {
      audioRef.volume = vol();
    }
  });

  const playIcon = () => (playing() ? '⏸︎' : '▶︎');
  const playLabel = () => (playing() ? 'Pause' : 'Play');

  return (
    <div
      class={`music-titlebar select-none ${props.class || ''}`}
      onClick={onBarClick}
      onKeyDown={onKeyDown}
      role="button"
      aria-label={`${title()} by ${artist()}. ${playing() ? 'Now playing' : 'Paused'}. Tap to ${playLabel().toLowerCase()}.`}
      tabindex="0"
    >
      <div class="mtb-inner aero-glass rounded-3xl px-3 py-2.5 flex items-center gap-3 border border-white/20 shadow-lg">
        {/* Play / Pause — big bubbly target */}
        <button
          type="button"
          onPointerDown={(e) => { e.stopPropagation(); haptic.trigger('light'); }}
          onClick={togglePlay}
          class="mtb-play flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-xl leading-none transition-all active:scale-95 bg-gradient-to-br from-aero-pink/90 via-aero-magenta/80 to-aero-cyan/90 text-white shadow-md border border-white/30"
          aria-label={playLabel()}
          title={playLabel()}
        >
          <span class="mtb-play-icon" style={{ transform: playing() ? 'none' : 'translateX(1px)' }}>
            {playIcon()}
          </span>
        </button>

        {/* Info + scroll title + lyric + progress */}
        <div class="min-w-0 flex-1 flex flex-col gap-1">
          {/* Title + Artist row (the "titlebar scroll" area) */}
          <div class="flex items-baseline gap-2 overflow-hidden">
            <div
              ref={marqueeRef}
              class={`mtb-marquee text-[13px] font-semibold tracking-wide text-white/95 whitespace-nowrap ${playing() ? 'is-playing' : ''}`}
              title={`${artist()} — ${title()}`}
            >
              <span class="mtb-artist text-aero-cyan/90">{artist()}</span>
              <span class="mx-1.5 text-white/40">—</span>
              <span class="mtb-title">{title()}</span>
            </div>
            <div class={`mtb-now text-[9px] font-mono tracking-[1.5px] uppercase flex-shrink-0 transition-opacity ${playing() ? 'opacity-70' : 'opacity-30'}`}>
              {playing() ? 'LIVE' : 'READY'}
            </div>
          </div>

          {/* Current lyric — clear focal point, gently transitions */}
          <div class="mtb-lyric text-[11px] text-aero-blush/90 leading-tight tracking-wide min-h-[14px] transition-opacity duration-200">
            {currentLyric()}
          </div>

          {/* Progress track (scrubbable) + times */}
          <div class="mtb-progress-wrap flex items-center gap-2">
            <div
              ref={progressRef}
              class="mtb-progress relative flex-1 h-2 rounded-full bg-white/15 border border-white/10 overflow-hidden cursor-pointer active:bg-white/20"
              onPointerDown={onProgressPointerDown}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={duration() || 100}
              aria-valuenow={currentTime()}
              aria-label="Seek"
            >
              <div
                class="mtb-progress-fill absolute inset-y-0 left-0 bg-gradient-to-r from-aero-pink via-aero-rose to-aero-cyan transition-[width] duration-75"
                style={{ width: `${progressPct()}%` }}
              />
              {/* cute little thumb glow when playing or scrubbing */}
              <div
                class={`mtb-thumb absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] transition-all ${playing() || isScrubbing() ? 'opacity-90 scale-100' : 'opacity-60 scale-75'}`}
                style={{ left: `calc(${progressPct()}% - 5px)` }}
              />
            </div>

            <div class="mtb-times flex-shrink-0 font-mono text-[9px] tabular-nums text-white/60 tracking-tight min-w-[66px] text-right">
              {fmt(currentTime())}<span class="text-white/30 mx-0.5">/</span>{fmt(duration())}
            </div>
          </div>
        </div>

        {/* Subtle music note / status on the right */}
        <div class={`mtb-side text-lg opacity-60 flex-shrink-0 transition-transform ${playing() ? 'animate-pulse' : ''}`} aria-hidden="true">
          ♪
        </div>
      </div>

      {/* Scoped styles for marquee + micro details (keeps global.css clean) */}
      <style>{`
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
      `}</style>
    </div>
  );
}
