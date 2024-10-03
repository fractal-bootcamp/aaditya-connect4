import React from 'react';
import { useSpring, animated } from 'react-spring';
import WinLose from './WinLose'; // Import the WinLose component
import { useSocketIOGameState } from './SocketIO'; // Import the custom hook for socket.io game state

const ROWS = 6;
const COLS = 7;

const GamePage = ({ player1, player2, onBackToStart }: { player1: string, player2: string, onBackToStart: () => void }) => {
  const { board, currentPlayer, winner, handleMove, resetGame, isConnected } = useSocketIOGameState("http://localhost:3001");

  const dropDisc = (col: number) => {
    if (!winner && isConnected) {
      handleMove(col);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Connect Four</h1>
      <h2 style={styles.subHeading}>
        {winner 
          ? `${winner} Wins!` 
          : `Current Player: ${currentPlayer === 'Red' ? player1 : player2}`}
      </h2>
      <div style={styles.gridContainer}>
        {Array(COLS).fill(null).map((_, col) => (
          <button
            key={col}
            onClick={() => dropDisc(col)}
            style={styles.dropButton}
            disabled={!isConnected || !!winner} // Disable buttons if there is a winner
          >
            Drop
          </button>
        ))}
      </div>
      <div style={styles.grid}>
        {board.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const springProps = useSpring({
              from: { transform: `translateY(-${100 * (rowIndex + 1)}px)` },
              to: { transform: `translateY(0)` },
              config: { tension: 200, friction: 30 },
              reset: false,
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

      {/* Show WinLose modal if there is a winner */}
      {winner && <WinLose winner={winner} onRestart={resetGame} onBackToStart={onBackToStart} />}
      
      {!isConnected && <p>Connecting to the server...</p>}
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
