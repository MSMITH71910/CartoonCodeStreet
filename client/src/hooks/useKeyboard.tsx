import { useState, useEffect, useCallback } from 'react';

// Define the structure for the keyboard state
export interface KeyboardState {
  forward: boolean;
  backward: boolean;
  leftward: boolean;
  rightward: boolean;
  interact: boolean;
  dance: boolean;
  waveLeft: boolean;
  waveRight: boolean;
  [key: string]: boolean; // Allow any string key for extensibility
}

// Map key codes to our control names
const KEY_MAP = {
  'KeyW': 'forward',
  'ArrowUp': 'forward',
  'KeyS': 'backward',
  'ArrowDown': 'backward',
  'KeyA': 'leftward',
  'ArrowLeft': 'leftward',
  'KeyD': 'rightward',
  'ArrowRight': 'rightward',
  'KeyE': 'interact',
  'Space': 'interact',
  'KeyZ': 'dance',
  'KeyQ': 'waveLeft',
  'KeyR': 'waveRight',
};

/**
 * Custom hook for keyboard controls
 * This provides a simpler, more direct approach to keyboard handling
 * than the Three.js keyboard controls
 */
export function useKeyboard() {
  // Initialize all keys as not pressed
  const [keys, setKeys] = useState<KeyboardState>({
    forward: false,
    backward: false,
    leftward: false,
    rightward: false,
    interact: false,
    dance: false,
    waveLeft: false,
    waveRight: false,
  });

  // Handle key down event
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.code as keyof typeof KEY_MAP;
    
    // Check if this key is in our map
    if (KEY_MAP[key]) {
      const controlName = KEY_MAP[key];
      
      // Only update if state is changing to avoid unnecessary renders
      if (!keys[controlName]) {
        console.log(`KEY DOWN: ${key} (${controlName})`);
        setKeys(prev => ({ ...prev, [controlName]: true }));
      }
    }
  }, [keys]);

  // Handle key up event
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.code as keyof typeof KEY_MAP;
    
    // Check if this key is in our map
    if (KEY_MAP[key]) {
      const controlName = KEY_MAP[key];
      
      // Only update if state is changing
      if (keys[controlName]) {
        console.log(`KEY UP: ${key} (${controlName})`);
        setKeys(prev => ({ ...prev, [controlName]: false }));
      }
    }
  }, [keys]);

  // Add and remove event listeners
  useEffect(() => {
    console.log('KEYBOARD: Setting up keyboard event listeners');
    
    // Add event listeners to window
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Clean up
    return () => {
      console.log('KEYBOARD: Removing keyboard event listeners');
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return keys;
}