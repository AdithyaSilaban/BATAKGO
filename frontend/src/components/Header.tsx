import React, { useState, useRef, useEffect } from 'react';
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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F4EDE0] border-b-[1.5px] border-[#1E1A17]">
        {/* Pembatas Section: Pita 3 Garis (Arang, Secang, Kapur) setinggi 6px */}
        <PitaTenun />

        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Brand / Logo */}
          <button
            type="button"
            onClick={() => onTabChange('learn')}
            className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer text-left group focus-visible:ring-2 focus-visible:ring-[#23365A] shrink-0"
          >
            <img
              src="/assets/logo.png"
              alt="Logo BatakGO"
              className="w-7 h-7 sm:w-10 sm:h-10 object-contain shrink-0 group-hover:scale-105 transition-transform"
              style={{ imageRendering: 'pixelated' }}
            />

            <div>
              <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
                <span className="font-heading text-base sm:text-xl font-bold tracking-tight text-[#A62B1F]">
                  BATAK<span className="text-[#1E1A17]">GO</span>
                </span>
                {/* Sembunyikan badge Toba di layar HP sempit (< sm) agar tidak mendorong elemen kanan keluar layar */}
                <span className="hidden sm:inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#E8DFC8] text-[#1E1A17] px-1 sm:px-1.5 py-0.5 rounded-[2px] border border-[#1E1A17]">
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

          {/* User HUD & Authentication (Compact & Anti-Overflow on Mobile) */}
          <div className="flex items-center gap-1 sm:gap-2 font-body shrink-0">
            {/* Streak Indicator */}
            <div
              title="Pardalanan Ari (Streak Harian)"
              className="flex items-center gap-0.5 sm:gap-1 bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] text-[#1E1A17] px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-[4px] text-[11px] sm:text-xs font-bold"
            >
              <Flame size={13} className="fill-[#D9A21B] text-[#D9A21B]" />
              <span>{progress.streak}</span>
            </div>

            {/* XP Indicator */}
            <div
              title="Poin Gordang XP"
              className="flex items-center gap-0.5 sm:gap-1 bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] text-[#1E1A17] px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-[4px] text-[11px] sm:text-xs font-bold"
            >
              <Zap size={13} className="fill-[#1E1A17] text-[#1E1A17]" />
              <span>{progress.xp}</span>
              <span className="hidden sm:inline text-[10px] text-[#433D38] font-normal">XP</span>
            </div>

            {/* Hearts / Tondi Indicator */}
            <button
              type="button"
              onClick={onRefillHearts}
              title="Sistem Nyawa Tondi (Klik untuk pulihkan penuh)"
              className="flex items-center gap-0.5 sm:gap-1 bg-[#FAF6EE] border-[1.5px] border-[#A62B1F] hover:bg-[#E8DFC8] text-[#A62B1F] px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-[4px] text-[11px] sm:text-xs font-bold cursor-pointer transition active:scale-95"
            >
              <Heart size={13} className="fill-[#A62B1F] text-[#A62B1F]" />
              <span>{progress.hearts}</span>
              <Plus size={10} className="text-[#A62B1F] hidden sm:inline" />
            </button>

            {/* User Account / Profile & Logout */}
            {currentUser ? (
              <div ref={profileMenuRef} className="relative flex items-center gap-1 pl-1 sm:pl-1.5 border-l border-[#1E1A17]/40">
                {/* Profile Pill Button */}
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(prev => !prev)}
                  title={`${currentUser.name} (${currentUser.marga || 'Batak'})`}
                  className="flex items-center gap-1 bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] hover:bg-[#E8DFC8] text-[#1E1A17] px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-[4px] text-[11px] sm:text-xs font-bold transition cursor-pointer"
                >
                  <span className="text-xs shrink-0">{currentUser.avatar || '🧒'}</span>
                  <span className="truncate hidden md:inline max-w-[100px]">
                    {currentUser.name.split(' ')[0]} {currentUser.marga ? `(${currentUser.marga})` : ''}
                  </span>
                </button>

                {/* Direct Logout Icon Button */}
                <button
                  type="button"
                  onClick={onLogout}
                  title="Keluar Sesi (Logout)"
                  className="text-[#433D38] hover:text-[#A62B1F] hover:bg-[#E8DFC8] p-1 rounded-[4px] border border-transparent hover:border-[#1E1A17] transition cursor-pointer flex items-center justify-center shrink-0"
                >
                  <LogOut size={14} />
                </button>

                {/* Mobile Dropdown Popover on Avatar Click */}
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-1.5 w-48 bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] rounded-[4px] shadow-xl p-3 z-50 text-[#1E1A17] animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#1E1A17]/20">
                      <span className="text-xl">{currentUser.avatar || '🧒'}</span>
                      <div className="truncate">
                        <p className="font-heading font-bold text-xs truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-[#A62B1F] font-semibold">{currentUser.marga ? `Marga ${currentUser.marga}` : 'Batak Toba'}</p>
                      </div>
                    </div>
                    <div className="text-[11px] space-y-1 mb-2.5 text-[#433D38]">
                      <div>🔥 Streak: <b>{progress.streak} hari</b></div>
                      <div>⚡ XP: <b>{progress.xp} XP</b></div>
                      <div>❤️ Tondi: <b>{progress.hearts}/{progress.maxHearts}</b></div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full py-1.5 px-2 bg-[#F5E2DF] text-[#A62B1F] hover:bg-[#A62B1F] hover:text-white rounded-[2px] border border-[#A62B1F] text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <LogOut size={12} />
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="btn-indigo px-2 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs"
              >
                <UserIcon size={12} className="mr-1" />
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
