# Testing Checklist — Employee Management System

## Phase 1: Backend API Testing

### Server Health
- [ ] Start server with `npm run dev` in `/server`
- [ ] Verify MongoDB connection successful
- [ ] Test health endpoint: `GET http://localhost:5000/api/health`

### Authentication Routes
- [ ] **POST /api/auth/login** (Admin)
  - Email: `admin@company.com`, Password: `admin123`, Role: `ADMIN`
  - Expected: Token + user + employee data
- [ ] **POST /api/auth/login** (Wrong password)
  - Expected: 401 error
- [ ] **POST /api/auth/login** (Wrong role)
  - Admin credentials with role: `EMPLOYEE`
  - Expected: 403 error
- [ ] **PUT /api/auth/change-password**
  - With valid current password
  - Expected: Password updated successfully

### Employee Routes (Admin Only)
- [ ] **GET /api/employees**
  - Expected: List of all employees
- [ ] **GET /api/employees?department=IT Support**
  - Expected: Filtered employees
- [ ] **POST /api/employees**
  - Create new employee with all fields
  - Expected: 201 + employee data
- [ ] **POST /api/employees** (Duplicate email)
  - Expected: 400 error
- [ ] **PUT /api/employees/:id**
  - Update employee details
  - Expected: Employee updated
- [ ] **DELETE /api/employees/:id**
  - Soft delete employee
  - Expected: Employee deleted (isDeleted: true)

### Profile Routes (Any User)
- [ ] **GET /api/employees/profile**
  - Expected: Current user's employee profile
- [ ] **PUT /api/employees/profile**
  - Update bio field
  - Expected: Profile updated

### Attendance Routes
- [ ] **GET /api/attendance**
  - Expected: Attendance history for current employee
- [ ] **POST /api/attendance/check-in**
  - Expected: Check-in record created
- [ ] **POST /api/attendance/check-in** (Duplicate)
  - Expected: 400 error "Already checked in"
- [ ] **POST /api/attendance/check-out**
  - Expected: Check-out recorded + working hours calculated
- [ ] **POST /api/attendance/check-out** (No check-in)
  - Expected: 400 error

### Leave Routes
- [ ] **GET /api/leaves** (Admin)
  - Expected: All leave requests
- [ ] **GET /api/leaves** (Employee)
  - Expected: Only own leave requests
- [ ] **POST /api/leaves**
  - Create leave request
  - Expected: 201 + leave data with status: PENDING
- [ ] **PUT /api/leaves/:id/status** (Admin)
  - Approve leave: `{ status: "APPROVED" }`
  - Expected: Leave approved
- [ ] **PUT /api/leaves/:id/status** (Admin)
  - Reject leave: `{ status: "REJECTED" }`
  - Expected: Leave rejected

### Payslip Routes
- [ ] **GET /api/payslips** (Admin)
  - Expected: All payslips
- [ ] **GET /api/payslips** (Employee)
  - Expected: Only own payslips
- [ ] **POST /api/payslips** (Admin)
  - Generate payslip with employee ID, month, year, salary data
  - Expected: 201 + payslip with calculated netSalary
- [ ] **POST /api/payslips** (Duplicate month/year)
  - Expected: 400 error
- [ ] **GET /api/payslips/:id**
  - Expected: Single payslip details

### Dashboard Routes
- [ ] **GET /api/dashboard** (Admin)
  - Expected: totalEmployees, totalDepartments, todayAttendance, pendingLeaves
- [ ] **GET /api/dashboard** (Employee)
  - Expected: currentMonthAttendance, pendingLeaves, latestPayslip, employee

---

## Phase 2: Frontend Integration Testing

### Setup
- [ ] Start frontend with `npm run dev` in `/client`
- [ ] Verify Vite server running on `http://localhost:5173`
- [ ] No console errors on page load

### Login Flow
- [ ] Navigate to `/login`
- [ ] Click "Admin Portal"
- [ ] Login with admin credentials
- [ ] Verify redirect to `/dashboard`
- [ ] Verify token stored in localStorage
- [ ] Verify user data stored in localStorage
- [ ] Sidebar shows admin name and role
- [ ] Logout clears localStorage and redirects to `/login`

### Admin Dashboard
- [ ] Displays total employees count
- [ ] Displays total departments count
- [ ] Displays today's attendance count
- [ ] Displays pending leaves count
- [ ] No hardcoded dummy data

### Employees Page (Admin)
- [ ] Displays list of employees fetched from API
- [ ] Search filter works
- [ ] Department filter works
- [ ] Click "Add Employee" opens modal
- [ ] Create employee form submits successfully
- [ ] Edit employee opens modal with pre-filled data
- [ ] Edit employee saves changes
- [ ] Delete employee shows confirmation
- [ ] Delete employee removes from list (soft delete)

### Attendance Page (Employee)
- [ ] Displays attendance history from API
- [ ] Check-in button creates attendance record
- [ ] Toast notification appears
- [ ] Check-out button updates record
- [ ] Working hours calculated correctly
- [ ] Day type displayed (Full/Half/etc.)
- [ ] Stats show correct counts

### Leave Page
- [ ] **As Employee**:
  - [ ] Displays own leave requests
  - [ ] "Apply for Leave" button visible
  - [ ] Apply leave modal submits successfully
  - [ ] New leave appears in list with PENDING status
  - [ ] Leave stats show correct counts
- [ ] **As Admin**:
  - [ ] Displays all leave requests with employee names
  - [ ] No "Apply for Leave" button
  - [ ] Approve button changes status to APPROVED
  - [ ] Reject button changes status to REJECTED
  - [ ] Buttons disappear after action

### Payslips Page
- [ ] **As Employee**:
  - [ ] Displays own payslips
  - [ ] No "Generate Payslip" button
  - [ ] Click payslip navigates to print view
- [ ] **As Admin**:
  - [ ] Displays all payslips with employee names
  - [ ] "Generate Payslip" button visible
  - [ ] Generate form has employee dropdown populated
  - [ ] Generate form calculates net salary correctly
  - [ ] New payslip appears in list
  - [ ] Print payslip shows correct formatting

### Settings Page
- [ ] Profile form loads current user data
- [ ] Name, email, position fields are disabled
- [ ] Bio field is editable
- [ ] Save changes updates profile
- [ ] Success message appears
- [ ] Change password button opens modal
- [ ] Change password with wrong current password fails
- [ ] Change password with correct current password succeeds

### Print Payslip Page
- [ ] Navigate to `/print/payslips/:id`
- [ ] Payslip data fetched from API
- [ ] All fields displayed correctly
- [ ] Print button triggers browser print

---

## Phase 3: Role-Based Access Testing

### Protected Routes
- [ ] Access `/dashboard` without login redirects to `/login`
- [ ] Access any protected page without token redirects to `/login`

### Admin-Only Features
- [ ] Employee CRUD operations only accessible to admin
- [ ] Generate payslip only visible to admin
- [ ] Approve/reject leave only visible to admin
- [ ] "Employees" nav item only visible to admin

### Employee-Only Features
- [ ] Check-in/check-out only accessible to employees
- [ ] Apply for leave only accessible to employees

---

## Phase 4: Error Handling

### Network Errors
- [ ] Stop backend server
- [ ] Try any operation from frontend
- [ ] Verify error toast appears
- [ ] Verify 401 redirects to login

### Validation Errors
- [ ] Submit empty form fields
- [ ] Verify validation messages
- [ ] Submit invalid email format
- [ ] Submit password < 6 characters

### Edge Cases
- [ ] Check-in twice on same day (should fail)
- [ ] Check-out without check-in (should fail)
- [ ] Create employee with existing email (should fail)
- [ ] Generate duplicate payslip (should fail)
- [ ] Approve already approved leave (should fail)

---

## Phase 5: UI/UX Validation

### Responsive Design
- [ ] Test on mobile viewport (375px)
- [ ] Test on tablet viewport (768px)
- [ ] Test on desktop viewport (1920px)
- [ ] Mobile sidebar works correctly
- [ ] Forms are usable on small screens

### Loading States
- [ ] All async operations show loading indicators
- [ ] Buttons disable during submission
- [ ] Loading spinners appear appropriately

### Toast Notifications
- [ ] Success messages appear for successful operations
- [ ] Error messages appear for failed operations
- [ ] Toast messages are clear and descriptive

### Form Validation
- [ ] Required fields marked properly
- [ ] Date inputs have proper constraints
- [ ] Number inputs accept only numbers
- [ ] Email inputs validate format

---

## Phase 6: Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

---

## Phase 7: Performance Testing

- [ ] Page load time < 2 seconds
- [ ] API response time < 500ms
- [ ] No memory leaks in browser
- [ ] No excessive re-renders

---

## Verification Complete ✓

Once all items are checked:
- [ ] Application is ready for production
- [ ] All features work as expected
- [ ] No console errors or warnings
- [ ] Documentation is complete
