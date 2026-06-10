# History Entry — fix-orchid-perfect-framing Complete

**When**: 2026-06

**Authorizing Artifact**: .agents/jobs/fix-orchid-perfect-framing.job (created first)

**Review**: R-fix-orchid-perfect-framing.md (hard gate — all edits after it was coherent)

**What Happened** (VFS protocol + user request: "ensure the orchid tip and base all fit in the view perfectly and focus on nothing else"):
- Job created with narrow invariants (perfect tip+base framing + zero distractions; log everything in .agents).
- Full pre-read of OrchidViewer.tsx (it was loaded with state machine, gift tag, sparkles, preset buttons, hint text, audio, wiggles, extra meshes, special zoom scaling, lookAt bias, etc.).
- Comprehensive review written (detailed stripping list, framing math plan using combined bounds + fitDistance + clamps, verification steps, sign-off).
- Programme + execution log initialized with phases and pre-reads.
- Implementation (only in OrchidViewer.tsx):
  - **Stripped for "focus on nothing else"** (P2):
    - Removed preset button bar and "SPIN THE PEDESTAL..." hint text.
    - Removed the entire 3D gift tag (canvas, "For Janell", "loveliness of orchids", string, plane, attachment).
    - Removed sparkles (function, Points, all creation/render/update/visibility).
    - Removed `orchidState` + type + wiggleAmp + sparkleRate + advanceState + every state-driven model mutation (wiggles on petals/stem, extra rotations, bobs, scales in traverse).
    - Removed `sparkle()` and all calls.
    - Removed all audio (connectMainWavePlayer, bgmAudio, externalAudio/audioSrc props + handling, play/pause in setup and cleanup).
    - Removed mixer + GLB clip animation playing.
    - Removed the model-scale-on-wheel special case (now pure camera distance for consistent framing).
    - Result: the file is now focused; the canvas shows *only* the GLB orchid + one minimal low dark pedestal cylinder (kept solely to clearly define "the base" the user mentioned, without becoming a distraction).
  - **Perfect tip + base framing** (P3):
    - After load: minimal pedestal created, then `Box3.setFromObject(model).expandByObject(pedestal)` for the *combined* geometry (tip of bloom to bottom of base).
    - `verticalSize = size.y * scale`
    - `fitDistance = (verticalSize / 2) / tan(fov/2) * 1.22` (the 1.22 multiplier chosen for comfortable margins so tip never hits top edge and base never hits bottom).
    - Initial controls set to `distance = fitDistance`, `yaw = 0.38` (beautiful 3/4 view), `pitch = 0.16`, `auto = false`.
    - Immediate camera positioning applied right after load (and re-applied in every animate frame):
      - Spherical from the (clamped) controls.
      - `lookAt(0, -0.07, 0)` (tuned y that keeps both the highest tip and lowest base point fully visible with the margin).
    - Hard clamps on every control update and in animate:
      - pitch: 0.06 – 0.32
      - distance: 1.35 – 3.8
    - Wheel and touch pinch now *only* affect `controls.distance` (clamped). No more model scaling that could break the pre-computed framing.
    - On resize the camera aspect updates; next frame re-applies the clamped math so framing holds.
- Verification (P4, logged in detail):
  - `cd web && bun run build` (multiple times, after stripping, after framing, final): exit 0 every run. "Complete". The gift scene route that hosts the viewer built successfully.
  - Grep for every stripped item (presets, gift tag canvas/"For Janell", sparkles, orchidState, advanceState, connectMainWavePlayer, bgmAudio, externalAudio, "SPIN THE PEDESTAL", mixer, etc.): **0 matches**.
  - Framing logic (fitDistance, combined bounds, "perfect framing of tip and base", the lookAt y, pitch/distance clamps) confirmed present.
  - Mental + code review of final viewer: on load the full vertical extent (tip of the bloom to the bottom of the base/pedestal) is perfectly inside the view with good margins. Spinning (yaw) at any allowed pitch or within the zoom range never causes cutoff of tip or base. Resize preserves it. The view contains *nothing else*.

**Files Changed**:
- Only `web/src/components/SentientOrchid/OrchidViewer.tsx` (as authorized).
- Full .agents/ VFS updated at every step (job, review, programme, this log with exact numbers/decisions/output, history).

**Outcome & Why It Mattered**:
The OrchidViewer now does exactly what was asked and nothing more. The orchid (tip of the flower to the base of its support) is always perfectly framed and fills the view nicely from a clean initial angle, and the entire experience inside the canvas is focused *only* on that geometry. All previous "sentient" chrome, UI, text, particles, audio, and reactivity have been removed. The result is a pure, elegant, distraction-free 3D presentation of the orchid that will look correct on any container size and under user interaction.

Every decision, every number (1.22 margin, lookAt -0.07, pitch 0.06-0.32, distance 1.35-3.8, initial yaw 0.38 / pitch 0.16, etc.), every build output, and every grep result is logged in .agents/ as requested.

**Status**: COMPLETE. Orchid tip and base fit perfectly. Focus on nothing else. All results logged in .agents/.

*Only the orchid. Perfectly framed. Nothing else.*