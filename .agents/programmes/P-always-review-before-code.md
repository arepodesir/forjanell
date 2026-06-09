# PROGRAMME: Always Review Before Code

**ID**: P-always-review-before-code
**Type**: Standing procedure
**Applies to**: Any time a task or job would result in editing real project source.

## Trigger

When I am about to propose or execute a `search_replace`, new file in src/public/configs, or any mutation outside `.agents/`.

## Required Steps (in order)

1. **Read the authorizing artifact** (the task file, job file, or user message that references a programme).
2. **Read relevant source** (the files that would be touched) + any related tests/configs.
3. **Read recent history** entries and current `state/project.md` for continuity.
4. **Produce a review** in `reviews/` (or append to the task's review section):
   - Scope check: does the change match the authorized scope exactly?
   - Risk assessment (regressions to audio, particles, TOML loading, mobile, haptics, etc.).
   - Invariant check: does this preserve the personal, high-sensory, "love letter" character?
   - Alternatives considered.
   - Exact verification steps the change must pass.
5. **Only after the review exists and is coherent**, perform the minimal edit.
6. **Update the task status** and append a crisp outcome note to `history/`.
7. **If the task was self-initiated**, also drop a short reflection in `prompts/` or `state/` if a new pattern emerged.

## Exceptions (rare)

- Purely additive non-behavioral files (new .md in docs/ that doesn't affect build) still benefit from a lightweight review note.
- Emergency fixes: still write the review retroactively in the same session and note the urgency.

## Why This Programme Exists

This project rewards extreme care. The value is in the craft and emotional precision. Rushing an edit to a holographic card, audio graph, or particle system is exactly how the magic leaks out.

**Status**: Active standing programme. Reference it by name when tasking.
