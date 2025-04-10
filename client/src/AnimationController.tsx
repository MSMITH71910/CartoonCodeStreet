import { useEffect, useState } from 'react';

// A completely non-ReactThreeFiber approach to handle animations
// This should work directly with no interference from other systems

interface AnimationState {
  isDancing: boolean;
  isWavingLeft: boolean;
  isWavingRight: boolean;
  isMoving: boolean;
}

const AnimationController = () => {
  // Initialize our own local animation state
  const [animState, setAnimState] = useState<AnimationState>({
    isDancing: false,
    isWavingLeft: false,
    isWavingRight: false,
    isMoving: false
  });

  // Share animation state globally for other components to access
  useEffect(() => {
    // Expose animation state to window
    (window as any).characterAnimations = animState;
    
    // Create document-level custom events if needed
    const updateEvent = new CustomEvent('character-animation-update', { 
      detail: animState 
    });
    document.dispatchEvent(updateEvent);
  }, [animState]);

  // Set up direct key event listeners
  useEffect(() => {
    console.log("Setting up animation controller key listeners");
    
    // Map movement keys
    const movementKeys = ['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    
    // Track if any movement keys are pressed
    let movementKeysPressed = 0;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(`Animation Controller KeyDown: ${e.code}`);
      
      // Track movement keys
      if (movementKeys.includes(e.code)) {
        movementKeysPressed++;
        if (movementKeysPressed > 0) {
          setAnimState(prev => ({
            ...prev,
            isMoving: true,
            isDancing: false,
            isWavingLeft: false,
            isWavingRight: false
          }));
        }
      }
      
      // Handle animation keys only when not moving
      if (!animState.isMoving) {
        if (e.code === 'KeyZ') {
          console.log("Animation Controller: Z KEY PRESS - DANCE");
          setAnimState(prev => ({
            ...prev,
            isDancing: true,
            isWavingLeft: false,
            isWavingRight: false
          }));
        } 
        else if (e.code === 'KeyQ') {
          console.log("Animation Controller: Q KEY PRESS - WAVE LEFT");
          setAnimState(prev => ({
            ...prev,
            isDancing: false,
            isWavingLeft: true,
            isWavingRight: false
          }));
        }
        else if (e.code === 'KeyR') {
          console.log("Animation Controller: R KEY PRESS - WAVE RIGHT");
          setAnimState(prev => ({
            ...prev,
            isDancing: false, 
            isWavingLeft: false,
            isWavingRight: true
          }));
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      // Track movement keys
      if (movementKeys.includes(e.code)) {
        movementKeysPressed = Math.max(0, movementKeysPressed - 1);
        if (movementKeysPressed === 0) {
          setAnimState(prev => ({
            ...prev,
            isMoving: false
          }));
        }
      }
      
      // Handle animation keys
      if (e.code === 'KeyZ' && animState.isDancing) {
        console.log("Animation Controller: Z KEY RELEASE - STOP DANCE");
        setAnimState(prev => ({
          ...prev,
          isDancing: false
        }));
      }
      else if (e.code === 'KeyQ' && animState.isWavingLeft) {
        console.log("Animation Controller: Q KEY RELEASE - STOP WAVE LEFT");
        setAnimState(prev => ({
          ...prev,
          isWavingLeft: false
        }));
      }
      else if (e.code === 'KeyR' && animState.isWavingRight) {
        console.log("Animation Controller: R KEY RELEASE - STOP WAVE RIGHT");
        setAnimState(prev => ({
          ...prev,
          isWavingRight: false
        }));
      }
    };
    
    // Add the listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Clean up
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [animState.isMoving, animState.isDancing, animState.isWavingLeft, animState.isWavingRight]);
  
  // Debugging panel
  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-70 text-white p-2 text-xs z-50">
      <div className="font-bold">Animation State:</div>
      <div>Dancing: {animState.isDancing ? 'YES' : 'no'}</div>
      <div>Wave Left: {animState.isWavingLeft ? 'YES' : 'no'}</div>
      <div>Wave Right: {animState.isWavingRight ? 'YES' : 'no'}</div>
      <div>Moving: {animState.isMoving ? 'YES' : 'no'}</div>
    </div>
  );
};

export default AnimationController;