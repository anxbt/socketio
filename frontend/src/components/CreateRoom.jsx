// src/components/CreateRoom.js
import React, { useState } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const CreateRoom = ({ setRoomCode }) => {
  const [loading, setLoading] = useState(false);

  const createRoom = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/create-room`);
      setRoomCode(response.data.roomCode);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={createRoom} disabled={loading}>
        {loading ? "Creating Room..." : "Create Room"}
      </button>
    </div>
  );
};

export default CreateRoom;
