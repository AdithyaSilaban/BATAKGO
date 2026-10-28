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
  Layers,
  Globe,
  Plus
} from 'lucide-react';
import { UserProgress } from '../utils/gamification';
import { AuthUser } from '../utils/apiClient';
import { GorgaShield, GorgaBorder } from './GorgaEmblem';

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
  { id: 'ulos', label: 'Koleksi Ulos', Icon: Layers },
  { id: 'openapi', label: 'Open API', Icon: Globe },
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Authentic Cultural Ribbon at Top */}
      <GorgaBorder />

      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <button
          type="button"
          onClick={() => onTabChange('learn')}
          className="flex items-center gap-3 cursor-pointer text-left group focus:outline-none"
        >
          {/* Custom SVG Gorga Shield Emblem */}
          <GorgaShield size={40} className="group-hover:scale-105 transition-transform" />

          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-xl font-extrabold tracking-tight text-[#991B1B]">
                BATAK<span className="text-[#18181B]">GO</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded border border-stone-300">
                Toba
              </span>
            </div>
            <p className="text-[11px] font-medium text-stone-500 mt-1">
              Parsiajaran Hata Batak
            </p>
          </div>
        </button>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange(id)}
                className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                  isActive
                    ? 'bg-[#991B1B]/10 text-[#991B1B] border border-[#991B1B]/30 font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-transparent'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-[#991B1B]' : 'text-stone-500'} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* User HUD & Authentication */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Streak Indicator */}
          <div
            title="Pardalanan Ari (Streak Harian)"
            className="flex items-center gap-1 bg-amber-50 border border-amber-300 text-amber-900 px-2.5 py-1 rounded-xl text-xs font-bold"
          >
            <Flame size={15} className="fill-amber-500 text-amber-500" />
            <span>{progress.streak}</span>
          </div>

          {/* XP Indicator */}
          <div
            title="Poin Gordang XP"
            className="flex items-center gap-1 bg-stone-100 border border-stone-300 text-stone-800 px-2.5 py-1 rounded-xl text-xs font-bold"
          >
            <Zap size={15} className="fill-stone-600 text-stone-600" />
            <span>{progress.xp}</span>
            <span className="text-[10px] text-stone-400 font-normal">XP</span>
          </div>

          {/* Tondi (Nyawa/Hearts) Indicator with Refill */}
          <button
            type="button"
            onClick={onRefillHearts}
            title="Tondi (Nyawa) - Klik untuk pulihkan penuh"
            className="flex items-center gap-1 bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 px-2.5 py-1 rounded-xl text-xs font-bold cursor-pointer transition"
          >
            <Heart size={15} className="fill-red-600 text-red-600" />
            <span>{progress.hearts}</span>
            <Plus size={12} className="text-red-400" />
          </button>

          {/* User Account / Profile */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <div
                title={`${currentUser.name} (${currentUser.marga || 'Batak'})`}
                className="flex items-center gap-1.5 bg-stone-900 text-white px-3 py-1 rounded-xl text-xs font-semibold max-w-[140px] truncate"
              >
                <UserIcon size={13} className="text-amber-400 shrink-0" />
                <span className="truncate hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                title="Keluar Sesi"
                className="text-stone-400 hover:text-red-600 p-1 rounded-lg transition cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <UserIcon size={14} />
              <span>Masuk</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom/Sub Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-stone-200 bg-stone-50 px-2 py-1.5 overflow-x-auto gap-1">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex flex-col items-center gap-0.5 transition cursor-pointer shrink-0 ${
                isActive
                  ? 'text-[#991B1B] font-bold bg-white shadow-xs border border-stone-200'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-[#991B1B]' : 'text-stone-400'} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
