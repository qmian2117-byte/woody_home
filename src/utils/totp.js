import crypto from 'crypto';

/**
 * RFC 6238 Time-based One-Time Password (TOTP) Implementation
 * Zero external dependencies, pure Node.js crypto
 */

// Simple Base32 decoder
function base32Decode(base32) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  const output = [];

  for (const char of base32.toUpperCase().replace(/=+$/, '')) {
    const index = alphabet.indexOf(char);
    if (index === -1) continue;
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(output);
}

export function generateTotpSecret() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const bytes = crypto.randomBytes(20);
  let result = '';
  for (let i = 0; i < bytes.length; i++) {
    result += alphabet[bytes[i] % 32];
  }
  return result;
}

export function generateTotpCode(secret, timeStepOffset = 0) {
  const key = base32Decode(secret);
  const epoch = Math.floor(Date.now() / 1000);
  const timeStep = Math.floor(epoch / 30) + timeStepOffset;

  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeBigInt64BE(BigInt(timeStep));

  const hmac = crypto.createHmac('sha1', key);
  hmac.update(timeBuffer);
  const digest = hmac.digest();

  const offset = digest[digest.length - 1] & 0xf;
  const code = (
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff)
  ) % 1000000;

  return code.toString().padStart(6, '0');
}

// Replay Protection Cache: stores `${secret}:${code}` for 90 seconds to prevent OTP reuse
const usedTokens = new Map();

export function isTotpReplayed(secret, code) {
  const key = `${secret}:${code}`;
  const now = Date.now();
  if (usedTokens.has(key)) {
    const expiry = usedTokens.get(key);
    if (now < expiry) return true;
  }
  // Record token usage for 90 seconds (covering the full +/- 1 drift window)
  usedTokens.set(key, now + 90000);
  return false;
}

export function verifyTotpCode(secret, token) {
  if (!secret || !token) return false;
  const cleanToken = token.toString().trim();

  // Prevent OTP Replay attack (NIST SP 800-63B / OWASP ASVS)
  if (isTotpReplayed(secret, cleanToken)) {
    return false;
  }

  // Allow a drift window of +/- 1 time step (30 seconds before / after)
  for (const offset of [-1, 0, 1]) {
    const expected = generateTotpCode(secret, offset);
    if (crypto.timingSafeEqual(Buffer.from(cleanToken), Buffer.from(expected))) {
      return true;
    }
  }

  return false;
}
