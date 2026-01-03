import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export type ControlMode = "mode1" | "mode2";

interface JoystickInput {
  x: number;
  y: number;
}

interface DroneState {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  velocity: THREE.Vector3;
  angularVelocity: THREE.Vector3;
  
  leftJoystick: JoystickInput;
  rightJoystick: JoystickInput;
  
  controlMode: ControlMode;
  
  altitude: number;
  speed: number;
  heading: number;
  
  setLeftJoystick: (input: JoystickInput) => void;
  setRightJoystick: (input: JoystickInput) => void;
  toggleControlMode: () => void;
  reset: () => void;
  updatePhysics: (delta: number, windForce?: THREE.Vector3) => void;
}

const INITIAL_POSITION = new THREE.Vector3(0, 5, 0);
const INITIAL_ROTATION = new THREE.Euler(0, 0, 0);

export const useDrone = create<DroneState>()(
  subscribeWithSelector((set, get) => ({
    position: INITIAL_POSITION.clone(),
    rotation: INITIAL_ROTATION.clone(),
    velocity: new THREE.Vector3(0, 0, 0),
    angularVelocity: new THREE.Vector3(0, 0, 0),
    
    leftJoystick: { x: 0, y: 0 },
    rightJoystick: { x: 0, y: 0 },
    
    controlMode: "mode2",
    
    altitude: 5,
    speed: 0,
    heading: 0,
    
    setLeftJoystick: (input) => {
      set({ leftJoystick: input });
    },
    
    setRightJoystick: (input) => {
      set({ rightJoystick: input });
    },
    
    toggleControlMode: () => {
      set((state) => ({
        controlMode: state.controlMode === "mode1" ? "mode2" : "mode1"
      }));
    },
    
    reset: () => {
      set({
        position: INITIAL_POSITION.clone(),
        rotation: INITIAL_ROTATION.clone(),
        velocity: new THREE.Vector3(0, 0, 0),
        angularVelocity: new THREE.Vector3(0, 0, 0),
        leftJoystick: { x: 0, y: 0 },
        rightJoystick: { x: 0, y: 0 },
        altitude: 5,
        speed: 0,
        heading: 0,
      });
    },
    
    updatePhysics: (delta, windForce = new THREE.Vector3(0, 0, 0)) => {
      const state = get();
      const { leftJoystick, rightJoystick, controlMode } = state;
      
      let throttle = 0;
      let yaw = 0;
      let pitch = 0;
      let roll = 0;
      
      if (controlMode === "mode1") {
        throttle = leftJoystick.y;
        yaw = leftJoystick.x;
        pitch = rightJoystick.y;
        roll = rightJoystick.x;
      } else {
        throttle = leftJoystick.y;
        roll = leftJoystick.x;
        pitch = rightJoystick.y;
        yaw = rightJoystick.x;
      }
      
      const newVelocity = state.velocity.clone();
      const newAngularVelocity = state.angularVelocity.clone();
      const newPosition = state.position.clone();
      const newRotation = state.rotation.clone();
      
      const THROTTLE_POWER = 20.0;
      const HOVER_BASELINE = 0.5;
      const YAW_SPEED = 2.0;
      const PITCH_SPEED = 3.0;
      const ROLL_SPEED = 3.0;
      const GRAVITY = 9.8;
      const DRAG = 5.0;
      const MAX_TILT = Math.PI / 4;
      const AUTO_LEVEL_SPEED = 3.0;
      
      const effectiveThrottle = HOVER_BASELINE + (throttle * (1 - HOVER_BASELINE));
      newVelocity.y += (effectiveThrottle * THROTTLE_POWER - GRAVITY) * delta;
      
      newVelocity.add(windForce.clone().multiplyScalar(delta));
      
      const inputMagnitude = Math.sqrt(pitch * pitch + roll * roll + yaw * yaw);
      const hasInput = inputMagnitude > 0.05;
      
      if (hasInput) {
        newAngularVelocity.y = yaw * YAW_SPEED;
        newAngularVelocity.x = pitch * PITCH_SPEED;
        newAngularVelocity.z = roll * ROLL_SPEED;
        
        newRotation.x += newAngularVelocity.x * delta;
        newRotation.z += newAngularVelocity.z * delta;
      } else {
        newRotation.x = THREE.MathUtils.lerp(newRotation.x, 0, AUTO_LEVEL_SPEED * delta);
        newRotation.z = THREE.MathUtils.lerp(newRotation.z, 0, AUTO_LEVEL_SPEED * delta);
        newAngularVelocity.set(0, 0, 0);
      }
      
      newRotation.y += yaw * YAW_SPEED * delta;
      
      newRotation.x = THREE.MathUtils.clamp(newRotation.x, -MAX_TILT, MAX_TILT);
      newRotation.z = THREE.MathUtils.clamp(newRotation.z, -MAX_TILT, MAX_TILT);
      
      const tiltForce = 12.0;
      const cos = Math.cos(newRotation.y);
      const sin = Math.sin(newRotation.y);
      
      newVelocity.x += (-newRotation.z * cos - newRotation.x * sin) * tiltForce * delta;
      newVelocity.z += (-newRotation.z * sin + newRotation.x * cos) * tiltForce * delta;
      
      const dragFactor = Math.exp(-DRAG * delta);
      newVelocity.x *= dragFactor;
      newVelocity.z *= dragFactor;
      newVelocity.y *= Math.exp(-2.0 * delta);
      
      newPosition.add(newVelocity.clone().multiplyScalar(delta));
      
      if (newPosition.y < 0) {
        newPosition.y = 0;
        newVelocity.y = 0;
        newVelocity.x *= 0.3;
        newVelocity.z *= 0.3;
      }
      
      const altitude = newPosition.y;
      const speed = Math.sqrt(newVelocity.x ** 2 + newVelocity.z ** 2);
      const heading = ((newRotation.y * 180 / Math.PI) + 360) % 360;
      
      set({
        position: newPosition,
        rotation: newRotation,
        velocity: newVelocity,
        angularVelocity: newAngularVelocity,
        altitude,
        speed,
        heading,
      });
    }
  }))
);
