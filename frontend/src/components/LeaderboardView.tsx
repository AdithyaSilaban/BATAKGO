import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { LEADERBOARD_USERS } from '../utils/batakData';
import { fetchLeaderboardApi, LeaderboardUser } from '../utils/apiClient';
import { Mascot } from './Mascot';
import { GorgaMedal, PitaTenun } from './GorgaEmblem';

interface LeaderboardViewProps {
  userXP: number;
  userStreak: number;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ userXP, userStreak }) => {
  const [liveUsers, setLiveUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadLeaderboard = async () => {
    setLoading(true);
    const data = await fetchLeaderboardApi();
    if (data && data.length > 0) {
      setLiveUsers(data);
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
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8 font-body">
      {/* Banner */}
      <div className="bg-[#1E1A17] rounded-[4px] text-[#F4EDE0] mb-4 sm:mb-8 border-[1.5px] border-[#1E1A17] relative overflow-hidden">
        <PitaTenun />

        <div className="p-4 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5 sm:mb-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#2C2622] text-[#F4EDE0] border border-[#433D38] px-2.5 py-0.5 rounded-[2px]">
                Liga Parsiajar Batak
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#F4EDE0]">
              Papan Skor Juara
            </h1>
            <p className="text-[#E8DFC8] text-xs sm:text-sm mt-1 sm:mt-1.5 max-w-md leading-relaxed font-medium">
              Selesaikan modul pelajaran untuk mengumpulkan poin Gordang XP dan mempertahankan posisi teratas!
            </p>
          </div>
          <Mascot
            mood="happy"
            size="sm"
            showStatusLabel={false}
          />
        </div>
      </div>

      {/* Podium Top 3 */}
      {top1 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8 pt-2 sm:pt-4 items-end">
          {/* Rank 2 */}
          <div className="card-batak p-2 sm:p-5 text-center flex flex-col items-center justify-end">
            <GorgaMedal rank={2} size={28} />
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-[2px] bg-[#E8DFC8] flex items-center justify-center font-heading font-bold text-[#1E1A17] text-xs sm:text-base my-1.5 sm:my-2 border border-[#1E1A17]">
              {top2?.name ? top2.name.charAt(0) : '2'}
            </div>
            <p className="font-bold text-[#1E1A17] text-[11px] sm:text-sm truncate w-full">
              {top2?.name || '-'}
            </p>
            <span className="text-[#A62B1F] font-bold text-xs sm:text-sm mt-0.5 sm:mt-1">
              {top2?.xp || 0} <span className="text-[10px] sm:text-xs font-normal text-[#433D38]">XP</span>
            </span>
          </div>

          {/* Rank 1 */}
          <div className="card-batak p-2.5 sm:p-6 text-center flex flex-col items-center justify-end border-[2px] border-[#D9A21B] -translate-y-1 sm:-translate-y-2">
            <GorgaMedal rank={1} size={34} />
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-[2px] bg-[#D9A21B] flex items-center justify-center font-heading font-bold text-[#1E1A17] text-sm sm:text-lg my-1.5 sm:my-2 border border-[#1E1A17]">
              {top1?.name ? top1.name.charAt(0) : '1'}
            </div>
            <p className="font-bold text-[#1E1A17] text-xs sm:text-base truncate w-full">
              {top1?.name || '-'}
            </p>
            <span className="text-[#A62B1F] font-bold text-sm sm:text-base mt-0.5 sm:mt-1">
              {top1?.xp || 0} <span className="text-[10px] sm:text-xs font-semibold text-[#433D38]">XP</span>
            </span>
          </div>

          {/* Rank 3 */}
          <div className="card-batak p-2 sm:p-5 text-center flex flex-col items-center justify-end">
            <GorgaMedal rank={3} size={28} />
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-[2px] bg-[#E8DFC8] flex items-center justify-center font-heading font-bold text-[#1E1A17] text-xs sm:text-base my-1.5 sm:my-2 border border-[#1E1A17]">
              {top3?.name ? top3.name.charAt(0) : '3'}
            </div>
            <p className="font-bold text-[#1E1A17] text-[11px] sm:text-sm truncate w-full">
              {top3?.name || '-'}
            </p>
            <span className="text-[#A62B1F] font-bold text-xs sm:text-sm mt-0.5 sm:mt-1">
              {top3?.xp || 0} <span className="text-[10px] sm:text-xs font-normal text-[#433D38]">XP</span>
            </span>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="card-batak overflow-hidden">
        <div className="p-3 sm:p-4 bg-[#E8DFC8] border-b-[1.5px] border-[#1E1A17] flex items-center justify-between">
          <h2 className="font-heading text-sm sm:text-base font-bold text-[#1E1A17]">
            Daftar Peringkat Lengkap
          </h2>
          <button
            type="button"
            onClick={loadLeaderboard}
            disabled={loading}
            className="btn-outline-arang px-2 sm:px-2.5 py-1 text-xs"
          >
            <RefreshCw size={12} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>
        </div>

        <div className="divide-y divide-[#1E1A17]/20">
          {liveUsers.map(user => {
            return (
              <div
                key={user.id}
                className={`flex items-center justify-between p-2.5 sm:p-3.5 transition ${
                  user.isCurrentUser
                    ? 'bg-[#E8DFC8]/70 border-l-4 border-l-[#A62B1F]'
                    : 'hover:bg-[#FAF6EE]'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                  <span className="w-5 sm:w-6 text-center font-bold text-xs text-[#433D38] shrink-0">
                    {user.rank}
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] bg-[#FAF6EE] border border-[#1E1A17] flex items-center justify-center font-bold text-xs text-[#1E1A17] shrink-0">
                    {user.avatar || user.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-xs sm:text-sm text-[#1E1A17] flex items-center gap-1.5 truncate">
                      <span className="truncate">{user.name}</span>
                      {user.isCurrentUser && (
                        <span className="text-[9px] sm:text-[10px] bg-[#23365A] text-[#F4EDE0] px-1.5 py-0.2 rounded-[2px] font-bold shrink-0">
                          Anda
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-[#433D38]">
                      Streak: {user.streak || 1} hari
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="font-bold text-xs sm:text-sm text-[#A62B1F]">
                    {user.xp}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#433D38] ml-1">XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
