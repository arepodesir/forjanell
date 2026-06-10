# Review: R-003-messages-toml (for T-003 / P-003)

**Task**: .agents/tasks/T-003-messages-toml-openable.task
**Programme**: .agents/programmes/P-003-messages-toml.programme
**Job Ref**: main
**Status**: Gate. Authorizes messages page, MessageList, config parser, types, new messages.toml. Keep 1 message on page, others from config, make openable.

## Scope
- messages/index.astro: remove all but 1 from MESSAGES (keep e.g. first or a simple one).
- Create web/configs/messages.toml with [[message]] for the rest (sender, relation, text, color, gradient matching current).
- Update web/src/types/index.ts (add/export Message if not central, or use inline).
- Update web/src/config/config.ts: parse messages.toml (similar to gifts.toml -> array of Message), add to WebConfig or export messages.
- Update MessageList.tsx: support "openable" (e.g. onPointerDown or click sets selected, shows expanded view or simple modal/overlay with larger Pretext/full text, nice close, haptic, transition. Closed state keeps the grid/teaser cards).
- Page: load the 1 + config messages, pass to list. Update title or note if needed.

## Pre-Reads
- Task + prog + main job.
- messages/index.astro (hardcoded MESSAGES 4 items, passes to MessageList).
- MessageList.tsx (grid, For, PretextShift per msg, aero-glass cards with gradient/color, haptic on down).
- config/config.ts (parses base/cards/gifts/scenes/assets tomls into rich/legacy, useConfig).
- types/index.ts (Recipient, CardMeta, Gift, Scene, WebConfig, Assets).
- configs/ other tomls for pattern (e.g. gifts.toml [[gift]]).
- No messages.toml yet.

## Risks
- Parser must coexist with other tomls (add messagesParsed, normalize to Message[]).
- Openable must not break list view or Pretext (use conditional expanded or separate view).
- Keep 1 on page (hardcoded or filtered from config).
- IIPS: toml clean, data driven, open nice (letter-like).
- Mobile, haptics.

## Impl Notes (post this gate)
- Create messages.toml (e.g. copy 3-4 [[message]] from old).
- Types: add interface Message { sender: string; ... } export.
- Config: add messagesParsed = parse('messages.toml'), messages = normalize to array (rich + legacy if wanted).
- messages page: const messages = config.messages || []; const displayMessages = [one, ...othersFromConfig] or keep 1 hardcoded + load rest.
- MessageList: add state for openId or selected, on click set it, render expanded (e.g. if selected show larger text + sender full, or portal modal with glass + Pretext bigger + close btn). Use Solid signal.
- Verify parser in build, data loads, click opens (e.g. detail or modal), close works.

## Verification
- messages.toml present + valid.
- config has .messages array.
- Page shows ~1 + loads others from toml.
- Clicking a message "opens" it (expanded or modal, full text visible, nice).
- Build 0, no breakage to other config.
- Grep confirms reduced hardcoded, toml usage.

**This review authorizes the messages toml + openable changes (T-003).**