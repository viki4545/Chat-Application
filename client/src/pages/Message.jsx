import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiSend, FiMenu, FiUser, FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserThunk, getMessagesThunk, markAsReadMessagesThunk, sendMessageThunk } from "../redux/features/messageSlice";
import { debounce } from "lodash";
import { io } from "socket.io-client";
import moment from "moment";

const Message = () => {
  const socket = useMemo(() => io("http://localhost:5000"), []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const { users, messages } = useSelector((state) => state.message);

  console.log(users);
  

  
  const selectedUser = localStorage.getItem("selectedUser");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      dispatch(getMessagesThunk(selectedUser));
      dispatch(getAllUserThunk("")); 
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedUser, dispatch]);

  const fetchUsers = debounce((query) => {
    dispatch(getAllUserThunk(query));
  }, 500);

  useEffect(() => {
    fetchUsers(searchQuery);
    return () => fetchUsers.cancel();
  }, [searchQuery, dispatch]);

  const handleUserSelect = async (user) => {
    dispatch(getMessagesThunk(user));
    localStorage.setItem("selectedUser", user);
    setSidebarOpen(false);
    dispatch(markAsReadMessagesThunk({ sender: user, receiver: localStorage.getItem("userId") }));
    dispatch(getAllUserThunk(""));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedUser");
    navigate("/");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && input.trim()) {
      sendMessage();
    }
  };

  const sendMessage = () => {
    const sender = localStorage.getItem("userId");
    const receiver = localStorage.getItem("selectedUser");
    if (input.trim()) {
      socket.emit("sendMessage", { sender, receiver, message: input });
      setInput("");
    }
  };

  useEffect(() => {
  },[])

  return (
    <div className="w-full h-screen flex">
      {/* Sidebar */}
      <div className={`absolute md:relative top-0 left-0 w-3/4 md:w-1/4 h-full bg-white text-black p-5 border-r border-gray-300 transition-transform duration-300 z-40 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-3xl text-[#012647] font-semibold">Chats</h1>
          <button className="bg-[#012647] text-white p-2 rounded-full shadow-lg md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu size={24} />
          </button>
        </div>
        <input
          type="search"
          placeholder="Search for users"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-100 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#012647]"
        />
        <div className="mt-5 space-y-3 overflow-y-auto h-[80%]">
          {users?.map((data, index) => (
            <p
              key={index}
              className={`p-3 text-md font-medium cursor-pointer rounded-lg transition flex items-center justify-between 
                  ${selectedUser === data?._id ? "bg-[#012647] text-white" : "hover:bg-[#012647] hover:text-white"}`}
              onClick={() => handleUserSelect(data?._id)}
            >
              <span className="flex items-center gap-2">
                <FiUser /> {data?.name}
              </span>
              {data?.unreadCount > 0 && (
                <span className="bg-[#75000e] text-white text-xs font-bold px-2 py-1 rounded-full">
                  {data?.unreadCount}
                </span>
              )}
            </p>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 h-full flex flex-col bg-white">
        <div className="bg-[#012647] p-5 text-xl font-semibold text-white border-b border-gray-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="bg-[#75000e] text-white p-2 rounded-full md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FiMenu size={24} />
            </button>
            {selectedUser
  ? ` ${users.find((user) => user._id === selectedUser)?.name || "Unknown"}`
  : "Select a user to chat"}

          </div>
          <button className="bg-[#75000e] text-white p-2 rounded-full flex items-center gap-2 hover:bg-[#920019] transition" onClick={handleLogout}>
            <FiLogOut size={20} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>

        <div className="flex-1 p-5 overflow-y-auto">
          {messages.length ? (
            messages.map((msg, idx) => (
              <div key={idx} className={`p-3 my-2 text-md font-medium rounded-lg w-max max-w-xs 
                  ${msg.sender === localStorage.getItem("userId") ? "ml-auto bg-[#75000e] text-white" : "bg-[#012647] text-white"}`}>
                {msg.message}
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {moment(msg.timestamp).format("HH:mm A · DD MMM YYYY")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center text-md">No messages yet</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-5 bg-[#012647] flex items-center border-t border-gray-400">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-3 text-md rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#75000e]"
          />
          <button className="ml-3 px-5 py-3 bg-[#75000e] text-white rounded-lg text-lg hover:bg-[#920019] flex items-center transition" onClick={sendMessage}>
            <FiSend size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
