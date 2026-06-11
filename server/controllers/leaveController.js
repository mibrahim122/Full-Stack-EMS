const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const ApiError = require('../utils/ApiError');

/**
 * GET /api/leaves
 * Returns leave records based on the user's role:
 * - Admin: All leaves (with employee details populated)
 * - Employee: Only their own leaves
 * Records are sorted by creation date in descending order.
 * Access: Any authenticated user.
 */
const getLeaves = async (req, res, next) => {
  try {
    let leaves;

    if (req.user.role === 'ADMIN') {
      // Admin sees all leaves with employee info
      leaves = await Leave.find()
        .populate({
          path: 'employeeId',
          select: 'firstName lastName email position department',
        })
        .sort({ createdAt: -1 });
    } else {
      // Employee sees only their own leaves
      const employee = await Employee.findOne({ userId: req.user._id });
      if (!employee) {
        throw new ApiError(404, 'Employee profile not found');
      }

      leaves = await Leave.find({ employeeId: employee._id })
        .populate({
          path: 'employeeId',
          select: 'firstName lastName email position department',
        })
        .sort({ createdAt: -1 });
    }

    // Transform to match frontend data shape (employee field instead of employeeId)
    const result = leaves.map((leave) => {
      const obj = leave.toObject();
      obj.employee = obj.employeeId;
      return obj;
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/leaves
 * Creates a new leave request for the authenticated employee.
 * Validates that end date is not before start date.
 * Access: Employee only.
 */
const createLeave = async (req, res, next) => {
  try {
    const { type, startDate, endDate, reason } = req.body;

    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      throw new ApiError(404, 'Employee profile not found');
    }

    if (employee.isDeleted) {
      throw new ApiError(403, 'Cannot apply for leave — account is deactivated');
    }

    // Validate date range
    if (new Date(endDate) < new Date(startDate)) {
      throw new ApiError(400, 'End date cannot be before start date');
    }

    const leave = await Leave.create({
      employeeId: employee._id,
      type,
      startDate,
      endDate,
      reason,
    });

    // Populate employee data for the response
    const populated = await Leave.findById(leave._id).populate({
      path: 'employeeId',
      select: 'firstName lastName email position department',
    });

    const result = populated.toObject();
    result.employee = result.employeeId;

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/leaves/:id/status
 * Updates the status of a leave request (APPROVED or REJECTED).
 * Only PENDING leaves can be updated.
 * Access: Admin only.
 */
const updateLeaveStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      throw new ApiError(400, 'Status must be APPROVED or REJECTED');
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      throw new ApiError(404, 'Leave request not found');
    }

    if (leave.status !== 'PENDING') {
      throw new ApiError(400, 'Only pending leave requests can be updated');
    }

    leave.status = status;
    await leave.save();

    // Return populated result
    const populated = await Leave.findById(leave._id).populate({
      path: 'employeeId',
      select: 'firstName lastName email position department',
    });

    const result = populated.toObject();
    result.employee = result.employeeId;

    res.status(200).json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeaves, createLeave, updateLeaveStatus };
