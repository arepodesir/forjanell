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
}

export default function OrchidViewer(props: OrchidViewerProps) {
  let containerRef: HTMLDivElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;

  const modelPath = () => props.modelPath || '/assets/models/Orchid.glb';

  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

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

  // (no state-driven animation params — pure focus on the model geometry and perfect framing)

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

  // No extra sparkle or state visuals (focus strictly on the orchid geometry and perfect framing)

  // (no audio connection — focus strictly on the visual orchid and perfect tip+base framing)

  const onPointerDown = (e: PointerEvent | TouchEvent) => {
    pointerDown = true;
    controls.auto = false;
    controls.lastMove = Date.now();
    const ev = 'touches' in e ? (e as TouchEvent).touches[0] : (e as PointerEvent);
    lastX = ev.clientX;
    lastY = ev.clientY;
    (containerRef as any)?.setPointerCapture?.((e as PointerEvent).pointerId);
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
    // tap stops auto-orbit (keeps focus on the static beautiful orchid)
    controls.auto = false;
    controls.lastMove = Date.now();
  };

  const setup = async () => {
    if (!canvasRef || !containerRef) return;

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

    // main loop (pure model + controls, no extra particles or state wiggles)
    const animate = () => {
      if (!renderer || !scene || !camera || !model) return;

      const now = Date.now();
      const delta = lastAnimTime ? (now - lastAnimTime) / 1000 : 0.016;
      lastAnimTime = now;

      const idle = now - controls.lastMove > 1600;

      if (controls.auto && idle) {
        controls.yaw += autoRotateSpeed();
        // very subtle pitch bob for life, but kept minimal so framing of tip/base stays perfect
        controls.pitch = 0.18 + Math.sin(now * 0.0003) * 0.04;
      }

      // position camera from spherical-ish
      const x = Math.sin(controls.yaw) * Math.cos(controls.pitch) * controls.distance;
      const y = Math.sin(controls.pitch) * controls.distance * 0.82 + 0.28;
      const z = Math.cos(controls.yaw) * Math.cos(controls.pitch) * controls.distance;

      camera.position.set(x, y, z);
      camera.lookAt(0, -0.12, 0);  // frame the pedestal base and full height so spinning shows everything nicely

      // Minimal model orientation from controls only (no state wiggles or sub-part animation)
      if (model) {
        model.rotation.y = controls.yaw * 0.15;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

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

    </div>
  );
}
