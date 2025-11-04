import { useGame } from "@/lib/stores/useGame";
import { useMemo } from "react";

export function Environment() {
  const { difficulty, mode } = useGame();

  const { ambientIntensity, directionalIntensity, fogDensity, skyColor } = useMemo(() => {
    if (mode === "free_flight" || mode === "tutorial") {
      return {
        ambientIntensity: 0.6,
        directionalIntensity: 1.2,
        fogDensity: 0,
        skyColor: "#87CEEB"
      };
    }

    switch (difficulty) {
      case "easy":
        return {
          ambientIntensity: 0.6,
          directionalIntensity: 1.2,
          fogDensity: 0.005,
          skyColor: "#87CEEB"
        };
      case "medium":
        return {
          ambientIntensity: 0.4,
          directionalIntensity: 0.9,
          fogDensity: 0.015,
          skyColor: "#6B8E9E"
        };
      case "hard":
        return {
          ambientIntensity: 0.3,
          directionalIntensity: 0.7,
          fogDensity: 0.025,
          skyColor: "#4A5F6F"
        };
      default:
        return {
          ambientIntensity: 0.5,
          directionalIntensity: 1,
          fogDensity: 0,
          skyColor: "#87CEEB"
        };
    }
  }, [difficulty, mode]);

  return (
    <>
      <color attach="background" args={[skyColor]} />
      <fog attach="fog" args={[skyColor, 10, 100 - (fogDensity * 1000)]} />
      
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={directionalIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>

      <gridHelper args={[100, 100, "#333333", "#222222"]} position={[0, 0.01, 0]} />
    </>
  );
}
