import { parse } from 'smol-toml';

function toml(input) {
  return parse(input);
}

const assetsRaw = "\n[[audio]]\nname = \"main\"\npath = \"/assets/audio/main.wav\"\n\n[[image]]\nname = \"main\"\npath = \"/assets/img/janell.png\"\n\n[[image]]\npath = \"/assets/img/jaja.png\"\n\n[[image]]\npath = \"/assets/img/nature.jpg\"\n\n\n";

const cardsRaw = "# ─── Hadacard + Recipient + eGift Domain ────────────────────────────────────\n# IIPS: Clear nested tables for cardMeta/egift/recipient. No magic numeric keys.\n# This is the prescriptive source for holographic card data and voucher.\n\n[recipient]\nname = \"For Janell\"\nnickname = \"Janell\"\npicUrl = \"/resources/img/janell.png\"\nhbdMessage = \"Happy Belated Birthday!\"\nscrollMsg = \"Hey JANELL! Today is YOUR day. The stars aligned, the crystals collapsed, and this card extracted itself from the quantum field just for you. May every moment sparkle with joy, every dream glow with possibility, and every heartbeat pulse with love. You are absolutely amazing. Never forget that. Happy Birthday, beautiful soul!\"\nopenDate = \"\"\nbirthDate = \"1993-05-02\"\n\n[cardMeta]\nedition = \"Birthday Edition\"\nseries = \"Digital Card\"\nid = \"HC-001\"\nrarity = \"✦ Ultra Rare Holo\"\nyear = \"2026\"\nartist = \"AREPO\"\n\n[egift]\ntitle = \"Relaxing Spa Treatment & Treats\"\nvalue = \"$100\"\nmerchant = \"Nirvana Wellness\"\ncode = \"JELL-BDAY-2026-SPADAY\"\ninstructions = \"Show this golden ticket to redeem your special birthday spa day & double-shot coffee pastry combo! 💆‍♀️☕🧁\"\n";

const giftsRaw = "[[gift]]\nyear = \"2026\"\ntitle = \"Happy Belated Birthday\"\nemoji = \"🎁\"\nstatus = \"Active\"\ndescription = \"An interactive visual novel card unlocking a claimable relaxation package.\"\nlink = \"/gifts/circa-1993\"\nactive = true\n";

const scenesRaw = "[[scene]]\nid = 1\nbackground = \"/resources/img/stars.png\"\nmessages = \"Welcome to your special birthday space, Janell! 🫧✨\"\naction = { emoji = \"🫧\", label = \"Teehee\" }\n\n\n[[scene]]\nid = 2\nbackground = \"/resources/img/stars.png\"\nmessages =  \"I built this little visual universe just for you to celebrate your warmth, kindness, and beauty.\"\naction = { emoji = \"🫧\", label = \"Teehee\" }\n\n\n[[scene]]\nid = 3\nbackground = \"/resources/img/stars.png\"\nmessages =   \"Let the music play, breathe in the good vibes, and pop this bubble to reveal your gift! 💖\"\naction = { emoji = \"🫧\", label = \"Teehee\" }\n";

const baseRaw = "name = \"For Janell\"\nnickname = \"Janell\"\npicUrl = \"/assets/img/janell.png\"\nbirthDate = \"1993-05-02\"\n\n";

const messagesRaw = "[[message]]\nsender = \"Arepo 💖\"\nrelation = \"Best Friend\"\ntext = \"\"\" Hope you have an amazing day filled with love, laughter, and endless sparkles. \n           You deserve the absolute world! ✨\"\"\"\ncolor = \"border-aero-pink shadow-aero-pink/20\"\ngradient = \"from-pink-500/20 to-purple-500/20\"\n\n";

function parseAll() {
  const base = toml(baseRaw);
  const cards = toml(cardsRaw);
  const scenesParsed = toml(scenesRaw);
  const assetsParsed = toml(assetsRaw);
  const giftsParsed = toml(giftsRaw);
  const messagesParsed = toml(messagesRaw);
  const messages = messagesParsed?.message || (Array.isArray(messagesParsed) ? messagesParsed : []);
  const recipient = {
    name: cards.recipient?.name || base.name || "For Janell",
    nickname: cards.recipient?.nickname || base.nickname || "Janell",
    picUrl: cards.recipient?.picUrl || base.picUrl || "/resources/img/janell.png",
    hbdMessage: cards.recipient?.hbdMessage || "Happy Belated Birthday!",
    scrollMsg: cards.recipient?.scrollMsg || "",
    openDate: cards.recipient?.openDate || "",
    birthDate: cards.recipient?.birthDate || base.birthDate || "1993-05-02"
  };
  const cardMeta = cards.cardMeta || {
    edition: "Birthday Edition",
    series: "Digital Card",
    id: "HC-001",
    rarity: "✦ Ultra Rare Holo",
    year: "2026",
    artist: "AREPO"
  };
  const rawScenes = scenesParsed.scene || [];
  const scenes = rawScenes.length ? rawScenes.map((s, idx) => {
    const id = s.id ?? idx + 1;
    const bg = s.background || "/resources/img/stars.png";
    let msgs;
    if (Array.isArray(s.messages)) {
      msgs = s.messages;
    } else if (typeof s.messages === "string" && s.messages.trim()) {
      msgs = [s.messages];
    } else {
      msgs = ["..."];
    }
    const action = s.action || { emoji: "🫧", label: "Continue" };
    return { id, background: bg, messages: msgs, action };
  }) : [
    {
      id: 1,
      background: "/resources/img/stars.png",
      messages: [
        "Welcome to your special birthday space, Janell! 🫧✨",
        "I built this little visual universe just for you to celebrate your warmth, kindness, and beauty.",
        "Let the music play, breathe in the good vibes, and pop this bubble to reveal your gift! 💖"
      ],
      action: { emoji: "🫧", label: "Pop Bubble & Reveal Card" }
    }
  ];
  const audioRec = {};
  (assetsParsed.audio || []).forEach((a) => {
    if (a.name && a.path) audioRec[a.name] = a.path;
  });
  const imageRec = {};
  (assetsParsed.image || []).forEach((im) => {
    if (im.name && im.path) imageRec[im.name] = im.path;
    else if (im.path) {
      const k = im.path.split("/").pop()?.replace(/\.[^.]+$/, "") || "img";
      imageRec[k] = im.path;
    }
  });
  const assets = {
    audio: Object.keys(audioRec).length ? audioRec : { main: "/assets/audio/main.wav", hbd: "/assets/audio/main.wav" },
    images: Object.keys(imageRec).length ? imageRec : {
      janell: "/resources/img/janell.png",
      stars: "/resources/img/stars.png",
      nature: "/resources/img/nature.jpg"
    }
  };
  const gifts = giftsParsed?.gift || (Array.isArray(giftsParsed) ? giftsParsed : []);
  const computed = {
    isBirthdayToday: () => {
      const today = /* @__PURE__ */ new Date();
      return today.getMonth() === 4 && today.getDate() === 2;
    },
    getAge: () => {
      const birth = new Date(recipient.birthDate);
      const today = /* @__PURE__ */ new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || m === 0 && today.getDate() < birth.getDate()) age--;
      return age || 33;
    }
  };
  const sceneBackgrounds = {};
  const sceneMessages = {};
  const sceneActions = {};
  scenes.forEach((s) => {
    sceneBackgrounds[s.id] = s.background;
    sceneMessages[s.id] = s.messages;
    sceneActions[s.id] = s.action;
  });
  if (scenesParsed.backgrounds?.length) {
    const alt = scenesParsed.backgrounds[0];
    if (alt.path) sceneBackgrounds[alt.id ?? 2] = alt.path;
  }
  const legacyAudio = assets.audio;
  const full = {
    recipient,
    cardMeta,
    scenes,
    assets,
    gifts,
    gift: gifts,
    // compat for pages that read config.gift
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
    messages
    // from messages.toml (page uses 1 + config for openable list)
  };
  return full;
}
const config = parseAll();
const APP_CONFIG = config;

export { APP_CONFIG as A, config as c };
