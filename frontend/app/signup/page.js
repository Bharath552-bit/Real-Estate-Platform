"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) router.push("/dashboard");
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showPopup = (message, isError = false) => {
    setPopup({ message, isError });
    setTimeout(() => setPopup(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/auth/signup/", formData);
      showPopup("Signup successful! Redirecting to Login...", false);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      const errMsg = err.response?.data
        ? JSON.stringify(err.response.data)
        : "Server error. Please try again.";
      showPopup(errMsg, true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl border border-gray-300">
      <h2 className="text-3xl font-bold text-center mb-6 text-teal-600">Signup</h2>
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 p-3 rounded ${
              popup.isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            } border ${popup.isError ? "border-red-400" : "border-green-400"}`}
          >
            {popup.message}
          </motion.div>
        )}
      </AnimatePresence>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 bg-white border border-gray-400 rounded focus:outline-none focus:border-[#4634a2] text-gray-800"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 bg-white border border-gray-400 rounded focus:outline-none focus:border-[#4634a2] text-gray-800"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 bg-white border border-gray-400 rounded focus:outline-none focus:border-[#4634a2] text-gray-800"
          required
        />
        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          value={formData.password2}
          onChange={handleChange}
          className="w-full p-3 bg-white border border-gray-400 rounded focus:outline-none focus:border-[#4634a2] text-gray-800"
          required
        />
        <button
          type="submit"
          className="w-full bg-teal-600 text-white p-3 rounded hover:bg-teal-700 transition"
        >
          Signup
        </button>
      </form>
    </div>
  );
}
