const express = require('express');
const { body } = require('express-validator');
const { getLeaves, createLeave, updateLeaveStatus } = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', protect, getLeaves);

router.post(
  '/',
  protect,
  authorize('EMPLOYEE'),
  [
    body('type').isIn(['SICK', 'CASUAL', 'ANNUAL']).withMessage('Invalid leave type'),
    body('startDate').isISO8601().withMessage('Please provide a valid start date'),
    body('endDate').isISO8601().withMessage('Please provide a valid end date'),
    body('reason').notEmpty().trim().withMessage('Reason is required'),
    validate,
  ],
  createLeave
);

router.put(
  '/:id/status',
  protect,
  authorize('ADMIN'),
  [
    body('status').isIn(['APPROVED', 'REJECTED']).withMessage('Status must be APPROVED or REJECTED'),
    validate,
  ],
  updateLeaveStatus
);

module.exports = router;
