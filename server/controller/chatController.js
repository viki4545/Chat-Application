import { getAllUserService, getChatHistory } from "../service/chatService.js";

export const getAllUserController = async(req, res) => {
  try {
    const users = await getAllUserService();
    if(!users){
      return res.status(400).json({message: "Failed to fetch the users"})
    }
    return res.status(201).json({message: "All users fetched sucessfully", data: users })
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

export const getMessages = async (req, res) => {
  const { userId, recipientId } = req.params;
  try {
    const messages = await getChatHistory(userId, recipientId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

