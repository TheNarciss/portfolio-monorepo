import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera as MPCamera } from "@mediapipe/camera_utils";

const ParallaxScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const meshCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);

  const parallaxOnRef = useRef(false);
  const eyeOffsetRef = useRef({ x: 0, y: 0 });
  const smoothOffsetRef = useRef({ x: 0, y: 0 });

  const [parallaxOn, setParallaxOn] = useState(false);

  useEffect(() => {
    parallaxOnRef.current = parallaxOn;
  }, [parallaxOn]);

  const resetModel = () => {
    if (modelRef.current) {
      modelRef.current.position.set(0, -1.2, 0);
      modelRef.current.scale.set(1.4, 1.4, 1.4);
      modelRef.current.rotation.set(0, 0, 0);
    }

    if (cameraRef.current) {
      cameraRef.current.position.set(8, 8, 8);
      cameraRef.current.lookAt(0, 0, 0);
    }

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // -------------------------
    // SCENE + CAMERA
    // -------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(8, 8, 8); // FIX : caméra plus loin → on voit le modèle
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // -------------------------
    // RENDERER
    // -------------------------
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // -------------------------
    // LIGHTS (CORRECTION)
    // -------------------------
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));

    const dir = new THREE.DirectionalLight(0xffffff, 2);
    dir.position.set(5, 10, 7);
    scene.add(dir); // FIX : AVANT tu ne l’ajoutais pas !

    const hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.2);
    scene.add(hemi);

    // -------------------------
    // LOAD GLB
    // -------------------------
    const loader = new GLTFLoader();
    loader.load(
      "/models/Vancouver but Small 3D Model.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(5, 5, 5);
        model.position.set(0, 0, 0);

        scene.add(model);
        modelRef.current = model;

        console.log("✔️ MODEL LOADED", model);
      },
      undefined,
      (err) => console.error("❌ ERR LOADING MODEL", err)
    );

    // -------------------------
    // ORBIT CONTROLS
    // -------------------------
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    sceneRef.current = scene;

    // -------------------------
    // ANIMATION
    // -------------------------
    const animate = () => {
      requestAnimationFrame(animate);

      smoothOffsetRef.current.x +=
        (eyeOffsetRef.current.x - smoothOffsetRef.current.x) * 0.05;
      smoothOffsetRef.current.y +=
        (eyeOffsetRef.current.y - smoothOffsetRef.current.y) * 0.05;

      if (cameraRef.current && parallaxOnRef.current) {
        const positionFactor = 1.5;
        const rotationFactor = 0.2;

        cameraRef.current.position.x =
          8 + smoothOffsetRef.current.x * positionFactor;
        cameraRef.current.position.y =
          8 - smoothOffsetRef.current.y * positionFactor;

        const baseTarget = new THREE.Vector3(0, -1.2, 0);
        const target = baseTarget.clone();
        target.x += smoothOffsetRef.current.x * rotationFactor;
        target.y += smoothOffsetRef.current.y * rotationFactor;

        cameraRef.current.lookAt(target);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // -------------------------
    // RESIZE
    // -------------------------
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // -------------------------
    // MEDIAPIPE
    // -------------------------
    const onResults = (results: any) => {
      const ctx = meshCanvasRef.current!.getContext("2d")!;
      ctx.clearRect(
        0,
        0,
        meshCanvasRef.current!.width,
        meshCanvasRef.current!.height
      );
      ctx.drawImage(
        results.image,
        0,
        0,
        meshCanvasRef.current!.width,
        meshCanvasRef.current!.height
      );

      if (results.multiFaceLandmarks?.[0]) {
        const lm = results.multiFaceLandmarks[0];
        const leftEye = lm[33];
        const rightEye = lm[263];

        eyeOffsetRef.current = {
          x: (leftEye.x + rightEye.x) / 2 - 0.5,
          y: (leftEye.y + rightEye.y) / 2 - 0.5,
        };

        for (const p of lm) {
          ctx.beginPath();
          ctx.arc(
            p.x * ctx.canvas.width,
            p.y * ctx.canvas.height,
            1.5,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = "#00FF00";
          ctx.fill();
        }
      }
    };

    if (videoRef.current && meshCanvasRef.current) {
      const faceMesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults(onResults);

      const mpCamera = new MPCamera(videoRef.current, {
        onFrame: async () =>
          await faceMesh.send({ image: videoRef.current! }),
        width: 480,
        height: 360,
      });

      mpCamera.start();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />

      {/* VIDEO + MESH */}
      <div
        style={{
          position: "fixed",
          top: 10,
          left: 10,
          width: 480,
          height: 360,
          border: "2px solid white",
          borderRadius: 8,
          overflow: "hidden",
          zIndex: 10,
        }}
      >
        <video ref={videoRef} style={{ display: "none" }} autoPlay playsInline />
        <canvas ref={meshCanvasRef} width={480} height={360} />
      </div>

      <button
        onClick={() => setParallaxOn(!parallaxOn)}
        style={{
          position: "fixed",
          top: 380,
          left: 10,
          padding: "8px 12px",
          borderRadius: 6,
          border: "none",
          zIndex: 20,
          backgroundColor: parallaxOn ? "green" : "#444",
          color: "white",
          cursor: "pointer",
        }}
      >
        {parallaxOn ? "Parallax ON" : "Parallax OFF"}
      </button>

      <button
        onClick={resetModel}
        style={{
          position: "fixed",
          top: 430,
          left: 10,
          padding: "8px 12px",
          borderRadius: 6,
          border: "none",
          zIndex: 20,
          backgroundColor: "#0077ff",
          color: "white",
          cursor: "pointer",
        }}
      >
        Reset Model
      </button>
    </>
  );
};

export default ParallaxScene;
