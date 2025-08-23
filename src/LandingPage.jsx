import React from "react";
import bgVid from "./assets/bg_vid.mp4"; 
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={bgVid}
        autoPlay
        loop
        muted
        playsInline
      ></video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content slides in from left */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      >
        <h1
          className="text-7xl md:text-8xl font-extrabold mb-1 tracking-tight"
          style={{ fontFamily: "MyFont" }}
        >
          Rehabify
        </h1>

        <p className="mb-4 text-lg md:text-xl font-light">
          Healing, one step at a time
        </p>

        <motion.button
          onClick={() => navigate("/app")}
          className="px-8 py-3 rounded-xl bg-[#90aa3b] shadow-lg shadow-black/30 
                     hover:bg-[#4c8005] hover:scale-105 transform transition 
                     duration-300 ease-in-out text-white font-semibold"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  );
}
