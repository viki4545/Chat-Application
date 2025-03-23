import express from "express"
// import http from "http"
// import { Server } from "socket.io";
import cors from "cors"
import {connectDB} from "./config/db.js"
import authRouter from "./router/authRouter.js";
import chatRouter from "./router/chatRouter.js";

const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

connectDB();

app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(express.json());



app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);

// let users = [];

// io.on('connection', (socket) => {
//   console.log('A user connected');
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//     users = users.filter((user) => user.socketId !== socket.id);
//   });

//   socket.on('join', (userId) => {
//     users.push({ userId, socketId: socket.id });
//   });

//   socket.on('send_message', (message) => {
//     const recipient = users.find((user) => user.userId === message.receiver);
//     if (recipient) {
//       io.to(recipient.socketId).emit('receive_message', message);
//     }
//   });
// });

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
