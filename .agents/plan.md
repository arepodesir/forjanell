# Implementation Plan: ForJanell Gift Vault Overhaul

We are performing a major overhaul of the `/gifts/circa-1993` production route, replacing background imagery with an interactive, fullscreen particle field, personalizing the walkthrough, and refining the audio flow.

## 1. Core Changes

### A. Sound Effect Replacement (Default Click to Bubble)
- Replace all occurrences of `/resources/sfx/blast.mp3` with `/resources/sfx/bubble.wav` across the application.
- The `bubble.wav` file has been downloaded from a high-quality hitsound source to `public/resources/sfx/bubble.wav`.

### B. Audio Flow Overhaul in Visual Novel (`FrutigerScenes.tsx`)
- Pause the global BGM (`window.globalBgmAudio`) on mount to prevent audio overlap.
- Replace the ambient bubble loop audio that plays in Scene 1 with `main.wav` (`props.audio.hbd`).
- Make `main.wav` repeat and loop seamlessly from the start of Scene 1, carrying over into Scene 2 without interruption.
- Remove the default bubble pop transition sound (`sfxPop`) to make the bubble pop completely silent musically, letting the looping `main.wav` play cleanly.
- Restore the global BGM on cleanup when exiting the page.

### C. Personalization of Walkthrough
- Make the introduction messages in `config.toml` warmer, more personal, and meaningful to Janell.

### D. Fullscreen tsparticles-style Background Field
- Remove background images/GIFs from the visual novel page entirely.
- Implement an interactive, beautiful HTML5 Canvas particle system inside `FrutigerScenes.tsx` that renders fullscreen behind all content.
- Draw floating glowing nodes (in cyan, pink, purple, and white) that connect with faint, elegant lines when close to each other.
- Add mouse interactivity: particles should gently react to pointer movement.
- Set a deep, rich gradient background (`bg-gradient-to-br from-[#0c0f26] via-[#070913] to-[#120a1f]`) for maximum premium aesthetics.

## 2. Affected Files
- `/home/arepo/LOGOS/SOFTWARE/FORJANELL/CODE/web/src/config/config.toml`
- `/home/arepo/LOGOS/SOFTWARE/FORJANELL/CODE/web/src/components/FrutigerScenes.tsx`
- `/home/arepo/LOGOS/SOFTWARE/FORJANELL/CODE/web/src/pages/index.astro`
- `/home/arepo/LOGOS/SOFTWARE/FORJANELL/CODE/web/src/pages/gifts/index.astro`
- `/home/arepo/LOGOS/SOFTWARE/FORJANELL/CODE/web/src/components/ThreeCard.tsx`
- `/home/arepo/LOGOS/SOFTWARE/FORJANELL/CODE/web/src/components/BubbleWishes.tsx`

## 3. Documentation Requirements
- Record work in `/home/arepo/LOGOS/SOFTWARE/FORJANELL/CODE/.agents/logs.md`.
- Create a detailed architectural and user-experience guide in `/home/arepo/LOGOS/SOFTWARE/FORJANELL/CODE/docs/gift_overhaul.md`.
