import React from 'react';
import {
  Check,
  Lock,
  Play,
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
  ArrowRight
} from 'lucide-react';
import { UNITS, Lesson, DAILY_QUESTS } from '../utils/batakData';
import { UserProgress, calculateLevel } from '../utils/gamification';
import { getStoredUser } from '../utils/apiClient';
import { GorgaShield, PitaTenun } from './GorgaEmblem';
import { Mascot } from './Mascot';

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
  const levelInfo = calculateLevel(progress.xp);
  const storedUser = getStoredUser();

  const userName = storedUser?.name || 'Parsiajar Batak';
  const userMarga = storedUser?.marga ? `Marga ${storedUser.marga}` : 'Batak Toba';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 items-start font-body">
      {/* Left/Center: Main Learning Curriculum Tree */}
      <div className="flex-1 w-full max-w-2xl mx-auto">
        {UNITS.map(unit => {
          const isUnitUnlocked = progress.unlockedUnits.includes(unit.id);
          const config = UNIT_CONFIGS[unit.number] || UNIT_CONFIGS[1];
          const UnitIcon = config.icon;

          // Calculate completed lessons inside this unit
          const completedInUnit = unit.lessons.filter(l =>
            progress.completedLessons.includes(l.id)
          ).length;
          const isUnitFullyCompleted = completedInUnit === unit.lessons.length;

          return (
            <div key={unit.id} className="mb-14">
              {/* Unit Header Card: Papan Ukir Datar Bergaris Arang */}
              <div className="card-batak-dark overflow-hidden mb-10 relative">
                {/* Pembatas Section: Pita 3 Garis (Arang, Secang, Kapur) setinggi 6px */}
                <PitaTenun />

                <div className="p-6 relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Aksara Batak Watermark (Regular weight, font-synthesis none) */}
                  <div
                    className="font-batak absolute -right-2 -bottom-2 text-7xl text-[#F4EDE0]/5 select-none pointer-events-none"
                    style={{ fontWeight: 400, fontSynthesis: 'none' }}
                    aria-hidden="true"
                  >
                    {config.aksara}
                  </div>

                  {/* Left Content */}
                  <div className="relative z-10 max-w-lg">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-[2px] bg-[#2C2622] text-[#D9A21B] border border-[#433D38]">
                        UNIT 0{unit.number}
                      </span>
                      <span className="text-[11px] font-semibold text-[#E8DFC8]">
                        {config.badgeLabel}
                      </span>
                    </div>

                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#F4EDE0] tracking-tight leading-snug">
                      {unit.title}
                    </h2>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-[#D9A21B] italic">
                        {unit.batakTitle}
                      </span>
                      <span className="text-[#433D38] text-xs">•</span>
                      <span
                        className="font-batak text-xs text-[#E8DFC8] tracking-wider"
                        style={{ fontWeight: 400, fontSynthesis: 'none' }}
                      >
                        {config.aksara}
                      </span>
                    </div>

                    <p className="text-[#E8DFC8] text-xs sm:text-sm mt-2 leading-relaxed font-medium">
                      {unit.description}
                    </p>

                    {/* Unit Progress: Motif Garis Tenun (Bukan Gradasi) */}
                    <div className="mt-4 flex items-center gap-3">
                      <div className="progress-tenun-container flex-1 max-w-[200px]">
                        <div
                          className="progress-tenun-bar"
                          style={{
                            width: `${(completedInUnit / unit.lessons.length) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#E8DFC8]">
                        {completedInUnit} / {unit.lessons.length} Pelajaran
                      </span>
                      {isUnitFullyCompleted && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-[2px] bg-[#FAF6EE] text-[#1E1A17] border border-[#1E1A17]">
                          Tuntas
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Cultural Icon Medallion */}
                  <div className="relative z-10 shrink-0 self-end sm:self-center">
                    <div className="w-14 h-14 rounded-[4px] bg-[#2C2622] border-[1.5px] border-[#433D38] flex items-center justify-center">
                      <UnitIcon className="text-[#D9A21B]" size={26} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson Path Nodes */}
              <div className="flex flex-col items-center gap-10 py-2 relative">
                {unit.lessons.map((lesson, idx) => {
                  const isCompleted = progress.completedLessons.includes(lesson.id);
                  const isUnlocked =
                    isUnitUnlocked &&
                    (idx === 0 || progress.completedLessons.includes(unit.lessons[idx - 1].id));
                  const isCurrent = isUnlocked && !isCompleted;

                  const showMascotGuide = isCurrent && unit.number === 1;

                  // Alternating offset for pathway
                  const offsets = [
                    'translate-x-0',
                    'translate-x-8 sm:translate-x-12',
                    '-translate-x-8 sm:-translate-x-12'
                  ];
                  const offsetClass = offsets[idx % offsets.length];

                  return (
                    <div
                      key={lesson.id}
                      className={`relative flex flex-col items-center transition-transform ${offsetClass}`}
                    >
                      {/* Mascot Companion Guide beside active node */}
                      {showMascotGuide && (
                        <div className="absolute right-full mr-5 top-1/2 -translate-y-1/2 hidden xl:flex items-center z-20 pointer-events-none animate-in fade-in duration-200">
                          <div className="card-batak p-3 flex items-center gap-3 max-w-[220px]">
                            <Mascot
                              mood="happy"
                              size="sm"
                              showStatusLabel={false}
                              interactive={false}
                            />
                            <div>
                              <div className="text-[10px] font-bold uppercase text-[#A62B1F] tracking-wider">
                                Panduan Gale
                              </div>
                              <p className="text-xs font-bold text-[#1E1A17] mt-0.5 leading-snug">
                                Horas! Mulai parsiajaran dison.
                              </p>
                              <p className="text-[10px] text-[#433D38] mt-0.5">
                                Klik tombol untuk mulai.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Lesson Node: Papan Datar Radius 4px, Tepi Bawah 3px Lebih Gelap */}
                      <button
                        type="button"
                        disabled={!isUnlocked}
                        onClick={() => onSelectLesson(lesson)}
                        aria-label={`${lesson.title} (${
                          isCompleted ? 'Selesai' : isUnlocked ? 'Mulai Pelajaran' : 'Terkunci'
                        })`}
                        className={`relative w-18 h-18 sm:w-20 sm:h-20 flex flex-col items-center justify-center transition-all ${
                          isCompleted
                            ? 'btn-secang'
                            : isCurrent
                            ? 'btn-indigo'
                            : 'bg-[#FAF6EE] border-[1.5px] border-[#433D38] text-[#433D38] opacity-60 cursor-not-allowed rounded-[4px]'
                        }`}
                      >
                        {isCompleted ? (
                          <Check size={28} className="stroke-[3] text-[#F4EDE0]" />
                        ) : isCurrent ? (
                          <Play size={24} className="fill-[#F4EDE0] text-[#F4EDE0] translate-x-0.5" />
                        ) : (
                          <Lock size={20} className="text-[#433D38]" />
                        )}

                        {/* XP Badge Pill: Radius 2px Bergaris Arang */}
                        <div
                          className={`absolute -bottom-2.5 px-2 py-0.5 rounded-[2px] text-[10px] font-bold border whitespace-nowrap flex items-center gap-0.5 ${
                            isCompleted
                              ? 'bg-[#1E1A17] text-[#D9A21B] border-[#1E1A17]'
                              : isCurrent
                              ? 'bg-[#FAF6EE] text-[#1E1A17] border-[#1E1A17]'
                              : 'bg-[#E8DFC8] text-[#433D38] border-[#433D38]'
                          }`}
                        >
                          <Zap size={10} className={isCompleted ? 'fill-[#D9A21B]' : ''} />
                          +{lesson.xpReward} XP
                        </div>
                      </button>

                      {/* Lesson Title & Status Label */}
                      <div className="mt-3.5 text-center z-10 max-w-[210px]">
                        <div className="card-batak px-3 py-1.5">
                          <p className="text-xs font-bold tracking-tight text-[#1E1A17] truncate">
                            {lesson.title}
                          </p>
                          <div className="flex items-center justify-center gap-1.5 mt-0.5">
                            {isCompleted ? (
                              <span className="text-[10px] font-bold text-[#A62B1F] flex items-center gap-1">
                                <Check size={11} className="stroke-[3]" /> Tuntas
                              </span>
                            ) : isCurrent ? (
                              <span className="text-[10px] font-bold uppercase text-[#23365A] tracking-wider">
                                Pelajaran Aktif
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium text-[#433D38]">
                                Terkunci
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Sidebar: Institutional Gamification Stats & Cultural Cards */}
      <div className="w-full lg:w-80 flex flex-col gap-4 sticky top-24">
        {/* Card 1: User Profile & Gordang Level */}
        <div className="card-batak p-5">
          <div className="flex items-center gap-3 mb-3.5">
            <GorgaShield size={40} className="shrink-0" />
            <div className="overflow-hidden">
              <p className="font-heading font-bold text-[#1E1A17] text-base truncate">
                {userName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold text-[#1E1A17] bg-[#E8DFC8] border border-[#1E1A17] px-2 py-0.5 rounded-[2px]">
                  {userMarga}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E1A17]/20">
            <div className="flex items-center justify-between text-xs font-bold text-[#1E1A17] mb-1.5">
              <span className="text-[#433D38] uppercase tracking-wider text-[10px]">
                Gordang Level
              </span>
              <span className="text-[#A62B1F] font-bold">
                Tingkat {levelInfo.level} • {levelInfo.title}
              </span>
            </div>

            {/* Progress tenun motif */}
            <div className="progress-tenun-container">
              <div
                className="progress-tenun-bar"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-[#433D38] mt-1">
              <span>{levelInfo.currentXp} XP</span>
              <span>{levelInfo.nextLevelXp} XP</span>
            </div>
          </div>
        </div>

        {/* Card 2: Tondi (Nyawa Semangat) */}
        <div className="card-batak p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Heart size={15} className="text-[#A62B1F] fill-[#A62B1F]" />
              <span className="text-xs font-bold uppercase text-[#1E1A17] tracking-wider">
                Tondi (Daya Hidup)
              </span>
            </div>
            <span className="text-xs font-bold text-[#A62B1F] px-2 py-0.5 rounded-[2px] bg-[#E8DFC8] border border-[#1E1A17]">
              {progress.hearts} / {progress.maxHearts}
            </span>
          </div>

          {/* Visual Heart Indicators: Balok Tegas */}
          <div className="flex items-center gap-1.5 mb-3">
            {Array.from({ length: progress.maxHearts }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-[1px] border border-[#1E1A17] transition-all ${
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
            className="btn-secang w-full py-2.5 text-xs"
          >
            Pulihkan Penuh Tondi (Gratis)
          </button>
        </div>

        {/* Card 3: Daily Quests (Tugas Sadari On) */}
        <div className="card-batak p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Zap className="text-[#D9A21B]" size={16} />
              <h3 className="font-heading font-bold text-[#1E1A17] text-sm">
                Tugas Sadari On (Harian)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-[#433D38] uppercase tracking-wider">
              24 Jam
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {DAILY_QUESTS.map((q, idx) => {
              const QuestIcon = idx === 0 ? Flame : idx === 1 ? Mic : BookOpen;

              return (
                <div
                  key={q.id}
                  className="p-2.5 bg-[#F4EDE0] rounded-[2px] border border-[#1E1A17] text-xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-[2px] bg-[#E8DFC8] border border-[#1E1A17] flex items-center justify-center text-[#1E1A17] shrink-0">
                        <QuestIcon size={12} />
                      </div>
                      <span className="font-bold text-[#1E1A17] leading-tight">
                        {q.title}
                      </span>
                    </div>
                    <span className="font-bold text-[#A62B1F] shrink-0 bg-[#E8DFC8] px-1.5 py-0.2 rounded-[2px] border border-[#1E1A17] text-[10px]">
                      +{q.rewardXP} XP
                    </span>
                  </div>

                  <div className="progress-tenun-container h-2 mt-1.5">
                    <div
                      className="progress-tenun-bar"
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

        {/* Card 4: Lemari Tenun Ulos Promo Card */}
        <div
          onClick={() => onNavigateToTab('ulos')}
          className="card-batak p-5 cursor-pointer hover:bg-[#E8DFC8]/60 transition"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A62B1F] bg-[#E8DFC8] border border-[#1E1A17] px-2 py-0.5 rounded-[2px]">
              Warisan Tenun Adat
            </span>
            <ArrowRight size={14} className="text-[#1E1A17]" />
          </div>
          <h4 className="font-heading font-bold text-base text-[#1E1A17] tracking-tight">
            Lemari Tenun Ulos Batak
          </h4>
          <p className="text-xs text-[#433D38] mt-1 leading-relaxed">
            Koleksi kain sakral Ulos Mangiring, Ragidup, dan Sadum sebagai simbol doa keselamatan.
          </p>
          <div className="mt-2.5 flex items-center gap-1 text-xs font-bold text-[#23365A] underline">
            <span>Buka Galeri Ulos</span>
            <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
};
