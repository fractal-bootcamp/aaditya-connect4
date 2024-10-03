import { useState } from "react";

const ROWS = 6;
const COLS = 7;
const EMPTY = null;

export const createEmptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));

export const useGameState = () => {
  const [board, setBoard] = useState<(string | null)[][]>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<"Red" | "Yellow">("Red");
  const [winner, setWinner] = useState<string | null>(null);

  const checkWinner = (newBoard: (string | null)[][], row: number, col: number): boolean => {
    const player = newBoard[row][col];
    if (!player) return false;
  
    // Helper function to count discs in a direction
    const countDiscs = (rowDir: number, colDir: number) => {
      let count = 0;
      let r = row;
      let c = col;
  
      // Traverse in the positive direction
      while (r >= 0 && r < newBoard.length && c >= 0 && c < newBoard[0].length && newBoard[r][c] === player) {
        count++;
        r += rowDir;
        c += colDir;
      }
  
      return count;
    };
  
    // Check horizontal (left-right)
    const horizontalCount = countDiscs(0, 1) + countDiscs(0, -1) - 1;
    if (horizontalCount >= 4) return true;
  
    // Check vertical (top-bottom)
    const verticalCount = countDiscs(1, 0) + countDiscs(-1, 0) - 1;
    if (verticalCount >= 4) return true;
  
    // Check diagonal (top-left to bottom-right)
    const diagonal1Count = countDiscs(1, 1) + countDiscs(-1, -1) - 1;
    if (diagonal1Count >= 4) return true;
  
    // Check diagonal (top-right to bottom-left)
    const diagonal2Count = countDiscs(1, -1) + countDiscs(-1, 1) - 1;
    if (diagonal2Count >= 4) return true;
  
    // No winner found
    return false;
  };
  

  const handleMove = (col: number) => {
    if (winner) return;

    const newBoard = board.map((row) => [...row]);

    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row][col] === EMPTY) {
        newBoard[row][col] = currentPlayer;
        if (checkWinner(newBoard, row, col)) {
          setWinner(currentPlayer);
        } else {
          setCurrentPlayer(currentPlayer === "Red" ? "Yellow" : "Red");
        }
        setBoard(newBoard);
        break;
      }
    }
    return newBoard;
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer("Red");
    setWinner(null);
  };

  const initializeGameState = (board: (string | null)[][], currentPlayer: string) => {
    setBoard(board);
    setCurrentPlayer(currentPlayer as "Red" | "Yellow");
  };

  return { board, currentPlayer, winner, handleMove, resetGame, initializeGameState };
};
