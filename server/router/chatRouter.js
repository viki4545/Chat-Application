import express from "express";
import { getAllUserController, getMessages } from "../controller/chatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const chatRouter = express.Router();

chatRouter.get('/users',authMiddleware, getAllUserController);
chatRouter.get('/messages/:userId/:recipientId',authMiddleware, getMessages);

export default  chatRouter;