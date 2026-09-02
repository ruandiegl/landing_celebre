/// <reference path="./cookie.d.ts" />

import { randomBytes } from 'node:crypto';
import { parse, serialize } from 'cookie';
import { ADMIN_SESSION_MAX_AGE_SECONDS } from './admin-session.js';

export const ADMIN_SESSION_COOKIE = 'celebre_admin_session';
export const ADMIN_CSRF_COOKIE = 'celebre_admin_csrf';

function serializeAdminCookie(
  name: string,
  value: string,
  secure: boolean,
  httpOnly: boolean,
  maxAge = ADMIN_SESSION_MAX_AGE_SECONDS,
): string {
  return serialize(name, value, {
    httpOnly,
    maxAge,
    path: '/',
    sameSite: 'strict',
    secure,
  });
}

export function createCsrfToken(): string {
  return randomBytes(32).toString('base64url');
}

export function buildAdminCookieHeaders(
  sessionToken: string,
  csrfToken: string,
  secure: boolean,
): string[] {
  return [
    serializeAdminCookie(ADMIN_SESSION_COOKIE, sessionToken, secure, true),
    serializeAdminCookie(ADMIN_CSRF_COOKIE, csrfToken, secure, false),
  ];
}

export function clearAdminCookieHeaders(secure: boolean): string[] {
  return [
    serializeAdminCookie(ADMIN_SESSION_COOKIE, '', secure, true, 0),
    serializeAdminCookie(ADMIN_CSRF_COOKIE, '', secure, false, 0),
  ];
}

export function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  try {
    return parse(header);
  } catch {
    return {};
  }
}
