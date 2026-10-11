import { errorResponse } from '../utils/apiResponse.js';

/**
 * OWASP ASVS 5.0 / OWASP Top 10 CSRF Defense Middleware
 * Protects cookie-authenticated state-changing requests (POST, PUT, PATCH, DELETE)
 * Validates Origin and Referer headers against allowed domains.
 */
export const csrfProtection = (req, res, next) => {
  const stateChangingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  
  // Only state-changing methods require CSRF checks
  if (!stateChangingMethods.includes(req.method)) {
    return next();
  }

  // If the request does NOT use cookie-based auth (e.g. uses Authorization: Bearer or webhooks),
  // it is immune to classic browser CSRF
  const usesCookieAuth = Boolean(req.cookies?.auth_token || req.cookies?.gw_cart_session);
  const isStripeWebhook = req.path.includes('/webhook/stripe');

  if (isStripeWebhook || !usesCookieAuth) {
    return next();
  }

  // If Bearer token is provided in Authorization header, CSRF is blocked by SOP preflight
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return next();
  }

  // For cookie-based state-changing requests, verify Origin or Referer
  const origin = req.headers['origin'];
  const referer = req.headers['referer'];
  const source = origin || referer;

  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ].filter(Boolean).map(url => {
    try {
      return new URL(url).origin;
    } catch {
      return url;
    }
  });

  if (!source) {
    // Missing origin and referer on cookie-authenticated state change is rejected
    return errorResponse(res, 'CSRF Verification Failed: Missing Origin or Referer header', null, 403);
  }

  try {
    const sourceOrigin = new URL(source).origin;
    const isAllowed = allowedOrigins.includes(sourceOrigin);

    if (!isAllowed) {
      console.warn(`[Security Alert] CSRF attack blocked from untrusted origin: ${sourceOrigin}`);
      return errorResponse(res, 'CSRF Verification Failed: Untrusted origin', null, 403);
    }
  } catch (err) {
    return errorResponse(res, 'CSRF Verification Failed: Malformed Origin or Referer header', null, 403);
  }

  next();
};
