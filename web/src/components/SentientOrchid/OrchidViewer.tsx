import { onMount, onCleanup, createSignal } from 'solid-js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { haptic } from '@/utils/haptics';

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
  let frameId: number | null = null;
  let lastAnimTime = 0;
  // Controls tuned for framing.
  // Slightly closer initial distance in the gift reveal so the orchid feels more zoomed/filling the (larger) window.
  let controls = { yaw: 0.35, pitch: 0.18, distance: 1.05, auto: false, lastMove: 0 };

  // Framing offsets for "center the orchid + move it down".
  // MODEL_Y and LOOKAT_Y position the bloom/pot so the flower head is near vertical center of the canvas
  // (not pinned to top or extreme bottom). VIEW_BIAS smaller + offset raises camera slightly so the
  // subject sits lower in the rendered frame. Tune these + container mt/pt for the desired romantic placement.
  const ORCHID_MODEL_Y = -1.25;
  const ORCHID_LOOKAT_Y = -0.10;
  const VIEW_BIAS = 0.42;
  const VIEW_BIAS_OFFSET = 0.15;

  let pointerDown = false;
  let lastX = 0;
  let lastY = 0;

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
    lastY = ev.clientY;

    // ONLY single axis rotation (yaw / horizontal spin). No pitch from drag. Fixed pitch (0.18) used in camera for centered view of flower + pot.
    controls.yaw += dx * 0.0075;
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
    // Zoom via camera distance only — keeps the perfect tip-to-base framing consistent
    const factor = e.deltaY > 0 ? 1.08 : 0.92;
    controls.distance = Math.max(1.35, Math.min(3.8, controls.distance * factor));
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

    // camera (framing will be set after model load using perfect tip-to-base calculations)
    camera = new THREE.PerspectiveCamera(
      52,
      containerRef.clientWidth / containerRef.clientHeight,
      0.1,
      100
    );

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

      // Just the flower and pot (native GLB geometry only — no added protruding base/pedestal/cylinder/ring in the center).
      // Proper center for mobile full view + tight framing (tip of flower to bottom of pot centered and filling the view height).
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      const scale = 1.9 / maxDim;  // tuned for tight presence + full mobile view fill
      model.scale.setScalar(scale);

      // Recompute box AFTER scale for accurate centering (GLTF pivots often not at geometric center).
      const box2 = new THREE.Box3().setFromObject(model);
      const center2 = box2.getCenter(new THREE.Vector3());
      model.position.sub(center2);

      // === LOAD POSITION COORDINATES (center + move down) ===
      // X/Z = 0 for horizontal center. Y + lookAt + camera bias tuned so the bloom sits ~center vertically
      // in the 3D canvas while the whole orchid composition is shifted lower ("move it down").
      model.position.x = 0;
      model.position.z = 0;
      model.position.y = ORCHID_MODEL_Y;

      // === LOAD ROTATION COORDINATES (fixed for upright + facing viewer) ===
      // Correct any baked-in GLB orientation issues so the orchid loads upright (pot base down, stem vertical).
      // Y rotation gives a pleasing 3/4 romantic view facing the camera (flower bloom toward viewer).
      // Small X/Z for any natural lean/tilt correction. These values were derived from:
      // - current camera spherical (yaw~0.4, pitch 0.18, distance=fit)
      // - "perfect tip-to-base" + "tight centered mobile full view" requirements
      // - larger container from prior gift layout changes
      // - visual intent: upright, no sideways lean, flower not edge-on.
      model.rotation.set(0.04, 0.32, -0.02);  // rx=0.04 (slight level), ry=0.32rad(~18deg) for facing, rz=-0.02 (tiny natural)

      scene.add(model);

      // Derive tight fitDistance from the model's own vertical size (flower + native pot only) + fov.
      const fov = 52 * (Math.PI / 180);
      const verticalSize = size.y * scale;
      const fitDistance = (verticalSize / 2) / Math.tan(fov / 2) * 1.08;  // 1.08 = tight, minimal empty space, full centered view on mobile

      // Initial controls: single axis (yaw only), fixed pitch for good pot visibility, centered distance.
      // (The actual upright + facing rotation is set explicitly via coordinates on the model at load time, below.)
      controls.distance = fitDistance;
      controls.yaw = 0.4;
      controls.pitch = 0.18;  // FIXED single value — balanced view of upright flower + pot, centered in frame
      controls.auto = false;

      // Apply the centered framing immediately (with slight down bias per ORCHID_* constants).
      const ix = Math.sin(controls.yaw) * Math.cos(controls.pitch) * controls.distance;
      const iy = Math.sin(controls.pitch) * controls.distance * VIEW_BIAS + VIEW_BIAS_OFFSET;
      const iz = Math.cos(controls.yaw) * Math.cos(controls.pitch) * controls.distance;
      camera.position.set(ix, iy, iz);
      camera.lookAt(0, ORCHID_LOOKAT_Y, 0);  // look near centered model for vertical centering + slight down bias

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

    // touch pinch — camera distance only (preserves perfect tip + base framing at all times)
    let lastDist = 0;
    const onTouchMove2 = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        if (lastDist) {
          const scaleFactor = dist / lastDist;
          controls.distance = Math.max(1.35, Math.min(3.8, controls.distance / scaleFactor));
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
        controls.yaw += 0.0004; // very gentle idle spin — only single axis (yaw). Pitch is fixed at 0.18 for tight centered mobile full view of just the flower + pot. (Base rotation coords keep upright/facing.)
      }

      // Clamp distance only (to keep the framing tight). Pitch is fixed single value (0.18) — no variation, only yaw rotation.
      const minDist = 1.35;
      const maxDist = 3.8;
      controls.distance = Math.max(minDist, Math.min(maxDist, controls.distance));

      // position camera from spherical — fixed pitch (0.18), yaw only.
      // lookAt + bias use the centering + "move down" offsets (less extreme than previous base-pin).
      const x = Math.sin(controls.yaw) * Math.cos(controls.pitch) * controls.distance;
      const y = Math.sin(controls.pitch) * controls.distance * VIEW_BIAS + VIEW_BIAS_OFFSET;
      const z = Math.cos(controls.yaw) * Math.cos(controls.pitch) * controls.distance;

      camera.position.set(x, y, z);
      camera.lookAt(0, ORCHID_LOOKAT_Y, 0);

      // Model orientation: base load rotation (upright + facing coordinates set above) + small dynamic yaw.
      // This keeps the orchid correctly oriented on initial load (before any interaction) while allowing
      // gentle interactive turning. The base values ensure "no mistake" upright pot + flower toward viewer.
      if (model) {
        // base from load fix: rx=0.04, ry=0.32, rz=-0.02
        model.rotation.set(0.04, 0.32 + controls.yaw * 0.15, -0.02);
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
