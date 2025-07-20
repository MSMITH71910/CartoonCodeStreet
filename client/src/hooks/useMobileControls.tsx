import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useIsMobile } from './use-is-mobile';

interface MobileControlState {
  movement: { x: number; y: number };
  lookDelta: { x: number; y: number };
  interact: boolean;
}

export const useMobileControls = () => {
  const isMobile = useIsMobile();
  const controlState = useRef<MobileControlState>({
    movement: { x: 0, y: 0 },
    lookDelta: { x: 0, y: 0 },
    interact: false
  });

  // Movement handler
  const handleMove = useCallback((direction: { x: number; y: number }) => {
    controlState.current.movement = direction;
  }, []);

  // Look around handler
  const handleLookAround = useCallback((delta: { x: number; y: number }) => {
    controlState.current.lookDelta = delta;
  }, []);

  // Interact handler
  const handleInteract = useCallback(() => {
    controlState.current.interact = true;
    // Reset interact after a short delay to simulate key press
    setTimeout(() => {
      controlState.current.interact = false;
    }, 100);
  }, []);

  // Get current control state
  const getControlState = useCallback(() => {
    return {
      ...controlState.current,
      isMobile
    };
  }, [isMobile]);

  // Reset look delta (should be called after consuming the delta)
  const resetLookDelta = useCallback(() => {
    controlState.current.lookDelta = { x: 0, y: 0 };
  }, []);

  return {
    isMobile,
    handleMove,
    handleLookAround,
    handleInteract,
    getControlState,
    resetLookDelta
  };
};