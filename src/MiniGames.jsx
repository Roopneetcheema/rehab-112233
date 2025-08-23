import React from 'react';
import { Gamepad2, Trophy, ArrowRightCircle, Lock } from 'lucide-react';

export default function MiniGames({ onPlay }) {
  const games = [
    { id: 1, title: "Flappy Bird", description: "Guide your bird through pipes.", xp: 350, icon: "🕊", link: "/flappy.html", locked: false },
    { id: 2, title: "Fruit Ninja", description: "Test your precision and focus.", xp: 250, icon: "🥭", link: "/fruit.html", locked: false },
    { id: 3, title: "Wack A Mole", description: "Stomp on all the moles", xp: 300, icon: "🦦", link: "/mole.html", locked: false },
    { id: 4, title: "Darts", description: "Aim for the bullseye and rack up points.", xp: 275, icon: "🎯", link: "/darts.html", locked: true },
    { id: 5, title: "Puzzle Quest", description: "Solve puzzles and sharpen your mind.", xp: 150, icon: "🧩", locked: true },
    { id: 6, title: "Snake", description: "Grow and survive as long as possible.", xp: 180, icon: "🐍", locked: true },
    { id: 7, title: "Memory Flip", description: "Match cards and test your memory.", xp: 220, icon: "🃏", locked: true },
    { id: 8, title: "Tetris", description: "Stack blocks and clear lines.", xp: 260, icon: "🧱", locked: true },
  ];

  const GameCard = ({ game }) => {
    return (
      <div
        className={`relative rounded-xl p-6 shadow-lg transition-all duration-300 flex flex-col items-center text-center
        bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
        ${game.locked
          ? "opacity-50 cursor-not-allowed" // dim & disable pointer
          : "hover:scale-105 hover:shadow-[0_0_18px_rgba(255,255,255,0.25)]"
        }`}
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-lg flex items-center justify-center text-4xl bg-gray-800 mb-4 border border-gray-700">
          {game.icon}
        </div>

        {/* Title + Description */}
        <h3 className="font-bold text-gray-100 text-lg">{game.title}</h3>
        <p className="text-gray-400 text-sm mb-6">{game.description}</p>

        {/* XP */}
        <div className="text-yellow-300 font-semibold flex items-center space-x-1 mb-4">
          <Trophy className="w-4 h-4" />
          <span>+{game.xp} XP</span>
        </div>

        {/* Play / Locked */}
        {game.locked ? (
          <button
            disabled
            className="w-full px-4 py-2 rounded-lg font-medium text-sm
            bg-gradient-to-r from-[#d6fa61] to-[#85c8ff] text-black flex items-center justify-center space-x-2"
          >
            <Lock className="w-5 h-5" />
            <span>Coming Soon</span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (onPlay) onPlay(game.id);
              window.location.href = game.link;
            }}
            className="w-full px-4 py-2 rounded-lg font-medium text-sm
            bg-gradient-to-r from-[#d6fa61] to-[#85c8ff] text-black
            hover:shadow-[0_0_12px_rgba(214,250,97,0.6)] flex items-center justify-center space-x-2 transition-all duration-200"
          >
            <span>Play</span>
            <ArrowRightCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Mini Games</h2>
          <p className="text-gray-400">Have fun, challenge yourself, and earn rewards</p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-900 border border-gray-700 px-4 py-2 rounded-lg shadow-md">
          <Gamepad2 className="w-5 h-5 text-[#d6fa61]" />
          <span className="text-white font-semibold">{games.length} Games Available</span>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}