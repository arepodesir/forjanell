# Review: fix-ux-styling-particles-orchid-messages (Main Multi-Fix)

**Job**: .agents/jobs/fix-ux-styling-particles-orchid-messages.job
**Date**: 2026-06
**Reviewer**: Grok (self)
**Status**: Pre-edit review complete. Authorizing main job + sub-tasks read. This document exists as the main gate. Sub-reviews (R-00x-*.md) will be written per sub-programme/task before their edits. **No source edits until respective review gates passed.**
**Flags**: Follows breakdown into tasks/* + programmes. Full pipeline per sub. nomistakes --vfs=.agents/*

## 1. Authorizing Scope
From main job: the 5-part request (about v-scroll, gifts no h-scroll, messages to toml + openable (keep 1), particles stylized sea Perlin gradients SVG noise, orchid full centered on load).

Broken into T-001 to T-005 tasks + corresponding P-00x sub-programmes + this main.

This main review authorizes the overall, with explicit per-task scope in sub-reviews/programmes. Changes only after sub-review gates.

Authorized high-level:
- About: vertical scroll on content.
- Gifts: remove h-scroll.
- Messages + parser + toml + MessageList: config-driven, openable, 1 kept on page.
- Particles (FrutigerScenes canvas primary): stylized.
- OrchidViewer: full centered framing on load.

## 2. Pre-Reads
- Main job + sub tasks + sub programmes.
- Key files: about/index.astro (long glass content in Container), gifts/index.astro (has v-scroll wrapper but possible h issues), messages/index.astro + MessageList.tsx (hardcoded 4 msgs, grid cards with Pretext), config/config.ts + types (toml parsers for gifts/scenes), FrutigerScenes.tsx (canvas particles + girly hearts/sparks, mouse, connect), OrchidViewer.tsx (Three load, camera, model pos, controls, bounds, lookAt), Container.astro (overflow-y-auto flex), home particles if relevant (mouse-bubble script + css), public/assets for svgs/imgs, configs/ dir.
- Previous VFS context for consistency (scroll fixes, orchid prior, Hadacard etc.).

## 3. Scope + Breakdown
See sub tasks/programmes for atomic details. Main authorizes coordinated changes via sub gates.

**Per sub (detailed in their reviews):**
- T-001/P-001: about v-scroll (e.g. inner max-h + overflow-y on the glass or content wrapper).
- T-002/P-002: gifts h-scroll removal (overflow-x-hidden, width audits on cards/ribbons).
- T-003/P-003: messages toml (create toml, parser update, page uses 1 + config, MessageList openable e.g. click expands/modal).
- T-004/P-004: particles (enhance FrutigerScenes canvas: gradients in ctx, noise func for Perlin sea (layered sin for noisiness/jitter), SVG-inspired (paths or filters sim), well distributed layers, animated flow).
- T-005/P-005: orchid (post-load bounds -> camera dist/pos/lookAt for full centered fill on load; no half-float).

## 4. Risks + Mitigations
- Parser: must not break existing tomls (add messages section gracefully).
- Scroll: mobile safe areas, preserve gifts v-scroll + about interactive (sparks).
- Particles: perf (keep count cap, RAF), theme fit (evolve girly to sea but keep colors/feel).
- Orchid: must not break existing orbit/zoom/tap/auto in scene context; container h-screen aware.
- Openable messages: nice, not breaking list view or Pretext.
- All: IIPS, build after each sub, mental + grep verify.

Sub-reviews will detail per-task risks/verifs.

## 5. Invariants
- See main programme + sub ones. VFS full per sub (task -> prog -> review gate -> log -> edit).
- Magic preserved (glass, haptics, 3d, particles as immersive, orchid as reveal).
- Config driven where specified.

## 6. Exact Notes
- Sub reviews will be written before their P-00x-2 impl phases.
- Main log + sub logs for all.
- Grouped or sequential impl ok as long as gates per sub.
- Final main history summarizing all.

**This main review + sub reviews authorize the full job execution via the breakdown pipeline.**

Next: sub reviews as needed, logs, phased impl after gates, builds, VFS close.