const { validationResult } = require('express-validator');

/**
 * Middleware: Runs after express-validator check chains.
 * Collects all validation errors and returns a 400 response if any exist.
 * If validation passes, control flows to the next handler.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    return res.status(400).json({
      success: false,
      message: messages.join('. '),
      errors: errors.array(),
    });
  }
  next();
};

module.exports = validate;
