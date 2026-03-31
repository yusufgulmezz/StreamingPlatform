const BASE_URL = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── İçerik API ──
import type { Content, ApiResult } from '../types';

export const contentApi = {
  getAll: () => request<Content[]>('/contents'),
  getById: (id: number) => request<Content>(`/contents/${id}`),
  create: (content: Partial<Content>) =>
    request<Content>('/contents', { method: 'POST', body: JSON.stringify(content) }),
  play: (contentId: number, userId: number) =>
    request<ApiResult>(`/contents/${contentId}/play?userId=${userId}`, { method: 'POST' }),
  download: (contentId: number) =>
    request<ApiResult>(`/contents/${contentId}/download`, { method: 'POST' }),
  delete: (id: number) =>
    request<{ message: string }>(`/contents/${id}`, { method: 'DELETE' }),
};

// ── Kullanıcı API ──
import type { User, SubscriptionInfo } from '../types';

export const userApi = {
  getAll: () => request<User[]>('/users'),
  getById: (id: number) => request<User>(`/users/${id}`),
  create: (user: Partial<User>) =>
    request<User>('/users', { method: 'POST', body: JSON.stringify(user) }),
  getSubscription: (id: number) => request<SubscriptionInfo>(`/users/${id}/subscription`),
  changeSubscription: (id: number, type: string) =>
    request<SubscriptionInfo>(`/users/${id}/subscription?type=${type}`, { method: 'PUT' }),
};

// ── İzleme Listesi API ──
import type { WatchlistItem } from '../types';

export const watchlistApi = {
  get: (userId: number) => request<WatchlistItem[]>(`/watchlist/${userId}`),
  add: (userId: number, contentId: number) =>
    request<ApiResult>(`/watchlist/${userId}?contentId=${contentId}`, { method: 'POST' }),
  remove: (userId: number, contentId: number) =>
    request<ApiResult>(`/watchlist/${userId}?contentId=${contentId}`, { method: 'DELETE' }),
};
