import React, { useState } from 'react';

const ROWS = 6;
const COLS = 7;
const EMPTY = null;

const createEmptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));

const GamePage = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<'Red' | 'Yellow'>('Red');
  const [winner, setWinner] = useState<string | null>(null);

  const dropDisc = (col: number) => {
    if (winner) return; // If game is over, don't allow more moves

    const newBoard = board.map(row => [...row]); // Copy board
    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row][col] === EMPTY) {
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        checkWinner(newBoard, row, col);
        setCurrentPlayer(currentPlayer === 'Red' ? 'Yellow' : 'Red');
        return;
      }
    }
  };

  const checkWinner = (newBoard: string[][], row: number, col: number) => {
    const player = newBoard[row][col];
    if (checkDirection(newBoard, row, col, player, 1, 0) || // Horizontal
        checkDirection(newBoard, row, col, player, 0, 1) || // Vertical
        checkDirection(newBoard, row, col, player, 1, 1) || // Diagonal /
        checkDirection(newBoard, row, col, player, 1, -1)) { // Diagonal \
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
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Connect Four</h1>
      <h2>{winner ? `${winner} wins!` : `Current Player: ${currentPlayer}`}</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 100px)`,
          gridGap: '5px',
          justifyContent: 'center',
          marginBottom: '20px'
        }}
      >
        {Array(COLS).fill(null).map((_, col) => (
          <button
            key={col}
            onClick={() => dropDisc(col)}
            style={{
              width: '100px',
              height: '50px',
              backgroundColor: '#333',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Drop
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 100px)`,
          gridGap: '5px',
          justifyContent: 'center'
        }}
      >
        {board.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#00A',
                borderRadius: '50%',
                border: '2px solid #333',
                background: cell === 'Red' ? 'red' : cell === 'Yellow' ? 'yellow' : 'white',
              }}
            />
          ))
        )}
      </div>
      <button onClick={resetGame} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
        Reset Game
      </button>
    </div>
  );
};

export default GamePage;
