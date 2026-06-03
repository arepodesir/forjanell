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

  // Animation values (card starts flat facing the screen)
  let targetRotateX = 0;
  let targetRotateY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;
  
  // Point light for moving reflections
  let pointLight: THREE.PointLight | undefined;
  let holoTexture: THREE.CanvasTexture | undefined;

  // Handle device orientation for mobile tilt
  const handleOrientation = (e: DeviceOrientationEvent) => {
    if (e.beta === null || e.gamma === null) return;
    
    // Map phone rotation values to card tilt
    const pitch = (e.beta - 50) * (Math.PI / 180) * 0.45; // assume phone is tilted at ~50 deg
    const roll = e.gamma * (Math.PI / 180) * 0.45;
    
    targetRotateX = Math.max(-0.45, Math.min(0.45, pitch));
    targetRotateY = Math.max(-0.45, Math.min(0.45, roll));
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
    scene.fog = new THREE.FogExp2(0x0a0c1b, 0.04);

    // Bring camera slightly closer for a larger, highly readable card
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 11.2;

    // 2. Setup Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    canvasContainerRef.appendChild(renderer.domElement);

    // 3. Setup Lights (high specular highlights for holo sheen)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f3ff, 1.8);
    dirLight1.position.set(5, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xff66c4, 1.5);
    dirLight2.position.set(-5, -5, 4);
    scene.add(dirLight2);

    pointLight = new THREE.PointLight(0xffffff, 3.5, 25);
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

    // 5. Canvas Textures
    // Create Holographic Foil overlay canvas texture (simulating Pokemon shine card)
    const holoCanvas = document.createElement('canvas');
    holoCanvas.width = 512;
    holoCanvas.height = 512;
    const hCtx = holoCanvas.getContext('2d')!;
    const hGrad = hCtx.createLinearGradient(0, 0, 512, 512);
    hGrad.addColorStop(0.0, 'rgba(255, 0, 0, 0.25)');
    hGrad.addColorStop(0.2, 'rgba(255, 0, 255, 0.25)');
    hGrad.addColorStop(0.4, 'rgba(0, 0, 255, 0.25)');
    hGrad.addColorStop(0.6, 'rgba(0, 255, 255, 0.25)');
    hGrad.addColorStop(0.8, 'rgba(0, 255, 0, 0.25)');
    hGrad.addColorStop(1.0, 'rgba(255, 255, 0, 0.25)');
    hCtx.fillStyle = hGrad;
    hCtx.fillRect(0, 0, 512, 512);
    
    holoTexture = new THREE.CanvasTexture(holoCanvas);
    holoTexture.wrapS = THREE.RepeatWrapping;
    holoTexture.wrapT = THREE.RepeatWrapping;

    // Card Face Canvas Texture (Original contents, high legibility)
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 512 * 2;
    textCanvas.height = 768 * 2;
    const ctx = textCanvas.getContext('2d')!;

    // Profile picture and Birthday cap images
    const profileImg = new Image();
    profileImg.src = '/resources/img/janell.png'; // No crossOrigin (same origin)

    const capImg = new Image();
    capImg.src = '/resources/img/bday-cap.png';

    // Main Draw Function for Texture
    const drawCardTexture = () => {
      // Background Gradient for front of card
      const grad = ctx.createLinearGradient(0, 0, textCanvas.width, textCanvas.height);
      grad.addColorStop(0, '#0a0927');
      grad.addColorStop(0.4, '#240b36');
      grad.addColorStop(1, '#0e082c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

      // Shimmer background lines
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.16)';
      ctx.lineWidth = 4;
      for (let i = -textCanvas.height; i < textCanvas.width; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + textCanvas.height, textCanvas.height);
        ctx.stroke();
      }

      // Elegant inner border frame
      ctx.strokeStyle = 'rgba(255, 102, 196, 0.6)';
      ctx.lineWidth = 14;
      ctx.strokeRect(30, 30, textCanvas.width - 60, textCanvas.height - 60);

      // Original metadata headers
      ctx.fillStyle = '#ff66c4';
      ctx.font = 'bold 32px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('HC-001', 60, 95);
      
      ctx.fillStyle = '#00f3ff';
      ctx.textAlign = 'right';
      ctx.fillText('✦ ULTRA RARE HOLO', textCanvas.width - 60, 95);

      // Draw Profile Picture Circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(textCanvas.width / 2, 450, 220, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      
      // Draw image or solid placeholder if loading
      if (profileImg.complete) {
        ctx.drawImage(profileImg, textCanvas.width / 2 - 220, 230, 440, 440);
      } else {
        ctx.fillStyle = '#1c1543';
        ctx.fillRect(textCanvas.width / 2 - 220, 230, 440, 440);
      }
      ctx.restore();

      // Shiny Gold Arc outline
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 12;
      ctx.shadowColor = 'rgba(255,215,0,0.5)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(textCanvas.width / 2, 450, 223, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Birthday Cap (rotated 12deg on top right of circular frame)
      if (capImg.complete) {
        ctx.save();
        ctx.translate(textCanvas.width / 2 + 150, 260);
        ctx.rotate(12 * Math.PI / 180);
        ctx.drawImage(capImg, -70, -70, 140, 140);
        ctx.restore();
      }

      // Draw 5 Birthday Candles underneath circle frame
      const startCandleX = textCanvas.width / 2 - 110;
      for (let i = 0; i < 5; i++) {
        const cx = startCandleX + i * 55;
        const cy = 680;
        // Candle body
        ctx.fillStyle = i % 2 === 0 ? '#ff66c4' : '#00f3ff';
        ctx.fillRect(cx - 7, cy, 14, 55);
        // Wick
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 2, cy - 12, 4, 12);
        // Candle Flame
        ctx.fillStyle = '#ff9f43';
        ctx.beginPath();
        ctx.arc(cx, cy - 18, 10, 0, Math.PI * 2);
        ctx.fill();
        // Inner wick glow
        ctx.fillStyle = '#ffff80';
        ctx.beginPath();
        ctx.arc(cx, cy - 18, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Title & Text Content (Highly legible font measurements)
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      
      // Happy Belated Birthday header
      ctx.font = "bold 96px 'Caveat', cursive";
      ctx.shadowColor = 'rgba(255, 102, 196, 0.9)';
      ctx.shadowBlur = 20;
      ctx.fillText('Happy Belated Birthday!', textCanvas.width / 2, 930);

      // Name text
      ctx.fillStyle = '#00f3ff';
      ctx.font = "bold 84px 'Caveat', cursive";
      ctx.shadowColor = 'rgba(0, 243, 255, 0.9)';
      ctx.shadowBlur = 15;
      ctx.fillText('For Janell', textCanvas.width / 2, 1030);

      // Nickname info
      ctx.fillStyle = 'rgba(255, 102, 196, 0.85)';
      ctx.font = "italic 44px 'Patrick Hand', cursive";
      ctx.shadowBlur = 0;
      ctx.fillText('aka "Janell"', textCanvas.width / 2, 1090);

      // Main Message Body
      ctx.fillStyle = '#e5e7eb';
      ctx.font = "46px 'Patrick Hand', cursive";
      ctx.fillText('Wishing you a day filled with joy,', textCanvas.width / 2, 1180);
      ctx.fillText('sparkles, and infinite beauty! ✨🎂', textCanvas.width / 2, 1245);

      // Footer metadata
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.font = '24px monospace';
      ctx.fillText('Hadacard™ Crystalline Series  |  Quantum Extract · First Edition', textCanvas.width / 2, 1440);
      ctx.fillText('Art: The Universe  |  © 2026 Hadacard', textCanvas.width / 2, 1485);
    };

    // Redraw whenever images load
    profileImg.onload = () => {
      drawCardTexture();
      faceTexture.needsUpdate = true;
      setLoading(false);
    };

    capImg.onload = () => {
      drawCardTexture();
      faceTexture.needsUpdate = true;
    };

    // Redraw once fonts are loaded to guarantee beautiful handwriting styles render
    document.fonts.ready.then(() => {
      drawCardTexture();
      faceTexture.needsUpdate = true;
    });

    // Initial draw call
    drawCardTexture();
    const faceTexture = new THREE.CanvasTexture(textCanvas);

    // 6. Materials
    // Glass back and beveled border material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.96,
      ior: 1.54,
      thickness: 1.8,
      transparent: true,
      opacity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      iridescence: 1.0,
      iridescenceIOR: 1.6,
      iridescenceThicknessRange: [100, 800]
    });

    // Front material mapping the canvas texture + shifting foil overlay
    const frontMaterial = new THREE.MeshPhysicalMaterial({
      map: faceTexture,
      roughness: 0.14,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      iridescence: 0.8,
      iridescenceIOR: 1.5,
      iridescenceThicknessRange: [200, 700],
      transmission: 0.2, // slightly transmissive glass front
      transparent: true,
      // project the rainbow texture on top to make it sparkle like a pokecard
      emissiveMap: holoTexture,
      emissive: new THREE.Color(0x333333),
      emissiveIntensity: 1.0
    });

    // 7. Assemble Mesh (slot 0: face, slot 1: sides/bevel)
    cardMesh = new THREE.Mesh(geometry, [frontMaterial, glassMaterial]);
    scene.add(cardMesh);

    // 8. 3D Drifting Bubbles
    const bubbleGeo = new THREE.SphereGeometry(0.38, 32, 32);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 0.92,
      transparent: true,
      roughness: 0.01,
      ior: 1.15,
      thickness: 0.12
    });

    for (let i = 0; i < 18; i++) {
      const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
      bubble.position.set(
        (Math.random() - 0.5) * 8.5,
        (Math.random() - 0.5) * 12 - 4,
        (Math.random() - 0.5) * 4.5 + 1
      );
      bubble.userData = {
        speed: Math.random() * 0.012 + 0.006,
        swaySpeed: Math.random() * 0.018 + 0.006,
        seed: Math.random() * 100
      };
      
      const scale = Math.random() * 0.7 + 0.45;
      bubble.scale.set(scale, scale, scale);

      scene.add(bubble);
      bubbles.push(bubble);
    }

    // 9. Pointer Coordinate tracking (moving lights and holo projection)
    const handlePointerMove = (e: PointerEvent) => {
      if (!canvasContainerRef) return;
      
      const rect = canvasContainerRef.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      
      // Tilt card slightly on hover (desktop)
      if (!motionActive() && cardMesh) {
        targetRotateY = x * 0.35;
        targetRotateX = y * 0.35;
      }

      // Sweep lighting coordinate
      if (pointLight) {
        pointLight.position.set(x * 6, y * 7, 4.5);
      }
    };

    const handlePointerLeave = () => {
      // Revert flat to screen when mouse leaves
      if (!motionActive()) {
        targetRotateX = 0;
        targetRotateY = 0;
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    canvasContainerRef.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('deviceorientation', handleOrientation);

    // 10. Animation Loop
    const tick = () => {
      // Smooth lerp towards targets (starts at 0, 0 so it's perfectly flat initially)
      currentRotateX += (targetRotateX - currentRotateX) * 0.08;
      currentRotateY += (targetRotateY - currentRotateY) * 0.08;

      if (cardMesh) {
        cardMesh.rotation.x = currentRotateX;
        cardMesh.rotation.y = currentRotateY;

        // Shift holographic foil emissive texture offsets in reaction to tilt angles (Pokecard effect)
        if (holoTexture) {
          holoTexture.offset.x = currentRotateY * 0.4;
          holoTexture.offset.y = currentRotateX * 0.4;
        }

        // Float up and down gently (without tilting)
        const t = Date.now() * 0.0006;
        cardMesh.position.y = Math.sin(t) * 0.12;
      }

      // Drift 3D bubbles upward
      bubbles.forEach(b => {
        b.position.y += b.userData.speed;
        b.position.x += Math.sin(Date.now() * b.userData.swaySpeed + b.userData.seed) * 0.0025;
        
        if (b.position.y > 6.5) {
          b.position.y = -6.5;
          b.position.x = (Math.random() - 0.5) * 8.5;
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

    // If profile picture loaded earlier but mount happened later
    if (profileImg.complete) {
      setLoading(false);
    }

    onCleanup(() => {
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('deviceorientation', handleOrientation);
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
      {/* Loading indicator */}
      <Show when={loading()}>
        <div class="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0927] z-20 gap-3">
          <div class="w-10 h-10 border-4 border-t-aero-pink border-r-transparent border-b-aero-cyan border-l-transparent rounded-full animate-spin"></div>
          <span class="text-xs text-white/60 tracking-widest font-bold font-mono">LOADING 3D CARD...</span>
        </div>
      </Show>

      {/* Touch Guide for Gyroscope */}
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
