import { useTexture } from "@react-three/drei";

export function Environment() {
  const grassTexture = useTexture("/textures/grass.png");

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
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
        <meshStandardMaterial map={grassTexture} />
      </mesh>

      <gridHelper args={[100, 100, "#444444", "#333333"]} position={[0, 0.01, 0]} />
    </>
  );
}
