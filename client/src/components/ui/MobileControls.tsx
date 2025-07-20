import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-is-mobile';

interface MobileControlsProps {
  onMove: (direction: { x: number; y: number }) => void;
  onInteract: () => void;
  onLookAround: (delta: { x: number; y: number }) => void;
}

const MobileControls: React.FC<MobileControlsProps> = ({ onMove, onInteract, onLookAround }) => {
  const isMobile = useIsMobile();
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const lookPadRef = useRef<HTMLDivElement>(null);
  
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const [isLookPadActive, setIsLookPadActive] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  
  const joystickCenter = useRef({ x: 0, y: 0 });
  const lastLookPosition = useRef({ x: 0, y: 0 });

  // Calculate joystick center position
  const updateJoystickCenter = useCallback(() => {
    if (joystickRef.current) {
      const rect = joystickRef.current.getBoundingClientRect();
      joystickCenter.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
  }, []);

  useEffect(() => {
    updateJoystickCenter();
    window.addEventListener('resize', updateJoystickCenter);
    return () => window.removeEventListener('resize', updateJoystickCenter);
  }, [updateJoystickCenter]);

  // Joystick handlers
  const handleJoystickStart = useCallback((clientX: number, clientY: number) => {
    setIsJoystickActive(true);
    updateJoystickCenter();
  }, [updateJoystickCenter]);

  const handleJoystickMove = useCallback((clientX: number, clientY: number) => {
    if (!isJoystickActive) return;

    const deltaX = clientX - joystickCenter.current.x;
    const deltaY = clientY - joystickCenter.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 40; // Maximum joystick radius

    let normalizedX = deltaX / maxDistance;
    let normalizedY = deltaY / maxDistance;

    // Clamp to circle
    if (distance > maxDistance) {
      normalizedX = (deltaX / distance) * (maxDistance / maxDistance);
      normalizedY = (deltaY / distance) * (maxDistance / maxDistance);
    }

    // Update visual position
    setJoystickPosition({
      x: normalizedX * maxDistance,
      y: normalizedY * maxDistance
    });

    // Send movement data (invert Y for game coordinates)
    onMove({
      x: normalizedX,
      y: -normalizedY
    });
  }, [isJoystickActive, onMove]);

  const handleJoystickEnd = useCallback(() => {
    setIsJoystickActive(false);
    setJoystickPosition({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  }, [onMove]);

  // Look pad handlers
  const handleLookStart = useCallback((clientX: number, clientY: number) => {
    setIsLookPadActive(true);
    lastLookPosition.current = { x: clientX, y: clientY };
  }, []);

  const handleLookMove = useCallback((clientX: number, clientY: number) => {
    if (!isLookPadActive) return;

    const deltaX = clientX - lastLookPosition.current.x;
    const deltaY = clientY - lastLookPosition.current.y;

    // Send look delta with sensitivity adjustment
    onLookAround({
      x: deltaX * 0.01,
      y: deltaY * 0.01
    });

    lastLookPosition.current = { x: clientX, y: clientY };
  }, [isLookPadActive, onLookAround]);

  const handleLookEnd = useCallback(() => {
    setIsLookPadActive(false);
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent, type: 'joystick' | 'look') => {
    e.preventDefault();
    const touch = e.touches[0];
    if (type === 'joystick') {
      handleJoystickStart(touch.clientX, touch.clientY);
    } else {
      handleLookStart(touch.clientX, touch.clientY);
    }
  }, [handleJoystickStart, handleLookStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent, type: 'joystick' | 'look') => {
    e.preventDefault();
    const touch = e.touches[0];
    if (type === 'joystick') {
      handleJoystickMove(touch.clientX, touch.clientY);
    } else {
      handleLookMove(touch.clientX, touch.clientY);
    }
  }, [handleJoystickMove, handleLookMove]);

  const handleTouchEnd = useCallback((e: React.TouchEvent, type: 'joystick' | 'look') => {
    e.preventDefault();
    if (type === 'joystick') {
      handleJoystickEnd();
    } else {
      handleLookEnd();
    }
  }, [handleJoystickEnd, handleLookEnd]);

  // Mouse event handlers for testing on desktop
  const handleMouseStart = useCallback((e: React.MouseEvent, type: 'joystick' | 'look') => {
    e.preventDefault();
    if (type === 'joystick') {
      handleJoystickStart(e.clientX, e.clientY);
    } else {
      handleLookStart(e.clientX, e.clientY);
    }
  }, [handleJoystickStart, handleLookStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent, type: 'joystick' | 'look') => {
    e.preventDefault();
    if (type === 'joystick') {
      handleJoystickMove(e.clientX, e.clientY);
    } else {
      handleLookMove(e.clientX, e.clientY);
    }
  }, [handleJoystickMove, handleLookMove]);

  const handleMouseEnd = useCallback((e: React.MouseEvent, type: 'joystick' | 'look') => {
    e.preventDefault();
    if (type === 'joystick') {
      handleJoystickEnd();
    } else {
      handleLookEnd();
    }
  }, [handleJoystickEnd, handleLookEnd]);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Movement Joystick - Bottom Left */}
      <div className="absolute bottom-6 left-6 pointer-events-auto">
        <div className="flex flex-col items-center gap-2">
          <span className="text-white text-xs font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
            Move
          </span>
          <div
            ref={joystickRef}
            className="relative w-20 h-20 bg-black bg-opacity-30 rounded-full border-2 border-white border-opacity-50"
            onTouchStart={(e) => handleTouchStart(e, 'joystick')}
            onTouchMove={(e) => handleTouchMove(e, 'joystick')}
            onTouchEnd={(e) => handleTouchEnd(e, 'joystick')}
            onMouseDown={(e) => handleMouseStart(e, 'joystick')}
            onMouseMove={isJoystickActive ? (e) => handleMouseMove(e, 'joystick') : undefined}
            onMouseUp={(e) => handleMouseEnd(e, 'joystick')}
            onMouseLeave={(e) => handleMouseEnd(e, 'joystick')}
          >
            <div
              ref={knobRef}
              className="absolute w-8 h-8 bg-white bg-opacity-80 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
              style={{
                transform: `translate(${joystickPosition.x - 16}px, ${joystickPosition.y - 16}px)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Look Around Pad - Bottom Right */}
      <div className="absolute bottom-6 right-6 pointer-events-auto">
        <div className="flex flex-col items-center gap-2">
          <span className="text-white text-xs font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
            Look
          </span>
          <div
            ref={lookPadRef}
            className={`w-20 h-20 bg-black bg-opacity-30 rounded-full border-2 border-white border-opacity-50 flex items-center justify-center ${
              isLookPadActive ? 'bg-opacity-50' : ''
            }`}
            onTouchStart={(e) => handleTouchStart(e, 'look')}
            onTouchMove={(e) => handleTouchMove(e, 'look')}
            onTouchEnd={(e) => handleTouchEnd(e, 'look')}
            onMouseDown={(e) => handleMouseStart(e, 'look')}
            onMouseMove={isLookPadActive ? (e) => handleMouseMove(e, 'look') : undefined}
            onMouseUp={(e) => handleMouseEnd(e, 'look')}
            onMouseLeave={(e) => handleMouseEnd(e, 'look')}
          >
            <div className="text-white text-opacity-70 text-xs">👁️</div>
          </div>
        </div>
      </div>

      {/* Interact Button - Bottom Center */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className="flex flex-col items-center gap-2">
          <span className="text-white text-xs font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
            Interact
          </span>
          <button
            className="w-16 h-16 bg-blue-600 bg-opacity-80 rounded-full border-2 border-white border-opacity-50 flex items-center justify-center text-white text-xl font-bold active:bg-opacity-100 transition-all"
            onTouchStart={(e) => {
              e.preventDefault();
              onInteract();
            }}
            onClick={onInteract}
          >
            E
          </button>
        </div>
      </div>

      {/* Instructions for mobile */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className="bg-black bg-opacity-70 text-white text-xs px-3 py-2 rounded-lg text-center max-w-xs">
          <p>Use joystick to move • Touch look pad to look around • Tap E to interact</p>
        </div>
      </div>
    </div>
  );
};

export default MobileControls;