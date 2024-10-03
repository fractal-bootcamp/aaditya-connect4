import React, { useState } from 'react';

const Lobby = ({ onJoinGame, onCreateGame }: { onJoinGame: (gameId: string) => void; onCreateGame: () => void }) => {
  const [gameId, setGameId] = useState('');

  return (
    <div style={styles.container}>
      <h1>Lobby</h1>
      <div style={styles.options}>
        <button onClick={onCreateGame} style={styles.button}>
          Create New Game
        </button>
        <div>
          <input
            type="text"
            placeholder="Enter Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            style={styles.input}
          />
          <button onClick={() => onJoinGame(gameId)} style={styles.button}>
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
    flexDirection: 'column',
    alignItems: 'center',
  },
  options: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
  },
  input: {
    marginRight: '10px',
    padding: '10px',
    fontSize: '16px',
  },
};

export default Lobby;
