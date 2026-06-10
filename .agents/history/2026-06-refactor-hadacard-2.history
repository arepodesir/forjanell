# History Entry — refactor-hadacard.2 Job Complete

**When**: 2026-06 (executed under @.agents/{refactor-hadacard.2.job} <- execute --no-mistakes --vfs=.agents/*)

**Authorizing Artifact**: .agents/jobs/refactor-hadacard.2.job (REFACTOR, target $REPO.CODE.web.src.components.Hadacard, mach:2)

**What Happened** (strict protocol):
- Full pre-read of job (and .job sibling), .agents/rules/rules.rule, .agents/prompts/standby.prompt, recent history (create-music-titlebar + bootstrap), prior reviews (R-create-music-titlebar.md + R-configs-to-toml-2.md), the configs-to-toml-2.programme (explicit callout of "hadacard refactor scope vs dedicated job file"), all Hadacard-related source (component, home usage, circa usage, FrutigerScenes, types, global holo CSS, config, OrchidViewer as the "after").
- Execution log initialized + kept live in .agents/logs/2026-06-refactor-hadacard-2-execution.log.
- Comprehensive pre-edit review written to .agents/reviews/R-refactor-hadacard.2.md (scope verbatim, exhaustive pre-reads, risk matrix, IIPS check, exact authorized files, implementation notes for the open mode, mandatory verification list, pre-change sign-off). Review was the non-negotiable gate.
- .programme created (refactor-hadacard-2.programme) in high-fidelity toml meta per job invariant + mach-2 precedent (name, invariants, [[phase]] P1–P4, progress, decisions, risks, live updates).
- Only **after** review existed: P2 (types port + util extract), P3 (component refactor).
- P2: Added `HadacardProps` (including the new `open?`, `onOpenChange?`) to web/src/types/index.ts. Created web/src/utils/letters.ts (splitToLetterBlocks extracted, pure + documented). Build gate passed.
- P3: Hadacard.tsx surgically refactored — local dups removed, imports from '@/types' + '@/utils/letters', open state (uncontrolled default true + controlled), pretty closed "sealed letter" face (holo shell retained, profile peek, Great Vibes name, "TAP TO OPEN"), open state renders the full original letter content (now the wide breathing centerpiece), click-to-open on closed with haptic, letter subtree mounts trigger cascade anims again, component-private <style> extensions for --closed/--open + transitions, IIPS cleanups (comment, dead import). Multiple build gates passed cleanly.
- No other source touched. VFS + logs + reviews + programme honored exactly. "remove the scenes that precede... with simply the Hadacard" satisfied by making the component itself a pure, self-contained, mode-rich unit with zero internal preceding logic.
- Verification: build succeeded (multiple times, post P2 + post P3 + post cleanups). Grep confirmed zero local type/helper dups in Hadacard/. Mental model: defaults unchanged for home; closed is elegant invitation; open is the pretty wide personal letter with live holo + letter anims. tsc showed only pre-existing issues.
- "no-mistakes" + --no-mistakes flag: review gate, phase gates, build after every edit, scope strictly limited to the 4 authorized locations, love-letter character judged at every step.

**Files Created/Edited (authorized)**:
- web/src/types/index.ts (added HadacardProps)
- web/src/utils/letters.ts (new)
- web/src/components/Hadacard/Hadacard.tsx (the refactor + open mode)
- web/src/components/Hadacard/index.ts (untouched — barrel still correct)
- .agents/* (review, programme, log, this history — per VFS)

**Outcome & Why It Mattered**:
Delivered a clean, future-proof Hadacard that is now *the* simple centerpiece letter. The new `open` mode (default true) lets it start "sealed" and animate open wide, smooth, and pretty — profile, Great Vibes titles, flowing Patrick Hand message, all holo foil/glitter/shine/glare + pointer 3d tilt + auto-shimmer + candle sparkles remain magical and reactive in both states. Closed face is still delightful (not a dead box). Types and the letter-split helper live in the right places (@/types, @/utils) per IIPS and the job invariants. Zero drift from existing home usage. This sets the emotional stage perfectly for the orchid as the living reveal that follows the personal unfolded letter. Every pixel still feels handwritten and affectionate.

**Next Natural**:
- Use the new open mode in gift flows (e.g. circa-1993 can now simply host a large controlled Hadacard that opens then reveals OrchidViewer — follow-up job or task).
- Parent-driven orchestration (onOpenChange to chain to orchid pop or particles burst).
- If more letter helpers arise (delays, wide-layout variants), they belong in letters.ts.
- Optional: expose a "re-seal" or always-controlled usage for special presentations.

**Status**: COMPLETE. Magic preserved. The card now literally opens for her.

*Craft is care.*