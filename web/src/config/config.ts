export const APP_CONFIG = {
  // ─── Recipient Details ───────────────────────────────
  name: "For Janell",
  nickname: "Janell",
  picUrl: "/resources/img/janell.png",

  // ─── Birthday Message (HBD text on the card) ────────
  hbdMessage: "Happy Belated Birthday!",

  // ─── Scrolling Message (letter-animated on the card) ─
  scrollMsg:
    "Hey Jell! Today is YOUR day. The stars aligned, the crystals collapsed, and this card extracted itself from the quantum field just for you. May every moment sparkle with joy, every dream glow with possibility, and every heartbeat pulse with love. You are absolutely amazing. Never forget that. Happy Birthday, beautiful soul!",

  // ─── Date Configuration ──────────────────────────────
  // Leave openDate empty to bypass time gate for demo
  openDate: "", // e.g. "2026-05-02"
  birthDate: "1993-05-02",

  // ─── Card Metadata ──────────────────────────────────
  cardMeta: {
    edition: "Quantum Extract · First Edition",
    series: "Hadacard™ Crystalline Series",
    id: "HC-001",
    rarity: "✦ Ultra Rare Holo",
    year: "2026",
    artist: "The Universe",
  },

  // ─── Scene Background Images ─────────────────────────
  // Uses the visual novel themed resources from the source project
  sceneBackgrounds: {
    1: "/resources/img/bedroom.png",   // Visual novel bedroom (dark room)
    2: "/resources/img/nature.png",    // Visual novel nature (clear skies)
    3: "/resources/img/Hallway.png",   // Visual novel hallway (twilight)
    4: "/resources/img/stars.png",     // Stars / magical (gift room)
  },

  // ─── Scene Messages ──────────────────────────────────
  sceneMessages: {
    1: [
      "Hey!",
      "Why is it so dark in here?",
      "Can you switch on the lights?",
    ],
    2: [
      "Ok! Why is it so empty here?",
      "You know what, let's move outside.",
      "Let's see if anyone's over there...",
    ],
    3: [
      "Wait...",
      "Maybe it's a bit late to walk the hallway.",
      "Things are mysterious here...",
      "I think we should go back inside.",
    ],
    4: [
      "Wow! That was something weird.",
      "Hey look! There's a gift for you..",
      "C'mon, let's open it and see what's in there!",
    ],
  },

  // ─── Scene Action Labels ─────────────────────────────
  sceneActions: {
    1: { emoji: "💡", label: "Switch On" },
    2: { emoji: "🚪", label: "Go Outside" },
    3: { emoji: "🌈", label: "Go Back" },
    4: { emoji: "🎁", label: "Open Gift" },
  },

  // ─── Audio Files ─────────────────────────────────────
  audio: {
    switch: "/resources/sfx/switch.mp3",
    door: "/resources/sfx/door.mp3",
    mystic: "/resources/sfx/haunted-bgm.mp3",
    blast: "/resources/sfx/blast.mp3",
    hbd: "/resources/sfx/hbd.mp3", // Piano music — plays ONLY at the final card reveal
  },
};
