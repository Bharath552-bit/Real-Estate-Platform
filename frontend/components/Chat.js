"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Chat({ chatroomId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/chat/rooms/${chatroomId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/chat/messages/send/",
        { chatroom: chatroomId, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container p-4 border rounded bg-gray-800 text-white">
      <h2 className="text-lg font-bold mb-2">Chat Room</h2>
      <div className="messages h-64 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.sender.username === localStorage.getItem("username") ? "text-right" : "text-left"}>
            <p className="p-2 bg-gray-700 rounded inline-block">{msg.sender.username}: {msg.message}</p>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          className="flex-1 p-2 border rounded bg-gray-900 text-white"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="ml-2 p-2 bg-blue-500 rounded" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
