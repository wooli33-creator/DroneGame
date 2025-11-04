import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import "@fontsource/inter";
import { Drone } from "./components/Drone";
import { Environment } from "./components/Environment";
import { Camera } from "./components/Camera";
import { UI } from "./components/UI";

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        shadows
        camera={{
          position: [0, 8, 15],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          powerPreference: "default"
        }}
      >
        <color attach="background" args={["#87CEEB"]} />

        <Suspense fallback={null}>
          <Environment />
          <Drone />
          <Camera />
        </Suspense>
      </Canvas>

      <UI />
    </div>
  );
}

export default App;
