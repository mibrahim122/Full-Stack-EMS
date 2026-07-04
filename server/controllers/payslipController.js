const Payslip = require('../models/Payslip');
const Employee = require('../models/Employee');
const ApiError = require('../utils/ApiError');

const getPayslips = async (req, res, next) => {
  try {
    let payslips;
    if (req.user.role === 'ADMIN') {
      payslips = await Payslip.find()
        .populate({ path: 'employeeId', select: 'firstName lastName email position department' })
        .sort({ year: -1, month: -1 });
    } else {
      const employee = await Employee.findOne({ userId: req.user._id });
      if (!employee) throw new ApiError(404, 'Employee profile not found');
      payslips = await Payslip.find({ employeeId: employee._id })
        .populate({ path: 'employeeId', select: 'firstName lastName email position department' })
        .sort({ year: -1, month: -1 });
    }
    const result = payslips.map((p) => {
      const obj = p.toObject();
      obj.employee = obj.employeeId;
      return obj;
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const createPayslip = async (req, res, next) => {
  try {
    const { employeeId, month, year, basicSalary, allowances, deductions } = req.body;
    const employee = await Employee.findById(employeeId);
    if (!employee) throw new ApiError(404, 'Employee not found');
    const netSalary = (Number(basicSalary) || 0) + (Number(allowances) || 0) - (Number(deductions) || 0);
    const payslip = await Payslip.create({
      employeeId, month: Number(month), year: Number(year),
      basicSalary: Number(basicSalary), allowances: Number(allowances) || 0,
      deductions: Number(deductions) || 0, netSalary,
    });
    const populated = await Payslip.findById(payslip._id)
      .populate({ path: 'employeeId', select: 'firstName lastName email position department' });
    const result = populated.toObject();
    result.employee = result.employeeId;
    res.status(201).json({ success: true, message: 'Payslip generated successfully', data: result });
  } catch (error) {
    next(error);
  }
};

const getPayslipById = async (req, res, next) => {
  try {
    const payslip = await Payslip.findById(req.params.id)
      .populate({ path: 'employeeId', select: 'firstName lastName email position department' });
    if (!payslip) throw new ApiError(404, 'Payslip not found');
    const result = payslip.toObject();
    result.employee = result.employeeId;
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// Add this new function to your controller
const deletePayslip = async (req, res, next) => {
  try {
    const payslip = await Payslip.findById(req.params.id);

    if (!payslip) {
      throw new ApiError(404, 'Payslip not found');
    }

    await payslip.deleteOne();

    res.status(200).json({ success: true, message: 'Payslip deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Don't forget to export it at the bottom!
module.exports = { getPayslips, createPayslip, getPayslipById, deletePayslip };


