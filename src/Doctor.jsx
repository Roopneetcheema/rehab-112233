import React from "react";
import doctorImg from "./assets/doctor.png";

export default function DoctorSection() {
  return (
    <div className="max-w-5/6 mx-auto  text-gray-200 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.05)]  p-6 space-y-6">
      {/* Doctor Info */}
      <div className="flex items-center gap-6">
        <img
          src={doctorImg}
          alt="Doctor"
          className="w-24 h-24 rounded-full border-1 border-[#85c8ff] shadow-[0_0_15px_#85c8ff] object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold text-white">Dr. Sarah Johnson</h2>
          <p className="text-gray-400 italic">MD, Physiotherapist</p>
          <p className="text-gray-500">📞 +1 234 567 890</p>
          <p className="text-gray-500">📧 sarah.johnson@hospital.com</p>
        </div>
      </div>

      {/* Doctor's Message */}
      <div className="bg-gray-800 p-4 rounded-xl border-l-4 border-[#ff9cb3] shadow-[0_0_12px_#ff9cb3]/50">
        <h3 className="text-[#ff9cb3] font-semibold mb-2">
           Doctor’s Message
        </h3>
        <p className="italic text-gray-300">
          “Every small effort you make today is building a healthier tomorrow.
          Stay consistent, stay strong!”
        </p>
      </div>

      {/* Appointment Section */}
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-[0_0_12px_rgba(255,255,255,0.05)]">
        <h3 className="text-white font-semibold text-lg mb-4">
           Book an Appointment
        </h3>
        <div className="flex flex-col gap-3">
          <label className="flex justify-between items-center">
            <span className="text-gray-200">Choose Date:</span>
            <input
              type="date"
              className="bg-gray-700 text-white px-3 py-1 rounded-md outline-none focus:ring-2 focus:ring-[#d6fa61]"
            />
          </label>
          <label className="flex justify-between items-center">
            <span className="text-gray-200">Choose Time:</span>
            <input
              type="time"
              className="bg-gray-700 text-white px-3 py-1 rounded-md outline-none focus:ring-2 focus:ring-[#85c8ff]"
            />
          </label>
          <button className="mt-3 px-4 py-2 rounded-full bg-gradient-to-br from-[#ff9cb3]/80 to-[#d6fa61]/80 text-black font-semibold shadow-[0_0_10px_rgba(255,255,255,0.1)] border border-gray-600 hover:shadow-[0_0_15px_#d6fa61] hover:border-[#d6fa61] transition-all">
            Get Appointment
          </button>
        </div>
      </div>
    </div>
  );
}