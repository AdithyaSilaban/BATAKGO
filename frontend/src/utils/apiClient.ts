/**
 * BATAKGO API Client
 * Terhubung dengan Laravel 13 RESTful API & MySQL Database
 * Mendukung graceful offline fallback & ID canonicalization
 */

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

export interface ProgressSyncResponse {
  status: 'success' | 'error';
  message: string;
  xp_awarded?: number;
  is_first_completion?: boolean;
  data?: {
    xp: number;
    streak: number;
    hearts: number;
    maxHearts: number;
    completedLessons: string[];
    unlockedUnits: string[];
    unlockedUlos: string[];
  };
}

/**
 * Resolves the API Base URL cleanly for local dev and production environments.
 */
export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return 'http://localhost:8000/api';
};

/**
 * Converts legacy underscore IDs to canonical kebab-case (e.g. 'u1_l1' -> 'u1-l1', 'unit_1' -> 'unit-1').
 */
export const normalizeCanonicalId = (id?: string | null): string => {
  if (!id) return '';
  return id.trim().toLowerCase().replace(/_/g, '-');
};

export const normalizeCanonicalIds = (ids?: (string | null)[] | null): string[] => {
  if (!ids || !Array.isArray(ids)) return [];
  const set = new Set<string>();
  ids.forEach(item => {
    const norm = normalizeCanonicalId(item);
    if (norm) set.add(norm);
  });
  return Array.from(set);
};

export const normalizeAuthUser = (user: AuthUser): AuthUser => {
  return {
    ...user,
    completed_lessons: normalizeCanonicalIds(user.completed_lessons),
    unlocked_units: normalizeCanonicalIds(user.unlocked_units?.length ? user.unlocked_units : ['unit-1']),
    unlocked_ulos: normalizeCanonicalIds(user.unlocked_ulos),
  };
};

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
    const parsed = JSON.parse(raw);
    return normalizeAuthUser(parsed);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: AuthUser | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    const normalized = normalizeAuthUser(user);
    localStorage.setItem('batakgo_auth_user', JSON.stringify(normalized));
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
    const res = await fetch(`${getApiBaseUrl()}${endpoint}`, {
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

// 0. API Health Check
export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await request<{ status: string }>('/health');
    return res?.status === 'healthy';
  } catch {
    return false;
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
    const normalizedUser = normalizeAuthUser(res.user);
    setStoredToken(res.token);
    setStoredUser(normalizedUser);
    return { token: res.token, user: normalizedUser };
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
    const normalizedUser = normalizeAuthUser(res.user);
    setStoredToken(res.token);
    setStoredUser(normalizedUser);
    return { token: res.token, user: normalizedUser };
  }
  return null;
}

export async function fetchCurrentUserApi(): Promise<AuthUser | null> {
  const token = getStoredToken();
  if (!token) return null; // Avoid 401 unauthenticated requests when not logged in

  const res = await request<{ status: string; user: AuthUser }>('/auth/me');
  if (res && res.user) {
    const normalizedUser = normalizeAuthUser(res.user);
    setStoredUser(normalizedUser);
    return normalizedUser;
  }
  return null;
}

export async function logoutApi(): Promise<void> {
  const token = getStoredToken();
  if (token) {
    await request('/auth/logout', { method: 'POST' });
  }
  setStoredToken(null);
  setStoredUser(null);
}

// 2. Progress Sync APIs
export async function syncProgressApi(payload: {
  xpEarned?: number;
  lessonId?: string;
  unlockedUnitId?: string;
  heartsRemaining: number;
  unlockedUlosId?: string;
}): Promise<ProgressSyncResponse | null> {
  const canonicalPayload = {
    ...payload,
    lessonId: payload.lessonId ? normalizeCanonicalId(payload.lessonId) : undefined,
    unlockedUnitId: payload.unlockedUnitId ? normalizeCanonicalId(payload.unlockedUnitId) : undefined,
    unlockedUlosId: payload.unlockedUlosId ? normalizeCanonicalId(payload.unlockedUlosId) : undefined,
  };

  return await request<ProgressSyncResponse>('/progress/sync', {
    method: 'POST',
    body: JSON.stringify(canonicalPayload),
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
