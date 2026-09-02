import { timingSafeEqual } from 'node:crypto';
import type { AppConfig } from './config';
import { ApiError } from './http-errors';
import { getRequestHeader, type AdminRequest } from './admin-auth';
import { ADMIN_CSRF_COOKIE, parseCookies } from './admin-cookies';

const CSRF_HEADER = 'x-csrf-token';

export function getClientIp(request: AdminRequest): string {
  const forwarded = getRequestHeader(request, 'x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim();
  return (ip || getRequestHeader(request, 'x-real-ip') || 'unknown').slice(0, 128);
}

export function assertSameOrigin(
  request: AdminRequest,
  config: AppConfig,
): void {
  const method = (request.method ?? 'GET').toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return;

  const origin = getRequestHeader(request, 'origin');
  if (!origin) {
    if (!config.isProduction && config.allowedOrigins.length === 0) return;
    throw new ApiError(403, 'ORIGIN_REQUIRED', 'Origem da solicitação ausente.');
  }
  if (!config.allowedOrigins.includes(origin)) {
    throw new ApiError(403, 'ORIGIN_FORBIDDEN', 'Origem não autorizada.');
  }
}

export function assertCsrf(request: AdminRequest): void {
  const headerToken = getRequestHeader(request, CSRF_HEADER);
  const cookieToken =
    request.cookies?.[ADMIN_CSRF_COOKIE] ??
    parseCookies(getRequestHeader(request, 'cookie'))[ADMIN_CSRF_COOKIE];

  if (!headerToken || !cookieToken) {
    throw new ApiError(403, 'CSRF_REQUIRED', 'Token CSRF necessário.');
  }

  const headerBytes = Buffer.from(headerToken);
  const cookieBytes = Buffer.from(cookieToken);
  if (
    headerBytes.length !== cookieBytes.length ||
    !timingSafeEqual(headerBytes, cookieBytes)
  ) {
    throw new ApiError(403, 'CSRF_INVALID', 'Token CSRF inválido.');
  }
}
