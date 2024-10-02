import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import WinLose from './WinLose';

const ROWS = 6;
const COLS = 7;
const EMPTY = null;

const createEmptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));

const GamePage = ({ player1, player2, mode, onBackToStart }: { player1: string, player2: string, mode: string, onBackToStart: () => void }) => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<'Red' | 'Yellow'>('Red');
  const [winner, setWinner] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ row: number; col: number } | null>(null); 

  const dropDisc = (col: number) => {
    if (winner) return;
    const newBoard = board.map(row => [...row]);
    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row][col] === EMPTY) {
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        setLastMove({ row, col });
        checkWinner(newBoard, row, col);
        setCurrentPlayer(currentPlayer === 'Red' ? 'Yellow' : 'Red');
        return;
      }
    }
  };

  const checkWinner = (newBoard: string[][], row: number, col: number) => {
    const player = newBoard[row][col];
    if (checkDirection(newBoard, row, col, player, 1, 0) || 
        checkDirection(newBoard, row, col, player, 0, 1) || 
        checkDirection(newBoard, row, col, player, 1, 1) || 
        checkDirection(newBoard, row, col, player, 1, -1)) {
      setWinner(player);
    }
  };

  const checkDirection = (board: string[][], row: number, col: number, player: string, rowDir: number, colDir: number) => {
    let count = 0;
    for (let i = -3; i <= 3; i++) {
      const r = row + i * rowDir;
      const c = col + i * colDir;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }
    return false;
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setWinner(null);
    setCurrentPlayer('Red');
    setLastMove(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Connect Four</h1>
      <h2 style={styles.subHeading}>{winner ? `${winner} Wins!` : `Current Player: ${currentPlayer === 'Red' ? player1 : player2}`}</h2>
      <div style={styles.gridContainer}>
        {Array(COLS).fill(null).map((_, col) => (
          <button
            key={col}
            onClick={() => dropDisc(col)}
            style={styles.dropButton}
          >
            Drop
          </button>
        ))}
      </div>
      <div style={styles.grid}>
        {board.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isLastMove = lastMove && lastMove.row === rowIndex && lastMove.col === colIndex;
            const springProps = useSpring({
              from: { transform: `translateY(-${100 * (rowIndex + 1)}px)` },
              to: { transform: `translateY(0)` },
              config: { tension: 200, friction: 30 },
              reset: isLastMove,
            });

            return (
              <animated.div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  ...styles.cell,
                  background: cell === 'Red' ? 'red' : cell === 'Yellow' ? 'yellow' : '#fff',
                  ...springProps,
                }}
              />
            );
          })
        )}
      </div>
      {winner && <WinLose winner={winner} onRestart={resetGame} onBackToStart={onBackToStart} />}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#282c34',
    minHeight: '100vh',
    padding: '20px',
    color: '#ffffff',
  },
  heading: {
    fontSize: '3rem',
    marginBottom: '20px',
  },
  subHeading: {
    fontSize: '1.5rem',
    marginBottom: '20px',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: `repeat(${COLS}, 100px)`,
    gridGap: '10px',
    marginBottom: '20px',
  },
  dropButton: {
    backgroundColor: '#3b3f47',
    color: '#ffffff',
    fontSize: '1rem',
    padding: '10px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: `repeat(${COLS}, 100px)`,
    gridGap: '10px',
    marginBottom: '30px',
  },
  cell: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '2px solid #333',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  },
};

export default GamePage;
