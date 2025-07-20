import { useEffect, useRef } from "react";
import ReactConfetti from "react-confetti";

interface ConfettiProps {
  active?: boolean;
  width?: number;
  height?: number;
}

export function Confetti({ active = true, width, height }: ConfettiProps) {
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    // Auto-stop confetti after 3 seconds
    const timer = setTimeout(() => {
      // Confetti will naturally stop when active becomes false
    }, 3000);

    return () => clearTimeout(timer);
  }, [active]);

  if (!active) return null;

  return (
    <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-50">
      <ReactConfetti
        width={width || window.innerWidth}
        height={height || window.innerHeight}
        recycle={false}
        numberOfPieces={200}
        gravity={0.3}
        initialVelocityY={20}
        colors={['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']}
      />
    </div>
  );
}