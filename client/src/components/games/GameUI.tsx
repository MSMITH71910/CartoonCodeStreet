import { useInteraction } from "@/lib/stores/useInteraction";
import { useAudio } from "@/lib/stores/useAudio";
import TicTacToe from "./TicTacToe";
import Hangman from "./Hangman";
import Checkers from "./Checkers";
import { useEffect } from "react";

const GameUI = () => {
  const { interactionType, showGameUI, toggleGameUI, endInteraction } = useInteraction();
  const { playActivityMusic, stopActivityMusic } = useAudio();
  
  // Handle closing the game properly with audio restoration
  const handleClose = () => {
    console.log("MUSIC: Closing game UI and restoring background music");
    toggleGameUI(); // Close UI first
    
    // Return to background music
    stopActivityMusic();
    
    // End interaction after audio is handled
    endInteraction();
  };
  
  // Add effect to ensure mini-game music plays when UI opens
  useEffect(() => {
    // Only play music once when first mounting or when gameUI becomes visible
    if (showGameUI && interactionType) {
      // Skip music playback in the effect to avoid infinite loops
      console.log("MUSIC: GameUI detected show event, mini-game music handled by interaction");
    }
    
    // Add escape key handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showGameUI) {
        handleClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showGameUI, interactionType, playActivityMusic, handleClose]);
  
  if (!showGameUI) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {interactionType === "ticTacToe" && "Tic-Tac-Toe"}
            {interactionType === "hangman" && "Hangman"}
            {interactionType === "checkers" && "Checkers"}
          </h2>
          <button 
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="my-4">
          {interactionType === "ticTacToe" && <TicTacToe />}
          {interactionType === "hangman" && <Hangman />}
          {interactionType === "checkers" && <Checkers />}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-300 text-sm text-gray-600">
          <p className="mb-2">Game Controls:</p>
          <p>• Tic-Tac-Toe: Click to place your mark. You play as X against computer's O.</p>
          <p>• Hangman: Click letters to guess the word.</p>
          <p>• Checkers: Click your piece then click where to move it.</p>
          <p className="mt-2">Press ESC or the X button to close this window and return to the street.</p>
        </div>
      </div>
    </div>
  );
};

export default GameUI;