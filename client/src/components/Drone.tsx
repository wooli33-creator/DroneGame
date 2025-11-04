import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useDrone } from "@/lib/stores/useDrone";
import * as THREE from "three";

export function Drone() {
  const droneRef = useRef<THREE.Group>(null);
  const { position, rotation, updatePhysics } = useDrone();

  useFrame((state, delta) => {
    updatePhysics(delta);

    if (droneRef.current) {
      droneRef.current.position.copy(position);
      droneRef.current.rotation.copy(rotation);
    }
  });

  return (
    <group ref={droneRef}>
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.2, 0.8]} />
        <meshStandardMaterial color="#2563eb" metalness={0.6} roughness={0.3} />
      </mesh>

      <mesh position={[0.5, 0, 0.5]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      <mesh position={[-0.5, 0, 0.5]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      <mesh position={[0.5, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      <mesh position={[-0.5, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>

      <mesh position={[0.5, 0.1, 0.5]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
        <meshStandardMaterial color="#60a5fa" opacity={0.3} transparent />
      </mesh>
      <mesh position={[-0.5, 0.1, 0.5]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
        <meshStandardMaterial color="#60a5fa" opacity={0.3} transparent />
      </mesh>
      <mesh position={[0.5, 0.1, -0.5]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
        <meshStandardMaterial color="#60a5fa" opacity={0.3} transparent />
      </mesh>
      <mesh position={[-0.5, 0.1, -0.5]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
        <meshStandardMaterial color="#60a5fa" opacity={0.3} transparent />
      </mesh>

      <mesh position={[0, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}
