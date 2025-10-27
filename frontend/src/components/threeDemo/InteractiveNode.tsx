// src/components/threeDemo/InteractiveNode.tsx
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { Text3D, Center } from "@react-three/drei";

interface Props {
  id: string;
  position: [number, number, number];
  color: string;
  name: string;
  onHover: (hovered: boolean, nodeId: string) => void;
  text3D?: boolean;
}

const InteractiveNode: React.FC<Props> = ({
  id,
  position,
  color,
  name,
  onHover,
  text3D = false,
}) => {
  const mesh = useRef<Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  // Animation continue (rotation + scale dynamique)
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
      mesh.current.rotation.x += 0.005;
      const scale = hovered ? 1.3 : 1;
      mesh.current.scale.setScalar(scale);
    }
  });

  return (
    <group
      ref={mesh}
      position={position}
      onPointerOver={() => {
        setHovered(true);
        onHover(true, id);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(false, id);
      }}
    >
      {text3D ? (
        <Center>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.4}
            height={0.05}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.01}
            bevelSize={0.008}
            bevelOffset={0}
            bevelSegments={3}
          >
            {name}
            <meshStandardMaterial
              color={hovered ? "#ffffff" : color}
              emissive={hovered ? color : "#000000"}
              emissiveIntensity={hovered ? 0.8 : 0}
            />
          </Text3D>
        </Center>
      ) : (
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color={hovered ? "#ffffff" : color} />
        </mesh>
      )}
    </group>
  );
};

export default InteractiveNode;
