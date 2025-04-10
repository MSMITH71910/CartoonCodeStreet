import React, { useEffect, useState } from 'react';

// This component provides direct buttons to control animations
// since keyboard controls aren't working as expected
const AnimationButtons = () => {
  // State to manage animation states
  const [animState, setAnimState] = useState({
    isDancing: false,
    isWavingLeft: false,
    isWavingRight: false
  });
  
  // Update global animation state and character
  useEffect(() => {
    // Expose animation state to window object for character to access
    (window as any).characterAnimations = {
      ...animState,
      isMoving: false // Not managed by buttons
    };
    
    // Dispatch custom event for any components listening
    const event = new CustomEvent('character-animation-update', {
      detail: (window as any).characterAnimations
    });
    document.dispatchEvent(event);
    
    // Also update our older animation keys system just to be sure
    if (!window.animationKeys) {
      window.animationKeys = {
        Z: false,
        Q: false,
        R: false
      };
    }
    
    window.animationKeys.Z = animState.isDancing;
    window.animationKeys.Q = animState.isWavingLeft;
    window.animationKeys.R = animState.isWavingRight;
    
  }, [animState]);
  
  // Toggle animation buttons
  const toggleDance = () => {
    setAnimState(prev => ({
      isDancing: !prev.isDancing,
      isWavingLeft: false,
      isWavingRight: false
    }));
  };
  
  const toggleWaveLeft = () => {
    setAnimState(prev => ({
      isDancing: false,
      isWavingLeft: !prev.isWavingLeft,
      isWavingRight: false
    }));
  };
  
  const toggleWaveRight = () => {
    setAnimState(prev => ({
      isDancing: false,
      isWavingLeft: false,
      isWavingRight: !prev.isWavingRight
    }));
  };
  
  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 flex gap-4 z-50">
      <button
        className={`px-6 py-4 rounded-full text-xl font-bold transition-all ${
          animState.isDancing 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-800 bg-opacity-80 text-white hover:bg-green-700'
        }`}
        onClick={toggleDance}
      >
        DANCE (Z)
      </button>
      
      <button
        className={`px-6 py-4 rounded-full text-xl font-bold transition-all ${
          animState.isWavingLeft 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-800 bg-opacity-80 text-white hover:bg-blue-700'
        }`}
        onClick={toggleWaveLeft}
      >
        WAVE LEFT (Q)
      </button>
      
      <button
        className={`px-6 py-4 rounded-full text-xl font-bold transition-all ${
          animState.isWavingRight 
            ? 'bg-purple-500 text-white' 
            : 'bg-gray-800 bg-opacity-80 text-white hover:bg-purple-700'
        }`}
        onClick={toggleWaveRight}
      >
        WAVE RIGHT (R)
      </button>
    </div>
  );
};

export default AnimationButtons;