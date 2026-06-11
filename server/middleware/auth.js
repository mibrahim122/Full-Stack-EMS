const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Middleware: Verifies JWT from the Authorization header.
 * Attaches the authenticated user object to `req.user` for downstream handlers.
 * Rejects requests with missing, expired, or invalid tokens.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from "Bearer <token>" header format
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized — no token provided');
    }

    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB (excluding password) and attach to request
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'Not authorized — user no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Not authorized — invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Not authorized — token expired'));
    }
    next(error);
  }
};

/**
 * Middleware factory: Restricts access to users with specific roles.
 * Must be used AFTER the `protect` middleware so `req.user` is available.
 * @param  {...string} roles - Allowed roles (e.g., "ADMIN", "EMPLOYEE")
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Role '${req.user.role}' is not authorized to access this resource`));
    }
    next();
  };
};

module.exports = { protect, authorize };
