# Review: fix-hadacard-confetti Job Execution (FIX)

**Job**: .agents/jobs/fix-hadacard-confetti.job
**Date**: 2026-06
**Reviewer**: Grok (self, VFS protocol)
**Status**: Pre-edit review complete. Named job read. Current Hadacard code inspected (confetti img is present in open state but placed after the profile relative div, using absolute to the outer content, which does not reliably place it "above" the profile image). Asset confirmed present at web/public/assets/img/Confetti.png and referenced via confettiImage() default '/assets/img/Confetti.png'. Animation styles present. This review now exists and is coherent. **Source edits to web/src/components/Hadacard/Hadacard.tsx authorized ONLY after this review.**
**Flags**: nomistakes, --vfs=.agents/* , named job, programme -> review (gate) -> log pipeline.

## 1. Authorizing Scope (verbatim from job)
new JOB {fix the card floating confetti asset above progile image, it is missing}

From job:
- The decorative floating confetti asset above the profile image in the Hadacard (open state) is missing/not correctly positioned.
- Currently the <img src={confettiImage()} class="absolute -top-6 ... hadacard-confetti-anim" > is sibling after the profile div in the content area.
- Since the outer content div is relative, the absolute -top-6 positions it near the top of the card content (possibly above header meta or not directly "above her profile").
- Fix: Move the confetti <img> inside the profile picture's relative container div (the one with class "relative w-28 h-28 mb-3 animate-float z-10 shrink-0"), so its absolute positioning is relative to the profile pic itself, making it reliably float above the profile image.
- Use the existing confettiImage() which defaults to the present asset '/assets/img/Confetti.png' (capital C .png; also svg exists but png is current default).
- Keep the decorative classes: absolute, negative top for floating, centered (left-1/2 -translate-x-1/2), appropriate size (w-20 h-20 or tune for floating look above w-28 profile), opacity-70, pointer-events-none, z-30 (to be above profile content and cap).
- Preserve the .hadacard-confetti-anim class and the keyframes in the component <style> (drift and sparkle) for the "floating" animated effect.
- Only affect the open state where the profile is shown (closed has smaller profile, but request focuses on "the card").
- No other changes to card layout, closed/landscape states, video, etc.

This review authorizes the minimal targeted repositioning of the confetti img inside the profile relative div.

## 2. Pre-Reads Performed
- Named job: .agents/jobs/fix-hadacard-confetti.job (full request + plan).
- Programme: .agents/programmes/fix-hadacard-confetti.programme (phases, invariants).
- Current code: web/src/components/Hadacard/Hadacard.tsx (inspected the profile section in open state ~210-230, the confetti img right after the profile div, using absolute -top-6 to outer, confettiImage() at top ~67, CSS for anim at ~374-385 in <style>).
- Asset location: web/public/assets/img/ (confirmed Confetti.png and confetti.svg present).
- Grep confirmed the confetti reference and comment "Confetti image above her profile - decorative fixed overlay with animation".
- No other confetti placements or missing references found.
- Context from prior Hadacard refactors: the confetti was originally full-inset background in very early versions, later changed to this floating above-profile intent with specific positioning and anim.

Pre-reads complete. The positioning is the issue making the "floating above profile image" "missing" in practice.

## 3. Scope Check
✅ Exact match.
- Move confetti img inside the profile relative div for correct "above profile image" floating.
- Asset already present and referenced correctly.
- Keep animation.
- Minimal change, only this file, only the open profile section.

**Authorized file**:
- web/src/components/Hadacard/Hadacard.tsx (only the reposition of the confetti <img> inside the profile div, no other modifications).

## 4. Risk Assessment
- **Positioning**: Moving inside the relative profile div (w-28 h-28) will make -top-6 relative to the profile itself, placing the w-20 confetti nicely floating above the round pic (over the cap or top of head area). z-30 ensures it's above the profile img and cap svg.
- **Asset**: Path /assets/img/Confetti.png resolves correctly from public (Astro serves public/ at root). PNG has transparency presumably for "floating" look.
- **Animation**: The hadacard-confetti-anim is defined in the component <style> (scoped to the class), will still apply.
- **Mobile/closed**: Closed profile is smaller (w-16), but since confetti is only in the open branch (from code), it won't affect closed. If needed later, separate task.
- **Z-index/overlap**: Current z-30 on confetti vs z-20 on cap should be fine; profile content z-10.
- Low risk: pure reposition, no new code, build will confirm. The "missing" is fixed by correct relative positioning.

## 5. Invariants Check
- IIPS: clean minimal fix, the confetti remains the intended decorative floating element above profile with animation.
- Asset not missing: confirmed present, path correct.
- Focus: only the "above profile image" positioning.
- VFS: pipeline followed (job, programme, this review gate, log, history).

## 6. Alternatives Considered
- Change top value or add more negative margin without moving: unreliable because absolute to outer content (which has header meta before profile).
- Put confetti before profile in DOM with higher negative top: still relative to outer.
- Use the profile div itself as the positioned ancestor: best and simplest for "above her profile".
- Switch to confetti.svg: not needed, current default is the png that exists and was intended (per code comment).

Chosen: move the existing <img> inside the profile's relative div (as last child or appropriately placed), keep all classes/props/asset/anim exactly.

## 7. Exact Implementation Notes (after this review gate)
In web/src/components/Hadacard/Hadacard.tsx (open state profile section):

Current structure (approx):
<div class="relative w-28 h-28 mb-3 animate-float z-10 shrink-0">  {/* profile container */}
  <img src=... bday-cap ... z-20 />
  <div class=... border for photo ... >
    <img src={centerImage()} ... />
  </div>
  {/* candles */}
</div>

{/* Confetti ... absolute to outer */}
<img src={confettiImage()} class="absolute -top-6 left-1/2 ... z-30 hadacard-confetti-anim" />

Fix: move the confetti img inside the profile relative div, e.g. as the last child before </div> of profile, or right after the photo div. The absolute will then be relative to this profile div, with -top-6 placing it above the top of the profile pic.

Keep exact same classes, src via confettiImage(), alt, etc.

No change to the outer content relative (it can stay relative for other things if any).

The hadacard-confetti-anim styles (in the <style> block at bottom of component) remain unchanged.

Optionally ensure z-30 > z-20 of cap.

This makes the confetti "float above the profile image" as the comment describes.

## 8. Exact Verification Steps (MANDATORY after review + edit)
1. After edit: `cd web && bun run build` — exit 0, no errors. The home page (which uses Hadacard) must build cleanly.
2. Post-edit grep/inspect on source:
   - Confirm the confetti <img> is now inside (descendant of) the profile "relative w-28 h-28 ..." div.
   - Confirm src still uses confettiImage() defaulting to '/assets/img/Confetti.png'
   - Confirm class still has absolute -top-6 left-1/2 ... z-30 hadacard-confetti-anim (and the keyframes exist in <style>).
3. Mental runtime:
   - In open Hadacard (home or other usage): the profile pic area shows the round photo + cap + candles.
   - The confetti image (w-20 h-20) floats above the profile (partially overlapping top of pic or cap area), centered, with the drift + sparkle animation playing, decorative (opacity 70, no pointer events).
   - Asset loads (not 404, since file exists).
   - Does not affect closed state or other elements.
4. VFS hygiene:
   - This review present.
   - Log has pre-reads, edit details, build output, grep confirmation, mental verification.
   - Programme updated.
   - History entry written.
5. "No mistakes": the change is tiny reposition only. Re-read the profile + confetti section in final source — it now does what the comment says ("above her profile").

## 9. Pre-Change Sign-off
- [x] Named job read in full.
- [x] Programme read.
- [x] Current code + asset location inspected.
- [x] This review now exists, is specific to the positioning fix, follows the pipeline, and is coherent.
- [x] VFS protocol + nomistakes + --vfs=.agents/* followed: named job, review as gate before edit.
- Will init the named log immediately.
- Will implement the minimal move of the img tag inside the profile relative div ONLY after this sign-off.
- Will run the exact verification (build, grep, mental, VFS updates).
- Will append all results to the log under the named job.
- Will write history at close.
- Only authorized file (Hadacard.tsx for this confetti reposition).

**This review authorizes the fix to place the floating confetti asset above the profile image in the Hadacard.**

Next: init log (P3), implement the reposition (P4 after gate), verify (P5), update VFS + history. Focus only on making the confetti float above the profile image as intended. The asset is not missing — the positioning was.

*Craft is care. The little floating confetti above her photo in the holographic card must be there, animated, decorative.*