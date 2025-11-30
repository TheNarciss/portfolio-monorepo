import React, { useEffect, useRef } from "react";
import { default as ParallaxScene } from "../EyeTracking/web/ParallaxScene";
import { BuildingScene } from "../EyeTracking/web/Building";

const EyeTracking: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buildingRef = useRef<BuildingScene | null>(null);

  useEffect(() => {
    if (containerRef.current && !buildingRef.current) {
      buildingRef.current = new BuildingScene(containerRef.current);
    }
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
      }}
    >
      {/* 1. Container Three.js */}
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* 2. Overlay webcam + tracking */}
      <ParallaxScene
        onEyePosition={(eyePos: { left: { x: number; y: number }; right: { x: number; y: number } }) => {
          if (buildingRef.current) {
            buildingRef.current.updateFromEyePos(eyePos);
          }
        }}
      />
    </div>
  );
};

export default EyeTracking;