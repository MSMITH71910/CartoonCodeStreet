import { useState, useEffect, useRef } from 'react';

// Define the types of animations available
export type AnimationType = 'none' | 'dance' | 'waveLeft' | 'waveRight';

// Interface for the animation control hook
interface AnimationControl {
  animationType: AnimationType;
  animationTime: number;
  isAnimating: boolean;
  startAnimation: (type: AnimationType) => void;
  stopAnimation: () => void;
  updateAnimation: (deltaTime: number) => void;
}

/**
 * Custom hook to manage character animations
 * This provides a central place to manage animation state and timing
 * @param duration The duration of animations in milliseconds
 */
export function useAnimations(duration: number = 3000): AnimationControl {
  // Animation state
  const [animationType, setAnimationType] = useState<AnimationType>('none');
  const [animationTime, setAnimationTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Timer reference for animations
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Start a new animation
  const startAnimation = (type: AnimationType) => {
    // Log the animation start
    console.log(`ANIMATION: Starting ${type} animation`);
    
    // Clear any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Set the new animation state
    setAnimationType(type);
    setAnimationTime(0);
    setIsAnimating(true);
    
    // Set a timer to end the animation after the specified duration
    timerRef.current = setTimeout(() => {
      console.log(`ANIMATION: Completed ${type} animation (timed out)`);
      stopAnimation();
    }, duration);
  };
  
  // Stop the current animation
  const stopAnimation = () => {
    if (isAnimating) {
      console.log(`ANIMATION: Stopping ${animationType} animation`);
      
      // Clear any timers
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      // Reset animation state
      setAnimationType('none');
      setIsAnimating(false);
    }
  };
  
  // Update animation time (called from animation frame)
  const updateAnimation = (deltaTime: number) => {
    if (isAnimating) {
      setAnimationTime(prev => prev + deltaTime * 8); // 8x speed multiplier
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  return {
    animationType,
    animationTime,
    isAnimating,
    startAnimation,
    stopAnimation,
    updateAnimation
  };
}