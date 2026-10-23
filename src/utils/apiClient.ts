/**
 * BATAKGO API Client
 * Terhubung dengan Laravel 13 RESTful API & MySQL Database
 * Mendukung graceful offline fallback
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  marga?: string;
  avatar?: string;
  xp: number;
  streak: number;
  hearts: number;
  max_hearts: number;
  completed_lessons?: string[];
  unlocked_units?: string[];
  unlocked_ulos?: string[];
}

export interface LeaderboardUser {
  rank: number;
  id: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}

// Token storage helpers
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('batakgo_auth_token');
};

export const setStoredToken = (token: string | null) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('batakgo_auth_token', token);
  } else {
    localStorage.removeItem('batakgo_auth_token');
  }
};

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('batakgo_auth_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: AuthUser | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('batakgo_auth_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('batakgo_auth_user');
  }
};

// Generic request helper with timeout & graceful degradation
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new Error(errData?.message || `API Error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`[BATAKGO API] Request failed for ${endpoint}:`, error);
    return null;
  }
}

// 1. Auth APIs
export async function registerApi(data: {
  name: string;
  email: string;
  password: string;
  marga?: string;
  avatar?: string;
}): Promise<{ token: string; user: AuthUser } | null> {
  const res = await request<{ status: string; token: string; user: AuthUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (res && res.token && res.user) {
    setStoredToken(res.token);
    setStoredUser(res.user);
    return { token: res.token, user: res.user };
  }
  return null;
}

export async function loginApi(data: {
  email: string;
  password: string;
}): Promise<{ token: string; user: AuthUser } | null> {
  const res = await request<{ status: string; token: string; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (res && res.token && res.user) {
    setStoredToken(res.token);
    setStoredUser(res.user);
    return { token: res.token, user: res.user };
  }
  return null;
}

export async function fetchCurrentUserApi(): Promise<AuthUser | null> {
  const res = await request<{ status: string; user: AuthUser }>('/auth/me');
  if (res && res.user) {
    setStoredUser(res.user);
    return res.user;
  }
  return null;
}

export async function logoutApi(): Promise<void> {
  await request('/auth/logout', { method: 'POST' });
  setStoredToken(null);
  setStoredUser(null);
}

// 2. Progress Sync APIs
export async function syncProgressApi(payload: {
  xpEarned: number;
  lessonId?: string;
  unlockedUnitId?: string;
  heartsRemaining: number;
  unlockedUlosId?: string;
}): Promise<any> {
  return await request('/progress/sync', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function refillHeartsApi(): Promise<any> {
  return await request('/progress/refill-hearts', {
    method: 'POST',
  });
}

// 3. Leaderboard API
export async function fetchLeaderboardApi(): Promise<LeaderboardUser[] | null> {
  const res = await request<{ status: string; data: LeaderboardUser[] }>('/leaderboard');
  if (res && res.data) {
    return res.data;
  }
  return null;
}

// 4. Open Cultural API (Interoperability Demo)
export async function fetchOpenDictionary(query?: string, category?: string) {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (category && category !== 'all') params.append('category', category);
  return await request<any>(`/v1/open/dictionary?${params.toString()}`);
}

export async function calculatePartuturanApi(myGender: string, relation: string) {
  return await request<any>(`/v1/open/partuturan?my_gender=${myGender}&relation=${relation}`);
}

export async function transliterateAksaraApi(text: string) {
  return await request<any>(`/v1/open/aksara?text=${encodeURIComponent(text)}`);
}

