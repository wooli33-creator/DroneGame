import { useEffect, useState } from "react";
import { useGame } from "@/lib/stores/useGame";
import { useDrone } from "@/lib/stores/useDrone";
import { Card } from "./ui/card";
import { CheckCircle2 } from "lucide-react";

export function Tutorial() {
  const { tutorialType, mode, setTutorialType, addScore } = useGame();
  const { altitude, speed, heading } = useDrone();
  const [stepComplete, setStepComplete] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    setStepComplete(false);
    setTimer(0);
  }, [tutorialType]);

  useEffect(() => {
    if (mode !== "tutorial" || tutorialType === "complete") return;

    let isComplete = false;

    switch (tutorialType) {
      case "hover":
        if (altitude > 4 && altitude < 6 && speed < 0.5) {
          setTimer((t) => t + 1);
          if (timer > 60) {
            isComplete = true;
          }
        } else {
          setTimer(0);
        }
        break;

      case "forward":
        if (speed > 2) {
          setTimer((t) => t + 1);
          if (timer > 30) {
            isComplete = true;
          }
        } else {
          setTimer(0);
        }
        break;

      case "turn":
        if (Math.abs(heading - 180) < 20 || Math.abs(heading - 180) > 340) {
          setTimer((t) => t + 1);
          if (timer > 30) {
            isComplete = true;
          }
        }
        break;
    }

    if (isComplete && !stepComplete) {
      setStepComplete(true);
      addScore(50);
      
      const timeoutId = setTimeout(() => {
        const nextSteps: Record<string, "forward" | "turn" | "complete"> = {
          hover: "forward",
          forward: "turn",
          turn: "complete"
        };
        setTutorialType(nextSteps[tutorialType]);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [altitude, speed, heading, timer, tutorialType, stepComplete, mode, setTutorialType, addScore]);

  if (mode !== "tutorial") return null;

  const tutorials = {
    hover: {
      title: "호버링 연습",
      instructions: "조이스틱으로 드론을 4-6m 고도에서 정지 상태로 1초간 유지하세요",
      tips: "왼쪽 조이스틱을 위로 올려 고도를 맞추고, 중앙에서 유지하세요"
    },
    forward: {
      title: "전진 비행",
      instructions: "드론을 빠르게 전진시키세요 (속도 2m/s 이상)",
      tips: "오른쪽 조이스틱을 앞으로 밀어 드론을 기울이세요"
    },
    turn: {
      title: "회전 연습",
      instructions: "드론을 180도 회전시키세요",
      tips: "조이스틱을 좌우로 움직여 요(Yaw)를 조종하세요"
    },
    complete: {
      title: "튜토리얼 완료!",
      instructions: "모든 기본 조작을 마스터했습니다",
      tips: "이제 미션 모드에 도전해보세요"
    }
  };

  const current = tutorials[tutorialType];

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 pointer-events-none z-10">
      <Card className="bg-black/80 text-white p-6 max-w-md border-2 border-blue-500">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xl font-bold">{current.title}</h2>
          {stepComplete && (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          )}
        </div>
        <p className="text-sm mb-2">{current.instructions}</p>
        <p className="text-xs text-gray-300 italic">{current.tips}</p>
        {!stepComplete && timer > 0 && (
          <div className="mt-3 bg-blue-600/30 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-100"
              style={{ width: `${(timer / (tutorialType === "hover" ? 60 : 30)) * 100}%` }}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
