import React from 'react';
import { Trophy, Flame, Sparkles, Medal } from 'lucide-react';
import { LEADERBOARD_USERS } from '../utils/batakData';
import { Mascot } from './Mascot';

interface LeaderboardViewProps {
  userXP: number;
  userStreak: number;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ userXP, userStreak }) => {
  // Update user in leaderboard with live XP and streak
  const users = LEADERBOARD_USERS.map(u => {
    if (u.isUser) {
      return { ...u, xp: userXP, streak: userStreak };
    }
    return u;
  }).sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-red-600 to-amber-700 rounded-3xl p-6 text-white mb-6 border-2 border-amber-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block mb-2">
            Liga Parsiajar Batak
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Fredoka',sans-serif]">
            Papan Skor Juara Mingguan
          </h1>
          <p className="text-amber-100 text-sm mt-1 max-w-md">
            Selesaikan pelajaran setiap hari untuk mempertahankan posisi teratas dan mengumpulkan poin Gordang XP!
          </p>
        </div>
        <Mascot
          mood="happy"
          size="lg"
          speech="Gale bangga melihat semangatmu! Toruskon!"
          showStatusLabel={false}
        />
      </div>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 pt-6">
        {/* Rank 2 */}
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-4 text-center flex flex-col items-center justify-end shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-2xl mb-2">
            {users[1]?.avatar}
          </div>
          <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center mb-1">
            2
          </span>
          <p className="font-extrabold text-stone-900 text-xs sm:text-sm truncate w-full">
            {users[1]?.name}
          </p>
          <span className="text-amber-600 font-black text-sm sm:text-base font-['Fredoka',sans-serif]">
            {users[1]?.xp} XP
          </span>
        </div>

        {/* Rank 1 */}
        <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl border-2 border-amber-400 p-4 text-center flex flex-col items-center justify-end shadow-md -translate-y-4">
          <div className="text-amber-500 mb-1 animate-bounce">
            <Trophy size={28} />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mb-2 ring-4 ring-amber-300/50">
            {users[0]?.avatar}
          </div>
          <span className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center mb-1">
            1
          </span>
          <p className="font-extrabold text-stone-900 text-xs sm:text-sm truncate w-full">
            {users[0]?.name}
          </p>
          <span className="text-amber-600 font-black text-base sm:text-lg font-['Fredoka',sans-serif]">
            {users[0]?.xp} XP
          </span>
        </div>

        {/* Rank 3 */}
        <div className="bg-white rounded-3xl border-2 border-stone-200 p-4 text-center flex flex-col items-center justify-end shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl mb-2">
            {users[2]?.avatar}
          </div>
          <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center mb-1">
            3
          </span>
          <p className="font-extrabold text-stone-900 text-xs sm:text-sm truncate w-full">
            {users[2]?.name}
          </p>
          <span className="text-amber-600 font-black text-sm sm:text-base font-['Fredoka',sans-serif]">
            {users[2]?.xp} XP
          </span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl border-2 border-stone-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-stone-100">
          {users.map((u, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={u.name}
                className={`flex items-center justify-between p-4 px-6 transition-colors ${
                  u.isUser
                    ? 'bg-amber-50/80 border-l-4 border-l-amber-500 font-bold'
                    : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-7 text-center font-black text-sm ${
                    rank <= 3 ? 'text-amber-600' : 'text-stone-400'
                  }`}>
                    {rank}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-xl shrink-0">
                    {u.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-stone-900 text-sm">
                        {u.name}
                      </p>
                      {u.isUser && (
                        <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                          ANDA
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-500 font-medium">
                      {u.badge}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-100/60 px-2 py-1 rounded-lg">
                    <Flame size={14} className="fill-amber-500 text-amber-500" />
                    <span>{u.streak} hari</span>
                  </div>
                  <span className="font-black text-stone-800 font-['Fredoka',sans-serif] text-base min-w-16">
                    {u.xp} XP
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
