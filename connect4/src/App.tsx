import React, { useState } from 'react';
import StartPage from './StartPage';
import GamePage from './GamePage';
import Lobby from './Lobby';

interface Game {
  player1: string;
  player2: string;
  winner: string;
}

const App = () => {
  const [view, setView] = useState<'start' | 'game' | 'lobby' | 'win'>('start');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [mode, setMode] = useState<'1v1' | 'online'>('1v1');
  const [winner, setWinner] = useState<string | null>(null);
  const [oldGames, setOldGames] = useState<Game[]>([]); // State to hold old games

  const startGame = (p1: string, p2: string, gameMode: string) => {
    setPlayer1(p1);
    setPlayer2(p2);
    setMode(gameMode as '1v1' | 'online');
    setView('game');
  };

  const joinMultiplayer = (p1: string) => {
    setPlayer1(p1);
    setView('lobby');
  };

  const joinGame = (gameId: string) => {
    // Logic to join the game using the gameId
    setView('game');
  };

  const createGame = () => {
    // Logic to create a new game
    setView('game');
  };

  const backToStart = () => setView('start');

  const handleGameEnd = (winner: string) => {
    // Add the completed game to the oldGames array
    setOldGames((prevGames) => [
      ...prevGames,
      { player1, player2, winner },
    ]);

    // Set the winner to show the win modal
    setWinner(winner);

    // Change view to win modal
    setView('win');
  };

  const handleReplaySameUser = () => {
    setView('game');
    setWinner(null);
  };

  return (
    <div>
      {view === 'start' && (
        <StartPage
          onStart={startGame}
          onJoinMultiplayer={joinMultiplayer}
          oldGames={oldGames}  // Pass oldGames state here
        />
      )}
      {view === 'lobby' && <Lobby onJoinGame={joinGame} onCreateGame={createGame} />}
      {view === 'game' && (
        <GamePage
          player1={player1}
          player2={player2}
          mode={mode}
          onGameEnd={handleGameEnd} // Pass handleGameEnd to GamePage to trigger when a game ends
          onBackToStart={backToStart}
        />
      )}
      {view === 'win' && winner && (
        <WinLose
          winner={winner}
          onRestart={() => setView('game')}
          onBackToStart={backToStart}
          onReplaySameUser={handleReplaySameUser}
        />
      )}
    </div>
  );
};

export default App;
