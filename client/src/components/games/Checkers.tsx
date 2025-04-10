import { useInteraction } from "@/lib/stores/useInteraction";
import { useEffect } from "react";

const Checkers = () => {
  const { gameState, updateGameState } = useInteraction();
  
  // Initialize the checkers game if it doesn't exist yet
  useEffect(() => {
    if (!gameState.checkers) {
      resetGame();
    }
  }, []);
  
  if (!gameState.checkers) return null;
  
  const { board, currentPlayer, selectedPiece, winner } = gameState.checkers;
  
  const handleCellClick = (row: number, col: number) => {
    // If winner is declared or it's not player's turn, ignore clicks
    if (winner || currentPlayer !== 1) return;
    
    // If a piece is already selected
    if (selectedPiece) {
      const [selectedRow, selectedCol] = selectedPiece;
      
      // If clicking on the same piece, deselect it
      if (selectedRow === row && selectedCol === col) {
        updateGameState({
          checkers: {
            board: [...board],
            currentPlayer,
            selectedPiece: null,
            winner
          }
        });
        return;
      }
      
      // Check if the move is valid
      if (isValidMove(selectedRow, selectedCol, row, col)) {
        // Create new board with the move
        const newBoard = board.map(row => [...row]);
        
        // Move the piece
        newBoard[row][col] = newBoard[selectedRow][selectedCol];
        newBoard[selectedRow][selectedCol] = 0;
        
        // Check if this was a capture move
        if (Math.abs(row - selectedRow) === 2) {
          // Remove the captured piece
          const capturedRow = (row + selectedRow) / 2;
          const capturedCol = (col + selectedCol) / 2;
          newBoard[capturedRow][capturedCol] = 0;
        }
        
        // Switch player
        const nextPlayer = currentPlayer === 1 ? 2 : 1;
        
        // Update the game state
        updateGameState({
          checkers: {
            board: newBoard,
            currentPlayer: nextPlayer,
            selectedPiece: null,
            winner: null
          }
        });
        
        // If computer's turn, make a move after a short delay
        if (nextPlayer === 2) {
          setTimeout(() => {
            makeComputerMove(newBoard);
          }, 500);
        }
      }
    } 
    // If no piece is selected and the clicked cell has the current player's piece
    else if (board[row][col] === currentPlayer) {
      updateGameState({
        checkers: {
          board: [...board],
          currentPlayer,
          selectedPiece: [row, col],
          winner
        }
      });
    }
  };
  
  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    // Check if destination is empty
    if (board[toRow][toCol] !== 0) return false;
    
    const piece = board[fromRow][fromCol];
    
    // Regular move (1 diagonal step)
    if (Math.abs(toCol - fromCol) === 1) {
      // Player 1 (bottom) can only move up
      if (piece === 1 && fromRow - toRow === 1) return true;
      
      // Player 2 (top) can only move down
      if (piece === 2 && toRow - fromRow === 1) return true;
      
      return false;
    }
    
    // Capture move (2 diagonal steps)
    if (Math.abs(toCol - fromCol) === 2 && Math.abs(toRow - fromRow) === 2) {
      // Calculate position of jumped piece
      const jumpedRow = (fromRow + toRow) / 2;
      const jumpedCol = (fromCol + toCol) / 2;
      
      // Check if there's an opponent's piece to capture
      const jumpedPiece = board[jumpedRow][jumpedCol];
      
      if (piece === 1 && jumpedPiece === 2) return true;
      if (piece === 2 && jumpedPiece === 1) return true;
    }
    
    return false;
  };
  
  const makeComputerMove = (currentBoard: number[][]) => {
    // Find all pieces of player 2
    const pieces: [number, number][] = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (currentBoard[row][col] === 2) {
          pieces.push([row, col]);
        }
      }
    }
    
    // Check for possible captures first
    for (const [row, col] of pieces) {
      // Check all four capture directions
      const directions = [
        [2, 2],   // down-right
        [2, -2],  // down-left
        [-2, 2],  // up-right
        [-2, -2]  // up-left
      ];
      
      for (const [rowDiff, colDiff] of directions) {
        const newRow = row + rowDiff;
        const newCol = col + colDiff;
        
        // Check if move is within bounds
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          if (isValidMove(row, col, newRow, newCol)) {
            // Found a capture move
            const jumpedRow = (row + newRow) / 2;
            const jumpedCol = (col + newCol) / 2;
            
            // Make the move
            const newBoard = currentBoard.map(r => [...r]);
            newBoard[newRow][newCol] = 2;
            newBoard[row][col] = 0;
            newBoard[jumpedRow][jumpedCol] = 0;
            
            // Update game state
            updateGameState({
              checkers: {
                board: newBoard,
                currentPlayer: 1,
                selectedPiece: null,
                winner: null
              }
            });
            
            return;
          }
        }
      }
    }
    
    // If no captures, make a regular move
    for (const [row, col] of pieces) {
      // Check possible regular moves
      const directions = [
        [1, 1],   // down-right
        [1, -1]   // down-left
      ];
      
      for (const [rowDiff, colDiff] of directions) {
        const newRow = row + rowDiff;
        const newCol = col + colDiff;
        
        // Check if move is within bounds
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          if (isValidMove(row, col, newRow, newCol)) {
            // Make the move
            const newBoard = currentBoard.map(r => [...r]);
            newBoard[newRow][newCol] = 2;
            newBoard[row][col] = 0;
            
            // Update game state
            updateGameState({
              checkers: {
                board: newBoard,
                currentPlayer: 1,
                selectedPiece: null,
                winner: null
              }
            });
            
            return;
          }
        }
      }
    }
    
    // If no valid moves were found, player 1 wins - update the game state
    updateGameState({
      checkers: {
        board: [...board],
        currentPlayer: 1,
        selectedPiece: null,
        winner: "player" // Add winner state
      }
    });
  };
  
  const resetGame = () => {
    // Initialize checkers board (0 = empty, 1 = player 1, 2 = player 2)
    const newBoard = Array(8).fill(0).map(() => Array(8).fill(0));
    
    // Set up pieces
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          newBoard[row][col] = 2; // Player 2 pieces at top
        }
      }
    }
    
    for (let row = 5; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          newBoard[row][col] = 1; // Player 1 pieces at bottom
        }
      }
    }
    
    updateGameState({
      checkers: {
        board: newBoard,
        currentPlayer: 1,
        selectedPiece: null,
        winner: null
      }
    });
    
    // No sound effect - removed to avoid clicking sound
  };
  
  const renderCell = (row: number, col: number) => {
    const piece = board[row][col];
    const isSelected = selectedPiece && selectedPiece[0] === row && selectedPiece[1] === col;
    
    // Determine cell color based on position
    const cellColor = (row + col) % 2 === 0 ? 'bg-gray-200' : 'bg-gray-600';
    
    return (
      <div 
        className={`w-10 h-10 flex items-center justify-center ${cellColor} 
          ${isSelected ? 'ring-2 ring-yellow-400' : ''}`}
        onClick={() => handleCellClick(row, col)}
      >
        {piece === 1 && (
          <div className="w-8 h-8 rounded-full bg-red-500 shadow-md"></div>
        )}
        {piece === 2 && (
          <div className="w-8 h-8 rounded-full bg-black shadow-md"></div>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold mb-2">Checkers</h2>
      
      <div className="mb-4">
        {winner ? (
          <p className="text-lg font-bold text-green-600">You won! Computer has no valid moves.</p>
        ) : (
          <p className="text-lg">
            {currentPlayer === 1 ? 
              <span>Your turn (Red)</span> : 
              <span>Computer's turn (Black)</span>
            }
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-8 gap-0 border border-gray-800">
        {board.map((row, rowIndex) => (
          row.map((_, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`}>
              {renderCell(rowIndex, colIndex)}
            </div>
          ))
        ))}
      </div>
      
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={resetGame}
      >
        Reset Game
      </button>
    </div>
  );
};

export default Checkers;