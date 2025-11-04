import { useState, useCallback } from "react";
import { useDrone } from "@/lib/stores/useDrone";
import { useGame } from "@/lib/stores/useGame";
import { useFlightRecorder } from "@/lib/stores/useFlightRecorder";
import { Joystick } from "./Joystick";
import { Button } from "./ui/button";
import { RotateCcw, Menu, Trophy, Circle, Square, Play, Save, ChevronUp, ChevronDown } from "lucide-react";
import { GameMenu } from "./GameMenu";

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

  const {
    mode,
    score,
    ringsCollected,
    totalRings,
    missionComplete,
    health,
    resetGame
  } = useGame();

  const {
    isRecording,
    isReplaying,
    startRecording,
    stopRecording,
    startReplay,
    stopReplay,
    frames,
    saveToLocalStorage
  } = useFlightRecorder();

  const [showMenu, setShowMenu] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [showInfoPanel, setShowInfoPanel] = useState(true);

  const handleLeftJoystickMove = useCallback((x: number, y: number) => {
    setLeftJoystick({ x, y });
  }, [setLeftJoystick]);

  const handleRightJoystickMove = useCallback((x: number, y: number) => {
    setRightJoystick({ x, y });
  }, [setRightJoystick]);

  const handleReset = () => {
    reset();
    resetGame();
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording();
      if (frames.length > 0) {
        setShowSaveDialog(true);
      }
    } else {
      startRecording();
    }
  };

  const handleSaveRecording = () => {
    if (saveName.trim()) {
      saveToLocalStorage(saveName.trim());
      setSaveName("");
      setShowSaveDialog(false);
    }
  };

  const handleReplayToggle = () => {
    if (isReplaying) {
      stopReplay();
    } else {
      startReplay();
    }
  };

  return (
    <>
      {showMenu && <GameMenu onClose={() => setShowMenu(false)} />}
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
          <div className="bg-black/70 text-white rounded-lg overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setShowInfoPanel(!showInfoPanel)}
              className="w-full flex items-center justify-between p-4 hover:bg-black/80 transition-colors"
            >
              <h1 className="text-xl font-bold">드론 조종 시뮬레이터</h1>
              {showInfoPanel ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {showInfoPanel && (
              <div className="px-4 pb-4 space-y-2">
                <div className="space-y-1 text-sm">
                  <div>고도: {altitude.toFixed(1)}m</div>
                  <div>속도: {speed.toFixed(1)}m/s</div>
                  <div>방향: {heading.toFixed(0)}°</div>
                  {mode !== "free_flight" && (
                    <>
                      <div className="border-t border-gray-600 pt-2 mt-2">
                        <div>점수: {score}</div>
                        {mode === "mission" && (
                          <>
                            <div>링: {ringsCollected}/{totalRings}</div>
                            <div className="mt-2">
                              <div className="text-xs mb-1">체력</div>
                              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-300 ${
                                    health > 60 ? 'bg-green-500' : 
                                    health > 30 ? 'bg-yellow-500' : 
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${health}%` }}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              <Menu className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleRecordToggle}
              className={`${isRecording ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-gray-700 hover:bg-gray-600"} text-white`}
              disabled={isReplaying}
            >
              {isRecording ? <Square className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            </Button>
            <Button
              onClick={handleReplayToggle}
              className={`${isReplaying ? "bg-green-600 hover:bg-green-700" : "bg-gray-700 hover:bg-gray-600"} text-white`}
              disabled={isRecording || frames.length === 0}
            >
              <Play className="w-4 h-4" />
            </Button>
            <Button
              onClick={toggleControlMode}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {controlMode === "mode1" ? "모드 1" : "모드 2"}
            </Button>
            <Button
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {missionComplete && health > 0 && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white p-8 rounded-2xl shadow-2xl text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">미션 완료!</h2>
              <p className="text-xl mb-4">최종 점수: {score}</p>
              <Button
                onClick={handleReset}
                className="bg-white text-yellow-600 hover:bg-gray-100"
              >
                다시 도전
              </Button>
            </div>
          </div>
        )}

        {health <= 0 && mode === "mission" && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-8 rounded-2xl shadow-2xl text-center">
              <div className="text-6xl mb-4">💥</div>
              <h2 className="text-3xl font-bold mb-2">게임 오버!</h2>
              <p className="text-xl mb-2">장애물 충돌로 드론이 파손되었습니다</p>
              <p className="text-lg mb-4">획득 점수: {score}</p>
              <Button
                onClick={handleReset}
                className="bg-white text-red-600 hover:bg-gray-100"
              >
                다시 시작
              </Button>
            </div>
          </div>
        )}

        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-auto portrait:flex-col portrait:items-center portrait:gap-4 portrait:left-1/2 portrait:-translate-x-1/2 portrait:w-auto">
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

        {showSaveDialog && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 pointer-events-auto">
            <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-4">비행 기록 저장</h3>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="기록 이름 입력..."
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 mb-4"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveRecording}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
                <Button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setSaveName("");
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
