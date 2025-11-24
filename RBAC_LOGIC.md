# HỆ THỐNG PHÂN QUYỀN - ROLE-BASED ACCESS CONTROL (RBAC)

## 📋 MỤC LỤC
1. [Tổng quan hệ thống](#tổng-quan)
2. [Role: MANAGER](#role-manager)
3. [Role: ACCOUNTANT](#role-accountant)
4. [Role: ADMIN](#role-admin)
5. [API Endpoints](#api-endpoints)
6. [Data Models](#data-models)

---

## 🎯 TỔNG QUAN HỆ THỐNG

### Các Role trong hệ thống:
```
┌─────────────────────────────────────┐
│         ADMIN (Full Access)         │
│  - Quản lý toàn bộ hệ thống         │
│  - Xem/sửa tất cả dữ liệu           │
└─────────────────────────────────────┘
              ▲
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼────────┐    ┌────▼────────────┐
│  MANAGER   │    │   ACCOUNTANT    │
│  (Team)    │    │   (Finance)     │
└────────────┘    └─────────────────┘
```

### Thông tin Login:
```javascript
// Admin
{
  email: "admin@company.com",
  password: "admin123",
  role: "admin",
  info: null // Admin không có department cụ thể
}

// Manager
{
  email: "manager@company.com",
  password: "manager123",
  role: "manager",
  info: {
    name: "Nguyễn Văn Quản Lý",
    department: "IT" // Manager của phòng IT
  }
}

// Accountant
{
  email: "accountant@company.com",
  password: "accountant123",
  role: "accountant",
  info: {
    name: "Lê Thị Kế Toán",
    department: "Finance"
  }
}
```

---

## 👨‍💼 ROLE: MANAGER

### 1. THÔNG TIN CƠ BẢN

**Mục đích:** Quản lý công việc và nhân viên trong phòng ban của mình

**Scope:**
- Department-specific (chỉ phòng ban của manager)
- Không xem được dữ liệu của phòng ban khác

**Department trong hệ thống:**
- IT
- Human Resources
- Marketing
- Finance
- Sales

---

### 2. QUYỀN HẠN CHI TIẾT

#### 2.1. QUẢN LÝ NHÂN VIÊN

**✅ CÓ QUYỀN:**
- ✅ Xem danh sách nhân viên trong phòng ban
- ✅ Xem chi tiết profile nhân viên (KHÔNG BAO GỒM lương)
- ✅ Xem thông tin liên hệ, học vấn, hợp đồng

**❌ KHÔNG CÓ QUYỀN:**
- ❌ Thêm/sửa/xóa nhân viên
- ❌ Xem thông tin lương (salary, bonus)
- ❌ Xem thông tin ngân hàng
- ❌ Xem nhân viên phòng ban khác

**Backend Logic:**
```javascript
// API: GET /api/employees
// Query params: { department: string }

function getEmployees(userId, params) {
  const user = getUserById(userId);

  if (user.role === 'manager') {
    // Manager chỉ xem nhân viên trong phòng
    return Employee.find({
      department: user.department
    }).select('-salary -bankAccount -bankName -bankBranch');
    // Exclude sensitive fields
  }
}
```

---

#### 2.2. QUẢN LÝ CÔNG VIỆC (TASK MANAGEMENT)

**✅ CÓ QUYỀN:**
- ✅ Tạo task mới
- ✅ Giao task cho nhân viên trong phòng
- ✅ Xem tasks của phòng mình
- ✅ Sửa/xóa tasks của phòng mình
- ✅ Tạo events trên timeline
- ✅ Xem analytics của phòng

**❌ KHÔNG CÓ QUYỀN:**
- ❌ Giao task cho nhân viên phòng khác
- ❌ Xem tasks của phòng khác
- ❌ Xem tổng thể analytics toàn công ty

**Backend Logic:**
```javascript
// API: POST /api/tasks
function createTask(userId, taskData) {
  const user = getUserById(userId);
  const assignee = getEmployeeById(taskData.assigneeId);

  if (user.role === 'manager') {
    // Check if assignee is in manager's department
    if (assignee.department !== user.department) {
      throw new Error('Cannot assign task to employee outside your department');
    }
  }

  return Task.create({
    ...taskData,
    createdBy: userId,
    department: user.department
  });
}

// API: GET /api/tasks
function getTasks(userId) {
  const user = getUserById(userId);

  if (user.role === 'manager') {
    // Only return tasks for manager's department
    return Task.find({ department: user.department });
  }
}
```

**Validation Rules:**
```javascript
// Khi tạo/sửa task
{
  title: { required: true, maxLength: 200 },
  description: { maxLength: 1000 },
  assigneeId: {
    required: true,
    validate: (value) => {
      const assignee = Employee.findById(value);
      return assignee.department === currentUser.department;
    }
  },
  status: {
    enum: ['new', 'in-progress', 'pending', 'complete']
  },
  priority: {
    enum: ['low', 'medium', 'high']
  },
  startDate: { type: Date },
  endDate: { type: Date, mustBeAfter: 'startDate' }
}
```

---

#### 2.3. DASHBOARD & ANALYTICS

**✅ CÓ QUYỀN:**
- ✅ Xem dashboard phòng ban
- ✅ Thống kê nhân viên phòng
- ✅ Thống kê tasks phòng
- ✅ Chart hiệu suất phòng

**❌ KHÔNG CÓ QUYỀN:**
- ❌ Xem dashboard toàn công ty
- ❌ Xem so sánh giữa các phòng ban

**API Response Example:**
```json
{
  "department": "IT",
  "stats": {
    "totalEmployees": 5,
    "activeTasks": 12,
    "completedTasks": 8,
    "pendingTasks": 4,
    "averagePerformance": 85.5
  },
  "tasksByStatus": {
    "new": 3,
    "in-progress": 5,
    "pending": 4,
    "complete": 8
  },
  "tasksByPriority": {
    "low": 2,
    "medium": 10,
    "high": 8
  }
}
```

---

#### 2.4. BÁO CÁO (REPORTS)

**✅ CÓ QUYỀN:**
- ✅ Xuất báo cáo nhân viên phòng (KHÔNG có lương)
- ✅ Xuất báo cáo tasks phòng
- ✅ Xuất báo cáo hiệu suất phòng

**❌ KHÔNG CÓ QUYỀN:**
- ❌ Xuất báo cáo lương
- ❌ Xuất báo cáo tài chính

---

## 💰 ROLE: ACCOUNTANT

### 1. THÔNG TIN CƠ BẢN

**Mục đích:** Quản lý tài chính, lương, và báo cáo tài chính

**Scope:**
- Finance-wide (toàn bộ dữ liệu tài chính)
- Không quản lý tasks/nhân viên

**Department:** Finance

---

### 2. QUYỀN HẠN CHI TIẾT

#### 2.1. QUẢN LÝ NHÂN VIÊN

**✅ CÓ QUYỀN:**
- ✅ Xem danh sách TẤT CẢ nhân viên
- ✅ Xem thông tin cơ bản (name, department, position)

**❌ KHÔNG CÓ QUYỀN:**
- ❌ Thêm/sửa/xóa nhân viên
- ❌ Xem thông tin chi tiết cá nhân (address, ID card, etc.)
- ❌ Xem thông tin liên hệ khẩn cấp

**Backend Logic:**
```javascript
// API: GET /api/employees
function getEmployees(userId) {
  const user = getUserById(userId);

  if (user.role === 'accountant') {
    // Accountant xem basic info only
    return Employee.find({})
      .select('id name email department position status');
  }
}
```

---

#### 2.2. QUẢN LÝ LƯƠNG (PAYROLL) ⭐ CHÍNH

**✅ CÓ QUYỀN:**
- ✅ Xem TẤT CẢ bảng lương
- ✅ Tạo bảng lương cho nhân viên
- ✅ Sửa bảng lương (lương cơ bản, phụ cấp, thưởng)
- ✅ Xóa bảng lương
- ✅ Tính toán lương tự động
- ✅ Tính thuế TNCN
- ✅ Tính bảo hiểm (BHXH, BHYT, BHTN)
- ✅ Xuất báo cáo lương

**❌ KHÔNG CÓ QUYỀN:**
- ❌ Sửa thông tin nhân viên cơ bản (salary field trong employee)

**Backend Logic:**
```javascript
// Payroll Model
{
  id: String,
  employeeId: String,
  employeeName: String,
  department: String,
  position: String,
  month: Number, // 1-12
  year: Number,

  // Salary components
  baseSalary: Number, // Lương cơ bản
  allowances: {
    transport: Number, // Phụ cấp đi lại
    meal: Number,      // Phụ cấp ăn trưa
    phone: Number,     // Phụ cấp điện thoại
    housing: Number,   // Phụ cấp nhà ở
    other: Number      // Phụ cấp khác
  },
  bonus: Number,       // Thưởng
  overtimePay: Number, // Lương làm thêm

  // Deductions
  insurance: {
    social: Number,    // BHXH (8%)
    health: Number,    // BHYT (1.5%)
    unemployment: Number // BHTN (1%)
  },
  taxableIncome: Number, // Thu nhập tính thuế
  personalDeduction: Number, // Giảm trừ bản thân (11 triệu)
  dependentDeduction: Number, // Giảm trừ người phụ thuộc (4.4 triệu/người)
  tax: Number,         // Thuế TNCN
  otherDeductions: Number, // Khấu trừ khác

  // Final
  totalIncome: Number,  // Tổng thu nhập
  totalDeductions: Number, // Tổng khấu trừ
  netSalary: Number,   // Lương thực nhận

  status: String,      // 'draft', 'approved', 'paid'
  paymentDate: Date,
  notes: String,

  createdBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

**API: POST /api/payroll/calculate**
```javascript
function calculatePayroll(employeeId, month, year) {
  const employee = Employee.findById(employeeId);
  const existingPayroll = Payroll.findOne({ employeeId, month, year });

  if (existingPayroll) {
    throw new Error('Payroll already exists for this period');
  }

  // Calculate total income
  const totalIncome = employee.salary +
                     allowances.transport +
                     allowances.meal +
                     allowances.phone +
                     allowances.housing +
                     allowances.other +
                     bonus +
                     overtimePay;

  // Calculate insurance (10.5% of base salary)
  const socialInsurance = employee.salary * 0.08;  // 8%
  const healthInsurance = employee.salary * 0.015; // 1.5%
  const unemploymentInsurance = employee.salary * 0.01; // 1%
  const totalInsurance = socialInsurance + healthInsurance + unemploymentInsurance;

  // Calculate taxable income
  const taxableIncome = totalIncome - totalInsurance - personalDeduction - dependentDeduction;

  // Calculate tax (progressive)
  const tax = calculateProgressiveTax(taxableIncome);

  // Calculate net salary
  const netSalary = totalIncome - totalInsurance - tax - otherDeductions;

  return Payroll.create({
    employeeId,
    month,
    year,
    baseSalary: employee.salary,
    allowances,
    bonus,
    overtimePay,
    insurance: {
      social: socialInsurance,
      health: healthInsurance,
      unemployment: unemploymentInsurance
    },
    taxableIncome,
    tax,
    totalIncome,
    totalDeductions: totalInsurance + tax + otherDeductions,
    netSalary,
    status: 'draft'
  });
}

// Thuế TNCN lũy tiến từng phần
function calculateProgressiveTax(taxableIncome) {
  if (taxableIncome <= 0) return 0;

  let tax = 0;
  const brackets = [
    { limit: 5000000, rate: 0.05 },   // 5%
    { limit: 10000000, rate: 0.10 },  // 10%
    { limit: 18000000, rate: 0.15 },  // 15%
    { limit: 32000000, rate: 0.20 },  // 20%
    { limit: 52000000, rate: 0.25 },  // 25%
    { limit: 80000000, rate: 0.30 },  // 30%
    { limit: Infinity, rate: 0.35 }   // 35%
  ];

  let remaining = taxableIncome;
  let previousLimit = 0;

  for (const bracket of brackets) {
    const bracketAmount = Math.min(remaining, bracket.limit - previousLimit);
    if (bracketAmount <= 0) break;

    tax += bracketAmount * bracket.rate;
    remaining -= bracketAmount;
    previousLimit = bracket.limit;
  }

  return tax;
}
```

**API: GET /api/payroll**
```javascript
// Query params: { month?, year?, department?, employeeId?, status? }
function getPayrollRecords(userId, params) {
  const user = getUserById(userId);

  if (user.role !== 'accountant' && user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const query = {};
  if (params.month) query.month = params.month;
  if (params.year) query.year = params.year;
  if (params.department) query.department = params.department;
  if (params.employeeId) query.employeeId = params.employeeId;
  if (params.status) query.status = params.status;

  return Payroll.find(query)
    .populate('employeeId', 'name email department position')
    .sort({ year: -1, month: -1 });
}
```

**API: PUT /api/payroll/:id**
```javascript
function updatePayroll(userId, payrollId, updateData) {
  const user = getUserById(userId);
  const payroll = Payroll.findById(payrollId);

  if (user.role !== 'accountant' && user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  if (payroll.status === 'paid') {
    throw new Error('Cannot update paid payroll');
  }

  // Recalculate if salary components changed
  if (updateData.baseSalary || updateData.allowances || updateData.bonus) {
    const recalculated = calculatePayroll(
      payroll.employeeId,
      payroll.month,
      payroll.year
    );
    updateData = { ...updateData, ...recalculated };
  }

  return Payroll.findByIdAndUpdate(payrollId, updateData, { new: true });
}
```

---

#### 2.3. QUẢN LÝ BENEFITS (PHỤ CẤP)

**✅ CÓ QUYỀN:**
- ✅ Xem danh sách phụ cấp của TẤT CẢ nhân viên
- ✅ Cập nhật phụ cấp (transport, meal, phone, housing)
- ✅ Xem lịch sử thay đổi phụ cấp

**❌ KHÔNG CÓ QUYỀN:**
- ❌ Sửa lương cơ bản (phải thông qua Admin)

**Backend Logic:**
```javascript
// API: PUT /api/employees/:id/benefits
function updateEmployeeBenefits(userId, employeeId, benefits) {
  const user = getUserById(userId);

  if (user.role !== 'accountant' && user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  // Log change history
  BenefitHistory.create({
    employeeId,
    changes: benefits,
    changedBy: userId,
    changedAt: new Date()
  });

  return Employee.findByIdAndUpdate(
    employeeId,
    { allowances: benefits },
    { new: true }
  );
}
```

---

#### 2.4. BÁO CÁO TÀI CHÍNH

**✅ CÓ QUYỀN:**
- ✅ Xuất báo cáo lương theo tháng
- ✅ Xuất báo cáo lương theo phòng ban
- ✅ Xuất báo cáo thuế TNCN
- ✅ Xuất báo cáo bảo hiểm
- ✅ Xuất tổng hợp chi phí nhân sự

**API: GET /api/reports/payroll**
```javascript
function getPayrollReport(userId, params) {
  const { month, year, department, format } = params;

  const payrolls = Payroll.find({ month, year, department });

  const report = {
    period: { month, year },
    department,
    summary: {
      totalEmployees: payrolls.length,
      totalBaseSalary: sum(payrolls, 'baseSalary'),
      totalAllowances: sum(payrolls, 'allowances'),
      totalBonus: sum(payrolls, 'bonus'),
      totalInsurance: sum(payrolls, 'insurance'),
      totalTax: sum(payrolls, 'tax'),
      totalNetSalary: sum(payrolls, 'netSalary')
    },
    details: payrolls.map(p => ({
      employeeId: p.employeeId,
      employeeName: p.employeeName,
      department: p.department,
      baseSalary: p.baseSalary,
      totalIncome: p.totalIncome,
      totalDeductions: p.totalDeductions,
      netSalary: p.netSalary
    }))
  };

  // Export to Excel/PDF based on format
  if (format === 'excel') {
    return exportToExcel(report);
  } else if (format === 'pdf') {
    return exportToPDF(report);
  }

  return report;
}
```

---

#### 2.5. TASK MANAGEMENT

**✅ CÓ QUYỀN:**
- ✅ Xem tasks được giao cho mình
- ✅ Cập nhật trạng thái tasks của mình

**❌ KHÔNG CÓ QUYỀN:**
- ❌ Tạo tasks
- ❌ Giao tasks cho người khác
- ❌ Xem tasks của người khác (trừ khi được giao)

---

## 👑 ROLE: ADMIN

### 1. THÔNG TIN CƠ BẢN

**Mục đích:** Quản lý toàn bộ hệ thống

**Scope:** Full access (toàn bộ hệ thống)

**Department:** None (không thuộc phòng ban cụ thể)

---

### 2. QUYỀN HẠN CHI TIẾT

#### 2.1. QUẢN LÝ NHÂN VIÊN (FULL ACCESS)

**✅ CÓ QUYỀN:**
- ✅ Xem TẤT CẢ nhân viên
- ✅ Thêm nhân viên mới
- ✅ Sửa thông tin nhân viên (bao gồm salary)
- ✅ Xóa nhân viên
- ✅ Xem TẤT CẢ thông tin (kể cả lương, ngân hàng)
- ✅ Quản lý accounts (reset password, change role)

**Backend Logic:**
```javascript
// API: POST /api/employees
function createEmployee(userId, employeeData) {
  const user = getUserById(userId);

  if (user.role !== 'admin') {
    throw new Error('Only admin can create employees');
  }

  // Validate email unique
  const existing = Employee.findOne({ email: employeeData.email });
  if (existing) {
    throw new Error('Email already exists');
  }

  // Create employee
  const employee = Employee.create({
    ...employeeData,
    createdBy: userId,
    createdAt: new Date()
  });

  // Create user account
  const account = User.create({
    email: employeeData.email,
    password: hashPassword(employeeData.password || 'default123'),
    role: employeeData.role || 'employee',
    employeeId: employee.id
  });

  return employee;
}

// API: PUT /api/employees/:id
function updateEmployee(userId, employeeId, updateData) {
  const user = getUserById(userId);

  if (user.role !== 'admin') {
    throw new Error('Only admin can update employees');
  }

  // Allow updating all fields including salary
  return Employee.findByIdAndUpdate(employeeId, updateData, { new: true });
}

// API: DELETE /api/employees/:id
function deleteEmployee(userId, employeeId) {
  const user = getUserById(userId);

  if (user.role !== 'admin') {
    throw new Error('Only admin can delete employees');
  }

  // Soft delete (set status to inactive)
  return Employee.findByIdAndUpdate(
    employeeId,
    { status: 'inactive', deletedAt: new Date() },
    { new: true }
  );
}
```

**Validation Rules:**
```javascript
{
  name: { required: true, minLength: 3, maxLength: 100 },
  email: { required: true, format: 'email', unique: true },
  phone: { format: 'phone', length: 10 },
  position: { required: true },
  department: {
    required: true,
    enum: ['IT', 'Human Resources', 'Marketing', 'Finance', 'Sales']
  },
  salary: { required: true, min: 0, max: 1000000000 },
  hireDate: { required: true, type: Date },
  dateOfBirth: { type: Date, mustBeBefore: 'today' },
  idCard: { unique: true, length: 12 },
  status: { enum: ['active', 'inactive', 'on_leave'] }
}
```

---

#### 2.2. QUẢN LÝ CÔNG VIỆC (FULL ACCESS)

**✅ CÓ QUYỀN:**
- ✅ Xem TẤT CẢ tasks (mọi phòng ban)
- ✅ Tạo tasks và giao cho BẤT KỲ ai
- ✅ Sửa/xóa BẤT KỲ tasks nào
- ✅ Xem analytics toàn công ty
- ✅ Tạo events cross-department

**Backend Logic:**
```javascript
// API: GET /api/tasks
function getTasks(userId) {
  const user = getUserById(userId);

  if (user.role === 'admin') {
    // Admin sees all tasks
    return Task.find({});
  }
}

// API: POST /api/tasks
function createTask(userId, taskData) {
  const user = getUserById(userId);

  if (user.role === 'admin') {
    // Admin can assign to anyone
    return Task.create({
      ...taskData,
      createdBy: userId
    });
  }
}
```

---

#### 2.3. QUẢN LÝ LƯƠNG (FULL ACCESS)

**✅ CÓ QUYỀN:**
- ✅ TẤT CẢ quyền của Accountant
- ✅ Approve/reject payroll
- ✅ Sửa salary cơ bản của nhân viên
- ✅ Override calculations
- ✅ Mark payroll as paid

**Backend Logic:**
```javascript
// API: POST /api/payroll/:id/approve
function approvePayroll(userId, payrollId) {
  const user = getUserById(userId);

  if (user.role !== 'admin') {
    throw new Error('Only admin can approve payroll');
  }

  return Payroll.findByIdAndUpdate(
    payrollId,
    {
      status: 'approved',
      approvedBy: userId,
      approvedAt: new Date()
    },
    { new: true }
  );
}

// API: POST /api/payroll/:id/mark-paid
function markPayrollAsPaid(userId, payrollId, paymentData) {
  const user = getUserById(userId);

  if (user.role !== 'admin') {
    throw new Error('Only admin can mark as paid');
  }

  return Payroll.findByIdAndUpdate(
    payrollId,
    {
      status: 'paid',
      paymentDate: paymentData.paymentDate,
      paymentMethod: paymentData.paymentMethod,
      paymentReference: paymentData.reference
    },
    { new: true }
  );
}
```

---

#### 2.4. SETTINGS & CONFIGURATION

**✅ CÓ QUYỀN:**
- ✅ Quản lý user accounts
- ✅ Cấu hình hệ thống
- ✅ Quản lý roles & permissions
- ✅ Xem audit logs
- ✅ Backup/restore data

**Backend Logic:**
```javascript
// API: GET /api/audit-logs
function getAuditLogs(userId, params) {
  const user = getUserById(userId);

  if (user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  return AuditLog.find(params)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(100);
}

// API: POST /api/users/:id/reset-password
function resetUserPassword(userId, targetUserId) {
  const user = getUserById(userId);

  if (user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const newPassword = generateRandomPassword();
  User.findByIdAndUpdate(targetUserId, {
    password: hashPassword(newPassword),
    mustChangePassword: true
  });

  // Send email with new password
  sendPasswordResetEmail(targetUserId, newPassword);

  return { success: true };
}
```

---

#### 2.5. REPORTS & ANALYTICS (FULL ACCESS)

**✅ CÓ QUYỀN:**
- ✅ TẤT CẢ báo cáo
- ✅ Dashboard toàn công ty
- ✅ So sánh giữa các phòng ban
- ✅ Trends & forecasting

---

## 🔌 API ENDPOINTS SUMMARY

### Authentication
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/change-password
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Employees
```
GET    /api/employees              // List employees (filtered by role)
GET    /api/employees/:id          // Get employee details (filtered by role)
POST   /api/employees              // Create employee (admin only)
PUT    /api/employees/:id          // Update employee (admin only)
DELETE /api/employees/:id          // Delete employee (admin only)
PUT    /api/employees/:id/benefits // Update benefits (accountant, admin)
```

### Tasks
```
GET    /api/tasks                  // List tasks (filtered by role)
GET    /api/tasks/:id              // Get task details
POST   /api/tasks                  // Create task (admin, manager)
PUT    /api/tasks/:id              // Update task (admin, manager)
DELETE /api/tasks/:id              // Delete task (admin, manager)
GET    /api/tasks/analytics        // Get task analytics (filtered)
```

### Payroll
```
GET    /api/payroll                // List payroll records (accountant, admin)
GET    /api/payroll/:id            // Get payroll details
POST   /api/payroll/calculate      // Calculate payroll (accountant, admin)
POST   /api/payroll/generate-all   // Generate for all employees (accountant, admin)
PUT    /api/payroll/:id            // Update payroll (accountant, admin)
DELETE /api/payroll/:id            // Delete payroll (admin only)
POST   /api/payroll/:id/approve    // Approve payroll (admin only)
POST   /api/payroll/:id/mark-paid  // Mark as paid (admin only)
```

### Reports
```
GET    /api/reports/payroll        // Payroll report (accountant, admin)
GET    /api/reports/employees      // Employee report (filtered by role)
GET    /api/reports/tasks          // Task report (filtered by role)
GET    /api/reports/financial      // Financial report (accountant, admin)
POST   /api/reports/export         // Export report (format: excel/pdf)
```

### Dashboard
```
GET    /api/dashboard/stats        // Get dashboard statistics (filtered by role)
GET    /api/dashboard/charts       // Get chart data (filtered by role)
```

---

## 📊 DATA MODELS

### User Model
```javascript
{
  id: String (UUID),
  email: String (unique, required),
  password: String (hashed, required),
  role: Enum ['admin', 'manager', 'accountant', 'employee'],
  employeeId: String (foreign key),
  isActive: Boolean,
  mustChangePassword: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Employee Model
```javascript
{
  id: String (UUID),
  name: String (required),
  email: String (unique, required),
  phone: String,
  position: String (required),
  department: Enum (required),
  status: Enum ['active', 'inactive', 'on_leave'],

  // Salary
  salary: Number (required),
  allowances: {
    transport: Number,
    meal: Number,
    phone: Number,
    housing: Number,
    other: Number
  },

  // Personal info
  dateOfBirth: Date,
  gender: String,
  nationality: String,
  idCard: String (unique),
  idCardIssueDate: Date,
  idCardIssuePlace: String,
  address: String,
  maritalStatus: String,

  // Employment
  hireDate: Date,
  employeeType: String,
  contractType: String,
  manager: String,
  workLocation: String,

  // Education
  education: String,
  educationDetails: String,

  // Emergency contact
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },

  // Bank
  bankAccount: String,
  bankName: String,
  bankBranch: String,

  // Meta
  avatar: String (URL),
  createdBy: String,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date
}
```

### Task Model
```javascript
{
  id: String (UUID),
  title: String (required),
  description: String,
  status: Enum ['new', 'in-progress', 'pending', 'complete'],
  priority: Enum ['low', 'medium', 'high'],
  assigneeId: String (foreign key, required),
  department: String,
  startDate: Date,
  endDate: Date,
  createdBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Payroll Model
```javascript
{
  id: String (UUID),
  employeeId: String (foreign key, required),
  employeeName: String,
  department: String,
  position: String,
  month: Number (1-12),
  year: Number,

  // Income
  baseSalary: Number,
  allowances: Object,
  bonus: Number,
  overtimePay: Number,
  totalIncome: Number,

  // Deductions
  insurance: Object,
  taxableIncome: Number,
  personalDeduction: Number,
  dependentDeduction: Number,
  tax: Number,
  otherDeductions: Number,
  totalDeductions: Number,

  // Final
  netSalary: Number,

  // Status
  status: Enum ['draft', 'approved', 'paid'],
  approvedBy: String,
  approvedAt: Date,
  paymentDate: Date,
  paymentMethod: String,
  paymentReference: String,

  notes: String,
  createdBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 MIDDLEWARE & SECURITY

### Role-Based Access Control Middleware
```javascript
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user; // From JWT token

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}

// Usage
app.get('/api/employees',
  authenticate,
  requireRole('admin', 'manager', 'accountant'),
  getEmployees
);

app.post('/api/employees',
  authenticate,
  requireRole('admin'),
  createEmployee
);
```

### Department-Based Filter Middleware
```javascript
function filterByDepartment(req, res, next) {
  const user = req.user;

  if (user.role === 'manager') {
    // Add department filter to query
    req.query.department = user.department;
  }

  next();
}
```

---

## ✅ CHECKLIST IMPLEMENTATION

### Backend Tasks:
- [ ] Implement User authentication (JWT)
- [ ] Implement Role-based middleware
- [ ] Implement Employee CRUD (với phân quyền)
- [ ] Implement Task CRUD (với phân quyền)
- [ ] Implement Payroll calculation logic
- [ ] Implement Payroll CRUD
- [ ] Implement Tax calculation (progressive)
- [ ] Implement Reports generation
- [ ] Implement Audit logging
- [ ] Implement Data validation
- [ ] Write unit tests
- [ ] Write integration tests

### Frontend Tasks:
- [x] Implement Login page
- [x] Implement Role-based routing
- [x] Implement Employee management (với phân quyền UI)
- [x] Implement Task management (với phân quyền UI)
- [x] Implement Payroll management
- [x] Implement Dashboard (filtered by role)
- [ ] Implement Reports pages
- [ ] Implement Settings pages

---

**📝 LƯU Ý CHO BACKEND DEVELOPER:**

1. **Luôn validate role** trước khi cho phép thao tác
2. **Filter data** theo role khi trả về API
3. **Log tất cả actions** nhạy cảm (salary changes, deletions, etc.)
4. **Encrypt sensitive data** (salary, bank info)
5. **Implement rate limiting** để tránh brute force
6. **Validate input** nghiêm ngặt
7. **Use transactions** khi cập nhật nhiều bảng
8. **Soft delete** thay vì hard delete
9. **Cache frequently accessed data**
10. **Implement pagination** cho list APIs

---

## 🔄 CHI TIẾT LOGIC XỬ LÝ THEO TỪNG CHỨC NĂNG

### 1. SIDEBAR NAVIGATION - PHÂN QUYỀN MENU

```javascript
// Cấu hình menu theo role
const menuConfig = {
  admin: [
    { path: '/dashboard', icon: 'Dashboard', label: 'Tổng quan' },
    { path: '/employees', icon: 'People', label: 'Nhân viên' },
    { path: '/tasks', icon: 'Assignment', label: 'Công việc' },
    { path: '/payroll', icon: 'Payment', label: 'Bảng lương' },
    { path: '/reports', icon: 'Assessment', label: 'Báo cáo' },
    { path: '/settings', icon: 'Settings', label: 'Cài đặt' }
  ],
  manager: [
    { path: '/dashboard', icon: 'Dashboard', label: 'Tổng quan' },
    { path: '/employees', icon: 'People', label: 'Nhân viên phòng' },
    { path: '/tasks', icon: 'Assignment', label: 'Công việc' },
    { path: '/reports', icon: 'Assessment', label: 'Báo cáo' }
  ],
  accountant: [
    { path: '/dashboard', icon: 'Dashboard', label: 'Tổng quan' },
    { path: '/employees', icon: 'People', label: 'Nhân viên' },
    { path: '/payroll', icon: 'Payment', label: 'Bảng lương' },
    { path: '/reports', icon: 'Assessment', label: 'Báo cáo' }
  ]
};

// Component Sidebar
function Sidebar({ userRole }) {
  const menuItems = menuConfig[userRole] || [];
  return menuItems.map(item => <MenuItem key={item.path} {...item} />);
}
```

---

### 2. EMPLOYEE LIST - LOGIC HIỂN THỊ

#### 2.1. Admin - Full Access
```javascript
// Admin xem TẤT CẢ nhân viên với TẤT CẢ thông tin
function getEmployeesForAdmin() {
  return {
    columns: [
      'id', 'avatar', 'name', 'email', 'phone',
      'department', 'position', 'salary', // ✅ Có salary
      'status', 'hireDate', 'actions'
    ],
    actions: ['view', 'edit', 'delete'], // ✅ Full CRUD
    filters: ['department', 'status', 'position'],
    canExport: true,
    canImport: true,
    canAddNew: true
  };
}
```

#### 2.2. Manager - Department Only, No Salary
```javascript
// Manager chỉ xem nhân viên trong phòng, KHÔNG có salary
function getEmployeesForManager(managerDepartment) {
  return {
    columns: [
      'id', 'avatar', 'name', 'email', 'phone',
      'position', // ❌ Không có department (vì cùng phòng)
      // ❌ Không có salary
      'status', 'hireDate'
    ],
    actions: ['view'], // ❌ Chỉ xem, không edit/delete
    filters: ['status', 'position'],
    canExport: true, // Có thể export (không có salary)
    canImport: false,
    canAddNew: false,
    dataFilter: { department: managerDepartment } // Auto filter
  };
}
```

#### 2.3. Accountant - All Employees, Basic Info
```javascript
// Accountant xem tất cả nhân viên, chỉ basic info để tính lương
function getEmployeesForAccountant() {
  return {
    columns: [
      'id', 'name', 'email',
      'department', 'position',
      'salary', // ✅ Có salary (để tính lương)
      'status'
      // ❌ Không có thông tin cá nhân chi tiết
    ],
    actions: ['view', 'edit-benefits'], // Chỉ sửa được benefits
    filters: ['department', 'status'],
    canExport: true,
    canImport: false,
    canAddNew: false
  };
}
```

---

### 3. EMPLOYEE DETAIL - LOGIC HIỂN THỊ TABS

```javascript
// Cấu hình tabs theo role
const employeeDetailTabs = {
  admin: [
    'overview',      // Thông tin tổng quan
    'personal',      // Thông tin cá nhân
    'employment',    // Thông tin công việc
    'salary',        // ✅ Thông tin lương
    'bank',          // ✅ Thông tin ngân hàng
    'documents',     // Tài liệu
    'history'        // Lịch sử thay đổi
  ],
  manager: [
    'overview',      // Thông tin tổng quan
    'personal',      // Thông tin cá nhân (read-only)
    'employment',    // Thông tin công việc
    // ❌ Không có tab salary
    // ❌ Không có tab bank
    'documents'      // Tài liệu (read-only)
  ],
  accountant: [
    'overview',      // Thông tin cơ bản
    'salary',        // ✅ Thông tin lương
    'bank',          // ✅ Thông tin ngân hàng
    'benefits'       // ✅ Phụ cấp (có thể edit)
    // ❌ Không có personal details
  ]
};

// Component hiển thị theo role
function EmployeeDetail({ employee, userRole }) {
  const visibleTabs = employeeDetailTabs[userRole];
  const canEdit = userRole === 'admin';
  const canEditBenefits = ['admin', 'accountant'].includes(userRole);

  return (
    <Tabs>
      {visibleTabs.map(tab => (
        <Tab key={tab}
             editable={canEdit || (tab === 'benefits' && canEditBenefits)}>
          {renderTabContent(tab, employee)}
        </Tab>
      ))}
    </Tabs>
  );
}
```

---

### 4. TASK MANAGEMENT - LOGIC CHI TIẾT

#### 4.1. Admin - Cross-Department
```javascript
// Admin có thể:
const adminTaskPermissions = {
  // Xem tất cả tasks
  viewAll: true,

  // Tạo task và giao cho BẤT KỲ ai
  create: {
    enabled: true,
    assigneeFilter: null // Không giới hạn
  },

  // Sửa/xóa BẤT KỲ task nào
  edit: { enabled: true, scope: 'all' },
  delete: { enabled: true, scope: 'all' },

  // Xem analytics toàn công ty
  analytics: { scope: 'company-wide' }
};

// API call cho Admin
async function getTasksForAdmin(filters) {
  // Không filter theo department
  return await api.get('/tasks', { params: filters });
}

async function createTaskAsAdmin(taskData) {
  // Có thể giao cho bất kỳ nhân viên nào
  return await api.post('/tasks', taskData);
}
```

#### 4.2. Manager - Department Only
```javascript
// Manager chỉ có thể:
const managerTaskPermissions = {
  // Chỉ xem tasks của phòng mình
  viewAll: false,
  viewDepartment: true,

  // Chỉ giao task cho nhân viên trong phòng
  create: {
    enabled: true,
    assigneeFilter: (employee, manager) =>
      employee.department === manager.department
  },

  // Chỉ sửa/xóa tasks của phòng mình
  edit: { enabled: true, scope: 'department' },
  delete: { enabled: true, scope: 'department' },

  // Analytics chỉ cho phòng
  analytics: { scope: 'department' }
};

// Validation khi Manager tạo task
function validateManagerTaskCreation(task, manager) {
  const assignee = getEmployeeById(task.assigneeId);

  if (assignee.department !== manager.department) {
    throw new Error(
      `Không thể giao việc cho nhân viên phòng ${assignee.department}. ` +
      `Bạn chỉ có thể giao việc cho nhân viên phòng ${manager.department}.`
    );
  }

  return true;
}

// Dropdown chọn assignee cho Manager
function getAssigneeOptionsForManager(managerDepartment) {
  return employees.filter(emp =>
    emp.department === managerDepartment &&
    emp.status === 'active'
  );
}
```

#### 4.3. Accountant - View Own Tasks Only
```javascript
// Accountant KHÔNG có quyền quản lý task
const accountantTaskPermissions = {
  // Chỉ xem tasks được giao cho mình
  viewAll: false,
  viewOwn: true,

  // Không được tạo task
  create: { enabled: false },

  // Chỉ update status tasks của mình
  edit: {
    enabled: true,
    scope: 'own',
    allowedFields: ['status', 'notes'] // Chỉ update được status
  },

  delete: { enabled: false },

  analytics: { scope: 'none' }
};

// Accountant chỉ thấy Tasks được giao cho mình
async function getTasksForAccountant(accountantId) {
  return await api.get('/tasks', {
    params: { assigneeId: accountantId }
  });
}
```

---

### 5. PAYROLL MANAGEMENT - LOGIC CHI TIẾT

#### 5.1. Quyền truy cập Payroll
```javascript
const payrollPermissions = {
  admin: {
    view: 'all',
    create: true,
    edit: true,
    delete: true,
    approve: true,    // ✅ Chỉ Admin có quyền approve
    markPaid: true,   // ✅ Chỉ Admin có quyền mark as paid
    export: true
  },
  accountant: {
    view: 'all',
    create: true,
    edit: true,       // Sửa được nhưng KHÔNG được sửa đã paid
    delete: false,    // ❌ Không được xóa
    approve: false,   // ❌ Không được approve
    markPaid: false,  // ❌ Không được mark paid
    export: true
  },
  manager: {
    view: 'none',     // ❌ Không xem được payroll
    create: false,
    edit: false,
    delete: false,
    approve: false,
    markPaid: false,
    export: false
  }
};
```

#### 5.2. Payroll Workflow
```javascript
/**
 * PAYROLL WORKFLOW:
 *
 * 1. DRAFT (Nháp)
 *    - Accountant tạo/sửa bảng lương
 *    - Có thể chỉnh sửa tự do
 *
 * 2. PENDING_APPROVAL (Chờ duyệt)
 *    - Accountant submit để Admin duyệt
 *    - Không được sửa khi đang chờ duyệt
 *
 * 3. APPROVED (Đã duyệt)
 *    - Admin đã duyệt
 *    - Chờ thanh toán
 *
 * 4. PAID (Đã thanh toán)
 *    - Admin mark as paid
 *    - Không thể sửa/xóa
 */

const payrollStatuses = {
  DRAFT: 'draft',
  PENDING: 'pending_approval',
  APPROVED: 'approved',
  PAID: 'paid',
  REJECTED: 'rejected'
};

// State machine cho payroll status
const payrollTransitions = {
  draft: {
    submit: 'pending_approval',  // Accountant submit
    delete: null                 // Có thể xóa
  },
  pending_approval: {
    approve: 'approved',         // Admin approve
    reject: 'rejected',          // Admin reject
    cancel: 'draft'              // Accountant cancel
  },
  approved: {
    pay: 'paid',                 // Admin mark paid
    reject: 'draft'              // Admin có thể reject về draft
  },
  rejected: {
    edit: 'draft'                // Về lại draft để sửa
  },
  paid: {
    // Không có transition - final state
  }
};

// Kiểm tra có thể edit không
function canEditPayroll(payroll, userRole) {
  if (payroll.status === 'paid') {
    return false; // Đã paid thì không ai sửa được
  }

  if (payroll.status === 'pending_approval') {
    return false; // Đang chờ duyệt không sửa được
  }

  if (userRole === 'admin') {
    return true; // Admin sửa được mọi lúc (trừ paid)
  }

  if (userRole === 'accountant') {
    return payroll.status === 'draft' || payroll.status === 'rejected';
  }

  return false;
}
```

#### 5.3. Tính lương chi tiết
```javascript
/**
 * CÔNG THỨC TÍNH LƯƠNG:
 *
 * 1. TỔNG THU NHẬP (Gross Income):
 *    = Lương cơ bản
 *    + Phụ cấp (đi lại + ăn trưa + điện thoại + nhà ở + khác)
 *    + Thưởng
 *    + Lương làm thêm
 *
 * 2. CÁC KHOẢN KHẤU TRỪ:
 *    a) Bảo hiểm (tính trên lương cơ bản):
 *       - BHXH: 8%
 *       - BHYT: 1.5%
 *       - BHTN: 1%
 *       => Tổng BH: 10.5%
 *
 *    b) Thuế TNCN:
 *       - Thu nhập tính thuế = Gross - BH - Giảm trừ bản thân - Giảm trừ người phụ thuộc
 *       - Giảm trừ bản thân: 11,000,000 VNĐ/tháng
 *       - Giảm trừ người phụ thuộc: 4,400,000 VNĐ/người/tháng
 *       - Áp dụng thuế lũy tiến từng phần
 *
 * 3. LƯƠNG THỰC NHẬN (Net Salary):
 *    = Gross Income - Tổng BH - Thuế TNCN - Khấu trừ khác
 */

function calculateSalary(employee, payrollData) {
  // 1. Tính tổng thu nhập
  const grossIncome =
    payrollData.baseSalary +
    (payrollData.allowances?.transport || 0) +
    (payrollData.allowances?.meal || 0) +
    (payrollData.allowances?.phone || 0) +
    (payrollData.allowances?.housing || 0) +
    (payrollData.allowances?.other || 0) +
    (payrollData.bonus || 0) +
    (payrollData.overtimePay || 0);

  // 2. Tính bảo hiểm (trên lương cơ bản, tối đa 20 lần lương cơ sở)
  const insuranceBase = Math.min(payrollData.baseSalary, 29800000); // 20 x 1,490,000
  const socialInsurance = insuranceBase * 0.08;
  const healthInsurance = insuranceBase * 0.015;
  const unemploymentInsurance = Math.min(insuranceBase, 88400000) * 0.01; // Max 20 x lương tối thiểu vùng
  const totalInsurance = socialInsurance + healthInsurance + unemploymentInsurance;

  // 3. Tính thuế TNCN
  const personalDeduction = 11000000; // Giảm trừ bản thân
  const dependentDeduction = (payrollData.dependents || 0) * 4400000;
  const taxableIncome = Math.max(0,
    grossIncome - totalInsurance - personalDeduction - dependentDeduction
  );
  const tax = calculateProgressiveTax(taxableIncome);

  // 4. Tính lương thực nhận
  const otherDeductions = payrollData.otherDeductions || 0;
  const totalDeductions = totalInsurance + tax + otherDeductions;
  const netSalary = grossIncome - totalDeductions;

  return {
    grossIncome,
    insurance: {
      social: socialInsurance,
      health: healthInsurance,
      unemployment: unemploymentInsurance,
      total: totalInsurance
    },
    taxableIncome,
    personalDeduction,
    dependentDeduction,
    tax,
    otherDeductions,
    totalDeductions,
    netSalary
  };
}

// Bảng thuế TNCN lũy tiến từng phần (VNĐ/tháng)
function calculateProgressiveTax(taxableIncome) {
  if (taxableIncome <= 0) return 0;

  const brackets = [
    { limit: 5000000, rate: 0.05 },    // Đến 5 triệu: 5%
    { limit: 10000000, rate: 0.10 },   // 5-10 triệu: 10%
    { limit: 18000000, rate: 0.15 },   // 10-18 triệu: 15%
    { limit: 32000000, rate: 0.20 },   // 18-32 triệu: 20%
    { limit: 52000000, rate: 0.25 },   // 32-52 triệu: 25%
    { limit: 80000000, rate: 0.30 },   // 52-80 triệu: 30%
    { limit: Infinity, rate: 0.35 }    // Trên 80 triệu: 35%
  ];

  let tax = 0;
  let remaining = taxableIncome;
  let previousLimit = 0;

  for (const bracket of brackets) {
    const bracketAmount = Math.min(remaining, bracket.limit - previousLimit);
    if (bracketAmount <= 0) break;

    tax += bracketAmount * bracket.rate;
    remaining -= bracketAmount;
    previousLimit = bracket.limit;
  }

  return Math.round(tax);
}
```

---

### 6. DASHBOARD - LOGIC HIỂN THỊ THEO ROLE

#### 6.1. Admin Dashboard
```javascript
// Admin thấy toàn bộ thống kê công ty
const adminDashboard = {
  widgets: [
    // Row 1: Overview cards
    { type: 'stat-card', title: 'Tổng nhân viên', data: 'totalEmployees' },
    { type: 'stat-card', title: 'Tổng phòng ban', data: 'totalDepartments' },
    { type: 'stat-card', title: 'Tasks đang thực hiện', data: 'activeTasks' },
    { type: 'stat-card', title: 'Chi phí lương tháng này', data: 'monthlyPayroll' },

    // Row 2: Charts
    { type: 'pie-chart', title: 'Nhân viên theo phòng ban', data: 'employeesByDept' },
    { type: 'bar-chart', title: 'Tasks theo trạng thái', data: 'tasksByStatus' },

    // Row 3: Tables
    { type: 'table', title: 'Nhân viên mới', data: 'recentHires' },
    { type: 'table', title: 'Tasks cần attention', data: 'urgentTasks' },

    // Row 4: Financial
    { type: 'line-chart', title: 'Chi phí lương 6 tháng', data: 'payrollTrend' },
    { type: 'table', title: 'Bảng lương chờ duyệt', data: 'pendingPayrolls' }
  ]
};
```

#### 6.2. Manager Dashboard
```javascript
// Manager chỉ thấy thống kê của phòng mình
const managerDashboard = {
  widgets: [
    // Row 1: Department overview
    { type: 'stat-card', title: 'Nhân viên phòng', data: 'deptEmployees' },
    { type: 'stat-card', title: 'Tasks hoàn thành', data: 'completedTasks' },
    { type: 'stat-card', title: 'Tasks đang thực hiện', data: 'inProgressTasks' },
    { type: 'stat-card', title: 'Tasks quá hạn', data: 'overdueTasks' },

    // Row 2: Charts
    { type: 'pie-chart', title: 'Tasks theo trạng thái', data: 'tasksByStatus' },
    { type: 'bar-chart', title: 'Hiệu suất nhân viên', data: 'employeePerformance' },

    // Row 3: Lists
    { type: 'table', title: 'Tasks deadline gần', data: 'upcomingDeadlines' },
    { type: 'table', title: 'Hoạt động gần đây', data: 'recentActivity' }

    // ❌ Không có: financial data, payroll, cross-department data
  ],

  // Auto filter theo department
  dataFilter: (data, manager) => ({
    ...data,
    department: manager.department
  })
};
```

#### 6.3. Accountant Dashboard
```javascript
// Accountant thấy thống kê tài chính
const accountantDashboard = {
  widgets: [
    // Row 1: Financial overview
    { type: 'stat-card', title: 'Tổng quỹ lương', data: 'totalPayroll' },
    { type: 'stat-card', title: 'Đã thanh toán', data: 'paidPayroll' },
    { type: 'stat-card', title: 'Chờ duyệt', data: 'pendingPayroll' },
    { type: 'stat-card', title: 'Tổng thuế TNCN', data: 'totalTax' },

    // Row 2: Charts
    { type: 'pie-chart', title: 'Chi phí theo phòng ban', data: 'payrollByDept' },
    { type: 'line-chart', title: 'Xu hướng chi phí', data: 'payrollTrend' },

    // Row 3: Tables
    { type: 'table', title: 'Bảng lương chờ xử lý', data: 'pendingPayrolls' },
    { type: 'table', title: 'Thay đổi gần đây', data: 'recentChanges' }

    // ❌ Không có: task management, employee details
  ]
};
```

---

### 7. REPORTS - LOGIC XUẤT BÁO CÁO

```javascript
// Cấu hình báo cáo theo role
const reportPermissions = {
  admin: {
    // Admin có thể xuất TẤT CẢ báo cáo
    available: [
      'employee-list',        // DS nhân viên (full info)
      'employee-by-dept',     // NV theo phòng ban
      'salary-report',        // Báo cáo lương
      'tax-report',           // Báo cáo thuế
      'insurance-report',     // Báo cáo bảo hiểm
      'task-report',          // Báo cáo tasks
      'performance-report',   // Báo cáo hiệu suất
      'financial-summary'     // Tổng hợp tài chính
    ],
    formats: ['excel', 'pdf', 'csv'],
    dateRange: 'unlimited'
  },

  manager: {
    // Manager chỉ xuất báo cáo phòng (không có lương)
    available: [
      'employee-list',        // DS NV phòng (không salary)
      'task-report',          // Báo cáo tasks phòng
      'performance-report'    // Hiệu suất phòng
    ],
    formats: ['excel', 'pdf'],
    dateRange: '1-year',
    dataFilter: 'department-only',
    excludeFields: ['salary', 'bankAccount', 'bankName']
  },

  accountant: {
    // Accountant xuất báo cáo tài chính
    available: [
      'employee-list',        // DS NV (basic + salary)
      'salary-report',        // Báo cáo lương
      'tax-report',           // Báo cáo thuế
      'insurance-report',     // Báo cáo bảo hiểm
      'financial-summary'     // Tổng hợp tài chính
    ],
    formats: ['excel', 'pdf', 'csv'],
    dateRange: '3-years',
    excludeFields: ['personalInfo', 'emergencyContact']
  }
};

// API export report
async function exportReport(userId, reportType, params) {
  const user = await getUserById(userId);
  const permissions = reportPermissions[user.role];

  // Kiểm tra quyền
  if (!permissions.available.includes(reportType)) {
    throw new Error(`Bạn không có quyền xuất báo cáo: ${reportType}`);
  }

  // Kiểm tra format
  if (!permissions.formats.includes(params.format)) {
    throw new Error(`Format không được hỗ trợ: ${params.format}`);
  }

  // Apply data filter
  let data = await getReportData(reportType, params);

  if (permissions.dataFilter === 'department-only') {
    data = data.filter(item => item.department === user.department);
  }

  // Remove excluded fields
  if (permissions.excludeFields) {
    data = data.map(item => {
      const filtered = { ...item };
      permissions.excludeFields.forEach(field => delete filtered[field]);
      return filtered;
    });
  }

  return generateReport(data, params.format);
}
```

---

### 8. SETTINGS - PHÂN QUYỀN CÀI ĐẶT

```javascript
const settingsPermissions = {
  admin: {
    // Admin có full access settings
    sections: [
      'profile',           // Thông tin cá nhân
      'password',          // Đổi mật khẩu
      'company',           // Cài đặt công ty
      'departments',       // Quản lý phòng ban
      'roles',             // Quản lý roles
      'users',             // Quản lý user accounts
      'payroll-config',    // Cấu hình lương (thuế, BH, phụ cấp mặc định)
      'notifications',     // Cấu hình thông báo
      'backup',            // Backup & restore
      'audit-logs'         // Xem logs
    ]
  },

  manager: {
    // Manager chỉ cài đặt cá nhân
    sections: [
      'profile',           // Thông tin cá nhân
      'password',          // Đổi mật khẩu
      'notifications'      // Cài đặt thông báo cá nhân
    ]
  },

  accountant: {
    // Accountant cài đặt cá nhân + xem cấu hình lương
    sections: [
      'profile',           // Thông tin cá nhân
      'password',          // Đổi mật khẩu
      'notifications',     // Cài đặt thông báo
      'payroll-config'     // Xem cấu hình lương (read-only)
    ],
    readOnly: ['payroll-config'] // Chỉ xem, không sửa
  }
};
```

---

### 9. AUDIT LOGGING - GHI LOG HOẠT ĐỘNG

```javascript
/**
 * Hệ thống ghi log để track tất cả hoạt động nhạy cảm
 */

const auditableActions = [
  // Employee actions
  'employee.create',
  'employee.update',
  'employee.delete',
  'employee.salary_change',
  'employee.benefits_change',

  // Payroll actions
  'payroll.create',
  'payroll.update',
  'payroll.delete',
  'payroll.approve',
  'payroll.reject',
  'payroll.mark_paid',

  // Task actions (cho admin)
  'task.create',
  'task.update',
  'task.delete',
  'task.reassign',

  // Auth actions
  'auth.login',
  'auth.logout',
  'auth.password_change',
  'auth.password_reset',

  // Settings actions
  'settings.update',
  'user.create',
  'user.update',
  'user.delete',
  'user.role_change'
];

// Audit log model
const AuditLog = {
  id: String,
  action: String,           // Action type
  userId: String,           // User thực hiện
  userRole: String,         // Role của user
  targetType: String,       // 'employee', 'payroll', 'task', etc.
  targetId: String,         // ID của đối tượng
  changes: Object,          // { field: { old: x, new: y } }
  ipAddress: String,
  userAgent: String,
  timestamp: Date
};

// Middleware ghi log
function auditLog(action) {
  return async (req, res, next) => {
    const originalSend = res.send;

    res.send = function(body) {
      // Ghi log sau khi action thành công
      if (res.statusCode >= 200 && res.statusCode < 300) {
        AuditLog.create({
          action,
          userId: req.user.id,
          userRole: req.user.role,
          targetType: req.params.type,
          targetId: req.params.id,
          changes: req.body,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          timestamp: new Date()
        });
      }

      return originalSend.call(this, body);
    };

    next();
  };
}

// Sử dụng
app.put('/api/employees/:id/salary',
  authenticate,
  requireRole('admin'),
  auditLog('employee.salary_change'),
  updateEmployeeSalary
);
```

---

### 10. ERROR HANDLING & MESSAGES

```javascript
// Định nghĩa các error messages theo role
const errorMessages = {
  // Authentication
  'UNAUTHORIZED': 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.',
  'INVALID_CREDENTIALS': 'Email hoặc mật khẩu không đúng.',
  'SESSION_EXPIRED': 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',

  // Authorization
  'FORBIDDEN': 'Bạn không có quyền thực hiện thao tác này.',
  'ROLE_REQUIRED': (roles) => `Chỉ ${roles.join(', ')} mới có quyền thực hiện thao tác này.`,
  'DEPARTMENT_MISMATCH': 'Bạn chỉ có thể thao tác với nhân viên trong phòng ban của mình.',

  // Employee
  'EMPLOYEE_NOT_FOUND': 'Không tìm thấy nhân viên.',
  'EMAIL_EXISTS': 'Email đã được sử dụng.',
  'CANNOT_DELETE_SELF': 'Bạn không thể xóa tài khoản của chính mình.',

  // Payroll
  'PAYROLL_EXISTS': 'Bảng lương cho kỳ này đã tồn tại.',
  'PAYROLL_NOT_FOUND': 'Không tìm thấy bảng lương.',
  'PAYROLL_ALREADY_PAID': 'Không thể sửa bảng lương đã thanh toán.',
  'PAYROLL_PENDING': 'Bảng lương đang chờ duyệt, không thể sửa.',

  // Task
  'TASK_NOT_FOUND': 'Không tìm thấy công việc.',
  'INVALID_ASSIGNEE': 'Không thể giao việc cho nhân viên này.',
  'ASSIGNEE_DIFFERENT_DEPT': 'Không thể giao việc cho nhân viên phòng ban khác.'
};

// Error handler middleware
function errorHandler(err, req, res, next) {
  const message = errorMessages[err.code] || err.message || 'Đã xảy ra lỗi.';

  // Log error (sensitive info cho admin)
  console.error({
    code: err.code,
    message: err.message,
    userId: req.user?.id,
    path: req.path,
    method: req.method,
    timestamp: new Date()
  });

  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code,
      message: typeof message === 'function' ? message(err.params) : message
    }
  });
}
```

---

## 📋 BẢNG TỔNG HỢP QUYỀN HẠN

| Chức năng | Admin | Manager | Accountant |
|-----------|-------|---------|------------|
| **NHÂN VIÊN** ||||
| Xem danh sách | ✅ Tất cả | ✅ Phòng mình | ✅ Tất cả (basic) |
| Xem chi tiết | ✅ Full | ✅ Không lương | ✅ Lương + Bank |
| Thêm mới | ✅ | ❌ | ❌ |
| Sửa thông tin | ✅ | ❌ | ❌ |
| Sửa benefits | ✅ | ❌ | ✅ |
| Xóa | ✅ | ❌ | ❌ |
| **CÔNG VIỆC** ||||
| Xem tasks | ✅ Tất cả | ✅ Phòng mình | ✅ Của mình |
| Tạo task | ✅ | ✅ | ❌ |
| Giao task | ✅ Ai cũng được | ✅ Trong phòng | ❌ |
| Sửa/Xóa task | ✅ | ✅ Phòng mình | ❌ |
| **BẢNG LƯƠNG** ||||
| Xem payroll | ✅ | ❌ | ✅ |
| Tạo payroll | ✅ | ❌ | ✅ |
| Sửa payroll | ✅ | ❌ | ✅ (draft) |
| Xóa payroll | ✅ | ❌ | ❌ |
| Duyệt payroll | ✅ | ❌ | ❌ |
| Mark paid | ✅ | ❌ | ❌ |
| **BÁO CÁO** ||||
| Báo cáo nhân viên | ✅ Full | ✅ Không lương | ✅ Basic |
| Báo cáo lương | ✅ | ❌ | ✅ |
| Báo cáo tasks | ✅ | ✅ Phòng mình | ❌ |
| **CÀI ĐẶT** ||||
| Settings hệ thống | ✅ | ❌ | ❌ |
| Quản lý users | ✅ | ❌ | ❌ |
| Audit logs | ✅ | ❌ | ❌ |

---

**🎯 KẾT LUẬN:**

Document này cung cấp **TOÀN BỘ logic phân quyền** và **API specifications** cần thiết cho backend implement. Mỗi role có **scope và quyền hạn rõ ràng**, kèm theo **validation rules** và **business logic chi tiết**.

Backend developer có thể sử dụng document này như một **blueprint hoàn chỉnh** để implement hệ thống.
