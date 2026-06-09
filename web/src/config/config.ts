
import { toml } from '@/utils/parsers';

import assetsRaw from '@@/web/configs/assets.toml?raw';
import cardsRaw from '@@/web/configs/cards.toml?raw';
import giftsRaw from '@@/web/configs/gifts.toml?raw';
import scenesRaw from '@@/web/configs/scenes.toml?raw';
import baseRaw from '@@/web/configs/config.toml?raw';


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

export interface Egift {
  title: string;
  value: string;
  merchant: string;
  code: string;
  instructions: string;
}

export interface Scene {
  id: number;
  background: string;
  messages: string[];
  action: { emoji: string; label: string };
}

export interface Assets {
  audio: Record<string, string>;
  images: Record<string, string>;
}

export interface Gift {
  year: string;
  title: string;
  emoji: string;
  status: string;
  description: string;
  link: string;
  active: boolean;
}

export interface WebConfig {
  // Rich structured (new code + hook should prefer these)
  recipient: Recipient;
  cardMeta: CardMeta;
  egift: Egift;
  scenes: Scene[];
  assets: Assets;
  gifts: Gift[];

  // Computed (in-project, single source)
  computed: {
    isBirthdayToday: () => boolean;
    getAge: () => number;
  };

  // Legacy flat shape (for existing views during/after refactor)
  // (cardMeta, egift, recipient etc. already declared above and are used as the flat fields too)
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

function parseAll(): WebConfig {
  const base = toml(baseRaw) as Partial<Recipient> & { name?: string; nickname?: string };
  const cards = toml(cardsRaw) as {
    recipient?: Recipient;
    cardMeta?: CardMeta;
    egift?: Egift;
  };
  const scenesParsed = toml(scenesRaw) as { scenes?: Scene[]; backgrounds?: Array<{ id: number; path: string }> };
  const assetsParsed = toml(assetsRaw) as { audio?: Record<string, string>; images?: Record<string, string> };
  const giftsParsed = toml(giftsRaw) as { gift?: Gift[] } | Gift[];

  // Recipient + card domain primarily from cards.toml (split source of truth)
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

  const egift: Egift = cards.egift || {
    title: "Relaxing Spa Treatment & Treats",
    value: "$100",
    merchant: "Nirvana Wellness",
    code: "JELL-BDAY-2026-SPADAY",
    instructions: "Show this golden ticket to redeem your special birthday spa day & double-shot coffee pastry combo! 💆‍♀️☕🧁",
  };

  const scenes: Scene[] = scenesParsed.scenes || [
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

  const assets: Assets = {
    audio: assetsParsed.audio || { bubble: "/assets/audio/main.wav", hbd: "/assets/audio/main.wav", pop: "" },
    images: assetsParsed.images || {
      janell: "/resources/img/janell.png",
      stars: "/resources/img/stars.png",
      nature: "/resources/img/nature.jpg",
    },
  };

  const gifts: Gift[] = (giftsParsed as any)?.gift || (Array.isArray(giftsParsed) ? giftsParsed : []);

  // Computed (preserved + centralized)
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

  // Legacy flat/Record shape so FrutigerScenes (and similar) keep working without full rewrite.
  // scene* Records use the numeric keys the view indexes with [1].
  const sceneBackgrounds: Record<number, string> = {};
  const sceneMessages: Record<number, string[]> = {};
  const sceneActions: Record<number, { emoji: string; label: string }> = {};

  scenes.forEach((s) => {
    sceneBackgrounds[s.id] = s.background;
    sceneMessages[s.id] = s.messages;
    sceneActions[s.id] = s.action;
  });

  // Support the alternate bg if declared
  if (scenesParsed.backgrounds?.length) {
    sceneBackgrounds[2] = scenesParsed.backgrounds[0].path;
  }

  const legacyAudio = assets.audio;

  const full: WebConfig = {
    recipient,
    cardMeta,
    egift,
    scenes,
    assets,
    gifts,
    gift: gifts, // compat for pages that read config.gift
    computed,
    // flat legacy fields (for prop spread / direct access in views)
    // cardMeta / egift already provided by the rich declarations above
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

export type { WebConfig };

/* (old type/process stub fully removed — TOML-first config system is now the single source per IIPS) */
