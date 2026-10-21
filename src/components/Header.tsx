import React from 'react';
import { Flame, Heart, Zap, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { UserProgress } from '../utils/gamification';

interface HeaderProps {
  progress: UserProgress;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRefillHearts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  activeTab,
  onTabChange,
  onRefillHearts
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-stone-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={() => onTabChange('learn')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          {/* Gorga Shield Motif Icon */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 via-stone-900 to-amber-600 text-white flex items-center justify-center font-black text-lg shadow-[0_3px_0_0_#991b1b] group-hover:scale-105 transition-transform font-['Fredoka',sans-serif] relative overflow-hidden">
            <span className="font-extrabold text-white text-base">BG</span>
            <div className="absolute inset-0 border-2 border-white/20 rounded-2xl pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-red-600 font-['Fredoka',sans-serif]">
                BATAK<span className="text-stone-900">GO</span>
              </span>
              <span className="text-[10px] font-black uppercase bg-red-100 text-red-700 px-1.5 py-0.5 rounded border border-red-200">
                Toba
              </span>
            </div>
            <p className="text-[10px] font-bold text-stone-500 leading-none">
              Parsiajaran Hata Batak
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { id: 'learn', label: 'Belajar', icon: '📖' },
            { id: 'dictionary', label: 'Kamus Audio', icon: '🔊' },
            { id: 'partuturan', label: 'Partuturan', icon: '🤝' },
            { id: 'aksara', label: 'Aksara Batak', icon: '📜' },
            { id: 'leaderboard', label: 'Papan Skor', icon: '🏆' },
            { id: 'ulos', label: 'Koleksi Ulos', icon: '🧣' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs lg:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-red-50 text-red-700 border-2 border-red-200 shadow-sm font-extrabold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Gamification HUD Indicators */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak (Api Semangat) */}
          <div
            title="Pardalanan Ari (Streak Harian)"
            className="flex items-center gap-1.5 bg-amber-50 border-2 border-amber-300 text-amber-800 px-2.5 sm:px-3 py-1.5 rounded-2xl font-extrabold text-xs sm:text-sm font-['Fredoka',sans-serif]"
          >
            <Flame size={18} className="fill-amber-500 text-amber-500 animate-bounce" />
            <span>{progress.streak}</span>
          </div>

          {/* XP Counter */}
          <div
            title="Poin Gordang XP"
            className="flex items-center gap-1.5 bg-yellow-50 border-2 border-yellow-300 text-yellow-900 px-2.5 sm:px-3 py-1.5 rounded-2xl font-extrabold text-xs sm:text-sm font-['Fredoka',sans-serif]"
          >
            <Zap size={18} className="fill-yellow-500 text-yellow-600" />
            <span>{progress.xp}</span>
          </div>

          {/* Hearts / Tondi */}
          <button
            type="button"
            onClick={onRefillHearts}
            title="Klik untuk pulihkan Tondi (Nyawa)"
            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border-2 border-red-300 text-red-700 px-2.5 sm:px-3 py-1.5 rounded-2xl font-extrabold text-xs sm:text-sm cursor-pointer transition-colors font-['Fredoka',sans-serif]"
          >
            <Heart size={18} className="fill-red-500 text-red-500" />
            <span>{progress.hearts}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Mobile Bottom Bar or Sub-header) */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200 bg-white px-2 py-2 overflow-x-auto">
        {[
          { id: 'learn', label: 'Belajar', icon: '📖' },
          { id: 'dictionary', label: 'Kamus', icon: '🔊' },
          { id: 'partuturan', label: 'Partuturan', icon: '🤝' },
          { id: 'aksara', label: 'Aksara', icon: '📜' },
          { id: 'leaderboard', label: 'Juara', icon: '🏆' },
          { id: 'ulos', label: 'Ulos', icon: '🧣' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'text-red-700 bg-red-50 font-black'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
