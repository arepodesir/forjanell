# Review: remove-global-mute-button Job Execution (REMOVAL)

**Job**: .agents/jobs/remove-global-mute-button.job
**Date**: 2026-06
**Reviewer**: Grok (self-review per VFS protocol)
**Status**: Pre-edit review complete. Authorizing job read. All relevant sources inspected (Application.astro + all references to the toggle and bgm_muted). This document now exists and is coherent. **No source edits to web/src/ are authorized until after this review.**
**Flags honored**: "remove the mute button completely", perfect VFS recording, no mistakes, preserve audio discipline in other components.

## 1. Authorizing Scope (verbatim from job)
User request: "remove the mute button complete ly please - record in vfs perfecl please"

From the job:
- Remove the global floating music mute/toggle button **completely** (the 🎵 / 🔇 button).
- This means:
  - Delete the `<button id="global-music-toggle">` element and all its styling/positioning.
  - Remove **all** JavaScript in the is:inline script that was for the toggleBtn:
    - Element lookup for toggleBtn
    - Hiding/showing logic based on isCardPage (the button part only)
    - Entire "Handle mute/unmute state" section (bgm_muted sessionStorage reads/writes)
    - All toggleBtn.innerHTML = ... swapping between 🎵 and 🔇
    - The entire click listener on toggleBtn that performed the mute flip + play/pause
  - Clean up related autoplay logic that was conditioned on the removed mute state (the `isCurrentlyMuted` checks that existed only to support the button).
  - Because the only user control for 'bgm_muted' was this button, we can (and should) remove the 'bgm_muted' sessionStorage usage entirely.
- Dependent files:
  - MusicTitlebar.tsx: It coordinates with globalBgmAudio (pauses it when local track plays). Remove any code that was only checking 'bgm_muted' because of the global toggle.
  - FrutigerScenes.tsx: It pauses global on mount and resumes on cleanup (respecting muted). Simplify to pure pause/resume for audio discipline; remove muted session checks that were toggle-related.
- Keep: The globalBgmAudio singleton creation, time persistence (sessionStorage for currentTime), and interaction-gated autoplay where it still makes sense for background music on non-card pages. But simplified now that there is no mute control.
- Goal: No user-facing mute button anywhere. Other components continue to manage audio handoff correctly (they pause global when they need exclusive audio).

This review authorizes the complete removal.

## 2. Pre-Reads Performed
- Authorizing job: .agents/jobs/remove-global-mute-button.job
- Primary file: web/src/layouts/Application.astro (full content read) — contains the button (lines 15-18) and the entire IIFE script with toggle logic, mute state, icon swapping, and click handler.
- Cross-file references (via grep):
  - MusicTitlebar.tsx: comments and code that pause globalBgmAudio when playing its own track; also a check involving globalBgmAudio.
  - FrutigerScenes.tsx: explicit pauses of globalBgmAudio on mount, and resume logic on cleanup that checked `sessionStorage.getItem('bgm_muted') !== 'true'`.
  - Hadacard.tsx: unrelated (a video element with its own `muted` attribute).
- No other UI buttons or mute controls found for the global BGM.
- Previous VFS artefacts and patterns: Confirmed we must create job (done), write this review as gate, then programme + log, perform edit, build gate, history. Perfect recording required.

All pre-reads completed before any planning of the edit.

## 3. Scope Check
✅ Exact match to "remove the mute button completely".
- The only mute button is the one in Application.astro.
- Removal must be total: HTML + every line of supporting JS that existed for it.
- Cleanup in the two files that had conditional logic tied to the removed feature (bgm_muted checks).
- Audio handoff invariants (from prior work): MusicTitlebar and FrutigerScenes must still pause the global track when they take over audio. This is preserved (their pause/resume for their own content stays; only the "user could have muted via the button" branches are removed).

**Authorized files** (strict list):
- web/src/layouts/Application.astro (main removal of button + script cleanup)
- web/src/components/MusicTitlebar/MusicTitlebar.tsx (remove any bgm_muted-specific branches)
- web/src/components/FlipBook/FrutigerScenes.tsx (remove bgm_muted session check in the resume path)

No other files. No new components. No changes to global audio creation that would be needed by scenes/MusicTitlebar.

## 4. Risk Assessment (High-Care Areas)
- **Audio discipline (highest priority)**: The project has very careful rules around globalBgmAudio (pauses when local audio or scenes play, resume on cleanup, interaction gating). Removal of the mute button must not introduce simultaneous audio or break the "if user had muted via the (now gone) button" paths — we are simply removing the control surface.
  - Mitigation: Keep the actual pause/resume calls that MusicTitlebar and FrutigerScenes already do for their own content. Only strip the user-mute state that was exclusively controlled by the button.
- **SessionStorage pollution**: 'bgm_muted' and 'bgm_currentTime' were mixed. We can remove 'bgm_muted' entirely. Keep 'bgm_currentTime' if the global audio still wants to remember position.
- **Card pages vs normal pages**: The script had special `isCardPage` handling that hid the button and paused global. After removal we still want card pages (circa-1993 etc.) to pause any lingering global on load.
- **No visible remnants**: Button must not be in the DOM at all (no hidden, no conditional render left behind).
- Low risk on build/TS: This is mostly HTML + inline script removal. Build will catch any syntax issues.

## 5. Invariant Check
- **IIPS + craft**: Removal should be surgically clean. No dead code, no commented-out button, no leftover event listeners.
- **Audio magic preserved**: Other components (MusicTitlebar, scenes) continue to own their audio and hand off the global BGM correctly. The "global background music just plays on non-card pages until something else needs the audio" behavior remains.
- **VFS perfection**: Job (done), this review (the gate), programme, detailed log with decisions, final history entry. Every step recorded.
- No new features added. Pure removal + cleanup.

## 6. Alternatives Considered
- Just hide the button with CSS or `hidden` class: violates "completely".
- Leave the bgm_muted session logic "in case we bring the button back": dead code, not IIPS.
- Remove globalBgmAudio creation entirely: would break MusicTitlebar (which coordinates with it) and scene BGM handoff. Not requested.
- Keep a keyboard shortcut for mute: not requested; user wants the button gone completely.

Chosen: Total excision of the button element + every line that existed to support its mute/toggle behavior. Clean, minimal, recorded.

## 7. Exact Implementation Notes
**In web/src/layouts/Application.astro**:
- Delete the entire button element (the comment "Global floating music player controller..." and the <button id="global-music-toggle">...🎵</button>).
- In the <script is:inline> IIFE:
  - Remove `const toggleBtn = document.getElementById('global-music-toggle');`
  - Remove the `if (isCardPage) { if (toggleBtn) ... return; }` block that was only about the button (keep any card-page global pause if still useful, but simplify).
  - Remove the block that did `if (toggleBtn) { toggleBtn.classList.remove('hidden'); }`
  - Remove the entire "Handle mute/unmute state" section (the isMuted + audio.muted + toggleBtn.innerHTML).
  - Remove the `isCurrentlyMuted` checks inside startAudio and the conditional attachment of startAudio listeners (the logic that skipped autoplay only if muted via the button).
  - Remove the entire `if (toggleBtn) { toggleBtn.addEventListener('click', ... }` toggle logic (the whole function that flipped newMute, wrote to session, changed icon, play/pause).
  - After cleanup, the script should still:
    - On non-card pages: create/retrieve globalBgmAudio, restore currentTime from session, attach interaction listeners to start it (if we decide the background music should still auto-start on first gesture).
    - On card pages: still pause any existing globalBgmAudio on load (for audio discipline).
  - Simplify the remaining code. Remove all references to 'bgm_muted'.

**Cleanup in other files** (only the parts that existed because of the removed button):
- MusicTitlebar/MusicTitlebar.tsx: Remove any `bgm_muted` sessionStorage checks that were only for the global toggle. Keep the `if (globalBgmAudio) globalBgmAudio.pause()` when the titlebar starts playing (this is still required for audio discipline).
- FrutigerScenes.tsx: In the onCleanup resume block, remove the `&& sessionStorage.getItem('bgm_muted') !== 'true'` condition. Keep the pure `globalBgmAudio.play()` resume (other components will have paused it when they needed to). The mount-time pause of global stays.

**No other changes**.

## 8. Exact Verification Steps (MANDATORY)
1. After the edit: `cd web && bun run build` — must exit 0 with no errors. All pages (including those that previously hid the button) must build cleanly.
2. Post-build grep (run on source):
   - `grep -r "global-music-toggle" web/src` → should return nothing.
   - `grep -r "bgm_muted" web/src` → should return nothing (we removed the last usages).
   - `grep -r "🔇\|🎵" web/src` (in context of the toggle) → should be gone.
   - Confirm MusicTitlebar still has its pause of globalBgmAudio.
   - Confirm FrutigerScenes still has its mount pause + cleanup resume of globalBgmAudio (without the muted check).
3. Mental model:
   - No floating music button appears on any page (home, gifts, about, messages, circa-1993).
   - Background music (if any) starts on first interaction on normal pages.
   - When you go to a gift/circa page, scenes pause the global as before.
   - When MusicTitlebar plays, it still pauses global.
   - No way for a user to "mute the global via the removed button".
4. VFS hygiene: This review present + coherent, log has every step + decisions, programme updated, final history entry written. Only the three authorized files touched.
5. "No mistakes" + perfect recording: The removal must leave zero traces of the button or its mute UI logic.

## 9. Pre-Change Sign-off (Programme + Rules Requirements)
- [x] Authorizing job read in full (including the "record in vfs perfecl please" requirement).
- [x] Application.astro + all cross-references (MusicTitlebar, FrutigerScenes) + prior audio discipline patterns read.
- [x] This review document now exists, is specific, exhaustive on the removal, and coherent.
- [x] Standing VFS protocol followed exactly: job first, this review as the non-negotiable gate before any edit.
- Will create the programme + detailed execution log immediately.
- Will perform the edit in precise search_replace steps.
- Will run the build + grep verification steps above after the edit.
- Will append rich events to the log, update the programme, and write a crisp history entry on completion.
- Will ensure other audio handoff logic (the real invariant) remains intact.
- Risk of "audio suddenly playing when user didn't want it" is acknowledged — but since the only control was the button we're removing per explicit request, this is the correct outcome. Components that need silence still force it.

**This review authorizes the complete removal of the global mute button under the job.**

Next immediate steps after this sign-off: write programme + log, then execute the precise removal in Application.astro (and the two dependent cleanups), run verification, close with history.

*Button gone. VFS perfect.*