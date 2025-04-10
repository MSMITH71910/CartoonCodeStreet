import { useInteraction } from "@/lib/stores/useInteraction";
import { useAudio } from "@/lib/stores/useAudio";
import TicTacToe from "./TicTacToe";
import Hangman from "./Hangman";
import Checkers from "./Checkers";
import { useEffect } from "react";

const GameUI = () => {
  const { interactionType, showGameUI, toggleGameUI, endInteraction } = useInteraction();
  
  // Define the close game handler BEFORE the useEffect
  const handleCloseGame = () => {
    console.log("GAME UI: Game closed, restoring background music");
    
    // First close the game UI
    toggleGameUI();
    
    // Then end the interaction to restore background music
    endInteraction();
    
    // For extra safety, directly trigger background music
    const audioStore = useAudio.getState();
    if (audioStore.backgroundMusic && !audioStore.isMuted && !audioStore.isMusicMuted) {
      audioStore.backgroundMusic.currentTime = 0;
      audioStore.backgroundMusic.volume = 0.3;
      audioStore.backgroundMusic.play().catch(e => 
        console.error("AUDIO ERROR: Failed to restore background music:", e)
      );
    }
  };
  
  // CRITICAL: Handle audio directly in the GameUI component
  useEffect(() => {
    // When the game UI appears, play chess music
    if (showGameUI) {
      console.log("GAME UI: Game opened, playing chess music directly");
      const audioStore = useAudio.getState();
      
      if (!audioStore.isMuted && !audioStore.isMusicMuted) {
        // Stop any currently playing music
        if (audioStore.currentActivityMusic) {
          audioStore.currentActivityMusic.pause();
          audioStore.currentActivityMusic.currentTime = 0;
        }
        
        if (audioStore.backgroundMusic) {
          audioStore.backgroundMusic.pause();
        }
        
        // Play chess music specifically for mini-games
        if (audioStore.chessMusicOrSimilar) {
          audioStore.chessMusicOrSimilar.currentTime = 0;
          audioStore.chessMusicOrSimilar.volume = 0.5;
          
          // Set as current music
          useAudio.setState({ 
            currentActivityMusic: audioStore.chessMusicOrSimilar,
            currentTrack: "chess"
          });
          
          // Start playing
          audioStore.chessMusicOrSimilar.play()
            .catch(e => console.error("AUDIO ERROR: Failed to play chess music in GameUI:", e));
        }
      }
      
      // Add keyboard handling for ESC key to close game properly
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          console.log("GAME UI: ESC key pressed, closing game and restoring audio");
          handleCloseGame();
        }
      };
      
      // Add event listener
      window.addEventListener('keydown', handleKeyDown);
      
      // Cleanup function
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showGameUI, endInteraction, toggleGameUI]);
  
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
            onClick={handleCloseGame}
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