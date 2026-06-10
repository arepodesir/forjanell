# Review: R-005-orchid-centered (for T-005 / P-005)

**Task**: .agents/tasks/T-005-orchid-centered-full.task
**Programme**: .agents/programmes/P-005-orchid-centered.programme
**Job Ref**: main
**Status**: Gate. Authorizes OrchidViewer for full centered on load (full size, centered, no floating halfway). Preserve interactions.

## Scope
In OrchidViewer.tsx: ensure on load (and resize) the orchid (GLB flower + any base/pot) is centered and full size in the view - not floating halfway. Use post-load bounds to set model scale/pos + camera distance/position/lookAt so it fills the canvas (tip to base prominent, visually centered in the 3D frame for the container height e.g. h-screen in scene or fixed h-[]).

Typical: after model load + scale to desired presence, compute ideal camera dist = f(model_vertical / 2 / tan(fov/2)) * factor for fit. Position camera at (0, center_y, dist), lookAt(0, center_y, 0). Apply initial yaw for nice angle. On resize re-apply.

Keep: all existing (drag yaw or limited, pinch/zoom on dist or scale, tap sparkle, auto subtle orbit, lights, pedestal if any, loading/error, container).

Context: used in FrutigerScenes stage 2 (full height relative in gift page).

## Pre-Reads
- Task + prog + main job + prior orchid reviews (perfect-framing, display).
- OrchidViewer.tsx (load: model = gltf, box/scale/center/pos, pedestal add, camera create (fov 52, pos), controls init (yaw/pitch/dist), setup apply, animate camera spherical + lookAt (often 0,-0.12,0 or similar), resize, the viewer div class h-[] or passed).
- FrutigerScenes usage (in stage 2 div, client:load).
- Gift page container (h-screen flex).

## Risks
- Must not break existing user controls (orbit, zoom, tap).
- "Full size" + centered: tight but not clipping; works for the actual container pixel size (aspect from resize).
- In scene: the 2D glass frame + hints around must still look good with full 3D orchid.
- No new perf (bounds cheap).

## Impl Notes (post gate)
- In load success (after model + pedestal if kept, before or after current scale):
  - (Re)compute box on full (model + pedestal).
  - Scale for good presence (current 1.6+/maxDim or tuned).
  - Center: model.position.sub(...) ; additional y to align visual mid or for "full" in frame.
  - Compute fitDist from verticalSize + fov + 1.05-1.15 tight factor.
  - Set initial controls.dist = fitDist, yaw good (e.g. 0.3-0.5), pitch for view (slight for pot if any), auto=false or minimal.
  - Immediately set camera.pos from spherical or direct (0, centerY, dist), lookAt(0, centerY or bias, 0).
- In resize + after any initial: re-apply the centered framing (use current container w/h for aspect, re-compute dist if needed for "full").
- In animate: the camera update can use the "base centered" as default when not user interacting, or just ensure initial is set and controls around it.
- Remove any code causing "halfway float" (old pos y offsets that bias it up/down).
- Keep all other (onPointer for yaw, wheel/pinch, sparkle, etc.).

## Verification
- build 0
- On load in gift end scene (mobile/full h-screen sim): orchid full size (fills most of 3D area), perfectly centered (tip near top of frame, base/pot near bottom, visual center aligned, no empty half above/below or floating mid-canvas).
- After yaw/zoom: user can move but initial is the "full centered" state.
- Grep for new bounds/camera centering code post-load.
- Mental desc in log: "full centered, not halfway".
- No breakage to sparkle/tap/drag in scene.

**This review authorizes the orchid centering fix (T-005).**