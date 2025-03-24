import Message from "../models/message.js";
import User from "../models/user.js";

export const getAllUserService = async (searchQuery = "", userId) => {
  try {
    const filter = searchQuery
      ? { name: { $regex: searchQuery, $options: "i" } }
      : {}; 

    const users = await User.find(filter, { name: 1, _id: 1 });

    const usersWithUnreadCount = await Promise.all(
      users.map(async (user) => {
        const unreadCount = await Message.countDocuments({
          sender: user._id, 
          receiver: userId, 
          isRead: false, 
        });        

        return {
          _id: user._id,
          name: user.name,
          unreadCount, 
        };
      })
    );

    return usersWithUnreadCount;
  } catch (error) {
    console.error("Error fetching users with unread messages:", error);
    throw error;
  }
};


export const saveMessage = async (sender, receiver, message) => {
  try {
    const newMessage = new Message({ sender, receiver, message });
    return await newMessage.save();
  } catch (error) {
    throw new Error("Error saving message");
  }
};

export const getMessagesBetweenUsers = async (userId, receiverId) => {
  try {
    return await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });
  } catch (error) {
    throw new Error("Error fetching messages");
  }
};



export const markMessagesAsReadService = async (sender, receiver) => {
  try {
    const updatedMessages = await Message.updateMany(
      { sender, receiver, isRead: false },
      { $set: { isRead: true } } 
    );

    return updatedMessages;
  } catch (error) {
    throw new Error("Error updating messages: " + error.message);
  }
};


