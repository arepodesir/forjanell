# Review: fix-orchid-viewer (Anonymous Fix Job)

**Job**: .agents/jobs/fix-orchid-viewer.job (created from user [[request]] as "anonymous job following our flow")
**Request (verbatim, with typos normalized)**: fix the orchid start position in an anonymous job following our flow so it work well and connect the player to the config main wave song in public assets - please remove the smiley face and make the glb animate instead and dead centered and scale for high dpi properly.
**Date**: 2026-06-10
**Reviewer**: Grok (self-review, strict rules.rule + no-mistakes protocol)
**Status**: Pre-edit review + plan. Authorizing job + rules + all relevant sources + prior orchid work read. Baseline build clean.
**VFS compliance**: Full flow (job auth → log → this review gate → .programme plan → edits → builds → history).

## Authorizing Scope
- Anonymous/fix job per explicit user phrasing.
- Target: web/src/components.SentientOrchid (primarily OrchidViewer.tsx) + related usage in scenes for audio hook.
- Must address every clause:
  1. Fix the orchid start position so it "work well".
  2. Connect "the player" to the config main wave song in public assets (the [[audio]] main from assets.toml → /assets/audio/main.wav , already used as hbd in FrutigerScenes).
  3. Remove the smiley face.
  4. Make the glb animate *instead* (of smile/static).
  5. Dead centered.
  6. Scale for high dpi properly.
- Follow our flow exactly: anonymous job file, .programme (toml), full review before source, logs, history, build gates, IIPS.

## Current State (post prior authorized work)
- OrchidViewer.tsx (the 3D "player" for the sentient orchid reveal in gift/circa stage 2):
  - Current start: controls = { yaw: -0.7, pitch: 0.32, distance: 2.05 }; after box center + `position.y += 0.15` lift; camera lookAt(0, 0.22, 0). Not dead centered; orchid may appear slightly high or off for this GLB.
  - High DPI: `setPixelRatio(Math.min(dpr || 1, 2))` — functional but can be improved for "properly" (sharpness without perf hit or world-scale weirdness).
  - Smiley face: heavy — three Torus "smile" curve created on load + driven in animate (visibility/scale/pos by state) + DOM `<Show when={happy/tickled/blooming}> 😊 </Show>` overlay absolutely positioned. User explicitly wants removed.
  - Animate: only root procedural wiggles + orbiting sparkles (state driven). No AnimationMixer. GLB treated as static.
  - No internal "player" audio. (Parent FrutigerScenes already creates `sfxHbd = new Audio(props.audio.hbd)` from config, plays for whole gift scene including stage 2 orchid, and passes `externalAudio={sfxHbd}` + src to MusicTitlebar in the same stage2. The main wave song *is* connected at scene level.)
- FrutigerScenes (stage 2): renders OrchidViewer + MusicTitlebar hooked to the parent's sfxHbd (the config main). Stage 1 is now simply the open Hadacard (per prior job).
- Config/audio: assets.toml has `[[audio]] name = "main" path = "/assets/audio/main.wav"`. Parsed into config.assets.audio and passed down as `audio.hbd`.
- Model: public/assets/models/Orchid.glb (loaded via GLTFLoader; centering uses Box3).

## IIPS + Decisions (Prescriptive)
- **Remove smiley completely**: excise the three smile creation block, the drive logic in animate, the DOM overlay + styles in return, any smile-related state usage. Keep the statemachine (idle/curious/happy etc) because it powers nice wiggles/sparkles/game-like feel — just no visual smile.
- **Make the glb animate instead**: 
  - Add standard `THREE.AnimationMixer` + delta tracking (safe even if 0 clips).
  - In load: after model added, `if (gltf.animations?.length) { mixer = new AnimationMixer(model); gltf.animations.forEach(c => mixer.clipAction(c).play()); }`
  - In animate: `if (mixer) mixer.update(delta);` (track lastTime or use clock).
  - Enhance "the glb itself animates": after load, collect interesting children (traverse for meshes), store refs; in animate apply gentle per-child sway/scale/rot sin (different phase per "petal/stem" group) so the loaded GLB feels alive and breathing rather than a rigid prop + external smile.
- **Fix start position + dead centered**:
  - Tune initial `controls = { yaw: -0.2, pitch: 0.12, distance: 2.35, ... }` (frontish, slight elevation for nice orchid "face" presentation).
  - In load centering: after `position.sub(center.multiplyScalar(scale))`, do `model.position.y = 0;` (or small negative to sit nicely on "ground" of view) — remove the +0.15 lift.
  - `camera.lookAt(0, 0, 0);` (or computed center Y = 0 after positioning).
  - Comment the magic numbers for future tuning.
- **Scale for high dpi properly**:
  - `const dpr = Math.min(window.devicePixelRatio || 1, 2.25); renderer.setPixelRatio(dpr);`
  - Keep world units / model scale independent of dpr (three handles backing store).
  - Optional: after load `model.scale.multiplyScalar( dpr > 1 ? 0.98 : 1 );` if the GLB appears slightly large on retina — but primarily rely on good distance + box centering.
- **Connect the player to the config main wave song**:
  - Add to `OrchidViewerProps`: `externalAudio?: HTMLAudioElement; audioSrc?: string;`
  - In component: `let bgm: HTMLAudioElement | undefined;`
  - In setup (after renderer ready): 
    ```
    const src = props.externalAudio ? null : (props.audioSrc || (/* try config */ '/assets/audio/main.wav'));
    if (props.externalAudio) {
      bgm = props.externalAudio;  // reuse parent's (already the config main)
    } else {
      bgm = new Audio(src);
      bgm.loop = true; bgm.volume = 0.38;
      bgm.play().catch(()=>{});
    }
    ```
  - In onCleanup: `if (bgm && !props.externalAudio) { bgm.pause(); bgm = undefined; }`
  - To truly "connect to config": top-level `import { config } from '@/config';` and `const mainFromConfig = config?.assets?.audio?.main || defaultPath;`
  - Update the stage 2 usage: `<OrchidViewer ... externalAudio={sfxHbd} />` so the orchid "player" (3D + its chrome) shares the single main wave instance owned by the gift scene (no double audio, perfect connection).
- **Keep existing goodness**: statemachine, wiggles/sparkles (now will feel like they belong to the animating GLB), touch, guided views, sparkle pulses, cleanup, mobile, glass frame. Just remove smile distraction and make the *GLB* the star that animates + is perfectly framed + has the main song as its BGM.
- File / VFS: keep changes in the viewer; one small usage update in scenes for the hook. Use the new job + this review + programme as the trace.

## Risks & Mitigations
- Double audio: mitigated by externalAudio reuse pattern (already proven by MusicTitlebar in same stage). Viewer only creates its own if no external passed.
- GLB has no clips (common for decorative models): mixer is no-op safe; the traverse "animate the glb" + existing wiggles will make it lively.
- Centering / start pos changes visible to all callers: the values chosen + comments are conservative; the gift scene is the primary consumer right now.
- High dpi perf: cap at ~2.25; world scale unchanged.
- Removing smile: the "personify" request from prior job is honored by making the *GLB itself* animate (breathing/sway) instead of a face sticker. More elegant for a 3D botanical gift.
- Audio timing (sfxHbd created in onMount of parent): passing the ref works because the orchid stage is shown while the component (and its audio) is still alive.
- Build/TS: no new types beyond optional props.

## Verification Steps (run after edits)
1. `cd web && bun run build` — clean (repeat after P1 viewer changes and after usage hook).
2. Grep for smile / 😊 / smileGeo in the viewer file → zero.
3. Mental load of /gifts/circa-1993 (or the orchid stage): on reveal the orchid is dead center, nicely framed (no lift/offset), sharp on high-dpi simulation, "animates" (mixer if clips + visible per-part sway/breathing), and the main wave song (from config/public assets) is the BGM (via external or internal player, visible in MusicTitlebar chrome if present).
4. Home Hadacard + other pages unaffected.
5. No console audio errors, touch/drag/zoom/guided views still work, cleanup on unmount.
6. .agents/ trace complete: job + programme + this review + log updates + history entry.
7. "Work well": start pos makes the orchid immediately beautiful and centered without user adjustment.

## Pre-Change Sign-off
- Authorizing job (fix-orchid-viewer.job) read.
- All relevant sources + config audio + prior orchid review/programme/history + rules read.
- This review now exists and is coherent (covers every word of the request, exact scope, IIPS applied, risks called, verification concrete).
- Protocol followed: **no search_replace or write to web/src/ will occur until this review is written**.
- Will update programme + log at gates.
- Will append to history on close.
- Will run builds after each risky chunk.
- The resulting orchid will feel even more like the living heart of the letter: perfectly presented, animated with life, accompanied by its main wave song from the config, no distracting smiley.

**Next (after this review is the gate)**: create/update log + this programme, then P1 edits to viewer (remove smile, centering, dpi, glb animate + audio player code), P2 usage hook for externalAudio, builds, close.

*Review authorizes the anonymous fix execution.*
