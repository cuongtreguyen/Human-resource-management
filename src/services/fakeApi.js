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
        name: 'Nguyễn Văn An',
        email: 'nguyenvanan@company.com',
        position: 'Software Developer',
        department: 'IT',
        phone: '0901234567',
        status: 'active',
        avatar: '/api/placeholder/150/150',
        hireDate: '2023-01-15',
        salary: 15000000
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
        salary: 20000000
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
        salary: 12000000
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
        salary: 13000000
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
        salary: 14000000
      }
    ];
    return this.delayResponse({ data: employees, success: true });
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
}

// Create singleton instance
const fakeApi = new FakeApiService();

export default fakeApi;
