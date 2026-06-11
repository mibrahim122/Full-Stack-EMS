const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const ApiError = require('../utils/ApiError');

/**
 * GET /api/attendance
 * Returns attendance history for the currently authenticated employee.
 * Records are sorted by date in descending order (most recent first).
 * Access: Any authenticated user.
 */
const getAttendance = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      throw new ApiError(404, 'Employee profile not found');
    }

    const history = await Attendance.find({ employeeId: employee._id })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: history,
      isDeleted: employee.isDeleted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/attendance/check-in
 * Creates a new attendance record for today with a check-in timestamp.
 * Determines PRESENT vs LATE status based on a 9:30 AM threshold.
 * Prevents duplicate check-ins for the same day.
 * Access: Employee only.
 */
const checkIn = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      throw new ApiError(404, 'Employee profile not found');
    }

    if (employee.isDeleted) {
      throw new ApiError(403, 'Cannot check in — account is deactivated');
    }

    // Get today's date at midnight for the attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existing = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    });

    if (existing) {
      throw new ApiError(400, 'Already checked in for today');
    }

    // Determine if late (after 9:30 AM)
    const now = new Date();
    const lateThreshold = new Date(today);
    lateThreshold.setHours(9, 30, 0, 0);
    const status = now > lateThreshold ? 'LATE' : 'PRESENT';

    const attendance = await Attendance.create({
      employeeId: employee._id,
      date: today,
      checkIn: now,
      status,
    });

    res.status(201).json({
      success: true,
      message: `Checked in successfully${status === 'LATE' ? ' (late)' : ''}`,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/attendance/check-out
 * Updates today's attendance record with a check-out timestamp.
 * Computes working hours and day type based on the duration between
 * check-in and check-out:
 *   >= 8 hours → Full Day
 *   >= 6 hours → Three Quarter Day
 *   >= 4 hours → Half Day
 *   < 4 hours  → Short Day
 * Access: Employee only.
 */
const checkOut = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      throw new ApiError(404, 'Employee profile not found');
    }

    // Find today's attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    });

    if (!attendance) {
      throw new ApiError(400, 'No check-in record found for today. Please check in first.');
    }

    if (attendance.checkOut) {
      throw new ApiError(400, 'Already checked out for today');
    }

    // Set check-out time and calculate working hours
    const now = new Date();
    attendance.checkOut = now;

    const diffMs = now.getTime() - new Date(attendance.checkIn).getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    attendance.workingHours = Math.round(diffHours * 100) / 100; // Round to 2 decimals

    // Determine day type based on hours worked
    if (diffHours >= 8) {
      attendance.dayType = 'Full Day';
    } else if (diffHours >= 6) {
      attendance.dayType = 'Three Quarter Day';
    } else if (diffHours >= 4) {
      attendance.dayType = 'Half Day';
    } else {
      attendance.dayType = 'Short Day';
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      message: 'Checked out successfully',
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAttendance, checkIn, checkOut };
