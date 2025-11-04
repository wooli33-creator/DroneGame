import { Ring } from "./Ring";
import { MovingPlatform } from "./MovingPlatform";
import { RotatingBeam } from "./RotatingBeam";
import { Balloon } from "./Balloon";
import { useGame } from "@/lib/stores/useGame";
import { useMemo } from "react";

export function Obstacles() {
  const { mode, difficulty } = useGame();

  const ringPositions = useMemo(() => {
    if (mode === "tutorial") {
      return [
        { pos: [0, 5, -10] as [number, number, number], rot: [0, 0, 0] as [number, number, number], id: 1 }
      ];
    }

    const difficultyConfig = {
      easy: [
        { pos: [0, 5, -10] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
        { pos: [5, 6, -20] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
        { pos: [-5, 7, -30] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
        { pos: [0, 8, -40] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
        { pos: [3, 5, -50] as [number, number, number], rot: [0, 0, 0] as [number, number, number] }
      ],
      medium: [
        { pos: [0, 5, -10] as [number, number, number], rot: [0, Math.PI / 6, 0] as [number, number, number] },
        { pos: [7, 6, -20] as [number, number, number], rot: [0, -Math.PI / 6, 0] as [number, number, number] },
        { pos: [-7, 7, -30] as [number, number, number], rot: [Math.PI / 6, 0, 0] as [number, number, number] },
        { pos: [4, 8, -40] as [number, number, number], rot: [0, Math.PI / 4, 0] as [number, number, number] },
        { pos: [-4, 5, -50] as [number, number, number], rot: [0, 0, Math.PI / 6] as [number, number, number] },
        { pos: [0, 10, -60] as [number, number, number], rot: [0, 0, 0] as [number, number, number] }
      ],
      hard: [
        { pos: [0, 5, -10] as [number, number, number], rot: [0, Math.PI / 4, 0] as [number, number, number] },
        { pos: [8, 4, -18] as [number, number, number], rot: [Math.PI / 4, Math.PI / 4, 0] as [number, number, number] },
        { pos: [-8, 8, -26] as [number, number, number], rot: [0, -Math.PI / 3, Math.PI / 6] as [number, number, number] },
        { pos: [6, 10, -34] as [number, number, number], rot: [Math.PI / 6, 0, Math.PI / 4] as [number, number, number] },
        { pos: [-6, 3, -42] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number] },
        { pos: [4, 12, -50] as [number, number, number], rot: [Math.PI / 3, Math.PI / 6, 0] as [number, number, number] },
        { pos: [0, 6, -60] as [number, number, number], rot: [0, 0, Math.PI / 3] as [number, number, number] }
      ]
    };

    return difficultyConfig[difficulty].map((config, idx) => ({
      pos: config.pos,
      rot: config.rot,
      id: idx + 1
    }));
  }, [mode, difficulty]);

  if (mode === "free_flight") {
    return null;
  }

  const showObstacles = mode === "mission";

  return (
    <>
      {ringPositions.map((ring) => (
        <Ring
          key={ring.id}
          position={ring.pos}
          rotation={ring.rot}
          radius={2}
          id={ring.id}
        />
      ))}

      {showObstacles && (
        <>
          <MovingPlatform position={[0, 4, -15]} size={[4, 0.5, 4]} moveRange={2} speed={0.8} axis="y" />
          <MovingPlatform position={[6, 6, -25]} size={[3, 0.5, 3]} moveRange={2.5} speed={1} axis="x" />
          <MovingPlatform position={[-6, 8, -35]} size={[3, 0.5, 3]} moveRange={2} speed={0.9} axis="z" />

          <RotatingBeam position={[0, 6, -22]} length={7} speed={0.6} />
          <RotatingBeam position={[5, 9, -45]} length={6} speed={0.8} />
          
          <Balloon position={[3, 7, -12]} color="#ec4899" />
          <Balloon position={[-4, 9, -18]} color="#8b5cf6" />
          <Balloon position={[7, 5, -28]} color="#f59e0b" />
          <Balloon position={[-7, 11, -38]} color="#10b981" />
          <Balloon position={[4, 4, -48]} color="#3b82f6" />
          <Balloon position={[-3, 13, -55]} color="#ef4444" />

          {difficulty === "hard" && (
            <>
              <RotatingBeam position={[-8, 7, -33]} length={5} speed={1.2} />
              <MovingPlatform position={[8, 10, -52]} size={[2.5, 0.5, 2.5]} moveRange={3} speed={1.2} axis="y" />
            </>
          )}
        </>
      )}
    </>
  );
}
