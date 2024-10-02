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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Connect Four</h1>
      <input
        value={player1}
        onChange={(e) => setPlayer1(e.target.value)}
        placeholder="Player 1 Name"
        style={{ marginBottom: '10px', padding: '10px', fontSize: '16px', width: '200px' }}
        required
      />
      {mode === '1v1' && (
        <input
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          placeholder="Player 2 Name"
          style={{ marginBottom: '10px', padding: '10px', fontSize: '16px', width: '200px' }}
          required
        />
      )}
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        style={{ marginBottom: '20px', padding: '10px', fontSize: '16px', width: '220px' }}
      >
        <option value="1v1">1v1</option>
        <option value="1vComputer">1vComputer</option>
      </select>
      <button type="submit" style={{ padding: '10px 20px', fontSize: '16px' }}>
        Start Game
      </button>
    </form>
  );
};

export default StartPage;
