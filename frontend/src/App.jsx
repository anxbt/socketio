import { useState ,useEffect} from 'react'
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import Chat from './components/Chat';
import socket from './socket';

import './App.css'

function App() {
  const [roomCode, setRoomCode] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState(0);



   // Join room when component mounts
   useEffect(() => {
    if (roomCode) {
        socket.emit('joinRoom', roomCode);
    }

    // Listen for user count updates from backend
    socket.on('userCount', (count) => {
      console.log(`User count updated to: ${count}`); 
        setUserCount(count);
    });

    // Listen for incoming messages
    socket.on('receiveMessage', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
        socket.off('userCount');
        socket.off('receiveMessage');
    };
}, [roomCode]);

const handleJoinRoom = () => {
    if (roomCode) {
        socket.emit('joinRoom', roomCode);
    }
};

const handleSendMessage = () => {
    if (message && roomCode) {
        socket.emit('sendMessage', { roomCode, message });
        setMessage('');
    }
};


  return (
    <div className="App">
          <h1 className='text-3xl font-bold'>Create or Join a Room</h1>
       <p>Number of users in room: {userCount}</p>
      {!roomCode ? (
        <>
        
          <CreateRoom setRoomCode={setRoomCode} />
          <JoinRoom setRoomCode={setRoomCode} />
        </>
      ) : (
        <>
          <h1>Room Code: {roomCode}</h1>
          <Chat roomCode={roomCode} />
        </>
      )}
    </div>
  );
}

export default App
