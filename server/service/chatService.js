import Message from "../models/message.js";
import User from "../models/user.js";

export const getAllUserService = async () => {
  return await User.find({});
}


export const getChatHistory = async (userId, recipientId) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: recipientId },
        { sender: recipientId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    return messages;
  } catch (error) {
    throw new Error('Error fetching chat history');
  }
};

