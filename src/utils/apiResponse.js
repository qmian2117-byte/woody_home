/**
 * Standardized API Response Helper
 */
export const successResponse = (res, message = 'Success', data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const errorResponse = (res, message = 'Error', error = null, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: typeof error === 'string' ? error : (error?.message || null),
    timestamp: new Date().toISOString()
  });
};
