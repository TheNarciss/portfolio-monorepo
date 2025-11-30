import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera as MPCamera } from "@mediapipe/camera_utils";

type EyePosition = {
  left: { x: number; y: number };
  right: { x: number; y: number };
};

type ParallaxSceneProps = {
  onEyePosition?: (eyePos: EyePosition) => void;
};

const ParallaxScene: React.FC<ParallaxSceneProps> = ({ onEyePosition }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const meshCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const eyeOffsetRef = useRef({ x: 0, y: 0 });
  const smoothOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onResults = (results: any) => {
      const canvas = meshCanvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(-1, 1); // miroir
      ctx.drawImage(
        results.image,
        -canvas.width,
        0,
        canvas.width,
        canvas.height
      );
      ctx.restore();

      type Landmark = { x: number; y: number; z: number };
      if (results.multiFaceLandmarks?.[0]) {
        const lm = results.multiFaceLandmarks[0].map((p: Landmark) => ({
          x: 1 - p.x,
          y: p.y,
          z: p.z,
        }));

        const leftEye = lm[33];
        const rightEye = lm[263];

        const eyePos: EyePosition = {
          left: { x: leftEye.x * canvas.width, y: leftEye.y * canvas.height },
          right: {
            x: rightEye.x * canvas.width,
            y: rightEye.y * canvas.height,
          },
        };

        eyeOffsetRef.current = {
          x: (leftEye.x + rightEye.x) / 2 - 0.5,
          y: (leftEye.y + rightEye.y) / 2 - 0.5,
        };

        if (onEyePosition) onEyePosition(eyePos);

        for (const p of lm) {
          ctx.beginPath();
          ctx.arc(p.x * canvas.width, p.y * canvas.height, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "#00FF00";
          ctx.fill();
        }
      }
    };

    if (videoRef.current && meshCanvasRef.current) {
      const faceMesh = new FaceMesh({
        locateFile: (file: string) =>
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
        onFrame: async () => await faceMesh.send({ image: videoRef.current! }),
        width: 480,
        height: 360,
      });

      mpCamera.start();
    }

    return () => {};
  }, [onEyePosition]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          position: "fixed",
          top: 10,
          left: 10,
          width: 480,
          height: 360,
          border: "2px solid white",
          borderRadius: 8,
          zIndex: 10,
        }}
      />
      <canvas
        ref={meshCanvasRef}
        width={480}
        height={360}
        style={{
          position: "fixed",
          top: 10,
          left: 10,
          width: 480,
          height: 360,
          borderRadius: 8,
          pointerEvents: "none",
          zIndex: 11,
        }}
      />
    </>
  );
};

export default ParallaxScene;
