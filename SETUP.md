# Quick Setup Guide

Follow these steps to get the Employee Management System running:

## Prerequisites
- Node.js v18+ installed
- MongoDB installed and running (or MongoDB Atlas connection string)

## Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
```

4. Edit `.env` file with your MongoDB connection:
```env
MONGO_URI=mongodb://localhost:27017/employee-management
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/employee-management
```

5. Seed the database with admin user:
```bash
npm run seed
```

This creates:
- Email: `admin@company.com`
- Password: `admin123`

6. Start the server:
```bash
npm run dev
```

Server runs on: `http://localhost:5000`

## Frontend Setup

1. Open a new terminal and navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Verify `.env` file exists:
```bash
cat .env
# Should show: VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Client runs on: `http://localhost:5173`

## First Login

1. Open browser to `http://localhost:5173`
2. Click "Admin Portal"
3. Login with:
   - Email: `admin@company.com`
   - Password: `admin123`
4. **Important**: Change password immediately after first login

## Testing the System

### As Admin:
1. Create new employees from Employees page
2. Generate payslips from Payslips page
3. Approve/reject leave requests from Leave page
4. View dashboard statistics

### As Employee:
1. Login through Employee Portal with created employee credentials
2. Check in/out from Attendance page
3. Apply for leaves from Leave page
4. View payslips
5. Update profile bio from Settings

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection
- Verify `MONGO_URI` in `.env` file

### Port Already in Use
- Backend: Change `PORT` in `server/.env`
- Frontend: Vite will automatically suggest a different port

### CORS Errors
- Verify `CLIENT_ORIGIN` in `server/.env` matches your frontend URL
- Default: `http://localhost:5173`

## API Health Check

Test if backend is running:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Production Deployment

### Backend:
1. Set `NODE_ENV=production` in `.env`
2. Use strong `JWT_SECRET`
3. Use production MongoDB URL
4. Deploy to services like Heroku, Railway, or AWS

### Frontend:
1. Update `VITE_API_URL` to production backend URL
2. Build: `npm run build`
3. Deploy `dist` folder to Vercel, Netlify, or AWS S3

## Next Steps

After successful setup:
1. Change default admin password
2. Create employee accounts
3. Configure departments as needed
4. Customize salary structures
5. Set up backup strategies for MongoDB
