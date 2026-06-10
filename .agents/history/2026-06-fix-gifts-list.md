# History Entry — fix-gifts-list Complete

**When**: 2026-06

**Authorizing Artifact**: .agents/jobs/fix-gifts-list.job (created first per VFS)

**Review**: R-fix-gifts-list.md (hard gate before edit)

**What was fixed**:
- /gifts list now puts things (newest/active gift) on top first by reversing the render array: `gifts = (config.gift || []).slice().reverse()`.
- The list is now scrollable: introduced a flex wrapper (`flex-1 flex flex-col min-h-0 overflow-hidden`) + made the shelf div use `flex-1 overflow-y-auto`. The header remains above the scrollable cards area. This works nicely with the Container's min-h + overflow-y-auto + justify-between.
- Preserved everything else (active styling/ribbon, archived buttons, zoom transition script + haptic, all card markup, inline styles).

**Changes**:
- Only web/src/pages/gifts/index.astro (minimal, targeted).
- Build verified clean (including the /gifts route).

**Outcome**: The gift vault timeline now shows the important (active/target) item at the top of the list, and the shelf of cards is properly scrollable while the title header stays in view. Works for the current single gift and future multi-year data.

**VFS**: job + review + programme + log + this history all recorded.

**Status**: COMPLETE. It works.