const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Payslip = require('../models/Payslip');
const ApiError = require('../utils/ApiError');

/**
 * GET /api/dashboard
 * Returns dashboard statistics based on the user's role.
 * Admin: totalEmployees, totalDepartments, todayAttendance, pendingLeaves
 * Employee: currentMonthAttendance, pendingLeaves, latestPayslip, employee profile
 */
const getDashboard = async (req, res, next) => {
  try {
    if (req.user.role === 'ADMIN') {
      const totalEmployees = await Employee.countDocuments({ isDeleted: false });
      const departments = await Employee.distinct('department', { isDeleted: false });
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayAttendance = await Attendance.countDocuments({ date: today });
      const pendingLeaves = await Leave.countDocuments({ status: 'PENDING' });

      return res.status(200).json({
        success: true,
        data: {
          role: 'ADMIN',
          totalEmployees,
          totalDepartments: departments.length,
          todayAttendance,
          pendingLeaves,
        },
      });
    }

    // Employee dashboard
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) throw new ApiError(404, 'Employee profile not found');

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const currentMonthAttendance = await Attendance.countDocuments({
      employeeId: employee._id,
      date: { $gte: monthStart, $lte: monthEnd },
    });

    const pendingLeaves = await Leave.countDocuments({
      employeeId: employee._id,
      status: 'PENDING',
    });

    const latestPayslip = await Payslip.findOne({ employeeId: employee._id })
      .sort({ year: -1, month: -1 });

    return res.status(200).json({
      success: true,
      data: {
        role: 'EMPLOYEE',
        currentMonthAttendance,
        pendingLeaves,
        latestPayslip: latestPayslip ? { netSalary: latestPayslip.netSalary } : null,
        employee: {
          firstName: employee.firstName,
          lastName: employee.lastName,
          position: employee.position,
          department: employee.department,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
