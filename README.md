# Employee Management System

A full-stack MERN application for managing employees, attendance, leaves, and payslips.

## Tech Stack

### Frontend
- React 19
- Vite 8
- TailwindCSS 4
- React Router v7
- Axios
- React Hot Toast

### Backend
- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- express-validator

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions (API)
│   │   └── assets/         # Static assets
│   └── public/
│
├── server/                 # Backend Express application
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Entry point
```

## Features

### Admin Features
- Employee management (CRUD operations)
- View all attendance records
- Approve/reject leave requests
- Generate payslips
- Dashboard with statistics

### Employee Features
- Check-in/Check-out attendance
- Apply for leaves
- View payslips
- Update profile bio
- Change password
- Personal dashboard

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Install nodemon globally (optional):
```bash
npm install -g nodemon
```

4. Configure environment variables:
```bash
cp .env.example .env
```

5. Edit `.env` file with your configuration:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/employee_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

6. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Verify `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `PUT /api/auth/change-password` - Change password

### Dashboard
- `GET /api/dashboard` - Get dashboard stats (role-based)

### Employees
- `GET /api/employees` - Get all employees (Admin)
- `POST /api/employees` - Create employee (Admin)
- `GET /api/employees/profile` - Get current user profile
- `PUT /api/employees/profile` - Update profile bio
- `PUT /api/employees/:id` - Update employee (Admin)
- `DELETE /api/employees/:id` - Soft delete employee (Admin)

### Attendance
- `GET /api/attendance` - Get attendance history
- `POST /api/attendance/check-in` - Check in (Employee)
- `POST /api/attendance/check-out` - Check out (Employee)

### Leaves
- `GET /api/leaves` - Get leaves (all for admin, own for employee)
- `POST /api/leaves` - Apply for leave (Employee)
- `PUT /api/leaves/:id/status` - Approve/reject leave (Admin)

### Payslips
- `GET /api/payslips` - Get payslips (all for admin, own for employee)
- `POST /api/payslips` - Generate payslip (Admin)
- `GET /api/payslips/:id` - Get single payslip

## Default Login Credentials

After setting up, you'll need to create the first admin user directly in MongoDB or via a seed script.

### Creating First Admin User

You can use MongoDB Compass or `mongosh`:

```javascript
// Connect to your database
use employee_db

// Create admin user
db.users.insertOne({
  email: "admin@example.com",
  password: "YOUR_HASHED_PASSWORD_HERE", // Hash your password using bcrypt before inserting
  role: "ADMIN",
  createdAt: new Date(),
  updatedAt: new Date()
})

// Get the user ID and create employee profile
db.employees.insertOne({
  userId: ObjectId("PASTE_GENERATED_USER_ID_HERE"),
  firstName: "Admin",
  lastName: "User",
  email: "admin@example.com",
  phone: "1234567890",
  department: "Management",
  position: "Administrator",
  basicSalary: 0,
  allowances: 0,
  deductions: 0,
  employmentStatus: "ACTIVE",
  joinDate: new Date(),
  bio: "System Administrator",
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

*Note: Alternatively, you can create a automated seed script in `server/seed.js` for quick setup.*

## Database Models

### User
- email (unique)
- password (hashed)
- role (ADMIN/EMPLOYEE)

### Employee
- userId (ref: User)
- firstName, lastName
- email, phone
- department, position
- basicSalary, allowances, deductions
- employmentStatus (ACTIVE/INACTIVE)
- joinDate, bio, image
- isDeleted (soft delete)

### Attendance
- employeeId (ref: Employee)
- date, checkIn, checkOut
- status (PRESENT/LATE)
- workingHours, dayType

### Leave
- employeeId (ref: Employee)
- type (SICK/CASUAL/ANNUAL)
- startDate, endDate, reason
- status (PENDING/APPROVED/REJECTED)

### Payslip
- employeeId (ref: Employee)
- month, year
- basicSalary, allowances, deductions, netSalary

## Development Workflow

1. Start MongoDB service
2. Run backend server: `cd server && npm run dev`
3. Run frontend server: `cd client && npm run dev`
4. Access the application at `http://localhost:5173`

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Input validation with express-validator
- CORS configuration
- Token expiration handling

## License

ISC
