import React, { useState, useEffect } from 'react';
import StartPage from './StartPage';
import GamePage from './GamePage';

const App = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [gameMode, setGameMode] = useState<'1v1' | '1vComputer'>('1v1');
  const [board, setBoard] = useState<(string | null)[][]>(
    Array.from({ length: 6 }, () => Array(7).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<'Red' | 'Blue'>('Red');
  const [winner, setWinner] = useState<string | null>(null);
  const [oldGames, setOldGames] = useState<{ player1: string, player2: string, winner: string }[]>([]);

  useEffect(() => {
    // Load old games from localStorage when the app loads
    const storedGames = JSON.parse(localStorage.getItem('oldGames') || '[]');
    setOldGames(storedGames);
  }, []);

  const saveGameResult = (winner: string) => {
    const gameResult = { player1, player2, winner };
    const updatedOldGames = [...oldGames, gameResult];

    // Save to localStorage
    localStorage.setItem('oldGames', JSON.stringify(updatedOldGames));

    // Update state
    setOldGames(updatedOldGames);
  };

  const handleMove = (col: number) => {
    if (winner) return; // Prevent further moves if there is a winner

    const newBoard = [...board];

    // Find the lowest available row in the selected column
    for (let row = 5; row >= 0; row--) {
      if (newBoard[row][col] === null) {
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);

        // Check if there's a winner after placing the chip
        if (checkWinner(newBoard, row, col, currentPlayer)) {
          const winningPlayer = currentPlayer === 'Red' ? player1 : player2;
          setWinner(winningPlayer); // Assign winner name
          saveGameResult(winningPlayer); // Save the game result
        } else {
          if (gameMode === '1v1') {
            setCurrentPlayer(currentPlayer === 'Red' ? 'Blue' : 'Red'); // Switch players for 1v1 mode
          } else if (gameMode === '1vComputer' && currentPlayer === 'Red') {
            // After the user's move, let the AI make its move
            setTimeout(() => {
              const aiMove = getBestMove(newBoard);
              if (aiMove !== null) {
                makeAIMove(aiMove, newBoard);
              }
            }, 500); // Adding a delay for AI to "think"
          }
        }
        break;
      }
    }
  };

  // Function to check if there is a winner
  const checkWinner = (board: (string | null)[][], row: number, col: number, player: string): boolean => {
    // Helper to check a line of four cells
    const checkDirection = (direction: { rowDir: number, colDir: number }) => {
      let count = 0;
      for (let i = -3; i <= 3; i++) {
        const newRow = row + i * direction.rowDir;
        const newCol = col + i * direction.colDir;
        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 && board[newRow][newCol] === player) {
          count++;
          if (count === 4) return true;
        } else {
          count = 0;
        }
      }
      return false;
    };

    // Check horizontal, vertical, and two diagonals
    const directions = [
      { rowDir: 0, colDir: 1 },  // Horizontal
      { rowDir: 1, colDir: 0 },  // Vertical
      { rowDir: 1, colDir: 1 },  // Diagonal down-right
      { rowDir: 1, colDir: -1 }  // Diagonal down-left
    ];

    return directions.some(direction => checkDirection(direction));
  };

  // Function to determine the best move for the AI using Minimax
  const getBestMove = (board: (string | null)[][]): number | null => {
    const availableColumns = [];
    for (let col = 0; col < 7; col++) {
      if (board[0][col] === null) availableColumns.push(col);
    }

    let bestScore = -Infinity;
    let bestMove = null;

    availableColumns.forEach(col => {
      const newBoard = board.map(row => [...row]); // Create a deep copy of the board

      // Drop AI's piece in this column
      for (let row = 5; row >= 0; row--) {
        if (newBoard[row][col] === null) {
          newBoard[row][col] = 'Blue';
          break;
        }
      }

      // Evaluate the board using Minimax
      const score = minimax(newBoard, 4, false); // Depth of 4 for simplicity
      if (score > bestScore) {
        bestScore = score;
        bestMove = col;
      }
    });

    return bestMove;
  };

  // Minimax algorithm to evaluate the board
  const minimax = (board: (string | null)[][], depth: number, isMaximizing: boolean): number => {
    if (depth === 0) return 0; // Depth limit
    const winner = checkFullWinner(board); // Check for full game winner
    if (winner === 'Blue') return 10;
    if (winner === 'Red') return -10;
    if (isBoardFull(board)) return 0; // Tie

    const availableColumns = [];
    for (let col = 0; col < 7; col++) {
      if (board[0][col] === null) availableColumns.push(col);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const col of availableColumns) {
        const newBoard = board.map(row => [...row]);

        // Simulate dropping the Blue piece
        for (let row = 5; row >= 0; row--) {
          if (newBoard[row][col] === null) {
            newBoard[row][col] = 'Blue';
            break;
          }
        }

        const evalScore = minimax(newBoard, depth - 1, false);
        maxEval = Math.max(maxEval, evalScore);
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const col of availableColumns) {
        const newBoard = board.map(row => [...row]);

        // Simulate dropping the Red piece
        for (let row = 5; row >= 0; row--) {
          if (newBoard[row][col] === null) {
            newBoard[row][col] = 'Red';
            break;
          }
        }

        const evalScore = minimax(newBoard, depth - 1, true);
        minEval = Math.min(minEval, evalScore);
      }
      return minEval;
    }
  };

  // Helper function to check for a full game winner across the entire board
  const checkFullWinner = (board: (string | null)[][]): string | null => {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        if (board[row][col] !== null && checkWinner(board, row, col, board[row][col] as string)) {
          return board[row][col];
        }
      }
    }
    return null;
  };

  const isBoardFull = (board: (string | null)[][]): boolean => {
    return board[0].every(cell => cell !== null);
  };

  // Function to perform the AI's move
  const makeAIMove = (col: number, newBoard: (string | null)[][]) => {
    for (let row = 5; row >= 0; row--) {
      if (newBoard[row][col] === null) {
        newBoard[row][col] = 'Blue'; // AI is always Blue
        setBoard([...newBoard]);
        if (checkWinner(newBoard, row, col, 'Blue')) {
          setWinner('Computer'); // AI wins
          saveGameResult('Computer');
        }
        break;
      }
    }
    setCurrentPlayer('Red'); // Switch back to the user after AI's move
  };

  const handleStartGame = (p1: string, p2: string, mode: '1v1' | '1vComputer') => {
    setPlayer1(p1);
    setPlayer2(mode === '1vComputer' ? 'Computer' : p2);
    setGameMode(mode);
    setIsGameStarted(true); // Start the game
  };

  const handleReset = () => {
    setBoard(Array.from({ length: 6 }, () => Array(7).fill(null)));
    setWinner(null);
    setCurrentPlayer('Red');
  };

  const handleBackToStart = () => {
    setIsGameStarted(false); // Go back to start page
    handleReset(); // Reset the game state
  };

  return (
    <div>
      {!isGameStarted ? (
        <StartPage onStart={handleStartGame} oldGames={oldGames} />
      ) : (
        <GamePage
          board={board}
          currentPlayer={currentPlayer}
          winner={winner}
          onMove={handleMove}
          onReset={handleReset}
          onBackToStart={handleBackToStart}
          player1={player1}
          player2={player2}
        />
      )}
    </div>
  );
};

export default App;
