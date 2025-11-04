import { useGame } from "@/lib/stores/useGame";
import { useDrone } from "@/lib/stores/useDrone";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Plane, Target, GraduationCap, X } from "lucide-react";

interface GameMenuProps {
  onClose: () => void;
}

export function GameMenu({ onClose }: GameMenuProps) {
  const { mode, setMode, difficulty, setDifficulty, resetGame } = useGame();
  const { reset: resetDrone } = useDrone();

  const handleModeChange = (newMode: typeof mode) => {
    setMode(newMode);
    resetGame();
    resetDrone();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 pointer-events-auto">
      <Card className="bg-gray-900/95 border-2 border-blue-500 p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">드론 조종 시뮬레이터</h1>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-white hover:bg-gray-800"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">게임 모드 선택</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                onClick={() => handleModeChange("free_flight")}
                className={`h-24 flex flex-col items-center justify-center gap-2 ${
                  mode === "free_flight"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <Plane className="w-8 h-8" />
                <span>자유 비행</span>
              </Button>

              <Button
                onClick={() => handleModeChange("tutorial")}
                className={`h-24 flex flex-col items-center justify-center gap-2 ${
                  mode === "tutorial"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <GraduationCap className="w-8 h-8" />
                <span>튜토리얼</span>
              </Button>

              <Button
                onClick={() => handleModeChange("mission")}
                className={`h-24 flex flex-col items-center justify-center gap-2 ${
                  mode === "mission"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <Target className="w-8 h-8" />
                <span>미션 모드</span>
              </Button>
            </div>
          </div>

          {mode === "mission" && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">난이도</h2>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => setDifficulty("easy")}
                  className={`${
                    difficulty === "easy"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  쉬움
                </Button>
                <Button
                  onClick={() => setDifficulty("medium")}
                  className={`${
                    difficulty === "medium"
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  보통
                </Button>
                <Button
                  onClick={() => setDifficulty("hard")}
                  className={`${
                    difficulty === "hard"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  어려움
                </Button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">조작법</h3>
            <p className="text-sm text-gray-300">
              화면의 가상 조이스틱으로 드론을 조종하세요.
              <br />
              모드 버튼을 눌러 모드1/모드2를 전환할 수 있습니다.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
