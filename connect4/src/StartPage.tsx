import React, { useState } from 'react';

interface StartPageProps {
  onStart: (player1: string, player2: string) => void;
}

const StartPage = ({ onStart }: StartPageProps) => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const handleStart = () => {
    if (player1.trim() && player2.trim()) {
      onStart(player1, player2); // Pass the names to the parent component
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
          <input
            type="text"
            placeholder="Player 2 Name"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            style={styles.input}
          />
        </div>
        <button onClick={handleStart} style={styles.button}>
          Start Game
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #FF6F91 0%, #FFC15E 100%)',
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    padding: '40px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '30px',
    color: '#333',
    fontWeight: 'bold',
    fontFamily: "'Roboto', sans-serif",
  },
  formGroup: {
    marginBottom: '30px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    border: '2px solid #ddd',
    borderRadius: '10px',
    fontSize: '16px',
    boxSizing: 'border-box',
    fontFamily: "'Roboto', sans-serif",
    transition: 'border-color 0.3s',
  },
  button: {
    background: 'linear-gradient(135deg, #FF6F91 0%, #FFC15E 100%)',
    color: '#fff',
    padding: '15px 30px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    fontFamily: "'Roboto', sans-serif",
  },
};

export default StartPage;
