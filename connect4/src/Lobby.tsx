import React, { useState } from 'react';

interface LobbyProps {
  onCreateGame: () => void;
  onJoinGame: (gameId: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ onCreateGame, onJoinGame }) => {
  const [gameId, setGameId] = useState('');

  const handleJoinGame = () => {
    if (gameId.trim()) {
      onJoinGame(gameId);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Lobby</h1>
        <div style={styles.formGroup}>
          <button onClick={onCreateGame} style={styles.button}>
            Create New Game
          </button>
        </div>
        <div style={styles.formGroup}>
          <input
            type="text"
            placeholder="Enter Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleJoinGame} style={styles.button}>
            Join Game
          </button>
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
  button: {
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
    marginTop: '10px',
  },
};

export default Lobby;
