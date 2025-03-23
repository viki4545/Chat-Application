import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { sendMessage, onMessageReceived } from '../services/socketService';

const Chat = () => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    onMessageReceived((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  const handleSend = () => {
    const message = {
      sender: user._id,
      receiver: 'recipientId', 
      message: messageText,
    };
    sendMessage(message);
    setMessages([...messages, message]);
    setMessageText('');
  };

  return (
    <div>
      <h2>Chat with {user.username}</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chat;
