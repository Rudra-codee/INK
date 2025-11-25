import type { AuthResponse, User } from '@/types/auth';
import type { Document, DocumentCreatePayload, DocumentUpdatePayload } from '@/types/document';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type RequestOptions = RequestInit & {
  token?: string | null;
};

const buildUrl = (path: string) => {
  if (path.startsWith('http')) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const request = async <T>(path: string, options: RequestOptions = {}) => {
  const { token, headers, ...rest } = options;
  const response = await fetch(buildUrl(path), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...rest,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (data as { error?: string })?.error || 'Request failed';
    throw new Error(message);
  }

  return data as T;
};

export const authApi = {
  signup: (payload: { name: string; email: string; password: string }) =>
    request<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  googleLogin: (idToken: string) =>
    request<AuthResponse>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    }),
  refresh: () => request<AuthResponse>('/api/auth/refresh', { method: 'POST' }),
  me: (token: string) =>
    request<{ user: User }>('/api/me', {
      method: 'GET',
      token,
    }),
  logout: (token?: string | null) =>
    request<{ ok: boolean }>('/api/auth/logout', {
      method: 'POST',
      token,
    }),
};

export const docsApi = {
  create: (payload: DocumentCreatePayload, token: string) =>
    request<Document>('/api/docs/create', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),

  list: (token: string) =>
    request<Document[]>('/api/docs', {
      token,
    }),

  get: (id: string, token: string) =>
    request<Document>(`/api/docs/${id}`, {
      token,
    }),

  update: (id: string, payload: DocumentUpdatePayload, token: string) =>
    request<Document>(`/api/docs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      token,
    }),

  delete: (id: string, token: string) =>
    request<{ ok: boolean }>(`/api/docs/${id}`, {
      method: 'DELETE',
      token,
    }),
};


