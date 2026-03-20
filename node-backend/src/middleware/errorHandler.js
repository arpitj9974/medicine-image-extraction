/**
 * errorHandler.js — Global Error Handling Middleware
 *
 * WHY THIS EXISTS:
 * Without this, if ANY route throws an error, Express sends an ugly HTML page.
 * This middleware catches ALL errors and returns a clean, consistent JSON response.
 *
 * HOW IT WORKS:
 * Express knows this is an error handler because it has 4 arguments (err, req, res, next).
 * If any middleware or route calls next(error), this catches it.
 */

const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);

  // ─── Multer-specific errors (file upload issues) ───
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 5MB.',
    });
  }

  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // ─── Mongoose validation errors ───
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // ─── Default: Internal Server Error ───
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
