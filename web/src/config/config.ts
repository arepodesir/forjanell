
import { toml } from '@/utils/parsers';

// TOML sources (IIPS: these are the single source of truth)
import assetsRaw from '@@/web/configs/assets.toml?raw';
import cardsRaw from '@@/web/configs/cards.toml?raw';
import giftsRaw from '@@/web/configs/gifts.toml?raw';
import scenesRaw from '@@/web/configs/scenes.toml?raw';
import baseRaw from '@@/web/configs/base.toml?raw';

// All types centralized in src/types/ (per job + IIPS). Re-export here for back-compat during transition.
import type {
  Recipient,
  CardMeta,
  Scene,
  Assets,
  Gift,
  WebConfig,
} from '@/types';

// NOTE: Egift fully removed (no e-voucher / golden ticket per job directive "remove the gift e voucher completely").

function parseAll(): WebConfig {
  const base = toml(baseRaw) as Partial<Recipient> & { name?: string; nickname?: string };
  const cards = toml(cardsRaw) as {
    recipient?: Recipient;
    cardMeta?: CardMeta;
  };
  // scenes.toml uses [[scene]] (IIPS prescriptive array of tables)
  const scenesParsed = toml(scenesRaw) as {
    scene?: Array<Partial<Scene> & { messages?: string | string[] }>;
    backgrounds?: Array<{ id?: number; path: string }>;
  };
  // assets.toml uses [[audio]] [[image]] arrays -> normalize to Records
  const assetsParsed = toml(assetsRaw) as {
    audio?: Array<{ name?: string; path: string }>;
    image?: Array<{ name?: string; path: string }>;
  };
  const giftsParsed = toml(giftsRaw) as { gift?: Gift[] } | Gift[];

  // ─── Recipient + CardMeta (cards.toml is prescriptive source) ─────────────
  const recipient: Recipient = {
    name: cards.recipient?.name || base.name || "For Janell",
    nickname: cards.recipient?.nickname || base.nickname || "Janell",
    picUrl: cards.recipient?.picUrl || base.picUrl || "/resources/img/janell.png",
    hbdMessage: cards.recipient?.hbdMessage || "Happy Belated Birthday!",
    scrollMsg: cards.recipient?.scrollMsg || "",
    openDate: cards.recipient?.openDate || "",
    birthDate: cards.recipient?.birthDate || base.birthDate || "1993-05-02",
  };

  const cardMeta: CardMeta = cards.cardMeta || {
    edition: "Birthday Edition",
    series: "Digital Card",
    id: "HC-001",
    rarity: "✦ Ultra Rare Holo",
    year: "2026",
    artist: "AREPO",
  };

  // ─── Scenes: normalize [[scene]] + scalar/array messages -> string[] ──────
  const rawScenes = scenesParsed.scene || [];
  const scenes: Scene[] = rawScenes.length
    ? rawScenes.map((s, idx) => {
        const id = s.id ?? (idx + 1);
        const bg = s.background || "/resources/img/stars.png";
        let msgs: string[];
        if (Array.isArray(s.messages)) {
          msgs = s.messages as string[];
        } else if (typeof s.messages === 'string' && s.messages.trim()) {
          msgs = [s.messages as string];
        } else {
          msgs = ["..."];
        }
        const action = s.action || { emoji: "🫧", label: "Continue" };
        return { id, background: bg, messages: msgs, action };
      })
    : [
        {
          id: 1,
          background: "/resources/img/stars.png",
          messages: [
            "Welcome to your special birthday space, Janell! 🫧✨",
            "I built this little visual universe just for you to celebrate your warmth, kindness, and beauty.",
            "Let the music play, breathe in the good vibes, and pop this bubble to reveal your gift! 💖",
          ],
          action: { emoji: "🫧", label: "Pop Bubble & Reveal Card" },
        },
      ];

  // ─── Assets: [[audio]] / [[image]] -> Record<name, path> ───────────────────
  const audioRec: Record<string, string> = {};
  (assetsParsed.audio || []).forEach((a) => {
    if (a.name && a.path) audioRec[a.name] = a.path;
  });
  const imageRec: Record<string, string> = {};
  (assetsParsed.image || []).forEach((im) => {
    if (im.name && im.path) imageRec[im.name] = im.path;
    else if (im.path) {
      // fallback key from path
      const k = im.path.split('/').pop()?.replace(/\.[^.]+$/, '') || 'img';
      imageRec[k] = im.path;
    }
  });

  const assets: Assets = {
    audio: Object.keys(audioRec).length ? audioRec : { main: "/assets/audio/main.wav", hbd: "/assets/audio/main.wav" },
    images: Object.keys(imageRec).length ? imageRec : {
      janell: "/resources/img/janell.png",
      stars: "/resources/img/stars.png",
      nature: "/resources/img/nature.jpg",
    },
  };

  const gifts: Gift[] = (giftsParsed as any)?.gift || (Array.isArray(giftsParsed) ? giftsParsed : []);

  // ─── Computed (central, pure) ──────────────────────────────────────────────
  const computed = {
    isBirthdayToday: (): boolean => {
      const today = new Date();
      return today.getMonth() === 4 && today.getDate() === 2; // 0-indexed May
    },
    getAge: (): number => {
      const birth = new Date(recipient.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age || 33;
    },
  };

  // ─── Legacy Record maps (for FrutigerScenes [1] indexing + spreads) ────────
  const sceneBackgrounds: Record<number, string> = {};
  const sceneMessages: Record<number, string[]> = {};
  const sceneActions: Record<number, { emoji: string; label: string }> = {};

  scenes.forEach((s) => {
    sceneBackgrounds[s.id] = s.background;
    sceneMessages[s.id] = s.messages;
    sceneActions[s.id] = s.action;
  });

  // optional alternate bg support (from old format)
  if (scenesParsed.backgrounds?.length) {
    const alt = scenesParsed.backgrounds[0];
    if (alt.path) sceneBackgrounds[alt.id ?? 2] = alt.path;
  }

  const legacyAudio = assets.audio;

  const full: WebConfig = {
    recipient,
    cardMeta,
    scenes,
    assets,
    gifts,
    gift: gifts, // compat for pages that read config.gift
    computed,
    // flat legacy (prop spread / direct access in views like FrutigerScenes)
    name: recipient.name,
    nickname: recipient.nickname,
    picUrl: recipient.picUrl,
    hbdMessage: recipient.hbdMessage,
    scrollMsg: recipient.scrollMsg,
    openDate: recipient.openDate,
    birthDate: recipient.birthDate,
    sceneBackgrounds,
    sceneMessages,
    sceneActions,
    audio: legacyAudio,
  };

  return full;
}

export const config = parseAll();

// Back-compat name used by pages during the transition (circa-1993 etc.)
export const APP_CONFIG = config;

// Re-exports for types (canonical live in @/types per IIPS). 
// The consts (config, APP_CONFIG) are already exported above; consumers can import them directly.
export type { WebConfig, Recipient, CardMeta, Scene, Assets, Gift } from '@/types';

// (TOML-first, types-moved, egift-excised per configs-to-toml-2)
