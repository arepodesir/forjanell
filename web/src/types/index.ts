/**
 * Central type registry for the web module (per configs-to-toml-2 + IIPS).
 * All domain, config, and shared view types live here.
 * Moved from inline + config.ts for single source of truth + type safety.
 */

// ─── Core Domain (recipient + card essence) ────────────────────────────────
export interface Recipient {
  name: string;
  nickname: string;
  picUrl: string;
  hbdMessage: string;
  scrollMsg: string;
  openDate: string;
  birthDate: string;
}

export interface CardMeta {
  edition: string;
  series: string;
  id: string;
  rarity: string;
  year: string;
  artist: string;
}

// NOTE: Egift intentionally removed per job directive (no more e-voucher / golden ticket)

export interface Gift {
  year: string;
  title: string;
  emoji: string;
  status: string;
  description: string;
  link: string;
  active: boolean;
}

// ─── Scenes & Narrative ────────────────────────────────────────────────────
export interface Scene {
  id: number;
  background: string;
  messages: string[];
  action: { emoji: string; label: string };
}

export interface SceneMap {
  sceneBackgrounds: Record<number, string>;
  sceneMessages: Record<number, string[]>;
  sceneActions: Record<number, { emoji: string; label: string }>;
}

// ─── Assets ─────────────────────────────────────────────────────────────────
export interface Assets {
  audio: Record<string, string>;
  images: Record<string, string>;
}

// ─── Full Web Config (rich + legacy bridge for views) ──────────────────────
export interface WebConfig {
  // Rich structured (preferred for new/hooks)
  recipient: Recipient;
  cardMeta: CardMeta;
  scenes: Scene[];
  assets: Assets;
  gifts: Gift[];
  gift: Gift[]; // compat alias used by gifts vault

  computed: {
    isBirthdayToday: () => boolean;
    getAge: () => number;
  };

  // Legacy flat / Record shapes (so existing views like FrutigerScenes continue with [1] indexing etc.)
  name: string;
  nickname: string;
  picUrl: string;
  hbdMessage: string;
  scrollMsg: string;
  openDate: string;
  birthDate: string;
  sceneBackgrounds: Record<number, string>;
  sceneMessages: Record<number, string[]>;
  sceneActions: Record<number, { emoji: string; label: string }>;
  audio: Record<string, string>;
}

// Re-export for convenience in config consumers
export type { WebConfig as default };

// ─── Hadacard (ported from component per refactor-hadacard.2 + IIPS) ─────────
export interface HadacardProps {
  name?: string;
  nickname?: string;
  picUrl?: string;
  hbdMessage?: string;
  scrollMsg?: string; // retained for future/compat (unused in base render)
  cardMeta?: CardMeta;
  open?: boolean; // new: open mode for wide smooth pretty letter unfold (default true)
  onOpenChange?: (isOpen: boolean) => void;
  landscape?: boolean; // new (hadacard-landscape-arrow): glassy arrow button transitions the open letter to landscape "sheet" + reveals cool extra features (scrollMsg banner + P.S.)
  onLandscapeChange?: (isLandscape: boolean) => void;
  class?: string;
}
