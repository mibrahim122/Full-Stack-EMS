const express = require('express');
const { body } = require('express-validator');
const { login, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    body('role').isIn(['ADMIN', 'EMPLOYEE', 'admin', 'employee']).withMessage('Role must be ADMIN or EMPLOYEE'),
    validate,
  ],
  login
);

router.put(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    validate,
  ],
  changePassword
);

module.exports = router;
