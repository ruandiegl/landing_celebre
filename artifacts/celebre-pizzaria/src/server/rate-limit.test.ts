import { describe, expect, it } from 'vitest';
import { loadConfig } from './config';
import { ApiError } from './http-errors';
import { createRateLimiter } from './rate-limit';

describe('rate limiter', () => {
  it('limits repeated requests in development without external services', async () => {
    const limiter = createRateLimiter(
      loadConfig({ NODE_ENV: 'test' }),
      () => 1_000,
    );

    await expect(limiter.enforceLimit('login:ip:user', 2, 60)).resolves.toBeUndefined();
    await expect(limiter.enforceLimit('login:ip:user', 2, 60)).resolves.toBeUndefined();
    await expect(limiter.enforceLimit('login:ip:user', 2, 60)).rejects.toMatchObject<ApiError>({
      status: 429,
      code: 'RATE_LIMITED',
    });
  });

  it('expires a development bucket after its window', async () => {
    let now = 1_000;
    const limiter = createRateLimiter(loadConfig({ NODE_ENV: 'test' }), () => now);

    await limiter.enforceLimit('media:ip', 1, 10);
    await expect(limiter.enforceLimit('media:ip', 1, 10)).rejects.toMatchObject({
      status: 429,
    });
    now += 10_001;
    await expect(limiter.enforceLimit('media:ip', 1, 10)).resolves.toBeUndefined();
  });

  it('limits production requests locally when no external limiter is configured', async () => {
    const limiter = createRateLimiter(
      loadConfig({
        NODE_ENV: 'production',
        ADMIN_USERNAME: 'administrator',
        ADMIN_PASSWORD_HASH: 'scrypt$16384$8$1$test$test',
        ADMIN_SESSION_SECRET: 'session-secret',
        BLOB_READ_WRITE_TOKEN: 'blob-token',
        ADMIN_ALLOWED_ORIGINS: 'https://celebre.example',
      }),
      () => 1_000,
    );

    await limiter.enforceLimit('login:ip:user', 1, 60);
    await expect(limiter.enforceLimit('login:ip:user', 1, 60)).rejects.toMatchObject({
      status: 429,
      code: 'RATE_LIMITED',
    });
  });
});
