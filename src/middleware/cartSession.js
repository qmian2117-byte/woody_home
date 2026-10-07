import crypto from 'crypto';
import { supabaseAdmin } from '../config/supabase.js';

const COOKIE_NAME = 'gw_cart_session';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Middleware ensuring every client request has an active Cart Session Token
 */
export const cartSessionMiddleware = async (req, res, next) => {
  try {
    // 1. Check existing token from cookie or custom header
    let sessionToken = req.cookies?.[COOKIE_NAME] || req.headers['x-cart-session'];

    if (!sessionToken) {
      sessionToken = crypto.randomUUID();
      // Set secure HTTP-only cookie
      res.cookie(COOKIE_NAME, sessionToken, {
        maxAge: COOKIE_MAX_AGE,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
    }

    req.cartSessionToken = sessionToken;

    // 2. Fetch or create cart record in Supabase
    let { data: cart, error } = await supabaseAdmin
      .from('carts')
      .select('id, session_token')
      .eq('session_token', sessionToken)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn('Cart lookup warning:', error.message);
    }

    if (!cart) {
      const { data: newCart, error: insertError } = await supabaseAdmin
        .from('carts')
        .insert([{ session_token: sessionToken }])
        .select('id, session_token')
        .single();

      if (insertError) {
        console.warn('Cart creation warning:', insertError.message);
      } else {
        cart = newCart;
      }
    }

    req.cartId = cart?.id || null;
    next();
  } catch (err) {
    console.error('Cart session middleware error:', err);
    next();
  }
};
