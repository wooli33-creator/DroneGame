import { create } from "zustand";
import * as THREE from "three";

interface FlightFrame {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  timestamp: number;
}

interface FlightRecorderState {
  isRecording: boolean;
  isReplaying: boolean;
  frames: FlightFrame[];
  currentFrame: number;
  
  startRecording: () => void;
  stopRecording: () => void;
  recordFrame: (position: THREE.Vector3, rotation: THREE.Euler) => void;
  startReplay: () => void;
  stopReplay: () => void;
  getReplayFrame: () => FlightFrame | null;
  clearRecording: () => void;
  saveToLocalStorage: (name: string) => void;
  loadFromLocalStorage: (name: string) => boolean;
  getSavedRecordings: () => string[];
}

export const useFlightRecorder = create<FlightRecorderState>((set, get) => ({
  isRecording: false,
  isReplaying: false,
  frames: [],
  currentFrame: 0,
  
  startRecording: () => {
    set({ isRecording: true, frames: [], isReplaying: false });
  },
  
  stopRecording: () => {
    set({ isRecording: false });
  },
  
  recordFrame: (position, rotation) => {
    const state = get();
    if (!state.isRecording) return;
    
    set({
      frames: [
        ...state.frames,
        {
          position: position.clone(),
          rotation: rotation.clone(),
          timestamp: Date.now()
        }
      ]
    });
  },
  
  startReplay: () => {
    const state = get();
    if (state.frames.length === 0) return;
    
    set({ isReplaying: true, currentFrame: 0, isRecording: false });
  },
  
  stopReplay: () => {
    set({ isReplaying: false, currentFrame: 0 });
  },
  
  getReplayFrame: () => {
    const state = get();
    if (!state.isReplaying || state.currentFrame >= state.frames.length) {
      set({ isReplaying: false, currentFrame: 0 });
      return null;
    }
    
    const frame = state.frames[state.currentFrame];
    set({ currentFrame: state.currentFrame + 1 });
    return frame;
  },
  
  clearRecording: () => {
    set({ frames: [], currentFrame: 0, isRecording: false, isReplaying: false });
  },
  
  saveToLocalStorage: (name) => {
    const state = get();
    const serializedFrames = state.frames.map(frame => ({
      position: [frame.position.x, frame.position.y, frame.position.z],
      rotation: [frame.rotation.x, frame.rotation.y, frame.rotation.z],
      timestamp: frame.timestamp
    }));
    
    const recordings = JSON.parse(localStorage.getItem('flightRecordings') || '{}');
    recordings[name] = serializedFrames;
    localStorage.setItem('flightRecordings', JSON.stringify(recordings));
  },
  
  loadFromLocalStorage: (name) => {
    const recordings = JSON.parse(localStorage.getItem('flightRecordings') || '{}');
    const recording = recordings[name];
    
    if (!recording) return false;
    
    const frames = recording.map((frame: any) => ({
      position: new THREE.Vector3(...frame.position),
      rotation: new THREE.Euler(...frame.rotation),
      timestamp: frame.timestamp
    }));
    
    set({ frames, isReplaying: false, currentFrame: 0 });
    return true;
  },
  
  getSavedRecordings: () => {
    const recordings = JSON.parse(localStorage.getItem('flightRecordings') || '{}');
    return Object.keys(recordings);
  }
}));
