const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');
const ApiError = require('../utils/ApiError');

/**
 * Generates a signed JWT token containing the user's ID and role.
 * Token expiry is configured via JWT_EXPIRES_IN environment variable.
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * POST /api/auth/login
 * Authenticates a user with email, password, and role.
 * Returns a JWT token along with user and employee profile data.
 * The role parameter ensures admins can only login through the admin portal
 * and employees through the employee portal.
 */
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Find user with password field included (excluded by default via select: false)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Verify role matches the portal being used
    if (user.role !== role.toUpperCase()) {
      throw new ApiError(403, 'You are not authorized to access this portal');
    }

    // Fetch employee profile for the authenticated user
    const employee = await Employee.findOne({ userId: user._id });

    // Generate JWT
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      employee: employee || null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/change-password
 * Changes the authenticated user's password.
 * Requires the current password for verification before updating.
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Fetch user with password field
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(400, 'Current password is incorrect');
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, changePassword };
