const mongoose = require('mongoose');

/**
 * Leave Schema — manages employee leave requests.
 * Supports three leave types (SICK, CASUAL, ANNUAL) with a
 * status workflow: PENDING → APPROVED or REJECTED.
 * Only admins can transition the status from PENDING.
 */
const leaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee reference is required'],
    },
    type: {
      type: String,
      enum: {
        values: ['SICK', 'CASUAL', 'ANNUAL'],
        message: '{VALUE} is not a valid leave type',
      },
      required: [true, 'Leave type is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for efficient querying by employee and status
leaveSchema.index({ employeeId: 1 });
leaveSchema.index({ status: 1 });

module.exports = mongoose.model('Leave', leaveSchema);
