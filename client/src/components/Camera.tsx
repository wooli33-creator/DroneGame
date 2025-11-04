import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useDrone } from "@/lib/stores/useDrone";
import * as THREE from "three";

export function Camera() {
  const { camera } = useThree();
  const { position } = useDrone();
  const targetPosition = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3(0, 8, 15));

  useFrame(() => {
    targetPosition.current.set(
      position.x,
      position.y + 8,
      position.z + 15
    );

    currentPosition.current.lerp(targetPosition.current, 0.05);

    camera.position.copy(currentPosition.current);
    camera.lookAt(position.x, position.y + 2, position.z);
  });

  return null;
}
