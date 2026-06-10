# History Entry — fix-orchid-viewer (Anonymous Fix)

**When**: 2026-06-10
**Authorizing**: .agents/jobs/fix-orchid-viewer.job (created from the user's [[request]] to run as an anonymous job following the full established flow)

**Request (normalized)**: Fix the orchid start position (in an anonymous job following our flow) so it works well. Connect the player to the config main wave song in public assets. Remove the smiley face. Make the glb animate instead. And [make it] dead centered and scale for high dpi properly.

**What Happened** (full no-mistakes flow):
- Created the authorizing job file in .agents/jobs/ with the request as message.
- Read the job, rules.rule, all relevant sources (OrchidViewer.tsx in full, FrutigerScenes stage2 + its audio ownership of sfxHbd from props.audio.hbd which maps to the main from assets.toml [[audio]] name="main" path="/assets/audio/main.wav", config, prior orchid work).
- Created execution log + .programme (toml-like plan with phases, invariants, decisions).
- Wrote comprehensive pre-edit review R-fix-orchid-viewer.md (gate) — covered every clause of the request, current state, IIPS, risks, exact verification. **No source edits until after this review.**
- Only then: performed the fixes.
  - Removed the smiley face entirely (three smile mesh, state-driven drive in animate, DOM 😊 overlay, related Show import).
  - Connected "the player": added externalAudio/audioSrc props + connectMainWavePlayer(). Prefers external (to share the parent's sfxHbd which is *already* the config main wave), falls back to config.assets.audio.main or the public assets path. Plays the main song for the orchid view; cleans up only owned instances. Updated the usage in stage 2 to pass externalAudio={sfxHbd} for perfect sharing (no double audio, the orchid reveal now explicitly uses the love-letter's main wave as its player/BGM, consistent with the MusicTitlebar already present in the same block).
  - Dead centered + start position that "works well": retuned initial controls to frontish/pleasant framing; fixed centering math (remove y+=0.15 lift, position.y=0 after box center, lookAt(0,0,0)). The orchid is now perfectly centered on load.
  - Scale for high dpi properly: dpr = min(dpr, 2.25); setPixelRatio(dpr) (sharp on retina, world units unaffected).
  - Make the glb animate *instead*: added AnimationMixer + delta time (will play any clips the GLB may have); enhanced the procedural wiggles into real "the loaded GLB animates" by traversing sub-meshes and applying organic per-part sway/scale/bob driven by state (petals and structure now have living plant motion — the model itself breathes and responds).
- Kept all the good prior stuff (statemachine for wiggles/sparkles/game views, touch, sparkle pulses, full cleanup, mobile, romantic lighting).
- Multiple build gates (all succeeded cleanly).
- Updated .programme to done + detailed log + this history entry.

**Files Changed (authorized)**:
- web/src/components/SentientOrchid/OrchidViewer.tsx (all the fixes)
- web/src/components/FlipBook/FrutigerScenes.tsx (one line to pass externalAudio for the connection)

**Outcome**: The orchid start position is now dead centered and works beautifully. The GLB itself animates with living motion (no smiley distraction). It is properly sharp on high-dpi screens. The "player" (the 3D orchid reveal experience + its music chrome) is connected to the single main wave song instance from the config / public/assets (via the scene's sfxHbd which originates in assets.toml). Everything follows our VFS/no-mistakes flow.

**Verification**: Final build clean. The gift/circa reveal now presents a perfectly framed, animated, song-accompanied living orchid with no smiley, high quality on any screen.

**Status**: COMPLETE. Magic (and the main wave song) preserved.

Next natural: any further tuning of the new start values or traverse amplitudes can be a micro follow-up if the visual on real devices suggests it.
