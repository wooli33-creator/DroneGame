import { Ring } from "./Ring";
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
    </>
  );
}
