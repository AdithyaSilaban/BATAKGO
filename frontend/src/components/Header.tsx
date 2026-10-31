import React from 'react';
import {
  Flame,
  Heart,
  Zap,
  User as UserIcon,
  LogOut,
  BookOpen,
  Volume2,
  Users,
  Languages,
  Trophy,
  Plus
} from 'lucide-react';
import { UserProgress } from '../utils/gamification';
import { AuthUser } from '../utils/apiClient';
import { PitaTenun } from './GorgaEmblem';

interface HeaderProps {
  progress: UserProgress;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRefillHearts: () => void;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { id: 'learn', label: 'Belajar', shortLabel: 'Belajar', Icon: BookOpen },
  { id: 'dictionary', label: 'Kamus Audio', shortLabel: 'Kamus', Icon: Volume2 },
  { id: 'partuturan', label: 'Partuturan', shortLabel: 'Partuturan', Icon: Users },
  { id: 'aksara', label: 'Aksara Batak', shortLabel: 'Aksara', Icon: Languages },
  { id: 'leaderboard', label: 'Papan Skor', shortLabel: 'Skor', Icon: Trophy },
];

export const Header: React.FC<HeaderProps> = ({
  progress,
  activeTab,
  onTabChange,
  onRefillHearts,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F4EDE0] border-b-[1.5px] border-[#1E1A17]">
        {/* Pembatas Section: Pita 3 Garis (Arang, Secang, Kapur) setinggi 6px */}
        <PitaTenun />

        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand / Logo */}
          <button
            type="button"
            onClick={() => onTabChange('learn')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer text-left group focus-visible:ring-2 focus-visible:ring-[#23365A] shrink-0"
          >
            <img
              src="/assets/logo.png"
              alt="Logo BatakGO"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0 group-hover:scale-105 transition-transform"
              style={{ imageRendering: 'pixelated' }}
            />

            <div>
              <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
                <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-[#A62B1F]">
                  BATAK<span className="text-[#1E1A17]">GO</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#E8DFC8] text-[#1E1A17] px-1 sm:px-1.5 py-0.5 rounded-[2px] border border-[#1E1A17]">
                  Toba
                </span>
              </div>
              <p className="hidden md:block text-[11px] font-semibold text-[#433D38] mt-1 font-body">
                Parsiajaran Hata Batak
              </p>
            </div>
          </button>

          {/* Navigation Tabs (Desktop Header) */}
          <nav className="hidden lg:flex items-center gap-1 font-body">
            {NAV_ITEMS.map(({ id, label, Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onTabChange(id)}
                  className={`px-3 py-1.5 rounded-[4px] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border-[1.5px] ${
                    isActive
                      ? 'bg-[#E8DFC8] text-[#A62B1F] border-[#1E1A17]'
                      : 'text-[#1E1A17] border-transparent hover:border-[#1E1A17] hover:bg-[#E8DFC8]/60'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-[#A62B1F]' : 'text-[#433D38]'} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* User HUD & Authentication */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 font-body">
            {/* Streak Indicator */}
            <div
              title="Pardalanan Ari (Streak Harian)"
              className="flex items-center gap-1 bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] text-[#1E1A17] px-2 py-1 sm:px-2.5 rounded-[4px] text-xs font-bold"
            >
              <Flame size={14} className="fill-[#D9A21B] text-[#D9A21B]" />
              <span>{progress.streak}</span>
            </div>

            {/* XP Indicator */}
            <div
              title="Poin Gordang XP"
              className="flex items-center gap-1 bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] text-[#1E1A17] px-2 py-1 sm:px-2.5 rounded-[4px] text-xs font-bold"
            >
              <Zap size={14} className="fill-[#1E1A17] text-[#1E1A17]" />
              <span>{progress.xp}</span>
              <span className="hidden sm:inline text-[10px] text-[#433D38] font-normal">XP</span>
            </div>

            {/* Hearts / Tondi Indicator */}
            <button
              type="button"
              onClick={onRefillHearts}
              title="Sistem Nyawa Tondi (Klik untuk pulihkan penuh)"
              className="flex items-center gap-1 bg-[#FAF6EE] border-[1.5px] border-[#A62B1F] hover:bg-[#E8DFC8] text-[#A62B1F] px-2 py-1 sm:px-2.5 rounded-[4px] text-xs font-bold cursor-pointer transition"
            >
              <Heart size={14} className="fill-[#A62B1F] text-[#A62B1F]" />
              <span>{progress.hearts}</span>
              <Plus size={11} className="text-[#A62B1F]" />
            </button>

            {/* User Account / Profile */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l-[1.5px] border-[#1E1A17]">
                <div
                  title={`${currentUser.name} (${currentUser.marga || 'Batak'})`}
                  className="flex items-center gap-1.5 bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] text-[#1E1A17] px-2 py-1 sm:px-2.5 rounded-[4px] text-xs font-bold max-w-[150px] truncate"
                >
                  <span className="text-xs shrink-0">{currentUser.avatar || '🧒'}</span>
                  <span className="truncate hidden md:inline">
                    {currentUser.name.split(' ')[0]} {currentUser.marga ? `(${currentUser.marga})` : ''}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  title="Keluar Sesi (Logout)"
                  className="text-[#433D38] hover:text-[#A62B1F] hover:bg-[#E8DFC8] p-1 sm:p-1.5 rounded-[4px] border border-transparent hover:border-[#1E1A17] transition cursor-pointer flex items-center justify-center shrink-0"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="btn-indigo px-2.5 sm:px-3.5 py-1 text-xs"
              >
                <UserIcon size={13} className="mr-1" />
                <span>Masuk</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar (App-like thumb reach) */}
      <nav
        aria-label="Navigasi Utama Ponsel"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF6EE] border-t-[1.5px] border-[#1E1A17] px-1 py-1.5 flex items-center justify-around font-body shadow-[0_-4px_12px_rgba(0,0,0,0.06)] pb-[max(0.4rem,env(safe-area-inset-bottom))]"
      >
        {NAV_ITEMS.map(({ id, label, shortLabel, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                onTabChange(id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 py-1 px-1 rounded-[4px] text-[10px] sm:text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 transition cursor-pointer ${
                isActive
                  ? 'text-[#A62B1F] bg-[#E8DFC8] border border-[#1E1A17]'
                  : 'text-[#433D38] border border-transparent hover:text-[#1E1A17]'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-[#A62B1F]' : 'text-[#433D38]'} />
              <span className="truncate max-w-[64px] sm:max-w-none">{shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
