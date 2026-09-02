import type { AdminSession, ContentDocument } from './admin-types';
import type { LandingContent } from '@/content/landing-content';
import type { MediaAsset } from '@/storage/media-storage';

interface ErrorPayload {
  error?: { code?: string; message?: string; retryAfter?: number };
}

export class AdminApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly retryAfter?: number,
  ) {
    super(message);
    this.name = 'AdminApiError';
  }
}

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const encodedName = `${encodeURIComponent(name)}=`;
  const part = document.cookie
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(encodedName) || item.startsWith(`${name}=`));
  if (!part) return undefined;
  const value = part.slice(part.indexOf('=') + 1);
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getAdminCsrfToken(): string | undefined {
  return readCookie('celebre_admin_csrf');
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const method = (init.method ?? 'GET').toUpperCase();
  if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    const csrf = getAdminCsrfToken();
    if (csrf) headers.set('X-CSRF-Token', csrf);
  }
  const response = await fetch(path, {
    ...init,
    headers,
    credentials: 'same-origin',
  });
  if (!response.ok) {
    let body: ErrorPayload = {};
    try {
      body = (await response.json()) as ErrorPayload;
    } catch {
      // Keep a generic message for non-JSON platform errors.
    }
    throw new AdminApiError(
      response.status,
      body.error?.code ?? 'REQUEST_FAILED',
      body.error?.message ?? 'Não foi possível concluir a solicitação.',
      body.error?.retryAfter,
    );
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const response = await request<{ session: AdminSession }>('/api/admin/session');
    return response.session;
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 401) return null;
    throw error;
  }
}

export async function loginAdmin(username: string, password: string): Promise<AdminSession> {
  const response = await request<{ session: AdminSession }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  return response.session;
}

export async function logoutAdmin(): Promise<void> {
  await request<void>('/api/admin/logout', { method: 'POST' });
}

export async function updateLandingContent(content: LandingContent, revision?: string): Promise<ContentDocument> {
  return request<ContentDocument>('/api/admin/content', {
    method: 'PUT',
    body: JSON.stringify({ content, revision }),
  });
}

export async function resetLandingContent(revision?: string): Promise<ContentDocument> {
  return request<ContentDocument>('/api/admin/content-reset', {
    method: 'POST',
    body: JSON.stringify({ revision }),
  });
}

export async function listAdminMedia(): Promise<MediaAsset[]> {
  const response = await request<{ assets: MediaAsset[] }>('/api/admin/media');
  return response.assets;
}

export async function removeAdminMedia(pathname: string): Promise<void> {
  await request<void>('/api/admin/media', {
    method: 'DELETE',
    body: JSON.stringify({ pathname }),
  });
}
