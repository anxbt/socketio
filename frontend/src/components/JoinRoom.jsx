// src/components/JoinRoom.js
import React, { useState } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;


const JoinRoom = ({ setRoomCode }) => {
  const [code, setCode] = useState("");

  const joinRoom = async () => {
    try {
      const response = await axios.post(`${apiUrl}/join-room`, { roomCode: code });
      if (response.data.success) {
        setRoomCode(code);
      } else {
        alert("Room not found");
      }
    } catch (error) {
      console.error("Failed to join room:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter room code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
};

export default JoinRoom;
