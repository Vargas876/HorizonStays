import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function ThreeIntroOverlay({ onComplete, language = "es", duration = 3200 }) {
  const mountRef = useRef(null);
  const animationFrameRef = useRef(null);
  const completeTimeoutRef = useRef(null);
  const doneRef = useRef(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) {
      return undefined;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050608, 6, 28);

    const camera = new THREE.PerspectiveCamera(60, mountNode.clientWidth / mountNode.clientHeight, 0.1, 1000);
    camera.position.set(0, 0.5, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    renderer.setClearColor(0x050608, 1);
    mountNode.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xffd08a, 3.2, 60, 1.4);
    keyLight.position.set(0, 3, 5);
    scene.add(keyLight);

    const cyanLight = new THREE.PointLight(0x53d4ff, 1.5, 50, 1.2);
    cyanLight.position.set(-4, -1, 3);
    scene.add(cyanLight);

    const tunnelGroup = new THREE.Group();
    scene.add(tunnelGroup);

    const particlesCount = 2600;
    const particlePositions = new Float32Array(particlesCount * 3);
    const particleColors = new Float32Array(particlesCount * 3);
    const colorWarm = new THREE.Color("#f5a623");
    const colorCold = new THREE.Color("#5ad0ff");

    for (let i = 0; i < particlesCount; i += 1) {
      const progress = i / particlesCount;
      const angle = progress * Math.PI * 22;
      const radius = 1.8 + (Math.sin(progress * 32) * 0.45) + (Math.random() * 0.26);
      const y = (progress - 0.5) * 20;

      particlePositions[(i * 3)] = Math.cos(angle) * radius;
      particlePositions[(i * 3) + 1] = y;
      particlePositions[(i * 3) + 2] = Math.sin(angle) * radius;

      const mixed = colorWarm.clone().lerp(colorCold, progress);
      particleColors[(i * 3)] = mixed.r;
      particleColors[(i * 3) + 1] = mixed.g;
      particleColors[(i * 3) + 2] = mixed.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      transparent: true,
      opacity: 0.9,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    tunnelGroup.add(particles);

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8c27a,
      emissive: 0xbb6f15,
      emissiveIntensity: 1.25,
      metalness: 0.55,
      roughness: 0.28
    });

    const ring = new THREE.Mesh(new THREE.TorusKnotGeometry(1.6, 0.22, 130, 22), ringMaterial);
    ring.position.set(0, 0.15, -1.8);
    tunnelGroup.add(ring);

    const portal = new THREE.Mesh(
      new THREE.RingGeometry(2.4, 3.1, 80),
      new THREE.MeshBasicMaterial({ color: 0x6fd6ff, transparent: true, opacity: 0.24, side: THREE.DoubleSide })
    );
    portal.rotation.x = Math.PI / 2;
    portal.position.set(0, -1.8, 0.2);
    tunnelGroup.add(portal);

    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      tunnelGroup.rotation.y = elapsed * 0.12;
      particles.rotation.y = -elapsed * 0.08;
      ring.rotation.x = elapsed * 0.55;
      ring.rotation.y = elapsed * 0.35;
      portal.material.opacity = 0.2 + (Math.sin(elapsed * 1.7) * 0.06);

      camera.position.z = 9 - Math.min(elapsed * 1.4, 4.3);
      camera.position.y = 0.5 + (Math.sin(elapsed * 0.8) * 0.2);
      camera.lookAt(0, 0, -1.4);

      renderer.render(scene, camera);
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mountNode) {
        return;
      }

      camera.aspect = mountNode.clientWidth / mountNode.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      particleGeometry.dispose();
      particleMaterial.dispose();
      ring.geometry.dispose();
      ringMaterial.dispose();
      portal.geometry.dispose();
      portal.material.dispose();
      renderer.dispose();

      if (mountNode.contains(renderer.domElement)) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const finishIntro = () => {
      if (doneRef.current) {
        return;
      }

      doneRef.current = true;
      setIsLeaving(true);
      window.setTimeout(() => {
        onComplete?.();
      }, 650);
    };

    completeTimeoutRef.current = window.setTimeout(finishIntro, duration);

    return () => {
      if (completeTimeoutRef.current) {
        window.clearTimeout(completeTimeoutRef.current);
      }
    };
  }, [duration, onComplete]);

  const handleSkip = () => {
    if (completeTimeoutRef.current) {
      window.clearTimeout(completeTimeoutRef.current);
    }

    if (doneRef.current) {
      return;
    }

    doneRef.current = true;
    setIsLeaving(true);
    window.setTimeout(() => {
      onComplete?.();
    }, 350);
  };

  return (
    <div className={`threeIntroOverlay ${isLeaving ? "leaving" : ""}`} role="dialog" aria-label="Intro animation">
      <div className="threeIntroCanvas" ref={mountRef} aria-hidden="true" />
      <div className="threeIntroUi">
        <p className="threeIntroBadge">Immersive Arrival</p>
        <h1>La Villa</h1>
        <p>{language === "es" ? "Respira profundo, tu estancia comienza aqui." : "Take a breath, your stay begins here."}</p>
        <button type="button" onClick={handleSkip} className="threeIntroSkipBtn">
          {language === "es" ? "Saltar intro" : "Skip intro"}
        </button>
      </div>
    </div>
  );
}

export default ThreeIntroOverlay;
