# Validation & Verification Checklist

To verify that the application is running and performing as expected, perform the following validation steps:

## 🌐 1. Navigation & Hub Verification
- [ ] Open the main page (`/`).
- [ ] Verify the Ghibli nature loop GIF renders as the background.
- [ ] Drag your mouse across the screen and confirm that glossy, semi-transparent bubble particles trail the cursor and float upwards.
- [ ] Verify that 4 separate bubble options appear (About Jell, Main Gift, Messages, Wishes).
- [ ] Hover over each bubble; verify they scale up, rotate slightly, and change cursor to pointer.

## 🎵 2. Global Persistent Background Audio Verification
- [ ] On `/`, click anywhere on the page to trigger background playback.
- [ ] Verify the soft piano music box BGM (`hbd.mp3`) begins playing.
- [ ] Check that a floating `🎵` button appears in the top-right corner.
- [ ] Click the toggle; verify it updates to `🔇` and mutes the audio. Unmute it to resume.
- [ ] Navigate to `/about`, `/messages`, and `/wishes`; verify that BGM continues playing smoothly without resetting to the beginning.

## 🌀 3. Zoom Transition Verification
- [ ] Click on the **About Jell** bubble.
- [ ] Verify that a cyan colored bubble expansion overlay zoom-transitions smoothly.
- [ ] Confirm you are redirected to `/about`.
- [ ] Click the "🏠 Back Home" button to return to `/`.
- [ ] Repeat for the **Main Gift** (pink zoom, `/gifts`), **Messages** (violet zoom, `/messages`), and **Wishes** (green zoom, `/wishes`).

## 🎁 4. Gift Vault Shelf Verification
- [ ] Navigate to `/gifts`.
- [ ] Verify three cards render: 2024, 2025, and 2026.
- [ ] Confirm 2024 and 2025 display "Archived" with disabled controls.
- [ ] Confirm 2026 is highlighted, pulsing, and has an active "🎁 Unwrap Gift 2026" button.
- [ ] Click "🎁 Unwrap Gift 2026" and verify the zoom transition directs to `/gifts/card`.

## 🎴 5. Gifts VN & Card Verification
- [ ] On `/gifts/card`, verify that the global persistent player pauses.
- [ ] Go through the 4 scenes:
  - [ ] **Scene 1 (Dark Bedroom):** Switch on light (plays `switch.mp3` click, ambient BGM starts).
  - [ ] **Scene 2 (Meadow/Garden):** Enter Corridor (plays `door.mp3` door opening, ambient BGM continues).
  - [ ] **Scene 3 (Hallway Portal):** Travel to Stars (plays `blast.mp3` warp sound, ambient BGM pauses, loops `haunted-bgm.mp3`).
  - [ ] **Scene 4 (Stars Galaxy):** Open gift box (haunted BGM pauses, plays `blast.mp3` explosion, starts looping final song gift `main.wav`).
- [ ] Verify card reveal:
  - [ ] Confirm Janell's portrait renders in the round profile photo bubble with the birthday cap and animated candles.
  - [ ] Verify the scrolling text rolls up.
  - [ ] Move cursor over the holographic card; verify the shine and glare layers shift dynamically matching mouse coordinate offsets.

## 🎟️ 6. e-Gift Voucher & 3D Flipping Verification
- [ ] Click the **🎁 Claim e-Gift!** button next to "Enjoy your Day!".
- [ ] Verify the blur modal opens showing the Golden Ticket (Front).
- [ ] Hover over the ticket; click on it to check that it flips smoothly to the Back.
- [ ] Verify the back displays the neon claim code (`JELL-BDAY-2026-SPARKLE`), redemption details, and a mock barcode.
- [ ] Click it again to flip back to the Front.
- [ ] Click "Close Voucher" to return to the ecard.

## 🫧 7. Bubble Popping Verification
- [ ] Navigate to `/wishes`.
- [ ] Verify 6 floating bubbles bounce around inside the frosted glass container.
- [ ] Click a bubble; verify `blast.mp3` sound plays, the bubble disappears, and a modal card appears displaying a birthday blessing.
- [ ] Click the modal CTA "Keep Popping!" and verify it closes, enabling popping of remaining bubbles.
