import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AdminSession } from '../lib/admin-types.js';

export const ADMIN_SESSION_MAX_AGE_SECONDS = 30 * 60;
const CLOCK_SKEW_MS = 5 * 60 * 1000;

function encode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function decode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createSessionToken(
  username: string,
  secret: string,
  now = Date.now(),
): string {
  const session: AdminSession = {
    username,
    issuedAt: now,
    expiresAt: now + ADMIN_SESSION_MAX_AGE_SECONDS * 1000,
  };
  const payload = encode(JSON.stringify(session));
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(
  token: string,
  secret: string,
  now = Date.now(),
): AdminSession | null {
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra || payload.length > 2048) return null;

  const expected = sign(payload, secret);
  const providedBytes = Buffer.from(signature, 'base64url');
  const expectedBytes = Buffer.from(expected, 'base64url');
  if (
    providedBytes.length !== expectedBytes.length ||
    !timingSafeEqual(providedBytes, expectedBytes)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(decode(payload)) as Partial<AdminSession>;
    const { username, issuedAt, expiresAt } = session;
    if (
      typeof username !== 'string' ||
      !/^[a-zA-Z0-9._-]{1,80}$/.test(username) ||
      typeof issuedAt !== 'number' ||
      typeof expiresAt !== 'number'
    ) {
      return null;
    }
    if (
      !Number.isSafeInteger(issuedAt) ||
      !Number.isSafeInteger(expiresAt) ||
      issuedAt > now + CLOCK_SKEW_MS ||
      expiresAt <= now ||
      expiresAt <= issuedAt ||
      expiresAt - issuedAt >
        (ADMIN_SESSION_MAX_AGE_SECONDS + 60) * 1000
    ) {
      return null;
    }
    return { username, issuedAt, expiresAt };
  } catch {
    return null;
  }
}
