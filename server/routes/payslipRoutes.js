const express = require('express');
const { body } = require('express-validator');
// 1. Added deletePayslip to the imported controller methods
const { getPayslips, createPayslip, getPayslipById, deletePayslip } = require('../controllers/payslipController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', protect, getPayslips);

router.post(
  '/',
  protect,
  authorize('ADMIN'),
  [
    body('employeeId').notEmpty().withMessage('Employee ID is required'),
    body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
    body('year').isInt({ min: 2000 }).withMessage('Please provide a valid year'),
    body('basicSalary').isNumeric().withMessage('Basic salary must be a number'),
    body('allowances').optional().isNumeric().withMessage('Allowances must be a number'),
    body('deductions').optional().isNumeric().withMessage('Deductions must be a number'),
    validate,
  ],
  createPayslip
);

router.get('/:id', protect, getPayslipById);

// 2. Added the DELETE route (Only accessible by ADMINs)
router.delete('/:id', protect, authorize('ADMIN'), deletePayslip);

module.exports = router;