"use strict";
// import express from "express"
// import { Server, Socket } from "socket.io"
// import http, { STATUS_CODES } from "http"
Object.defineProperty(exports, "__esModule", { value: true });
// const app = express()
// const server = http.createServer(app)
// const io = new Server(server, {})
// io.on("connection", async (socket) => {
//     const userId = await computeUserIdFromHeaders(socket);
//     socket.join(userId);
//     // and then later
//     io.to(userId).emit("hi");
// });
// app.use("/createRoom", (req, res) => {
// })
// app.get("/", (req, res) => {
//     if (req.query.status === 'success') {
//         res.status(200).json({ message: "EVerything ok" })
//     } else {
//         res.status(400).json({ message: 'Invalid request!' });
//     }
// })
// function generateRandomNumbers(length = 3) {
//     const words = 'BCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567899'
//     let roomCode = ''
//     for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * words.length);
//         // console.log("random num"+random)
//         roomCode += words[randomIndex]
//     }
//     return roomCode;
// }
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8000 });
wss.on('connection', function connection(ws) {
    console.log("user connected");
    ws.on('error', console.error);
    ws.on("message", (e) => {
        if (e.toString() === "ping") {
            ws.send("pong");
        }
    });
});
