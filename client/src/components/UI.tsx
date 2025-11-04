import { useDrone } from "@/lib/stores/useDrone";
import { Joystick } from "./Joystick";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";

export function UI() {
  const {
    setLeftJoystick,
    setRightJoystick,
    controlMode,
    toggleControlMode,
    reset,
    altitude,
    speed,
    heading,
  } = useDrone();

  const handleLeftJoystickMove = (x: number, y: number) => {
    setLeftJoystick({ x, y });
  };

  const handleRightJoystickMove = (x: number, y: number) => {
    setRightJoystick({ x, y });
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        <div className="bg-black/70 text-white p-4 rounded-lg space-y-2">
          <h1 className="text-xl font-bold mb-2">드론 조종 시뮬레이터</h1>
          <div className="space-y-1 text-sm">
            <div>고도: {altitude.toFixed(1)}m</div>
            <div>속도: {speed.toFixed(1)}m/s</div>
            <div>방향: {heading.toFixed(0)}°</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={toggleControlMode}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {controlMode === "mode1" ? "모드 1" : "모드 2"}
          </Button>
          <Button
            onClick={reset}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-auto">
        <Joystick
          onMove={handleLeftJoystickMove}
          position="left"
          mode={controlMode}
        />
        <Joystick
          onMove={handleRightJoystickMove}
          position="right"
          mode={controlMode}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-xs pointer-events-auto">
        {controlMode === "mode1" ? (
          <span>왼쪽: 스로틀/요 | 오른쪽: 엘리베이터/에일러론</span>
        ) : (
          <span>왼쪽: 스로틀/에일러론 | 오른쪽: 엘리베이터/요</span>
        )}
      </div>
    </div>
  );
}
