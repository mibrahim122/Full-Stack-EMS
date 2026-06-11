const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema — represents authentication credentials.
 * Each User maps 1:1 with an Employee record via Employee.userId.
 * Passwords are automatically hashed before saving using bcrypt.
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Excluded from queries by default for security
    },
    role: {
      type: String,
      enum: ['ADMIN', 'EMPLOYEE'],
      default: 'EMPLOYEE',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook: Hashes the password with bcrypt before persisting.
 * Only runs when the password field has been modified (avoids rehashing on other updates).
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method: Compares a plaintext password against the stored hash.
 * Used during login to verify credentials.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
