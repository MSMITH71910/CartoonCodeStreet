import { create } from 'zustand';

// Simplified animation state with direct key references for maximum compatibility
interface AnimationState {
  // Animation flags
  isDancing: boolean;
  isWavingLeft: boolean;
  isWavingRight: boolean;
  
  // Time tracking
  animationTime: number;
  
  // Control functions
  setDancing: (dancing: boolean) => void;
  setWavingLeft: (waving: boolean) => void;
  setWavingRight: (waving: boolean) => void;
  updateAnimationTime: (delta: number) => void;
  reset: () => void;
}

// Create store with initial state
export const useAnimation = create<AnimationState>((set) => ({
  // Initial animation states - all false
  isDancing: false,
  isWavingLeft: false,
  isWavingRight: false,
  animationTime: 0,
  
  // Action setters
  setDancing: (dancing: boolean) => set({ 
    isDancing: dancing,
    // Can't do multiple animations at once
    isWavingLeft: false,
    isWavingRight: false 
  }),
  
  setWavingLeft: (waving: boolean) => set({ 
    isWavingLeft: waving,
    // Can't do multiple animations at once
    isDancing: false,
    isWavingRight: false 
  }),
  
  setWavingRight: (waving: boolean) => set({ 
    isWavingRight: waving,
    // Can't do multiple animations at once
    isDancing: false,
    isWavingLeft: false 
  }),
  
  // Update animation time for animation progress
  updateAnimationTime: (delta: number) => set((state) => ({ 
    animationTime: state.animationTime + delta * 5 
  })),
  
  // Reset all animations
  reset: () => set({ 
    isDancing: false, 
    isWavingLeft: false, 
    isWavingRight: false 
  }),
}));