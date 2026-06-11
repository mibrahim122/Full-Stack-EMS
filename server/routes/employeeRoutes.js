const express = require('express');
const { body } = require('express-validator');
const {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getProfile,
  updateProfile,
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', protect, authorize('ADMIN'), getEmployees);

router.post(
  '/',
  protect,
  authorize('ADMIN'),
  [
    body('firstName').notEmpty().trim().withMessage('First name is required'),
    body('lastName').notEmpty().trim().withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('position').notEmpty().withMessage('Position is required'),
    body('joinDate').isISO8601().withMessage('Please provide a valid join date'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
  ],
  createEmployee
);

router.get('/profile', protect, getProfile);

router.put(
  '/profile',
  protect,
  [
    body('bio').optional().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
    validate,
  ],
  updateProfile
);

router.put(
  '/:id',
  protect,
  authorize('ADMIN'),
  [
    body('firstName').optional().notEmpty().trim().withMessage('First name cannot be empty'),
    body('lastName').optional().notEmpty().trim().withMessage('Last name cannot be empty'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
    validate,
  ],
  updateEmployee
);

router.delete('/:id', protect, authorize('ADMIN'), deleteEmployee);

module.exports = router;
