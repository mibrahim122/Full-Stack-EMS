const mongoose = require('mongoose');

const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
  'IT Support',
  'Customer Success',
  'Product Management',
  'Design',
];

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    department: {
      type: String,
      enum: {
        values: DEPARTMENTS,
        message: '{VALUE} is not a valid department',
      },
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    basicSalary: {
      type: Number,
      default: 0,
      min: [0, 'Basic salary cannot be negative'],
    },
    allowances: {
      type: Number,
      default: 0,
      min: [0, 'Allowances cannot be negative'],
    },
    deductions: {
      type: Number,
      default: 0,
      min: [0, 'Deductions cannot be negative'],
    },
    employmentStatus: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    joinDate: {
      type: Date,
      required: [true, 'Join date is required'],
    },
    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    image: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field to simplify the referenced user layout inside populates
employeeSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Optimized database search indexes
employeeSchema.index({ department: 1 });
employeeSchema.index({ isDeleted: 1 });

// CRASH PROTECTION: Prevents OverwriteModelError
module.exports = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);