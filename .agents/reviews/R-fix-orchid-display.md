# Review: fix-orchid-display Job Execution (FIX)

**Job**: .agents/jobs/fix-orchid-display.job
**Date**: 2026-06
**Reviewer**: Grok (self, following VFS protocol exactly: programme -> review gate -> log)
**Status**: Pre-edit review complete. Authorizing named job read. Current OrchidViewer.tsx inspected (pedestal still present and used in combined bounds, pitch still active in auto and positioning, model centering using combined, etc.). This document now exists and is coherent. **NO source edits to web/src/components/SentientOrchid/OrchidViewer.tsx or any other file until after this review.**
**Flags honored**: nomistakes, --vfs=.agents/* , follow programme -> review -> log pipeline, named job, focus on the exact request.

## 1. Authorizing Scope (verbatim from job)
new JOB {fix the orchid display, remove the base that is petruding in the center so its just the flower and pot with proper center position for mobile full view and only single axis rotation keeping it tight - log into named job and follow programme -> review -> log pipeline - nomistakes--vfs=.agents/*}

From job frontmatter + message:
- Remove the base that is protruding in the center (the added pedestal Cylinder code that is combined into bounds and positioned at y=-0.11).
- Result must be just the flower and pot (the native geometry from the GLB only).
- Proper center position for mobile full view: after load, center the model (flower + its native pot) so the full vertical extent (tip of flower to bottom of pot) is perfectly centered in the viewport, with tight framing that fills the mobile container height (e.g. the h-[520px] / flex-1 / h-screen usages) without cutoff or excessive empty space.
- Only single axis rotation keeping it tight: enforce ONLY yaw (horizontal spin). Remove pitch from drag (onPointerMove must update only yaw), remove pitch bob/variation from auto in animate, fix pitch to a single good value (e.g. 0.18) that shows the pot base nicely while keeping the flower upright and the whole thing tight in frame.
- Keeping it tight: use vertical bounds of the (flower+pot) only to compute scale and fitDistance with small margin (1.05-1.1x), set initial controls.distance / yaw / fixed-pitch, update camera math (position + lookAt) and clamps to guarantee the full height is always visible and centered, wheel/pinch only distance (clamped to the tight range).
- Log into the named job (this one) and follow the full pipeline: programme -> review (this, as gate before edit) -> detailed log (all steps, decisions, build output, mental verification) -> history. nomistakes. Everything under --vfs=.agents/* .
- Target: only the viewer file for the display fix. No other files.

This review authorizes the precise changes described.

## 2. Pre-Reads Performed (per programme)
- Named job: .agents/jobs/fix-orchid-display.job (full request + plan + invariants + targets).
- This programme: .agents/programmes/fix-orchid-display.programme (phases, invariants, decisions).
- Current implementation: web/src/components/SentientOrchid/OrchidViewer.tsx (key sections read: GLTF load with pedestal creation + combined Box3 + scale + position.y shift, controls init with pitch, camera setup, onPointerMove (yaw only in recent but pitch still in auto/positioning), animate spherical + lookAt(0, -0.07, 0) + auto with pitch, onWheel/pinch distance, the viewer container in return).
- Related: Orchid.tsx stub (re-export), usage in FrutigerScenes (inside gift end scene, full-height flex container in circa-1993), previous related jobs (fix-orchid-pedestal-rotation, fix-orchid-perfect-framing, fix-orchid-viewer) for context on prior attempts at base/pedestal/framing.
- Mobile context: viewer used with dynamic heights (h-[520px] md:h-[620px] or flex-1 h-screen), so framing must be height-driven and robust.
- No changes to any other files authorized.

All pre-reads complete before planning the edit.

## 3. Scope Check + "Focus"
✅ Exact match to the request.
- Remove protruding base: delete the pedestal Mesh creation, add, and any use in Box3 (use model only).
- Just the flower and pot: GLB native geometry only.
- Proper center for mobile full view: re-center model using its own bounds so tip-to-pot-bottom is vertically centered; compute fitDistance from vertical size for tight fill of the view height.
- Only single axis rotation (yaw) keeping it tight: onPointerMove only yaw; auto only yaw (no pitch); fixed pitch value in controls and camera calc; distance/position/lookAt clamped and computed for tight centered framing.
- Keep tight: small margin in fit calc, initial pose that shows full height prominently, clamps that prevent loss of tip or base or excessive empty space.
- Pipeline + logging + nomistakes + vfs: this review is the gate; named job; full programme -> review -> log; all results/decisions/output in the named job's log and final history.

**Authorized file (strict)**:
- web/src/components/SentientOrchid/OrchidViewer.tsx (only the load/positioning/centering, controls, onPointerMove, animate camera math, and related init for the display fix).

Nothing else. No other files. No new features.

## 4. Risk Assessment (High-Care Areas)
- **Framing after removing pedestal**: The GLB's native pot base must now provide the "base" visibility. Risk that without the added cylinder the bottom looks floating or not "grounded". Mitigation: use the model's own bounds for centering and fit calc; choose a lookAt y and camera y offset that keeps the pot bottom clearly visible and the whole thing centered in the mobile view. The GLB is expected to have its own pot geometry.
- **Single axis enforcement**: Current code has pitch in auto and positioning. Must remove all pitch variation from user input and auto. Risk of accidental pitch remaining. Mitigation: explicit removal in onPointerMove (confirm only yaw += ), in auto block (only yaw), fixed pitch const used in camera calc, remove pitch from any clamps if they allow variation.
- **Mobile full view / tight**: Different container heights (mobile vs md). Risk of cutoff or loose framing. Mitigation: height-driven (verticalSize from bounds), small margin (1.05-1.1), initial pose + clamps that guarantee full height visible and centered regardless of exact pixel height (as long as aspect is handled by camera).
- **Center position**: After sub center, the model may need an additional y shift so the pot (bottom) sits at the lower part of the frame while flower tip is at upper, with visual mid centered. Test mentally for the used heights.
- **No breakage to other behavior**: Loading, error, basic drag (now pure yaw), wheel (distance only), container, dispose must remain. The end-scene usage in FrutigerScenes must continue to work.
- Low risk: build will catch syntax; the change is localized to display math and removal of one mesh.

## 5. Invariants Check
- IIPS: changes are clean, minimal, readable. The viewer now presents a pure, elegant, tightly framed flower + pot with smooth single-axis spin.
- Single axis + tight + no protruding base + proper mobile center: exactly as requested.
- VFS: full pipeline followed. Named job. nomistakes. --vfs=.agents/* . All logged.
- Focus: only the display fix described. Nothing else touched.

## 6. Alternatives Considered
- Keep a tiny non-protruding base ring or adjust the existing pedestal y/scale: violates "remove the base that is protruding in the center" and "just the flower and pot".
- Allow limited pitch: violates "only single axis rotation".
- Use larger margin or different fov calc: would not be "keeping it tight".
- Edit other files (FrutigerScenes, styles): out of scope and unauthorized.

Chosen: direct removal of the added pedestal code, re-center on GLB-only bounds with tight vertical fit calc, fixed pitch + yaw-only input/auto, camera math updated for centered tight mobile view.

## 7. Exact Implementation Notes (for the FIX, after this review gate)
In web/src/components/SentientOrchid/OrchidViewer.tsx (only):

**Removal of protruding base (just flower + pot)**:
- In the GLTF load try, after model = gltf.scene; :
  - DELETE the entire block that creates the pedestal Mesh (CylinderGeometry 0.95/1.05/0.09), sets y=-0.11, adds to scene, and any later use of it in Box3.expand or positioning.
  - Now use ONLY the model's native geometry (flower + its pot from the GLB).

**Proper center position for mobile full view + keeping it tight**:
- After model = gltf.scene; (no pedestal):
  ```ts
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  const scale = 1.9 / maxDim;  // tuned for good presence + tight fill of mobile view height
  model.scale.setScalar(scale);
  model.position.sub(center.multiplyScalar(scale));

  // Proper vertical center for mobile full view: shift so the pot base is at the lower third of the frame
  // and the flower tip reaches the upper third, overall centered.
  model.position.y = -0.08;  // adjust this value once for the GLB so tip-to-pot-bottom is vertically centered in the viewer
  ```
- Compute tight fitDistance from the model's vertical size (now flower+pot only):
  ```ts
  const fov = 52 * (Math.PI / 180);
  const verticalSize = size.y * scale;
  const fitDistance = (verticalSize / 2) / Math.tan(fov / 2) * 1.08;  // 1.08 = tight, minimal empty space, full view on mobile
  ```
- Initial controls (single axis, tight):
  ```ts
  controls.distance = fitDistance;
  controls.yaw = 0.4;      // nice starting angle
  controls.pitch = 0.18;   // FIXED single value - good view of the pot base while flower stands upright
  controls.auto = false;
  ```

**Only single axis rotation (yaw only, keeping it tight)**:
- In onPointerMove: ensure ONLY yaw. (Current is mostly yaw-only; confirm/remove any pitch line.)
  ```ts
  controls.yaw += dx * 0.0075;
  // NO pitch from drag
  ```
- In animate auto block: ONLY yaw, fixed pitch (no bob or sin on pitch).
  ```ts
  if (controls.auto && idle) {
    controls.yaw += 0.0004;
    // pitch remains the fixed 0.18 value set at init - no variation
  }
  ```
- Remove or neutralize any remaining pitch updates in auto or elsewhere.
- Camera positioning (initial after load + every frame in animate) must use the FIXED pitch:
  ```ts
  const x = Math.sin(controls.yaw) * Math.cos(controls.pitch) * controls.distance;
  const y = Math.sin(controls.pitch) * controls.distance * 0.75 + modelVisualCenterYOffset;  // tune yOffset (e.g. 0 or small) so the full flower+pot is vertically centered
  const z = Math.cos(controls.yaw) * Math.cos(controls.pitch) * controls.distance;
  camera.position.set(x, y, z);
  camera.lookAt(0, modelCenteredY, 0);  // 0 if we centered model at 0 vertically, or the adjusted value
  ```
- Clamps on distance only (to keep tight framing):
  ```ts
  controls.distance = Math.max(fitDistance * 0.7, Math.min(fitDistance * 1.5, controls.distance));
  // pitch is fixed, no clamp needed or hard-set it
  ```

**Mobile full view + tight**:
- The fitDistance + 1.08 + the y positioning + lookAt must result in the entire flower tip to pot base being visible and centered when the viewer is in its typical mobile containers (no top/bottom cutoff, no huge empty sky/ground).
- Test mentally for the h-[520px] and h-screen usages.

**Other (minimal, only as needed for the fix)**:
- Keep the rest of the file (loading, error, container, basic events, dispose) unchanged unless a line directly conflicts with the above (e.g. remove any pitch from onPointerUp timeout if present).
- No changes to props, no new UI, no state/sparkles/audio/tag changes (they are out of scope for this display fix).

## 8. Exact Verification Steps (MANDATORY — run after review gate + edits)
1. After the edit (and only after): `cd web && bun run build` — must exit 0, no errors, the gift scene route that hosts the viewer must still build.
2. Post-edit source inspection + grep:
   - Confirm the pedestal/cylinder creation block is completely gone (no "CylinderGeometry" for base, no "pedestal" var in load).
   - Confirm model positioning uses only its own Box3 (no expandByObject for added base).
   - Confirm onPointerMove updates ONLY yaw (search for pitch in that function — should be none or commented).
   - Confirm animate auto updates ONLY yaw (no pitch sin/bob).
   - Confirm pitch is set once to a fixed value and used in camera calc (no variation).
   - Confirm distance calc uses verticalSize of the model-only bounds with ~1.08 multiplier, and clamps are present for tight range.
   - Confirm camera position + lookAt use the centered model y and fixed pitch for vertical centering.
3. Mental runtime verification (log the visualization):
   - Load the orchid in the gift end scene (mobile viewport simulation): the view shows ONLY the flower + its native pot. No extra cylinder/base protruding in the center.
   - Full height (tip of the highest petal to the lowest point of the pot) is perfectly visible, centered vertically in the container, with tight margins (little empty space top/bottom).
   - Drag left/right: only smooth single-axis yaw rotation. The framing stays tight and centered; tip and base never cut off.
   - Pinch/wheel: only distance changes within the tight clamp; framing remains perfect (full centered view, no loss of tip/base).
   - Resize or different container heights (520px vs full screen): the initial pose + distance calc keeps the full flower+pot centered and filling the height nicely.
   - No other elements (tag, sparkles, buttons, etc.) were touched, but the view is now clean for the orchid display.
4. VFS hygiene (perfect recording):
   - This review present and coherent.
   - Programme updated with phase progress and decisions.
   - Log has pre-reads, exact before/after snippets, build output, grep results, mental verification notes, all under the named job.
   - Final history entry written in .agents/history/ (summary of what, why, files, outcome, VFS compliance).
5. "nomistakes" + "focus": re-read the edited sections of the viewer. The change is minimal, exactly matches the job request, and the orchid now displays as "just the flower and pot" with proper mobile centering and only yaw, kept tight.

## 9. Pre-Change Sign-off (Programme Requirements)
- [x] Named job .agents/jobs/fix-orchid-display.job read in full (including the exact user request text and pipeline instruction).
- [x] This programme read (phases, invariants, targets).
- [x] Current viewer code + usage + related prior jobs read.
- [x] This review document now exists, is specific to the request, follows the programme -> review -> log pipeline, and is coherent.
- [x] Standing VFS protocol + "nomistakes--vfs=.agents/*" followed exactly: named job first, this review as the gate before any edit to source.
- Will init the detailed named log immediately.
- Will implement the precise changes ONLY after this sign-off.
- Will run the exact verification steps (build, grep, mental, VFS updates).
- Will append everything (decisions, output, verification) to the log under the named job.
- Will write history at close.
- Will not touch unauthorized files or add unrelated work.
- Risk of "base visibility" after removal acknowledged but directly addressed by user request ("remove the base that is protruding... so its just the flower and pot").

**This review authorizes the fix to the orchid display under the named job.**

Next immediate (after this sign-off): initialize the execution log (P3), then implement the targeted changes in the viewer (P4), run verification (P5), update programme + log + write history. All results logged perfectly in the named job with --vfs=.agents/* . nomistakes.

*The orchid display must now be just the flower and pot, properly centered for her mobile full view, spinning cleanly on one tight axis.*