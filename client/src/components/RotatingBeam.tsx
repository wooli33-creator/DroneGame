import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useDrone } from "@/lib/stores/useDrone";
import { useGame } from "@/lib/stores/useGame";
import * as THREE from "three";

interface RotatingBeamProps {
  position: [number, number, number];
  length?: number;
  thickness?: number;
  speed?: number;
  axis?: "x" | "y" | "z";
}

export function RotatingBeam({
  position,
  length = 8,
  thickness = 0.3,
  speed = 0.5,
  axis = "y"
}: RotatingBeamProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const { position: dronePos } = useDrone();
  const { takeDamage, mode } = useGame();
  const lastHitTime = useRef(0);

  useFrame((state) => {
    if (groupRef.current && meshRef.current) {
      const time = state.clock.elapsedTime * speed + timeOffset;
      
      if (axis === "y") {
        groupRef.current.rotation.y = time;
      } else if (axis === "x") {
        groupRef.current.rotation.x = time;
      } else {
        groupRef.current.rotation.z = time;
      }

      if (mode === "mission") {
        meshRef.current.updateMatrixWorld(true);
        const worldMatrix = meshRef.current.matrixWorld;
        
        const start = new THREE.Vector3(-length / 2, 0, 0).applyMatrix4(worldMatrix);
        const end = new THREE.Vector3(length / 2, 0, 0).applyMatrix4(worldMatrix);
        
        const lineDir = new THREE.Vector3().subVectors(end, start);
        const lineLengthSq = lineDir.lengthSq();
        
        const droneToStart = new THREE.Vector3().subVectors(dronePos, start);
        const t = Math.max(0, Math.min(1, droneToStart.dot(lineDir) / lineLengthSq));
        
        const closestPoint = new THREE.Vector3().addVectors(
          start,
          lineDir.multiplyScalar(t)
        );
        
        const distance = dronePos.distanceTo(closestPoint);
        const collisionRadius = thickness / 2 + 0.6;

        if (distance < collisionRadius) {
          const now = state.clock.elapsedTime;
          if (now - lastHitTime.current > 2) {
            takeDamage(15);
            lastHitTime.current = now;
          }
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[length, thickness, thickness]} />
        <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[length / 2 - 0.5, 0, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial 
          color="#fbbf24" 
          emissive="#fbbf24" 
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[-length / 2 + 0.5, 0, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial 
          color="#fbbf24" 
          emissive="#fbbf24" 
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
