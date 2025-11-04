import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useDrone } from "@/lib/stores/useDrone";
import { useGame } from "@/lib/stores/useGame";
import * as THREE from "three";

interface MovingPlatformProps {
  position: [number, number, number];
  size?: [number, number, number];
  moveRange?: number;
  speed?: number;
  axis?: "x" | "y" | "z";
}

export function MovingPlatform({
  position,
  size = [3, 0.5, 3],
  moveRange = 3,
  speed = 1,
  axis = "y"
}: MovingPlatformProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const { position: dronePos } = useDrone();
  const { takeDamage, mode } = useGame();
  const lastHitTime = useRef(0);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * speed + timeOffset;
      const offset = Math.sin(time) * moveRange;
      
      meshRef.current.position.copy(startPos);
      meshRef.current.position[axis] += offset;

      if (mode === "mission") {
        const platformPos = meshRef.current.position;
        const dx = Math.abs(dronePos.x - platformPos.x);
        const dy = Math.abs(dronePos.y - platformPos.y);
        const dz = Math.abs(dronePos.z - platformPos.z);

        const droneSize = 0.8;
        const collisionX = dx < (size[0] / 2 + droneSize / 2);
        const collisionY = dy < (size[1] / 2 + droneSize / 2);
        const collisionZ = dz < (size[2] / 2 + droneSize / 2);

        if (collisionX && collisionY && collisionZ) {
          const now = state.clock.elapsedTime;
          if (now - lastHitTime.current > 2) {
            takeDamage(10);
            lastHitTime.current = now;
          }
        }
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#8b5cf6" metalness={0.3} roughness={0.7} />
    </mesh>
  );
}
