import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import StartPage from './StartPage';
import GamePage from './GamePage';
import Lobby from './Lobby';

const socket = io('http://localhost:3001');

const App = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [inLobby, setInLobby] = useState(false);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [gameMode, setGameMode] = useState<'1v1' | '1vComputer' | 'multiplayer'>('1v1');
  const [board, setBoard] = useState<(string | null)[][]>(
    Array.from({ length: 6 }, () => Array(7).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<'Red' | 'Blue'>('Red');
  const [winner, setWinner] = useState<string | null>(null);
  const [oldGames, setOldGames] = useState<{ player1: string, player2: string, winner: string }[]>([]);
  const [roomCode, setRoomCode] = useState('');
  const [player, setPlayer] = useState<'Red' | 'Blue' | null>(null);

  useEffect(() => {
    const storedGames = JSON.parse(localStorage.getItem('oldGames') || '[]');
    setOldGames(storedGames);
  }, []);

  const saveGameResult = (winner: string) => {
    const gameResult = { player1, player2, winner };
    const updatedOldGames = [...oldGames, gameResult];

    // Save to localStorage
    localStorage.setItem('oldGames', JSON.stringify(updatedOldGames));

    // Update state
    setOldGames(updatedOldGames);
  };

  const checkWinner = (newBoard: (string | null)[][], row: number, col: number, player: string): boolean => {
    const directions = [
      { rowDir: 0, colDir: 1 },  // Horizontal
      { rowDir: 1, colDir: 0 },  // Vertical
      { rowDir: 1, colDir: 1 },  // Diagonal down-right
      { rowDir: 1, colDir: -1 }  // Diagonal down-left
    ];

    for (const { rowDir, colDir } of directions) {
      let count = 1;

      // Check in one direction
      for (let i = 1; i < 4; i++) {
        const newRow = row + i * rowDir;
        const newCol = col + i * colDir;
        if (newBoard[newRow] && newBoard[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }

      // Check in the opposite direction
      for (let i = 1; i < 4; i++) {
        const newRow = row - i * rowDir;
        const newCol = col - i * colDir;
        if (newBoard[newRow] && newBoard[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }

      if (count >= 4) {
        return true;
      }
    }
    return false;
  };

  const handleMove = (col: number) => {
    if (winner) return; // Prevent further moves if there is a winner

    const newBoard = [...board];

    for (let row = 5; row >= 0; row--) {
      if (newBoard[row][col] === null) {
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);

        // Check if there's a winner after placing the chip
        if (checkWinner(newBoard, row, col, currentPlayer)) {
          const winningPlayer = currentPlayer === 'Red' ? player1 : player2;
          setWinner(winningPlayer); // Assign winner name
          saveGameResult(winningPlayer); // Save the game result
        } else {
          // Switch players for 1v1 mode or make AI move if 1vComputer mode
          if (gameMode === '1v1') {
            setCurrentPlayer(currentPlayer === 'Red' ? 'Blue' : 'Red');
          } else if (gameMode === '1vComputer' && currentPlayer === 'Red') {
            // Player has made their move; now make AI move
            setCurrentPlayer('Blue');
            setTimeout(() => {
              makeAIMove(); // Call AI move after a small delay
            }, 500); // Adding a delay for AI to "think"
          }
        }
        break;
      }
    }
  };

  // AI move function
  const makeAIMove = () => {
    const newBoard = [...board];
    
    // Find an available column (random or based on a strategy)
    const availableColumns = [];
    for (let col = 0; col < 7; col++) {
      if (newBoard[0][col] === null) availableColumns.push(col);
    }

    // AI chooses a random available column
    const chosenCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];

    for (let row = 5; row >= 0; row--) {
      if (newBoard[row][chosenCol] === null) {
        newBoard[row][chosenCol] = 'Blue'; // AI is always "Blue"
        setBoard(newBoard);

        // Check if AI won
        if (checkWinner(newBoard, row, chosenCol, 'Blue')) {
          setWinner('Computer'); // AI wins
          saveGameResult('Computer');
        } else {
          // Switch back to the human player's turn
          setCurrentPlayer('Red');
        }
        break;
      }
    }
  };

  // Multiplayer move handler via Socket.io
  const handleMultiplayerMove = (col: number) => {
    if (winner || currentPlayer !== player) return;
    socket.emit('game_event', { type: 'move', data: { col } });
  };

  const handleReset = () => {
    setBoard(Array.from({ length: 6 }, () => Array(7).fill(null)));
    setWinner(null);
    setCurrentPlayer('Red');
  };

  const handleMultiplayerReset = () => {
    socket.emit('game_event', { type: 'reset' });
  };

  const handleStartGame = (p1: string, p2: string, mode: '1v1' | '1vComputer' | 'multiplayer') => {
    setPlayer1(p1);
    setPlayer2(mode === '1vComputer' ? 'Computer' : p2);
    setGameMode(mode);
    setIsGameStarted(true); // Start the game
  };

  const handleBackToStart = () => {
    setIsGameStarted(false);
    handleReset();
  };

  const handleEnterLobby = () => {
    setInLobby(true);
  };

  const handleExitLobby = () => {
    setInLobby(false);
  };

  const handleCreateGame = () => {
    const p1 = prompt('Enter your name:');
    if (p1) {
      socket.emit('create_game', { player1: p1 });
      socket.on('game_created', ({ roomCode, player }) => {
        setRoomCode(roomCode);
        setPlayer(player);
        setPlayer1(p1);
        setGameMode('multiplayer');
        setInLobby(false);
        setIsGameStarted(true);
      });
    }
  };

  const handleJoinGame = (roomId: string) => {
    const p2 = prompt('Enter your name:');
    if (p2) {
      socket.emit('join_game', { roomCode: roomId, player2: p2 });
      socket.on('game_joined', ({ roomCode, player }) => {
        setRoomCode(roomCode);
        setPlayer(player);
        setPlayer2(p2);
        setGameMode('multiplayer');
        setInLobby(false);
        setIsGameStarted(true);
      });

      socket.on('error', (message) => {
        alert(message);
      });
    }
  };

  useEffect(() => {
    // Listen for multiplayer game state updates
    if (gameMode === 'multiplayer') {
      socket.on('game_state', (gameState) => {
        setBoard(gameState.board);
        setCurrentPlayer(gameState.currentPlayer);
        setWinner(gameState.winner);
      });

      return () => {
        socket.off('game_state');
      };
    }
  }, [gameMode]);

  return (
    <div>
      {!isGameStarted && !inLobby ? (
        <StartPage onStart={handleStartGame} onEnterLobby={handleEnterLobby} oldGames={oldGames} />
      ) : inLobby ? (
        <Lobby onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />
      ) : (
        <GamePage
          board={board}
          currentPlayer={currentPlayer}
          winner={winner}
          onMove={gameMode === 'multiplayer' ? handleMultiplayerMove : handleMove}
          onReset={gameMode === 'multiplayer' ? handleMultiplayerReset : handleReset}
          onBackToStart={handleBackToStart}
          player1={player1}
          player2={player2}
          roomCode={roomCode}  // Pass roomCode here
        />
      )}
    </div>
  );
};

export default App;
