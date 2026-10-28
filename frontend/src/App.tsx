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
import { UlosCollectionView } from './components/UlosCollectionView';
import { OpenApiShowcaseView } from './components/OpenApiShowcaseView';
import { AuthModal } from './components/AuthModal';
import { GorgaShield } from './components/GorgaEmblem';
import { UNITS, Lesson } from './utils/batakData';
import {
  UserProgress,
  loadUserProgress,
  saveUserProgress,
  INITIAL_PROGRESS
} from './utils/gamification';
import {
  AuthUser,
  getStoredUser,
  setStoredUser,
  fetchCurrentUserApi,
  logoutApi,
  syncProgressApi,
  refillHeartsApi,
} from './utils/apiClient';
import { playOgungGong, playGordangBeat } from './utils/audioSynthesizer';

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

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#222222] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl border-2 border-stone-700 font-bold text-sm animate-in fade-in slide-in-from-top-3 duration-200 flex items-center gap-2">
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

      {/* Tab Views */}
      <main className="flex-1 pb-16">
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

        {activeTab === 'ulos' && <UlosCollectionView />}

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
      <footer className="bg-[#18181B] text-stone-300 py-8 px-4 border-t-2 border-[#991B1B]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <GorgaShield size={36} />
            <div>
              <p className="font-bold text-white text-base tracking-tight">
                BATAK<span className="text-stone-300">GO</span> • Parsiajaran Hata Batak
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                Didukung arsitektur Laravel 13 RESTful API & basis data relasional MySQL (Laragon).
              </p>
            </div>
          </div>
          <p className="text-xs text-stone-500 font-medium">
            Horas ma di hita saluhutna! &copy; 2026 BATAKGO • UINIC 8.0
          </p>
        </div>
      </footer>
    </div>
  );
}
