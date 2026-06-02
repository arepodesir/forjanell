# 🌸 For Janell 🌸 — The Ultimate Interactive Birthday eCard! 🎂✨💖

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXZqMXdwNjhpdHZ6Z2o4cXA4YnVzcnlydHlzcDR4amQxZzZpZ3dzbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MC1Mh2YnUfGDa/giphy.gif" alt="Super Cute Looping Birthday Cake" width="300" />
</p>

## 🎉 Happy Birthday, Janell! 🥳🎈🔮

Welcome to **For Janell**, a fully custom, interactive visual-novel style birthday card e-card app! 💌 Built with love and updated yearly, this app takes Janell on a mini-story adventure through different atmospheric scenes, culminating in a beautiful, interactive **holographic birthday card**! 💿✨

---

## 🎬 How the eCard Works (The Quest for the Gift 🎁)
The card starts with a playful visual novel sequence:
1. **Scene 1: The Dark Bedroom 💡** — It's pitch black! Click the lightbulb button (sfx switch) to see what's happening.
2. **Scene 2: The Clear Nature Skies 🚪** — A beautiful open field, but it's empty! Time to head outside (sfx door).
3. **Scene 3: The Hallway at Twilight 🚪** — It's mysterious and atmospheric (mystic background music). Better head back inside!
4. **Scene 4: The Stars & Magic Room 🎁** — A surprise box appears! Click to open it!
5. **The Blast 💥** — Confetti and balloon pop!
6. **Scene 6: The Holographic Card 🎴✨** — A beautiful custom birthday card is revealed:
   - Dynamic **Confetti** & floating **Balloons** 🎈
   - Letter-by-letter **3D fly-in animations** for the birthday wishes! ✍️
   - A **Holographic shimmer overlay** that reacts dynamically to mouse hover and touch movement! 🖱️📱
   - Custom birthday music (piano theme) looping in the background! 🎹🎶

---

## 🚀 Tech Stack & Design Inspirations 🛠️🎨

This project is built using a modern, lightweight, high-performance web stack:
- **Astro v6** 🚀 — The framework of choice for super-fast content delivery.
- **SolidJS** ⚛️ — Used to drive the interactive visual novel state and reactive holographic rendering with zero-overhead reactivity.
- **Vite & TailwindCSS v4** ⚡ — For cutting-edge CSS utilities and blazingly fast development builds.
- **HTML5 Web Audio API** 🎵 — To handle seamless scene transitions and custom immersive sound effects (switch clicks, creaking doors, magical chimes, and birthday tunes).

### 🔮 Design Inspiration:
- **Frutiger Aero** 🫧🐳 — The aesthetic combines vibrant colors (cyans, pinks, magentas, golds), glossy buttons, transparent glassmorphism (`aero-glass`), bubble burst animations, and organic-digital elements.
- **PokeCards Holo Effect** 🎴 — The holographic card glare, glitter, and shine layers use custom blend modes (`color-dodge`, `exclusion`, `hard-light`) to dynamically track the cursor or float in a subtle automatic shimmer loop.
- **Pretext-Style Letter Animations** 📖 — The letter-block animations flip and fade in sequentially to make the text feel physical and alive.

---

## 📅 Updating the eCard Yearly (For the Developer 🛠️)

This project is designed to be easily configurable so it can be updated every year with fresh messages, scenes, and media! 🗓️

All you need to do is modify the configuration object inside **`web/src/config/config.ts`**:

```typescript
export const APP_CONFIG = {
  // ─── Recipient Details ───────────────────────────────
  name: "For Janell",
  nickname: "Janell",
  picUrl: "https://telegra.ph/file/cab24ce49882fbae39a13.png", // Update profile pic URL!

  // ─── Birthday Message (HBD text on the card) ────────
  hbdMessage: "Happy Belated Birthday!",

  // ─── Scrolling Message (letter-animated on the card) ─
  scrollMsg: "Hey Jell! Today is YOUR day...",

  // ─── Date Configuration ──────────────────────────────
  openDate: "2026-05-02", // Set the date to unlock the card!
  birthDate: "1993-05-02",

  // ─── Card Metadata ──────────────────────────────────
  cardMeta: {
    edition: "Quantum Extract · First Edition", // Update version/series!
    series: "Hadacard™ Crystalline Series",
    id: "HC-001",
    rarity: "✦ Ultra Rare Holo",
    year: "2026",
    artist: "The Universe",
  },
  // ...
};
```

If the current date is before `openDate`, the recipient will see a cute **"Come Back Later..."** guard screen! ⏰ If they open it late, they will see a **"The Party is Over"** (but still sweet) card! 💖 Leaving `openDate` empty bypasses the gate for easy testing.

---

## 🛠️ Local Development & Deployment 💻

To run the card locally:

1. **Navigate to the web directory**:
   ```bash
   cd web
   ```
2. **Install dependencies**:
   ```bash
   bun install # or npm install
   ```
3. **Start the development server**:
   ```bash
   bun run dev # or npm run dev
   ```
4. **Build for production**:
   ```bash
   bun run build # or npm run build
   ```

---

<p align="center">Made with 💖, 🫧, and 🛸 for Janell!</p>