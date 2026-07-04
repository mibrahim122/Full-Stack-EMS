const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Hidden by default for system security
    },
    role: {
      type: String,
      enum: ['ADMIN', 'EMPLOYEE'],
      default: 'EMPLOYEE',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Partial Unique Index:
 * Enforces email uniqueness ONLY for active users who are not deleted.
 */
userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false },
  }
);

// THE FIX: Removed `next` from the parameters and logic. 
// Mongoose natively supports async/await here.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method: Compares a plaintext password against the stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// CRASH PROTECTION: Prevents OverwriteModelError
module.exports = mongoose.models.User || mongoose.model('User', userSchema);