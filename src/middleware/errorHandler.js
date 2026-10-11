import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`❌ [${req.method} ${req.url}] Error:`, err);

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const isProduction = process.env.NODE_ENV === 'production';

  // Prevent Information Disclosure (CWE-209 / OWASP ASVS 5.0)
  const message = (statusCode >= 500 && isProduction)
    ? 'An internal server error occurred. Please try again later.'
    : (err.message || 'Internal Server Error');

  const errorDetails = (statusCode >= 500 && isProduction) ? null : err;

  return errorResponse(res, message, errorDetails, statusCode);
};

/**
 * 404 Route Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, null, 404);
};
