import express from "express";
import { getAllUserController, getMessages, markMessagesAsReadController, sendMessage } from "../controller/chatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const chatRouter = express.Router();

chatRouter.get('/users', authMiddleware, getAllUserController);
chatRouter.post("/send", authMiddleware, sendMessage);
chatRouter.get("/:receiverId", authMiddleware, getMessages);
chatRouter.post("/markAsRead", authMiddleware, markMessagesAsReadController);

export default  chatRouter; 