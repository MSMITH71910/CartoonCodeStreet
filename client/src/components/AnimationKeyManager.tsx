import { useEffect } from 'react';
import { animationKeyService } from '../lib/services/animationKeyService';

/**
 * Animation Key Manager Component
 * This is a manager component that sets up global animation key listeners
 * and doesn't render anything visually.
 */
export const AnimationKeyManager: React.FC = () => {
  // Set up animation key listeners
  useEffect(() => {
    console.log('Animation Key Manager: Setting up animation key service');
    
    // Initialize the service and get the cleanup function
    const cleanup = animationKeyService.initialize();
    
    // Return the cleanup function for useEffect
    return cleanup;
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default AnimationKeyManager;