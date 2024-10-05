import React from 'react';
import { useSpring, animated } from 'react-spring';
import WinLose from './WinLose';
import redChipImage from './img/bestchipred.png';
import blueChipImage from './img/bestchipblue.png';

const GamePage = ({
  board,
  currentPlayer,
  winner,
  onMove,
  onReset,
  onBackToStart,
  player1,
  player2,
  roomCode, // Add roomCode as a prop
}: {
  board: (string | null)[][];
  currentPlayer: 'Red' | 'Blue' | null;
  winner: string | null;
  onMove: (col: number) => void;
  onReset: () => void;
  onBackToStart: () => void;
  player1: string;
  player2: string;
  roomCode?: string; // roomCode is optional, only for multiplayer
}) => {
  const renderCell = (row: number, col: number) => {
    const cellValue = board[row][col];

    // Chip drop animation using react-spring
    const springProps = useSpring({
      transform: cellValue ? `translateY(0)` : `translateY(-${(row + 1) * 70}px)`,
      config: { tension: 200, friction: 25 },
      from: { transform: `translateY(-${(row + 1) * 70}px)` },
      reset: false,
    });

    return (
      <div key={`${row}-${col}`} style={styles.cellContainer}>
        <div style={styles.cell}>
          <div style={styles.circle} />
        </div>

        {cellValue && (
          <animated.div
            style={{
              ...styles.chip,
              backgroundImage: `url(${cellValue === 'Red' ? redChipImage : blueChipImage})`,
              ...springProps,
            }}
          />
        )}
      </div>
    );
  };

  const currentPlayerName = currentPlayer === 'Red' ? player1 : player2;

  return (
    <div style={styles.container}>
      {/* Display the room code for multiplayer */}
      {roomCode && (
        <div style={styles.roomCode}>
          <h2>Game ID: {roomCode}</h2>
          <p>Share this ID with another player to join the game!</p>
        </div>
      )}

      <div style={styles.playersContainer}>
        {/* Player 1 Info */}
        <div style={styles.playerContainer}>
          <div style={styles.playerName}>{player1}</div>
          <img src={redChipImage} alt="Red Player Chip" style={styles.playerChip} />
        </div>

        {/* Game Board */}
        <div style={styles.boardContainer}>
          <h2 style={styles.currentPlayerText}>
            {winner ? `${winner} Wins!` : `Current Player: ${currentPlayerName}`}
          </h2>

          <div style={styles.board}>
            {board.map((row, rowIndex) =>
              row.map((_, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} onClick={() => onMove(colIndex)}>
                  {renderCell(rowIndex, colIndex)}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Player 2 Info */}
        <div style={styles.playerContainer}>
          <div style={styles.playerName}>{player2}</div>
          <img src={blueChipImage} alt="Blue Player Chip" style={styles.playerChip} />
        </div>
      </div>

      {/* Reset button */}
      <button onClick={onReset} style={styles.resetButton}>Reset Game</button>

      {/* WinLose component */}
      {winner && (
        <WinLose
          winner={winner}
          onRestart={onReset}
          onBackToStart={onBackToStart}
          onReplaySameUser={() => onReset()}
        />
      )}
    </div>
  );
};

const styles = {
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    width: '100%',
    padding: '20px',
    background: 'linear-gradient(135deg, #007adf 0%, #00ecbc 100%)',
    minHeight: '100vh',
  },
  roomCode: {
    marginBottom: '20px',
    textAlign: 'center',
    color: '#fff',
  },
  playersContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '20px',
    marginBottom: '30px',
  },
  playerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '120px',
    margin: '0 20px',
  },
  playerName: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  playerChip: {
    width: '100px',
    height: '100px',
  },
  boardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 60px)',
    gridGap: '5px',
    padding: '20px',
    backgroundColor: '#f4d03f',
    borderRadius: '10px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
  cellContainer: {
    position: 'relative',
    width: '60px',
    height: '60px',
  },
  cell: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#F4D03F',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: 'white',
  },
  chip: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  currentPlayerText: {
    fontSize: '1.8rem',
    color: '#fff',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#ff5a5f',
    color: '#fff',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
    fontWeight: 'bold',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
};

export default GamePage;
