import { useEffect, useRef, useState } from "react";

interface JoystickProps {
  onMove: (x: number, y: number) => void;
  position: "left" | "right";
  mode: "mode1" | "mode2";
}

export function Joystick({ onMove, position, mode }: JoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [stickPosition, setStickPosition] = useState({ x: 0, y: 0 });

  const getLabel = () => {
    if (mode === "mode1") {
      if (position === "left") return "스로틀/요";
      return "엘리베이터/에일러론";
    } else {
      if (position === "left") return "스로틀/에일러론";
      return "엘리베이터/요";
    }
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const maxRadius = rect.width / 2 - 20;

      let dx = clientX - centerX;
      let dy = clientY - centerY;

      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > maxRadius) {
        dx = (dx / distance) * maxRadius;
        dy = (dy / distance) * maxRadius;
      }

      setStickPosition({ x: dx, y: dy });

      let normalizedX = dx / maxRadius;
      let normalizedY = -dy / maxRadius;

      const deadZone = 0.05;
      if (Math.abs(normalizedX) < deadZone) normalizedX = 0;
      if (Math.abs(normalizedY) < deadZone) normalizedY = 0;

      normalizedX = normalizedX * 1.5;
      normalizedY = normalizedY * 1.5;

      normalizedX = Math.max(-1, Math.min(1, normalizedX));
      normalizedY = Math.max(-1, Math.min(1, normalizedY));

      onMove(normalizedX, normalizedY);
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        setIsDragging(true);
        handleMove(e.clientX, e.clientY);
        e.preventDefault();
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX, e.clientY);
      e.preventDefault();
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setStickPosition({ x: 0, y: 0 });
      onMove(0, 0);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointercancel", handlePointerUp);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [isDragging, onMove]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded-full">
        {getLabel()}
      </div>
      <div
        ref={containerRef}
        className="relative w-40 h-40 md:w-48 md:h-48 bg-gray-800/70 rounded-full border-4 border-gray-600/50"
        style={{ 
          touchAction: "none",
          WebkitTapHighlightColor: "transparent",
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none"
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-full bg-gray-600/30" />
          <div className="absolute w-full h-1 bg-gray-600/30" />
        </div>
        <div
          ref={stickRef}
          className={`absolute w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border-2 border-blue-300/50 shadow-lg transition-shadow ${
            isDragging ? "shadow-blue-500/50 scale-110" : ""
          }`}
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(calc(-50% + ${stickPosition.x}px), calc(-50% + ${stickPosition.y}px))`,
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
        />
      </div>
    </div>
  );
}
