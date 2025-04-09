import { useInteraction } from "@/lib/stores/useInteraction";

const TicTacToe = () => {
  const { gameState, updateGameState } = useInteraction();
  
  if (!gameState.ticTacToe) return null;
  
  const { board, currentPlayer, winner } = gameState.ticTacToe;
  
  const handleCellClick = (index: number) => {
    // If cell is already filled or there's a winner, do nothing
    if (board[index] || winner) return;
    
    // Create a new board with the move
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    
    // Check for winner
    const newWinner = checkWinner(newBoard);
    
    // Switch player
    const nextPlayer = currentPlayer === "X" ? "O" : "X";
    
    // Update game state
    updateGameState({
      ticTacToe: {
        board: newBoard,
        currentPlayer: nextPlayer,
        winner: newWinner
      }
    });
    
    // If computer's turn (O), make a move after a short delay
    if (!newWinner && nextPlayer === "O") {
      setTimeout(() => {
        makeComputerMove(newBoard);
      }, 500);
    }
  };
  
  const makeComputerMove = (currentBoard: Array<string | null>) => {
    // If there's already a winner, don't make a move
    if (winner) return;
    
    // Find all empty cells
    const emptyCells = currentBoard
      .map((cell, index) => cell === null ? index : -1)
      .filter(index => index !== -1);
    
    if (emptyCells.length === 0) return;
    
    // Try to make a winning move
    let bestMove = findBestMove(currentBoard, emptyCells);
    
    // Make the move
    const newBoard = [...currentBoard];
    newBoard[bestMove] = "O";
    
    // Check for winner
    const newWinner = checkWinner(newBoard);
    
    // Update game state
    updateGameState({
      ticTacToe: {
        board: newBoard,
        currentPlayer: "X", // Back to player
        winner: newWinner
      }
    });
  };
  
  const findBestMove = (currentBoard: Array<string | null>, emptyCells: number[]): number => {
    // Simple AI: prioritize center, then corners, then edges
    
    // Try to win
    for (const cell of emptyCells) {
      const testBoard = [...currentBoard];
      testBoard[cell] = "O";
      if (checkWinner(testBoard) === "O") {
        return cell;
      }
    }
    
    // Block player from winning
    for (const cell of emptyCells) {
      const testBoard = [...currentBoard];
      testBoard[cell] = "X";
      if (checkWinner(testBoard) === "X") {
        return cell;
      }
    }
    
    // Take center if available
    if (emptyCells.includes(4)) {
      return 4;
    }
    
    // Take corners
    const corners = [0, 2, 6, 8].filter(corner => emptyCells.includes(corner));
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }
    
    // Take any available edge
    const edges = [1, 3, 5, 7].filter(edge => emptyCells.includes(edge));
    if (edges.length > 0) {
      return edges[Math.floor(Math.random() * edges.length)];
    }
    
    // Fallback: take any random empty cell
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };
  
  const checkWinner = (currentBoard: Array<string | null>): string | null => {
    // Winning combinations: rows, columns, diagonals
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const [a, b, c] of lines) {
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a] as string;
      }
    }
    
    // Check for a draw (all cells filled)
    if (!currentBoard.includes(null)) {
      return "draw";
    }
    
    return null;
  };
  
  const resetGame = () => {
    updateGameState({
      ticTacToe: {
        board: Array(9).fill(null),
        currentPlayer: "X",
        winner: null
      }
    });
  };
  
  const renderCell = (index: number) => {
    const value = board[index];
    return (
      <button
        key={index}
        className={`w-20 h-20 text-4xl font-bold flex items-center justify-center 
          ${value ? "cursor-default" : "cursor-pointer hover:bg-gray-100"}`}
        onClick={() => handleCellClick(index)}
        disabled={!!value || !!winner}
      >
        {value === "X" && <span className="text-blue-600">X</span>}
        {value === "O" && <span className="text-red-600">O</span>}
      </button>
    );
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold mb-2">Tic-Tac-Toe</h2>
      
      {winner ? (
        <div className="mb-4 text-xl">
          {winner === "draw" ? (
            <p>It's a draw!</p>
          ) : (
            <p>{winner === "X" ? "You" : "Computer"} won!</p>
          )}
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-lg">Your turn: <span className="font-bold text-blue-600">X</span></p>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-1 bg-gray-300 border border-gray-400">
        {/* First row */}
        <div className="border-r border-b border-gray-400">{renderCell(0)}</div>
        <div className="border-r border-b border-gray-400">{renderCell(1)}</div>
        <div className="border-b border-gray-400">{renderCell(2)}</div>
        
        {/* Second row */}
        <div className="border-r border-b border-gray-400">{renderCell(3)}</div>
        <div className="border-r border-b border-gray-400">{renderCell(4)}</div>
        <div className="border-b border-gray-400">{renderCell(5)}</div>
        
        {/* Third row */}
        <div className="border-r border-gray-400">{renderCell(6)}</div>
        <div className="border-r border-gray-400">{renderCell(7)}</div>
        <div>{renderCell(8)}</div>
      </div>
      
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={resetGame}
      >
        New Game
      </button>
    </div>
  );
};

export default TicTacToe;