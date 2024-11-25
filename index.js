// index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
require('dotenv').config(); 


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

app.use(express.json());
// app.use(cors(
//     {
//         origin: 'http://localhost:5173', // Replace with your frontend URL
//         methods: ['GET', 'POST']
//       }
// ));
app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      }
    },
    methods: ['GET', 'POST']
  }));
  


  
// In-memory storage for rooms and messages
const rooms = {};


function generateRoomCode(length = 4) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let roomCode = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        roomCode += characters[randomIndex];
    }
    return roomCode;
}




// Endpoint to create a room and generate a unique code
app.post('/create-room', (req, res) => {
  const roomCode = generateRoomCode(length=4); // Generate a unique room code
  rooms[roomCode] = []; // Initialize the room with an empty message array
  res.json({ roomCode });
});

app.get('/test',(req,res)=>{
  res.status(200).json({message: 'Test endpoint is working!'})
})

app.get('/health', (req, res) => {
  res.send('Backend is working!');
});


// Endpoint to check if a room exists before joining
app.post('/join-room', (req, res) => {
  const { roomCode } = req.body;
  if (rooms[roomCode]) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

// Socket.io connection for real-time communication
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle joining a room
  socket.on('joinRoom', (roomCode) => {
    if (rooms[roomCode]) {
      socket.join(roomCode);
      rooms[roomCode].users++; // Increment user count
      console.log(`User joined room: ${roomCode}. Current user count: ${rooms[roomCode].users}`);
            io.to(roomCode).emit('userCount', rooms[roomCode].users);
      console.log(`User joined room: ${roomCode}`);
    } else {
      socket.emit('error', 'Room not found');
    }
  });

   // Handle leaving a room
   socket.on('leaveRoom', (roomCode) => {
    if (rooms[roomCode]) {
        socket.leave(roomCode);
        rooms[roomCode].users--; // Decrement user count
        io.to(roomCode).emit('userCount', rooms[roomCode].users); // Emit updated user count to everyone in the room
        console.log(`User left room: ${roomCode}`);
    }
});


  // Handle sending messages in a room
  socket.on('sendMessage', ({ roomCode, message }) => {
    if (rooms[roomCode]) {
      rooms[roomCode].push(message); // Store message in memory
      io.to(roomCode).emit('receiveMessage', message); // Broadcast to all users in the room
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
