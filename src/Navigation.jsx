import React, { useState } from 'react';
import { Home, Gamepad2, BarChart3, Users, Menu } from 'lucide-react';

export default function Navigation({ currentView, setCurrentView }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, glow: 'from-[#d6fa61]/80 to-[#85c8ff]/80' },
    { id: 'challenges', label: 'Mini games', icon: Gamepad2, glow: 'from-[#85c8ff]/80 to-[#ff9cb3]/80' },
    { id: 'progress', label: 'Progress', icon: BarChart3, glow: 'from-[#d6fa61]/80 to-[#85c8ff]/80' },
    { id: 'community', label: 'Community', icon: Users, glow: 'from-[#ff9cb3]/80 to-[#d6fa61]/80' },
    { id: 'doctor', label: 'Doctor', icon: Users, glow: 'from-[#ff9cb3]/80 to-[#d6fa61]/80' },
  ];

  return (
    <nav className="relative h-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-gray-800"></div>
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block relative p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 relative ${
                isActive
                  ? `bg-gradient-to-r ${item.glow} text-black shadow-lg shadow-black/40`
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              {isActive && (
                <span
                  className={`absolute -inset-[1px] rounded-lg blur-md bg-gradient-to-r ${item.glow} opacity-70`}
                />
              )}

              <div className="relative flex items-center space-x-3 z-10">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>

              {isActive && (
                <div className="w-2 h-2 bg-gray-800 rounded-full ml-auto animate-pulse relative z-10"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Dropdown */}
      <div className="md:hidden relative p-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-gray-800/70 text-white font-medium"
        >
          <span>
            {navItems.find((item) => item.id === currentView)?.label || 'Menu'}
          </span>
          <Menu className="w-5 h-5" />
        </button>

        {mobileOpen && (
          <div className="mt-2 bg-gray-900/90 rounded-lg shadow-lg border border-gray-700">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-md block ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-[#d6fa61]/80 to-[#85c8ff]/80 text-black'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
