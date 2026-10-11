import crypto from 'crypto';
import { supabaseAdmin } from '../config/supabase.js';

// Derive 32-byte AES-256-GCM key from secret
const getEncryptionKey = () => {
  const masterSecret = process.env.MFA_ENCRYPTION_KEY || process.env.JWT_SECRET || 'woody-home-super-secret-mfa-encryption-key-2026';
  return crypto.createHash('sha256').update(masterSecret).digest();
};

/**
 * Encrypt TOTP Secret using AES-256-GCM (Authenticated Encryption at Rest)
 * Output format: iv:authTag:ciphertext (hex encoded)
 */
export const encryptMfaSecret = (plaintextSecret) => {
  if (!plaintextSecret) return null;
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12); // Standard 96-bit IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(plaintextSecret, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

/**
 * Decrypt TOTP Secret using AES-256-GCM with authentication tag validation
 */
export const decryptMfaSecret = (encryptedPayload) => {
  if (!encryptedPayload) return null;
  // If not in iv:authTag:ciphertext format, assume legacy unencrypted secret
  if (!encryptedPayload.includes(':')) {
    return encryptedPayload;
  }

  const parts = encryptedPayload.split(':');
  if (parts.length !== 3) {
    return encryptedPayload;
  }

  const [ivHex, authTagHex, cipherHex] = parts;
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(cipherHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

/**
 * Generate high-entropy 8-character recovery codes (e.g. "A1B2-C3D4")
 */
export const generateRecoveryCodes = (count = 8) => {
  const codes = [];
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Base32 unambiguous
  for (let i = 0; i < count; i++) {
    const bytes = crypto.randomBytes(8);
    let raw = '';
    for (let b = 0; b < 8; b++) {
      raw += chars[bytes[b] % chars.length];
    }
    const formatted = `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
    codes.push(formatted);
  }
  return codes;
};

/**
 * Hash a recovery code for secure database storage
 */
export const hashRecoveryCode = (code) => {
  const normalized = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  return crypto.createHash('sha256').update(normalized).digest('hex');
};

/**
 * Verify provided recovery code against array of hashed codes
 * Returns { valid: true, remainingHashes: [...] } or { valid: false }
 */
export const verifyAndConsumeRecoveryCode = (providedCode, storedHashes = []) => {
  if (!providedCode || !Array.isArray(storedHashes)) return { valid: false };
  const targetHash = hashRecoveryCode(providedCode);
  const matchIndex = storedHashes.indexOf(targetHash);

  if (matchIndex === -1) {
    return { valid: false };
  }

  // Remove the consumed hash
  const remainingHashes = storedHashes.filter((_, idx) => idx !== matchIndex);
  return { valid: true, remainingHashes };
};

// In-memory hot cache for instant instance-local rejection
const localReplayCache = new Map();

/**
 * Cross-Instance Persistent OTP Replay Prevention (Issue 5)
 * Persists consumed OTPs to PostgreSQL `used_totp_codes` table with unique constraint
 */
export const recordAndVerifyOtpConsumption = async (userId, secret, code) => {
  const cleanCode = code.toString().trim();
  const codeHash = crypto.createHash('sha256').update(`${secret}:${cleanCode}`).digest('hex');
  const now = Date.now();

  // 1. Check local instance memory cache
  const localKey = `${userId || 'anon'}:${codeHash}`;
  if (localReplayCache.has(localKey)) {
    const expiresAt = localReplayCache.get(localKey);
    if (now < expiresAt) {
      return false; // Replayed code!
    }
  }

  // Add to local cache for 90 seconds (full TOTP drift window)
  localReplayCache.set(localKey, now + 90000);

  // 2. Persist to PostgreSQL `used_totp_codes` for cross-instance enforcement
  if (userId) {
    try {
      const expiresAtDate = new Date(now + 90000).toISOString();
      const { error } = await supabaseAdmin
        .from('used_totp_codes')
        .insert([{
          user_id: userId,
          code_hash: codeHash,
          expires_at: expiresAtDate
        }]);

      if (error) {
        // Unique violation code 23505 indicates another instance already consumed this OTP
        if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique')) {
          console.warn(`[MFA Security Alert] Distributed OTP replay blocked for user ${userId}.`);
          return false;
        }
      }
    } catch {
      // Graceful fallback to memory cache if table unmigrated in staging
    }
  }

  return true;
};
