import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

type Player = 'Red' | 'Yellow';
type Board = (string | null)[][];

const ROWS = 6;
const COLS = 7;

const createEmptyBoard = (): Board => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

let board: Board = createEmptyBoard();
let currentPlayer: Player = 'Red';
let winner: Player | null = null;

// Set up Express and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

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

    // Check in the positive direction
    for (let i = 1; i < 4; i++) {
      const newRow = row + i * rowDir;
      const newCol = col + i * colDir;
      if (inBounds(newRow, newCol) && board[newRow][newCol] === player) {
        count++;
      } else {
        break;
      }
    }

    // Check in the negative direction
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

  // Send the current game state to the new client
  socket.emit('game_event', { type: 'state', data: { board, currentPlayer, winner } });

  socket.on('game_event', (message: { type: string; data: { col: number } }) => {
    if (message.type === 'move' && !winner) {
      const { col } = message.data;

      // Update the board on the server
      for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === null) {
          board[row][col] = currentPlayer;

          if (checkWinner(board, row, col, currentPlayer)) {
            winner = currentPlayer;
            io.emit('game_event', { type: 'state', data: { board, currentPlayer, winner } });
            return; // Stop further moves since we have a winner
          }

          currentPlayer = currentPlayer === 'Red' ? 'Yellow' : 'Red';
          io.emit('game_event', { type: 'state', data: { board, currentPlayer, winner } });
          break;
        }
      }
    } else if (message.type === 'reset') {
      // Reset the game state
      board = createEmptyBoard();
      currentPlayer = 'Red';
      winner = null;

      io.emit('game_event', { type: 'state', data: { board, currentPlayer, winner } });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Set up a simple route for testing
app.get('/', (req: Request, res: Response) => {
  res.send('WebSocket server is running.');
});

// Start the server on port 3001
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
