import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GameMode = "free_flight" | "tutorial" | "mission";
export type TutorialType = "hover" | "forward" | "turn" | "complete";
export type Difficulty = "easy" | "medium" | "hard";

interface GameState {
  mode: GameMode;
  tutorialType: TutorialType;
  difficulty: Difficulty;
  score: number;
  ringsCollected: number;
  totalRings: number;
  missionComplete: boolean;
  showInstructions: boolean;
  
  setMode: (mode: GameMode) => void;
  setTutorialType: (type: TutorialType) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  addScore: (points: number) => void;
  collectRing: () => void;
  resetGame: () => void;
  completeMission: () => void;
  toggleInstructions: () => void;
}

export const useGame = create<GameState>()(
  subscribeWithSelector((set) => ({
    mode: "free_flight",
    tutorialType: "hover",
    difficulty: "easy",
    score: 0,
    ringsCollected: 0,
    totalRings: 5,
    missionComplete: false,
    showInstructions: true,
    
    setMode: (mode) => {
      set({ 
        mode, 
        score: 0, 
        ringsCollected: 0, 
        missionComplete: false,
        tutorialType: "hover"
      });
    },
    
    setTutorialType: (tutorialType) => {
      set({ tutorialType, score: 0 });
    },
    
    setDifficulty: (difficulty) => {
      const totalRingsByDifficulty = {
        easy: 5,
        medium: 6,
        hard: 7
      };
      set({ 
        difficulty, 
        totalRings: totalRingsByDifficulty[difficulty],
        ringsCollected: 0,
        score: 0,
        missionComplete: false
      });
    },
    
    addScore: (points) => {
      set((state) => ({ score: state.score + points }));
    },
    
    collectRing: () => {
      set((state) => {
        const newRingsCollected = state.ringsCollected + 1;
        const newScore = state.score + 100;
        return {
          ringsCollected: newRingsCollected,
          score: newScore,
          missionComplete: newRingsCollected >= state.totalRings
        };
      });
    },
    
    resetGame: () => {
      set({
        score: 0,
        ringsCollected: 0,
        missionComplete: false
      });
    },
    
    completeMission: () => {
      set({ missionComplete: true });
    },
    
    toggleInstructions: () => {
      set((state) => ({ showInstructions: !state.showInstructions }));
    }
  }))
);
