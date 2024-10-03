import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { useGameState } from "./GameState";

type SocketMessage =
  | { type: "move"; data: { col: number } }
  | { type: "reset" }
  | { type: "state"; data: { board: (string | null)[][]; currentPlayer: string } };

// Create and return the socket instance
const useSocket = (url: string): [Socket | null, boolean] => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io(url, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      console.log("Socket.IO connection established");
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log(`Socket.IO disconnected: ${reason}`);
      setIsConnected(false);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
      setIsConnected(false);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [url]);

  return [socketRef.current, isConnected];
};

const useSocketIO = (url: string) => {
  const [socket, isConnected] = useSocket(url);

  const emitMessage = (message: SocketMessage) => {
    if (socket?.connected) {
      socket.emit("game_event", message);
    } else {
      console.warn("Socket not connected. Message not sent:", message);
    }
  };

  const onMessage = (callback: (message: SocketMessage) => void) => {
    if (socket) {
      socket.on("game_event", (message) => {
        console.log("received message", message);
        callback(message);
      });
      return () => {
        socket.off("game_event", callback);
      };
    }
  };

  return {
    emitMove: (col: number) => emitMessage({ type: "move", data: { col } }),
    emitReset: () => emitMessage({ type: "reset" }),
    emitGameState: (board: (string | null)[][], currentPlayer: string) =>
      emitMessage({ type: "state", data: { board, currentPlayer } }),
    onMessage,
    isConnected,
  };
};

export const useSocketIOGameState = (url: string) => {
  // local state, local actions
  const {
    board,
    currentPlayer,
    winner,
    handleMove,
    resetGame,
    initializeGameState,
  } = useGameState();

  // socket actions
  const { emitMove, emitReset, emitGameState, onMessage, isConnected } = useSocketIO(url);

  useEffect(() => {
    const cleanup = onMessage((message) => {
      switch (message.type) {
        case "move":
          handleMove(message.data.col);
          break;
        case "reset":
          resetGame();
          break;
        case "state":
          initializeGameState(message.data.board, message.data.currentPlayer);
          break;
        default:
          console.warn("unknown message type", message);
      }
    });

    return cleanup;
  }, [onMessage, handleMove, resetGame, initializeGameState]);

  const handleSocketMove = (col: number) => {
    // make the move on the server
    emitMove(col);
    // make the move on the client
    const updatedBoard = handleMove(col);
    // send the new board and current player to the server
    emitGameState(updatedBoard, currentPlayer);
  };

  const handleSocketReset = () => {
    // reset the game on the server
    emitReset();
    // reset the game on the client
    resetGame();
  };

  return {
    board,
    currentPlayer,
    winner,
    handleMove: handleSocketMove,
    resetGame: handleSocketReset,
    isConnected,
  };
};
