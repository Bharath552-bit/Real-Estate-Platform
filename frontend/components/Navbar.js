"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function Navbar() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [currentUsername, setCurrentUsername] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  // Ensure this component runs only on the client
  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("accessToken");
      const storedName = localStorage.getItem("username");

      setAccessToken(storedToken);
      setCurrentUsername(storedName || "User");
    }
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    setAccessToken(null);
    router.push("/login");
  };

  return (
    <nav className="bg-gradient-to-l from-[#6254b6] to-[#4634a2] text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-2xl font-extrabold">
        <Link href="/" className="flex items-center space-x-2">
  <img
    src="https://res.cloudinary.com/dmlttdgsk/image/upload/c_crop,w_600,h_600/v1743006162/lrufpwd1imvhk4nlzgmj.jpg"
    alt="logo"
    className="h-10 w-10 object-contain rounded-full"
  />
  <span className="text-xl font-bold text-gold-800">PROPEASE</span>
</Link>
        </div>
        {isClient && (
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="hover:text-gray-300 transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-gray-300 transition-colors">
              Dashboard
            </Link>
            {accessToken ? (
              <>
                <Link href="/chat" className="hover:text-gray-300 transition-colors">
                  Chat
                </Link>
                <span className="text-gray-300 font-semibold">{currentUsername}</span>
                <button onClick={handleLogout} className="hover:text-gray-300 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-gray-300 transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="hover:text-gray-300 transition-colors">
                  Signup
                </Link>
              </>
            )}
          </div>
        )}
        <div className="md:hidden">
          <button className="focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      <AnimatePresence>{/* Optional mobile menu */}</AnimatePresence>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-100 py-4 mt-8">
      <div className="container mx-auto text-center text-gray-600">
        &copy; {new Date().getFullYear()} PROPEASE. All rights reserved.
      </div>
    </footer>
  );
}