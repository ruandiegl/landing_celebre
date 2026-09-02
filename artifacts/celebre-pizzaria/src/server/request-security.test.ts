import { describe, expect, it } from 'vitest';
import { loadConfig } from './config';
import { ApiError } from './http-errors';
import { assertCsrf, assertSameOrigin } from './request-security';

const config = loadConfig({
  NODE_ENV: 'production',
  ADMIN_USERNAME: 'administrator',
  ADMIN_PASSWORD_HASH: 'hash',
  ADMIN_SESSION_SECRET: 'secret',
  BLOB_READ_WRITE_TOKEN: 'blob',
  ADMIN_ALLOWED_ORIGINS: 'https://celebre.example',
});

describe('request security', () => {
  it('allows configured same-origin mutations and rejects other origins', () => {
    expect(() =>
      assertSameOrigin({
        method: 'PUT',
        headers: { origin: 'https://celebre.example' },
      }, config),
    ).not.toThrow();

    expect(() =>
      assertSameOrigin({
        method: 'PUT',
        headers: { origin: 'https://evil.example' },
      }, config),
    ).toThrowError(ApiError);
  });

  it('requires a matching csrf header and cookie', () => {
    const request = {
      method: 'PUT',
      headers: { 'x-csrf-token': 'csrf' },
      cookies: { celebre_admin_csrf: 'csrf' },
    };
    expect(() => assertCsrf(request)).not.toThrow();

    expect(() =>
      assertCsrf({ ...request, headers: { 'x-csrf-token': 'wrong' } }),
    ).toThrowError(ApiError);
  });
});
