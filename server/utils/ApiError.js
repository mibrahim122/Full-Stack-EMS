/**
 * Custom error class for API errors.
 * Extends the native Error class to include an HTTP status code,
 * enabling the centralized error handler to send appropriate responses.
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes expected errors from programming bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
