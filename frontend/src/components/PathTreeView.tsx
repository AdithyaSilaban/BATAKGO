import React, { useState } from 'react';
import {
  Check,
  Lock,
  Play,
  Star,
  BookOpen,
  Flame,
  Zap,
  Heart,
  Users,
  Compass,
  UtensilsCrossed,
  Crown,
  MessageCircle,
  Mic,
  ArrowRight,
  Trophy
} from 'lucide-react';
import { UNITS, Lesson, DAILY_QUESTS, Unit } from '../utils/batakData';
import { UserProgress, calculateLevel } from '../utils/gamification';
import { getStoredUser } from '../utils/apiClient';
import { GorgaShield, PitaTenun } from './GorgaEmblem';
import { GuidebookModal } from './GuidebookModal';
import { playGordangBeat } from '../utils/audioSynthesizer';

interface PathTreeViewProps {
  progress: UserProgress;
  onSelectLesson: (lesson: Lesson) => void;
  onRefillHearts: () => void;
  onNavigateToTab: (tab: string) => void;
}

interface UnitVisualConfig {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  aksara: string;
  badgeLabel: string;
}

const UNIT_CONFIGS: Record<number, UnitVisualConfig> = {
  1: {
    icon: MessageCircle,
    aksara: 'ᯂᯬᯒᯘ᯲',
    badgeLabel: 'Modul Parjolo • Tingkat Dasar'
  },
  2: {
    icon: Users,
    aksara: 'ᯇᯒ᯲ᯖᯮᯖᯮᯒᯉ᯲',
    badgeLabel: 'Kekerabatan Adat • Dalihan Na Tolu'
  },
  3: {
    icon: Compass,
    aksara: 'ᯖᯀᯬ ᯖᯬᯅ',
    badgeLabel: 'Geografi & Numerasi Danau Toba'
  },
  4: {
    icon: UtensilsCrossed,
    aksara: 'ᯘᯪᯇᯝᯉᯉᯬ᯲',
    badgeLabel: 'Kuliner Tradisional & Keseharian'
  },
  5: {
    icon: Crown,
    aksara: 'ᯘᯪᯎᯞᯩᯎᯞᯩ',
    badgeLabel: 'Filsafat Luhur & Legenda'
  }
};

export const PathTreeView: React.FC<PathTreeViewProps> = ({
  progress,
  onSelectLesson,
  onRefillHearts,
  onNavigateToTab
}) => {
  const [selectedGuideUnit, setSelectedGuideUnit] = useState<Unit | null>(null);
  const [hoveredLessonId, setHoveredLessonId] = useState<string | null>(null);

  const levelInfo = calculateLevel(progress.xp);
  const storedUser = getStoredUser();

  const userName = storedUser?.name || 'Parsiajar Batak';
  const userMarga = storedUser?.marga ? `Marga ${storedUser.marga}` : 'Batak Toba';

  // Offset sequence for organic winding snake path
  const S_OFFSETS = [
    'translate-x-0',
    '-translate-x-12 sm:-translate-x-16',
    'translate-x-0',
    'translate-x-12 sm:translate-x-16',
    'translate-x-0'
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 items-start font-body">
      {/* Guidebook Modal */}
      {selectedGuideUnit && (
        <GuidebookModal
          unit={selectedGuideUnit}
          isOpen={Boolean(selectedGuideUnit)}
          onClose={() => setSelectedGuideUnit(null)}
        />
      )}

      {/* Left/Center: Main Learning Curriculum Tree */}
      <div className="flex-1 w-full max-w-2xl mx-auto">
        {UNITS.map((unit, unitIdx) => {
          // Strictly lock units: Unit 1 is unlocked, Unit N is only unlocked if ALL lessons in Unit N-1 are completed!
          const prevUnit = unitIdx > 0 ? UNITS[unitIdx - 1] : null;
          const isUnitUnlocked = !prevUnit || prevUnit.lessons.every(l => progress.completedLessons.includes(l.id));
          const config = UNIT_CONFIGS[unit.number] || UNIT_CONFIGS[1];
          const UnitIcon = config.icon;

          // Calculate completed lessons inside this unit
          const completedInUnit = unit.lessons.filter(l =>
            progress.completedLessons.includes(l.id)
          ).length;
          const isUnitFullyCompleted = completedInUnit === unit.lessons.length;

          return (
            <div key={unit.id} className="mb-16">
              {/* 1. UNIT HEADER BANNER DENGAN SATU WARNA DINAMIS */}
              <div
                className={`w-full rounded-3xl p-6 sm:p-7 mb-10 text-white shadow-xl ${unit.bannerColor} relative overflow-hidden transition-all duration-300 ${
                  !isUnitUnlocked ? 'opacity-75 saturate-50 ring-1 ring-white/10' : ''
                }`}
                style={{ backgroundColor: !isUnitUnlocked ? '#38322D' : unit.themeColor }}
              >
                {/* Watermark Aksara Batak Transparan */}
                <div
                  className="font-batak absolute -right-2 -bottom-4 text-8xl text-white/10 select-none pointer-events-none"
                  style={{ fontWeight: 400, fontSynthesis: 'none' }}
                  aria-hidden="true"
                >
                  {config.aksara}
                </div>

                {/* Ornamen Pita Tenun di Atas Banner */}
                <div className="absolute top-0 left-0 right-0 opacity-80">
                  <PitaTenun />
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-2">
                  <div className="max-w-md">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-black/30 text-amber-300 border border-white/20 backdrop-blur-xs">
                        BAGIAN 1, UNIT 0{unit.number}
                      </span>
                      {!isUnitUnlocked ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-200 bg-black/40 px-3 py-1 rounded-full border border-amber-300/30">
                          <Lock size={12} /> Terkunci (Selesaikan Unit {unit.number - 1} Terlebih Dahulu)
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-white/90">
                          {config.badgeLabel}
                        </span>
                      )}
                    </div>

                    <h2 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                      {unit.title}
                    </h2>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-amber-200 italic">
                        {unit.batakTitle}
                      </span>
                      <span className="text-white/60 text-xs">•</span>
                      <span
                        className="font-batak text-xs text-white/90 tracking-wider"
                        style={{ fontWeight: 400, fontSynthesis: 'none' }}
                      >
                        {config.aksara}
                      </span>
                    </div>

                    <p className="text-white/90 text-xs sm:text-sm mt-2.5 leading-relaxed font-medium">
                      {unit.description}
                    </p>

                    {/* Unit Progress: Motif Garis Tenun */}
                    <div className="mt-4 flex items-center gap-3">
                      <div className="bg-black/30 p-[2px] rounded-full flex-1 max-w-[200px] border border-white/20">
                        <div
                          className="h-2.5 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 transition-all duration-300"
                          style={{
                            width: `${(completedInUnit / unit.lessons.length) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-extrabold text-white">
                        {completedInUnit} / {unit.lessons.length} Pelajaran
                      </span>
                      {isUnitFullyCompleted && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white text-stone-900 shadow">
                          Tuntas
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tombol Timbul "BUKU PANDUAN" */}
                  <div className="shrink-0 flex sm:flex-col items-center gap-3 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => setSelectedGuideUnit(unit)}
                      className="px-4 py-2.5 rounded-2xl bg-black/25 hover:bg-black/40 border-2 border-white/40 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition active:translate-y-1 cursor-pointer shadow-md backdrop-blur-xs"
                    >
                      <BookOpen size={16} />
                      <span>BUKU PANDUAN</span>
                    </button>

                    <div className="w-12 h-12 rounded-2xl bg-black/20 border border-white/30 flex items-center justify-center text-amber-300">
                      <UnitIcon size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. JALUR BELAJAR BERKELOK DENGAN NODE LINGKARAN 3D & JEJAK PENGHUBUNG */}
              <div className="w-full flex flex-col items-center gap-10 py-4 relative">
                {/* Garis Jejak Jalur Penghubung Melengkung Putus-Putus di Latar Belakang */}
                <div
                  className="absolute top-8 bottom-8 w-1 border-r-2 border-dashed border-[#1E1A17]/30 pointer-events-none -z-0"
                  aria-hidden="true"
                />

                {unit.lessons.map((lesson, idx) => {
                  const isCompleted = progress.completedLessons.includes(lesson.id);
                  const isUnlocked =
                    isUnitUnlocked &&
                    (idx === 0 || progress.completedLessons.includes(unit.lessons[idx - 1].id));
                  const isCurrent = isUnlocked && !isCompleted;

                  // Posisi berkelok kiri-kanan
                  const offsetClass = S_OFFSETS[idx % S_OFFSETS.length];
                  const isFinal = idx === unit.lessons.length - 1;

                  return (
                    <div
                      key={lesson.id}
                      className={`relative flex items-center justify-center transition-transform duration-200 z-10 ${offsetClass}`}
                    >
                      {/* Balon Mengambang Membal "MULAI" di Atas Node Aktif */}
                      {isCurrent && (
                        <div className="absolute -top-12 z-30 flex flex-col items-center animate-bounce pointer-events-none">
                          <div className="bg-[#1E1A17] text-[#D9A21B] border-2 border-[#D9A21B] px-3.5 py-1 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-1.5">
                            <Play size={10} className="fill-[#D9A21B]" />
                            <span>MULAI</span>
                          </div>
                          {/* Segitiga penunjuk ke bawah */}
                          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#D9A21B] -mt-[1px]" />
                        </div>
                      )}

                      {/* Tooltip Judul Pelajaran Melayang Saat Hover */}
                      {hoveredLessonId === lesson.id && (
                        <div className="absolute bottom-full mb-3 z-30 bg-[#1E1A17] text-[#F4EDE0] border border-[#A62B1F] px-3 py-1.5 rounded-xl shadow-xl text-center pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                          <p className="text-xs font-black">{lesson.title}</p>
                          <p className="text-[10px] text-[#D9A21B] font-bold">
                            {isCompleted ? '✓ Sidung (Tuntas)' : isCurrent ? 'Pelajaran Aktif' : 'Terkunci'}
                          </p>
                        </div>
                      )}

                      {/* Tombol Lingkaran 3D (Tactile Coin Button) */}
                      <button
                        type="button"
                        disabled={!isUnlocked}
                        onMouseEnter={() => setHoveredLessonId(lesson.id)}
                        onMouseLeave={() => setHoveredLessonId(null)}
                        onClick={() => {
                          playGordangBeat();
                          onSelectLesson(lesson);
                        }}
                        aria-label={`${lesson.title} (${
                          isCompleted ? 'Selesai' : isUnlocked ? 'Mulai Pelajaran' : 'Terkunci'
                        })`}
                        className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                          isCurrent
                            ? 'bg-[#A62B1F] border-b-[6px] border-[#7A1F16] text-[#F4EDE0] ring-8 ring-[#A62B1F]/25 shadow-xl active:translate-y-1 active:border-b-0 hover:brightness-105'
                            : isCompleted
                            ? 'bg-[#D9A21B] border-b-[6px] border-[#A67910] text-[#1E1A17] shadow-md active:translate-y-1 active:border-b-0 hover:brightness-105'
                            : 'bg-[#E8DFC8] border-b-[6px] border-[#C8BFA8] text-[#8C8270] cursor-not-allowed opacity-90'
                        }`}
                      >
                        {/* Ikon di dalam node */}
                        {isCompleted ? (
                          <Star size={32} className="fill-[#1E1A17] text-[#1E1A17]" />
                        ) : isCurrent ? (
                          <Play size={28} className="fill-white text-white translate-x-0.5" />
                        ) : isFinal ? (
                          <Trophy size={28} className="text-[#8C8270]" />
                        ) : (
                          <Lock size={22} className="text-[#8C8270]" />
                        )}

                        {/* Badge XP Ramping di Bawah Node */}
                        <div
                          className={`absolute -bottom-3 px-2.5 py-0.5 rounded-full text-[10px] font-black border whitespace-nowrap flex items-center gap-1 shadow-xs ${
                            isCompleted
                              ? 'bg-[#1E1A17] text-[#D9A21B] border-[#D9A21B]'
                              : isCurrent
                              ? 'bg-[#1E1A17] text-white border-[#A62B1F]'
                              : 'bg-[#FAF6EE] text-[#8C8270] border-[#C8BFA8]'
                          }`}
                        >
                          <Zap size={10} className={isCompleted ? 'fill-[#D9A21B]' : isCurrent ? 'fill-amber-400' : ''} />
                          +{lesson.xpReward} XP
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Sidebar: Gamification Cards dengan Sudut Melengkung Lembut (rounded-3xl) */}
      <div className="w-full lg:w-80 flex flex-col gap-5 sticky top-24">
        {/* Card 1: User Profile & Gordang Level */}
        <div className="bg-[#FAF6EE] border-2 border-[#1E1A17] rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3.5">
            <img
              src="/assets/logo.png"
              alt="Logo BATAKGO"
              className="w-10 h-10 object-contain shrink-0"
              style={{ imageRendering: 'pixelated' }}
            />
            <div className="overflow-hidden">
              <p className="font-heading font-black text-[#1E1A17] text-base truncate">
                {userName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-black uppercase text-[#1E1A17] bg-[#E8DFC8] border border-[#1E1A17] px-2.5 py-0.5 rounded-full">
                  {userMarga}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E1A17]/15">
            <div className="flex items-center justify-between text-xs font-bold text-[#1E1A17] mb-1.5">
              <span className="text-[#433D38] uppercase tracking-wider text-[10px]">
                Gordang Level
              </span>
              <span className="text-[#A62B1F] font-black">
                Tingkat {levelInfo.level} • {levelInfo.title}
              </span>
            </div>

            <div className="progress-tenun-container rounded-full">
              <div
                className="progress-tenun-bar rounded-full"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-[#433D38] mt-1">
              <span>{levelInfo.currentXp} XP</span>
              <span>{levelInfo.nextLevelXp} XP</span>
            </div>
          </div>
        </div>

        {/* Card 2: Tondi (Nyawa Semangat) */}
        <div className="bg-[#FAF6EE] border-2 border-[#1E1A17] rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Heart size={16} className="text-[#A62B1F] fill-[#A62B1F]" />
              <span className="text-xs font-black uppercase text-[#1E1A17] tracking-wider">
                Tondi (Daya Hidup)
              </span>
            </div>
            <span className="text-xs font-black text-[#A62B1F] px-2.5 py-0.5 rounded-full bg-[#E8DFC8] border border-[#1E1A17]">
              {progress.hearts} / {progress.maxHearts}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mb-3">
            {Array.from({ length: progress.maxHearts }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full border border-[#1E1A17] transition-all ${
                  i < progress.hearts
                    ? 'bg-[#A62B1F]'
                    : 'bg-[#E8DFC8]'
                }`}
                title={`Tondi ${i + 1}`}
              />
            ))}
          </div>

          <p className="text-xs text-[#433D38] leading-relaxed mb-4 font-medium">
            Tondi melambangkan daya hidup batiniah. Berkurang jika salah menjawab, dapat dipulihkan penuh kapan saja.
          </p>

          <button
            type="button"
            onClick={onRefillHearts}
            disabled={progress.hearts >= progress.maxHearts}
            className="w-full py-2.5 rounded-2xl bg-[#A62B1F] hover:bg-[#7A1F16] border-b-4 border-[#5E1610] text-[#F4EDE0] font-black text-xs uppercase tracking-wider transition active:translate-y-1 active:border-b-0 cursor-pointer shadow"
          >
            Pulihkan Penuh Tondi (Gratis)
          </button>
        </div>

        {/* Card 3: Daily Quests (Tugas Sadari On) */}
        <div className="bg-[#FAF6EE] border-2 border-[#1E1A17] rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Zap className="text-[#D9A21B]" size={16} />
              <h3 className="font-heading font-black text-[#1E1A17] text-sm">
                Tugas Sadari On (Harian)
              </h3>
            </div>
            <span className="text-[10px] font-black text-[#433D38] uppercase tracking-wider">
              24 Jam
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {DAILY_QUESTS.map((q, idx) => {
              const QuestIcon = idx === 0 ? Flame : idx === 1 ? Mic : BookOpen;

              return (
                <div
                  key={q.id}
                  className="p-3 bg-[#F4EDE0] rounded-2xl border border-[#1E1A17] text-xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-xl bg-[#E8DFC8] border border-[#1E1A17] flex items-center justify-center text-[#1E1A17] shrink-0">
                        <QuestIcon size={13} />
                      </div>
                      <span className="font-black text-[#1E1A17] leading-tight">
                        {q.title}
                      </span>
                    </div>
                    <span className="font-black text-[#A62B1F] shrink-0 bg-[#E8DFC8] px-2 py-0.5 rounded-full border border-[#1E1A17] text-[10px]">
                      +{q.rewardXP} XP
                    </span>
                  </div>

                  <div className="progress-tenun-container h-2 mt-2 rounded-full">
                    <div
                      className="progress-tenun-bar rounded-full"
                      style={{
                        width: `${Math.min(100, (progress.xp / q.target) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>


      </div>
    </div>
  );
};
