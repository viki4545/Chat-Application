import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const joinRoom = (userId) => {
  socket.emit('join', userId);
};

const sendMessage = (message) => {
  socket.emit('send_message', message);
};

const onMessageReceived = (callback) => {
  socket.on('receive_message', callback);
};

export { joinRoom, sendMessage, onMessageReceived };
