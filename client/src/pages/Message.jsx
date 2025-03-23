// MessagesPage.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Message = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const us

  useEffect(() => {
    if(!localStorage.getItem("token")){
      navigate("/")
    }
  }, []);

  return (
    <div className="w-full h-full">

      <div className="w-full h-full grid grid-cols-4">
        <div className="col-span-1 h-full bg-gray-500 flex flex-col">
          <h1 className="px-4 py-2 flex text-center items-center bg-gray-600 text-white">Messages</h1>
          <input type="search" placeholder="Search for users"/>
          <p className="p-4">Users1</p>
          <p className="p-4">Users1</p>
          <p className="p-4">Users1</p>
          <p className="p-4">Users1</p>
          <p className="p-4">Users1</p>
          <p className="p-4">Users1</p>
          <p className="p-4">Users1</p>
        </div>

        <div className="col-span-3 grid grid-flow-row grid-rows-3 h-full">
          <h1 className="row-span-1 w-full p-2 bg-gray-300 max-h-[20%]">Conversation with User</h1>
          <div className="row-span-2 bg-gray-100 max-h-[60%]"></div>
          <div className="row-span-1 w-full max-h-[20%]">
            <input />
          </div>
        </div>
      </div>
      
      {/* <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="p-4 border border-gray-200 rounded"
            onClick={() => setSelectedUser(message.user)}
          >
            <p>{message.user.name}</p>
            <p>{message.isUnread ? "Unread" : "Read"}</p>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div>
          <h2 className="text-lg">Messages with {selectedUser.name}</h2>
          <div className="space-y-4">
            {selectedUser.messages.map((msg, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded">
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Message;
