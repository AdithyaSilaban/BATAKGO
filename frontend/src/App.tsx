/**
 * BATAKGO - Duolingo-style Interactive Batak Language Learning Platform
 * Powered by Laravel 13 RESTful API & MySQL Database (Laragon)
 * Mascot: Sigale-gale with Traditional Ulos
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PathTreeView } from './components/PathTreeView';
import { LessonModal } from './components/LessonModal';
import { DictionaryView } from './components/DictionaryView';
import { PartuturanView } from './components/PartuturanView';
import { AksaraBatakView } from './components/AksaraBatakView';
import { LeaderboardView } from './components/LeaderboardView';
import { OpenApiShowcaseView } from './components/OpenApiShowcaseView';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { PitaTenun } from './components/GorgaEmblem';
import { UNITS, Lesson } from './utils/batakData';
import {
  UserProgress,
  loadUserProgress,
  saveUserProgress,
} from './utils/gamification';
import {
  AuthUser,
  getStoredUser,
  fetchCurrentUserApi,
  logoutApi,
  syncProgressApi,
  refillHeartsApi,
} from './utils/apiClient';
import { playOgungGong } from './utils/audioSynthesizer';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [activeTab, setActiveTab] = useState<string>('learn');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getStoredUser);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  // Check login session on mount
  useEffect(() => {
    fetchCurrentUserApi().then(user => {
      if (user) {
        setCurrentUser(user);
        setProgress(prev => ({
          ...prev,
          xp: user.xp || prev.xp,
          streak: user.streak || prev.streak,
          hearts: user.hearts !== undefined ? user.hearts : prev.hearts,
          maxHearts: user.max_hearts || prev.maxHearts,
          completedLessons: user.completed_lessons || prev.completedLessons,
          unlockedUnits: user.unlocked_units || prev.unlockedUnits,
        }));
      }
    });
  }, []);

  // Support ?autostart=1 query param
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        const firstLesson = UNITS[0]?.lessons[0];
        if (firstLesson) {
          setActiveLesson(firstLesson);
        }
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLessonComplete = async (stats: {
    xpEarned: number;
    correctCount: number;
    heartsRemaining: number;
  }) => {
    if (!activeLesson) return;

    let nextUnlockedUnitId: string | undefined = undefined;

    setProgress(prev => {
      const completedSet = new Set(prev.completedLessons);
      completedSet.add(activeLesson.id);

      // Check if current unit is completed to unlock next unit
      const currentUnit = UNITS.find(u => u.id === activeLesson.unitId);
      const unlockedUnitsSet = new Set(prev.unlockedUnits);

      if (currentUnit) {
        const allLessonsInUnitDone = currentUnit.lessons.every(
          l => completedSet.has(l.id) || l.id === activeLesson.id
        );
        if (allLessonsInUnitDone) {
          const nextUnitIndex = UNITS.findIndex(u => u.id === currentUnit.id) + 1;
          if (nextUnitIndex < UNITS.length) {
            nextUnlockedUnitId = UNITS[nextUnitIndex].id;
            unlockedUnitsSet.add(nextUnlockedUnitId);
          }
        }
      }

      return {
        ...prev,
        xp: prev.xp + stats.xpEarned,
        hearts: Math.min(prev.maxHearts, Math.max(1, stats.heartsRemaining)),
        completedLessons: Array.from(completedSet),
        unlockedUnits: Array.from(unlockedUnitsSet)
      };
    });

    // Sync to Laravel REST API + MySQL database
    syncProgressApi({
      xpEarned: stats.xpEarned,
      lessonId: activeLesson.id,
      unlockedUnitId: nextUnlockedUnitId,
      heartsRemaining: Math.min(progress.maxHearts, Math.max(1, stats.heartsRemaining)),
    });

    showToast(`🎉 Parsiajaran Sidung! +${stats.xpEarned} Gordang XP tersimpan ke database!`);
    setActiveLesson(null);
  };

  const handleLoseHeart = () => {
    setProgress(prev => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1)
    }));
  };

  const handleRefillHearts = () => {
    playOgungGong();
    setProgress(prev => ({
      ...prev,
      hearts: prev.maxHearts
    }));
    refillHeartsApi();
    showToast('❤️ Tondi dipulihkan penuh! Semangat belajar kembali membara!');
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setProgress(prev => ({
      ...prev,
      xp: user.xp || prev.xp,
      streak: user.streak || prev.streak,
      hearts: user.hearts || prev.hearts,
      completedLessons: user.completed_lessons || prev.completedLessons,
      unlockedUnits: user.unlocked_units || prev.unlockedUnits,
    }));
    showToast(`Horas, ${user.name}! Akun berhasil disinkronkan ke MySQL.`);
  };

  const handleLogout = async () => {
    await logoutApi();
    setCurrentUser(null);
    showToast('Sampai jumpa kembali! Sesi telah diakhiri.');
  };

  // Tampilkan Halaman Login & Registrasi jika belum login
  if (!currentUser) {
    return (
      <LoginPage
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EDE0] text-[#1E1A17] flex flex-col font-body relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1E1A17] text-[#F4EDE0] px-4 py-2.5 rounded-[4px] border-[1.5px] border-[#A62B1F] font-bold text-xs animate-in fade-in slide-in-from-top-3 duration-200 flex items-center gap-2 max-w-[90vw] text-center shadow-lg">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Header */}
      <Header
        progress={progress}
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
        onRefillHearts={handleRefillHearts}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Tab Views with bottom padding so bottom nav doesn't cover content */}
      <main className="flex-1 pb-24 lg:pb-16">
        {activeTab === 'learn' && (
          <PathTreeView
            progress={progress}
            onSelectLesson={lesson => setActiveLesson(lesson)}
            onRefillHearts={handleRefillHearts}
            onNavigateToTab={tab => setActiveTab(tab)}
          />
        )}

        {activeTab === 'dictionary' && <DictionaryView />}

        {activeTab === 'partuturan' && <PartuturanView />}

        {activeTab === 'aksara' && <AksaraBatakView />}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            userXP={progress.xp}
            userStreak={progress.streak}
          />
        )}

        {activeTab === 'openapi' && <OpenApiShowcaseView />}
      </main>

      {/* Duolingo Interactive Lesson Modal */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          userHearts={progress.hearts}
          onClose={() => setActiveLesson(null)}
          onComplete={handleLessonComplete}
          onLoseHeart={handleLoseHeart}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Footer */}
      <div className="hidden lg:block">
        <PitaTenun />
        <footer className="bg-[#1E1A17] text-[#F4EDE0] py-6 px-4 border-t border-[#1E1A17]">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <img
                src="/assets/logo.png"
                alt="Logo BATAKGO"
                className="w-8 h-8 object-contain shrink-0"
                style={{ imageRendering: 'pixelated' }}
              />
              <div>
                <p className="font-heading font-bold text-[#F4EDE0] text-sm tracking-tight">
                  BATAK<span className="text-[#A62B1F]">GO</span> • Parsiajaran Hata Batak
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  By kelompok Himatop
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              Horas ma di hita saluhutna! &copy; 2026 BATAKGO
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
