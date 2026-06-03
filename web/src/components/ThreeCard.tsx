import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import * as THREE from 'three';
import { haptic } from '../utils/haptics';

export default function ThreeCard() {
  let canvasContainerRef: HTMLDivElement | undefined;
  let renderer: THREE.WebGLRenderer | undefined;
  let scene: THREE.Scene | undefined;
  let camera: THREE.PerspectiveCamera | undefined;
  let cardMesh: THREE.Mesh | undefined;
  let bubbles: THREE.Mesh[] = [];
  let requestRef: number | undefined;

  const [motionActive, setMotionActive] = createSignal(false);
  const [loading, setLoading] = createSignal(true);

  // Animation values
  let targetRotateX = 0;
  let targetRotateY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;
  
  // Point light for moving reflections
  let pointLight: THREE.PointLight | undefined;

  // Handle device orientation for mobile tilt
  const handleOrientation = (e: DeviceOrientationEvent) => {
    if (e.beta === null || e.gamma === null) return;
    
    // Map beta (front-to-back tilt) and gamma (left-to-right tilt) to rotations
    // Adjust mapping coefficients for natural 3D parallax feel
    const pitch = (e.beta - 50) * (Math.PI / 180) * 0.4; // assume holding phone at ~50 degree tilt
    const roll = e.gamma * (Math.PI / 180) * 0.4;
    
    targetRotateX = Math.max(-0.4, Math.min(0.4, pitch));
    targetRotateY = Math.max(-0.4, Math.min(0.4, roll));
    setMotionActive(true);
  };

  // iOS orientation permission flow
  const requestPermission = async () => {
    haptic.trigger('light');
    const DeviceOrientation = (window as any).DeviceOrientationEvent;
    if (DeviceOrientation && typeof DeviceOrientation.requestPermission === 'function') {
      try {
        const permissionState = await DeviceOrientation.requestPermission();
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          setMotionActive(true);
        }
      } catch (err) {
        console.warn("DeviceOrientation permission rejected:", err);
      }
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
      setMotionActive(true);
    }
  };

  onMount(() => {
    if (!canvasContainerRef) return;

    const width = canvasContainerRef.clientWidth || 320;
    const height = canvasContainerRef.clientHeight || 420;

    // 1. Setup Scene & Camera
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f1124, 0.04);

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 13;

    // 2. Setup Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    canvasContainerRef.appendChild(renderer.domElement);

    // 3. Setup Lights (Aero-glowing environment lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f3ff, 1.5);
    dirLight.position.set(5, 5, 4);
    scene.add(dirLight);

    const dirLightPink = new THREE.DirectionalLight(0xff66c4, 1.2);
    dirLightPink.position.set(-5, -5, 4);
    scene.add(dirLightPink);

    pointLight = new THREE.PointLight(0xffffff, 2.5, 25);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // 4. Create Card Geometry (Rounded Rectangle shape)
    const cardW = 5.2;
    const cardH = 8.0;
    const radius = 0.55;

    const shape = new THREE.Shape();
    shape.moveTo(-cardW / 2, -cardH / 2 + radius);
    shape.lineTo(-cardW / 2, cardH / 2 - radius);
    shape.quadraticCurveTo(-cardW / 2, cardH / 2, -cardW / 2 + radius, cardH / 2);
    shape.lineTo(cardW / 2 - radius, cardH / 2);
    shape.quadraticCurveTo(cardW / 2, cardH / 2, cardW / 2, cardH / 2 - radius);
    shape.lineTo(cardW / 2, -cardH / 2 + radius);
    shape.quadraticCurveTo(cardW / 2, -cardH / 2, cardW / 2 - radius, -cardH / 2);
    shape.lineTo(-cardW / 2 + radius, -cardH / 2);
    shape.quadraticCurveTo(-cardW / 2, -cardH / 2, -cardW / 2, -cardH / 2 + radius);

    const extrudeSettings = {
      depth: 0.18,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06,
    };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // 5. High-Resolution Dynamic Canvas Texture for Card Face (Crisp Text + Image)
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 512 * 2;
    textCanvas.height = 768 * 2;
    const ctx = textCanvas.getContext('2d')!;

    // Background Gradient for front of card
    const grad = ctx.createLinearGradient(0, 0, textCanvas.width, textCanvas.height);
    grad.addColorStop(0, '#100a30');
    grad.addColorStop(0.5, '#401050');
    grad.addColorStop(1, '#1b0a3c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

    // Decorative holographic background pattern
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
    ctx.lineWidth = 2;
    for (let i = 0; i < textCanvas.width; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 200, textCanvas.height);
      ctx.stroke();
    }

    // Border Frame
    ctx.strokeStyle = 'rgba(255, 102, 196, 0.4)';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, textCanvas.width - 40, textCanvas.height - 40);

    // Draw Static Text Layout
    ctx.fillStyle = 'rgba(255, 102, 196, 0.8)';
    ctx.font = 'bold 28px monospace';
    ctx.fillText('HC-2026', 45, 75);
    ctx.textAlign = 'right';
    ctx.fillText('★ ULTRA RARE HOLO', textCanvas.width - 45, 75);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 88px 'Caveat', cursive";
    ctx.shadowColor = 'rgba(0, 243, 255, 0.8)';
    ctx.shadowBlur = 15;
    ctx.fillText('Hi, Janell!', textCanvas.width / 2, 850);

    ctx.fillStyle = 'rgba(0, 243, 255, 0.9)';
    ctx.font = "26px 'Comfortaa', sans-serif";
    ctx.shadowBlur = 0;
    ctx.fillText('✦ QUANTUM BIRTHDAY RECIPIENT ✦', textCanvas.width / 2, 920);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = "38px 'Patrick Hand', cursive";
    ctx.fillText('Wishing you a day filled with joy,', textCanvas.width / 2, 1010);
    ctx.fillText('sparkles, and infinite beauty!', textCanvas.width / 2, 1065);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = '22px monospace';
    ctx.fillText('SERIES: BIRTHDAY 2026  |  ART: ANTIGRAVITY', textCanvas.width / 2, 1460);

    const faceTexture = new THREE.CanvasTexture(textCanvas);

    // Load Profile Picture onto Canvas
    const profileImg = new Image();
    profileImg.crossOrigin = "anonymous";
    profileImg.src = '/resources/img/janell.png';
    profileImg.onload = () => {
      // Draw circular frame
      ctx.save();
      ctx.beginPath();
      ctx.arc(textCanvas.width / 2, 420, 200, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      
      // Draw image
      ctx.drawImage(profileImg, textCanvas.width / 2 - 200, 220, 400, 400);
      ctx.restore();

      // Outer gold circle glow
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(textCanvas.width / 2, 420, 205, 0, Math.PI * 2);
      ctx.stroke();

      faceTexture.needsUpdate = true;
      setLoading(false);
    };

    // 6. Materials
    // Bevel & sides glass material (highly refractive and iridescent)
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.95,
      ior: 1.52,
      thickness: 1.6,
      transparent: true,
      opacity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      iridescence: 1.0,
      iridescenceIOR: 1.35,
      iridescenceThicknessRange: [100, 400]
    });

    // Front card material (holographic/iridescent face mapping)
    const frontMaterial = new THREE.MeshPhysicalMaterial({
      map: faceTexture,
      roughness: 0.15,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      iridescence: 0.7,
      iridescenceIOR: 1.4,
      iridescenceThicknessRange: [200, 500],
      transmission: 0.2, // slightly transmissive
      transparent: true
    });

    // 7. Assemble Mesh (slot 0: face, slot 1: sides/bevel)
    cardMesh = new THREE.Mesh(geometry, [frontMaterial, glassMaterial]);
    scene.add(cardMesh);

    // 8. 3D Floating Bubbles (Refractive Glass Spheres)
    const bubbleGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 0.9,
      transparent: true,
      roughness: 0.02,
      ior: 1.1, // lower index of refraction for water bubble
      thickness: 0.1
    });

    for (let i = 0; i < 20; i++) {
      const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
      // Random coordinates inside scene bounds
      bubble.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 12 - 4,
        (Math.random() - 0.5) * 4 + 1
      );
      // Random speed/scale metadata
      bubble.userData = {
        speed: Math.random() * 0.015 + 0.005,
        swaySpeed: Math.random() * 0.02 + 0.005,
        swayWidth: Math.random() * 0.3 + 0.1,
        seed: Math.random() * 100
      };
      
      const scale = Math.random() * 0.8 + 0.4;
      bubble.scale.set(scale, scale, scale);

      scene.add(bubble);
      bubbles.push(bubble);
    }

    // 9. Attach mouse moves
    const handlePointerMove = (e: PointerEvent) => {
      // Rotate card slightly when cursor is moved over desktop
      if (!motionActive() && cardMesh) {
        const rect = canvasContainerRef!.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotateY = x * 0.38;
        targetRotateX = y * 0.38;
      }

      // Move pointLight for sweeping specular reflections
      if (pointLight) {
        const rect = canvasContainerRef!.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 10 - 5;
        const y = -(((e.clientY - rect.top) / rect.height) * 12 - 6);
        pointLight.position.set(x, y, 4.5);
      }
    };

    const handlePointerLeave = () => {
      if (!motionActive()) {
        targetRotateX = 0;
        targetRotateY = 0;
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    canvasContainerRef.addEventListener('pointerleave', handlePointerLeave);
    
    // Automatically register gyroscopes on mobile
    window.addEventListener('deviceorientation', handleOrientation);

    // 10. Animation Tick Loop
    const tick = () => {
      // Lerping rotation for smooth spring-like feel
      currentRotateX += (targetRotateX - currentRotateX) * 0.08;
      currentRotateY += (targetRotateY - currentRotateY) * 0.08;

      if (cardMesh) {
        cardMesh.rotation.x = currentRotateX;
        cardMesh.rotation.y = currentRotateY;
        
        // Add a gentle default float/spin
        if (!motionActive()) {
          const t = Date.now() * 0.0006;
          cardMesh.position.y = Math.sin(t) * 0.15;
          // Slowly rotate Y by default
          cardMesh.rotation.y = currentRotateY + Math.sin(t * 0.5) * 0.1;
        } else {
          cardMesh.position.y = 0;
        }
      }

      // Drifting floating 3D Bubbles
      bubbles.forEach(b => {
        b.position.y += b.userData.speed;
        // Horizontal sway
        b.position.x += Math.sin(Date.now() * b.userData.swaySpeed + b.userData.seed) * 0.003;
        
        // Recycle bubble when it floats off scene top
        if (b.position.y > 6) {
          b.position.y = -6;
          b.position.x = (Math.random() - 0.5) * 8;
        }
      });

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }

      requestRef = requestAnimationFrame(tick);
    };

    tick();

    // 11. Handle container resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (renderer && camera) {
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        }
      }
    });
    resizeObserver.observe(canvasContainerRef);

    onCleanup(() => {
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('pointerdown', requestPermission);
      if (requestRef) cancelAnimationFrame(requestRef);
      if (renderer) renderer.dispose();
    });
  });

  return (
    <div 
      ref={canvasContainerRef}
      class="w-full h-[400px] md:h-[450px] relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        "backdrop-filter": "blur(12px)",
        "-webkit-backdrop-filter": "blur(12px)"
      }}
      onPointerDown={requestPermission}
    >
      {/* Loading overlay */}
      <Show when={loading()}>
        <div class="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0e1b] z-20 gap-3">
          <div class="w-10 h-10 border-4 border-t-aero-pink border-r-transparent border-b-aero-cyan border-l-transparent rounded-full animate-spin"></div>
          <span class="text-xs text-white/60 tracking-widest font-bold font-mono">LOADING 3D CARD...</span>
        </div>
      </Show>

      {/* Tilt Permission Guide for iOS devices */}
      <Show when={!motionActive() && !loading()}>
        <button 
          class="absolute bottom-4 z-10 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 text-[10px] uppercase font-bold tracking-wider active:scale-95 transition-all select-none"
          style={{ "font-family": "'Comfortaa', sans-serif" }}
          onClick={requestPermission}
        >
          📱 Enable Gyro Tilt
        </button>
      </Show>
    </div>
  );
}
