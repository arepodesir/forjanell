# Validation & Verification Checklist

To verify that the application is running and performing as expected, perform the following validation steps:

## 🌐 1. Navigation & Hub Verification
- [ ] Open the main page (`/`).
- [ ] Verify the studio Ghibli nature loop GIF renders as the background.
- [ ] Drag your mouse across the screen and confirm that glossy, semi-transparent bubble particles trail the cursor and float upwards.
- [ ] Verify that 4 separate bubble options appear (About Jell, Main Gift, Messages, Wishes).
- [ ] Hover over each bubble; verify they scale up, rotate slightly, and change cursor to pointer.

## 🌀 2. Zoom Transition Verification
- [ ] Click on the **About Jell** bubble.
- [ ] Verify that a cyan colored bubble expansion overlay zoom-transitions smoothly.
- [ ] Confirm you are redirected to `/about`.
- [ ] Click the "🏠 Back Home" button to return to `/`.
- [ ] Repeat for the **Main Gift** (pink zoom, `/gifts`), **Messages** (violet zoom, `/messages`), and **Wishes** (green zoom, `/wishes`).

## 🎁 3. Gifts VN & Card Verification
- [ ] On `/gifts`, go through the 4 scenes:
  - [ ] **Scene 1 (Dark Bedroom):** Switch on light (switch SFX).
  - [ ] **Scene 2 (Nature):** Go outside (door SFX).
  - [ ] **Scene 3 (Hallway):** Walk the hallway (door SFX, loops mystic haunted BGM).
  - [ ] **Scene 4 (Stars):** Open gift box (mystic BGM stops, door SFX plays, then blast SFX).
- [ ] Verify card reveal:
  - [ ] Confirm Janell's portrait (`/resources/img/janell.png`) renders in the round profile photo bubble with the birthday cap and animated candles.
  - [ ] Verify the scrolling text rolls up.
  - [ ] Verify the piano BGM loops seamlessly.
  - [ ] Move cursor over the holographic card; verify the shine and glare glare layers shift dynamically matching mouse coordinate offsets.

## 🫧 4. Bubble Popping Verification
- [ ] Navigate to `/wishes`.
- [ ] Verify 6 floating bubbles bounce around inside the frosted glass container.
- [ ] Click a bubble; verify `blast.mp3` sound plays, the bubble disappears, and a modal card appears displaying a birthday blessing.
- [ ] Click the modal CTA "Keep Popping!" and verify it closes, enabling popping of remaining bubbles.
