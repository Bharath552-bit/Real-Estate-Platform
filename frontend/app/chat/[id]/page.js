"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ChatRoomDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [chatroom, setChatroom] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChatroom();
    const interval = setInterval(fetchChatroom, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchChatroom = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:8000/api/chats/rooms/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatroom(res.data);
    } catch (err) {
      console.error("Error fetching chatroom:", err.response?.data || err);
    }
  };

  const sendMessage = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || newMessage.trim() === "") return;
    try {
      const res = await axios.post(
        "http://localhost:8000/api/chats/messages/send/",
        { chatroom: id, message: newMessage, reply_to: replyTo ? replyTo.id : null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChatroom((prev) => ({
        ...prev,
        messages: [...prev.messages, res.data],
      }));
      setNewMessage("");
      setReplyTo(null);
    } catch (err) {
      console.error("Error sending message:", err.response?.data || err);
    }
  };

  const deleteMessage = async (messageId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      await axios.delete(`http://localhost:8000/api/chats/messages/delete/${messageId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatroom((prev) => ({
        ...prev,
        messages: prev.messages.filter((msg) => msg.id !== messageId),
      }));
    } catch (err) {
      console.error("Error deleting message:", err.response?.data || err);
    }
  };

  const currentUserId = (() => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        return decoded.user_id;
      }
    } catch (e) {
      console.error("Error decoding token:", e);
      return null;
    }
  })();

  const partnerName =
    currentUserId === chatroom?.seller?.id ? chatroom?.buyer?.username : chatroom?.seller?.username;

  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200 min-h-[70vh]">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        💬 Chat with {partnerName}
      </h2>

      {/* Chat Messages */}
      <div className="max-h-[50vh] overflow-y-auto mb-6 space-y-4 p-4 bg-gray-100 rounded-lg shadow-sm">
        {chatroom?.messages?.length > 0 ? (
          chatroom.messages.map((msg) => {
            const isCurrentUser = msg.sender.id === currentUserId;
            return (
              <motion.div
                key={msg.id}
                className={`flex items-end gap-2 ${isCurrentUser ? "justify-start" : "justify-end"}`}
                initial={{ opacity: 0, x: isCurrentUser ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isCurrentUser && <div className="flex-1" />}
                <div className="relative max-w-xs p-3 rounded-lg shadow text-gray-800">
                  {msg.reply_to && (
                    <div className="bg-gray-300 text-xs p-2 rounded mb-1">
                      <strong>{msg.reply_to.sender.username}:</strong> {msg.reply_to.message}
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-lg ${
                      isCurrentUser ? "bg-[#4634a2] text-white" : "bg-green-500 text-white"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                    <small className="block text-right text-xs opacity-80 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </small>
                  </div>

                  <div className="absolute -bottom-5 right-1 flex space-x-2 text-xs">
                    {!isCurrentUser && (
                      <motion.button
                        onClick={() => setReplyTo(msg)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-500 hover:text-blue-500"
                        title="Reply to this message"
                      >
                        ↩ Reply
                      </motion.button>
                    )}
                    {isCurrentUser && (
                      <motion.button
                        onClick={() => deleteMessage(msg.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Message"
                      >
                        ✖ Delete
                      </motion.button>
                    )}
                  </div>
                </div>
                {!isCurrentUser && <div className="flex-1" />}
              </motion.div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center">No messages yet.</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      {replyTo && (
        <div className="flex items-center bg-gray-200 text-gray-800 p-3 rounded-lg mb-2">
          <p className="flex-grow text-sm">
            Replying to <strong>{replyTo.sender.username}</strong>: {replyTo.message}
          </p>
          <button
            onClick={() => setReplyTo(null)}
            className="text-red-500 hover:text-red-700 ml-3"
          >
            ✖
          </button>
        </div>
      )}

      {/* Message Input */}
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-3 rounded bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <motion.button
          onClick={sendMessage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#6254b6] text-white px-5 py-3 rounded hover:bg-blue-600 transition"
        >
          Send
        </motion.button>
      </div>
    </div>
  );
}
