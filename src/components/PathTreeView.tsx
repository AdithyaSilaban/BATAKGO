import React from 'react';
import {
  Check,
  Lock,
  Play,
  Sparkles,
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
  ShieldCheck
} from 'lucide-react';
import { UNITS, Unit, Lesson, DAILY_QUESTS } from '../utils/batakData';
import { UserProgress, calculateLevel } from '../utils/gamification';
import { getStoredUser } from '../utils/apiClient';
import { GorgaShield, GorgaBorder } from './GorgaEmblem';
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
  accentBorder: string;
  headerGradient: string;
  iconBg: string;
  iconColor: string;
  glowColor: string;
}

const UNIT_CONFIGS: Record<number, UnitVisualConfig> = {
  1: {
    icon: MessageCircle,
    aksara: 'ᯂᯬᯒᯘ᯲',
    badgeLabel: 'Modul Parjolo • Tingkat Dasar',
    accentBorder: 'border-red-900/40',
    headerGradient: 'from-[#1C1917] via-[#2A1515] to-[#18181B]',
    iconBg: 'bg-red-950/80 border-red-800/60',
    iconColor: 'text-red-400',
    glowColor: 'bg-red-600/10'
  },
  2: {
    icon: Users,
    aksara: 'ᯇᯒ᯲ᯖᯮᯖᯮᯒᯉ᯲',
    badgeLabel: 'Kekerabatan Adat • Dalihan Na Tolu',
    accentBorder: 'border-amber-900/40',
    headerGradient: 'from-[#1C1917] via-[#281D14] to-[#18181B]',
    iconBg: 'bg-amber-950/80 border-amber-800/60',
    iconColor: 'text-amber-400',
    glowColor: 'bg-amber-600/10'
  },
  3: {
    icon: Compass,
    aksara: 'ᯖᯀᯬ ᯖᯬᯅ',
    badgeLabel: 'Geografi & Numerasi Danau Toba',
    accentBorder: 'border-teal-900/40',
    headerGradient: 'from-[#1C1917] via-[#102426] to-[#18181B]',
    iconBg: 'bg-teal-950/80 border-teal-800/60',
    iconColor: 'text-teal-400',
    glowColor: 'bg-teal-600/10'
  },
  4: {
    icon: UtensilsCrossed,
    aksara: 'ᯘᯪᯇᯝᯉᯉᯬ᯲',
    badgeLabel: 'Kuliner Tradisional & Keseharian',
    accentBorder: 'border-emerald-900/40',
    headerGradient: 'from-[#1C1917] via-[#112419] to-[#18181B]',
    iconBg: 'bg-emerald-950/80 border-emerald-800/60',
    iconColor: 'text-emerald-400',
    glowColor: 'bg-emerald-600/10'
  },
  5: {
    icon: Crown,
    aksara: 'ᯘᯪᯎᯞᯩᯎᯞᯩ',
    badgeLabel: 'Filsafat Luhur & Legenda Sakral',
    accentBorder: 'border-amber-800/40',
    headerGradient: 'from-[#1C1917] via-[#2B1B10] to-[#18181B]',
    iconBg: 'bg-amber-950/80 border-amber-700/60',
    iconColor: 'text-amber-300',
    glowColor: 'bg-amber-600/10'
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
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 items-start">
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
              {/* Unit Header Card: Clean Cultural Institutional Frame */}
              <div
                className={`relative rounded-2xl border ${config.accentBorder} bg-[#18181B] shadow-xl overflow-hidden mb-10 transition-all hover:border-stone-700`}
              >
                {/* Top Gorga Geometric Border Ribbon */}
                <GorgaBorder className="h-2.5 opacity-90" />

                <div
                  className={`p-6 bg-gradient-to-r ${config.headerGradient} relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
                >
                  {/* Subtle Background Glow & Aksara Watermark */}
                  <div
                    className={`absolute inset-0 ${config.glowColor} pointer-events-none blur-2xl`}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute -right-2 -bottom-2 text-7xl text-white/[0.04] select-none pointer-events-none font-['Noto_Sans_Batak',sans-serif]"
                    aria-hidden="true"
                  >
                    {config.aksara}
                  </div>

                  {/* Left Content */}
                  <div className="relative z-10 max-w-lg">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-stone-900/90 text-amber-400 border border-amber-500/30">
                        UNIT 0{unit.number}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-300">
                        {config.badgeLabel}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                      {unit.title}
                    </h2>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-amber-400/90 italic">
                        {unit.batakTitle}
                      </span>
                      <span className="text-stone-500 text-xs">•</span>
                      <span className="text-xs font-['Noto_Sans_Batak'] text-stone-400 tracking-wider">
                        {config.aksara}
                      </span>
                    </div>

                    <p className="text-stone-300/90 text-xs sm:text-sm mt-2 leading-relaxed">
                      {unit.description}
                    </p>

                    {/* Unit Progress Counter */}
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-1 max-w-[180px] h-1.5 bg-stone-800 rounded-full overflow-hidden border border-stone-700/60">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                          style={{
                            width: `${(completedInUnit / unit.lessons.length) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-stone-300">
                        {completedInUnit} / {unit.lessons.length} Pelajaran
                      </span>
                      {isUnitFullyCompleted && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Tuntas
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Cultural Icon Medallion */}
                  <div className="relative z-10 shrink-0 self-end sm:self-center">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${config.iconBg} border flex items-center justify-center shadow-lg transition-transform hover:scale-105`}
                    >
                      <UnitIcon className={config.iconColor} size={28} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson Path Nodes (Curved Educational Pathway) */}
              <div className="flex flex-col items-center gap-12 py-4 relative">
                {unit.lessons.map((lesson, idx) => {
                  const isCompleted = progress.completedLessons.includes(lesson.id);
                  const isUnlocked =
                    isUnitUnlocked &&
                    (idx === 0 || progress.completedLessons.includes(unit.lessons[idx - 1].id));
                  const isCurrent = isUnlocked && !isCompleted;

                  // Show Sigale-gale mascot companion next to the active lesson in Unit 1
                  const showMascotGuide = isCurrent && unit.number === 1;

                  // Refined alternating offset for balanced pathway
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
                        <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 hidden xl:flex items-center z-20 pointer-events-none animate-in fade-in slide-in-from-right-4 duration-300">
                          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xl p-3.5 flex items-center gap-3 max-w-[240px]">
                            <Mascot
                              mood="happy"
                              size="sm"
                              showStatusLabel={false}
                              interactive={false}
                            />
                            <div>
                              <div className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-600 tracking-wider">
                                <Sparkles size={11} /> Panduan Gale
                              </div>
                              <p className="text-xs font-extrabold text-stone-900 mt-0.5 leading-snug">
                                Horas! Mulai parsiajaran dison.
                              </p>
                              <p className="text-[10px] text-stone-500 mt-0.5">
                                Klik tombol merah untuk memulai latihan.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Lesson Circular Node */}
                      <button
                        type="button"
                        disabled={!isUnlocked}
                        onClick={() => onSelectLesson(lesson)}
                        aria-label={`${lesson.title} (${
                          isCompleted ? 'Selesai' : isUnlocked ? 'Mulai Pelajaran' : 'Terkunci'
                        })`}
                        className={`relative w-20 h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${
                          isCompleted
                            ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-stone-950 border-2 border-amber-300 shadow-md shadow-amber-950/20 ring-4 ring-amber-400/20 hover:scale-105 active:scale-95 cursor-pointer'
                            : isCurrent
                            ? 'bg-gradient-to-b from-red-600 via-red-700 to-red-800 text-white border-2 border-red-300 shadow-xl shadow-red-950/30 ring-4 ring-red-500/30 animate-[pulse_3s_ease-in-out_infinite] hover:scale-105 active:scale-95 cursor-pointer'
                            : 'bg-stone-100 border-2 border-stone-200 text-stone-400 shadow-sm cursor-not-allowed opacity-80'
                        }`}
                      >
                        {isCompleted ? (
                          <Check size={32} className="stroke-[3] text-stone-950" />
                        ) : isCurrent ? (
                          <Play size={28} className="fill-white text-white translate-x-0.5" />
                        ) : (
                          <Lock size={22} className="text-stone-400" />
                        )}

                        {/* XP Badge Pill */}
                        <div
                          className={`absolute -bottom-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide border shadow-sm flex items-center gap-1 whitespace-nowrap ${
                            isCompleted
                              ? 'bg-stone-900 text-amber-300 border-stone-700'
                              : isCurrent
                              ? 'bg-amber-400 text-stone-950 border-amber-300 font-extrabold'
                              : 'bg-stone-200 text-stone-500 border-stone-300'
                          }`}
                        >
                          <Zap size={10} className={isCompleted ? 'fill-amber-400' : ''} />
                          +{lesson.xpReward} XP
                        </div>
                      </button>

                      {/* Lesson Title & Status Label */}
                      <div className="mt-4 text-center z-10 max-w-[210px]">
                        <div
                          className={`px-3.5 py-1.5 rounded-xl border shadow-sm transition-all ${
                            isCurrent
                              ? 'bg-white border-red-200 ring-2 ring-red-500/15'
                              : isCompleted
                              ? 'bg-white border-stone-200'
                              : 'bg-stone-50/80 border-stone-200/60'
                          }`}
                        >
                          <p
                            className={`text-xs sm:text-sm font-extrabold tracking-tight truncate ${
                              isCurrent
                                ? 'text-red-950'
                                : isCompleted
                                ? 'text-stone-900'
                                : 'text-stone-400'
                            }`}
                          >
                            {lesson.title}
                          </p>
                          <div className="flex items-center justify-center gap-1.5 mt-0.5">
                            {isCompleted ? (
                              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                                <Check size={11} className="stroke-[3]" /> Tuntas
                              </span>
                            ) : isCurrent ? (
                              <span className="text-[10px] font-black uppercase text-red-600 tracking-wider flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping inline-block" />
                                Pelajaran Aktif
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium text-stone-400">
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
      <div className="w-full lg:w-80 flex flex-col gap-5 sticky top-24">
        {/* Card 1: User Profile & Gordang Level */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
          <div className="flex items-center gap-3.5 mb-4">
            <GorgaShield size={44} className="shrink-0" />
            <div className="overflow-hidden">
              <p className="font-extrabold text-stone-900 text-base truncate">
                {userName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200/80 px-2 py-0.5 rounded-md">
                  {userMarga}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs font-bold text-stone-600 mb-1.5">
              <span className="text-stone-500 uppercase tracking-wider text-[10px]">
                Gordang Level
              </span>
              <span className="text-amber-700 font-extrabold">
                Tingkat {levelInfo.level} • {levelInfo.title}
              </span>
            </div>

            <div className="h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200/80">
              <div
                className="bg-gradient-to-r from-amber-500 to-red-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-stone-500 mt-1">
              <span>{levelInfo.currentXp} XP</span>
              <span>{levelInfo.nextLevelXp} XP</span>
            </div>
          </div>
        </div>

        {/* Card 2: Tondi (Nyawa Semangat) */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-red-600 fill-red-500" />
              <span className="text-xs font-extrabold uppercase text-stone-700 tracking-wider">
                Tondi (Daya Hidup)
              </span>
            </div>
            <span className="text-xs font-black text-red-700 px-2 py-0.5 rounded-md bg-red-50 border border-red-200">
              {progress.hearts} / {progress.maxHearts}
            </span>
          </div>

          {/* Visual Heart Indicators */}
          <div className="flex items-center gap-2 mb-3">
            {Array.from({ length: progress.maxHearts }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all ${
                  i < progress.hearts
                    ? 'bg-gradient-to-r from-red-500 to-red-600'
                    : 'bg-stone-200'
                }`}
                title={`Tondi ${i + 1}`}
              />
            ))}
          </div>

          <p className="text-xs text-stone-500 leading-relaxed mb-4">
            Tondi melambangkan semangat batiniah. Berkurang bila salah menjawab kuis, dapat dipulihkan kapan saja.
          </p>

          <button
            type="button"
            onClick={onRefillHearts}
            disabled={progress.hearts >= progress.maxHearts}
            className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-800 font-bold text-xs border border-red-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <Sparkles size={14} className="text-red-600" /> Pulihkan Penuh Tondi (Gratis)
          </button>
        </div>

        {/* Card 3: Daily Quests (Tugas Sadari On) */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="text-amber-500" size={17} />
              <h3 className="font-extrabold text-stone-900 text-sm">
                Tugas Sadari On (Harian)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Setiap 24 Jam
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {DAILY_QUESTS.map((q, idx) => {
              const QuestIcon = idx === 0 ? Flame : idx === 1 ? Mic : BookOpen;
              const isQuestCompleted = progress.xp >= q.target;

              return (
                <div
                  key={q.id}
                  className="p-3 bg-stone-50/80 rounded-xl border border-stone-200/90 text-xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-stone-200/70 flex items-center justify-center text-stone-700 shrink-0">
                        <QuestIcon size={13} />
                      </div>
                      <span className="font-bold text-stone-800 leading-tight">
                        {q.title}
                      </span>
                    </div>
                    <span className="font-black text-amber-700 shrink-0 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/70 text-[11px]">
                      +{q.rewardXP} XP
                    </span>
                  </div>

                  <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all"
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
          className="rounded-2xl border border-stone-800 bg-[#18181B] text-white overflow-hidden shadow-md cursor-pointer hover:border-amber-700/60 transition-all group"
        >
          <GorgaBorder className="h-2 opacity-80" />
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                Warisan Tenun Adat
              </span>
              <ArrowRight
                size={15}
                className="text-stone-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all"
              />
            </div>
            <h4 className="font-black text-base text-white tracking-tight">
              Lemari Tenun Ulos Batak
            </h4>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              Koleksi kain sakral Ulos Mangiring, Ragidup, dan Sadum sebagai simbol doa keselamatan.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:underline">
              <span>Buka Galeri Ulos</span>
              <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
