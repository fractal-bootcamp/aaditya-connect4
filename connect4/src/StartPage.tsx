import React, { useState } from 'react';

const StartPage = ({ onStart }: { onStart: (player1: string, player2: string, mode: string) => void }) => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [mode, setMode] = useState('1v1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (player1 && (mode === '1v1' ? player2 : true)) {
      onStart(player1, player2 || 'Computer', mode);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.heading}>Connect Four</h1>
        <input
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          placeholder="Player 1 Name"
          style={styles.input}
          required
        />
        {mode === '1v1' && (
          <input
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            placeholder="Player 2 Name"
            style={styles.input}
            required
          />
        )}
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={styles.select}
        >
          <option value="1v1">1v1</option>
          <option value="1vComputer">1vComputer</option>
        </select>
        <button type="submit" style={styles.button}>
          Start Game
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#282c34',
    color: '#ffffff',
  },
  form: {
    backgroundColor: '#3b3f47',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '2.5rem',
  },
  input: {
    marginBottom: '15px',
    padding: '10px',
    width: '250px',
    borderRadius: '5px',
    border: 'none',
    fontSize: '1rem',
  },
  select: {
    marginBottom: '20px',
    padding: '10px',
    width: '270px',
    borderRadius: '5px',
    border: 'none',
    fontSize: '1rem',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#007BFF',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s',
  },
};

export default StartPage;
