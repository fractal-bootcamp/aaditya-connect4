import React, { useState } from 'react';
import StartPage from './StartPage';
import GamePage from './GamePage';

const App = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [board, setBoard] = useState<(string | null)[][]>(
    Array.from({ length: 6 }, () => Array(7).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<'Red' | 'Blue'>('Red');
  const [winner, setWinner] = useState<string | null>(null);

  const handleMove = (col: number) => {
    if (winner) return; // Prevent further moves if there is a winner

    const newBoard = [...board];

    // Find the lowest available row in the selected column
    for (let row = 5; row >= 0; row--) {
      if (newBoard[row][col] === null) {
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);

        // Check if there's a winner after placing the chip
        if (checkWinner(newBoard, row, col)) {
          setWinner(currentPlayer === 'Red' ? player1 : player2); // Assign winner name
        } else {
          setCurrentPlayer(currentPlayer === 'Red' ? 'Blue' : 'Red'); // Switch players
        }
        break;
      }
    }
  };

  const checkWinner = (board: (string | null)[][], row: number, col: number): boolean => {
    const directions = [
      { rowDir: 0, colDir: 1 },  // Horizontal
      { rowDir: 1, colDir: 0 },  // Vertical
      { rowDir: 1, colDir: 1 },  // Diagonal down-right
      { rowDir: 1, colDir: -1 }  // Diagonal down-left
    ];

    const currentColor = board[row][col];

    for (const { rowDir, colDir } of directions) {
      let count = 1;

      // Check in one direction
      for (let i = 1; i < 4; i++) {
        const newRow = row + i * rowDir;
        const newCol = col + i * colDir;
        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 && board[newRow][newCol] === currentColor) {
          count++;
        } else {
          break;
        }
      }

      // Check in the opposite direction
      for (let i = 1; i < 4; i++) {
        const newRow = row - i * rowDir;
        const newCol = col - i * colDir;
        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 && board[newRow][newCol] === currentColor) {
          count++;
        } else {
          break;
        }
      }

      // If count reaches 4, we have a winner
      if (count >= 4) {
        return true;
      }
    }
    return false;
  };

  const handleStartGame = (p1: string, p2: string) => {
    setPlayer1(p1);
    setPlayer2(p2);
    setIsGameStarted(true); // Start the game
  };

  const handleReset = () => {
    setBoard(Array.from({ length: 6 }, () => Array(7).fill(null)));
    setWinner(null);
    setCurrentPlayer('Red');
  };

  return (
    <div>
      {!isGameStarted ? (
        <StartPage onStart={handleStartGame} />
      ) : (
        <GamePage
          board={board}
          currentPlayer={currentPlayer}
          winner={winner}
          onMove={handleMove}
          onReset={handleReset}
          player1={player1}
          player2={player2}
        />
      )}
    </div>
  );
};

export default App;
