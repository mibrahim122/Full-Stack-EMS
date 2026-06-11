#!/bin/bash

# Employee Management System - Quick Start Script
# This script automates the setup process

echo "🚀 Employee Management System - Quick Start"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   Run: mongod (or check your MongoDB Atlas connection)"
    echo ""
fi

# Backend Setup
echo "📦 Setting up Backend..."
cd server || exit

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your MongoDB connection string"
else
    echo "✅ .env file exists"
fi

echo ""
echo "🌱 Seeding database with admin user..."
npm run seed

cd ..

# Frontend Setup
echo ""
echo "📦 Setting up Frontend..."
cd client || exit

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

cd ..

# Final Instructions
echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "Default Admin Credentials:"
echo "  Email: admin@company.com"
echo "  Password: admin123"
echo ""
echo "⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!"
echo ""
echo "To start the application:"
echo ""
echo "1️⃣  Start Backend (in terminal 1):"
echo "   cd server && npm run dev"
echo ""
echo "2️⃣  Start Frontend (in terminal 2):"
echo "   cd client && npm run dev"
echo ""
echo "3️⃣  Open browser:"
echo "   http://localhost:5173"
echo ""
echo "📖 For detailed instructions, see SETUP.md"
echo "✅ For testing checklist, see TESTING_CHECKLIST.md"
echo ""
