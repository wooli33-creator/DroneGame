import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useDrone } from "@/lib/stores/useDrone";
import { useGame } from "@/lib/stores/useGame";
import * as THREE from "three";

export function Wind() {
  const { updatePhysics } = useDrone();
  const { difficulty, mode, windEnabled } = useGame();
  const time = useRef(0);

  const windStrength = useMemo(() => {
    if (!windEnabled || mode === "free_flight" || mode === "tutorial") return 0;
    
    switch (difficulty) {
      case "easy": return 0.5;
      case "medium": return 1.5;
      case "hard": return 3.0;
      default: return 0;
    }
  }, [difficulty, mode, windEnabled]);

  useFrame((state, delta) => {
    time.current += delta;
    
    if (windStrength === 0) {
      updatePhysics(delta);
      return;
    }

    const windX = Math.sin(time.current * 0.5) * windStrength;
    const windZ = Math.cos(time.current * 0.3) * windStrength;
    const windY = Math.sin(time.current * 0.7) * windStrength * 0.3;

    const windForce = new THREE.Vector3(windX, windY, windZ);
    updatePhysics(delta, windForce);
  });

  return null;
}
