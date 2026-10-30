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
import { GorgaShield, PitaTenun } from './GorgaEmblem';

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
  { id: 'learn', label: 'Belajar', Icon: BookOpen },
  { id: 'dictionary', label: 'Kamus Audio', Icon: Volume2 },
  { id: 'partuturan', label: 'Partuturan', Icon: Users },
  { id: 'aksara', label: 'Aksara Batak', Icon: Languages },
  { id: 'leaderboard', label: 'Papan Skor', Icon: Trophy },

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
    <header className="sticky top-0 z-40 bg-[#F4EDE0] border-b-[1.5px] border-[#1E1A17]">
      {/* Pembatas Section: Pita 3 Garis (Arang, Secang, Kapur) setinggi 6px */}
      <PitaTenun />

      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <button
          type="button"
          onClick={() => onTabChange('learn')}
          className="flex items-center gap-3 cursor-pointer text-left group focus-visible:ring-2 focus-visible:ring-[#23365A]"
        >
          <img
            src="/assets/logo.png"
            alt="Logo BatakGO"
            className="w-10 h-10 object-contain shrink-0 group-hover:scale-105 transition-transform"
            style={{ imageRendering: 'pixelated' }}
          />

          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-heading text-xl font-bold tracking-tight text-[#A62B1F]">
                BATAK<span className="text-[#1E1A17]">GO</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E8DFC8] text-[#1E1A17] px-1.5 py-0.5 rounded-[2px] border border-[#1E1A17]">
                Toba
              </span>
            </div>
            <p className="text-[11px] font-semibold text-[#433D38] mt-1 font-body">
              Parsiajaran Hata Batak
            </p>
          </div>
        </button>

        {/* Navigation Tabs (Desktop) */}
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
        <div className="flex items-center gap-2 sm:gap-2.5 font-body">
          {/* Streak Indicator */}
          <div
            title="Pardalanan Ari (Streak Harian)"
            className="flex items-center gap-1 bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] text-[#1E1A17] px-2.5 py-1 rounded-[4px] text-xs font-bold"
          >
            <Flame size={15} className="fill-[#D9A21B] text-[#D9A21B]" />
            <span>{progress.streak}</span>
          </div>

          {/* XP Indicator */}
          <div
            title="Poin Gordang XP"
            className="flex items-center gap-1 bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] text-[#1E1A17] px-2.5 py-1 rounded-[4px] text-xs font-bold"
          >
            <Zap size={15} className="fill-[#1E1A17] text-[#1E1A17]" />
            <span>{progress.xp}</span>
            <span className="text-[10px] text-[#433D38] font-normal">XP</span>
          </div>

          {/* Hearts / Tondi Indicator */}
          <button
            type="button"
            onClick={onRefillHearts}
            title="Sistem Nyawa Tondi (Klik untuk pulihkan penuh)"
            className="flex items-center gap-1 bg-[#FAF6EE] border-[1.5px] border-[#A62B1F] hover:bg-[#E8DFC8] text-[#A62B1F] px-2.5 py-1 rounded-[4px] text-xs font-bold cursor-pointer transition"
          >
            <Heart size={15} className="fill-[#A62B1F] text-[#A62B1F]" />
            <span>{progress.hearts}</span>
            <Plus size={12} className="text-[#A62B1F]" />
          </button>

          {/* User Account / Profile */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l-[1.5px] border-[#1E1A17]">
              <div
                title={`${currentUser.name} (${currentUser.marga || 'Batak'})`}
                className="flex items-center gap-1.5 bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] text-[#1E1A17] px-2.5 py-1 rounded-[4px] text-xs font-bold max-w-[170px] truncate"
              >
                <span className="text-xs shrink-0">{currentUser.avatar || '🧒'}</span>
                <span className="truncate hidden sm:inline">
                  {currentUser.name.split(' ')[0]} {currentUser.marga ? `(${currentUser.marga})` : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                title="Keluar Sesi (Logout)"
                className="text-[#433D38] hover:text-[#A62B1F] hover:bg-[#E8DFC8] p-1.5 rounded-[4px] border border-transparent hover:border-[#1E1A17] transition cursor-pointer flex items-center justify-center"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="btn-indigo px-3.5 py-1 text-xs"
            >
              <UserIcon size={14} className="mr-1" />
              <span>Masuk</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom/Sub Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-t-[1.5px] border-[#1E1A17] bg-[#FAF6EE] px-2 py-1.5 overflow-x-auto gap-1 font-body">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`px-2.5 py-1 rounded-[4px] text-[11px] font-bold flex flex-col items-center gap-0.5 transition cursor-pointer shrink-0 border ${
                isActive
                  ? 'text-[#A62B1F] bg-[#E8DFC8] border-[#1E1A17]'
                  : 'text-[#433D38] border-transparent hover:text-[#1E1A17]'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-[#A62B1F]' : 'text-[#433D38]'} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
