import React, { useState } from 'react';

interface StartPageProps {
  onStart: (player1: string, player2: string, mode: '1v1' | '1vComputer' | 'multiplayer') => void;
  onEnterLobby: () => void; // New prop to enter the lobby
  oldGames: { player1: string, player2: string, winner: string }[];
}

const StartPage: React.FC<StartPageProps> = ({ onStart, onEnterLobby, oldGames }) => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [gameMode, setGameMode] = useState<'1v1' | '1vComputer' | 'multiplayer'>('1v1');

  const handleStart = () => {
    if (gameMode === 'multiplayer') {
      // Navigate to the lobby if "Online Multiplayer" is selected
      onEnterLobby();
    } else {
      // Start a local game for 1v1 or 1vComputer
      onStart(player1, gameMode === '1vComputer' ? 'Computer' : player2, gameMode);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Connect Four</h1>

        <div style={styles.formGroup}>
          <input
            type="text"
            placeholder="Player 1 Name"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            style={styles.input}
          />
        </div>

        {gameMode === '1v1' && (
          <div style={styles.formGroup}>
            <input
              type="text"
              placeholder="Player 2 Name"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              style={styles.input}
            />
          </div>
        )}

        <div style={styles.formGroup}>
          <label htmlFor="gameMode" style={styles.label}>Game Mode:</label>
          <select
            id="gameMode"
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value as '1v1' | '1vComputer' | 'multiplayer')}
            style={styles.select}
          >
            <option value="1v1">1v1</option>
            <option value="1vComputer">1vComputer</option>
            <option value="multiplayer">Online Multiplayer</option> {/* New Option */}
          </select>
        </div>

        <button onClick={handleStart} style={styles.startButton}>
          {gameMode === 'multiplayer' ? 'Enter Lobby' : 'Start Game'}
        </button>

        {/* Old Games Section */}
        <div style={styles.oldGamesSection}>
          <h2>Old Games</h2>
          {oldGames.length === 0 ? (
            <p>No games played yet.</p>
          ) : (
            <ul style={styles.oldGamesList}>
              {oldGames.map((game, index) => (
                <li key={index} style={styles.oldGameItem}>
                  <strong>{game.player1}</strong> vs <strong>{game.player2}</strong> - Winner: <strong>{game.winner}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
    padding: '20px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid rgba(255, 255, 255, 0.4)',
  },
  title: {
    fontSize: '3rem',
    color: '#333',
    marginBottom: '30px',
    fontFamily: "'Poppins', sans-serif",
  },
  formGroup: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    fontSize: '1.1rem',
    color: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  select: {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    fontSize: '1.1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  startButton: {
    width: '100%',
    padding: '14px',
    fontSize: '1.3rem',
    color: '#fff',
    backgroundColor: '#FF5722',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.2)',
  },
  oldGamesSection: {
    marginTop: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '20px',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
  },
  oldGamesList: {
    listStyleType: 'none',
    padding: 0,
  },
  oldGameItem: {
    fontSize: '1rem',
    color: '#333',
    margin: '10px 0',
    fontFamily: "'Poppins', sans-serif",
  },
};

export default StartPage;
