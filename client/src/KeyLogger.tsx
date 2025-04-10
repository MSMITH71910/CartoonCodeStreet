import { useEffect } from 'react';

// This component simply logs keystrokes to check what's happening
const KeyLogger = () => {
  useEffect(() => {
    const logKeyDown = (e: KeyboardEvent) => {
      console.log(`Key Down: ${e.code}`);
    };
    
    const logKeyUp = (e: KeyboardEvent) => {
      console.log(`Key Up: ${e.code}`);
    };
    
    window.addEventListener('keydown', logKeyDown);
    window.addEventListener('keyup', logKeyUp);
    
    return () => {
      window.removeEventListener('keydown', logKeyDown);
      window.removeEventListener('keyup', logKeyUp);
    };
  }, []);
  
  return null;
};

export default KeyLogger;