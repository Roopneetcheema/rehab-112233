import React, { useState } from 'react';
import { TrendingUp, Calendar, Target, Award, BarChart3, Activity } from 'lucide-react';

export default function Progress() {
  const [timeRange, setTimeRange] = useState('week');

  const progressData = {
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      exercises: [3, 2, 4, 3, 5, 2, 4],
      xp: [300, 200, 450, 350, 520, 180, 410]
    },
    month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      exercises: [18, 22, 20, 23],
      xp: [1800, 2200, 2000, 2300]
    }
  };

  const stats = [
    { label: 'Total Sessions', value: '147', icon: Activity, color: 'blue', trend: '+12%' },
    { label: 'XP Earned', value: '18,420', icon: Target, color: 'pink', trend: '+23%' },
    { label: 'Streak Record', value: '21 days', icon: Award, color: 'green', trend: 'New!' },
    { label: 'Improvement', value: '+34%', icon: TrendingUp, color: 'blue', trend: '+5%' },
  ];

  const achievements = [
    { name: 'First Steps', description: 'Complete your first exercise', earned: true, date: '2 weeks ago' },
    { name: 'Consistency King', description: '7 day streak achieved', earned: true, date: '1 week ago' },
    { name: 'Balance Master', description: 'Complete 50 balance exercises', earned: true, date: '3 days ago' },
    { name: 'Strength Builder', description: 'Complete 100 strength exercises', earned: false, progress: 67 },
    { name: 'Marathon Runner', description: '30 day streak', earned: false, progress: 23 },
  ];

  // Color mapping with your palette
  const getStatColor = (color) => {
    const colors = {
      green: 'bg-[#d6fa61]',
      pink: 'bg-[#ff9cb3]',
      blue: 'bg-[#85c8ff]',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-6 space-y-6  min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Progress Tracking</h2>
          <p className="text-gray-400">Monitor your recovery journey and celebrate milestones</p>
        </div>
        <div className="flex space-x-2">
          {['week', 'month'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                timeRange === range
                  ? 'bg-white text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatColor(stat.color)}`}>
                  <Icon className="w-5 h-5 text-black" />
                </div>
                <span className="text-sm text-gray-400">{stat.trend}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exercise Chart */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Exercise Activity</span>
            </h3>
            <span className="text-sm text-gray-400">This {timeRange}</span>
          </div>
          <div className="space-y-4">
            {progressData[timeRange].labels.map((label, index) => {
              const exerciseCount = progressData[timeRange].exercises[index];
              const maxExercises = Math.max(...progressData[timeRange].exercises);
              const width = (exerciseCount / maxExercises) * 100;
              return (
                <div key={label} className="flex items-center space-x-3">
                  <div className="w-12 text-sm text-gray-400">{label}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full bg-[#85c8ff] transition-all duration-300"
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                  <div className="w-8 text-sm text-gray-300 text-right">{exerciseCount}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* XP Chart */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>XP Earned</span>
            </h3>
            <span className="text-sm text-gray-400">This {timeRange}</span>
          </div>
          <div className="space-y-4">
            {progressData[timeRange].labels.map((label, index) => {
              const xpAmount = progressData[timeRange].xp[index];
              const maxXP = Math.max(...progressData[timeRange].xp);
              const width = (xpAmount / maxXP) * 100;
              return (
                <div key={label} className="flex items-center space-x-3">
                  <div className="w-12 text-sm text-gray-400">{label}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full bg-[#ff9cb3] transition-all duration-300"
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-sm text-gray-300 text-right">{xpAmount}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
