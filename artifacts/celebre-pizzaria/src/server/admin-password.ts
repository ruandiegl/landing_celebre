import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback) as unknown as (
  password: string | Buffer,
  salt: string | Buffer,
  keyLength: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

const SCRYPT_COST = 16_384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const MAX_SCRYPT_COST = 1_048_576;

function encode(value: Buffer): string {
  return value.toString('base64url');
}

function decode(value: string): Buffer {
  return Buffer.from(value, 'base64url');
}

export async function hashAdminPassword(
  password: string,
  salt = randomBytes(SALT_LENGTH),
): Promise<string> {
  if (!password) throw new Error('A senha não pode ser vazia.');

  const derivedKey = await scrypt(password, salt, KEY_LENGTH, {
    N: SCRYPT_COST,
    r: SCRYPT_BLOCK_SIZE,
    p: SCRYPT_PARALLELIZATION,
    maxmem: 32 * 1024 * 1024,
  });

  return [
    'scrypt',
    SCRYPT_COST,
    SCRYPT_BLOCK_SIZE,
    SCRYPT_PARALLELIZATION,
    encode(salt),
    encode(derivedKey),
  ].join('$');
}

function parseHash(encoded: string): {
  N: number;
  r: number;
  p: number;
  salt: Buffer;
  derivedKey: Buffer;
} | null {
  const parts = encoded.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return null;

  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (
    !Number.isSafeInteger(N) ||
    N < SCRYPT_COST ||
    N > MAX_SCRYPT_COST ||
    (N & (N - 1)) !== 0 ||
    !Number.isSafeInteger(r) ||
    r < 1 ||
    r > 32 ||
    !Number.isSafeInteger(p) ||
    p < 1 ||
    p > 8
  ) {
    return null;
  }

  try {
    const salt = decode(parts[4]);
    const derivedKey = decode(parts[5]);
    if (
      salt.length < SALT_LENGTH ||
      salt.length > 64 ||
      derivedKey.length !== KEY_LENGTH
    ) {
      return null;
    }
    return { N, r, p, salt, derivedKey };
  } catch {
    return null;
  }
}

export async function verifyAdminPassword(
  password: string,
  encodedHash: string,
): Promise<boolean> {
  const parsed = parseHash(encodedHash);
  if (!parsed) return false;

  try {
    const candidate = await scrypt(password, parsed.salt, parsed.derivedKey.length, {
      N: parsed.N,
      r: parsed.r,
      p: parsed.p,
      maxmem: Math.max(32 * 1024 * 1024, 128 * parsed.N * parsed.r + 1024),
    });
    return timingSafeEqual(candidate, parsed.derivedKey);
  } catch {
    return false;
  }
}
