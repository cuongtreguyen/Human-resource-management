// Fake API Service for HR Management System
// This provides mock data and simulated API responses

class FakeApiService {
  constructor() {
    this.baseUrl = '/api/v1';
    this.delay = 300; // Simulated network delay in ms
  }

  // Simulate network delay
  async delayResponse(data) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), this.delay);
    });
  }

  // Generate random IDs
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Employee Management APIs
  async getEmployees() {
    const employees = [
      {
        id: 'emp001',
        name: 'Trần Ngọc Hải',
        email: 'nguyenvanan@company.com',
        position: 'Software Developer',
        department: 'IT',
        phone: '0901234567',
        status: 'active',
        avatar: '/api/placeholder/150/150',
        hireDate: '2023-01-15',
        salary: 15000000,
        // Personal Information
        dateOfBirth: '1995-05-20',
        gender: 'Nam',
        nationality: 'Việt Nam',
        idCard: '001095012345',
        idCardIssueDate: '2015-06-01',
        idCardIssuePlace: 'Công an TP. Hà Nội',
        address: '123 Đường Láng, Đống Đa, Hà Nội',
        maritalStatus: 'Độc thân',
        // Employment Details
        employeeType: 'Toàn thời gian',
        contractType: 'Hợp đồng không xác định thời hạn',
        manager: 'Trần Thị Bình',
        workLocation: 'Văn phòng Hà Nội',
        // Education
        education: 'Đại học',
        educationDetails: 'Cử nhân Công nghệ Thông tin - ĐH Bách Khoa Hà Nội',
        // Emergency Contact
        emergencyContact: {
          name: 'Nguyễn Văn Bình',
          relationship: 'Cha',
          phone: '0912345678'
        },
        // Bank Information
        bankAccount: '1234567890',
        bankName: 'Vietcombank',
        bankBranch: 'Chi nhánh Hà Nội'
      },
      {
        id: 'emp002',
        name: 'Trần Thị Bình',
        email: 'tranthibinh@company.com',
        position: 'HR Manager',
        department: 'Human Resources',
        phone: '0901234568',
        status: 'active',
        avatar: '/api/placeholder/150/150',
        hireDate: '2022-08-20',
        salary: 20000000,
        // Personal Information
        dateOfBirth: '1990-08-15',
        gender: 'Nữ',
        nationality: 'Việt Nam',
        idCard: '001090067890',
        idCardIssueDate: '2010-09-01',
        idCardIssuePlace: 'Công an TP. Hồ Chí Minh',
        address: '456 Nguyễn Trãi, Thanh Xuân, Hà Nội',
        maritalStatus: 'Đã kết hôn',
        // Employment Details
        employeeType: 'Toàn thời gian',
        contractType: 'Hợp đồng không xác định thời hạn',
        manager: 'CEO',
        workLocation: 'Văn phòng Hà Nội',
        // Education
        education: 'Thạc sĩ',
        educationDetails: 'Thạc sĩ Quản trị Nhân sự - ĐH Ngoại Thương',
        // Emergency Contact
        emergencyContact: {
          name: 'Trần Văn Cường',
          relationship: 'Chồng',
          phone: '0987654321'
        },
        // Bank Information
        bankAccount: '0987654321',
        bankName: 'Techcombank',
        bankBranch: 'Chi nhánh Cầu Giấy'
      },
      {
        id: 'emp003',
        name: 'Lê Minh Chính',
        email: 'leminhchinh@company.com',
        position: 'Marketing Specialist',
        department: 'Marketing',
        phone: '0901234569',
        status: 'inactive',
        avatar: '/api/placeholder/150/150',
        hireDate: '2023-03-10',
        salary: 12000000,
        // Personal Information
        dateOfBirth: '1997-03-25',
        gender: 'Nam',
        nationality: 'Việt Nam',
        idCard: '001097034567',
        idCardIssueDate: '2017-04-01',
        idCardIssuePlace: 'Công an tỉnh Hải Phòng',
        address: '789 Lê Lợi, Hải Châu, Đà Nẵng',
        maritalStatus: 'Độc thân',
        // Employment Details
        employeeType: 'Toàn thời gian',
        contractType: 'Hợp đồng xác định thời hạn 2 năm',
        manager: 'Nguyễn Thị Mai',
        workLocation: 'Văn phòng Đà Nẵng',
        // Education
        education: 'Đại học',
        educationDetails: 'Cử nhân Marketing - ĐH Kinh Tế Quốc Dân',
        // Emergency Contact
        emergencyContact: {
          name: 'Lê Thị Hoa',
          relationship: 'Mẹ',
          phone: '0901122334'
        },
        // Bank Information
        bankAccount: '5566778899',
        bankName: 'VPBank',
        bankBranch: 'Chi nhánh Đà Nẵng'
      },
      {
        id: 'emp004',
        name: 'Phạm Thu Cúc',
        email: 'phamthucuc@company.com',
        position: 'Accountant',
        department: 'Finance',
        phone: '0901234570',
        status: 'active',
        avatar: '/api/placeholder/150/150',
        hireDate: '2022-11-05',
        salary: 13000000,
        // Personal Information
        dateOfBirth: '1993-11-10',
        gender: 'Nữ',
        nationality: 'Việt Nam',
        idCard: '001093056789',
        idCardIssueDate: '2013-12-01',
        idCardIssuePlace: 'Công an TP. Hà Nội',
        address: '321 Trần Duy Hưng, Cầu Giấy, Hà Nội',
        maritalStatus: 'Đã kết hôn',
        // Employment Details
        employeeType: 'Toàn thời gian',
        contractType: 'Hợp đồng không xác định thời hạn',
        manager: 'Giám đốc Tài chính',
        workLocation: 'Văn phòng Hà Nội',
        // Education
        education: 'Đại học',
        educationDetails: 'Cử nhân Kế toán - ĐH Kinh Tế Quốc Dân',
        // Emergency Contact
        emergencyContact: {
          name: 'Phạm Văn Tuấn',
          relationship: 'Chồng',
          phone: '0976543210'
        },
        // Bank Information
        bankAccount: '1122334455',
        bankName: 'BIDV',
        bankBranch: 'Chi nhánh Thăng Long'
      },
      {
        id: 'emp005',
        name: 'Hoàng Đức Dũng',
        email: 'hoangducdung@company.com',
        position: 'Sales Executive',
        department: 'Sales',
        phone: '0901234571',
        status: 'active',
        avatar: '/api/placeholder/150/150',
        hireDate: '2023-02-28',
        salary: 14000000,
        // Personal Information
        dateOfBirth: '1996-02-14',
        gender: 'Nam',
        nationality: 'Việt Nam',
        idCard: '001096023456',
        idCardIssueDate: '2016-03-01',
        idCardIssuePlace: 'Công an TP. Hồ Chí Minh',
        address: '555 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
        maritalStatus: 'Độc thân',
        // Employment Details
        employeeType: 'Toàn thời gian',
        contractType: 'Hợp đồng xác định thời hạn 1 năm',
        manager: 'Giám đốc Kinh doanh',
        workLocation: 'Văn phòng TP. Hồ Chí Minh',
        // Education
        education: 'Đại học',
        educationDetails: 'Cử nhân Quản trị Kinh doanh - ĐH Ngoại Thương',
        // Emergency Contact
        emergencyContact: {
          name: 'Hoàng Thị Lan',
          relationship: 'Mẹ',
          phone: '0988776655'
        },
        // Bank Information
        bankAccount: '9988776655',
        bankName: 'ACB',
        bankBranch: 'Chi nhánh Sài Gòn'
      }
    ];
    return this.delayResponse({ data: employees, success: true });
  }

  async getEmployeeById(id) {
    const allEmployees = await this.getEmployees();
    const employee = allEmployees.data.find(emp => emp.id === id);
    if (employee) {
      return this.delayResponse({ data: employee, success: true });
    } else {
      return this.delayResponse({ data: null, success: false, message: 'Employee not found' });
    }
  }

  async createEmployee(employeeData) {
    const newEmployee = {
      id: this.generateId(),
      ...employeeData,
      status: 'active',
      avatar: '/api/placeholder/150/150',
      hireDate: new Date().toISOString().split('T')[0]
    };
    return this.delayResponse({ data: newEmployee, success: true, message: 'Employee created successfully' });
  }

  async updateEmployee(id, employeeData) {
    return this.delayResponse({ 
      data: { id, ...employeeData }, 
      success: true, 
      message: 'Employee updated successfully' 
    });
  }

  async deleteEmployee(id) {
    return this.delayResponse({ 
      data: { id }, 
      success: true, 
      message: 'Employee deleted successfully' 
    });
  }

  // Attendance APIs
  async getAttendanceRecords() {
    const attendanceRecords = [
      {
        id: 'att001',
        employeeId: 'emp001',
        employeeName: 'Nguyễn Văn An',
        date: '2024-01-15',
        checkIn: '08:30',
        checkOut: '17:30',
        status: 'present',
        hoursWorked: 9,
        overtime: 0
      },
      {
        id: 'att002',
        employeeId: 'emp002',
        employeeName: 'Trần Thị Bình',
        date: '2024-01-15',
        checkIn: '09:00',
        checkOut: '18:00',
        status: 'present',
        hoursWorked: 9,
        overtime: 0
      },
      {
        id: 'att003',
        employeeId: 'emp001',
        employeeName: 'Nguyễn Văn An',
        date: '2024-01-16',
        checkIn: '08:45',
        checkOut: '17:15',
        status: 'late',
        hoursWorked: 8.5,
        overtime: 0
      },
      {
        id: 'att004',
        employeeId: 'emp003',
        employeeName: 'Lê Minh Chính',
        date: '2024-01-16',
        checkIn: null,
        checkOut: null,
        status: 'absent',
        hoursWorked: 0,
        overtime: 0
      },
      {
        id: 'att005',
        employeeId: 'emp004',
        employeeName: 'Phạm Thu Cúc',
        date: '2024-01-16',
        checkIn: '08:00',
        checkOut: '20:00',
        status: 'overtime',
        hoursWorked: 12,
        overtime: 3
      }
    ];
    return this.delayResponse({ data: attendanceRecords, success: true });
  }

  async createAttendanceRecord(attendanceData) {
    const newRecord = {
      id: this.generateId(),
      ...attendanceData,
      hoursWorked: attendanceData.checkIn && attendanceData.checkOut ? 
        this.calculateHoursWorked(attendanceData.checkIn, attendanceData.checkOut) : 0
    };
    return this.delayResponse({ data: newRecord, success: true, message: 'Attendance record created successfully' });
  }

  calculateHoursWorked(checkIn, checkOut) {
    const start = new Date(`2000-01-01 ${checkIn}`);
    const end = new Date(`2000-01-01 ${checkOut}`);
    return (end - start) / (1000 * 60 * 60);
  }

  // Payroll APIs
  async getPayrollRecords() {
    const payrollRecords = [
      {
        id: 'pay001',
        employeeId: 'emp001',
        employeeName: 'Nguyễn Văn An',
        month: '2024-01',
        basicSalary: 15000000,
        allowance: 2000000,
        overtime: 500000,
        bonus: 1000000,
        deduction: 300000,
        netSalary: 18200000,
        status: 'paid'
      },
      {
        id: 'pay002',
        employeeId: 'emp002',
        employeeName: 'Trần Thị Bình',
        month: '2024-01',
        basicSalary: 20000000,
        allowance: 3000000,
        overtime: 0,
        bonus: 2000000,
        deduction: 500000,
        netSalary: 24500000,
        status: 'pending'
      },
      {
        id: 'pay003',
        employeeId: 'emp003',
        employeeName: 'Lê Minh Chính',
        month: '2024-01',
        basicSalary: 12000000,
        allowance: 1500000,
        overtime: 800000,
        bonus: 0,
        deduction: 200000,
        netSalary: 14100000,
        status: 'pending'
      }
    ];
    return this.delayResponse({ data: payrollRecords, success: true });
  }

  async createPayrollRecord(payrollData) {
    const newRecord = {
      id: this.generateId(),
      ...payrollData,
      status: 'pending'
    };
    return this.delayResponse({ data: newRecord, success: true, message: 'Payroll record created successfully' });
  }

  async updatePayrollStatus(id, status) {
    return this.delayResponse({ 
      data: { id, status }, 
      success: true, 
      message: `Payroll status updated to ${status}` 
    });
  }

  // Dashboard APIs
  async getDashboardStats() {
    const stats = {
      totalEmployees: 156,
      activeEmployees: 142,
      newHiresThisMonth: 8,
      employeesOnLeave: 12,
      pendingPayroll: 23,
      completedPayroll: 130,
      averageAttendance: 94.5,
      departments: [
        { name: 'IT', count: 45 },
        { name: 'Marketing', count: 28 },
        { name: 'Sales', count: 32 },
        { name: 'HR', count: 12 },
        { name: 'Finance', count: 18 },
        { name: 'Operations', count: 21 }
      ],
      recentActivities: [
        { id: 1, type: 'hire', message: 'New employee Nguyen Van A joined', time: '2 hours ago' },
        { id: 2, type: 'leave', message: 'Tran Thi B requested a leave', time: '4 hours ago' },
        { id: 3, type: 'payroll', message: 'January payroll completed', time: '1 day ago' },
        { id: 4, type: 'attendance', message: 'Attendance report generated', time: '2 days ago' }
      ]
    };
    return this.delayResponse({ data: stats, success: true });
  }

  // User Management APIs
  async getUsers() {
    const users = [
      {
        id: 'user001',
        username: 'admin',
        email: 'admin@company.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-01-15T10:30:00Z',
        permissions: ['read', 'write', 'delete', 'admin']
      },
      {
        id: 'user002',
        username: 'hr_employee',
        email: 'employee.hr@company.com',
        role: 'employee',
        status: 'active',
        lastLogin: '2024-01-15T09:15:00Z',
        permissions: ['read']
      },
      {
        id: 'user003',
        username: 'portal_employee',
        email: 'employee@company.com',
        role: 'employee',
        status: 'active',
        lastLogin: '2024-01-14T16:45:00Z',
        permissions: ['read']
      }
    ];
    return this.delayResponse({ data: users, success: true });
  }

  async createUser(userData) {
    const newUser = {
      id: this.generateId(),
      ...userData,
      status: 'active',
      lastLogin: null
    };
    return this.delayResponse({ data: newUser, success: true, message: 'User created successfully' });
  }

  // Department APIs
  async getDepartments() {
    const departments = [
      { id: 'dept001', name: 'Information Technology', code: 'IT', head: 'Nguyen Van A', employeeCount: 45 },
      { id: 'dept002', name: 'Human Resources', code: 'HR', head: 'Tran Thi B', employeeCount: 12 },
      { id: 'dept003', name: 'Marketing', code: 'MKT', head: 'Le Minh C', employeeCount: 28 },
      { id: 'dept004', name: 'Sales', code: 'SALES', head: 'Pham Thu D', employeeCount: 32 },
      { id: 'dept005', name: 'Finance', code: 'FIN', head: 'Hoang Duc E', employeeCount: 18 },
      { id: 'dept006', name: 'Operations', code: 'OPS', head: 'Vu Thi F', employeeCount: 21 }
    ];
    return this.delayResponse({ data: departments, success: true });
  }

  // Benefits/Policies APIs
  async getPolicies() {
    const policies = [
      {
        id: 'policy001',
        name: 'Annual Leave Policy',
        description: 'Employees are entitled to 12 annual leave days per year',
        type: 'leave',
        status: 'active',
        effectiveDate: '2024-01-01'
      },
      {
        id: 'policy002',
        name: 'Sick Leave Policy',
        description: 'Paid sick leave up to 5 days per year',
        type: 'sick_leave',
        status: 'active',
        effectiveDate: '2024-01-01'
      },
      {
        id: 'policy003',
        name: 'Overtime Payment Policy',
        description: 'Overtime pay is 1.5x regular hourly rate',
        type: 'overtime',
        status: 'active',
        effectiveDate: '2024-01-01'
      },
      {
        id: 'policy004',
        name: 'Remote Work Policy',
        description: 'Remote work allowed up to 2 days per week',
        type: 'remote_work',
        status: 'active',
        effectiveDate: '2024-01-01'
      }
    ];
    return this.delayResponse({ data: policies, success: true });
  }

  async createPolicy(policyData) {
    const newPolicy = {
      id: this.generateId(),
      ...policyData,
      status: 'active',
      effectiveDate: new Date().toISOString().split('T')[0]
    };
    return this.delayResponse({ data: newPolicy, success: true, message: 'Policy created successfully' });
  }

  // Leave Management APIs
  async getLeaveRequests() {
    const leaveRequests = [
      {
        id: 'leave001',
        employeeId: 'emp001',
        employeeName: 'Nguyễn Văn An',
        type: 'annual',
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        days: 5,
        reason: 'Family vacation',
        status: 'pending',
        submittedDate: '2024-01-15',
        approvedBy: null
      },
      {
        id: 'leave002',
        employeeId: 'emp002',
        employeeName: 'Trần Thị Bình',
        type: 'sick',
        startDate: '2024-01-20',
        endDate: '2024-01-22',
        days: 3,
        reason: 'Flu symptoms',
        status: 'approved',
        submittedDate: '2024-01-18',
        approvedBy: 'admin'
      }
    ];
    return this.delayResponse({ data: leaveRequests, success: true });
  }

  async createLeaveRequest(leaveData) {
    const newRequest = {
      id: this.generateId(),
      ...leaveData,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
      approvedBy: null
    };
    return this.delayResponse({ data: newRequest, success: true, message: 'Leave request submitted successfully' });
  }

  async updateLeaveRequest(id, status, approvedBy = null) {
    return this.delayResponse({ 
      data: { id, status, approvedBy }, 
      success: true, 
      message: `Leave request ${status} successfully` 
    });
  }

  // Export/Import APIs
  async exportEmployeeData(format = 'csv') {
    return this.delayResponse({ 
      data: { url: `/exports/employees.${format}`, filename: `employees_${new Date().toISOString().split('T')[0]}.${format}` }, 
      success: true, 
      message: 'Export completed successfully' 
    });
  }

  async exportAttendanceData(startDate, endDate, format = 'csv') {
    return this.delayResponse({ 
      data: { url: `/exports/attendance_${startDate}_to_${endDate}.${format}` }, 
      success: true, 
      message: 'Attendance data exported successfully' 
    });
  }

  async exportPayrollData(month, year, format = 'csv') {
    return this.delayResponse({ 
      data: { url: `/exports/payroll_${year}_${month}.${format}` }, 
      success: true, 
      message: 'Payroll data exported successfully' 
    });
  }

  // Notifications APIs
  async getNotifications() {
    const notifications = [
      {
        id: 'notif001',
        title: 'Salary Review Due',
        message: 'Annual salary review is due for 15 employees',
        type: 'reminder',
        priority: 'high',
        read: false,
        createdAt: '2024-01-15T08:00:00Z'
      },
      {
        id: 'notif002',
        title: 'Leave Request Pending',
        message: '3 leave requests are pending approval',
        type: 'action_required',
        priority: 'medium',
        read: false,
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 'notif003',
        title: 'Payroll Processing',
        message: 'January payroll will be processed tomorrow',
        type: 'info',
        priority: 'low',
        read: true,
        createdAt: '2024-01-14T16:00:00Z'
      }
    ];
    return this.delayResponse({ data: notifications, success: true });
  }

  async markNotificationRead(id) {
    return this.delayResponse({ 
      data: { id }, 
      success: true, 
      message: 'Notification marked as read' 
    });
  }

  // Reports APIs
  async generateReport(type) {
    const reports = {
      employee_summary: { title: 'Employee Summary Report', filename: 'employee_summary.pdf' },
      attendance_summary: { title: 'Attendance Summary Report', filename: 'attendance_summary.pdf' },
      payroll_summary: { title: 'Payroll Summary Report', filename: 'payroll_summary.pdf' },
      department_analysis: { title: 'Department Analysis Report', filename: 'department_analysis.pdf' }
    };
    
    const report = reports[type] || { title: 'Custom Report', filename: 'custom_report.pdf' };
    
    return this.delayResponse({ 
      data: { 
        ...report, 
        id: this.generateId(),
        generatedAt: new Date().toISOString(),
        status: 'completed'
      }, 
      success: true, 
      message: 'Report generated successfully' 
    });
  }

  // Chat System APIs - Sử dụng nhân viên có sẵn
  async getChatContacts() {
    // Lấy danh sách nhân viên từ API có sẵn
    const employeesResponse = await this.getEmployees();
    const employees = employeesResponse.data;
    
    // Thêm thông tin chat cho mỗi nhân viên
    const contacts = employees.map((employee) => ({
      id: employee.id,
      name: employee.name,
      avatar: employee.avatar,
      email: employee.email,
      position: employee.position,
      department: employee.department,
      lastMessage: this.getRandomLastMessage(),
      unreadCount: Math.floor(Math.random() * 15),
      lastSeen: this.getRandomLastSeen(),
      status: this.getRandomStatus(),
      isEmployee: true
    }));
    
    return this.delayResponse({ data: contacts, success: true });
  }

  getRandomLastMessage() {
    const messages = [
      'Xin chào, tôi có việc cần hỏi',
      'Bạn có thể giúp tôi không?',
      'Tôi cần nghỉ phép gấp',
      'Task này tôi đã hoàn thành',
      'Có thể họp lúc 2h chiều không?',
      'Tôi sẽ gửi báo cáo sau',
      'Cảm ơn bạn đã hỗ trợ',
      'Tôi cần thêm thời gian để hoàn thành',
      'Có thể gia hạn deadline không?',
      'Tôi đã gửi file qua email',
      'Có thể xem lại task này không?',
      'Tôi cần hỗ trợ về dự án',
      'Deadline có thể gia hạn không?',
      'Tôi đã hoàn thành phần này',
      'Có thể họp để thảo luận không?'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  getRandomLastSeen() {
    const times = ['02:21 PM', '02:20 PM', '01:00 PM', '12:30 PM', '11:00 AM', '10:45 AM', '09:30 AM', '08:15 AM'];
    return times[Math.floor(Math.random() * times.length)];
  }

  getRandomStatus() {
    const statuses = ['online', 'away', 'offline'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  async getChatMessages(contactId) {
    const workMessages = [
      {
        id: 1,
        senderId: contactId,
        receiverId: 1,
        message: 'Chào anh/chị, tôi có việc cần hỏi',
        timestamp: '2024-01-15T10:20:00Z',
        type: 'text'
      },
      {
        id: 2,
        senderId: 1,
        receiverId: contactId,
        message: 'Chào bạn, có gì tôi có thể giúp không?',
        timestamp: '2024-01-15T10:22:00Z',
        type: 'text'
      },
      {
        id: 3,
        senderId: contactId,
        receiverId: 1,
        message: 'Tôi cần nghỉ phép gấp vào ngày mai, có được không ạ?',
        timestamp: '2024-01-15T10:23:00Z',
        type: 'text'
      },
      {
        id: 4,
        senderId: 1,
        receiverId: contactId,
        message: 'Được, bạn gửi đơn nghỉ phép qua hệ thống nhé',
        timestamp: '2024-01-15T10:25:00Z',
        type: 'text'
      },
      {
        id: 5,
        senderId: contactId,
        receiverId: 1,
        message: 'Task này tôi đã hoàn thành, anh/chị có thể review không?',
        timestamp: '2024-01-15T10:26:00Z',
        type: 'text'
      },
      {
        id: 6,
        senderId: 1,
        receiverId: contactId,
        message: 'Tốt, tôi sẽ xem và phản hồi sau',
        timestamp: '2024-01-15T10:27:00Z',
        type: 'text'
      },
      {
        id: 7,
        senderId: contactId,
        receiverId: 1,
        message: 'Có thể gia hạn deadline cho task này không ạ?',
        timestamp: '2024-01-15T10:28:00Z',
        type: 'text'
      },
      {
        id: 8,
        senderId: 1,
        receiverId: contactId,
        message: 'Được, bạn cần thêm bao nhiêu ngày?',
        timestamp: '2024-01-15T10:29:00Z',
        type: 'text'
      }
    ];
    return this.delayResponse({ data: workMessages, success: true });
  }

  async sendMessage(messageData) {
    const newMessage = {
      id: this.generateId(),
      ...messageData,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    return this.delayResponse({ data: newMessage, success: true, message: 'Message sent successfully' });
  }

  // Task Management APIs
  async getTasks() {
    const tasks = [
      {
        id: 1,
        title: 'Hero Section Design',
        description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        status: 'new',
        priority: 'high',
        assignee: { id: 1, name: 'Alex Storm', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face' },
        startDate: null,
        endDate: null,
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T09:00:00Z'
      },
      {
        id: 2,
        title: 'Website Design',
        description: 'The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.',
        status: 'in-progress',
        priority: 'medium',
        assignee: { id: 2, name: 'Jordan Miles', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face' },
        startDate: '2024-01-14',
        endDate: '2024-01-30',
        createdAt: '2024-01-14T10:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z'
      },
      {
        id: 3,
        title: 'Banner Design',
        description: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
        status: 'pending',
        priority: 'low',
        assignee: { id: 3, name: 'Liam Carter', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face' },
        startDate: null,
        endDate: null,
        createdAt: '2024-01-13T15:00:00Z',
        updatedAt: '2024-01-13T15:00:00Z'
      },
      {
        id: 4,
        title: 'React Development',
        description: 'There are many variations of passages of Lorem Ipsum available.',
        status: 'complete',
        priority: 'high',
        assignee: { id: 4, name: 'Noah Blake', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face' },
        startDate: '2024-01-10',
        endDate: '2024-01-20',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-20T17:00:00Z'
      }
    ];
    return this.delayResponse({ data: tasks, success: true });
  }

  async createTask(taskData) {
    const newTask = {
      id: this.generateId(),
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return this.delayResponse({ data: newTask, success: true, message: 'Task created successfully' });
  }

  async updateTask(id, taskData) {
    return this.delayResponse({ 
      data: { 
        id, 
        ...taskData, 
        updatedAt: new Date().toISOString() 
      }, 
      success: true, 
      message: 'Task updated successfully' 
    });
  }

  async deleteTask(id) {
    return this.delayResponse({ 
      data: { id }, 
      success: true, 
      message: 'Task deleted successfully' 
    });
  }

  async getTaskAssignees() {
    // Sử dụng nhân viên có sẵn từ hệ thống
    const employeesResponse = await this.getEmployees();
    const employees = employeesResponse.data;
    
    const assignees = employees.map(employee => ({
      id: employee.id,
      name: employee.name,
      avatar: employee.avatar,
      department: employee.department,
      position: employee.position,
      email: employee.email
    }));
    
    return this.delayResponse({ data: assignees, success: true });
  }

  // Task Progress Tracking APIs
  async getTaskProgress(taskId) {
    const progressData = {
      taskId: taskId,
      currentProgress: Math.floor(Math.random() * 100),
      milestones: [
        { id: 1, name: 'Planning', completed: true, completedAt: '2024-01-10T09:00:00Z' },
        { id: 2, name: 'Development', completed: Math.random() > 0.5, completedAt: null },
        { id: 3, name: 'Testing', completed: false, completedAt: null },
        { id: 4, name: 'Review', completed: false, completedAt: null },
        { id: 5, name: 'Deployment', completed: false, completedAt: null }
      ],
      timeSpent: Math.floor(Math.random() * 40) + 10, // hours
      estimatedTime: Math.floor(Math.random() * 20) + 30, // hours
      lastUpdate: new Date().toISOString(),
      comments: [
        {
          id: 1,
          author: 'Nguyễn Văn An',
          comment: 'Đã hoàn thành phần planning, bắt đầu development',
          timestamp: '2024-01-10T09:00:00Z'
        },
        {
          id: 2,
          author: 'Trần Thị Bình',
          comment: 'Cần thêm thời gian để hoàn thành phần testing',
          timestamp: '2024-01-12T14:30:00Z'
        }
      ]
    };
    return this.delayResponse({ data: progressData, success: true });
  }

  async updateTaskProgress(taskId, progressData) {
    return this.delayResponse({ 
      data: { taskId, ...progressData, updatedAt: new Date().toISOString() }, 
      success: true, 
      message: 'Task progress updated successfully' 
    });
  }

  async getEmployeeTaskSummary(employeeId) {
    const summary = {
      employeeId: employeeId,
      totalTasks: Math.floor(Math.random() * 20) + 5,
      completedTasks: Math.floor(Math.random() * 15) + 2,
      inProgressTasks: Math.floor(Math.random() * 8) + 1,
      overdueTasks: Math.floor(Math.random() * 3),
      averageCompletionTime: Math.floor(Math.random() * 10) + 5, // days
      productivityScore: Math.floor(Math.random() * 30) + 70, // percentage
      thisWeekTasks: Math.floor(Math.random() * 5) + 2,
      nextWeekTasks: Math.floor(Math.random() * 6) + 1
    };
    return this.delayResponse({ data: summary, success: true });
  }

  async getTaskNotifications() {
    const notifications = [
      {
        id: 1,
        type: 'task_assigned',
        title: 'Task mới được giao',
        message: 'Bạn đã được giao task "Hero Section Design"',
        taskId: 1,
        timestamp: '2024-01-15T09:00:00Z',
        read: false
      },
      {
        id: 2,
        type: 'deadline_approaching',
        title: 'Deadline sắp đến',
        message: 'Task "Website Design" sẽ hết hạn trong 2 ngày',
        taskId: 2,
        timestamp: '2024-01-15T10:00:00Z',
        read: false
      },
      {
        id: 3,
        type: 'task_completed',
        title: 'Task hoàn thành',
        message: 'Nguyễn Văn An đã hoàn thành task "React Development"',
        taskId: 4,
        timestamp: '2024-01-15T11:00:00Z',
        read: true
      },
      {
        id: 4,
        type: 'leave_request',
        title: 'Yêu cầu nghỉ phép',
        message: 'Trần Thị Bình muốn nghỉ phép ngày mai',
        timestamp: '2024-01-15T12:00:00Z',
        read: false
      }
    ];
    return this.delayResponse({ data: notifications, success: true });
  }

  // Timeline and Calendar APIs
  async getTaskTimeline(year = 2024, month = 10) {
    const timelineData = {
      year: year,
      month: month,
      events: [
        {
          id: 1,
          title: 'Hero Section Design',
          type: 'development',
          startDate: '2024-10-05',
          endDate: '2024-10-12',
          assignee: 'Nguyễn Văn An',
          status: 'in-progress',
          color: '#3B82F6'
        },
        {
          id: 2,
          title: 'Website Design',
          type: 'design',
          startDate: '2024-10-08',
          endDate: '2024-10-20',
          assignee: 'Trần Thị Bình',
          status: 'in-progress',
          color: '#10B981'
        },
        {
          id: 3,
          title: 'Banner Design',
          type: 'design',
          startDate: '2024-10-15',
          endDate: '2024-10-18',
          assignee: 'Lê Minh Chính',
          status: 'pending',
          color: '#F59E0B'
        },
        {
          id: 4,
          title: 'React Development',
          type: 'development',
          startDate: '2024-10-01',
          endDate: '2024-10-10',
          assignee: 'Phạm Thu Cúc',
          status: 'complete',
          color: '#EF4444'
        },
        {
          id: 5,
          title: 'Team Meeting',
          type: 'meeting',
          startDate: '2024-10-15',
          endDate: '2024-10-15',
          assignee: 'All Team',
          status: 'scheduled',
          color: '#8B5CF6'
        }
      ]
    };
    return this.delayResponse({ data: timelineData, success: true });
  }

  async getTaskAnalytics() {
    const analytics = {
      overview: {
        totalTasks: 24,
        completedTasks: 18,
        inProgressTasks: 4,
        overdueTasks: 2,
        completionRate: 75
      },
      productivity: {
        averageCompletionTime: 5.2, // days
        tasksPerEmployee: 4.8,
        efficiencyScore: 87
      },
      departmentStats: [
        { department: 'Development', total: 12, completed: 9, efficiency: 85 },
        { department: 'Design', total: 8, completed: 6, efficiency: 90 },
        { department: 'Marketing', total: 4, completed: 3, efficiency: 80 }
      ],
      monthlyTrends: [
        { month: 'Jan', tasks: 15, completed: 12 },
        { month: 'Feb', tasks: 18, completed: 14 },
        { month: 'Mar', tasks: 22, completed: 18 },
        { month: 'Apr', tasks: 20, completed: 16 },
        { month: 'May', tasks: 25, completed: 20 },
        { month: 'Jun', tasks: 24, completed: 18 }
      ],
      employeePerformance: [
        { name: 'Nguyễn Văn An', tasksCompleted: 8, averageTime: 4.2, score: 92 },
        { name: 'Trần Thị Bình', tasksCompleted: 6, averageTime: 5.1, score: 88 },
        { name: 'Lê Minh Chính', tasksCompleted: 5, averageTime: 6.3, score: 82 },
        { name: 'Phạm Thu Cúc', tasksCompleted: 7, averageTime: 4.8, score: 90 }
      ]
    };
    return this.delayResponse({ data: analytics, success: true });
  }

  async calculateTaskMetrics(taskIds) {
    const metrics = {
      totalEstimatedHours: 0,
      totalActualHours: 0,
      totalCost: 0,
      averageProgress: 0,
      onTimeCompletion: 0,
      overdueTasks: 0,
      efficiencyScore: 0,
      recommendations: [
        'Tăng cường training cho team Design để cải thiện hiệu suất',
        'Phân bổ lại workload để cân bằng giữa các phòng ban',
        'Thiết lập deadline buffer để tránh delay'
      ]
    };

    // Simulate calculations
    taskIds.forEach(() => {
      metrics.totalEstimatedHours += Math.floor(Math.random() * 40) + 20;
      metrics.totalActualHours += Math.floor(Math.random() * 50) + 15;
      metrics.totalCost += Math.floor(Math.random() * 5000000) + 2000000;
    });

    metrics.averageProgress = Math.floor(Math.random() * 30) + 70;
    metrics.onTimeCompletion = Math.floor(Math.random() * 20) + 75;
    metrics.overdueTasks = Math.floor(Math.random() * 5) + 1;
    metrics.efficiencyScore = Math.floor(Math.random() * 20) + 80;

    return this.delayResponse({ data: metrics, success: true });
  }

  // ============================================
  // RECRUITMENT MANAGEMENT APIs
  // ============================================

  async getRecruitmentPositions() {
    const positions = [
      {
        id: 'pos001',
        title: 'Senior Full Stack Developer',
        department: 'IT',
        location: 'Hà Nội',
        type: 'Full-time',
        level: 'Senior',
        salary: '25,000,000 - 35,000,000 VNĐ',
        experience: '3-5 năm',
        openings: 2,
        status: 'active',
        postedDate: '2024-01-10',
        closingDate: '2024-02-28',
        description: 'Phát triển và maintain các hệ thống web application',
        requirements: ['React, Node.js', 'MongoDB, PostgreSQL', 'Git, Docker', 'Agile/Scrum'],
        applicationsCount: 15
      },
      {
        id: 'pos002',
        title: 'HR Manager',
        department: 'Human Resources',
        location: 'TP.HCM',
        type: 'Full-time',
        level: 'Manager',
        salary: '20,000,000 - 30,000,000 VNĐ',
        experience: '5+ năm',
        openings: 1,
        status: 'active',
        postedDate: '2024-01-15',
        closingDate: '2024-03-15',
        description: 'Quản lý toàn bộ hoạt động nhân sự',
        requirements: ['Kinh nghiệm HR', 'Kỹ năng lãnh đạo', 'Quản lý tuyển dụng', 'Xây dựng văn hóa'],
        applicationsCount: 8
      },
      {
        id: 'pos003',
        title: 'Marketing Executive',
        department: 'Marketing',
        location: 'Hà Nội',
        type: 'Full-time',
        level: 'Junior-Mid',
        salary: '12,000,000 - 18,000,000 VNĐ',
        experience: '1-3 năm',
        openings: 3,
        status: 'active',
        postedDate: '2024-01-20',
        closingDate: '2024-02-20',
        description: 'Thực hiện các chiến dịch marketing online/offline',
        requirements: ['Digital Marketing', 'Content Creation', 'SEO/SEM', 'Social Media'],
        applicationsCount: 22
      },
      {
        id: 'pos004',
        title: 'Senior Accountant',
        department: 'Finance',
        location: 'TP.HCM',
        type: 'Full-time',
        level: 'Senior',
        salary: '18,000,000 - 25,000,000 VNĐ',
        experience: '4+ năm',
        openings: 1,
        status: 'closed',
        postedDate: '2023-12-01',
        closingDate: '2024-01-15',
        description: 'Quản lý các hoạt động kế toán và báo cáo tài chính',
        requirements: ['CPA/ACCA', 'Kế toán tổng hợp', 'Thuế', 'ERP Systems'],
        applicationsCount: 12
      }
    ];
    return this.delayResponse({ data: positions, success: true });
  }

  async getRecruitmentPosition(id) {
    const positions = await this.getRecruitmentPositions();
    const position = positions.data.find(p => p.id === id);
    return this.delayResponse({ data: position, success: true });
  }

  async createRecruitmentPosition(positionData) {
    const newPosition = {
      id: this.generateId(),
      ...positionData,
      status: 'active',
      postedDate: new Date().toISOString().split('T')[0],
      applicationsCount: 0
    };
    return this.delayResponse({ data: newPosition, success: true, message: 'Vị trí tuyển dụng đã được tạo' });
  }

  async updateRecruitmentPosition(id, positionData) {
    return this.delayResponse({
      data: { id, ...positionData },
      success: true,
      message: 'Vị trí tuyển dụng đã được cập nhật'
    });
  }

  async deleteRecruitmentPosition(id) {
    return this.delayResponse({
      data: { id },
      success: true,
      message: 'Vị trí tuyển dụng đã được xóa'
    });
  }

  async getApplications() {
    const applications = [
      {
        id: 'app001',
        positionId: 'pos001',
        positionTitle: 'Senior Full Stack Developer',
        candidateName: 'Nguyễn Minh Tuấn',
        email: 'tuannm@email.com',
        phone: '0912345678',
        experience: '4 năm',
        education: 'Đại học Bách Khoa',
        status: 'new',
        appliedDate: '2024-01-20',
        resumeUrl: '/resumes/nguyen-minh-tuan.pdf',
        coverLetter: 'Tôi rất quan tâm đến vị trí này...',
        rating: null,
        interviewDate: null,
        notes: ''
      },
      {
        id: 'app002',
        positionId: 'pos001',
        positionTitle: 'Senior Full Stack Developer',
        candidateName: 'Trần Văn Bình',
        email: 'binhtv@email.com',
        phone: '0923456789',
        experience: '5 năm',
        education: 'Đại học Công Nghệ',
        status: 'interview',
        appliedDate: '2024-01-18',
        resumeUrl: '/resumes/tran-van-binh.pdf',
        coverLetter: 'Với kinh nghiệm 5 năm...',
        rating: 4,
        interviewDate: '2024-01-25',
        notes: 'Ứng viên tiềm năng, có kinh nghiệm tốt'
      },
      {
        id: 'app003',
        positionId: 'pos002',
        positionTitle: 'HR Manager',
        candidateName: 'Lê Thu Hương',
        email: 'huonglt@email.com',
        phone: '0934567890',
        experience: '6 năm',
        education: 'Đại học Kinh Tế',
        status: 'offered',
        appliedDate: '2024-01-16',
        resumeUrl: '/resumes/le-thu-huong.pdf',
        coverLetter: 'Tôi có 6 năm kinh nghiệm trong lĩnh vực HR...',
        rating: 5,
        interviewDate: '2024-01-22',
        notes: 'Xuất sắc, đề xuất tuyển dụng'
      },
      {
        id: 'app004',
        positionId: 'pos003',
        positionTitle: 'Marketing Executive',
        candidateName: 'Phạm Thị Mai',
        email: 'maipt@email.com',
        phone: '0945678901',
        experience: '2 năm',
        education: 'Đại học Ngoại Thương',
        status: 'rejected',
        appliedDate: '2024-01-21',
        resumeUrl: '/resumes/pham-thi-mai.pdf',
        coverLetter: 'Tôi đam mê marketing...',
        rating: 2,
        interviewDate: null,
        notes: 'Chưa đủ kinh nghiệm cho vị trí này'
      }
    ];
    return this.delayResponse({ data: applications, success: true });
  }

  async getApplication(id) {
    const applications = await this.getApplications();
    const application = applications.data.find(a => a.id === id);
    return this.delayResponse({ data: application, success: true });
  }

  async updateApplicationStatus(id, status, notes = '') {
    return this.delayResponse({
      data: { id, status, notes },
      success: true,
      message: `Trạng thái ứng tuyển đã được cập nhật thành ${status}`
    });
  }

  async scheduleInterview(id, interviewDate, interviewTime, location, interviewers) {
    return this.delayResponse({
      data: { id, interviewDate, interviewTime, location, interviewers },
      success: true,
      message: 'Lịch phỏng vấn đã được đặt'
    });
  }

  async rateCandidate(id, rating, feedback) {
    return this.delayResponse({
      data: { id, rating, feedback },
      success: true,
      message: 'Đánh giá ứng viên đã được lưu'
    });
  }

  // ============================================
  // DOCUMENTS MANAGEMENT APIs
  // ============================================

  async getDocuments() {
    const documents = [
      {
        id: 'doc001',
        name: 'Employee Handbook 2024.pdf',
        category: 'policy',
        type: 'pdf',
        size: '2.5 MB',
        uploadedBy: 'admin',
        uploadedDate: '2024-01-05',
        description: 'Sổ tay nhân viên năm 2024',
        url: '/documents/employee-handbook-2024.pdf',
        accessLevel: 'all',
        downloads: 45,
        version: '1.0'
      },
      {
        id: 'doc002',
        name: 'Leave Policy.pdf',
        category: 'policy',
        type: 'pdf',
        size: '1.2 MB',
        uploadedBy: 'hr_manager',
        uploadedDate: '2024-01-10',
        description: 'Chính sách nghỉ phép',
        url: '/documents/leave-policy.pdf',
        accessLevel: 'all',
        downloads: 38,
        version: '2.0'
      },
      {
        id: 'doc003',
        name: 'Payroll Guidelines.docx',
        category: 'finance',
        type: 'docx',
        size: '850 KB',
        uploadedBy: 'accountant',
        uploadedDate: '2024-01-12',
        description: 'Hướng dẫn tính lương',
        url: '/documents/payroll-guidelines.docx',
        accessLevel: 'admin,accountant',
        downloads: 22,
        version: '1.5'
      },
      {
        id: 'doc004',
        name: 'Company Organization Chart.png',
        category: 'company',
        type: 'png',
        size: '450 KB',
        uploadedBy: 'admin',
        uploadedDate: '2024-01-08',
        description: 'Sơ đồ tổ chức công ty',
        url: '/documents/org-chart.png',
        accessLevel: 'all',
        downloads: 67,
        version: '1.0'
      },
      {
        id: 'doc005',
        name: 'Training Schedule Q1 2024.xlsx',
        category: 'training',
        type: 'xlsx',
        size: '320 KB',
        uploadedBy: 'hr_manager',
        uploadedDate: '2024-01-15',
        description: 'Lịch đào tạo quý 1/2024',
        url: '/documents/training-q1-2024.xlsx',
        accessLevel: 'all',
        downloads: 28,
        version: '1.0'
      },
      {
        id: 'doc006',
        name: 'Performance Review Template.docx',
        category: 'hr',
        type: 'docx',
        size: '680 KB',
        uploadedBy: 'hr_manager',
        uploadedDate: '2024-01-18',
        description: 'Mẫu đánh giá hiệu suất',
        url: '/documents/performance-review-template.docx',
        accessLevel: 'manager,admin',
        downloads: 15,
        version: '1.0'
      }
    ];
    return this.delayResponse({ data: documents, success: true });
  }

  async getDocumentsByCategory(category) {
    const allDocs = await this.getDocuments();
    const filtered = allDocs.data.filter(doc => doc.category === category);
    return this.delayResponse({ data: filtered, success: true });
  }

  async uploadDocument(documentData) {
    const newDocument = {
      id: this.generateId(),
      ...documentData,
      uploadedDate: new Date().toISOString().split('T')[0],
      downloads: 0,
      version: '1.0'
    };
    return this.delayResponse({ data: newDocument, success: true, message: 'Tài liệu đã được tải lên' });
  }

  async deleteDocument(id) {
    return this.delayResponse({
      data: { id },
      success: true,
      message: 'Tài liệu đã được xóa'
    });
  }

  async downloadDocument(id) {
    return this.delayResponse({
      data: { id, url: `/downloads/${id}` },
      success: true,
      message: 'Đang tải xuống tài liệu'
    });
  }

  async updateDocument(id, documentData) {
    return this.delayResponse({
      data: { id, ...documentData },
      success: true,
      message: 'Tài liệu đã được cập nhật'
    });
  }

  // ============================================
  // SETTINGS MANAGEMENT APIs
  // ============================================

  async getSettings() {
    const settings = {
      profile: {
        name: 'Admin User',
        email: 'admin@company.com',
        phone: '0901234567',
        avatar: '/api/placeholder/150/150',
        position: 'System Administrator',
        department: 'IT'
      },
      company: {
        name: 'ABC Corporation',
        address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        phone: '028-12345678',
        email: 'contact@company.com',
        website: 'https://company.com',
        taxCode: '0123456789',
        logo: '/api/placeholder/200/80'
      },
      workingHours: {
        startTime: '08:00',
        endTime: '17:00',
        lunchBreak: '12:00-13:00',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      },
      payroll: {
        currency: 'VND',
        paymentDay: 5,
        socialInsurance: 8,
        healthInsurance: 1.5,
        unemploymentInsurance: 1,
        overtimeRate: 1.5
      },
      leave: {
        annualLeave: 12,
        sickLeave: 5,
        maternityLeave: 180,
        carryForward: true,
        maxCarryForward: 5
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        leaveApproval: true,
        payrollReminder: true,
        birthdayReminder: true
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiry: 90,
        loginAttempts: 5
      }
    };
    return this.delayResponse({ data: settings, success: true });
  }

  async updateSettings(section, data) {
    return this.delayResponse({
      data: { section, ...data },
      success: true,
      message: 'Cài đặt đã được cập nhật'
    });
  }

  async updateProfile(profileData) {
    return this.delayResponse({
      data: profileData,
      success: true,
      message: 'Thông tin cá nhân đã được cập nhật'
    });
  }

  async changePassword(oldPassword, newPassword) {
    // Simulate password validation
    if (oldPassword === 'admin123') {
      return this.delayResponse({
        success: true,
        message: 'Mật khẩu đã được thay đổi'
      });
    } else {
      return this.delayResponse({
        success: false,
        message: 'Mật khẩu cũ không đúng'
      });
    }
  }

  // ============================================
  // ADMIN BENEFITS MANAGEMENT APIs
  // ============================================

  async getBenefits() {
    const benefits = [
      {
        id: 'ben001',
        name: 'Bảo hiểm y tế',
        nameLatin: 'Health Insurance',
        type: 'insurance',
        description: 'Bảo hiểm y tế toàn diện cho nhân viên và gia đình',
        coverage: '100% phí khám chữa bệnh',
        eligibility: 'Tất cả nhân viên chính thức',
        cost: '1,500,000 VNĐ/tháng',
        provider: 'Bảo Việt',
        status: 'active',
        startDate: '2024-01-01',
        enrolledCount: 142
      },
      {
        id: 'ben002',
        name: 'Bảo hiểm nhân thọ',
        nameLatin: 'Life Insurance',
        type: 'insurance',
        description: 'Bảo hiểm nhân thọ với mức bồi thường cao',
        coverage: 'Bồi thường 500 triệu VNĐ',
        eligibility: 'Nhân viên làm việc trên 1 năm',
        cost: '500,000 VNĐ/tháng',
        provider: 'Prudential',
        status: 'active',
        startDate: '2024-01-01',
        enrolledCount: 98
      },
      {
        id: 'ben003',
        name: 'Phụ cấp đi lại',
        nameLatin: 'Transportation Allowance',
        type: 'allowance',
        description: 'Hỗ trợ chi phí đi lại hàng tháng',
        coverage: '1,000,000 VNĐ/tháng',
        eligibility: 'Tất cả nhân viên',
        cost: 'Miễn phí',
        provider: 'Công ty',
        status: 'active',
        startDate: '2024-01-01',
        enrolledCount: 156
      },
      {
        id: 'ben004',
        name: 'Phụ cấp ăn trưa',
        nameLatin: 'Lunch Allowance',
        type: 'allowance',
        description: 'Hỗ trợ chi phí ăn trưa',
        coverage: '800,000 VNĐ/tháng',
        eligibility: 'Tất cả nhân viên',
        cost: 'Miễn phí',
        provider: 'Công ty',
        status: 'active',
        startDate: '2024-01-01',
        enrolledCount: 156
      },
      {
        id: 'ben005',
        name: 'Khóa học ngoại ngữ',
        nameLatin: 'Language Course',
        type: 'education',
        description: 'Tài trợ 100% học phí khóa học tiếng Anh',
        coverage: 'Tối đa 5,000,000 VNĐ/năm',
        eligibility: 'Nhân viên có performance tốt',
        cost: 'Miễn phí',
        provider: 'Các trung tâm hợp tác',
        status: 'active',
        startDate: '2024-01-01',
        enrolledCount: 45
      },
      {
        id: 'ben006',
        name: 'Thẻ thành viên phòng gym',
        nameLatin: 'Gym Membership',
        type: 'wellness',
        description: 'Tài trợ 50% phí thành viên phòng gym',
        coverage: 'Tối đa 1,000,000 VNĐ/tháng',
        eligibility: 'Tất cả nhân viên',
        cost: '500,000 VNĐ/tháng (đóng góp 50%)',
        provider: 'California Fitness, Yoga Plus',
        status: 'active',
        startDate: '2024-01-01',
        enrolledCount: 67
      }
    ];
    return this.delayResponse({ data: benefits, success: true });
  }

  async getBenefit(id) {
    const benefits = await this.getBenefits();
    const benefit = benefits.data.find(b => b.id === id);
    return this.delayResponse({ data: benefit, success: true });
  }

  async createBenefit(benefitData) {
    const newBenefit = {
      id: this.generateId(),
      ...benefitData,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      enrolledCount: 0
    };
    return this.delayResponse({ data: newBenefit, success: true, message: 'Phúc lợi đã được tạo' });
  }

  async updateBenefit(id, benefitData) {
    return this.delayResponse({
      data: { id, ...benefitData },
      success: true,
      message: 'Phúc lợi đã được cập nhật'
    });
  }

  async deleteBenefit(id) {
    return this.delayResponse({
      data: { id },
      success: true,
      message: 'Phúc lợi đã được xóa'
    });
  }

  async enrollBenefit(employeeId, benefitId) {
    return this.delayResponse({
      data: { employeeId, benefitId },
      success: true,
      message: 'Đã đăng ký phúc lợi thành công'
    });
  }

  async unenrollBenefit(employeeId, benefitId) {
    return this.delayResponse({
      data: { employeeId, benefitId },
      success: true,
      message: 'Đã hủy đăng ký phúc lợi'
    });
  }

  // ============================================
  // EMPLOYEE PORTAL APIs
  // ============================================

  async getEmployeeProfile(employeeId) {
    const profile = {
      id: employeeId,
      name: 'Nguyễn Văn An',
      email: 'nguyenvanan@company.com',
      phone: '0901234567',
      avatar: '/api/placeholder/150/150',
      position: 'Software Developer',
      department: 'IT',
      hireDate: '2023-01-15',
      birthday: '1995-05-20',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      emergencyContact: {
        name: 'Nguyễn Thị B',
        relationship: 'Vợ',
        phone: '0987654321'
      },
      education: 'Đại học Bách Khoa',
      skills: ['React', 'Node.js', 'MongoDB', 'Docker'],
      languages: ['Vietnamese (Native)', 'English (Fluent)']
    };
    return this.delayResponse({ data: profile, success: true });
  }

  async getEmployeeAttendance(employeeId, month, year) {
    const attendanceRecords = Array.from({ length: 20 }, (_, i) => ({
      id: this.generateId(),
      date: `${year}-${String(month).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`,
      checkIn: `08:${Math.floor(Math.random() * 60)}`,
      checkOut: `17:${Math.floor(Math.random() * 60)}`,
      status: ['present', 'late', 'early'][Math.floor(Math.random() * 3)],
      hoursWorked: 8 + Math.random(),
      overtime: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0
    }));

    const summary = {
      totalDays: 22,
      presentDays: 18,
      lateDays: 2,
      absentDays: 2,
      overtimeHours: 5,
      attendanceRate: 82
    };

    return this.delayResponse({ data: { records: attendanceRecords, summary }, success: true });
  }

  async getEmployeeLeaves(employeeId) {
    const leaves = [
      {
        id: 'leave001',
        type: 'annual',
        typeName: 'Nghỉ phép năm',
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        days: 5,
        reason: 'Du lịch gia đình',
        status: 'approved',
        submittedDate: '2024-01-15',
        approvedBy: 'Manager',
        approvedDate: '2024-01-16'
      },
      {
        id: 'leave002',
        type: 'sick',
        typeName: 'Nghỉ ốm',
        startDate: '2024-01-20',
        endDate: '2024-01-22',
        days: 3,
        reason: 'Bị cảm',
        status: 'pending',
        submittedDate: '2024-01-18',
        approvedBy: null,
        approvedDate: null
      }
    ];

    const balance = {
      annual: { total: 12, used: 5, remaining: 7 },
      sick: { total: 5, used: 3, remaining: 2 },
      unpaid: { used: 0 }
    };

    return this.delayResponse({ data: { leaves, balance }, success: true });
  }

  async getEmployeePayroll(employeeId, month, year) {
    const payroll = {
      employeeId: employeeId,
      employeeName: 'Nguyễn Văn An',
      month: `${year}-${String(month).padStart(2, '0')}`,
      basicSalary: 15000000,
      allowances: {
        transportation: 1000000,
        lunch: 800000,
        housing: 2000000,
        other: 500000
      },
      totalAllowances: 4300000,
      overtime: 500000,
      bonus: 1000000,
      grossSalary: 20800000,
      deductions: {
        socialInsurance: 1200000,
        healthInsurance: 225000,
        unemploymentInsurance: 150000,
        personalIncomeTax: 1500000,
        other: 200000
      },
      totalDeductions: 3275000,
      netSalary: 17525000,
      status: 'paid',
      paymentDate: '2024-01-05'
    };
    return this.delayResponse({ data: payroll, success: true });
  }

  async getEmployeeTasks(employeeId) {
    const tasks = [
      {
        id: 'task001',
        title: 'Phát triển tính năng login',
        description: 'Implement tính năng đăng nhập với OAuth',
        status: 'in-progress',
        priority: 'high',
        startDate: '2024-01-15',
        dueDate: '2024-01-25',
        progress: 60,
        assignedBy: 'Project Manager'
      },
      {
        id: 'task002',
        title: 'Fix bug trang dashboard',
        description: 'Sửa lỗi hiển thị biểu đồ',
        status: 'pending',
        priority: 'medium',
        startDate: '2024-01-20',
        dueDate: '2024-01-22',
        progress: 0,
        assignedBy: 'Team Lead'
      },
      {
        id: 'task003',
        title: 'Viết unit tests',
        description: 'Viết tests cho module authentication',
        status: 'complete',
        priority: 'low',
        startDate: '2024-01-10',
        dueDate: '2024-01-15',
        progress: 100,
        assignedBy: 'QA Manager'
      }
    ];

    const summary = {
      total: 15,
      pending: 3,
      inProgress: 5,
      complete: 7,
      overdue: 1
    };

    return this.delayResponse({ data: { tasks, summary }, success: true });
  }

  async getEmployeePerformance(employeeId) {
    const performance = {
      employeeId: employeeId,
      period: '2024-Q1',
      overallRating: 4.2,
      ratings: {
        quality: 4.5,
        productivity: 4.0,
        teamwork: 4.3,
        communication: 4.0,
        innovation: 4.2
      },
      achievements: [
        'Hoàn thành dự án ABC đúng hạn',
        'Mentor 2 nhân viên mới',
        'Cải thiện performance hệ thống 30%'
      ],
      areasForImprovement: [
        'Kỹ năng thuyết trình',
        'Quản lý thời gian'
      ],
      goals: [
        { id: 1, description: 'Hoàn thành khóa học React Advanced', progress: 60, dueDate: '2024-03-31' },
        { id: 2, description: 'Tham gia 2 tech talks', progress: 50, dueDate: '2024-03-31' }
      ],
      managerFeedback: 'An là một nhân viên xuất sắc với kỹ năng kỹ thuật tốt. Cần cải thiện kỹ năng giao tiếp.',
      nextReviewDate: '2024-04-01'
    };
    return this.delayResponse({ data: performance, success: true });
  }

  async getEmployeeTraining(employeeId) {
    const trainings = [
      {
        id: 'train001',
        title: 'React Advanced',
        provider: 'Udemy',
        type: 'online',
        status: 'in-progress',
        progress: 60,
        startDate: '2024-01-10',
        endDate: '2024-03-31',
        cost: 2000000,
        certificate: false
      },
      {
        id: 'train002',
        title: 'Leadership Skills',
        provider: 'Internal HR',
        type: 'offline',
        status: 'completed',
        progress: 100,
        startDate: '2023-11-01',
        endDate: '2023-11-30',
        cost: 0,
        certificate: true,
        certificateUrl: '/certificates/leadership-2023.pdf'
      },
      {
        id: 'train003',
        title: 'AWS Solutions Architect',
        provider: 'AWS Training',
        type: 'online',
        status: 'registered',
        progress: 0,
        startDate: '2024-02-01',
        endDate: '2024-05-31',
        cost: 5000000,
        certificate: false
      }
    ];

    const summary = {
      completed: 5,
      inProgress: 2,
      registered: 1,
      totalHours: 120,
      certificates: 3
    };

    return this.delayResponse({ data: { trainings, summary }, success: true });
  }

  async getEmployeeDocuments(employeeId) {
    const documents = [
      {
        id: 'edoc001',
        name: 'Hợp đồng lao động.pdf',
        category: 'contract',
        uploadedDate: '2023-01-15',
        size: '1.2 MB',
        url: '/employee-docs/contract.pdf'
      },
      {
        id: 'edoc002',
        name: 'Bảng lương tháng 12-2023.pdf',
        category: 'payroll',
        uploadedDate: '2024-01-05',
        size: '450 KB',
        url: '/employee-docs/payslip-12-2023.pdf'
      },
      {
        id: 'edoc003',
        name: 'Giấy chứng nhận đào tạo.pdf',
        category: 'certificate',
        uploadedDate: '2023-11-30',
        size: '800 KB',
        url: '/employee-docs/training-cert.pdf'
      }
    ];
    return this.delayResponse({ data: documents, success: true });
  }

  // ============================================
  // TASK DELEGATION APIs
  // ============================================

  async delegateTasks(fromEmployeeId, toEmployeeId, taskIds, startDate, endDate, reason) {
    const delegation = {
      id: this.generateId(),
      fromEmployeeId,
      toEmployeeId,
      taskIds,
      startDate,
      endDate,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    return this.delayResponse({
      data: delegation,
      success: true,
      message: 'Yêu cầu ủy quyền công việc đã được gửi'
    });
  }

  async getDelegations(employeeId) {
    const delegations = [
      {
        id: 'del001',
        fromEmployee: { id: 'emp001', name: 'Nguyễn Văn An' },
        toEmployee: { id: 'emp002', name: 'Trần Thị Bình' },
        tasks: [
          { id: 'task001', title: 'Review code PR #123' },
          { id: 'task002', title: 'Update documentation' }
        ],
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        reason: 'Nghỉ phép',
        status: 'approved',
        createdAt: '2024-01-20'
      }
    ];
    return this.delayResponse({ data: delegations, success: true });
  }

  async approveDelegation(delegationId) {
    return this.delayResponse({
      data: { id: delegationId, status: 'approved' },
      success: true,
      message: 'Ủy quyền đã được phê duyệt'
    });
  }

  async rejectDelegation(delegationId, reason) {
    return this.delayResponse({
      data: { id: delegationId, status: 'rejected', reason },
      success: true,
      message: 'Ủy quyền đã bị từ chối'
    });
  }

  // ============================================
  // ENHANCED LEAVE MANAGEMENT APIs
  // ============================================

  async getLeaveBalance(employeeId) {
    const balance = {
      employeeId: employeeId,
      year: 2024,
      annual: {
        total: 12,
        used: 5,
        pending: 3,
        remaining: 4,
        carriedForward: 2
      },
      sick: {
        total: 5,
        used: 2,
        pending: 0,
        remaining: 3
      },
      unpaid: {
        used: 0
      },
      special: {
        marriage: { available: true, days: 3 },
        maternity: { available: false },
        paternity: { available: true, days: 5 },
        bereavement: { available: true, days: 3 }
      }
    };
    return this.delayResponse({ data: balance, success: true });
  }

  async getLeaveHistory(employeeId, year) {
    const history = [
      {
        id: 'lh001',
        type: 'annual',
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        days: 3,
        status: 'approved',
        approvedBy: 'Manager',
        approvedDate: '2024-01-10'
      },
      {
        id: 'lh002',
        type: 'sick',
        startDate: '2024-01-22',
        endDate: '2024-01-24',
        days: 3,
        status: 'approved',
        approvedBy: 'Manager',
        approvedDate: '2024-01-21'
      }
    ];
    return this.delayResponse({ data: history, success: true });
  }

  async approveLeaveRequest(leaveId, approverId, comments = '') {
    return this.delayResponse({
      data: {
        leaveId,
        status: 'approved',
        approverId,
        approvedDate: new Date().toISOString(),
        comments
      },
      success: true,
      message: 'Đơn nghỉ phép đã được phê duyệt'
    });
  }

  async rejectLeaveRequest(leaveId, approverId, reason) {
    return this.delayResponse({
      data: {
        leaveId,
        status: 'rejected',
        approverId,
        rejectedDate: new Date().toISOString(),
        reason
      },
      success: true,
      message: 'Đơn nghỉ phép đã bị từ chối'
    });
  }

  async cancelLeaveRequest(leaveId, reason) {
    return this.delayResponse({
      data: { leaveId, status: 'cancelled', reason },
      success: true,
      message: 'Đơn nghỉ phép đã được hủy'
    });
  }

  // ============================================
  // SUPPORT & HELP APIs
  // ============================================

  async getSupportTickets(employeeId) {
    const tickets = [
      {
        id: 'ticket001',
        subject: 'Không thể truy cập hệ thống payroll',
        category: 'technical',
        priority: 'high',
        status: 'open',
        description: 'Tôi không thể đăng nhập vào trang payroll',
        createdDate: '2024-01-20',
        lastUpdate: '2024-01-21',
        assignedTo: 'IT Support'
      },
      {
        id: 'ticket002',
        subject: 'Câu hỏi về chính sách nghỉ phép',
        category: 'hr',
        priority: 'medium',
        status: 'resolved',
        description: 'Tôi muốn biết về việc chuyển đổi ngày phép sang năm sau',
        createdDate: '2024-01-18',
        lastUpdate: '2024-01-19',
        assignedTo: 'HR Department',
        resolution: 'Bạn có thể chuyển tối đa 5 ngày phép sang năm sau'
      }
    ];
    return this.delayResponse({ data: tickets, success: true });
  }

  async createSupportTicket(ticketData) {
    const newTicket = {
      id: this.generateId(),
      ...ticketData,
      status: 'open',
      createdDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString()
    };
    return this.delayResponse({
      data: newTicket,
      success: true,
      message: 'Yêu cầu hỗ trợ đã được tạo'
    });
  }

  async updateSupportTicket(ticketId, updates) {
    return this.delayResponse({
      data: { ticketId, ...updates, lastUpdate: new Date().toISOString() },
      success: true,
      message: 'Yêu cầu hỗ trợ đã được cập nhật'
    });
  }

  async getFAQs() {
    const faqs = [
      {
        id: 'faq001',
        category: 'leave',
        question: 'Làm thế nào để xin nghỉ phép?',
        answer: 'Bạn có thể tạo đơn nghỉ phép trong module "Leave Management" hoặc truy cập Employee Portal > Leave.'
      },
      {
        id: 'faq002',
        category: 'payroll',
        question: 'Khi nào tôi nhận được lương?',
        answer: 'Lương được trả vào ngày 5 hàng tháng. Nếu ngày 5 là cuối tuần, lương sẽ được trả vào thứ 6 trước đó.'
      },
      {
        id: 'faq003',
        category: 'attendance',
        question: 'Tôi quên chấm công thì làm sao?',
        answer: 'Vui lòng liên hệ với quản lý trực tiếp hoặc HR để điều chỉnh chấm công.'
      }
    ];
    return this.delayResponse({ data: faqs, success: true });
  }
}

// Create singleton instance
const fakeApi = new FakeApiService();

export default fakeApi;
