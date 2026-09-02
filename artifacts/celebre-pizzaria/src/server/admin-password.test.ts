import { describe, expect, it } from 'vitest';
import { hashAdminPassword, verifyAdminPassword } from './admin-password';

describe('admin password hashing', () => {
  it('verifies a password without accepting a different password', async () => {
    const encoded = await hashAdminPassword('correct horse battery staple');

    await expect(
      verifyAdminPassword('correct horse battery staple', encoded),
    ).resolves.toBe(true);
    await expect(verifyAdminPassword('wrong password', encoded)).resolves.toBe(
      false,
    );
  });

  it('rejects malformed or unsafe scrypt hashes', async () => {
    await expect(verifyAdminPassword('password', 'not-a-hash')).resolves.toBe(
      false,
    );
    await expect(
      verifyAdminPassword('password', 'scrypt$1$1$1$c2FsdA$a2V5'),
    ).resolves.toBe(false);
  });
});
