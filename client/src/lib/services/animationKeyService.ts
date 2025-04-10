import { useAnimation } from '../stores/useAnimation';

// This service handles all animation key events in a central location
// to ensure they're properly captured and processed regardless of focus

class AnimationKeyService {
  // Track key states internally
  private keyStates = {
    Z: false, // For dancing
    Q: false, // For waving left arm
    R: false, // For waving right arm
  };

  // Initialize the service with event listeners
  initialize() {
    console.log("Animation Key Service: Initializing");
    
    // Set up document-level event listeners
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    
    // Setup polling for state sync (belt and suspenders approach)
    this.startPolling();
    
    // Return a cleanup function
    return () => {
      console.log("Animation Key Service: Cleaning up");
      document.removeEventListener('keydown', this.handleKeyDown);
      document.removeEventListener('keyup', this.handleKeyUp);
      this.stopPolling();
    };
  }
  
  // Handler for keydown events
  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return; // Ignore key repeat events
    
    if (e.code === 'KeyZ') {
      console.log("Animation Key Service: Z key down");
      this.keyStates.Z = true;
      useAnimation.getState().setDancing(true);
    }
    else if (e.code === 'KeyQ') {
      console.log("Animation Key Service: Q key down");
      this.keyStates.Q = true;
      useAnimation.getState().setWavingLeft(true);
    }
    else if (e.code === 'KeyR') {
      console.log("Animation Key Service: R key down");
      this.keyStates.R = true;
      useAnimation.getState().setWavingRight(true);
    }
  };
  
  // Handler for keyup events
  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'KeyZ') {
      console.log("Animation Key Service: Z key up");
      this.keyStates.Z = false;
      useAnimation.getState().setDancing(false);
    }
    else if (e.code === 'KeyQ') {
      console.log("Animation Key Service: Q key up");
      this.keyStates.Q = false;
      useAnimation.getState().setWavingLeft(false);
    }
    else if (e.code === 'KeyR') {
      console.log("Animation Key Service: R key up");
      this.keyStates.R = false;
      useAnimation.getState().setWavingRight(false);
    }
  };
  
  // Polling interval ID
  private pollingInterval: number | null = null;
  
  // Start polling to ensure state consistency
  private startPolling() {
    this.pollingInterval = window.setInterval(() => {
      const { isDancing, isWavingLeft, isWavingRight } = useAnimation.getState();
      
      // Sync Zustand state with key states
      if (this.keyStates.Z && !isDancing) {
        useAnimation.getState().setDancing(true);
      } else if (!this.keyStates.Z && isDancing) {
        useAnimation.getState().setDancing(false);
      }
      
      if (this.keyStates.Q && !isWavingLeft) {
        useAnimation.getState().setWavingLeft(true);
      } else if (!this.keyStates.Q && isWavingLeft) {
        useAnimation.getState().setWavingLeft(false);
      }
      
      if (this.keyStates.R && !isWavingRight) {
        useAnimation.getState().setWavingRight(true);
      } else if (!this.keyStates.R && isWavingRight) {
        useAnimation.getState().setWavingRight(false);
      }
    }, 100); // Check every 100ms
  }
  
  // Stop polling
  private stopPolling() {
    if (this.pollingInterval !== null) {
      window.clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}

// Create singleton instance
export const animationKeyService = new AnimationKeyService();