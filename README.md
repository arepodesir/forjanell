# 🌸 For Janell 

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXZqMXdwNjhpdHZ6Z2o4cXA4YnVzcnlydHlzcDR4amQxZzZpZ3dzbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MC1Mh2YnUfGDa/giphy.gif" alt="Super Cute Looping Birthday Cake" width="300" />
</p>

## 🎉 Happy Birthday, Janell! 🥳🎈🔮

Welcome to **For Janell**, a fully custom, interactive visual-novel style birthday card e-card app! 💌 Built with love and updated yearly, this app takes Janell on a mini-story adventure through different atmospheric scenes, culminating in a beautiful, interactive **holographic birthday card**! 💿✨





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

<p align="center">Made with 💖, for Janell!</p>