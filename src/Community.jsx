import React from "react";
import { Trophy, Users, Flame } from "lucide-react";

export default function Community() {
  const leaderboard = [
    { id: 1, name: "Alex Johnson", xp: 2450, streak: 12 },
    { id: 2, name: "Sarah Lee", xp: 2200, streak: 9 },
    { id: 3, name: "Michael Chen", xp: 1980, streak: 7 },
  ];

  const activities = [
    { id: 1, user: "Alex", action: "completed Balance Master", time: "2h ago" },
    { id: 2, user: "Sarah", action: "earned Achievement: Streak Master", time: "5h ago" },
    { id: 3, user: "You", action: "played Memory Match", time: "1d ago" },
  ];

  const challenges = [
    { id: 1, title: "7 Day Streak Challenge", participants: 120 },
    { id: 2, title: "Earn 1000 XP This Week", participants: 85 },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Banner */}
      <div className="bg-gray-900 text-white rounded-xl p-6 shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-[#d6fa61]">
          Welcome to the Community 🎉
        </h2>
        <p className="text-sm text-gray-400">
          Connect, compete, and celebrate recovery with others!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaderboard */}
        <div className="bg-gray-900 rounded-xl p-6 shadow-md border border-gray-700">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-[#ff9cb3]" /> Leaderboard
          </h3>
          <ul className="space-y-3">
            {leaderboard.map((user, i) => (
              <li
                key={user.id}
                className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-bold">#{i + 1}</span>
                  <span className="text-white">{user.name}</span>
                </div>
                <div className="text-[#d6fa61] font-semibold">{user.xp} XP</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Activity Feed */}
        <div className="bg-gray-900 rounded-xl p-6 shadow-md border border-gray-700 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#85c8ff]" /> Recent Activity
          </h3>
          <ul className="space-y-3">
            {activities.map((act) => (
              <li
                key={act.id}
                className="bg-gray-800 p-3 rounded-lg flex justify-between"
              >
                <span className="text-gray-200">
                  <strong className="text-[#ff9cb3]">{act.user}</strong>{" "}
                  {act.action}
                </span>
                <span className="text-xs text-gray-500">{act.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Challenges */}
      <div className="bg-gray-900 rounded-xl p-6 shadow-md border border-gray-700">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-[#d6fa61]" /> Community Challenges
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition"
            >
              <h4 className="text-white font-semibold">{challenge.title}</h4>
              <p className="text-gray-400 text-sm">
                {challenge.participants} participants
              </p>
              <button className="mt-2 px-3 py-1 bg-[#85c8ff] hover:bg-[#5ca8e0] text-black font-semibold rounded-lg text-sm">
                Join Challenge
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
