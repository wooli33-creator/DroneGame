import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useDrone } from "@/lib/stores/useDrone";
import { useGame } from "@/lib/stores/useGame";
import * as THREE from "three";

interface RingProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  radius?: number;
  id: number;
}

export function Ring({ position, rotation = [0, 0, 0], radius = 2, id }: RingProps) {
  const ringRef = useRef<THREE.Group>(null);
  const { position: dronePos } = useDrone();
  const { collectRing } = useGame();
  const collected = useRef(false);
  
  const ringPosition = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame(() => {
    if (ringRef.current && !collected.current) {
      ringRef.current.rotation.y += 0.01;

      const distance = dronePos.distanceTo(ringPosition);
      
      if (distance < radius * 0.6) {
        collected.current = true;
        collectRing();
        
        if (ringRef.current.parent) {
          ringRef.current.parent.remove(ringRef.current);
        }
      }
    }
  });

  return (
    <group ref={ringRef} position={position} rotation={rotation}>
      <mesh>
        <torusGeometry args={[radius, 0.2, 16, 32]} />
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      <mesh>
        <torusGeometry args={[radius * 0.95, 0.1, 16, 32]} />
        <meshStandardMaterial
          color="#ffff00"
          emissive="#ffff00"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>

      <pointLight
        position={[0, 0, 0]}
        color="#00ff00"
        intensity={2}
        distance={radius * 3}
      />
    </group>
  );
}
