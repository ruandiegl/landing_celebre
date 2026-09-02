import { timingSafeEqual } from 'node:crypto';
import type { AdminSession } from '../lib/admin-types.js';
import {
  ADMIN_SESSION_COOKIE,
  parseCookies,
} from './admin-cookies.js';
import type { AppConfig } from './config.js';
import { ApiError } from './http-errors.js';
import { createSessionToken, verifySessionToken } from './admin-session.js';
import { verifyAdminPassword } from './admin-password.js';

export interface AdminRequest {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  cookies?: Record<string, string | undefined>;
  body?: unknown;
}

function header(request: AdminRequest, name: string): string | undefined {
  const value = request.headers[name.toLowerCase()] ?? request.headers[name];
  return Array.isArray(value) ? value[0] : value;
}

function readSessionCookie(request: AdminRequest): string | undefined {
  return (
    request.cookies?.[ADMIN_SESSION_COOKIE] ??
    parseCookies(header(request, 'cookie'))[ADMIN_SESSION_COOKIE]
  );
}

function safeEqualStrings(left: string, right: string): boolean {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  return (
    leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes)
  );
}

export async function authenticateAdmin(
  username: string,
  password: string,
  config: AppConfig,
): Promise<{ session: AdminSession; token: string }> {
  if (!config.adminPasswordHash || !config.adminSessionSecret) {
    throw new ApiError(
      503,
      'AUTH_NOT_CONFIGURED',
      'A autenticação administrativa não está configurada.',
    );
  }

  const usernameMatches = safeEqualStrings(username, config.adminUsername);
  const passwordMatches = await verifyAdminPassword(
    password,
    config.adminPasswordHash,
  );
  if (!usernameMatches || !passwordMatches) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Usuário ou senha inválidos.');
  }

  const issuedAt = Date.now();
  const token = createSessionToken(
    config.adminUsername,
    config.adminSessionSecret,
    issuedAt,
  );
  return {
    token,
    session: verifySessionToken(token, config.adminSessionSecret, issuedAt)!,
  };
}

export function requireAdmin(
  request: AdminRequest,
  config: AppConfig,
): AdminSession {
  if (!config.adminSessionSecret) {
    throw new ApiError(
      503,
      'AUTH_NOT_CONFIGURED',
      'A autenticação administrativa não está configurada.',
    );
  }
  const token = readSessionCookie(request);
  const session = token
    ? verifySessionToken(token, config.adminSessionSecret)
    : null;
  if (!session || session.username !== config.adminUsername) {
    throw new ApiError(401, 'UNAUTHENTICATED', 'Autenticação necessária.');
  }
  return session;
}

export function getAdminSession(
  request: AdminRequest,
  config: AppConfig,
): AdminSession {
  return requireAdmin(request, config);
}

export function getRequestHeader(
  request: AdminRequest,
  name: string,
): string | undefined {
  return header(request, name);
}
