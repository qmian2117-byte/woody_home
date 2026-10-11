import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { generateToken, revokeToken } from '../middleware/authMiddleware.js';
import { generateTotpSecret, verifyTotpCode } from '../utils/totp.js';
import {
  encryptMfaSecret,
  decryptMfaSecret,
  generateRecoveryCodes,
  hashRecoveryCode,
  verifyAndConsumeRecoveryCode,
  recordAndVerifyOtpConsumption
} from '../utils/mfaSecurity.js';

const registerSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  full_name: z.string().min(2, 'Name must be at least 2 characters long'),
  phone: z.string().optional().default('')
});

const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required')
});

/**
 * POST /api/auth/register
 */
export const registerUser = async (req, res, next) => {
  try {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) {
      return errorResponse(res, 'Validation Error', parse.error.errors[0]?.message, 400);
    }

    const { email, password, full_name, phone } = parse.data;

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (existingUser) {
      return errorResponse(res, 'Email Already Registered', 'An account with this email already exists.', 409);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Public registration strictly assigns 'customer' role (SEC-003).
    // Admin role can only be assigned by existing administrators or database seed.
    const role = 'customer';

    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: email.toLowerCase().trim(),
        password_hash,
        full_name,
        phone,
        role
      })
      .select('id, email, full_name, phone, role, created_at')
      .single();

    if (error) throw error;

    const token = generateToken(newUser);

    // Set secure cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    return successResponse(res, 'Registration Successful', {
      user: newUser,
      token
    }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
export const loginUser = async (req, res, next) => {
  try {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      return errorResponse(res, 'Validation Error', parse.error.errors[0]?.message, 400);
    }

    const { email, password } = parse.data;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, password_hash, full_name, phone, role, mfa_enabled, mfa_secret')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (error) throw error;

    if (!user) {
      return errorResponse(res, 'Invalid Credentials', 'Incorrect email or password.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return errorResponse(res, 'Invalid Credentials', 'Incorrect email or password.', 401);
    }

    // Admin MFA enforcement (OWASP ASVS 5.0 Level 2)
    if (user.role === 'admin' && user.mfa_enabled) {
      const JWT_SECRET = process.env.JWT_SECRET || 'woody-home-super-secret-jwt-key-2026';
      const mfaTempToken = jwt.sign(
        { id: user.id, mfa_pending: true },
        JWT_SECRET,
        { expiresIn: '5m' }
      );

      return successResponse(res, 'MFA Verification Required', {
        mfa_required: true,
        temp_token: mfaTempToken
      });
    }

    const token = generateToken(user);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return successResponse(res, 'Login Successful', {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, phone, role, created_at')
      .eq('id', req.user.id)
      .maybeSingle();

    if (error) throw error;
    if (!user) {
      return errorResponse(res, 'User Not Found', 'Account could not be found.', 404);
    }

    return successResponse(res, 'User Profile Retrieved', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/orders
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        order_number,
        total_price,
        subtotal,
        discount_amount,
        shipping_fee,
        payment_method,
        payment_status,
        order_status,
        created_at,
        items:order_items(id, product_title, variant_title, sku, unit_price, quantity, custom_properties)
      `)
      .or(`customer_id.eq.${req.user.id},email.eq.${req.user.email}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return successResponse(res, 'User Orders Retrieved', { orders: orders || [] });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/profile
 * Allows authenticated user to update their own profile (SEC-017)
 * Strictly prevents role modification (SEC-003)
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const { full_name, phone } = req.body;

    // Disallow role tampering or unauthorized field injection
    const updatePayload = {};
    if (full_name !== undefined) updatePayload.full_name = String(full_name).trim();
    if (phone !== undefined) updatePayload.phone = String(phone).trim();

    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update(updatePayload)
      .eq('id', req.user.id)
      .select('id, email, full_name, phone, role, created_at')
      .single();

    if (error) throw error;

    return successResponse(res, 'Profile updated successfully', { user: updatedUser });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/mfa/setup (Admin Only)
 * Generates encrypted TOTP secret and hashed backup recovery codes (Issue 5)
 */
export const setupAdminMfa = async (req, res, next) => {
  try {
    const secret = generateTotpSecret();
    const recoveryCodes = generateRecoveryCodes(8);
    const hashedRecoveryCodes = recoveryCodes.map(hashRecoveryCode);
    const encryptedSecret = encryptMfaSecret(secret);

    // Persist encrypted secret and hashed recovery codes
    await supabaseAdmin
      .from('users')
      .update({
        mfa_secret: encryptedSecret,
        recovery_codes: hashedRecoveryCodes
      })
      .eq('id', req.user.id);

    const otpauthUrl = `otpauth://totp/WoodyHome:${encodeURIComponent(req.user.email)}?secret=${secret}&issuer=WoodyHome`;

    return successResponse(res, 'MFA Setup Initiated', {
      secret,
      otpauth_url: otpauthUrl,
      recovery_codes: recoveryCodes, // Shown once in plaintext to user
      instructions: 'Save your 8 backup recovery codes in a secure location. Scan the QR code or add the secret to your authenticator app.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/mfa/verify
 * Verifies TOTP code / recovery code, enforces one-time use across instances, and enables MFA (Issue 5)
 */
export const verifyAdminMfa = async (req, res, next) => {
  try {
    const { temp_token, code } = req.body;

    if (!code) {
      return errorResponse(res, 'MFA Code Required', 'Please enter your 6-digit authenticator code or recovery code.', 400);
    }

    const cleanCode = code.toString().trim();
    const JWT_SECRET = process.env.JWT_SECRET || 'woody-home-super-secret-jwt-key-2026';
    let userId;

    if (temp_token) {
      // Pending login verification
      try {
        const decoded = jwt.verify(temp_token, JWT_SECRET);
        if (!decoded.mfa_pending) {
          return errorResponse(res, 'Invalid Token', 'Token is not pending MFA.', 401);
        }
        userId = decoded.id;
      } catch {
        return errorResponse(res, 'Expired Token', 'MFA session expired. Please log in again.', 401);
      }
    } else if (req.user?.id) {
      // Setup completion for logged-in user
      userId = req.user.id;
    } else {
      return errorResponse(res, 'Authentication Required', 'Missing MFA token.', 401);
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, phone, role, mfa_secret, recovery_codes')
      .eq('id', userId)
      .maybeSingle();

    if (error || !user) {
      return errorResponse(res, 'User Not Found', 'Account not found.', 404);
    }

    // 1. Check if user is redeeming a backup recovery code (format: XXXX-XXXX)
    if (cleanCode.includes('-') || cleanCode.length >= 8) {
      const recoveryResult = verifyAndConsumeRecoveryCode(cleanCode, user.recovery_codes || []);
      if (!recoveryResult.valid) {
        return errorResponse(res, 'Invalid Recovery Code', 'The recovery code provided is invalid or has already been used.', 401);
      }

      // Persist consumed state by updating remaining recovery code hashes
      await supabaseAdmin
        .from('users')
        .update({
          mfa_enabled: true,
          recovery_codes: recoveryResult.remainingHashes
        })
        .eq('id', user.id);
    } else {
      // 2. Standard TOTP Verification: Decrypt AES-256-GCM secret
      const plaintextSecret = decryptMfaSecret(user.mfa_secret);

      // Enforce distributed one-time use across multiple instances
      const isOtpFresh = await recordAndVerifyOtpConsumption(user.id, plaintextSecret, cleanCode);
      if (!isOtpFresh) {
        return errorResponse(res, 'MFA Code Already Consumed', 'This authenticator code has already been used. Please wait for the next 30-second token.', 401);
      }

      const isValid = verifyTotpCode(plaintextSecret, cleanCode);
      if (!isValid) {
        return errorResponse(res, 'Invalid MFA Code', 'The code entered is incorrect or expired.', 401);
      }

      // Enable MFA if this was initial setup
      await supabaseAdmin
        .from('users')
        .update({ mfa_enabled: true })
        .eq('id', user.id);
    }

    // Issue full session token with server-verified MFA state (Risk 2)
    const token = generateToken(user, { mfa_verified: true });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return successResponse(res, 'MFA Verified Successfully', {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
export const logoutUser = async (req, res) => {
  const token = req.cookies?.auth_token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
  if (token) {
    await revokeToken(token);
  }
  res.clearCookie('auth_token');
  return successResponse(res, 'Logged out successfully', null);
};
