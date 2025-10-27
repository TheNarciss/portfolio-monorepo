// src/components/threeDemo/ThreeGraphScene.tsx
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Line } from "@react-three/drei";
import { useState, useMemo, useRef } from "react";

import { nodes as datasetNodes, links as datasetLinks, type Node } from "./Dataset";

// Couleurs par catégorie simplifiées
const categoryColors: Record<string, string> = {
  Skill: "#22ff22",
  Education: "#00ff88",
  Work: "#00ccff",
  Project: "#ffdd00",
};

function getNodeColor(node: Node) {
  return categoryColors[node.category || "Skill"] || "#ffffff";
}

function FacingText({ children, ...props }: any) {
  const textRef = useRef<any>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return <Text ref={textRef} {...props}>{children}</Text>;
}

export default function ThreeGraphScene() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const positionedNodes = useMemo(() => {
    return datasetNodes.map((node) => ({
      ...node,
      position: node.position || [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
      ],
    }));
  }, []);

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Stars radius={100} depth={50} count={1000} factor={4} fade />

        {positionedNodes.map((node) => (
          <FacingText
            key={node.id}
            position={node.position}
            fontSize={0.15}
            font="/fonts/Orbitron-Black.ttf"
            color={getNodeColor(node)}
            outlineWidth={0.02}
            onPointerOver={() => setActiveNode(node.id)}
            onPointerOut={() => setActiveNode(null)}
            anchorX="center"
            anchorY="middle"
          >
            {node.name}
          </FacingText>
        ))}

        {datasetLinks.map((link, i) => {
          const source = positionedNodes.find((n) => n.id === link.source);
          const target = positionedNodes.find((n) => n.id === link.target);
          if (!source || !target) return null;

          const isActive = activeNode === link.source || activeNode === link.target;

          return (
            <Line
              key={i}
              points={[source.position, target.position]}
              color={isActive ? "#00ff44" : "rgba(0,0,0,0)"}
              lineWidth={isActive ? 2 : 0}
              transparent
              opacity={isActive ? 1 : 0}
            />
          );
        })}

        <OrbitControls enablePan enableZoom enableRotate />
        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.3} height={300} intensity={0.25} />
        </EffectComposer>
      </Canvas>

      {/* Légende responsive en tenant compte de la navbar */}
      <div className="absolute top-20 left-4 bg-black/20 p-3 rounded-lg font-code text-sm z-10">
        <h4 className="text-green-400 mb-1">Légende</h4>
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="flex items-center mb-1">
            <div
              className="w-4 h-4 rounded-sm border border-green-400 mr-2"
              style={{ backgroundColor: color }}
            />
            <span>{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
