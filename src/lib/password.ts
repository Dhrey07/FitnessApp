import { randomBytes, scrypt, timingSafeEqual, createHash, type ScryptOptions } from 'node:crypto';

// Stored format: scrypt$<N>$<r>$<p>$<salt base64>$<hash base64>
// The parameters live in the string so they can be raised later without
// breaking existing hashes.
const PREFIX = 'scrypt';
const N = 16384;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

export const MIN_PASSWORD_LENGTH = 8;

function deriveKey(password: string, salt: Buffer, keyLength: number, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

export function isPasswordHash(stored: string): boolean {
  return stored.startsWith(`${PREFIX}$`) && stored.split('$').length === 6;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const key = await deriveKey(password, salt, KEY_LENGTH, { N, r: R, p: P });
  return [PREFIX, N, R, P, salt.toString('base64'), key.toString('base64')].join('$');
}

export type VerifyResult = {
  valid: boolean;
  /** True when the stored value should be replaced with a fresh hashPassword() result. */
  needsRehash: boolean;
};

export async function verifyPassword(password: string, stored: string): Promise<VerifyResult> {
  if (!isPasswordHash(stored)) {
    // Legacy migration path: rows created before hashing was introduced hold the
    // password in plain text. Compare once (constant-time, over fixed-length
    // digests so the length isn't leaked) and tell the caller to rehash on
    // success. Remove this branch once no plain-text rows remain.
    const a = createHash('sha256').update(password).digest();
    const b = createHash('sha256').update(stored).digest();
    const valid = timingSafeEqual(a, b);
    return { valid, needsRehash: valid };
  }

  const [, nStr, rStr, pStr, saltB64, hashB64] = stored.split('$');
  const n = Number(nStr);
  const r = Number(rStr);
  const p = Number(pStr);
  const salt = Buffer.from(saltB64, 'base64');
  const expected = Buffer.from(hashB64, 'base64');
  if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p) || expected.length === 0) {
    return { valid: false, needsRehash: false };
  }

  const actual = await deriveKey(password, salt, expected.length, {
    N: n,
    r,
    p,
    maxmem: 256 * n * r + 1024 * 1024,
  });
  const valid = timingSafeEqual(actual, expected);
  return { valid, needsRehash: valid && (n !== N || r !== R || p !== P || expected.length !== KEY_LENGTH) };
}
