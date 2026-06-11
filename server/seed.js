require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Employee = require('./models/Employee');
const connectDB = require('./config/db');

/**
 * Seed script to create initial admin user for the system.
 * Run with: node seed.js
 */

const seedUsers = async () => {
  try {
    await connectDB();

    const accounts = [
      {
        email: 'admin@company.com',
        password: 'admin123',
        role: 'ADMIN',
        employee: {
          firstName: 'System',
          lastName: 'Administrator',
          phone: '+1234567890',
          department: 'IT Support',
          position: 'System Administrator',
          basicSalary: 50000,
          allowances: 5000,
          deductions: 1000,
          bio: 'System Administrator with full access',
        },
      },
      {
        email: 'employee@company.com',
        password: 'employee123',
        role: 'EMPLOYEE',
        employee: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1987654321',
          department: 'Engineering',
          position: 'Software Engineer',
          basicSalary: 45000,
          allowances: 3000,
          deductions: 500,
          bio: 'Full-stack developer on the core team',
        },
      },
    ];

    for (const account of accounts) {
      const existingUser = await User.findOne({ email: account.email });
      if (existingUser) {
        console.log(`User already exists: ${account.email}`);
        continue;
      }

      const user = await User.create({
        email: account.email,
        password: account.password,
        role: account.role,
      });

      await Employee.create({
        userId: user._id,
        email: account.email,
        employmentStatus: 'ACTIVE',
        joinDate: new Date(),
        ...account.employee,
      });

      console.log(`Created ${account.role} user: ${account.email}`);
    }

    console.log('\nDefault Credentials:');
    console.log('Admin    — admin@company.com / admin123');
    console.log('Employee — employee@company.com / employee123');
    console.log('\n⚠️  Please change these passwords after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedUsers();
