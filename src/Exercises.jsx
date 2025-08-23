import React, { useState } from 'react';
import { Play, Lock, Clock, Target } from 'lucide-react';

export default function ExerciseLevels() {
  const [currentLevel, setCurrentLevel] = useState(1);

  const exercises = [
    { id: 1, name: 'Balance Ball Challenge', duration: '10 min', xp: 120, description: 'Master balance with ball games', image: '🎯' },
    { id: 2, name: 'Strength Tower Builder', duration: '15 min', xp: 180, description: 'Build towers, build strength', image: '🏗️' },
    { id: 3, name: 'Flexibility Flow Garden', duration: '12 min', xp: 100, description: 'Stretch and grow a garden', image: '🌸' },
    { id: 4, name: 'Coordination Dance ', duration: '20 min', xp: 250, description: 'Dance your way to coordination', image: '💃' },
  ];

  const handleStart = (exercise) => {
    alert(`Starting: ${exercise.name}`);
    setCurrentLevel(exercise.id + 1); // unlock next level
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-100">Exercise Levels</h2>
      <p className="text-gray-400">Complete each level to unlock the next one!</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {exercises.map((exercise, index) => {
          const unlocked = exercise.id <= currentLevel;
          return (
            <div
              key={exercise.id}
              className={`relative rounded-xl p-3 shadow-md transition-all duration-300 transform ${
                unlocked
                  ? "bg-gradient-to-br from-gray-800 to-gray-700 hover:scale-105 hover:shadow-[0_0_18px_rgba(255,255,255,0.3)]"
                  : "bg-gray-900 opacity-60"
              }`}
            >
              {/* Icon + Lock overlay */}
              <div className="h-20 flex items-center justify-center text-3xl relative">
                {exercise.image}
                {!unlocked && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <h3
                className={`font-semibold text-sm mt-2 ${
                  unlocked ? "text-gray-100" : "text-gray-500"
                }`}
              >
                Level {index + 1}: {exercise.name}
              </h3>
              <p
                className={`text-xs ${
                  unlocked ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {exercise.description}
              </p>

              <div className="flex items-center justify-between text-xs mt-2">
                <div className={`flex items-center space-x-1 ${unlocked ? "text-gray-300" : "text-gray-600"}`}>
                  <Clock className="w-3 h-3" />
                  <span>{exercise.duration}</span>
                </div>
                <div className={`flex items-center space-x-1 ${unlocked ? "text-gray-300" : "text-gray-600"}`}>
                  <Target className="w-3 h-3" />
                  <span>+{exercise.xp} XP</span>
                </div>
              </div>

              {/* Button */}
              <button
                disabled={!unlocked}
                onClick={() => handleStart(exercise)}
                className={`w-full mt-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  unlocked
                    ? "bg-gradient-to-r from-[#d6fa61] to-[#85c8ff] text-black hover:shadow-[0_0_12px_rgba(214,250,97,0.6)]"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                {unlocked ? (
                  <div className="flex items-center justify-center space-x-1">
                    <Play className="w-3 h-3" />
                    <span>Start</span>
                  </div>
                ) : (
                  <span>Locked</span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
