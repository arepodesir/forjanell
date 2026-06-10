# Review: hadacard-landscape-arrow Job Execution (ENHANCE / REFACTOR)

**Job**: .agents/jobs/hadacard-landscape-arrow.job (anonymous task captured)
**Previous**: refactor-hadacard.2.job + R-refactor-hadacard.2.md (the open mode this builds directly upon)
**Date**: 2026-06
**Reviewer**: Grok (self, following rules.rule + standby.prompt + exact prior execution pattern + --no-mistakes)
**Status**: Pre-edit review complete. Authorizing job read. All relevant sources + prior artefacts read. This document now exists and is coherent. Source mutations to the files explicitly authorized below are allowed **only after** this review.
**Flags honored**: --no-mistakes, record in VFS normally (job + review + programme + log + history), tst (build gates), anonymous task planned into anonymous .job as requested.

## 1. Authorizing Scope (verbatim + interpreted plan)
From the job file (frontmatter + message):
- name: hadacard-landscape-arrow
- mach: 3 (direct continuation of the Hadacard open-mode work)
- target: $REPO.CODE.web.src.components.Hadacard
- kind: ENHANCE
- Anonymous user request (recorded exactly):
  > "please add a special arrow glassy button matcing the card the hadacard that transitions it lanscape and adds new features in a cool new way"
- Full plan in job (must be honored):
  - Special arrow glassy button that *matches the Hadacard* (aero-glass + holo-card visual language: palette, borders, shadows, rounded language, haptics, smooth cubic-bezier, affectionate not techy).
  - Button transitions "it" (the Hadacard) to landscape.
  - Adds new features "in a cool new way".
  - VFS discipline, IIPS, no mistakes, build verification, only edit authorized locations.
  - Refactor: extend the open mode (isOpen) with landscape (isLandscape), only meaningful when open.
  - Cool new features ideas from job (to be realized elegantly):
    - Surface scrollMsg (already typed + in config but "unused in base render") as a beautiful flowing wide banner/ribbon (letter-block or PretextShift for word-hover coolness) that appears only in landscape.
    - A charming P.S. / secondary dedication block that animates in (short loving line, smaller handwriting font, part of the "extra page" feeling).
    - Smooth aspect + layout reflow for the "wide open letter sheet".
    - Button glyph changes with state or has active treatment.
    - Preserve every prior magic pixel (3d pointer tilt + foils + letter anims + profile + candles + sign-off + "— with love, always").

This review authorizes the precise implementation of the above as a clean, minimal, delightful enhancement to the existing Hadacard component.

## 2. Pre-Reads Performed
- The new authorizing job: .agents/jobs/hadacard-landscape-arrow.job (full frontmatter + detailed anonymous request + implementation plan + VFS requirements).
- Prior Hadacard artefacts: .agents/jobs/refactor-hadacard.2.job, R-refactor-hadacard.2.md, refactor-hadacard-2.programme, the music-titlebar and configs execution logs/history/reviews (exact pattern to mirror).
- .agents/rules/rules.rule + .agents/prompts/standby.prompt (VFS contract, review-before-edit, love-letter posture, high-sensitivity zones).
- Current implementation (post .2): web/src/components/Hadacard/Hadacard.tsx (full — open/closed modes, holo-card + component <style> for --open/--closed, pointer 3d, letter blocks via imported letters.ts, all getters, no scrollMsg render yet, closed face elegant, build-clean).
- Types: web/src/types/index.ts (HadacardProps already has the open + scrollMsg retained-for-future note — perfect hook).
- Styling system:
  - web/src/css/global.css (aero-glass = bg-white/10 backdrop-blur-xl border-white/30 + specific shadow; aero-btn for gradient examples; full .holo-card + __inner + shines/glitter/glare + letter-block/letterIn + mobile rules. --card-aspect is the key for portrait vs landscape).
  - Existing glassy buttons: BackButton (aero-glass rounded-full + emoji + label + haptic on pointerdown + absolute positioning + scales), MusicTitlebar inner (aero-glass rounded-3xl + internal buttons), global music toggle (aero-glass rounded-full), OrchidViewer hints (aero-glass rounded-full small text).
- Other Hadacard context: home usage (passes limited props + stale isFinalCard), FrutigerScenes (still has scrollMsg in EnvProps but no Hadacard), config (scrollMsg lives in recipient and legacy), PretextShift (available for "cool word hover" if we choose to use it for the banner).
- Invariants from .2 + this job: IIPS, $, extend open without breakage, haptics + glass + 3d foil + handwritten fonts are sacred, only VFS-authorized edits.

All pre-reads complete before any planning of edits.

## 3. Scope Check + "Anonymous Task"
✅ Matches the request 1:1.
- "special arrow glassy button matching the card the hadacard": aero-glass + card-native colors (aero-cyan / pink-200 / white/30 borders), rounded, perfectly sized touch target, subtle active treatment, placed as an integrated "control grown from the letter itself" (absolute inside the open content, not floating outside the holo shell).
- "that transitions it landscape": new `landscape` prop + internal state (parallel to `open`), `holo-card--landscape` class, CSS transition on aspect-ratio + layout properties, content reflow that makes the letter feel physically wider and more generous ("open sheet").
- "adds new features in a cool new way": 
  - scrollMsg (the "future" slot) becomes a pretty wide flowing banner (letter-block cascade or PretextShift) that only appears in landscape — feels like discovering the "carried wish" when you stretch the letter open.
  - A P.S. dedication block (small, affectionate, Patrick Hand or similar, with its own gentle entrance) that arrives as the "extra page".
  - The transition itself + button state change + any stagger = the "cool new way".
- Refactor/plan into the .job: done (this job file itself is the artifact the user asked for).
- VFS + tst + no mistakes: this review + programme + log + history + repeated build gates will enforce it.
- Scope limits (strict like prior music + hadacard.2 reviews): only the component + the types extension. No page edits, no new component files (button is inline), no global.css changes (all new rules live in the existing component <style> block for encapsulation + to honor "minimal").

**Authorized files for this execution (explicit, only these)**:
- web/src/types/index.ts (extend HadacardProps with landscape + onLandscapeChange; update scrollMsg comment if helpful).
- web/src/components/Hadacard/Hadacard.tsx (everything else: signals, button, landscape class + styles, getters for scrollMsg, conditional render of new banner + P.S., layout tweaks inside the open branch, toggle handler with stopPropagation).

Nothing else. If a tiny helper is needed it will be called out; letters.ts already exists and is reusable.

## 4. Risk Assessment (High-Care Areas)
- **Visual match + "glassy but Hadacard"**: Must not look like a generic BackButton or plain aero-btn. Use the exact aero-glass + card text colors + a size that feels native to the holo inner (w-9 h-9 or similar, big arrow glyph). Subtle border/pink accent on active. Test mentally against the dark holo bg + foils.
- **Aspect + layout transition**: aspect-ratio transitions are supported but can be janky if children don't handle reflow well. Mitigation: `transition-all duration-300` or 400ms with the project's favorite cubic-bezier(0.16, 1, 0.3, 1), keep the inner content flex-col (or light grid when landscape) with opacity/translate stagger for new elements. Profile cluster can stay roughly same size; message area gains breathing room.
- **New content only in landscape (and only when open)**: scrollMsg + P.S. must not appear in portrait open or closed. They should feel discovered, not always present.
- **scrollMsg default**: Provide a beautiful affectionate default inside the component when landscape (so the feature is instantly visible and "cool" even if parent doesn't pass it). Still respect a passed prop.
- **P.S. line**: Keep it short, sparkling, personal, never techy. One or two lines max. Can be static for this enhance (or driven by a tiny internal const).
- **Pointer 3d + holo layers**: Must stay 100% alive and correct in landscape (tilt math may be tuned slightly more dramatic for wide format). The button must not steal pointer events for the tilt (stopPropagation on the toggle only).
- **Haptics & audio discipline**: Light/ success on the arrow (no audio). Never touch globalBgm or Frutiger audio.
- **Mobile**: Wider aspect must still fit the home container and circa usage. Button must remain big-thumb friendly. Test mental small-screen model.
- **IIPS / future reuse**: Props optional with good defaults. State pattern identical to open (controlled + uncontrolled). No logic duplication. Clean getters.
- **No breakage**: All existing home renders (open + closed) + any future controlled open usage must be pixel/behavior identical until landscape is explicitly passed true.
- Low risk: purely additive inside one component + one type addition. Build will catch immediately.

## 5. Invariant Check — IIPS + Love Letter + Prior .2 Work
- **IIPS**: The button code will be tiny, placed logically, use the same resolver pattern `() =>`. New render branches use Show or ternaries cleanly. Comments affectionate + precise ("the moment you stretch the letter open and the hidden wish appears...").
- **$ + on-the-fly**: Reuse letters.ts for any new split text. No gratuitous new files. Types extension follows the exact pattern established in .2.
- **Preserve magic**: Every existing holo layer, letterIn, shimmer, profile float, candle, confetti overlay, sign-off, pointer tilt, "— with love, always" stays untouched. The new elements arrive using the same animation vocabulary.
- **Emotional tone**: The arrow feels like a secret clasp on the letter. Clicking it is the physical act of "opening it even more for her". The scrollMsg banner + P.S. read like extra handwritten paragraphs she wasn't expecting. Still a personal gift, not a UI demo.
- Does not touch: particles, audio handoff, OrchidViewer, global nav, tomls, home scripts.

## 6. Alternatives Considered
- Plain emoji arrow in a BackButton-style pill outside the card: fails "matching the card the hadacard" and "special".
- Always-visible button or always-landscape default: breaks existing portrait letter experience and home usage.
- Heavy new canvas or three inside card for "cool": overkill, risks perf + audio discipline, not IIPS.
- Put the new features (scrollMsg + P.S.) in the normal open state: violates "in a cool new way" tied to the landscape transition.
- Edit global.css for .holo-card--landscape: possible but review prefers keeping the variant rules inside the component's existing <style> (encapsulation + matches how .2 added its open polish).
- Create a separate <HadacardArrowButton> component: unnecessary for one small control; inline keeps it cohesive with the card.

Chosen: inline glassy arrow (aero-glass + card colors + big glyph), component <style> extensions, new elements gated strictly behind isLandscape() && isOpen(), scrollMsg surfaced + charming P.S. as the "new features", full fidelity to prior open/closed/tilt behavior.

## 7. Exact Implementation Notes
**Types**:
- In web/src/types/index.ts, inside/after the HadacardProps:
  ```ts
  landscape?: boolean; // new: glassy arrow button expands the open letter to landscape "sheet" + reveals extra features
  onLandscapeChange?: (isLandscape: boolean) => void;
  ```
- Optionally refine the scrollMsg comment: "now surfaced beautifully in landscape mode".

**Hadacard.tsx** (main work):
- After the isOpen signals, add parallel controlled/uncontrolled landscape signals + setLandscape / toggleLandscape (haptic success on enter, light on exit).
- Add `const scrollMsg = () => props.scrollMsg || "Every star still pauses when you smile.";` (affectionate default so feature shines immediately).
- In the holo-card div: append landscape class when isLandscape(): ` ${isLandscape() ? 'holo-card--landscape' : ''} `
- Add the special button **only inside the open content** (after the sign-off or as absolute in the relative z-10 div):
  ```tsx
  {isOpen() && (
    <button
      class="absolute bottom-2 right-2 z-30 aero-glass rounded-full w-9 h-9 flex items-center justify-center text-xl leading-none text-aero-cyan border border-white/20 shadow-md active:scale-90 transition-all hover:border-aero-pink/50 select-none"
      onClick={(e) => { e.stopPropagation(); toggleLandscape(); }}
      aria-label={isLandscape() ? "Collapse letter view" : "Expand to landscape view"}
    >
      {isLandscape() ? '⟵' : '⟶'}
    </button>
  )}
  ```
- In the open <> branch, after the name/nickname block and before or after the main message, add the cool new features (gated on isLandscape()):
  - scrollMsg banner: a div with letter-block spans (reuse splitToLetterBlocks(scrollMsg(), 28) or similar) in a slightly smaller elegant style, perhaps with its own border-t or glass ribbon treatment.
  - P.S. block: a small mt-2 text-[11px]–[13px] italic pink-200/80 block with a loving line (e.g. "P.S. I would choose this lifetime again if it meant one more moment with you.") that can use a gentle opacity transition or the existing letterIn class on its spans.
- Style additions (inside the existing component <style>):
  - .holo-card--landscape { --card-aspect: 1.58; } (or 1.65 — tune for "wide letter" feel while still fitting containers).
  - Transition helpers: .holo-card--landscape .holo-card__inner { transition: ... }
  - Any inner content tweaks: when landscape the message p can have slightly adjusted leading or the profile cluster can get a `flex-shrink-0` treatment if we introduce a light two-col wrapper for the open content (keep it light — one extra div with conditional classes is enough for "reflow").
  - Button can have a tiny extra rule if it needs holo-card specific glow, but aero-glass + colors should be sufficient.
- Pointer math: optionally multiply the rotate amounts by 1.1 or 1.2 when landscape for more dramatic "sheet" tilt (subtle, optional).
- Everything else (shimmer, onMount/Cleanup, cardStyles, closed face, open letter content) untouched.

**Transition feel**: the aspect change + new elements fading in with staggered delays or CSS animation classes = the "cool" part. Keep durations consistent with prior (280-600ms).

**Verification notes** (see section 8).

## 8. Exact Verification Steps (MANDATORY)
1. After types edit + after component edit: `cd web && bun run build` — must exit 0 with no new errors (pre-existing warnings ok).
2. `cd web && npx tsc --noEmit 2>&1 | cat` — our changes must not introduce new type errors (pre-existing in other files expected).
3. Grep post:
   - Confirm `landscape` and `onLandscapeChange` in HadacardProps.
   - Confirm the arrow button JSX + isLandscape + toggleLandscape + scrollMsg usage inside Hadacard.tsx.
   - No accidental new local type definitions or dupe split logic.
4. Mental + code re-read:
   - Closed + plain open (landscape=false) look and behave 100% as before.
   - With landscape=true (or toggle via button): wider aspect, button glyph flips or indicates state, scrollMsg banner appears with letter magic, P.S. block arrives prettily, tilt still works, holo layers intact.
   - Button is glassy, arrow prominent, matches card colors/presence, only in open state, does not break pointerMove.
   - "tst": the whole thing still feels like a handwritten love letter that just got unfolded one more beautiful time.
5. VFS hygiene: this review present, programme updated through phases, log has gates, final history entry written, only authorized files changed.
6. Love-letter test on final source: re-read Hadacard.tsx — does the new button + landscape content still read "caring, precise, a little sparkly"?

## 9. Pre-Change Sign-off
- [x] Authorizing anonymous job read + its built-in plan internalized.
- [x] All prior Hadacard VFS artefacts + current source + aero-glass + button exemplars + scrollMsg data flow read.
- [x] This review now exists, is specific, and is coherent.
- [x] Protocol followed: no source edits until this gate.
- Will create programme + log immediately.
- Will run the exact verification steps above after each edit phase.
- Will only touch the two authorized files.
- Will celebrate craft in the history entry.
- Magic + emotional tone risk acknowledged and will be the final filter before closing.

**This review authorizes the implementation of the glassy arrow landscape button + new features under the job.**

Next: write the .programme, start the log, then P2/P3 edits + gates, close with history.

*Every new fold of the letter must still feel like it was written by hand, in the quiet hours, just for her.*

---
*End of review.*