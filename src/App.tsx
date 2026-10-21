/**
 * BATAKGO - Duolingo-style Interactive Batak Language Learning Platform
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
import { UNITS, Lesson } from './utils/batakData';
import {
  UserProgress,
  loadUserProgress,
  saveUserProgress,
  INITIAL_PROGRESS
} from './utils/gamification';
import { playOgungGong, playGordangBeat } from './utils/audioSynthesizer';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [activeTab, setActiveTab] = useState<string>('learn');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  // Support ?autostart=1 query param from ultra-mode guidelines
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

  const handleLessonComplete = (stats: {
    xpEarned: number;
    correctCount: number;
    heartsRemaining: number;
  }) => {
    if (!activeLesson) return;

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
            unlockedUnitsSet.add(UNITS[nextUnitIndex].id);
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

    showToast(`🎉 Parsiajaran Sidung! +${stats.xpEarned} Gordang XP diraih!`);
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
    showToast('❤️ Tondi dipulihkan penuh! Semangat belajar kembali membara!');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#222222] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
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

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-8 px-4 border-t-4 border-red-700">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧣</span>
            <div>
              <p className="font-extrabold text-white text-base font-['Fredoka',sans-serif]">
                BATAKGO • Parsiajaran Hata Batak
              </p>
              <p className="text-xs text-stone-400">
                Lengkap dengan audio penutur asli dan maskot Sigale-gale berbusana Ulos tradisional.
              </p>
            </div>
          </div>
          <p className="text-xs text-stone-400">
            Horas ma di hita saluhutna! &copy; 2026 BATAKGO
          </p>
        </div>
      </footer>
    </div>
  );
}
