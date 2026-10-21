/**
 * Gamification state & persistence for BATAKGO
 */

export interface UserProgress {
  hearts: number; // 0 to 5 (Tondi)
  maxHearts: number;
  lastHeartRegenTime: number; // timestamp
  xp: number;
  streak: number; // days
  lastCompletedDate: string; // YYYY-MM-DD
  completedLessons: string[]; // lesson ids
  unlockedUnits: string[]; // unit ids
  collectedUlos: {
    id: string;
    name: string;
    description: string;
    earnedDate?: string;
  }[];
}

const STORAGE_KEY = 'batakgo_progress_v1';

export const INITIAL_PROGRESS: UserProgress = {
  hearts: 5,
  maxHearts: 5,
  lastHeartRegenTime: Date.now(),
  xp: 120,
  streak: 3,
  lastCompletedDate: new Date().toISOString().split('T')[0],
  completedLessons: ['u1-l1'],
  unlockedUnits: ['unit-1', 'unit-2'],
  collectedUlos: [
    {
      id: 'ulos-mangiring',
      name: 'Ulos Mangiring',
      description: 'Diberikan sebagai doa restu kesuburan dan keberkahan langkah awal belajar.',
      earnedDate: '2026-10-19'
    },
    {
      id: 'ulos-ragidup',
      name: 'Ulos Ragidup',
      description: 'Ulos lambang kehidupan dan keluhuran derajat budi pekerti.',
      earnedDate: '2026-10-20'
    }
  ]
};

export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_PROGRESS, ...parsed };
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress to localStorage:', err);
  }
}

export function calculateLevel(xp: number): { level: number; title: string; currentXp: number; nextLevelXp: number; progressPercent: number } {
  const xpPerLevel = 100;
  const level = Math.floor(xp / xpPerLevel) + 1;
  const currentXp = xp % xpPerLevel;
  const nextLevelXp = xpPerLevel;
  const progressPercent = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));

  const titles = [
    'Parsiajar Baru (Pemula)',
    'Anak Sasada (Pelajar Tekun)',
    'Panortor Sigale-gale (Penari Budaya)',
    'Pande Ulos (Pengrajin Kata)',
    'Parhata Adat (Juru Bicara)',
    'Datu Sakti (Tetua Bahasa)'
  ];

  const title = titles[Math.min(titles.length - 1, level - 1)];

  return { level, title, currentXp, nextLevelXp, progressPercent };
}
