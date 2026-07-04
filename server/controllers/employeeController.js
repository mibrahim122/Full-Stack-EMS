const User = require('../models/User');
const Employee = require('../models/Employee');
const ApiError = require('../utils/ApiError');

/**
 * GET /api/employees
 * Returns a list of all employees. Supports optional department filtering.
 */
const getEmployees = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.department) {
      filter.department = req.query.department;
    }

    const employees = await Employee.find(filter)
      .populate('userId', 'email role')
      .sort({ createdAt: -1 });

    // Transform response and safely filter out any broken/orphaned database records
    const result = employees
      .map((emp) => {
        if (!emp) return null;
        const obj = emp.toObject();
        obj.user = obj.userId ? { email: obj.userId.email, role: obj.userId.role } : null;
        return obj;
      })
      .filter(emp => emp !== null);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/employees
 * Creates a new User account and associated Employee profile.
 * Automatically cleans up "ghost" users from previous database errors.
 */
const createEmployee = async (req, res, next) => {
  try {
    const {
      firstName, lastName, email, phone, department, position,
      basicSalary, allowances, deductions, joinDate, bio, password, role,
    } = req.body;

    const lowerCaseEmail = email.toLowerCase();

    // --- GHOST USER SWEEPER ---
    const existingUser = await User.findOne({ email: lowerCaseEmail });
    if (existingUser) {
      const linkedEmployee = await Employee.findOne({ userId: existingUser._id });

      if (!linkedEmployee) {
        // Ghost account found! It has no profile. Wipe it out automatically.
        await User.findByIdAndDelete(existingUser._id);
      } else if (linkedEmployee.isDeleted) {
        throw new ApiError(400, 'This email is currently in the Trash Bin. Please permanently delete it or restore it first.');
      } else {
        throw new ApiError(400, 'An active account with this email already exists.');
      }
    }

    // Create user account
    const user = await User.create({
      email: lowerCaseEmail,
      password,
      role: role || 'EMPLOYEE',
    });

    try {
      // Create employee profile linked to the new user
      const employee = await Employee.create({
        userId: user._id,
        firstName,
        lastName,
        email: lowerCaseEmail,
        phone,
        department,
        position,
        basicSalary: basicSalary || 0,
        allowances: allowances || 0,
        deductions: deductions || 0,
        joinDate,
        bio: bio || '',
      });

      // Populate user reference for the response
      const populatedEmployee = await Employee.findById(employee._id)
        .populate('userId', 'email role');

      const result = populatedEmployee.toObject();
      result.user = result.userId ? { email: result.userId.email, role: result.userId.role } : null;

      res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: result,
      });
    } catch (empError) {
      // Rollback: delete the user if employee creation fails
      await User.findByIdAndDelete(user._id);
      throw empError;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/employees/:id
 * Updates an existing employee's profile and optionally their user account.
 */
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      firstName, lastName, email, phone, department, position,
      basicSalary, allowances, deductions, joinDate, bio,
      employmentStatus, password, role,
    } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      throw new ApiError(404, 'Employee not found');
    }

    // Update employee fields
    if (firstName !== undefined) employee.firstName = firstName;
    if (lastName !== undefined) employee.lastName = lastName;
    if (email !== undefined) employee.email = email.toLowerCase();
    if (phone !== undefined) employee.phone = phone;
    if (department !== undefined) employee.department = department;
    if (position !== undefined) employee.position = position;
    if (basicSalary !== undefined) employee.basicSalary = basicSalary;
    if (allowances !== undefined) employee.allowances = allowances;
    if (deductions !== undefined) employee.deductions = deductions;
    if (joinDate !== undefined) employee.joinDate = joinDate;
    if (bio !== undefined) employee.bio = bio;
    if (employmentStatus !== undefined) employee.employmentStatus = employmentStatus;

    await employee.save();

    // Update associated user if password or role or email changed
    const user = await User.findById(employee.userId);
    if (user) {
      if (email !== undefined) user.email = email.toLowerCase();
      if (role !== undefined) user.role = role;
      if (password && password.trim() !== '') {
        user.password = password;
      }
      await user.save();
    }

    // Return populated result
    const updated = await Employee.findById(id).populate('userId', 'email role');
    const result = updated.toObject();
    result.user = result.userId ? { email: result.userId.email, role: result.userId.role } : null;

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/employees/:id
 * Soft-deletes an employee and their linked User account.
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) {
      throw new ApiError(404, 'Employee not found');
    }

    // Soft delete the employee profile
    employee.isDeleted = true;
    employee.employmentStatus = 'INACTIVE';
    await employee.save();

    // Soft delete the linked User login account
    if (employee.userId) {
      await User.findByIdAndUpdate(employee.userId, { isDeleted: true });
    }

    res.status(200).json({
      success: true,
      message: 'Employee moved to trash successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/employees/:id/restore
 * Restores a soft-deleted employee and their user account.
 */
const restoreEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) {
      throw new ApiError(404, 'Employee not found');
    }

    // Restore the employee profile
    employee.isDeleted = false;
    employee.employmentStatus = 'ACTIVE';
    await employee.save();

    // Restore the linked User login account
    if (employee.userId) {
      await User.findByIdAndUpdate(employee.userId, { isDeleted: false });
    }

    res.status(200).json({
      success: true,
      message: 'Employee restored successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/employees/:id/permanent
 * Hard-deletes an employee out of the database permanently and cleans up their linked User account.
 */
const permanentDeleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) {
      throw new ApiError(404, 'Employee not found');
    }

    // Delete the associated user account profile first
    if (employee.userId) {
      await User.findByIdAndDelete(employee.userId);
    }

    // Delete the employee record itself
    await Employee.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Employee record permanently erased',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/employees/profile
 * Returns the employee profile of the currently authenticated user.
 */
const getProfile = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id })
      .populate('userId', 'email role');

    if (!employee) {
      throw new ApiError(404, 'Employee profile not found');
    }

    const result = employee.toObject();
    result.user = result.userId ? { email: result.userId.email, role: result.userId.role } : null;

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/employees/profile
 * Updates the bio of the currently authenticated user's employee profile.
 */
const updateProfile = async (req, res, next) => {
  try {
    const { bio } = req.body;

    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee) {
      throw new ApiError(404, 'Employee profile not found');
    }

    if (employee.isDeleted) {
      throw new ApiError(403, 'Cannot update profile — account is deactivated');
    }

    if (bio !== undefined) {
      employee.bio = bio;
    }

    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  restoreEmployee,
  permanentDeleteEmployee,
  getProfile,
  updateProfile,
};