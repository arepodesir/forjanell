# Review: R-004-particles-stylized (for T-004 / P-004)

**Task**: .agents/tasks/T-004-particles-stylized.task
**Programme**: .agents/programmes/P-004-particles-stylized.programme
**Job Ref**: main
**Status**: Gate. Authorizes particles bg stylization (target FrutigerScenes canvas or home). "sea of perlin noise well distributed" with gradients, SVG-inspired animation noisiness.

## Scope
Enhance the main TS/canvas particles background (primary: FrutigerScenes.tsx canvas particles - 92+ hearts/sparks/dots, connect lines, mouse/touch attract, girly colors, burst, drift, twinkle).

Stylize:
- Gradients: in particle draw (ctx radial/linear gradient for depth/glow instead of solid fill).
- Animation noisiness using "svg stuff": simulate SVG noise/filter with canvas (multi-octave layered Math.sin + rand for Perlin-like 1D/2D noise func; use for position jitter, velocity modulation, alpha/size over time for "noisiness").
- Sea of Perlin well distributed: positions from semi-grid + noise offset (e.g. for i in layers: x = i*spacing + noise(i), y similar + slow drift); layered (bg large slow noise waves, mid, fg small fast). Organic flow like sea surface, not uniform or clumpy. Gradients on color (aero palette with alpha blends). Animation: noise(t + phase) for vx/vy/alpha twinkle.

Keep: mouse attract/repel, connect (delicate), burst on pop/tap, cap count for perf, mobile touch, existing cleanup.

Evolve to "sea" feel while fitting gift bg (or keep girly if fits; user said "like a sea").

If helpful, light SVG overlay with <filter x="0" y="0" for noise, but prefer pure canvas for integration/perf with existing RAF/ctx.

## Pre-Reads
- Task + prog + main job.
- FrutigerScenes.tsx (full particle system: count 92, colors array, kind dot/heart/spark, burst, mousePos attract, draw hearts/sparks/arcs + lines, drift, twinkle, RAF animate, on pop/tap).
- global.css (bubbleBurst, gradients, mouse-bubble if home relevant).
- home/index.astro script (mouse-bubble creation for home bg).
- Prior particles notes (girly powerful, hearts/petals, connect, mobile).

## Risks
- Perf: noise calc per particle per frame - keep cheap (precompute or simple sin, cap particles).
- Mobile: touch events, no heavy.
- Theme: keep some girly/aero while adding sea noise (grads help).
- Scene logic: particles only bg, do not affect audio/time/orchid.
- "Well distributed": avoid clustering; use noise for organic not random chaos.

## Impl Notes (post gate)
- In FrutigerScenes particle init/animate/draw:
  - Add simple noise func: e.g. function noise(x,y,t) { return Math.sin(x*0.1 + t) + 0.5*Math.sin(y*0.07 - t*0.8) + rand*0.2 layered for octaves. }
  - For positions: base grid + noise offsets per layer.
  - Draw: instead of solid fill, ctx fillStyle = radial gradient (center color to transparent with aero-pink etc).
  - Animation: for each p, use noise(p.x*scale, p.y, now*0.001 + phase) to modulate vx, vy (slow wave), alpha, size for noisiness/jitter.
  - Layers: 2-3 particle groups with different noise freq/amp/speed for "sea" depth (bg large swells, surface ripples).
  - Keep existing attract, connect (perhaps thinner/more gradient), burst.
- If SVG: optional static or animated <svg> with feTurbulence noise filter as subtle overlay on the canvas container for extra "svg stuff" noisiness (low opacity).
- Update comments for "stylized Perlin sea".
- No change to other scene code.

## Verification
- build 0
- In gift scene: particles now look like stylized sea of Perlin noise (grad fills, organic distributed flow with noise jitter/animation, well spaced waves not clumps, animated noisiness). Still interactive/girly elements if kept.
- Mental: "sea" feel, gradients depth, noise for lively surface. Perf ok (no stutter).
- Grep for new noise/gradient code.
- Log detailed before/after desc + mental.

**This review authorizes the particles stylization (T-004).**