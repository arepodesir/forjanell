# Review: fix-orchid-pedestal-rotation

**Job**: .agents/jobs/fix-orchid-pedestal-rotation.job
**Date**: 2026-06-10
**Reviewer**: Grok (self)
**Status**: Pre-edit review. Authorizing job read. Sources (OrchidViewer.tsx, FrutigerScenes usage, current 3D interaction) read. Build previously verified clean.

## Scope
- Fix usability of the orchid 3D viewer in the end gift scene.
- Add visible base + bottom of container (pedestal visual + framing so base isn't cut off).
- Only rotatable like a thing on a spinable pedestal: restrict to Y-axis spin/rotation only (no free pitch orbit from drag).
- Better, intuitive pinch scaling (direct model scale on pinch for physical feel, good limits/sensitivity, also improve wheel).
- Container borderless (remove border from viewer wrapper).
- Add a 3D text element in the Three.js scene, styled as a gift tag (cute paper tag with string/hole, orchid-themed colors, rounded), saying something like "Orchids :)" in gift-tag style.

## Current State
- Full 3D orbit (yaw+pitch from drag).
- Pinch/wheel only adjusts camera distance (not super intuitive for "the thing on pedestal").
- Container has `border border-white/10`.
- No pedestal/base visual; model may float or base not emphasized at bottom of view.
- No 3D text/gift tag in scene.
- Other features (sparkles, wiggles via state, auto, guided buttons, audio hook via external) from prior iterations are present and should be preserved where possible.

## Decisions (IIPS)
- Drag: only horizontal dx affects yaw (spin). Vertical drag ignored for rotation (pure pedestal spin).
- Pinch: switch primary to model.scale (clamped 0.4-4.0) for intuitive "grabbing and resizing the physical orchid on its stand". Keep some distance adjust as fallback or combined.
- Wheel: also affects model scale (intuitive).
- Add pedestal: simple cylinder + subtle ring at bottom in scene, positioned so orchid "sits" on it and bottom of the 3D view/container shows the base nicely. May slightly adjust camera look or model y for framing.
- Borderless: strip `border border-white/10` from the main viewer div (keep rounded + dark bg for contrast if needed).
- 3D gift tag: use CanvasTexture to draw a cute gift-tag (cream/pink rounded card, top hole + pink string lines, decorative dots/leaves, cursive text "Orchids :)" in theme colors). Plane mesh, attached as child to the model (so it spins with the pedestal/orchid). Positioned to the side/front, slight tilt for 3D tag look. No new deps.
- Preserve: model centering, animation/mixer/wiggles (will look great spinning on pedestal), sparkles on tap, state machine, audio integration, loading states, high-dpi, cleanup.
- The guided buttons can stay (they provide nice preset spins), but their handlers can be left or lightly adapted (they set yaw primarily now).
- Hint text at bottom updated to reflect new controls: "SPIN THE PEDESTAL • PINCH TO SCALE • TAP FOR MAGIC"

## Risks & Mitigations
- Changing interaction model: users (esp previous) may expect full orbit. But per explicit request for "only rotatable like ... spinable pedestal", it's the goal. Sparkle tap and auto still provide delight.
- Scaling on model vs camera: model scale makes the orchid grow/shrink in place on its base — very intuitive for a physical gift on a stand. Camera framing stays reasonable within limits.
- Gift tag text: canvas drawing is reliable, no font loading issues. Keep simple and charming.
- Bottom/base visibility: pedestal + slight framing tweak ensures "base along with the bottom of container" is satisfied without clipping or empty space.
- Performance: canvas tag texture once at load, plane is cheap. Pedestal is low-poly.
- Audio/player integration: untouched (the what-friends-are-for song + MusicTitlebar in the reveal scene remain).

## Verification
- `cd web && bun run build` — must succeed.
- Load the gift end scene (open the letter to orchid reveal): 
  - Orchid sits on visible pedestal/base at the bottom of the (now borderless) container/view.
  - Horizontal drag only spins the whole thing (orchid + tag) around Y like a pedestal — no pitch.
  - Pinch (two fingers) intuitively scales the orchid model (bigger/smaller on the stand).
  - Wheel also scales.
  - 3D gift tag visible in scene, cute paper tag style with "Orchids :)" text, spins with the model.
  - Container has no border line.
  - Existing sparkle on tap, auto-orbit (yaw only), wiggles, music player (titlebar with Dionne song) all continue to work.
- Mobile touch: pinch and single drag feel natural.
- No regressions to previous "sentient" features or the audio at end.

## Pre-Change Sign-off
Authorizing job read, sources read, review written. Only after this will edits to OrchidViewer (and minor usage if needed) occur. Will update log/programme/history after. Builds after edits.

Next: implement the pedestal, restricted rotation, intuitive scale, borderless container, and 3D gift tag text. Then verify build.

This keeps the romantic, touchable, high-craft feel of the gift reveal. The orchid now feels like a precious spinning object on its own little pedestal with a cute tag — perfect for the end scene.