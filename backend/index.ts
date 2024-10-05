import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

type Player = 'Red' | 'Blue';
type Board = (string | null)[][];

const ROWS = 6;
const COLS = 7;

const createEmptyBoard = (): Board => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

interface GameRoom {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  players: { [id: string]: Player };
  player1: string | null;
  player2: string | null;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const gameRooms: { [key: string]: GameRoom } = {};

// Helper function to check for a winner
const checkWinner = (board: Board, row: number, col: number, player: Player): boolean => {
  const directions = [
    { rowDir: 0, colDir: 1 },  // Horizontal
    { rowDir: 1, colDir: 0 },  // Vertical
    { rowDir: 1, colDir: 1 },  // Diagonal down-right
    { rowDir: 1, colDir: -1 }  // Diagonal down-left
  ];

  const inBounds = (r: number, c: number) => r >= 0 && r < ROWS && c >= 0 && c < COLS;

  for (const { rowDir, colDir } of directions) {
    let count = 1;

    for (let i = 1; i < 4; i++) {
      const newRow = row + i * rowDir;
      const newCol = col + i * colDir;
      if (inBounds(newRow, newCol) && board[newRow][newCol] === player) {
        count++;
      } else {
        break;
      }
    }

    for (let i = 1; i < 4; i++) {
      const newRow = row - i * rowDir;
      const newCol = col - i * colDir;
      if (inBounds(newRow, newCol) && board[newRow][newCol] === player) {
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

io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  // Handle creating a new game room
  socket.on('create_game', ({ player1 }) => {
    const roomCode = uuidv4();
    gameRooms[roomCode] = {
      board: createEmptyBoard(),
      currentPlayer: 'Red',
      winner: null,
      players: { [socket.id]: 'Red' },
      player1,
      player2: null,
    };
    socket.join(roomCode);
    socket.emit('game_created', { roomCode, player: 'Red' });
    console.log(`Game created with code: ${roomCode}`);
  });

  // Handle joining an existing game room
  socket.on('join_game', ({ roomCode, player2 }) => {
    const room = gameRooms[roomCode];
    if (room && Object.keys(room.players).length < 2) {
      room.players[socket.id] = 'Blue';
      room.player2 = player2;
      socket.join(roomCode);
      socket.emit('game_joined', { roomCode, player: 'Blue' });
      io.to(roomCode).emit('game_state', room); // Emit to both players
    } else {
      socket.emit('error', 'Game not found or full');
    }
  });

  // Handle game events
  socket.on('game_event', ({ type, data }) => {
    const roomCode = Object.keys(gameRooms).find(code => gameRooms[code].players[socket.id]);
    const room = roomCode ? gameRooms[roomCode] : null;
    if (!room) return;

    if (type === 'move' && room.currentPlayer && !room.winner) {
      const { col } = data;

      for (let row = ROWS - 1; row >= 0; row--) {
        if (room.board[row][col] === null) {
          room.board[row][col] = room.currentPlayer;

          if (checkWinner(room.board, row, col, room.currentPlayer)) {
            room.winner = room.currentPlayer;
          }

          room.currentPlayer = room.currentPlayer === 'Red' ? 'Blue' : 'Red';
          io.to(roomCode).emit('game_state', room);
          break;
        }
      }
    } else if (type === 'reset') {
      room.board = createEmptyBoard();
      room.currentPlayer = 'Red';
      room.winner = null;
      io.to(roomCode).emit('game_state', room);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const roomCode = Object.keys(gameRooms).find(code => gameRooms[code].players[socket.id]);
    const room = roomCode ? gameRooms[roomCode] : null;
    if (room) {
      delete room.players[socket.id];
      if (Object.keys(room.players).length === 0) {
        delete gameRooms[roomCode]; // Delete the room if no players left
      } else {
        io.to(roomCode).emit('game_state', room); // Notify the remaining player
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
