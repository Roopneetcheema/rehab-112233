import React, { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Dashboard from './Dashboard';
import Exercises from './Exercises';
import MiniGames from './MiniGames';
import Progress from './Progress';
import Community from './Community';
import Doctor from './Doctor';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const userStats = {
    level: 12,
    xp: 18420,
    xpToNext: 580,
    streak: 7,
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard userStats={userStats} />;
      case 'exercises':
        return <Exercises />;
      case 'challenges':
        return <MiniGames />;
      case 'progress':
        return <Progress />;
      case 'community':
        return (
         < Community/>
        );
        case 'doctor':
        return (
         <Doctor/>
        );
      default:
        return <Dashboard userStats={userStats} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-gray-800 backdrop-blur-md text-white">
      {/* Sticky Header */}
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        userStats={userStats}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sticky Sidebar */}
        <aside className="w-64 hidden md:block bg-gray-900 border-r border-gray-700 sticky top-0 h-screen">
          <Navigation currentView={currentView} setCurrentView={setCurrentView} />
        </aside>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-4 py-2">
        <div className="flex justify-around">
          {['dashboard', 'exercises', 'challenges', 'progress'].map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`p-2 rounded-lg capitalize ${
                currentView === view ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
