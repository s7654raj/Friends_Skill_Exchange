import React, { useEffect, useState, useRef, useContext } from "react";
import io from "socket.io-client";
import axios from "../utils/axios";
import { AuthContext } from "../contexts/AuthContext";

const socket = io("http://localhost:8000");

export default function ChatPage() {
  const { user, loading } = useContext(AuthContext);
  const currentUser = user || { _id: "USER1_ID", name: "User 1" };

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showNewConversationInput, setShowNewConversationInput] = useState(false);
  const [friendNames, setFriendNames] = useState({}); // Map of userId to userName

  const scrollRef = useRef();

  useEffect(() => {
    if (!loading && currentUser._id) {
      fetchConversations();
    }
  }, [loading, currentUser]);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      if (currentChat && data.senderId === currentChat.members.find(m => m !== currentUser._id)) {
        setMessages((prev) => [...prev, { sender: data.senderId, text: data.text, createdAt: new Date() }]);
      }
    });
    return () => {
      socket.off("getMessage");
    };
  }, [currentChat, currentUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`/chat/conversations/${currentUser._id}`);
      setConversations(res.data);
      if (res.data.length > 0) {
        setCurrentChat(res.data[0]);
        fetchMessages(res.data[0]._id);
      }
      // Fetch friend names for each conversation
      const friendIds = res.data.map(conv => conv.members.find(m => m !== currentUser._id));
      if (friendIds.length > 0) {
        const uniqueFriendIds = [...new Set(friendIds)];
        const friendNamesMap = {};
        // Fetch user info for each friendId
        await Promise.all(uniqueFriendIds.map(async (friendId) => {
          try {
            const userRes = await axios.get(`/auth/users/search?name=`); // empty name to get all users? Not ideal
            // Instead, fetch user by ID - but no such API found, so fallback to search by name is not possible here
            // So we will fetch user info by filtering search results
            // But since we don't have user name, this is not feasible
            // Alternative: create a new API to get user by ID or modify backend to populate user info in conversations
            // For now, skip fetching user names
          } catch (err) {
            console.error(`Error fetching user info for ${friendId}:`, err);
          }
        }));
        setFriendNames(friendNamesMap);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const res = await axios.get(`/chat/messages/${conversationId}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setCurrentChat(conversation);
    fetchMessages(conversation._id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentChat) return;
    const message = {
      conversationId: currentChat._id,
      sender: currentUser._id,
      text: newMessage.trim(),
    };
    try {
      const res = await axios.post("/chat/message", message);
      setMessages((prev) => [...prev, res.data]);
      socket.emit("sendMessage", {
        senderId: currentUser._id,
        receiverId: currentChat.members.find((m) => m !== currentUser._id),
        text: newMessage.trim(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleStartNewConversation = () => {
    setShowNewConversationInput(true);
    setSearchName("");
    setSearchResults([]);
    setSelectedUserId(null);
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchName(value);
    setSelectedUserId(null);
    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      const res = await axios.get(`auth/users/search?name=${encodeURIComponent(value)}`);
      setSearchResults(res.data.filter(u => u._id !== currentUser._id));
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
  };

  const handleCreateConversation = async () => {
    if (!selectedUserId) return;
    try {
      const res = await axios.post("/chat/conversation", {
        senderId: currentUser._id,
        receiverId: selectedUserId,
      });
      setShowNewConversationInput(false);
      setSearchName("");
      setSearchResults([]);
      setSelectedUserId(null);
      fetchConversations();
      setCurrentChat(res.data);
      fetchMessages(res.data._id);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <div className="w-1/3 p-8 bg-white shadow-2xl flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold text-indigo-700 mb-4">
            FriendSkillExchange 💬
          </h2>
          <p className="text-gray-600 mb-8">
            Connect and chat seamlessly with your friends in real-time.
          </p>
          {!showNewConversationInput && (
            <button
              onClick={handleStartNewConversation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Start a New Conversation
            </button>
          )}
          {showNewConversationInput && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search users by name"
                value={searchName}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {searchResults.length > 0 && (
                <ul className="border border-gray-300 rounded max-h-48 overflow-y-auto mt-2">
                  {searchResults.map((user) => (
                    <li key={user._id} className="flex items-center px-4 py-2 hover:bg-blue-100 cursor-pointer">
                      <input
                        type="radio"
                        name="selectedUser"
                        value={user._id}
                        checked={selectedUserId === user._id}
                        onChange={() => handleSelectUser(user._id)}
                        className="mr-2"
                      />
                      <span className={selectedUserId === user._id ? "font-semibold" : ""}>
                        {user.name} ({user.email})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={handleCreateConversation}
                disabled={!selectedUserId}
                className={`mt-2 px-4 py-2 rounded-lg font-semibold text-white ${
                  selectedUserId ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Start Chat
              </button>
              <button
                onClick={() => setShowNewConversationInput(false)}
                className="mt-2 text-sm text-gray-500 underline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="mt-6 overflow-y-auto flex-1">
          {conversations.length === 0 && !showNewConversationInput && (
            <p className="text-gray-400 text-sm">No conversations found.</p>
          )}
          {conversations.map((conv) => {
            const friendId = conv.members.find((m) => m !== currentUser._id);
            const friendName = friendNames[friendId] || friendId;
            return (
              <div
                key={conv._id}
                onClick={() => handleSelectConversation(conv)}
                className={`cursor-pointer p-3 rounded-lg ${
                  currentChat?._id === conv._id ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
                }`}
              >
                Conversation with {friendName}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 p-8 flex flex-col">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
          {currentChat ? `Chatting with your Friend ✨` : "Start a conversation"}
        </h2>
        <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-inner p-6 space-y-2 h-[calc(100vh-220px)]">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-10">No messages yet. Start chatting now!</p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              ref={i === messages.length - 1 ? scrollRef : null}
              className={`px-4 py-2 rounded-lg max-w-[75%] text-sm font-medium shadow-sm ${
                m.sender === currentUser._id
                  ? "ml-auto bg-blue-500 text-white text-right"
                  : "mr-auto bg-gray-200 text-gray-800"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-3">
          <input
            type="text"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!currentChat}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!currentChat}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
