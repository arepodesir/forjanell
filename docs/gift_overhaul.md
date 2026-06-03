# Gift Page Overhaul Documentation (circa-1993)

This document describes the architectural changes, user-experience design, and audio-flow enhancements implemented for Janell's 2026 main birthday gift route (`/gifts/circa-1993`).

## 1. Aesthetic Design (Interactive Canvas Particles)
To present a clean, high-performance, and visually stunning interactive experience, we removed all background images/GIFs from the visual novel page. They were replaced with a custom HTML5 Canvas particle generator:
- **Background Gradient:** A deep, premium night-sky gradient (`linear-gradient(135deg, #090c21 0%, #05060f 50%, #0d071a 100%)`).
- **Constellation Particle Network:** ~65 floating circles of cyan, pink, purple, and white. Close particles are linked by subtle, translucent glowing lines.
- **Interactivity:** Mouse movement on the screen triggers a soft repulsion force, causing particles to drift away from the cursor and grow slightly in size, creating a reactive field.
- **Responsive Layout:** The canvas size is bound to the window's dimensions and updates instantly on resize.

## 2. Walkthrough Customization
The dialogue sequence was customized in `src/config/config.toml` to be warmer and more personal:
1. *"Welcome to your special birthday space, Janell! 🫧✨"*
2. *"I built this little visual universe just for you to celebrate your warmth, kindness, and beauty."*
3. *"Let the music play, breathe in the good vibes, and pop this bubble to reveal your gift! 💖"*

## 3. Audio Stream Architecture
To prevent overlapping BGM issues and create a premium auditory feel:
- **Global Music Interruption:** The global BGM player (`window.globalBgmAudio`) is paused on component mount.
- **Immediate Visual Novel BGM:** The main birthday melody `main.wav` starts playing immediately in Scene 1 (before the last card is unlocked) and loops endlessly.
- **Silent Bubble Pop:** The transition pop sound effects were removed, allowing `main.wav` to play continuously and seamlessly without auditory interruptions during the transition.
- **BGM Restoration:** On component cleanup (exiting the page), the visual novel's music is paused, and the global BGM is resumed.

## 4. Click Sound Effect Alignment
All buttons and micro-interactions across the home, vault, cards, and bubble wishes pages have been transitioned from the default `blast.mp3` click sound to a gentle, tactile bubble pop sound effect (`bubble.wav`) to match the Girly Frutiger Aero design theme.
