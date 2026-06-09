# Project State — For Janell (FORJANELL)

**Current Working Directory**: `web/` (Astro project)
**Repo root context**: `/home/arepo/LOGOS/SOFTWARE/FORJANELL/`

## High-Level Identity

Personalized interactive digital birthday experience / "holographic eCard" for Janell (born 1993-05-02). 
Aesthetic: Frutiger Aero / glassy / bubbly / holographic / cosmic-girly. Heavy emphasis on delightful micro-interactions, haptics, audio design, and emotional warmth.

**Tagline / Vibe**: "A magical realm of gifts, messages, and surprises."

## Tech Stack (as of now)

- Astro 6 + SolidJS (reactive islands)
- Tailwind CSS v4 (via Vite plugin)
- Three.js (for the main 3D/ holographic card)
- TOML-driven content (configs/config.toml + gifts.toml)
- Custom canvas particle systems (see gift_overhaul)
- Audio: multiple .wav/.mp3 managed carefully to avoid overlap
- Haptics utility
- Deployed static (dist/ present)

## Key Areas (web/)

- `src/pages/` — index, about, gifts (incl. /gifts/circa-1993 main experience), messages
- `src/components/` — ThreeCard (core holographic interaction), FrutigerScenes, AeroCard, BubbleWishes, Hadacard/*, Orchid/*, PretextShift, MessageList, etc.
- `src/layouts/` — Application, Container
- `src/config/` — loads + augments config.toml (adds computed isBirthdayToday, getAge)
- `src/utils/` — haptics, parsers
- `public/resources/` — images (janell.png, foils/, backgrounds), sfx
- `configs/` — source-of-truth TOML for recipient + gift data
- `src/styles/` — global + page-specific

## Recent History / Evolution (from docs/)

- Major "gift page overhaul" for `/gifts/circa-1993`:
  - Replaced background images with custom interactive constellation canvas particle network (repulsion on mouse).
  - Personalized sceneMessages.
  - Careful audio architecture: global BGM pause/resume, continuous main.wav during visual novel, bubble.wav for micro-interactions.
  - Consistent tactile sound language.
- Ongoing refinement of the "Hadacard" / holographic card metaphor (ThreeCard + meta in TOML).

## Content Config Highlights (configs/config.toml)

- Recipient: Janell, pic at /resources/img/janell.png
- Birthdate: 1993-05-02 (age computation exists)
- Main eGift: "Relaxing Spa Treatment & Treats" $100 at Nirvana Wellness, code JELL-BDAY-2026-SPADAY
- Scene backgrounds, messages, actions all TOML-driven
- Gift shelf data also in TOML

## Invariants / Design Principles (observed)

- Extremely high attention to sensory detail (sound, haptics, motion, light).
- "Extracted from the quantum field" lore / playful cosmic language.
- No jank: careful audio management, zoom transitions, particle performance.
- Content is deeply personal — changes should feel like love letters, not generic features.
- TOML as the non-technical person's edit surface for text/content.

## Current Open Questions / Observations (initial)

- Two package managers visible (bun + npm lockfiles) — web/ has both bun.lock and package-lock.json.
- Parent dir has its own package.json + node_modules (bun-focused?) + docs/.
- No tests visible yet.
- Dist/ is committed (common for small static personal sites).
- The main delight is in the interactive "circa-1993" gift page + the 3D card.

## State Last Updated

Initial bootstrap via .agents/ setup — 2026-04.
This file should be edited (not replaced) as understanding deepens.
