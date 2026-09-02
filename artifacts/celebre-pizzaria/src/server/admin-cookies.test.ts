import { describe, expect, it } from 'vitest';
import {
  ADMIN_CSRF_COOKIE,
  ADMIN_SESSION_COOKIE,
  buildAdminCookieHeaders,
  clearAdminCookieHeaders,
  parseCookies,
} from './admin-cookies';

describe('admin cookies', () => {
  it('creates strict session and csrf cookies with safe attributes', () => {
    const headers = buildAdminCookieHeaders('signed-session', 'csrf-token', true);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toContain(`${ADMIN_SESSION_COOKIE}=signed-session`);
    expect(headers[0]).toContain('HttpOnly');
    expect(headers[0]).toContain('Secure');
    expect(headers[0]).toContain('SameSite=Strict');
    expect(headers[1]).toContain(`${ADMIN_CSRF_COOKIE}=csrf-token`);
    expect(headers[1]).not.toContain('HttpOnly');
  });

  it('parses and clears cookies', () => {
    const cookies = parseCookies(
      `${ADMIN_SESSION_COOKIE}=session; ${ADMIN_CSRF_COOKIE}=csrf`,
    );

    expect(cookies).toEqual({
      [ADMIN_SESSION_COOKIE]: 'session',
      [ADMIN_CSRF_COOKIE]: 'csrf',
    });
    expect(clearAdminCookieHeaders(true).every((header) => header.includes('Max-Age=0'))).toBe(
      true,
    );
  });
});
