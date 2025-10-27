import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a0a, 1); // fond noir profond
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // ✨ Points “étoiles” ronds
    const particlesCount = 150;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 12;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Créer une texture circulaire pour les particules
    const circle = document.createElement("canvas");
    circle.width = 64;
    circle.height = 64;
    const ctx = circle.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.arc(32, 32, 32, 0, Math.PI * 2);
      ctx.fillStyle = "#00ff99"; // vert pastel
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(circle);

    const material = new THREE.PointsMaterial({
      color: 0x00ff99,
      size: 0.08,
      map: texture,
      alphaTest: 0.5,
      transparent: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // 🖱️ Interaction souris
    const mouse = new THREE.Vector2(0, 0);
    window.addEventListener("mousemove", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // 🎞️ Animation
    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.y += 0.0015;
      points.rotation.x += 0.001;

      camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 1 - camera.position.y) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    // 📏 Resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute top-0 left-0 w-screen h-screen z-0"
    />
  );
};

export default ThreeBackground;
