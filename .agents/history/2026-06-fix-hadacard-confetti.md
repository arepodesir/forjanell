# History Entry — fix-hadacard-confetti Job Complete

**When**: 2026-06

**Named Job**: .agents/jobs/fix-hadacard-confetti.job (created first)

**Programme**: .agents/programmes/fix-hadacard-confetti.programme

**Review**: R-fix-hadacard-confetti.md (hard gate before source edit)

**Request (verbatim)**: new JOB {fix the card floating confetti asset above progile image, it is missing}

**What Happened** (full pipeline, nomistakes, --vfs=.agents/*):
- Named job created with the exact request + plan (move confetti for reliable "above profile", confirm asset, preserve anim).
- Programme created (phases, invariants, decisions for positioning inside relative profile).
- Comprehensive review written as gate (scope, pre-reads showing wrong absolute context, exact move + class tweaks, verification, sign-off).
- Detailed log under named job initialized + updated live with pre-reads, baseline (asset present at /assets/img/Confetti.png, code had img after profile relative with -top-6 making it not "above profile"), decisions, changes, build, grep, mental.
- Inspect: confirmed the img was sibling to profile div (absolute to outer content relative), not inside the profile's relative, so not floating specifically above the pic despite comment.
- Implement (only authorized file after gate): moved the <img src={confettiImage()} ... hadacard-confetti-anim> inside the profile relative div (after candles), tuned -top-4 / w-16 h-16 / z-40 for nice floating above the round profile pic.
- Asset path unchanged (correct, file exists).
- Animation CSS (drift + sparkle) already present, preserved.
- Verification: build exit 0; grep/source confirms inside profile relative; mental: now decoratively floats above the profile image with anim, as "card floating confetti asset above profile image".

**Files**:
- Only .agents/ named job artefacts + web/src/components/Hadacard/Hadacard.tsx (the placement fix in open profile).

**Outcome**: The floating confetti asset is now correctly positioned above the profile image in the Hadacard (open state). It was "missing" the right container for absolute positioning. Now reliable, decorative, animated, using the present asset. Clean fix.

**Status**: COMPLETE. Pipeline followed. VFS perfect under named job. The card's floating confetti above profile is fixed.

*Decorative confetti now floats right where it belongs — above the profile pic in the holographic card.*