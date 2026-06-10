import { onMount, onCleanup, createSignal } from 'solid-js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { haptic } from '@/utils/haptics';
import { config } from '@/config';  // for main wave song connection from assets.toml / public/assets

/**
 * OrchidViewer — mobile-friendly, interactive 3D rendering of Orchid.glb
 * for the gift end scene (replaces egift/voucher reveal per job).
 *
 * Features:
 * - Pointer/touch drag: yaw + pitch orbit around model
 * - Wheel + pinch: zoom (distance)
 * - Gentle auto-orbit when idle (romantic, not frantic)
 * - Soft feminine lighting (pinks, blush, cyan rim, warm key)
 * - Tap/click for "sparkle" pulse (haptic + scale pop + extra point lights)
 * - Clean glass-friendly framing, elegant empty state
 * - Full cleanup (dispose geometry/materials, cancel RAF)
 *
 * Usage:
 *   <OrchidViewer client:load class="w-full h-[520px] md:h-[620px]" />
 */

export interface OrchidViewerProps {
  class?: string;
  modelPath?: string; // default /assets/models/Orchid.glb
  autoRotateSpeed?: number;
  // Audio connection for "the player" to the config main wave song (public/assets/audio/main.wav via assets.toml)
  externalAudio?: HTMLAudioElement; // preferred: share parent's sfxHbd (already the main from config)
  audioSrc?: string;                // fallback path
}

export default function OrchidViewer(props: OrchidViewerProps) {
  let containerRef: HTMLDivElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;

  const modelPath = () => props.modelPath || '/assets/models/Orchid.glb';
  const autoRotateSpeed = () => props.autoRotateSpeed ?? 0.0006;

  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  // Tiny idiomatic functional solid statemachine for the sentient orchid (per job)
  type OrchidState = 'idle' | 'curious' | 'happy' | 'blooming' | 'tickled';
  const [orchidState, setOrchidState] = createSignal<OrchidState>('idle');

  let renderer: THREE.WebGLRenderer | null = null;
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let model: THREE.Group | null = null;
  let mixer: THREE.AnimationMixer | null = null;  // for glb animations (make the GLB animate instead of smile)
  let frameId: number | null = null;
  let lastAnimTime = 0;
  // Tuned for easy spin on pedestal: closer distance, good initial angle so spinning lets you see the full orchid, base, and tag from all sides.
  let controls = { yaw: 0.1, pitch: 0.12, distance: 1.9, auto: true, lastMove: 0 };

  let pointerDown = false;
  let lastX = 0;
  let lastY = 0;

  // The "player" audio (main wave song). Reuses external if provided (best for no double-play with parent sfxHbd).
  let bgmAudio: HTMLAudioElement | undefined;

  // Derived anim params from state (game-like reactivity)
  const wiggleAmp = () => {
    const s = orchidState();
    if (s === 'tickled' || s === 'happy') return 0.018;
    if (s === 'blooming') return 0.009;
    return 0.003;
  };
  const sparkleRate = () => (orchidState() === 'happy' || orchidState() === 'tickled' || orchidState() === 'blooming' ? 0.12 : 0.02);

  const disposeAll = () => {
    if (frameId) cancelAnimationFrame(frameId);
    if (renderer) {
      renderer.dispose();
      const dom = renderer.domElement;
      if (dom && dom.parentNode) dom.parentNode.removeChild(dom);
    }
    if (scene) {
      scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose?.();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose?.());
          else obj.material.dispose?.();
        }
      });
    }
    renderer = null;
    scene = null;
    camera = null;
    model = null;
  };

  const sparkle = (intensity = 1) => {
    if (!scene || !model) return;
    haptic.trigger('success');

    // quick scale pop + state advance for game-like feel
    const origScale = model.scale.x;
    model.scale.setScalar(origScale * 1.03);
    const s = orchidState();
    if (s === 'idle' || s === 'curious') setOrchidState('happy');
    else if (s === 'happy') setOrchidState('tickled');

    // temporary extra lights for sparkle
    const pink = new THREE.PointLight(0xff99cc, 1.2 * intensity, 12);
    pink.position.set(0.8, 1.2, 1.5);
    scene.add(pink);

    const cyan = new THREE.PointLight(0x66f0ff, 0.9 * intensity, 10);
    cyan.position.set(-1.1, 0.6, -0.8);
    scene.add(cyan);

    setTimeout(() => {
      scene?.remove(pink);
      scene?.remove(cyan);
      pink.dispose();
      cyan.dispose();
      if (model) model.scale.setScalar(origScale);
    }, 420);
  };

  const advanceState = (next: OrchidState) => {
    setOrchidState(next);
    // gentle sparkle on state change
    setTimeout(() => sparkle(0.6), 60);
  };

  // Connect "the player" (this orchid view) to the config main wave song in public assets.
  // If externalAudio passed (e.g. parent's sfxHbd which is already new Audio(config audio.hbd = main.wav)), reuse it.
  // Otherwise create our own using the path from config or the known public asset.
  const connectMainWavePlayer = () => {
    if (bgmAudio) return; // already connected
    if (props.externalAudio) {
      bgmAudio = props.externalAudio;
      // Do not play/pause here — parent owns the lifecycle (FrutigerScenes already started it for the gift).
      return;
    }
    const src = props.audioSrc
      || (config?.assets?.audio?.main as string | undefined)
      || '/assets/audio/main.wav';
    bgmAudio = new Audio(src);
    bgmAudio.loop = true;
    bgmAudio.volume = 0.38;
    bgmAudio.play().catch(() => { /* autoplay deferred is fine */ });
  };

  const onPointerDown = (e: PointerEvent | TouchEvent) => {
    pointerDown = true;
    controls.auto = false;
    controls.lastMove = Date.now();
    const ev = 'touches' in e ? (e as TouchEvent).touches[0] : (e as PointerEvent);
    lastX = ev.clientX;
    lastY = ev.clientY;
    (containerRef as any)?.setPointerCapture?.((e as PointerEvent).pointerId);

    // Touch-first tickle interaction -> game-like state
    const s = orchidState();
    if (s === 'idle' || s === 'curious') advanceState('happy');
    else if (s === 'happy') advanceState('tickled');
  };

  const onPointerMove = (e: PointerEvent | TouchEvent) => {
    if (!pointerDown || !model) return;
    const ev = 'touches' in e ? (e as TouchEvent).touches[0] : (e as PointerEvent);
    const dx = ev.clientX - lastX;
    lastX = ev.clientX;
    lastY = ev.clientY; // still track but don't use for pitch

    // Only Y rotation (spin like a thing on a spinable pedestal). No pitch from drag.
    // Increased sensitivity so it's easy and responsive to spin around and see all of it.
    controls.yaw += dx * 0.0065;
    controls.lastMove = Date.now();
  };

  const onPointerUp = () => {
    pointerDown = false;
    // re-enable auto after short idle
    setTimeout(() => {
      if (!pointerDown && Date.now() - controls.lastMove > 1400) {
        controls.auto = true;
      }
    }, 1200);
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    controls.auto = false;
    controls.lastMove = Date.now();
    if (model) {
      // Intuitive scaling of the object itself (pedestal feel)
      const factor = e.deltaY > 0 ? 0.95 : 1.05;
      let newS = model.scale.x * factor;
      newS = Math.max(0.4, Math.min(4.0, newS));
      model.scale.setScalar(newS);
    } else {
      const factor = e.deltaY > 0 ? 1.08 : 0.92;
      controls.distance = Math.max(1.4, Math.min(5.5, controls.distance * factor));
    }
  };

  const onClick = (e: MouseEvent) => {
    // tap anywhere on viewer for sparkle + state
    sparkle(0.85);
    const s = orchidState();
    if (s !== 'blooming') advanceState(s === 'tickled' ? 'blooming' : 'happy');
  };

  const setup = async () => {
    if (!canvasRef || !containerRef) return;

    // Connect the player (orchid view) to the main wave song from config / public assets early.
    connectMainWavePlayer();

    // renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    // Scale for high dpi properly (sharp on retina, capped for perf)
    const dpr = Math.min(window.devicePixelRatio || 1, 2.25);
    renderer.setPixelRatio(dpr);
    renderer.setSize(containerRef.clientWidth, containerRef.clientHeight);
    renderer.shadowMap.enabled = false;

    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(
      52,
      containerRef.clientWidth / containerRef.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.42, controls.distance);

    // romantic soft lighting (girly + elegant)
    const hemi = new THREE.HemisphereLight(0xffe4f0, 0x0a0b18, 0.6);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffd1e8, 0.95);
    key.position.set(1.5, 3.2, 2.0);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x66f0ff, 0.55);
    rim.position.set(-2.2, 1.0, -2.8);
    scene.add(rim);

    const fill = new THREE.PointLight(0xff99cc, 0.4, 20);
    fill.position.set(0, -1.5, 3);
    scene.add(fill);

    // load model
    const loader = new GLTFLoader();
    try {
      const gltf: any = await new Promise((resolve, reject) => {
        loader.load(modelPath(), resolve, undefined, reject);
      });
      model = gltf.scene;

      // Better scaled and positioned so the full orchid + base + tag is easy to spin around and see completely.
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.72 / maxDim;  // larger presence for better viewing while spinning
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));
      model.position.y = -0.02;  // sits nicely with the pedestal base visible at bottom

      scene.add(model);

      // Spinable pedestal base + visible bottom of the "container" (the 3D view)
      // The orchid now sits on a proper base so its bottom + pedestal are framed nicely in the viewer.
      const pedestalRadius = 1.15;
      const pedestalHeight = 0.13;
      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(pedestalRadius, pedestalRadius * 1.08, pedestalHeight, 48),
        new THREE.MeshPhongMaterial({
          color: 0x2a2a3a,
          shininess: 35,
          specular: 0x444455
        })
      );
      pedestal.position.y = -0.09;
      scene.add(pedestal);

      // Subtle base ring/plate for extra "bottom of container" definition
      const baseRing = new THREE.Mesh(
        new THREE.RingGeometry(pedestalRadius * 0.92, pedestalRadius * 1.18, 48),
        new THREE.MeshBasicMaterial({ color: 0x555566, side: THREE.DoubleSide, transparent: true, opacity: 0.55 })
      );
      baseRing.rotation.x = -Math.PI / 2;
      baseRing.position.y = pedestal.position.y - pedestalHeight / 2 + 0.005;
      scene.add(baseRing);

      // 3D gift tag text element in the scene, styled like a cute orchid-themed gift tag
      // "For Janell" + small inscription about the loveliness of orchids.
      try {
        const tagCanvas = document.createElement('canvas');
        tagCanvas.width = 512;
        tagCanvas.height = 256;
        const ctx = tagCanvas.getContext('2d', { alpha: true })!;
        if (ctx) {
          // Soft cream/pink tag body (gift tag paper look)
          ctx.fillStyle = '#fff8f0';
          ctx.strokeStyle = '#ff99cc';
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.roundRect(70, 38, 372, 168, 18);
          ctx.fill();
          ctx.stroke();

          // Top string hole
          ctx.fillStyle = '#0a0b18';
          ctx.beginPath();
          ctx.arc(256, 52, 15, 0, Math.PI * 2);
          ctx.fill();

          // Delicate string (two curves for 3D tag feel)
          ctx.strokeStyle = '#ff99cc';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(256, 37);
          ctx.quadraticCurveTo(256, 8, 208, 4);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(256, 37);
          ctx.quadraticCurveTo(256, 8, 304, 4);
          ctx.stroke();

          // "For Janell" - prominent
          ctx.fillStyle = '#c41e6a';
          ctx.font = "bold 34px 'Great Vibes', cursive, serif";
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('For Janell', 256, 92);

          // Small inscription about the loveliness of orchids
          ctx.font = "22px 'Great Vibes', cursive, serif";
          ctx.fillStyle = '#ff66c4';
          ctx.fillText('the loveliness of orchids', 256, 125);

          ctx.font = "18px 'Great Vibes', cursive, serif";
          ctx.fillText('🌸', 256, 148);

          // Tiny decorative accents
          ctx.fillStyle = '#ff99cc';
          ctx.beginPath(); ctx.arc(180, 115, 4, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(332, 115, 4, 0, Math.PI * 2); ctx.fill();
        }

        const tagTex = new THREE.CanvasTexture(tagCanvas);
        tagTex.anisotropy = 8;
        const tagMat = new THREE.MeshBasicMaterial({ map: tagTex, transparent: true, side: THREE.DoubleSide });
        const tag = new THREE.Mesh(new THREE.PlaneGeometry(1.72, 0.88), tagMat);
        // Positioned nicely to the side so it's visible when spinning the pedestal and easy to see the inscription.
        tag.position.set(1.48, 0.52, 0.62);
        tag.rotation.y = -0.38;
        tag.rotation.x = 0.06;
        // Attach to model so tag spins with the orchid on the pedestal
        model.add(tag);
      } catch (e) {
        console.warn('Gift tag creation skipped:', e);
      }

      // Make the GLB animate (instead of smiley). Use any embedded clips + our procedural "life".
      try {
        const gltfAnims = (gltf as any).animations || [];
        if (gltfAnims.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltfAnims.forEach((clip: any) => {
            const action = mixer!.clipAction(clip);
            action.play();
          });
        }
      } catch {}

      setIsLoading(false);
    } catch (e: any) {
      console.warn('Orchid.glb load failed:', e);
      setError('The orchid could not bloom right now. (GLB load)');
      setIsLoading(false);
      // graceful fallback: a soft glowing sphere + hint text
      const sph = new THREE.Mesh(
        new THREE.SphereGeometry(0.7, 32, 32),
        new THREE.MeshPhongMaterial({ color: 0xff99cc, shininess: 18, emissive: 0x331122 })
      );
      scene.add(sph);
      model = new THREE.Group();
      model.add(sph);
      scene.add(model);
    }

    // resize handler
    const handleResize = () => {
      if (!containerRef || !camera || !renderer) return;
      camera.aspect = containerRef.clientWidth / containerRef.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.clientWidth, containerRef.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    (window as any)._orchidResize = handleResize;

    // pointer + touch
    const el = containerRef;
    el.addEventListener('pointerdown', onPointerDown as any);
    window.addEventListener('pointermove', onPointerMove as any);
    window.addEventListener('pointerup', onPointerUp as any);
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('click', onClick);

    // touch pinch - now intuitive direct model scaling (like grabbing and resizing the physical orchid on its pedestal)
    let lastDist = 0;
    const onTouchMove2 = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        if (lastDist && model) {
          const scaleFactor = dist / lastDist;
          let newS = model.scale.x * scaleFactor;
          newS = Math.max(0.4, Math.min(4.0, newS)); // intuitive limits
          model.scale.setScalar(newS);
          controls.auto = false;
          controls.lastMove = Date.now();
        }
        lastDist = dist;
      }
    };
    const onTouchEnd2 = () => { lastDist = 0; };
    el.addEventListener('touchmove', onTouchMove2 as any, { passive: false });
    el.addEventListener('touchend', onTouchEnd2 as any);

    // Tiny orbiting sparkle particles (threejs) for wiggles/sparkles when happy
    let sparkles: THREE.Points | null = null;
    const createSparkles = () => {
      if (!scene || sparkles) return;
      const count = 28;
      const positions = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const r = 0.9 + Math.random() * 0.6;
        const a = Math.random() * Math.PI * 2;
        positions[i * 3] = Math.cos(a) * r;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.8 + 0.2;
        positions[i * 3 + 2] = Math.sin(a) * r * 0.6;
        sizes[i] = 0.02 + Math.random() * 0.03;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      const mat = new THREE.PointsMaterial({ color: 0xffd1e8, size: 0.035, transparent: true, opacity: 0.85, depthWrite: false });
      sparkles = new THREE.Points(geo, mat);
      sparkles.visible = false;
      scene.add(sparkles);
    };

    // main loop with state-driven wiggles + sparkles + smile reactivity
    const animate = () => {
      if (!renderer || !scene || !camera || !model) return;

      const now = Date.now();
      const delta = lastAnimTime ? (now - lastAnimTime) / 1000 : 0.016;
      lastAnimTime = now;

      const idle = now - controls.lastMove > 1600;
      const state = orchidState();
      const w = wiggleAmp();

      // Mixer update — makes the GLB itself animate if it has clips
      if (mixer) {
        mixer.update(delta);
      }

      if (controls.auto && idle) {
        controls.yaw += autoRotateSpeed() * (state === 'curious' ? 0.6 : 1);
        controls.pitch = 0.28 + Math.sin(now * 0.00028) * 0.07;
      }

      // position camera from spherical-ish
      const x = Math.sin(controls.yaw) * Math.cos(controls.pitch) * controls.distance;
      const y = Math.sin(controls.pitch) * controls.distance * 0.82 + 0.28;
      const z = Math.cos(controls.yaw) * Math.cos(controls.pitch) * controls.distance;

      camera.position.set(x, y, z);
      camera.lookAt(0, -0.12, 0);  // frame the pedestal base and full height so spinning shows everything nicely

      // WIGGLES + "the GLB animates" (procedural life on the loaded model instead of smile)
      if (model) {
        const bob = Math.sin(now * 0.0016) * 0.018;
        const wiggle = Math.sin(now * 0.004 + controls.yaw) * w;
        model.rotation.y = controls.yaw * 0.12 + wiggle * 0.7;
        model.position.y = 0.12 + bob + (state === 'blooming' ? Math.sin(now * 0.003) * 0.04 : 0);
        // extra happy wiggle on x for "tail wag" feel (model life)
        if (state === 'happy' || state === 'tickled') {
          model.rotation.x = Math.sin(now * 0.0035) * 0.04;
        } else {
          model.rotation.x = 0;
        }

        // Extra: make sub-parts of the GLB sway (petals/stem "animate" the model)
        // This gives the loaded glb organic life even if it has no baked clips.
        model.traverse((child: any) => {
          if (child.isMesh && child !== model) {
            const phase = (child.id % 7) * 0.7;
            const amp = 0.018 + (state === 'tickled' || state === 'happy' ? 0.012 : 0);
            child.rotation.x = Math.sin(now * 0.0022 + phase) * amp * 0.6;
            child.rotation.z = Math.sin(now * 0.0018 + phase * 1.3) * amp * 0.4;
            if (state === 'blooming') {
              const s = 1 + Math.sin(now * 0.003 + phase) * 0.012;
              child.scale.setScalar(s);
            }
          }
        });
      }

      // Orbiting sparkles when excited states (wiggles/sparkles)
      if (sparkles) {
        sparkles.visible = (state === 'happy' || state === 'tickled' || state === 'blooming');
        if (sparkles.visible && sparkles.geometry) {
          const pos = (sparkles.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
          const t = now * 0.0012;
          for (let i = 0; i < pos.length / 3; i++) {
            const r = 0.9 + Math.sin(t + i) * 0.15;
            const a = (i * 1.7) + t * (state === 'tickled' ? 2.2 : 1.1);
            pos[i * 3] = Math.cos(a) * r;
            pos[i * 3 + 2] = Math.sin(a) * r * 0.55 + Math.sin(t * 1.3 + i) * 0.08;
          }
          (sparkles.geometry.attributes.position as any).needsUpdate = true;
          // occasional extra sparkle burst chance
          if (Math.random() < sparkleRate()) {
            // nudge one
            const idx = Math.floor(Math.random() * (pos.length / 3));
            pos[idx * 3 + 1] += 0.03;
          }
        }
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    createSparkles();
    animate();
  };

  onMount(() => {
    setup();
  });

  onCleanup(() => {
    const el = containerRef;
    if (el) {
      el.removeEventListener('pointerdown', onPointerDown as any);
      el.removeEventListener('wheel', onWheel as any);
      el.removeEventListener('click', onClick as any);
    }
    window.removeEventListener('pointermove', onPointerMove as any);
    window.removeEventListener('pointerup', onPointerUp as any);
    if ((window as any)._orchidResize) {
      window.removeEventListener('resize', (window as any)._orchidResize);
      delete (window as any)._orchidResize;
    }
    // Only stop audio we created (not external/parent-owned main wave player)
    if (bgmAudio && !props.externalAudio) {
      bgmAudio.pause();
      bgmAudio = undefined;
    }
    disposeAll();
  });

  return (
    <div
      ref={containerRef}
      class={`relative w-full overflow-hidden rounded-3xl bg-[#0a0b18] ${props.class || 'h-[520px] md:h-[620px]'}`}
      style={{ "touch-action": "none" }}
    >
      <canvas ref={canvasRef} class="absolute inset-0 w-full h-full" />

      {isLoading() && (
        <div class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div class="aero-glass px-5 py-2 rounded-full text-xs tracking-[3px] text-aero-cyan/90">blooming the orchid...</div>
        </div>
      )}
      {error() && (
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-[10px] text-white/50 font-mono bg-black/40 px-3 py-1 rounded">
          {error()}
        </div>
      )}

      {/* Guided spin presets (pedestal only - yaw + nice framing/scale) */}
      <div class="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 text-[9px] font-mono tracking-widest">
        {(['Front', 'Side', 'Back', 'Close'] as const).map((label) => (
          <button
            class="aero-glass px-2.5 py-0.5 rounded-full text-white/80 active:scale-95 transition select-none cursor-pointer border border-white/10"
            style={{ "font-family": "'Comfortaa', sans-serif" }}
            onPointerDown={(e) => {
              e.stopPropagation();
              haptic.trigger('light');
              const c = controls;
              if (model) {
                if (label === 'Front') { c.yaw = -0.2; model.scale.setScalar(1.0); }
                else if (label === 'Side') { c.yaw = 1.4; model.scale.setScalar(1.0); }
                else if (label === 'Back') { c.yaw = 3.0; model.scale.setScalar(1.0); }
                else { c.yaw = -0.1; model.scale.setScalar(1.55); } // intimate close look
              }
              c.auto = false;
              c.lastMove = Date.now();
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* subtle elegant hint */}
      <div class="absolute bottom-9 right-4 text-[9px] text-white/30 font-mono tracking-widest pointer-events-none z-10 select-none">
        SPIN THE PEDESTAL • PINCH TO SCALE • TAP FOR MAGIC
      </div>
    </div>
  );
}
