import { useInteraction } from "@/lib/stores/useInteraction";
import { useAudio } from "@/lib/stores/useAudio";
import TicTacToe from "./TicTacToe";
import Hangman from "./Hangman";
import Checkers from "./Checkers";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";

const GameUI = () => {
  const { interactionType, showGameUI, toggleGameUI, endInteraction } = useInteraction();
  const { playActivityMusic, stopActivityMusic } = useAudio();
  const isMobile = useIsMobile();
  
  // Handle closing the game properly with audio restoration
  const handleClose = () => {
    console.log("MUSIC: Closing game UI and restoring background music");
    toggleGameUI(); // Close UI first
    
    // Return to background music 
    stopActivityMusic();
    
    // End interaction after audio is handled
    endInteraction();
  };
  
  // Add effect to handle escape key only, music is handled by interaction store
  useEffect(() => {
    // We're not playing music here anymore - that's handled by the interaction store
    
    // Add escape key handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showGameUI) {
        handleClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showGameUI, handleClose]);
  
  if (!showGameUI) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`bg-white rounded-lg shadow-lg ${isMobile ? 'p-4 m-2' : 'p-6 m-4'} ${isMobile ? 'max-w-sm w-full' : 'max-w-2xl w-full'} max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>
            {interactionType === "ticTacToe" && "Tic-Tac-Toe"}
            {interactionType === "hangman" && "Hangman"}
            {interactionType === "checkers" && "Checkers"}
          </h2>
          <button 
            onClick={handleClose}
            className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-full hover:bg-gray-200`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="my-4">
          {interactionType === "ticTacToe" && <TicTacToe />}
          {interactionType === "hangman" && <Hangman />}
          {interactionType === "checkers" && <Checkers />}
        </div>
        
        <div className={`mt-6 pt-4 border-t border-gray-300 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
          <p className="mb-2 font-semibold">Game Controls:</p>
          <p>• Tic-Tac-Toe: {isMobile ? 'Tap' : 'Click'} to place your mark. You play as X against computer's O.</p>
          <p>• Hangman: {isMobile ? 'Tap' : 'Click'} letters to guess the word.</p>
          <p>• Checkers: {isMobile ? 'Tap' : 'Click'} your piece then {isMobile ? 'tap' : 'click'} where to move it.</p>
          <p className="mt-2">{isMobile ? 'Tap the X button' : 'Press ESC or click the X button'} to close this window and return to the street.</p>
        </div>
      </div>
    </div>
  );
};

export default GameUI;