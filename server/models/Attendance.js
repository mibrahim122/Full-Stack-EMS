const mongoose = require('mongoose');

/**
 * Attendance Schema — tracks daily check-in/check-out records.
 * Each record represents one workday for one employee.
 * Working hours and day type are computed server-side on check-out.
 *
 * Compound unique index on { employeeId, date } prevents duplicate
 * attendance records for the same employee on the same day.
 */
const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee reference is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    checkIn: {
      type: Date,
      default: null,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['PRESENT', 'LATE'],
      default: 'PRESENT',
    },
    workingHours: {
      type: Number,
      default: null,
    },
    dayType: {
      type: String,
      enum: ['Full Day', 'Three Quarter Day', 'Half Day', 'Short Day', null],
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent duplicate attendance records for the same employee on the same day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
