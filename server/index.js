import express from "express"
import http from "http"
import { Server } from "socket.io";
import cors from "cors"
import dotenv from "dotenv";
import {connectDB} from "./config/db.js"
import authRouter from "./router/authRouter.js";
import chatRouter from "./router/chatRouter.js";
import initializeSocket from "./socket/socket.js";
import path from "path";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
app.use(cors({ origin: "https://chat-applicatio.netlify.app", credentials: true }));

const io = new Server(server, {
    cors: {
        origin: "https://chat-applicatio.netlify.app",
        credentials: true
    }
});

app.use(express.json());
app.use(express.static(path.resolve("./public")))

app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);

initializeSocket(io);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
