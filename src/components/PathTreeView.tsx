import React from 'react';
import { Check, Lock, Star, Play, Sparkles, BookOpen, Flame, Zap, Heart } from 'lucide-react';
import { UNITS, Unit, Lesson, DAILY_QUESTS } from '../utils/batakData';
import { UserProgress, calculateLevel } from '../utils/gamification';
import { Mascot } from './Mascot';

interface PathTreeViewProps {
  progress: UserProgress;
  onSelectLesson: (lesson: Lesson) => void;
  onRefillHearts: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const PathTreeView: React.FC<PathTreeViewProps> = ({
  progress,
  onSelectLesson,
  onRefillHearts,
  onNavigateToTab
}) => {
  const levelInfo = calculateLevel(progress.xp);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8 items-start">
      {/* Left/Center: Main Duolingo-style Learning Path */}
      <div className="flex-1 w-full max-w-xl mx-auto">
        {UNITS.map(unit => {
          const isUnitUnlocked = progress.unlockedUnits.includes(unit.id);

          return (
            <div key={unit.id} className="mb-12">
              {/* Unit Header Banner */}
              <div
                className={`rounded-3xl p-5 text-white border-2 border-stone-800 shadow-md ${unit.bannerColor} relative overflow-hidden mb-8`}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <span className="text-xs font-black tracking-wider uppercase bg-black/30 px-3 py-1 rounded-full inline-block mb-1">
                      UNIT {unit.number} • {unit.batakTitle}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black font-['Fredoka',sans-serif]">
                      {unit.title}
                    </h2>
                    <p className="text-white/90 text-xs sm:text-sm mt-1 max-w-md">
                      {unit.description}
                    </p>
                  </div>
                  <div className="text-4xl hidden sm:block">
                    {unit.number === 1 && '👋'}
                    {unit.number === 2 && '🤝'}
                    {unit.number === 3 && '🏞️'}
                    {unit.number === 4 && '🍲'}
                    {unit.number === 5 && '👑'}
                  </div>
                </div>

                {/* Cultural background pattern overlay */}
                <div className="absolute -right-4 -bottom-6 text-8xl opacity-15 select-none pointer-events-none font-serif">
                  ᯅᯖᯂ
                </div>
              </div>

              {/* Lessons Path Nodes (Sinusoidal layout) */}
              <div className="flex flex-col items-center gap-14 py-4 relative">
                {unit.lessons.map((lesson, idx) => {
                  const isCompleted = progress.completedLessons.includes(lesson.id);
                  const isUnlocked =
                    isUnitUnlocked &&
                    (idx === 0 || progress.completedLessons.includes(unit.lessons[idx - 1].id));
                  const isCurrent = isUnlocked && !isCompleted;
                  // Only show the Mascot banner on the very first active lesson of Unit 1 (or the first incomplete lesson)
                  const showMascotCheer = isCurrent && unit.number === 1;

                  // Wavy offset: alternating center, right, left
                  const offsets = [
                    'translate-x-0',
                    'translate-x-10 sm:translate-x-14',
                    '-translate-x-10 sm:-translate-x-14'
                  ];
                  const offsetClass = offsets[idx % offsets.length];

                  return (
                    <div
                      key={lesson.id}
                      className={`relative flex flex-col items-center transition-transform ${offsetClass}`}
                    >
                      {/* Mascot encouragement attached beside the active lesson node */}
                      {showMascotCheer && (
                        <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 hidden xl:flex items-center z-20 pointer-events-none">
                          <Mascot
                            mood="happy"
                            size="md"
                            speech="Mulai dison!"
                            subSpeech="Klik tombol emas untuk belajar"
                            showStatusLabel={false}
                          />
                        </div>
                      )}

                      {/* Lesson Circular Node */}
                      <button
                        type="button"
                        disabled={!isUnlocked}
                        onClick={() => onSelectLesson(lesson)}
                        aria-label={`${lesson.title} (${isCompleted ? 'Selesai' : isUnlocked ? 'Mulai' : 'Terkunci'})`}
                        className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 transition-all ${
                          isCompleted
                            ? 'bg-amber-400 border-amber-600 text-stone-900 shadow-[0_6px_0_0_#b45309] hover:bg-amber-300 cursor-pointer active:translate-y-1 active:shadow-[0_2px_0_0_#b45309]'
                            : isCurrent
                            ? 'bg-emerald-500 border-emerald-700 text-white shadow-[0_6px_0_0_#047857] hover:bg-emerald-400 cursor-pointer ring-4 ring-emerald-300/60 animate-pulse active:translate-y-1 active:shadow-[0_2px_0_0_#047857]'
                            : 'bg-stone-300 border-stone-400 text-stone-500 cursor-not-allowed shadow-[0_4px_0_0_#a8a29e] opacity-80'
                        }`}
                      >
                        {isCompleted ? (
                          <Check size={32} strokeWidth={3.5} />
                        ) : isCurrent ? (
                          <Play size={28} className="fill-white translate-x-0.5" />
                        ) : (
                          <Lock size={26} />
                        )}

                        {/* XP Badge */}
                        <span className="absolute -bottom-2.5 bg-stone-900 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-stone-700 shadow-sm whitespace-nowrap">
                          +{lesson.xpReward} XP
                        </span>
                      </button>

                      {/* Tooltip Label positioned with enough clearance */}
                      <div className="mt-3 text-center whitespace-nowrap z-10">
                        <span className="font-extrabold text-xs sm:text-sm text-stone-800 bg-white/95 px-3 py-1 rounded-xl border border-stone-300 shadow-sm inline-block">
                          {lesson.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Sidebar: Gamification Stats, Daily Quests & Mascot Info */}
      <div className="w-full lg:w-80 flex flex-col gap-5 sticky top-24">
        {/* User Card & Title */}
        <div className="bg-white rounded-3xl border-2 border-stone-300 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 text-white flex items-center justify-center font-black text-xl shadow-inner font-['Fredoka',sans-serif]">
              G
            </div>
            <div>
              <p className="font-extrabold text-stone-900 text-base">
                Parsiajar Batak
              </p>
              <p className="text-xs text-red-600 font-bold">
                Tingkat {levelInfo.level} • {levelInfo.title}
              </p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-2">
            <div className="flex justify-between text-xs font-bold text-stone-500 mb-1">
              <span>Gordang XP</span>
              <span>{levelInfo.currentXp} / {levelInfo.nextLevelXp} XP</span>
            </div>
            <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
              <div
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tondi (Hearts) & Refill Card */}
        <div className="bg-white rounded-3xl border-2 border-stone-300 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase text-stone-500 tracking-wider">
              Tondi (Nyawa Semangat)
            </span>
            <span className="text-red-600 font-black text-sm flex items-center gap-1 font-['Fredoka',sans-serif]">
              <Heart size={16} className="fill-red-500" /> {progress.hearts} / {progress.maxHearts}
            </span>
          </div>
          <p className="text-xs text-stone-600 mb-3">
            Tondi berkurang saat Anda menjawab salah. Pulihkan tondi agar terus bisa belajar!
          </p>
          <button
            type="button"
            onClick={onRefillHearts}
            disabled={progress.hearts >= progress.maxHearts}
            className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-700 font-bold text-xs border border-red-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} /> Pulihkan Penuh Tondi (Gratis)
          </button>
        </div>

        {/* Daily Quests Card */}
        <div className="bg-white rounded-3xl border-2 border-stone-300 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="text-amber-500" size={18} />
              <h3 className="font-extrabold text-stone-900 text-sm font-['Fredoka',sans-serif]">
                Tugas Sadari On (Harian)
              </h3>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {DAILY_QUESTS.map(q => (
              <div key={q.id} className="p-2.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-stone-800">{q.title}</span>
                  <span className="font-extrabold text-amber-600">+{q.rewardXP} XP</span>
                </div>
                <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (progress.xp / q.target) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ulos Collection Promo Card */}
        <div
          onClick={() => onNavigateToTab('ulos')}
          className="bg-gradient-to-r from-red-900 to-stone-900 text-white rounded-3xl p-5 border-2 border-stone-800 shadow-sm cursor-pointer hover:scale-[1.02] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">🧣</div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Koleksi Tradisional
              </p>
              <h4 className="font-black text-sm font-['Fredoka',sans-serif]">
                Lemari Tenun Ulos Batak
              </h4>
              <p className="text-xs text-stone-300 mt-0.5">
                Lihat koleksi Ulos Mangiring & Ulos Ragidup milikmu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
