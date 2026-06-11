# Employee Management System

A full-stack MERN application for managing employees, attendance, leaves, and payslips with role-based access control and secure authentication.

**Live Demo:** *(Add your hosted URL here)*

---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Security Features](#security-features)
- [Development Workflow](#development-workflow)
- [Deployment Guide](#deployment-guide)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 8** - Build tool & dev server
- **TailwindCSS 4** - Utility-first CSS framework
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Nodemon** - Auto-reload server
- **dotenv** - Environment variable management
- **MongoDB Atlas** (optional) - Cloud MongoDB hosting

---

## Project Structure

```
employee-management-system/
├── client/                           # Frontend React application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── context/                 # React Context (Auth state)
│   │   ├── pages/                   # Page components
│   │   ├── utils/                   # Utility functions (API calls, helpers)
│   │   ├── assets/                  # Images, icons, static files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example                 # Environment variables template
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                           # Backend Express application
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── controllers/                 # Route handlers
│   ├── middleware/                  # Custom middleware (auth, validation)
│   ├── models/                      # Mongoose schemas
│   ├── routes/                      # API route definitions
│   ├── utils/                       # Helper functions
│   ├── seed.js                      # Database seeding script
│   ├── .env.example                 # Environment variables template
│   ├── server.js                    # Entry point
│   ├── package.json
│   └── .gitignore
│
├── .gitignore                        # Git ignore file
└── README.md                         # This file
```

---

## Features

### 👨‍💼 Admin Features
- **Employee Management** - CRUD operations with soft delete
- **Attendance Records** - View all employee attendance with filters
- **Leave Approval System** - Approve/reject leave requests with comments
- **Payroll Management** - Generate and manage payslips
- **Dashboard Analytics** - Statistics: total employees, present/absent today, pending leaves, payroll info
- **Bulk Operations** - Export employee data, generate multiple payslips

### 👤 Employee Features
- **Attendance Tracking** - Check-in/check-out with automatic time tracking
- **Leave Management** - Apply for leaves with type selection (sick, casual, annual)
- **Payslip Access** - View and download payslips
- **Profile Management** - Update personal bio, view profile details
- **Security** - Change password, logout with token invalidation
- **Personal Dashboard** - Overview of attendance, leaves, and upcoming payslips

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** v9+ or **yarn** v3+
- **MongoDB** v5+ (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** (for version control)
- **Postman** or **Thunder Client** (optional, for API testing)

### Verify Installation
```bash
node --version      # Should be v18 or higher
npm --version       # Should be v9 or higher
mongo --version     # For local MongoDB
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/employee-management-system.git
cd employee-management-system
```

### 2. Backend Setup

#### Step 1: Navigate to server directory
```bash
cd server
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Install nodemon globally (optional but recommended)
```bash
npm install -g nodemon
```

#### Step 4: Create environment file
```bash
cp .env.example .env
```

#### Step 5: Configure environment variables
Edit the `.env` file with your settings (see [Environment Variables](#environment-variables) section)

#### Step 6: Initialize database
```bash
# Option A: Run the seed script to create admin user and sample data
node seed.js

# Option B: Create admin user manually (see Database Setup section)
```

#### Step 7: Start the development server
```bash
npm run dev
```

✅ Backend server running on `http://localhost:5000`

### 3. Frontend Setup

#### Step 1: Navigate to client directory (new terminal)
```bash
cd client
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Create environment file
```bash
cp .env.example .env
```

#### Step 4: Verify `.env` configuration
```env
VITE_API_URL=http://localhost:5000/api
```

#### Step 5: Start the development server
```bash
npm run dev
```

✅ Frontend running on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to: **`http://localhost:5173`**

---

## Environment Variables

### Backend `.env` Configuration

```env
# Server Configuration
PORT=5000
NODE_ENV=development          # development, staging, production

# Database
MONGO_URI=mongodb://localhost:27017/employee_db
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/employee_db?retryWrites=true&w=majority

# Security (⚠️ IMPORTANT: Change these in production!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CLIENT_ORIGIN=http://localhost:5173

# Email (optional, for future notifications)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

# File Upload (optional)
# MAX_FILE_SIZE=5242880  # 5MB in bytes

# Session
SESSION_SECRET=your_session_secret_min_32_chars
```

### Frontend `.env` Configuration

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Employee Management System
```

### ⚠️ Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
   ```
   # .gitignore
   .env
   .env.local
   .env.*.local
   ```

2. **Generate strong secrets**
   ```bash
   # Generate a random JWT_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Use different secrets for each environment**
   - Development: Simple test secrets
   - Production: Strong, randomly generated secrets

4. **Rotate secrets regularly** in production

5. **Never expose credentials** in logs or error messages

---

## Database Setup

### Option 1: MongoDB Local Installation

#### On Windows/Mac
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB service
mongod

# In another terminal, connect to MongoDB
mongosh
```

#### On Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
mongosh
```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (M0 free tier recommended)
3. Create database user and get connection string
4. Update `MONGO_URI` in `.env`:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/employee_db
   ```

### Creating Admin User

#### Option A: Using Seed Script (Recommended)

Create `server/seed.js`:
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Employee = require('./models/Employee');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    // Create admin user
    const adminUser = new User({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    });
    await adminUser.save();

    // Create admin employee profile
    const adminEmployee = new Employee({
      userId: adminUser._id,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      phone: '1234567890',
      department: 'Management',
      position: 'Administrator',
      basicSalary: 50000,
      allowances: 5000,
      deductions: 2000,
      employmentStatus: 'ACTIVE',
      joinDate: new Date(),
      bio: 'System Administrator',
    });
    await adminEmployee.save();

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: Admin@123');
    console.log('⚠️ Change password after first login!');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
```

Run the seed script:
```bash
cd server
node seed.js
```

#### Option B: Manual Creation via MongoDB Shell

```bash
# Connect to MongoDB
mongosh

# Select database
use employee_db

# Generate hashed password (use online bcrypt tool or Node)
# Password: Admin@123
# Hashed: $2a$10$... (generate using Node)

# Create admin user
db.users.insertOne({
  email: "admin@example.com",
  password: "$2a$10$...",  // Hashed password
  role: "ADMIN",
  createdAt: new Date(),
  updatedAt: new Date()
})

# Copy the generated _id and create employee
db.employees.insertOne({
  userId: ObjectId("PASTE_USER_ID"),
  firstName: "Admin",
  lastName: "User",
  email: "admin@example.com",
  phone: "1234567890",
  department: "Management",
  position: "Administrator",
  basicSalary: 50000,
  allowances: 5000,
  deductions: 2000,
  employmentStatus: "ACTIVE",
  joinDate: new Date(),
  bio: "System Administrator",
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Default Login Credentials

After seeding:
- **Email:** `admin@example.com`
- **Password:** `Admin@123`
- **⚠️ Change password immediately after first login!**

---

## API Endpoints

Base URL: `http://localhost:5000/api`

All protected routes require `Authorization: Bearer <token>` header

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/auth/login` | User login | ❌ |
| PUT | `/auth/change-password` | Change password | ✅ |
| POST | `/auth/logout` | Logout & invalidate token | ✅ |

### Dashboard Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/dashboard` | Dashboard statistics (role-based) | Admin/Employee |

**Response (Admin):**
```json
{
  "totalEmployees": 25,
  "presentToday": 20,
  "absentToday": 5,
  "pendingLeaves": 3,
  "totalPayroll": 750000
}
```

### Employee Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/employees` | Get all employees | Admin |
| POST | `/employees` | Create new employee | Admin |
| GET | `/employees/profile` | Get current user profile | Employee/Admin |
| PUT | `/employees/profile` | Update own profile bio | Employee/Admin |
| PUT | `/employees/:id` | Update employee details | Admin |
| DELETE | `/employees/:id` | Soft delete employee | Admin |
| GET | `/employees/:id` | Get employee by ID | Admin |

### Attendance Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/attendance` | Get attendance history | Employee/Admin |
| GET | `/attendance?employeeId=X` | Filter by employee | Admin |
| POST | `/attendance/check-in` | Employee check-in | Employee |
| POST | `/attendance/check-out` | Employee check-out | Employee |
| GET | `/attendance/report` | Generate attendance report | Admin |

**Check-in Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "employeeId": "507f1f77bcf86cd799439012",
  "date": "2024-01-15",
  "checkIn": "09:00:00",
  "status": "PRESENT",
  "message": "Checked in successfully"
}
```

### Leave Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/leaves` | Get leaves (all/own based on role) | Employee/Admin |
| GET | `/leaves?status=PENDING` | Filter by status | Admin |
| POST | `/leaves` | Apply for leave | Employee |
| PUT | `/leaves/:id/status` | Approve/reject leave | Admin |
| DELETE | `/leaves/:id` | Delete leave request | Employee (own only) |

**Apply for Leave Body:**
```json
{
  "type": "CASUAL",
  "startDate": "2024-02-01",
  "endDate": "2024-02-03",
  "reason": "Personal work"
}
```

**Leave Types:** `SICK`, `CASUAL`, `ANNUAL`, `MATERNITY`, `UNPAID`

### Payslip Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/payslips` | Get payslips (all/own) | Employee/Admin |
| POST | `/payslips` | Generate payslip | Admin |
| GET | `/payslips/:id` | Get single payslip | Employee/Admin |
| DELETE | `/payslips/:id` | Delete payslip | Admin |

**Generate Payslip Body:**
```json
{
  "employeeId": "507f1f77bcf86cd799439012",
  "month": 1,
  "year": 2024
}
```

---

## Authentication

### JWT Implementation

All protected endpoints require JWT token in header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Login Flow

1. **Send credentials:**
   ```bash
   POST /api/auth/login
   Content-Type: application/json

   {
     "email": "employee@example.com",
     "password": "password123"
   }
   ```

2. **Receive token:**
   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": "507f1f77bcf86cd799439012",
       "email": "employee@example.com",
       "role": "EMPLOYEE"
     }
   }
   ```

3. **Store token** (localStorage or cookie):
   ```javascript
   localStorage.setItem('token', response.data.token);
   ```

4. **Use token in requests:**
   ```javascript
   const headers = {
     'Authorization': `Bearer ${token}`
   };
   axios.get('/api/employees/profile', { headers });
   ```

### Token Refresh (if applicable)
The token expires in 7 days. Users need to login again after expiration.

---

## Security Features

### Implementation Details

✅ **Password Security**
- Passwords hashed with bcryptjs (10 salt rounds)
- Password strength validation on change
- Minimum 8 characters, mixed case required

✅ **Authentication**
- JWT-based stateless authentication
- Token expiration: 7 days
- Secure token storage (localStorage with XSS protection)

✅ **Authorization**
- Role-based access control (RBAC)
- Admin vs Employee routes
- Soft delete for employees (data retention)

✅ **Data Validation**
- Input validation with express-validator
- Sanitization of user inputs
- Type checking with Mongoose schemas

✅ **CORS Security**
- Whitelist allowed origins
- Production: Use specific domain
- Development: localhost:5173

✅ **Additional Measures**
- HTTP headers security (Helmet recommended)
- Rate limiting (implement in production)
- Request logging and audit trails
- Secure password reset flow (if implemented)

### Production Security Checklist

- [ ] Change all default secrets
- [ ] Enable HTTPS/SSL certificates
- [ ] Implement rate limiting (express-rate-limit)
- [ ] Add request logging (morgan)
- [ ] Set secure CORS origins
- [ ] Use environment-specific configs
- [ ] Enable MongoDB authentication
- [ ] Regular security audits
- [ ] Implement refresh tokens
- [ ] Add email verification
- [ ] Enable 2FA for admin users

---

## Development Workflow

### Starting the Application

**Terminal 1 - MongoDB:**
```bash
mongod  # or: systemctl start mongodb (Linux)
```

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd client
npm run dev
```

### File Changes & Hot Reload
- **Backend:** Nodemon automatically restarts on file changes
- **Frontend:** Vite automatically reloads on file changes

### Available Scripts

#### Backend
```bash
npm run dev      # Start with nodemon (development)
npm start        # Start without nodemon (production)
npm run seed     # Seed database with sample data
npm run test     # Run tests (if configured)
npm run lint     # Run linter (if configured)
```

#### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter (if configured)
```

---

## Deployment Guide

### Backend Deployment (Render, Railway, Heroku)

#### Prepare for Deployment

1. Update `.env` for production:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/employee_db
   JWT_SECRET=<strong-random-secret>
   CLIENT_ORIGIN=https://yourdomain.com
   ```

2. Update `package.json`:
   ```json
   {
     "scripts": {
       "start": "node server.js"
     }
   }
   ```

#### Deploy to Render

1. Push code to GitHub
2. Connect GitHub repo to Render
3. Set environment variables in Render dashboard
4. Deploy

#### Deploy to Railway

```bash
npm install -g railway
railway login
railway init
railway up
```

### Frontend Deployment (Vercel, Netlify)

#### Using Vercel (Recommended)

```bash
npm install -g vercel
cd client
vercel
```

#### Using Netlify

```bash
npm run build
# Drag and drop dist folder to Netlify
```

#### Update API URL

Before building for production:
```env
VITE_API_URL=https://your-backend-api.com/api
```

---

## Troubleshooting

### Common Issues & Solutions

#### 1. MongoDB Connection Error
**Error:** `connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
```bash
# Windows
net start MongoDB

# Linux
sudo systemctl start mongodb

# Mac
brew services start mongodb-community
```

#### 2. Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=5001 npm run dev
```

#### 3. CORS Error
**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
- Check `CLIENT_ORIGIN` in backend `.env`
- Ensure frontend URL matches exactly
- Restart backend server

#### 4. JWT Authentication Failed
**Error:** `401 Unauthorized - Invalid Token`

**Solution:**
```javascript
// Clear localStorage and login again
localStorage.removeItem('token');
// Refresh page and login
```

#### 5. MongoDB Authentication Error
**Error:** `MongoAuthenticationError: connect EAUTH authentication failed`

**Solution:**
- Verify MongoDB username/password
- Check MongoDB Atlas IP whitelist
- Ensure user has database access permissions

#### 6. Vite Build Issues
**Error:** `Module not found` or `Cannot find module`

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### 7. React Router Not Working
**Error:** `Cannot GET /employees` (404)

**Solution:**
- Add catch-all route in Express backend:
  ```javascript
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
  ```

### Debug Mode

**Backend:**
```bash
DEBUG=* npm run dev
```

**Frontend:**
```bash
VITE_DEBUG=true npm run dev
```

---

## Database Models

### User Schema
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  role: String (ADMIN | EMPLOYEE),
  createdAt: Date,
  updatedAt: Date
}
```

### Employee Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  department: String,
  position: String,
  basicSalary: Number,
  allowances: Number,
  deductions: Number,
  employmentStatus: String (ACTIVE | INACTIVE | ON_LEAVE),
  joinDate: Date,
  bio: String,
  image: String (URL),
  isDeleted: Boolean (soft delete),
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance Schema
```javascript
{
  _id: ObjectId,
  employeeId: ObjectId (ref: Employee),
  date: Date,
  checkIn: Time,
  checkOut: Time,
  status: String (PRESENT | ABSENT | LATE),
  workingHours: Number,
  dayType: String (WEEKDAY | WEEKEND | HOLIDAY),
  createdAt: Date,
  updatedAt: Date
}
```

### Leave Schema
```javascript
{
  _id: ObjectId,
  employeeId: ObjectId (ref: Employee),
  type: String (SICK | CASUAL | ANNUAL | MATERNITY | UNPAID),
  startDate: Date,
  endDate: Date,
  reason: String,
  status: String (PENDING | APPROVED | REJECTED),
  approvedBy: ObjectId (ref: User),
  approvalDate: Date,
  comments: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Payslip Schema
```javascript
{
  _id: ObjectId,
  employeeId: ObjectId (ref: Employee),
  month: Number (1-12),
  year: Number,
  basicSalary: Number,
  allowances: Number,
  deductions: Number,
  netSalary: Number,
  generatedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Performance Optimization

### Backend
- Add database indexes on frequently queried fields
- Implement pagination for list endpoints
- Cache dashboard statistics (Redis - optional)
- Compress responses with gzip

### Frontend
- Lazy load route components
- Code splitting with React.lazy()
- Optimize bundle size with Vite
- Image optimization

---

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Standards
- Follow ESLint configuration
- Use meaningful commit messages
- Test changes before submitting PR

---

## Support & Resources

- **Documentation:** [See API Endpoints](#api-endpoints)
- **MongoDB Docs:** https://docs.mongodb.com/
- **Express Docs:** https://expressjs.com/
- **React Docs:** https://react.dev/
- **Issues:** [GitHub Issues](https://github.com/yourusername/employee-management-system/issues)

---

## License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## Version History

### v1.0.0 (Current)
- Initial release
- Employee management
- Attendance tracking
- Leave management
- Payslip generation
- JWT authentication
- Role-based access control

---

**Last Updated:** January 2024
**Maintainer:** Your Name / Your Team

---

### Quick Reference

| Action | Command |
|--------|---------|
| Start all services | Terminal 1: `mongod` → Terminal 2: `cd server && npm run dev` → Terminal 3: `cd client && npm run dev` |
| Create admin user | `cd server && node seed.js` |
| Generate JWT secret | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| Access app | `http://localhost:5173` |
| Access API | `http://localhost:5000/api` |
| Test login | Email: `admin@example.com` | Password: `Admin@123` |
| View logs | Check terminal where `npm run dev` is running |
| Clear database | Connect to MongoDB and run `db.dropDatabase()` |
