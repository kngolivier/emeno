// src/services/socket.js

import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

const socket = io(API_URL, {
  autoConnect: false,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true
});

export default socket;