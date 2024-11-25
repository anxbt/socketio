// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import socket from '../socket';

const Chat = ({ roomCode }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Join the room on mount
    socket.emit("joinRoom", roomCode);

    // Listen for incoming messages
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, [roomCode]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", { roomCode, message });
      setMessage(""); // Clear input field
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
