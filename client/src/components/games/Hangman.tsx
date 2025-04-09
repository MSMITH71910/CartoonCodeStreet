import { useInteraction } from "@/lib/stores/useInteraction";
import { useEffect } from "react";

const Hangman = () => {
  const { gameState, updateGameState } = useInteraction();
  
  if (!gameState.hangman) return null;
  
  const { word, guessed, attempts, maxAttempts } = gameState.hangman;
  
  const handleGuess = (letter: string) => {
    // Ignore if already guessed
    if (guessed.includes(letter)) return;
    
    // Add to guessed letters
    const newGuessed = [...guessed, letter];
    
    // Increment attempts if wrong guess
    const newAttempts = word.includes(letter) ? attempts : attempts + 1;
    
    // Update game state
    updateGameState({
      hangman: {
        ...gameState.hangman,
        guessed: newGuessed,
        attempts: newAttempts
      }
    });
  };
  
  // Ensure word and maxAttempts are always defined to satisfy type checking
  useEffect(() => {
    // Initialize the game if it hasn't been already
    if (!gameState.hangman?.word) {
      resetGame();
    }
  }, []);
  
  const resetGame = () => {
    const words = ["JAVASCRIPT", "REACT", "THREE", "PORTFOLIO", "DEVELOPER"];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    updateGameState({
      hangman: {
        word: randomWord,
        guessed: [],
        attempts: 0,
        maxAttempts: 6
      }
    });
  };
  
  // Display the word with guessed letters revealed and others as underscores
  const displayWord = word.split('').map(letter => 
    guessed.includes(letter) ? letter : "_"
  ).join(' ');
  
  // Check if player has won
  const hasWon = word.split('').every(letter => guessed.includes(letter));
  
  // Check if player has lost
  const hasLost = attempts >= maxAttempts;
  
  // Game over
  const isGameOver = hasWon || hasLost;
  
  // Alphabet for guessing
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold mb-2">Hangman</h2>
      
      <div className="mb-4">
        <p className="text-center text-xl font-mono tracking-widest my-4">{displayWord}</p>
        
        <div className="text-center mb-4">
          <p>Attempts: {attempts}/{maxAttempts}</p>
          <div className="w-48 h-4 bg-gray-200 rounded-full mt-2 mx-auto">
            <div 
              className={`h-full rounded-full ${hasLost ? 'bg-red-500' : 'bg-green-500'}`} 
              style={{ width: `${(attempts / maxAttempts) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {isGameOver ? (
        <div className="text-center mb-4">
          {hasWon ? (
            <p className="text-green-600 font-bold text-xl">You won!</p>
          ) : (
            <div>
              <p className="text-red-600 font-bold text-xl">Game Over!</p>
              <p>The word was: {word}</p>
            </div>
          )}
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={resetGame}
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 justify-center max-w-md">
          {alphabet.map(letter => (
            <button
              key={letter}
              className={`w-10 h-10 text-lg font-semibold flex items-center justify-center rounded
                ${guessed.includes(letter) 
                  ? word.includes(letter) 
                    ? 'bg-green-200 text-green-800' 
                    : 'bg-red-200 text-red-800'
                  : 'bg-gray-100 hover:bg-gray-200'
                }`}
              onClick={() => handleGuess(letter)}
              disabled={guessed.includes(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hangman;