# Review: configs-to-toml Job Execution

**Job**: agents/jobs/configs-to-toml.md
**Date**: 2026-04 (current session)
**Reviewer**: Grok (self, following P-always-review-before-code)
**Status**: Pre-edit review + execution plan

## Scope (authorized by job)
- Target: $REPO.CODE.web.[config/** , configs/]
- Complete split of config system to TOML-first.
- Follow IIPS for TOML syntax and TS module formation.
- Wire dedicated useConfig.ts hook.
- Integrate so all routes (home, gifts/*, about, messages) render using proper imports of view (Hadacard, FrutigerScenes, etc.) + model (config data).
- Log to $.agents/logs/

## Established Pattern Observed
- gifts/index.astro already does: `import { config } from '@/config/' ; const gifts = config.gift || []`
- src/config/config.ts skeleton: imports 4 raw tomls via '@@/web/configs/xxx.toml?raw' (@@ = tsconfig ../*), uses { toml } from parsers (smol-toml), WebConfig type stub, processConfig stub.
- tsconfig has "@/*": ["./src/*"], "@@/*": ["../*"]
- FrutigerScenes (the main gift view for circa-1993): expects flat EnvProps with numeric Record scene* , audio, recipient fields, cardMeta, egift. Renders internal <ThreeCard ...> (broken ref currently) + uses scene[1].
- Hadacard (refactored card view): prop-based with internal defaults, used by home + final reveal in scenes view.
- circa-1993 page: old import + spread {...APP_CONFIG} to FrutigerScenes.
- home page: still fully local hardcoded pageProps + direct Hadacard props.
- parsers.ts : simple toml() wrapper.
- astro.config : no vite aliases yet (risk for ?raw).

## IIPS Application (decisions)
- TOML: Use idiomatic `[[tables]]`, `[tables]`, clean arrays. No numeric "1 =" keys. Sections with comments. Data moved from monolithic config.toml + hardcodes.
- Structure:
  - configs/config.toml : slim recipient core + any non-split globals.
  - configs/cards.toml : recipient details + cardMeta + egift (card domain).
  - configs/scenes.toml : visual novel scene data (array of scenes or main + aux).
  - configs/assets.toml : audio, key images, resources used by config.
  - gifts.toml : already good [[gift]]; keep as source.
- In config.ts (the model): parse each, build rich structured + a `legacy` or top-level flat fields so existing view expectations (sceneMessages[1] etc) continue to work with minimal view changes. Export both `config` and `APP_CONFIG`.
- Hook: thin accessor `useConfig()` returning the config (suitable for Solid client components).
- Integration: 
  - Fix imports in pages and the one broken internal import in FrutigerScenes (ThreeCard -> proper Hadacard path using alias).
  - Update home to source from config (reduce duplication).
  - Add vite resolve.alias in astro.config to make @@ ?raw reliable.
- Models/: leave or seed a Config.ts types if time; not blocking for render.
- No changes to messages (user content) or about (mostly static bio).

## Risks & Mitigations
- Audio/BGM/pause logic in FrutigerScenes: do not touch logic, only import + data shape compatibility.
- Particle canvas + timers + scene sequencing: preserve exactly; only adapt prop access if changing shape.
- Numeric [1] hardcode in view: will construct Record<1, ...> in aggregator for compatibility.
- Build/runtime alias resolution: explicitly add to vite config.
- Dupe data during transition: tomls will be source; monolithic config.toml will be slimmed.
- Routes not rendering: primary verification = successful `bun run build`; no TS errors on config imports.
- Gift reveal card (isFinalCard): ensure egift/cardMeta flow to Hadacard.

## Verification Steps (to be run post-edit)
1. bun run build  (from web/)
2. Check dist/ has updated pages without errors in output.
3. (Manual if possible) dev server spot check home, /gifts , /gifts/circa-1993 (pop bubble path, final card).
4. Confirm gifts vault reads from config.gift .
5. No console errors on data load.

## Pre-Change Sign-off
This transform is narrowly scoped to the job message. Changes will be minimal, precise (search_replace + full writes for new/empty toml content). Standing programme P-always-review-before-code followed by producing this note before any search_replace or write to source.

Next: write starter log in logs/, then execute per todos (toml first as lowest risk, then model, hook, integrations, verify).
