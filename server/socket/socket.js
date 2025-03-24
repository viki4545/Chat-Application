import { saveMessage } from "../service/chatService.js";

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ User Connected:", socket.id);

    socket.on("sendMessage", async ({ sender, receiver, message }) => {
      const newMessage = await saveMessage(sender, receiver, message);
      io.emit("receiveMessage", newMessage);
    });

    socket.on("disconnect", () => console.log("User Disconnected"));
  });
};

export default initializeSocket;
