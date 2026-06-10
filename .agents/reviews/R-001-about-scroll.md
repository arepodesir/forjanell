# Review: R-001-about-scroll (for T-001 / P-001)

**Task**: .agents/tasks/T-001-add-about-vertical-scroll.task
**Programme**: .agents/programmes/P-001-about-scroll.programme
**Job Ref**: main fix-ux...job
**Status**: Pre-edit. Gate for about vertical scroll. Authorizes edit to about page (and minimal Container/global css if needed). No other files.

## Scope
Add vertical scroll to the content in about page.

Current: long content in aero-glass max-w-lg inside Container (overflow-y-auto flex justify-between). On short viewports or long text/sections, the inner content may push or not scroll gracefully within the "content" area. Add v-scroll to the main content area (e.g. the glass div or a inner wrapper gets max-h-[calc(100dvh - header/back safe)] + overflow-y-auto). Header/back stay fixed/accessible. Preserve all styles, live sparks button, ko-fi, fonts, glass.

Do not introduce h-scroll.

## Pre-Reads
- Task + sub prog + main job.
- about/index.astro (full content structure: header, paras, hr, sections, live div, ko-fi).
- Container.astro (overflow-y-auto min-h flex justify-between p-4).
- Global css for aero-glass etc.
- Messages about scroll context (no other pages).

## Risks
- Mobile safe areas/padding.
- Interactive sparks must still work (not clipped).
- Preserve mt-16 for back button space.
- No h-scroll on about or body.

## Impl Notes (after this gate)
- In about: wrap or style the main <div class="relative z-10 w-full max-w-lg aero-glass ..."> with additional classes or inner scroll div for v-scroll (e.g. max-h-[70vh] or calc based on header ~ mt-16+mb-6 ~ 5-6rem + back, overflow-y-auto).
- Or make a content wrapper inside glass with scroll.
- Test: content taller than viewport -> scrolls inside the about area vertically.
- Update log with before/after.

## Verification (MANDATORY post gate + edit)
- build 0
- Mental: about page, make content tall (or check small height) -> main sections scroll vertically, header/back visible, no h-scroll.
- Grep for added overflow-y-auto / max-h on about.
- Other pages (gifts etc) unaffected.
- Log updated, sub history if separate.

**This review authorizes the about v-scroll change (T-001).**

(Implement only after this + main gates as needed. Record in sub log.)