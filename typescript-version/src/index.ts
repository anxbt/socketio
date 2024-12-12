
import express from "express"
import { Server, Socket } from "socket.io"
import http, { STATUS_CODES } from "http"
import ts from "typescript"
import * as dotenv from "dotenv"
import bodyParser from 'body-parser';

dotenv.config()




const app = express()
const server = http.createServer(app)
const io = new Server(server, {})


// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const rooms: { [key: string]: { users: any[], messages: any[] } } = {};

function generateRandomNumbers(length = 3) {
    const words = 'BCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567899'
    let roomCode :string = ''
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        // console.log("random num"+random)
        roomCode += words[randomIndex]
    }
    return roomCode;
}

app.post("/create-room",(req,res)=>{
    const roomCode = generateRandomNumbers();
    rooms[roomCode]={users:[], messages: []}// Initialize the room with an empty message array
    res.json({roomCode})
  
})

app.post("/join-room",(req,res)=>{
   const {roomCode} = req.body;
   //cosnt roomCode =req.body.roomCode

   if(rooms[roomCode]){
    res.json({success:true})
   }else{
    res.status(400).json({error:"Room not found"})
   }
})

io.on("connection",function(socket:Socket){
    console.log("user connected"+socket.id)

    // Handle joining a room
    socket.on('joinRoom',(roomCode:string)=>{
        if(rooms[roomCode]){
            socket.join(roomCode);
            rooms[roomCode];
            console.log("user joined room"+roomCode)
        }else{

            console.log("room not found")
            socket.emit("error","room-not-found")
        }
    })

    socket.on("leaveRoom",(roomCode:string)=>{
        if(rooms[roomCode]){
            socket.leave(roomCode);
            rooms[roomCode];
            console.log("user left"+roomCode)

        }else{
            console.log("room not found")
            socket.emit("error","room-not-found")
        }
    })

        //handle sending meesages
        socket.on("sendMessage",({roomCode,message})=>{
            if (rooms[roomCode]) {
            rooms[roomCode].messages.push(message); // Store message in memory
            io.to(roomCode).emit('receiveMessage', message); // Broadcast to all users in the room
            }else {
            socket.emit('error', 'Room not found');
          }
                
        })


        })



app.get("/", (req, res) => {
    if (req.query.status === 'success') {
        res.status(200).json({ message: "EVerything ok" })
        res.send("Hello World")
    } else {
        res.status(400).json({ message: 'Invalid request!' });
    }
})

app.get('/health', (req, res) => {
    res.send('Backend is working!');
  });
  

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

























// import e from 'cors';
// import {WebSocketServer} from 'ws';

// const wss =new WebSocketServer({port:8000})


// wss.on('connection', function connection(ws) {
//     console.log("user connected")

//     ws.on('error', console.error);

//     ws.on("message",(e)=>{
//         if(e.toString ()=== "ping"){
//        ws.send("pong")

//         }
//     })
//   });

// let userCount = 0;
// let allsockets = [];


// wss.on('connection',(socket)=>{

//     allsockets.push(socket);
   
//     userCount =userCount+1;
//     console.log("user connected  " + userCount);


//     socket.on("message",(msg)=>{
//         console.log("message received"+msg)

//         allsockets.forEach((eachSocket)=>{
//             eachSocket.send(msg.toString())
//         })
      
//             // socket.send("message received id "+msg)
        
      
//     })

// })