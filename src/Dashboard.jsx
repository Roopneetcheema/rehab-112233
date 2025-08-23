import React from "react";
import { Play, Calendar, Flame, Star, Clock } from "lucide-react";

export default function Dashboard({ userStats }) {
  const todayExercises = [
    { id: 1, name: "Level 1", type: "Upper body", duration: "5 min", xp: 150, completed: false },
    { id: 2, name: "Level 2", type: "Lower body", duration: "5 min", xp: 200, completed: false},
    { id: 3, name: "Level 3", type: "Flexibility", duration: "7 min", xp: 120, completed: false },
  ];
//green - #d6fa61   pink  - #ff9cb3   blue - #85c8ff
  return (
    <div className="p-8 space-y-8 min-h-screen ">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-900/80 to-gray-700/50 backdrop-blur-lg border border-gray-700  rounded-2xl p-8 transition hover:scale-[1.01] duration-300 shadow-[0_0_12px_rgba(133,200,255,0.4)]">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">
          Welcome back, Champion!
        </h2>
        <p className="text-gray-400 mb-6 text-lg">
          Ready to continue your recovery journey? You're doing amazing!
        </p>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2 bg-black/50 px-3 py-1 rounded-lg shadow-[0_0_8px_#ff9cb350]">
            <Flame className="w-4 h-4 text-[#ff9cb3]" />
            <span className="text-gray-200">{userStats.streak} day streak</span>
          </div>
          <div className="flex items-center space-x-2 bg-black/50 px-3 py-1 rounded-lg shadow-[0_0_8px_#85c8ff50]">
            <Star className="w-4 h-4 text-[#85c8ff]" />
            <span className="text-gray-200">Level {userStats.level}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Exercises */}
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 shadow-[0_0_25px_rgba(133,200,255,0.06)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-white">Today's Exercises</h3>
            <Calendar className="w-6 h-6 text-gray-400" />
          </div>

          <div className="space-y-4">
            {todayExercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`p-5 rounded-2xl border transition-all duration-300 ${
                  exercise.completed
                    ? "bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600 shadow-[0_0_12px_rgba(214,250,97,0.12)]"
                    : "bg-gradient-to-r from-gray-900 to-gray-700 border-gray-600 hover:shadow-[0_0_20px_rgba(255,156,179,0.2)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left side */}
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-md ${
                        exercise.completed
                          ? "bg-[#d6fa61] text-black shadow-[0_0_10px_#d6fa61]"
                          : "bg-[#ff9cb3] text-black"
                      }`}
                    >
                      {exercise.completed ? "✓" : <Play className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-white">{exercise.name}</h4>
                      <div className="flex items-center space-x-3 text-sm text-gray-400">
                        <span>{exercise.type}</span>
                        <Clock className="w-3 h-3" />
                        <span>{exercise.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="text-right">
                    <div className="text-gray-200 font-bold text-lg">+{exercise.xp} XP</div>
                    {!exercise.completed && (
                      
                      <a
                      href={
                        exercise.id === 1
                          ? "/public/level1.html"          // Level 1 page
                          : exercise.id === 2
                          ? "/public/level2.html"         // Level 2 page
                          : exercise.id === 3
                          ? "/public/leg_raises.html"         // Level 3 page
                          : "/index.html"

                      }
                      target="_self"
                      rel="noopener"
                      className="mt-2 px-5 py-2 bg-[#85c8ff] hover:opacity-90 text-black font-semibold text-sm rounded-xl transition"
                    >
      <button className="mt-2 px-5 py-2 bg-[#85c8ff] hover:opacity-90 text-black font-semibold text-sm rounded-xl transition-all shadow-[0_0_12px_rgba(133,200,255,0.4)]">
        Start
      </button>
    </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 shadow-[0_0_25px_rgba(255,156,179,0.08)]">
          <h3 className="text-xl font-semibold text-white mb-6">This Week</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Completion Rate</span>
                <span className="text-[#d6fa61] font-semibold">95%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 shadow-inner">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-[#d6fa61] to-[#85c8ff] shadow-[0_0_10px_rgba(214,250,97,0.6)]"
                  style={{ width: "95%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">XP Earned</span>
                <span className="text-[#85c8ff] font-semibold">2,840</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 shadow-inner">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-[#85c8ff] to-[#ff9cb3] shadow-[0_0_10px_rgba(133,200,255,0.6)]"
                  style={{ width: "76%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
