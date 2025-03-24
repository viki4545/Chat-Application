import { getAllUserService, getMessagesBetweenUsers, markMessagesAsReadService, saveMessage } from "../service/chatService.js";

export const getAllUserController = async (req, res) => {
  try {
    const searchQuery = req.query.search || ""; 
    const userId = req.user.id;
    const users = await getAllUserService(searchQuery, userId);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ message: "Users fetched successfully", data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const savedMessage = await saveMessage(sender, receiver, message);
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await getMessagesBetweenUsers(req.user.id, req.params.receiverId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const markMessagesAsReadController = async (req, res) => {
  try {
    const { sender, receiver } = req.body;

    if (!sender || !receiver) {
      return res.status(400).json({ message: "Sender and receiver are required" });
    }

    const result = await markMessagesAsReadService(sender, receiver);

    return res.status(200).json({ message: "Messages marked as read", data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


