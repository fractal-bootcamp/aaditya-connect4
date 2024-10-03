import React, { useState, useEffect } from 'react';

interface Game {
  player1: string;
  player2: string;
  winner: string;
}

const StartPage = ({ onStart, onJoinMultiplayer, oldGames }: { onStart: (p1: string, p2: string, mode: string) => void; onJoinMultiplayer: (p1: string) => void; oldGames: Game[] }) => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [mode, setMode] = useState<'1v1' | 'online'>('1v1');
  const [selectedGame, setSelectedGame] = useState<string | null>(null); // Track selected game

  useEffect(() => {
    // Optional: You can log or track the old games to confirm updates
    console.log('Old games updated:', oldGames);
  }, [oldGames]);

  const handleStartGame = () => {
    if (mode === '1v1') {
      onStart(player1, player2, mode);
    } else {
      onJoinMultiplayer(player1);
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
          {mode === '1v1' && (
            <input
              type="text"
              placeholder="Player 2 Name"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              style={styles.input}
            />
          )}
        </div>
        <div style={styles.formGroup}>
          <select value={mode} onChange={(e) => setMode(e.target.value as '1v1' | 'online')} style={styles.select}>
            <option value="1v1">1v1 Local</option>
            <option value="online">Online Multiplayer</option>
          </select>
        </div>
        <button onClick={handleStartGame} style={styles.button}>
          Start Game
        </button>
      </div>

      {/* Old Games Section */}
      <div style={styles.oldGamesSection}>
        <h2>Old Games</h2>
        {oldGames.length === 0 ? (
          <p>No games played yet.</p>
        ) : (
          oldGames.map((game, index) => (
            <div key={index} style={styles.oldGameContainer}>
              <button
                style={styles.oldGameButton}
                onClick={() => setSelectedGame(`Winner: ${game.winner}`)}
              >
                {game.player1} vs {game.player2}
              </button>
            </div>
          ))
        )}
        {selectedGame && <div style={styles.winnerDisplay}>{selectedGame}</div>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f4f9',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '40px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
    marginBottom: '20px',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '20px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%',
  },
  oldGamesSection: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
  },
  oldGameContainer: {
    marginBottom: '10px',
  },
  oldGameButton: {
    backgroundColor: '#3b3f47',
    color: '#ffffff',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    width: '100%',
    border: 'none',
    cursor: 'pointer',
  },
  winnerDisplay: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#333',
    fontWeight: 'bold',
  },
};

export default StartPage;
