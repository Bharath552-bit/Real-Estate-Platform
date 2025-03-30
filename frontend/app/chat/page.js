"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatRoomList() {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Helper function to decode token and get current user id
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        return decoded.user_id;
      }
    } catch (e) {
      console.error("Error decoding token:", e);
    }
    return null;
  };

  const currentUserId = getCurrentUserId();

  useEffect(() => {
    const accessToken =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!accessToken) {
      router.push("/login");
      return;
    }

    const fetchChatrooms = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/chats/rooms/?role=buyer", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch chatrooms");
        }

        const data = await response.json();
        setChatRooms(data);
      } catch (error) {
        console.error("Error fetching chatrooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatrooms();
  }, [router]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading chatrooms...
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl p-6 bg-white rounded-xl shadow-lg border border-gray-300">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">💬 Your Chats</h1>
        {chatRooms.length > 0 ? (
          <ul className="space-y-3">
            <AnimatePresence>
              {chatRooms.map((room, index) => {
                // Determine partner's name using the same logic as in ChatRoomDetail:
                // If the current user is the seller, partner is the buyer; otherwise, it's the seller.
                const partnerName =
                  currentUserId === room.seller?.id
                    ? room.buyer?.username
                    : room.seller?.username || "User";

                // Show a preview of the last message (if available)
                const lastMessage =
                  room.messages && room.messages.length > 0
                    ? room.messages[room.messages.length - 1]
                    : null;
                const lastMessagePreview = lastMessage
                  ? `${lastMessage.sender?.username || "Unknown"}: ${lastMessage.message.slice(0, 30)}...`
                  : "Start a conversation";

                return (
                  <motion.li
                    key={room.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    whileHover={{ scale: 1.02 }}
                    drag="y"
                    dragConstraints={{ top: -50, bottom: 50 }}
                    dragElastic={0.2}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow flex items-center gap-3 cursor-pointer transition-all"
                    onClick={() => router.push(`/chat/${room.id}`)}
                  >
                    <div className="w-12 h-12 flex justify-center items-center bg-[#6254b6] text-white rounded-full text-lg font-semibold">
                      {partnerName?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{partnerName}</p>
                      <p className="text-gray-600 text-sm">{lastMessagePreview}</p>
                    </div>
                    <span className="text-sm text-gray-400">➡</span>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        ) : (
          <p className="text-center text-gray-600">No chat rooms available.</p>
        )}
      </div>
    </div>
  );
}
