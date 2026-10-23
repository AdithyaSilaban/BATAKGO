import React, { useState, useEffect } from 'react';
import { Trophy, Flame, RefreshCw, Database, Award, UserCheck } from 'lucide-react';
import { LEADERBOARD_USERS } from '../utils/batakData';
import { fetchLeaderboardApi, LeaderboardUser } from '../utils/apiClient';
import { Mascot } from './Mascot';
import { GorgaMedal, GorgaBorder } from './GorgaEmblem';

interface LeaderboardViewProps {
  userXP: number;
  userStreak: number;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ userXP, userStreak }) => {
  const [liveUsers, setLiveUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFromDatabase, setIsFromDatabase] = useState<boolean>(false);

  const loadLeaderboard = async () => {
    setLoading(true);
    const data = await fetchLeaderboardApi();
    if (data && data.length > 0) {
      setLiveUsers(data);
      setIsFromDatabase(true);
    } else {
      // Fallback to local default users
      const fallback = LEADERBOARD_USERS.map((u, idx) => ({
        rank: idx + 1,
        id: idx + 1,
        name: u.name,
        avatar: u.avatar,
        xp: u.isUser ? userXP : u.xp,
        streak: u.isUser ? userStreak : u.streak,
        isCurrentUser: u.isUser,
      })).sort((a, b) => b.xp - a.xp).map((u, idx) => ({ ...u, rank: idx + 1 }));
      setLiveUsers(fallback);
      setIsFromDatabase(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLeaderboard();
  }, [userXP, userStreak]);

  const top1 = liveUsers[0];
  const top2 = liveUsers[1];
  const top3 = liveUsers[2];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#18181B] via-[#27272A] to-[#7F1D1D] rounded-3xl text-white mb-8 border border-stone-800 shadow-xl overflow-hidden relative">
        <GorgaBorder />

        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full text-stone-200">
                Liga Parsiajar Batak
              </span>
              {isFromDatabase && (
                <span className="text-[11px] font-bold bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Database size={12} /> Live MySQL
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Papan Skor Juara Mingguan
            </h1>
            <p className="text-stone-300 text-sm mt-1.5 max-w-md leading-relaxed">
              Pertahankan posisi teratas dengan menyelesaikan babak pelajaran harian dan kumpulkan poin Gordang XP!
            </p>
          </div>
          <Mascot
            mood="happy"
            size="lg"
            speech="Gale bangga melihat semangatmu! Toruskon!"
            showStatusLabel={false}
          />
        </div>
      </div>

      {/* Podium Top 3 */}
      {top1 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8 pt-4 items-end">
          {/* Rank 2 */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 text-center flex flex-col items-center justify-end shadow-xs hover:border-stone-300 transition">
            <GorgaMedal rank={2} size={36} />
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center font-bold text-stone-700 text-lg my-2 border border-stone-200">
              {top2?.name ? top2.name.charAt(0) : '2'}
            </div>
            <p className="font-bold text-stone-900 text-xs sm:text-sm truncate w-full">
              {top2?.name || '-'}
            </p>
            <span className="text-[#991B1B] font-extrabold text-sm sm:text-base mt-1">
              {top2?.xp || 0} <span className="text-xs font-normal text-stone-500">XP</span>
            </span>
          </div>

          {/* Rank 1 */}
          <div className="bg-gradient-to-b from-amber-50/50 to-white rounded-2xl border-2 border-[#D97706] p-5 sm:p-6 text-center flex flex-col items-center justify-end shadow-md -translate-y-2">
            <GorgaMedal rank={1} size={44} />
            <div className="w-14 h-14 rounded-2xl bg-amber-100/60 flex items-center justify-center font-black text-amber-900 text-xl my-2 border border-amber-300">
              {top1?.name ? top1.name.charAt(0) : '1'}
            </div>
            <p className="font-extrabold text-stone-900 text-sm sm:text-base truncate w-full">
              {top1?.name || '-'}
            </p>
            <span className="text-[#991B1B] font-black text-base sm:text-lg mt-1">
              {top1?.xp || 0} <span className="text-xs font-semibold text-stone-500">XP</span>
            </span>
          </div>

          {/* Rank 3 */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 text-center flex flex-col items-center justify-end shadow-xs hover:border-stone-300 transition">
            <GorgaMedal rank={3} size={36} />
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center font-bold text-stone-700 text-lg my-2 border border-stone-200">
              {top3?.name ? top3.name.charAt(0) : '3'}
            </div>
            <p className="font-bold text-stone-900 text-xs sm:text-sm truncate w-full">
              {top3?.name || '-'}
            </p>
            <span className="text-[#991B1B] font-extrabold text-sm sm:text-base mt-1">
              {top3?.xp || 0} <span className="text-xs font-normal text-stone-500">XP</span>
            </span>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between text-xs font-bold text-stone-600">
          <span className="uppercase tracking-wider">Daftar Peringkat Siswa</span>
          <button
            onClick={loadLeaderboard}
            disabled={loading}
            className="flex items-center gap-1.5 text-[#991B1B] hover:text-[#7F1D1D] font-bold cursor-pointer transition"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Perbarui Data</span>
          </button>
        </div>

        <div className="divide-y divide-stone-100">
          {liveUsers.map((u, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={u.id || idx}
                className={`flex items-center justify-between p-3.5 sm:p-4 px-4 sm:px-6 transition ${
                  u.isCurrentUser
                    ? 'bg-amber-50/70 border-l-4 border-l-[#D97706] font-bold'
                    : 'hover:bg-stone-50/80'
                }`}
              >
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <span className={`w-6 text-center font-bold text-sm ${
                    rank <= 3 ? 'text-[#991B1B]' : 'text-stone-400'
                  }`}>
                    {rank}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center font-bold text-stone-700 text-sm border border-stone-200 shrink-0">
                    {u.name ? u.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-stone-900 text-sm">
                        {u.name}
                      </p>
                      {u.isCurrentUser && (
                        <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                          ANDA
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-5 text-right">
                  <div className="flex items-center gap-1 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                    <Flame size={13} className="fill-amber-500 text-amber-500" />
                    <span>{u.streak} hari</span>
                  </div>
                  <span className="font-bold text-stone-800 text-sm sm:text-base min-w-16">
                    {u.xp} <span className="text-xs text-stone-400 font-normal">XP</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
