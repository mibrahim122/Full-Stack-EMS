const express = require('express');
const { getAttendance, checkIn, checkOut } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getAttendance);
router.post('/check-in', protect, authorize('EMPLOYEE'), checkIn);
router.post('/check-out', protect, authorize('EMPLOYEE'), checkOut);

module.exports = router;
