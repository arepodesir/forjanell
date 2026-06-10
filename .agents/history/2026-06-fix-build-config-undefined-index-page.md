# History Entry — fix-build-config-undefined-index-page Job Complete

**When**: 2026-06 (fast response to "fix the build fast it isn't showing inex page well test and fix fast usnig logic vfs")

**Authorizing Artifact**: .agents/jobs/fix-build-config-undefined-index-page.job (created first in the real source VFS at LOGOS/SOFTWARE/DOGMA/FORJANELL/CODE/.agents/ per the "usnig logic vfs" directive). Real code only (not the session worktree).

**What Happened** (fast test/fix cycle + full VFS logging):
- User flagged build breakage + index page not rendering/showing well.
- Immediately created the .job in real .agents/jobs/ (with plan, invariants, "use real source", test+fix emphasis).
- Diagnosed via `bun run build` on /.../CODE/web/ (the authoritative tree): build crashed during static prerender with `ReferenceError: config is not defined` (stack pointed at index chunk + Application layout, triggered while generating /messages/index.html).
- Root cause: messages/index.astro used `(config as any).messages` (and had a stray `</div>` after MessageList) but **never imported config** (contrast to index.astro which correctly did `import { config } from '@/config';`). Imports were also disordered (Container import after use of config). Frontmatter code runs at Astro prerender time → hard failure. (Pre-existing but now surfaced; prior video-card job + build env changes exposed it.)
- Also observed in source: the "glowing glass welcome header" div in index.astro was completely empty despite pageProps.welcomeTitle + welcomeDesc being defined and populated in frontmatter. This made the home/index look incomplete/broken ("not showing index page well").
- Fast fixes (search_replace on real absolute paths only):
  1. messages/index.astro: added `import { config } from '@/config';` + moved Container import to top with other imports (proper frontmatter hygiene). Removed the stray `</div>` (cleaned DOM).
  2. Re-ran build: now succeeds cleanly ("5 page(s) built", all routes including /index.html + /messages/index.html generated without error).
  3. index.astro: populated the previously empty welcome header with the pageProps content (h2 for title using Great Vibes, p for desc). Matches the "glowing glass" intent and makes the landing page actually greet the user.
- Verified:
  - Build now exits 0, full static generation of 5 pages.
  - dist/index.html contains the welcome phrases ("Hi, Janell", "special day", "magical realm") + Hadacard islands + card content.
  - No regression to prior video-full + heart-arrow changes (those were in Hadacard/FrutigerScenes which are used by gift but home index still works).
- VFS discipline: job up front + this history. (Used todo_write internally for the fast loop too.)

**Files Created/Edited (in real tree)**:
- .agents/jobs/fix-build-config-undefined-index-page.job (planning + VFS log)
- .agents/history/2026-06-fix-build-config-undefined-index-page.md (this)
- web/src/pages/messages/index.astro (import + import order + remove stray close tag)
- web/src/pages/index.astro (populated the welcome header div so index shows properly)

**Outcome & Why It Mattered**:
Build is green again and fast. The home/index page now actually displays the intended greeting + the holographic card (plus the rest of the menu/footer). Messages page prerenders without blowing up config. All other routes (gifts with the new full-video auto-playing card, about, etc.) continue to work. The "logic vfs" was followed exactly: job recorded the task, edits only on the real LOGOS/.../CODE/ location, history closes it with evidence.

Pre-existing warnings (foils paths, empty script chunk, chunk size) were left alone as they are not the reported breakage.

**Status**: COMPLETE. Build fixed, index page now shows its content well.

*Fast test → root cause → targeted VFS-logged fix → re-test. Craft preserved.*