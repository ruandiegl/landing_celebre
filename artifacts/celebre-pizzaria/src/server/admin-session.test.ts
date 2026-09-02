import { describe, expect, it } from 'vitest';
import { createSessionToken, verifySessionToken } from './admin-session';

describe('admin session tokens', () => {
  const now = 1_700_000_000_000;

  it('round-trips a signed session and rejects tampering', () => {
    const token = createSessionToken('administrator', 'test-secret', now);

    expect(verifySessionToken(token, 'test-secret', now)).toMatchObject({
      username: 'administrator',
      issuedAt: now,
      expiresAt: now + 30 * 60 * 1000,
    });

    const tampered = `${token.slice(0, -1)}x`;
    expect(verifySessionToken(tampered, 'test-secret', now)).toBeNull();
  });

  it('rejects expired and future sessions', () => {
    const expired = createSessionToken('administrator', 'test-secret', now);
    expect(
      verifySessionToken(expired, 'test-secret', now + 30 * 60 * 1000 + 1),
    ).toBeNull();

    const future = createSessionToken(
      'administrator',
      'test-secret',
      now + 10 * 60 * 1000,
    );
    expect(verifySessionToken(future, 'test-secret', now)).toBeNull();
  });
});
