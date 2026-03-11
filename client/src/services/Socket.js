import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  auth: {
    token: localStorage.getItem("token")
  }
});

// Function to reconnect with fresh token after login
export const reconnectSocket = () => {
  socket.auth = {
    token: localStorage.getItem("token")
  };
  socket.disconnect().connect();
};