import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`❌ [${req.method} ${req.url}] Error:`, err);

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const message = err.message || 'Internal Server Error';

  return errorResponse(res, message, err, statusCode);
};

/**
 * 404 Route Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, null, 404);
};
