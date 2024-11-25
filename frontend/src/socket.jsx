// src/socket.js
import { io } from 'socket.io-client';
const apiUrl = import.meta.env.VITE_API_URL;

const socket = io(`${apiUrl}`); 
console.log(`${apiUrl}`);

export default socket;
