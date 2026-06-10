# Review: R-002-gifts-no-hscroll (for T-002 / P-002)

**Task**: .agents/tasks/T-002-remove-gifts-horizontal-scroll.task
**Programme**: .agents/programmes/P-002-gifts-no-hscroll.programme
**Job Ref**: main
**Status**: Gate. Authorizes gifts page (and global if needed) for no h-scroll. Preserve prior v-scroll + top-first.

## Scope
Remove horizontal scroll from gifts list page.

Current (post prior): has v-scroll wrapper, max-w-lg, but possible h-overflow from card borders, ribbons (absolute top-right), gift-btn, zoom-overlay script, body/html padding, or flex in Container on certain viewports/mobile (e.g. safe areas, wide cards with p-5 + border).

Fix: add overflow-x-hidden to appropriate container (html/body or .Container or the gifts max-w wrapper or specific cards). Audit widths (use w-full max-w, no fixed wide). Ensure the list shelf doesn't cause >100% width.

Keep all existing (v-scroll inner, reverse, cards, nav script, styles).

## Pre-Reads
- Task + prog + main job.
- gifts/index.astro (full, has the flex-1 min-h-0 overflow-hidden wrapper + inner overflow-y, header, cards with absolute ribbon, gift-btn, zoom div + script, style is:inline).
- Container (overflow-y but no explicit x).
- global.css for aero-glass, gift-btn, pulse etc (possible overflow sources).
- Prior gifts fix in history.

## Risks
- Must not break the v-scroll list or top-first.
- Mobile (safe pb/pt, small widths).
- Zoom overlay fixed but script positions relative to btn - ensure no layout shift.
- No impact on other pages.

## Impl Notes (post gate)
- In gifts or global (minimal): ensure overflow-x-hidden on body or .Container or the outer divs.
- In cards or ribbons: confirm no min-width or padding causing overflow (use box-border if needed).
- If specific element (e.g. ribbon or button), constrain it.
- Verify the inner list still works.

## Verification
- build 0
- Gifts page: no horizontal scrollbar (test desktop + mobile sim, wide content).
- Vertical list scroll + cards + ribbon + nav intact.
- Grep for added overflow-x-hidden.
- Log + mental full.

**This review authorizes the gifts h-scroll removal (T-002).**