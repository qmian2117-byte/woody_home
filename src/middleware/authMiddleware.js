import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/supabase.js';
import { errorResponse } from '../utils/apiResponse.js';

const JWT_SECRET = process.env.JWT_SECRET || 'woody-home-super-secret-jwt-key-2026';

import fs from 'fs';
import path from 'path';

// Shared Persistent Token Revocation across Application Instances (Issue 3)
// Authoritative source: PostgreSQL `revoked_tokens` table. In-memory Set acts solely as a read-through cache.
const memoryRevokedTokens = new Set();

/**
 * Clear local memory cache (used to test cold-start / multi-instance sync)
 */
export const clearLocalRevocationCache = () => {
  memoryRevokedTokens.clear();
};

const REVOCATION_FILE = path.resolve('.session_revocations.json');

const isRevokedInDiskStore = (jti, token) => {
  try {
    if (fs.existsSync(REVOCATION_FILE)) {
      const stored = JSON.parse(fs.readFileSync(REVOCATION_FILE, 'utf8') || '{}');
      const now = Date.now();
      if (jti && stored[jti] && new Date(stored[jti]).getTime() > now) return true;
      if (token && stored[token] && new Date(stored[token]).getTime() > now) return true;
    }
  } catch {
    // Ignore
  }
  return false;
};

const persistRevocationToDisk = (jti, token, expiresAt) => {
  try {
    let data = {};
    if (fs.existsSync(REVOCATION_FILE)) {
      data = JSON.parse(fs.readFileSync(REVOCATION_FILE, 'utf8') || '{}');
    }
    data[jti] = expiresAt.toISOString();
    if (token) data[token] = expiresAt.toISOString();
    fs.writeFileSync(REVOCATION_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn('[Persistent Revocation Storage Notice]:', err.message);
  }
};

export const revokeToken = async (token, decoded) => {
  if (!token) return;

  const payload = decoded || jwt.decode(token);
  const jti = payload?.jti || crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = payload?.exp ? new Date(payload.exp * 1000) : new Date(Date.now() + 30 * 24 * 3600 * 1000);

  // Authoritative write to shared PostgreSQL database
  try {
    const { error } = await supabaseAdmin
      .from('revoked_tokens')
      .upsert([{
        jti,
        user_id: payload?.id || null,
        expires_at: expiresAt.toISOString()
      }], { onConflict: 'jti' });

    if (error) {
      console.warn('[JWT Revocation DB Notice]: Table pending migration in Supabase Dashboard:', error.message);
    }
  } catch (err) {
    console.warn('[JWT Revocation Connection Notice]:', err.message);
  }

  // Persist to shared volume/disk so restarts and cluster instances share state
  persistRevocationToDisk(jti, token, expiresAt);

  // Populate local instance read cache
  memoryRevokedTokens.add(jti);
  memoryRevokedTokens.add(token);
};

export const isTokenRevoked = async (token, decoded) => {
  // 1. Fast read-through cache check
  if (memoryRevokedTokens.has(token)) return true;
  const payload = decoded || jwt.decode(token);
  const jti = payload?.jti || crypto.createHash('sha256').update(token).digest('hex');
  if (jti && memoryRevokedTokens.has(jti)) return true;

  // 2. Authoritative check against shared PostgreSQL cluster database
  if (jti) {
    try {
      const nowIso = new Date().toISOString();
      const { data, error } = await supabaseAdmin
        .from('revoked_tokens')
        .select('jti, expires_at')
        .eq('jti', jti)
        .gt('expires_at', nowIso)
        .maybeSingle();

      if (data && !error) {
        // Cache positive revocation locally
        memoryRevokedTokens.add(jti);
        memoryRevokedTokens.add(token);
        return true;
      }
    } catch (err) {
      console.warn('[Session Cluster Check Warning]:', err.message);
    }
  }

  // 3. Check shared persistent storage (preserves state across instances even before SQL migration)
  if (isRevokedInDiskStore(jti, token)) {
    memoryRevokedTokens.add(jti);
    memoryRevokedTokens.add(token);
    return true;
  }

  return false;
};

/**
 * Generate a JWT token for an authenticated user
 * Enforces Fail-Closed Admin MFA: Admin tokens default to mfa_verified = false
 */
export const generateToken = (user, options = {}) => {
  const jti = crypto.randomUUID();
  const isAdmin = user.role === 'admin';
  const mfaVerified = options.mfa_verified ?? (!isAdmin); // Customers are verified; Admins default to FALSE

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      jti,
      mfa_verified: mfaVerified
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

/**
 * Middleware: Verify user authentication token
 */
export const authenticateUser = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.auth_token) {
    token = req.cookies.auth_token;
  }

  if (!token) {
    return errorResponse(res, 'Authentication Required', 'Please log in to access this resource.', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.authToken = token;
  } catch (err) {
    return errorResponse(res, 'Invalid or Expired Token', 'Session expired. Please log in again.', 401);
  }

  // Check if token has been revoked
  const revoked = await isTokenRevoked(token, decoded);
  if (revoked) {
    return errorResponse(res, 'Token Revoked', 'This session has been logged out and revoked. Please log in again.', 401);
  }

  next();
};

/**
 * Middleware: Enforce Admin Role (RBAC) & Fail-Closed MFA Verification (Risk 2)
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return errorResponse(res, 'Access Denied', 'Administrator privileges are required.', 403);
  }

  // FAIL-CLOSED: Explicitly require server-verified MFA state (Risk 2)
  if (req.user.mfa_verified !== true) {
    return errorResponse(res, 'MFA Verification Required', 'Access denied: Admin accounts require completed second-factor authentication.', 403);
  }

  next();
};

/**
 * Middleware: Optional Authentication (attaches user if present, proceeds otherwise)
 */
export const optionalAuth = (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.auth_token) {
    token = req.cookies.auth_token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch {
      // Ignore token errors for optional routes
    }
  }

  next();
};
