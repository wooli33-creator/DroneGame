import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useDrone } from "@/lib/stores/useDrone";
import { useGame } from "@/lib/stores/useGame";
import * as THREE from "three";

interface BalloonProps {
  position: [number, number, number];
  radius?: number;
  color?: string;
  bobSpeed?: number;
  bobRange?: number;
}

export function Balloon({
  position,
  radius = 0.8,
  color = "#ec4899",
  bobSpeed = 0.5,
  bobRange = 0.5
}: BalloonProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const { position: dronePos } = useDrone();
  const { takeDamage, mode } = useGame();
  const lastHitTime = useRef(0);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * bobSpeed + timeOffset;
      const bobOffset = Math.sin(time) * bobRange;
      
      meshRef.current.position.copy(startPos);
      meshRef.current.position.y += bobOffset;

      if (mode === "mission") {
        const balloonPos = meshRef.current.position;
        const distance = dronePos.distanceTo(balloonPos);

        if (distance < radius + 0.6) {
          const now = state.clock.elapsedTime;
          if (now - lastHitTime.current > 2) {
            takeDamage(5);
            lastHitTime.current = now;
          }
        }
      }
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={position} castShadow>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.2} 
          roughness={0.8}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[position[0], position[1] - radius - 0.3, position[2]]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
