import React, { useState } from 'react';
import StartPage from './StartPage';
import GamePage from './GamePage';

const App = () => {
  const [view, setView] = useState<'start' | 'game'>('start');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [mode, setMode] = useState<'1v1' | '1vComputer'>('1v1');

  const startGame = (p1: string, p2: string, gameMode: string) => {
    setPlayer1(p1);
    setPlayer2(p2);
    setMode(gameMode as '1v1' | '1vComputer');
    setView('game');
  };

  const backToStart = () => setView('start');

  return (
    <div>
      {view === 'start' ? (
        <StartPage onStart={startGame} />
      ) : (
        <GamePage player1={player1} player2={player2} mode={mode} onBackToStart={backToStart} />
      )}
    </div>
  );
};

export default App;
