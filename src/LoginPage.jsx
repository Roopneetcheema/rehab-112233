import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bgVid from "./assets/bg_vid.mp4";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      navigate("/app"); // redirect to dashboard
    } else {
      alert("Please enter valid credentials");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={bgVid}
        autoPlay
        loop
        muted
        playsInline
      ></video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Login Card */}
      <motion.form
        onSubmit={handleLogin}
        className="relative z-10 bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-xl w-96 text-white"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center tracking-wide">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-[#161b19] border border-gray-900 
                     focus:outline-none focus:ring-2 focus:ring-[#90aa3b] text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 rounded-lg bg-[#161b19] border border-gray-900 
                     focus:outline-none focus:ring-2 focus:ring-[#90aa3b] text-white"
        />

        <motion.button
          type="submit"
          className="w-full py-3 rounded-xl bg-[#90aa3b] shadow-lg shadow-black/30 
                     hover:bg-[#4c8005] hover:scale-105 transform transition 
                     duration-300 ease-in-out text-white font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>
      </motion.form>
    </div>
  );
}
