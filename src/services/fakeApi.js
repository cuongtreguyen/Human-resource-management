// Fake API Service for HR Management System
// This provides mock data and simulated API responses

// ============================================
// SHARED DATA STORES (để đồng bộ giữa Employee và Admin)
// ============================================

// Employee Evaluations - Shared store (Manager tạo, Employee xem)
let evaluationsStore = [
  {
    id: 'eval001',
    employeeId: 'emp001',
    employeeName: 'Trần Ngọc Hải',
    department: 'Công nghệ thông tin',
    period: 'Quý 4/2024',
    reviewDate: '2024-10-15',
    workPerformance: 4,
    teamwork: 4,
    attitude: 5,
    overallRating: 4.3,
    strengths: 'Làm việc chăm chỉ, có tinh thần trách nhiệm cao. Hoàn thành tốt các nhiệm vụ được giao. Có khả năng giải quyết vấn đề tốt.',
    improvements: 'Cần cải thiện kỹ năng giao tiếp với khách hàng và trình bày ý tưởng trước nhóm.',
    comments: 'Nhân viên có tiềm năng phát triển tốt, cần tiếp tục phát huy điểm mạnh và cải thiện kỹ năng mềm.',
    reviewer: 'Nguyễn Văn Quản Lý',
    reviewerRole: 'manager',
    createdAt: '2024-10-15T10:30:00Z'
  },
  {
    id: 'eval002',
    employeeId: 'emp001',
    employeeName: 'Trần Ngọc Hải',
    department: 'Công nghệ thông tin',
    period: 'Quý 3/2024',
    reviewDate: '2024-07-15',
    workPerformance: 4,
    teamwork: 3,
    attitude: 4,
    overallRating: 3.7,
    strengths: 'Có khả năng tự học và nghiên cứu công nghệ mới. Tiếp thu nhanh, code sạch và có tổ chức.',
    improvements: 'Cần nâng cao kỹ năng làm việc nhóm và chia sẻ kiến thức với đồng nghiệp.',
    comments: 'Đã có sự tiến bộ so với kỳ trước, cần tiếp tục phát triển kỹ năng teamwork.',
    reviewer: 'Nguyễn Văn Quản Lý',
    reviewerRole: 'manager',
    createdAt: '2024-07-15T14:00:00Z'
  },
  {
    id: 'eval003',
    employeeId: 'emp001',
    employeeName: 'Trần Ngọc Hải',
    department: 'Công nghệ thông tin',
    period: 'Quý 2/2024',
    reviewDate: '2024-04-15',
    workPerformance: 3,
    teamwork: 4,
    attitude: 4,
    overallRating: 3.7,
    strengths: 'Nhiệt tình trong công việc, sẵn sàng hỗ trợ đồng nghiệp khi cần.',
    improvements: 'Cần cải thiện kỹ năng quản lý thời gian và ưu tiên công việc.',
    comments: 'Cần nỗ lực hơn trong việc hoàn thành deadline.',
    reviewer: 'Nguyễn Văn Quản Lý',
    reviewerRole: 'manager',
    createdAt: '2024-04-15T09:00:00Z'
  },
  {
    id: 'eval004',
    employeeId: 'emp002',
    employeeName: 'Trần Thị Bình',
    department: 'Nhân sự',
    period: 'Quý 4/2024',
    reviewDate: '2024-10-15',
    workPerformance: 5,
    teamwork: 5,
    attitude: 5,
    overallRating: 5.0,
    strengths: 'Xuất sắc trong quản lý nhân sự, kỹ năng giao tiếp tốt, giải quyết xung đột hiệu quả.',
    improvements: 'Có thể phát triển thêm về chiến lược HR và coaching.',
    comments: 'Nhân viên xuất sắc, xứng đáng được xem xét thăng chức.',
    reviewer: 'Nguyễn Văn Quản Lý',
    reviewerRole: 'manager',
    createdAt: '2024-10-15T11:00:00Z'
  }
];

// Support Tickets - Shared store
// Support Tickets Flow: pending → forwarded → processing → admin_resolved → notified
let supportTicketsStore = [
  {
    id: 'ticket001',
    subject: 'Cập nhật số CCCD mới',
    category: 'profile-update',
    status: 'notified', // Đã hoàn thành và thông báo cho nhân viên
    description: 'Tôi vừa đổi CCCD mới, số mới là 001234567890. Vui lòng cập nhật vào hệ thống.',
    createdDate: '2024-01-20',
    lastUpdate: '2024-01-22',
    employeeId: 'emp001',
    employeeName: 'Trần Ngọc Hải',
    assignedTo: 'HR Department',
    adminResponse: 'Đã cập nhật CCCD mới vào hệ thống thành công.',
    managerNote: 'Yêu cầu đã được xử lý. Vui lòng kiểm tra lại thông tin trong Hồ sơ cá nhân của bạn.'
  },
  {
    id: 'ticket002',
    subject: 'Không thể truy cập hệ thống chấm công',
    category: 'technical',
    status: 'admin_resolved', // Admin đã xử lý, chờ Manager thông báo
    description: 'Máy tính của tôi không mở được trang chấm công, báo lỗi 403. Đã thử xóa cache và đổi trình duyệt nhưng vẫn không được.',
    createdDate: '2024-01-21',
    lastUpdate: '2024-01-21',
    employeeId: 'emp002',
    employeeName: 'Trần Thị Bình',
    assignedTo: 'IT Support',
    adminResponse: 'Đã reset quyền truy cập cho tài khoản. Vui lòng đăng nhập lại.'
  },
  {
    id: 'ticket003',
    subject: 'Yêu cầu cấp lại thẻ nhân viên',
    category: 'other',
    status: 'processing', // Admin đang xử lý
    description: 'Thẻ nhân viên của tôi bị mất. Xin phép được cấp lại thẻ mới.',
    createdDate: '2024-01-22',
    lastUpdate: '2024-01-22',
    employeeId: 'emp003',
    employeeName: 'Lê Văn Cường',
    assignedTo: 'HR Department'
  },
  {
    id: 'ticket004',
    subject: 'Hỏi về chế độ bảo hiểm thai sản',
    category: 'benefits',
    status: 'forwarded', // Manager đã chuyển lên Admin
    description: 'Tôi muốn hỏi về chế độ bảo hiểm thai sản và các giấy tờ cần chuẩn bị.',
    createdDate: '2024-01-23',
    lastUpdate: '2024-01-23',
    employeeId: 'emp004',
    employeeName: 'Nguyễn Thị Dung',
    assignedTo: 'HR Department'
  },
  {
    id: 'ticket005',
    subject: 'Yêu cầu điều chỉnh lương tháng 12',
    category: 'payroll',
    status: 'pending', // Mới tạo, chờ Manager xem xét
    description: 'Lương tháng 12 của tôi bị thiếu phụ cấp đi lại. Xin kiểm tra và điều chỉnh.',
    createdDate: '2024-01-24',
    lastUpdate: '2024-01-24',
    employeeId: 'emp005',
    employeeName: 'Phạm Văn Em',
    assignedTo: 'HR Department'
  }
];

// Attendance Store - Shared store for attendance records
let attendanceStore = [];

// Initialize attendance store with sample data
const initializeAttendanceStore = () => {
  const today = new Date();
  const employees = [
    { id: 'emp001', name: 'Trần Ngọc Hải', department: 'Công nghệ thông tin' },
    { id: 'emp002', name: 'Trần Thị Bình', department: 'Nhân sự' },
    { id: 'emp003', name: 'Lê Văn Cường', department: 'Tài chính' },
    { id: 'emp004', name: 'Nguyễn Thị Dung', department: 'Marketing' },
    { id: 'emp005', name: 'Phạm Văn Em', department: 'Kinh doanh' }
  ];

  // Generate attendance data for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();

    employees.forEach(emp => {
      // Skip weekends for some employees
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Some employees work on weekends
        if (Math.random() > 0.7) {
          const checkIn = `0${8 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
          const checkOut = `${17 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
          attendanceStore.push({
            id: `att_${emp.id}_${dateStr}`,
            employee_id: emp.id,
            name: emp.name,
            department: emp.department,
            date: dateStr,
            check_in: checkIn,
            check_out: checkOut
          });
        }
      } else {
        // Weekday attendance
        const isAbsent = Math.random() < 0.1; // 10% absent rate
        if (!isAbsent) {
          const isLate = Math.random() < 0.2; // 20% late rate
          const checkIn = isLate 
            ? `0${9 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
            : `0${8 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
          
          const hasOvertime = Math.random() < 0.3; // 30% overtime rate
          const checkOut = hasOvertime
            ? `${18 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
            : `${17 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
          
          attendanceStore.push({
            id: `att_${emp.id}_${dateStr}`,
            employee_id: emp.id,
            name: emp.name,
            department: emp.department,
            date: dateStr,
            check_in: checkIn,
            check_out: checkOut
          });
        } else {
          // Absent
          attendanceStore.push({
            id: `att_${emp.id}_${dateStr}`,
            employee_id: emp.id,
            name: emp.name,
            department: emp.department,
            date: dateStr,
            check_in: null,
            check_out: null
          });
        }
      }
    });
  }
};

// Initialize on first load
if (attendanceStore.length === 0) {
  initializeAttendanceStore();
}

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
        position: 'Lập trình viên',
        department: 'Công nghệ thông tin',
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
        idNumber: '001095012345',
        idCardIssueDate: '2015-06-01',
        idCardIssuePlace: 'Công an TP. Hà Nội',
        address: '123 Đường Láng, Đống Đa, Hà Nội',
        permanentAddress: '123 Đường Láng, Đống Đa, Hà Nội',
        temporaryAddress: '',
        personalEmail: 'tranngochai.personal@gmail.com',
        taxCode: '0123456789',
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
        emergencyContactName: 'Nguyễn Văn Bình',
        emergencyContactRelationship: 'Cha',
        emergencyContactPhone: '0912345678',
        // Bank Information
        bankAccount: '1234567890',
        bankName: 'Vietcombank',
        bankBranch: 'Chi nhánh Hà Nội',
        // Work Schedule
        timeIn: '08:00',
        timeOut: '17:00',
        shift: 'Ca sáng'
      },
      {
        id: 'emp002',
        name: 'Trần Thị Bình',
        email: 'tranthibinh@company.com',
        position: 'Quản lý nhân sự',
        department: 'Nhân sự',
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
        idNumber: '001090067890',
        idCardIssueDate: '2010-09-01',
        idCardIssuePlace: 'Công an TP. Hồ Chí Minh',
        address: '456 Nguyễn Trãi, Thanh Xuân, Hà Nội',
        permanentAddress: '456 Nguyễn Trãi, Thanh Xuân, Hà Nội',
        temporaryAddress: '',
        personalEmail: 'tranthibinh.personal@gmail.com',
        taxCode: '0123456790',
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
        emergencyContactName: 'Trần Văn Cường',
        emergencyContactRelationship: 'Chồng',
        emergencyContactPhone: '0987654321',
        // Bank Information
        bankAccount: '0987654321',
        bankName: 'Techcombank',
        bankBranch: 'Chi nhánh Cầu Giấy',
        // Work Schedule
        timeIn: '08:00',
        timeOut: '17:00',
        shift: 'Ca sáng'
      },
      {
        id: 'emp003',
        name: 'Lê Minh Chính',
        email: 'leminhchinh@company.com',
        position: 'Chuyên viên Marketing',
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
        idNumber: '001097034567',
        idCardIssueDate: '2017-04-01',
        idCardIssuePlace: 'Công an tỉnh Hải Phòng',
        address: '789 Lê Lợi, Hải Châu, Đà Nẵng',
        permanentAddress: '789 Lê Lợi, Hải Châu, Đà Nẵng',
        temporaryAddress: '',
        personalEmail: 'leminhchinh.personal@gmail.com',
        taxCode: '0123456791',
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
        emergencyContactName: 'Lê Thị Hoa',
        emergencyContactRelationship: 'Mẹ',
        emergencyContactPhone: '0901122334',
        // Bank Information
        bankAccount: '5566778899',
        bankName: 'VPBank',
        bankBranch: 'Chi nhánh Đà Nẵng',
        // Work Schedule
        timeIn: '13:00',
        timeOut: '22:00',
        shift: 'Ca chiều'
      },
      {
        id: 'emp004',
        name: 'Phạm Thu Cúc',
        email: 'phamthucuc@company.com',
        position: 'Kế toán viên',
        department: 'Tài chính',
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
        idNumber: '001093056789',
        idCardIssueDate: '2013-12-01',
        idCardIssuePlace: 'Công an TP. Hà Nội',
        address: '321 Trần Duy Hưng, Cầu Giấy, Hà Nội',
        permanentAddress: '321 Trần Duy Hưng, Cầu Giấy, Hà Nội',
        temporaryAddress: '',
        personalEmail: 'phamthucuc.personal@gmail.com',
        taxCode: '0123456792',
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
        emergencyContactName: 'Phạm Văn Tuấn',
        emergencyContactRelationship: 'Chồng',
        emergencyContactPhone: '0976543210',
        // Bank Information
        bankAccount: '1122334455',
        bankName: 'BIDV',
        bankBranch: 'Chi nhánh Thăng Long',
        // Work Schedule
        timeIn: '08:00',
        timeOut: '17:00',
        shift: 'Ca sáng'
      },
      {
        id: 'emp005',
        name: 'Hoàng Đức Dũng',
        email: 'hoangducdung@company.com',
        position: 'Nhân viên kinh doanh',
        department: 'Kinh doanh',
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
        idNumber: '001096023456',
        idCardIssueDate: '2016-03-01',
        idCardIssuePlace: 'Công an TP. Hồ Chí Minh',
        address: '555 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
        permanentAddress: '555 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
        temporaryAddress: '',
        personalEmail: 'hoangducdung.personal@gmail.com',
        taxCode: '0123456793',
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
        emergencyContactName: 'Hoàng Thị Lan',
        emergencyContactRelationship: 'Mẹ',
        emergencyContactPhone: '0988776655',
        // Bank Information
        bankAccount: '9988776655',
        bankName: 'ACB',
        bankBranch: 'Chi nhánh Sài Gòn',
        // Work Schedule
        timeIn: '08:00',
        timeOut: '17:00',
        shift: 'Ca sáng'
      },
      {
        id: 'mgr001',
        name: 'Nguyễn Văn Quản Lý',
        email: 'manager@company.com',
        position: 'Quản lý phòng IT',
        department: 'IT',
        phone: '0901234599',
        status: 'active',
        avatar: '/api/placeholder/150/150',
        hireDate: '2020-03-15',
        salary: 25000000,
        // Personal Information
        dateOfBirth: '1988-07-15',
        gender: 'Nam',
        nationality: 'Việt Nam',
        idCard: '001088056789',
        idNumber: '001088056789',
        idCardIssueDate: '2008-08-01',
        idCardIssuePlace: 'Công an TP. Hà Nội',
        address: '456 Lê Lợi, Quận 1, TP.HCM',
        permanentAddress: '456 Lê Lợi, Quận 1, TP.HCM',
        temporaryAddress: '',
        personalEmail: 'nguyenvanquanly.personal@gmail.com',
        taxCode: '0123456794',
        maritalStatus: 'Đã kết hôn',
        // Employment Details
        employeeType: 'Toàn thời gian',
        contractType: 'Hợp đồng không xác định thời hạn',
        manager: 'Giám đốc IT',
        workLocation: 'Văn phòng TP.HCM',
        // Education
        education: 'Thạc sĩ',
        educationDetails: 'Thạc sĩ Công nghệ Thông tin - ĐH Bách Khoa',
        // Emergency Contact
        emergencyContactName: 'Nguyễn Thị Lan',
        emergencyContactRelationship: 'Vợ',
        emergencyContactPhone: '0987654399',
        // Bank Information
        bankAccount: '8877665544',
        bankName: 'Vietcombank',
        bankBranch: 'Chi nhánh TP.HCM'
      },
      {
        id: 'acc001',
        name: 'Trần Thị Kế Toán',
        email: 'accountant@company.com',
        position: 'Kế toán trưởng',
        department: 'Tài chính',
        phone: '0901234598',
        status: 'active',
        avatar: '/api/placeholder/150/150',
        hireDate: '2019-06-01',
        salary: 22000000,
        // Personal Information
        dateOfBirth: '1990-11-20',
        gender: 'Nữ',
        nationality: 'Việt Nam',
        idCard: '001090087654',
        idNumber: '001090087654',
        idCardIssueDate: '2010-12-01',
        idCardIssuePlace: 'Công an TP. Hà Nội',
        address: '789 Nguyễn Trãi, Quận 5, TP.HCM',
        permanentAddress: '789 Nguyễn Trãi, Quận 5, TP.HCM',
        temporaryAddress: '',
        personalEmail: 'tranthiketoan.personal@gmail.com',
        taxCode: '0123456795',
        maritalStatus: 'Đã kết hôn',
        // Employment Details
        employeeType: 'Toàn thời gian',
        contractType: 'Hợp đồng không xác định thời hạn',
        manager: 'Giám đốc Tài chính',
        workLocation: 'Văn phòng TP.HCM',
        // Education
        education: 'Cử nhân',
        educationDetails: 'Cử nhân Kế toán - ĐH Kinh Tế Quốc Dân',
        // Emergency Contact
        emergencyContactName: 'Trần Văn Nam',
        emergencyContactRelationship: 'Chồng',
        emergencyContactPhone: '0987654398',
        // Bank Information
        bankAccount: '7766554433',
        bankName: 'Techcombank',
        bankBranch: 'Chi nhánh TP.HCM',
        // Work Schedule
        timeIn: '08:00',
        timeOut: '17:00',
        shift: 'Ca sáng'
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
    return this.delayResponse({ data: attendanceStore, success: true });
  }

  // Get daily attendance for a specific date
  async getDailyAttendance(date) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const records = attendanceStore.filter(record => record.date === targetDate);
    return this.delayResponse({ data: records, success: true });
  }

  // Get attendance records in a date range
  async getAttendanceRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const records = attendanceStore.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= start && recordDate <= end;
    });
    return this.delayResponse({ data: records, success: true });
  }

  // Get attendance for a specific employee
  async getEmployeeAttendanceRecords(employeeId, startDate = null, endDate = null) {
    let records = attendanceStore.filter(record => 
      record.employee_id === employeeId || record.id === employeeId
    );
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      records = records.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= start && recordDate <= end;
      });
    }
    
    return this.delayResponse({ data: records, success: true });
  }

  async createAttendanceRecord(attendanceData) {
    const date = attendanceData.date || new Date().toISOString().split('T')[0];
    const employeeId = attendanceData.employeeId;
    
    // Check if record already exists for this employee and date
    const existingIndex = attendanceStore.findIndex(
      record => (record.employee_id === employeeId || record.id === employeeId) && record.date === date
    );

    const newRecord = {
      id: existingIndex >= 0 ? attendanceStore[existingIndex].id : `att_${employeeId}_${date}`,
      employee_id: employeeId,
      name: attendanceData.employeeName || 'Unknown',
      department: attendanceData.department || 'Unknown',
      date: date,
      check_in: attendanceData.checkIn || attendanceData.check_in || null,
      check_out: attendanceData.checkOut || attendanceData.check_out || null
    };

    if (existingIndex >= 0) {
      // Update existing record
      attendanceStore[existingIndex] = { ...attendanceStore[existingIndex], ...newRecord };
      return this.delayResponse({ 
        data: attendanceStore[existingIndex], 
        success: true, 
        message: 'Attendance record updated successfully' 
      });
    } else {
      // Create new record
      attendanceStore.push(newRecord);
      return this.delayResponse({ 
        data: newRecord, 
        success: true, 
        message: 'Attendance record created successfully' 
      });
    }
  }

  // Update attendance record
  async updateAttendanceRecord(recordId, updateData) {
    const index = attendanceStore.findIndex(record => record.id === recordId);
    if (index === -1) {
      return this.delayResponse({
        success: false,
        message: 'Attendance record not found'
      });
    }

    attendanceStore[index] = {
      ...attendanceStore[index],
      ...updateData,
      check_in: updateData.check_in || updateData.checkIn || attendanceStore[index].check_in,
      check_out: updateData.check_out || updateData.checkOut || attendanceStore[index].check_out
    };

    return this.delayResponse({
      success: true,
      data: attendanceStore[index],
      message: 'Attendance record updated successfully'
    });
  }

  calculateHoursWorked(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 0;
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
      // Thống kê tổng quan
      totalEmployees: 156,
      activeEmployees: 142,
      inactiveEmployees: 14,
      newHiresThisMonth: 8,
      resignedThisMonth: 2,
      employeesOnLeave: 12,

      // Thống kê lương
      pendingPayroll: 23,
      completedPayroll: 130,
      totalPayrollAmount: 2850000000,

      // Thống kê chấm công
      averageAttendance: 94.5,
      lateToday: 5,
      absentToday: 3,
      onTimeToday: 134,

      // Thống kê nghỉ phép
      pendingLeaveRequests: 7,
      approvedLeaveThisMonth: 15,

      // Thống kê hỗ trợ
      pendingSupportTickets: 4,
      resolvedTicketsThisMonth: 12,

      // Phân bố phòng ban
      departments: [
        { name: 'Công nghệ thông tin', code: 'IT', count: 45, color: '#3B82F6' },
        { name: 'Marketing', code: 'MKT', count: 28, color: '#10B981' },
        { name: 'Kinh doanh', code: 'SALES', count: 32, color: '#F59E0B' },
        { name: 'Nhân sự', code: 'HR', count: 12, color: '#EF4444' },
        { name: 'Tài chính', code: 'FIN', count: 18, color: '#8B5CF6' }
      ],

      // Chấm công theo tuần (7 ngày gần nhất)
      weeklyAttendance: [
        { day: 'T2', present: 138, absent: 4, late: 6 },
        { day: 'T3', present: 140, absent: 2, late: 4 },
        { day: 'T4', present: 135, absent: 7, late: 5 },
        { day: 'T5', present: 139, absent: 3, late: 4 },
        { day: 'T6', present: 141, absent: 1, late: 3 },
        { day: 'T7', present: 45, absent: 0, late: 2 },
        { day: 'CN', present: 0, absent: 0, late: 0 }
      ],

      // Nhân viên sắp hết hạn hợp đồng (30 ngày tới)
      expiringContracts: [
        { id: 'emp005', name: 'Hoàng Đức Em', department: 'Kinh doanh', expiryDate: '2024-02-15', daysLeft: 20 },
        { id: 'emp008', name: 'Vũ Thị Hoa', department: 'Marketing', expiryDate: '2024-02-20', daysLeft: 25 },
        { id: 'emp012', name: 'Đặng Văn Khoa', department: 'Kinh doanh', expiryDate: '2024-02-28', daysLeft: 33 }
      ],

      // Sinh nhật trong tuần
      upcomingBirthdays: [
        { id: 'emp001', name: 'Trần Ngọc Hải', department: 'IT', birthDate: '01-28', daysUntil: 2 },
        { id: 'emp003', name: 'Lê Minh Chính', department: 'Marketing', birthDate: '01-30', daysUntil: 4 },
        { id: 'emp007', name: 'Nguyễn Thị Mai', department: 'HR', birthDate: '02-01', daysUntil: 6 }
      ],

      // Hoạt động gần đây
      recentActivities: [
        { id: 1, type: 'hire', message: 'Nhân viên mới Nguyễn Văn A đã gia nhập', time: '2 giờ trước', icon: 'user-plus' },
        { id: 2, type: 'leave', message: 'Trần Thị B đã gửi đơn xin nghỉ phép', time: '4 giờ trước', icon: 'calendar' },
        { id: 3, type: 'payroll', message: 'Bảng lương tháng 1 đã hoàn thành', time: '1 ngày trước', icon: 'dollar' },
        { id: 4, type: 'attendance', message: 'Báo cáo chấm công đã được tạo', time: '2 ngày trước', icon: 'clock' },
        { id: 5, type: 'support', message: 'Ticket hỗ trợ #123 đã được giải quyết', time: '2 ngày trước', icon: 'help' },
        { id: 6, type: 'contract', message: 'Hợp đồng của Lê Văn C sắp hết hạn', time: '3 ngày trước', icon: 'file' }
      ],

      // Thông báo quan trọng cho Admin
      alerts: [
        { id: 1, type: 'warning', message: '3 hợp đồng sẽ hết hạn trong 30 ngày tới', link: '/employees' },
        { id: 2, type: 'info', message: '7 đơn nghỉ phép đang chờ duyệt', link: '/leaves' },
        { id: 3, type: 'error', message: '4 ticket hỗ trợ chưa được xử lý', link: '/admin/support-tickets' }
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
      { id: 'dept001', name: 'Công nghệ thông tin', code: 'IT', head: 'Nguyen Van A', employeeCount: 45 },
      { id: 'dept002', name: 'Nhân sự', code: 'HR', head: 'Tran Thi B', employeeCount: 12 },
      { id: 'dept003', name: 'Marketing', code: 'MKT', head: 'Le Minh C', employeeCount: 28 },
      { id: 'dept004', name: 'Kinh doanh', code: 'SALES', head: 'Pham Thu D', employeeCount: 32 },
      { id: 'dept005', name: 'Tài chính', code: 'FIN', head: 'Hoang Duc E', employeeCount: 18 }
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
        department: 'Công nghệ thông tin',
        type: 'annual',
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        days: 5,
        reason: 'Nghỉ phép đi du lịch cùng gia đình',
        status: 'pending',
        submittedDate: '2024-01-15',
        approvedBy: null
      },
      {
        id: 'leave002',
        employeeId: 'emp002',
        employeeName: 'Trần Thị Bình',
        department: 'Marketing',
        type: 'sick',
        startDate: '2024-01-20',
        endDate: '2024-01-22',
        days: 3,
        reason: 'Bị cảm cúm',
        status: 'approved',
        submittedDate: '2024-01-18',
        approvedBy: 'admin'
      },
      {
        id: 'leave003',
        employeeId: 'emp003',
        employeeName: 'Lê Minh Cường',
        department: 'Kinh doanh',
        type: 'emergency',
        startDate: '2024-01-25',
        endDate: '2024-01-26',
        days: 2,
        reason: 'Việc gia đình cần giải quyết gấp',
        status: 'pending',
        submittedDate: '2024-01-24',
        approvedBy: null
      },
      {
        id: 'leave004',
        employeeId: 'emp004',
        employeeName: 'Phạm Thu Dung',
        department: 'Nhân sự',
        type: 'annual',
        startDate: '2024-02-10',
        endDate: '2024-02-14',
        days: 5,
        reason: 'Nghỉ tết về quê',
        status: 'pending',
        submittedDate: '2024-01-20',
        approvedBy: null
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

  async deleteNotification(id) {
    return this.delayResponse({ 
      data: { id }, 
      success: true, 
      message: 'Notification deleted successfully' 
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
  // BENEFITS & INSURANCE APIs (Shared Data)
  // ============================================

  // Chương trình phúc lợi công ty (tự động cấp cho nhân viên)
  async getWelfarePrograms() {
    const programs = [
      { id: 'wf001', name: 'Phụ cấp ăn trưa', amount: '35.000 VNĐ/ngày làm việc', monthlyValue: 770000, budget: 220000000, participants: 154, owner: 'Phòng Hành chính', status: 'active', description: 'Phụ cấp ăn trưa cho nhân viên, thanh toán cùng lương hàng tháng', eligibility: 'Tất cả nhân viên chính thức', nextReview: '01/12/2024' },
      { id: 'wf002', name: 'Phụ cấp xăng xe / đi lại', amount: '700.000 VNĐ/tháng', monthlyValue: 700000, budget: 96000000, participants: 86, owner: 'Phòng Hành chính', status: 'active', description: 'Hỗ trợ chi phí đi lại cho nhân viên làm việc tại văn phòng', eligibility: 'Nhân viên làm việc onsite', nextReview: '20/11/2024' },
      { id: 'wf003', name: 'Thẻ tập gym & wellness', amount: 'Miễn phí 100%', monthlyValue: 500000, budget: 180000000, participants: 92, owner: 'HR - Văn hóa doanh nghiệp', status: 'active', description: 'Thẻ tập gym miễn phí tại các phòng gym đối tác', eligibility: 'Tất cả nhân viên chính thức', nextReview: '15/01/2025' },
      { id: 'wf004', name: 'Phụ cấp điện thoại', amount: '300.000 VNĐ/tháng', monthlyValue: 300000, budget: 72000000, participants: 68, owner: 'IT Support', status: 'active', description: 'Hỗ trợ chi phí điện thoại và internet cho công việc', eligibility: 'Nhân viên cần liên lạc thường xuyên', nextReview: '30/11/2024' }
    ];
    return this.delayResponse({ data: programs, success: true });
  }

  // Chính sách bảo hiểm bắt buộc
  async getInsurancePolicies() {
    const policies = [
      { id: 'BHXH-2024', name: 'Bảo hiểm xã hội (BHXH)', provider: 'Bảo hiểm xã hội Việt Nam', employerRate: '17.5%', employeeRate: '8%', effective: '01/01/2024', expiry: '31/12/2024', type: 'mandatory', description: 'Bảo hiểm xã hội bắt buộc theo quy định nhà nước' },
      { id: 'BHYT-2024', name: 'Bảo hiểm y tế (BHYT)', provider: 'Bảo hiểm xã hội Việt Nam', employerRate: '3%', employeeRate: '1.5%', effective: '01/01/2024', expiry: '31/12/2024', type: 'mandatory', description: 'Bảo hiểm y tế cho nhân viên, hỗ trợ khám chữa bệnh' },
      { id: 'BHTN-2024', name: 'Bảo hiểm thất nghiệp (BHTN)', provider: 'Bảo hiểm xã hội Việt Nam', employerRate: '1%', employeeRate: '1%', effective: '01/01/2024', expiry: '31/12/2024', type: 'mandatory', description: 'Bảo hiểm thất nghiệp theo quy định nhà nước' },
      { id: 'BH-TN-2024', name: 'Bảo hiểm tai nạn 24/24', provider: 'Bảo hiểm PTI', employerRate: '100%', employeeRate: '0%', effective: '01/02/2024', expiry: '31/01/2025', type: 'voluntary', description: 'Bảo hiểm tai nạn 24/24, công ty đóng 100%' }
    ];
    return this.delayResponse({ data: policies, success: true });
  }

  // Bảo hiểm tự nguyện (nhân viên có thể đăng ký thêm)
  async getVoluntaryInsurance() {
    const voluntaryInsurance = [
      { id: 'vol001', name: 'Bảo hiểm sức khỏe cao cấp', provider: 'Bảo Việt', monthlyPremium: 500000, coverage: 'Khám chữa bệnh tại bệnh viện quốc tế', maxBenefit: '500.000.000 VNĐ/năm', status: 'available', description: 'Bảo hiểm sức khỏe cao cấp với quyền lợi khám chữa bệnh tại các bệnh viện quốc tế' },
      { id: 'vol002', name: 'Bảo hiểm nhân thọ', provider: 'Prudential', monthlyPremium: 300000, coverage: 'Bồi thường tử vong, thương tật', maxBenefit: '1.000.000.000 VNĐ', status: 'available', description: 'Bảo hiểm nhân thọ với quyền lợi bồi thường cao' },
      { id: 'vol003', name: 'Bảo hiểm nha khoa', provider: 'Bảo Minh', monthlyPremium: 200000, coverage: 'Khám và điều trị nha khoa', maxBenefit: '50.000.000 VNĐ/năm', status: 'available', description: 'Bảo hiểm nha khoa, hỗ trợ chi phí khám và điều trị răng miệng' }
    ];
    return this.delayResponse({ data: voluntaryInsurance, success: true });
  }

  // Phúc lợi & bảo hiểm của nhân viên cụ thể
  async getEmployeeBenefits(employeeId) {
    // Phúc lợi đang hưởng (tự động từ công ty)
    const myBenefits = [
      { id: 'wf001', name: 'Phụ cấp ăn trưa', amount: '35.000 VNĐ/ngày', monthlyValue: 770000, status: 'active', startDate: '01/03/2024', description: 'Phụ cấp ăn trưa cho nhân viên' },
      { id: 'wf002', name: 'Phụ cấp xăng xe', amount: '700.000 VNĐ/tháng', monthlyValue: 700000, status: 'active', startDate: '01/03/2024', description: 'Hỗ trợ chi phí đi lại' },
      { id: 'wf003', name: 'Thẻ gym', amount: 'Miễn phí', monthlyValue: 500000, status: 'active', startDate: '01/03/2024', description: 'Thẻ tập gym miễn phí' },
      { id: 'wf004', name: 'Phụ cấp điện thoại', amount: '300.000 VNĐ/tháng', monthlyValue: 300000, status: 'active', startDate: '01/03/2024', description: 'Hỗ trợ chi phí điện thoại' }
    ];

    // Bảo hiểm bắt buộc
    const myInsurance = [
      { id: 'BHXH-2024', policyNumber: 'BHXH-2024-001', name: 'Bảo hiểm xã hội', provider: 'Bảo hiểm xã hội Việt Nam', startDate: '01/03/2024', endDate: '31/12/2024', employerPays: '17.5%', employeePays: '8%', status: 'active', dependents: 0, documents: ['Sổ BHXH', 'Giấy xác nhận'] },
      { id: 'BHYT-2024', policyNumber: 'BHYT-2024-001', name: 'Bảo hiểm y tế', provider: 'Bảo hiểm xã hội Việt Nam', startDate: '01/03/2024', endDate: '31/12/2024', employerPays: '3%', employeePays: '1.5%', status: 'active', dependents: 2, hospitalName: 'Bệnh viện Bạch Mai', documents: ['Thẻ BHYT'] },
      { id: 'BHTN-2024', policyNumber: 'BHTN-2024-001', name: 'Bảo hiểm thất nghiệp', provider: 'Bảo hiểm xã hội Việt Nam', startDate: '01/03/2024', endDate: '31/12/2024', employerPays: '1%', employeePays: '1%', status: 'active', dependents: 0, documents: ['Giấy xác nhận BHTN'] }
    ];

    // Bảo hiểm tự nguyện đã đăng ký
    const myVoluntaryInsurance = [
      { id: 'vol001', name: 'Bảo hiểm sức khỏe cao cấp', provider: 'Bảo Việt', monthlyPremium: 500000, status: 'enrolled', startDate: '01/06/2024', endDate: '31/05/2025' }
    ];

    return this.delayResponse({
      data: {
        benefits: myBenefits,
        mandatoryInsurance: myInsurance,
        voluntaryInsurance: myVoluntaryInsurance,
        totalBenefitValue: myBenefits.reduce((sum, b) => sum + b.monthlyValue, 0)
      },
      success: true
    });
  }

  // Yêu cầu thay đổi phúc lợi/bảo hiểm
  async getBenefitRequests() {
    const requests = [
      { id: 'REQ-2401', employeeId: 'emp001', employee: 'Trần Hoàng Nam', department: 'Kỹ thuật', type: 'add-dependent', typeLabel: 'Thêm người phụ thuộc (vợ) vào BHYT', submitted: '04/10/2024', reason: 'Vợ mới sinh con cần thêm vào thẻ BHYT gia đình để hưởng quyền lợi khám chữa bệnh. Hiện tại vợ chưa có bảo hiểm y tế.', attachments: 2, status: 'pending', priority: 'high' },
      { id: 'REQ-2402', employeeId: 'emp002', employee: 'Nguyễn Thị Hạnh', department: 'Tài chính', type: 'change-hospital', typeLabel: 'Đổi nơi khám chữa bệnh ban đầu', submitted: '02/10/2024', reason: 'Thay đổi nơi khám chữa bệnh ban đầu từ BV Bạch Mai sang BV Vinmec do gần nhà hơn và tiện đi lại.', attachments: 1, status: 'pending', priority: 'medium' },
      { id: 'REQ-2403', employeeId: 'emp003', employee: 'Vũ Đức Thịnh', department: 'Kinh doanh', type: 'cancel-benefit', typeLabel: 'Hủy phụ cấp ăn trưa (làm remote)', submitted: '30/09/2024', reason: 'Chuyển sang làm việc full remote từ ngày 01/10/2024 nên không còn nhu cầu nhận phụ cấp ăn trưa tại văn phòng.', attachments: 0, status: 'pending', priority: 'low' }
    ];
    return this.delayResponse({ data: requests, success: true });
  }

  // Yêu cầu của nhân viên cụ thể
  async getEmployeeBenefitRequests(employeeId) {
    const requests = [
      { id: 'REQ-2399', type: 'add-dependent', typeLabel: 'Thêm con vào BHYT', submitted: '15/08/2024', status: 'approved', approvedBy: 'Nguyễn Văn Kế Toán', approvedDate: '18/08/2024', reason: 'Thêm con mới sinh vào BHYT gia đình' },
      { id: 'REQ-2350', type: 'change-hospital', typeLabel: 'Đổi nơi khám chữa bệnh', submitted: '01/06/2024', status: 'approved', approvedBy: 'Nguyễn Văn Kế Toán', approvedDate: '05/06/2024', reason: 'Đổi từ BV Đa khoa Hà Nội sang BV Bạch Mai' },
      { id: 'REQ-2300', type: 'enroll-voluntary', typeLabel: 'Đăng ký BH sức khỏe cao cấp', submitted: '20/05/2024', status: 'approved', approvedBy: 'Nguyễn Văn Kế Toán', approvedDate: '25/05/2024', reason: 'Đăng ký bảo hiểm sức khỏe cao cấp Bảo Việt' }
    ];
    return this.delayResponse({ data: requests, success: true });
  }

  // Tạo yêu cầu mới
  async createBenefitRequest(requestData) {
    const newRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      ...requestData,
      submitted: new Date().toLocaleDateString('vi-VN'),
      status: 'pending'
    };
    return this.delayResponse({ data: newRequest, success: true, message: 'Yêu cầu đã được gửi thành công! HR sẽ xử lý trong 1-3 ngày làm việc.' });
  }

  // Phê duyệt yêu cầu
  async approveBenefitRequest(requestId, approverName) {
    return this.delayResponse({
      data: { id: requestId, status: 'approved', approvedBy: approverName, approvedDate: new Date().toLocaleDateString('vi-VN') },
      success: true,
      message: `Đã phê duyệt yêu cầu ${requestId}`
    });
  }

  // Từ chối yêu cầu
  async rejectBenefitRequest(requestId, approverName, rejectReason) {
    return this.delayResponse({
      data: { id: requestId, status: 'rejected', rejectedBy: approverName, rejectedDate: new Date().toLocaleDateString('vi-VN'), rejectReason },
      success: true,
      message: `Đã từ chối yêu cầu ${requestId}`
    });
  }

  // Bảo hiểm hiện tại của nhân viên (dùng cho modal chi tiết)
  async getEmployeeInsuranceDetail(employeeId) {
    const insuranceData = {
      'emp001': [
        { type: 'BHXH', start: '01/03/2022', end: null, dependents: 1 },
        { type: 'BHYT', start: '01/03/2022', end: null, dependents: 2, hospitalName: 'BV Bạch Mai' },
        { type: 'BHTN', start: '01/03/2022', end: null, dependents: 0 },
        { type: 'Bảo hiểm tai nạn 24/24', start: '01/02/2024', end: '31/01/2025', dependents: 0 }
      ],
      'emp002': [
        { type: 'BHXH', start: '15/06/2021', end: null, dependents: 0 },
        { type: 'BHYT', start: '15/06/2021', end: null, dependents: 1, hospitalName: 'BV Vinmec' },
        { type: 'BHTN', start: '15/06/2021', end: null, dependents: 0 }
      ],
      'emp003': [
        { type: 'BHXH', start: '10/08/2023', end: null, dependents: 0 },
        { type: 'BHYT', start: '10/08/2023', end: null, dependents: 0, hospitalName: 'BV Đa khoa Hà Nội' },
        { type: 'BHTN', start: '10/08/2023', end: null, dependents: 0 }
      ]
    };
    return this.delayResponse({ data: insuranceData[employeeId] || [], success: true });
  }

  // ============================================
  // WELFARE HISTORY APIs (Phúc lợi nhân viên)
  // ============================================

  // Lấy lịch sử phúc lợi của tất cả nhân viên
  async getWelfareHistory() {
    const welfareHistory = [
      {
        id: 1,
        employeeId: 'EMP001',
        employeeName: 'Nguyễn Văn A',
        department: 'Phòng Hành chính',
        allowance: 500000,
        welfareName: 'Phụ cấp ăn trưa',
        grantDate: '2024-01-15',
        status: 'active'
      },
      {
        id: 2,
        employeeId: 'EMP001',
        employeeName: 'Nguyễn Văn A',
        department: 'Phòng Hành chính',
        allowance: 700000,
        welfareName: 'Phụ cấp xăng xe / đi lại',
        grantDate: '2024-01-15',
        status: 'active'
      },
      {
        id: 3,
        employeeId: 'EMP001',
        employeeName: 'Nguyễn Văn A',
        department: 'Phòng Hành chính',
        allowance: 500000,
        welfareName: 'Thẻ tập gym & wellness',
        grantDate: '2024-02-01',
        status: 'active'
      },
      {
        id: 4,
        employeeId: 'EMP002',
        employeeName: 'Trần Thị B',
        department: 'Phòng Kế toán',
        allowance: 1000000,
        welfareName: 'Phụ cấp xăng xe / đi lại',
        grantDate: '2024-02-01',
        status: 'active'
      },
      {
        id: 5,
        employeeId: 'EMP002',
        employeeName: 'Trần Thị B',
        department: 'Phòng Kế toán',
        allowance: 770000,
        welfareName: 'Phụ cấp ăn trưa',
        grantDate: '2024-02-01',
        status: 'active'
      },
      {
        id: 6,
        employeeId: 'EMP003',
        employeeName: 'Lê Văn C',
        department: 'Phòng Nhân sự',
        allowance: 300000,
        welfareName: 'Phụ cấp điện thoại',
        grantDate: '2024-01-20',
        status: 'suspended'
      },
      {
        id: 7,
        employeeId: 'EMP003',
        employeeName: 'Lê Văn C',
        department: 'Phòng Nhân sự',
        allowance: 770000,
        welfareName: 'Phụ cấp ăn trưa',
        grantDate: '2024-01-20',
        status: 'active'
      },
      {
        id: 8,
        employeeId: 'EMP003',
        employeeName: 'Lê Văn C',
        department: 'Phòng Nhân sự',
        allowance: 500000,
        welfareName: 'Thẻ tập gym & wellness',
        grantDate: '2024-01-20',
        status: 'active'
      },
      {
        id: 9,
        employeeId: 'EMP004',
        employeeName: 'Phạm Thị D',
        department: 'Phòng Kinh doanh',
        allowance: 800000,
        welfareName: 'Phụ cấp đi lại',
        grantDate: '2023-12-10',
        status: 'cancelled'
      },
      {
        id: 10,
        employeeId: 'EMP005',
        employeeName: 'Hoàng Văn E',
        department: 'Phòng IT',
        allowance: 770000,
        welfareName: 'Phụ cấp ăn trưa',
        grantDate: '2024-03-01',
        status: 'active'
      },
      {
        id: 11,
        employeeId: 'EMP005',
        employeeName: 'Hoàng Văn E',
        department: 'Phòng IT',
        allowance: 700000,
        welfareName: 'Phụ cấp xăng xe / đi lại',
        grantDate: '2024-03-01',
        status: 'active'
      },
      {
        id: 12,
        employeeId: 'EMP005',
        employeeName: 'Hoàng Văn E',
        department: 'Phòng IT',
        allowance: 300000,
        welfareName: 'Phụ cấp điện thoại',
        grantDate: '2024-03-01',
        status: 'active'
      },
      {
        id: 13,
        employeeId: 'EMP005',
        employeeName: 'Hoàng Văn E',
        department: 'Phòng IT',
        allowance: 500000,
        welfareName: 'Thẻ tập gym & wellness',
        grantDate: '2024-03-15',
        status: 'active'
      },
      {
        id: 14,
        employeeId: 'emp001',
        employeeName: 'Trần Ngọc Hải',
        department: 'Công nghệ thông tin',
        allowance: 770000,
        welfareName: 'Phụ cấp ăn trưa',
        grantDate: '2024-01-01',
        status: 'active'
      },
      {
        id: 15,
        employeeId: 'emp001',
        employeeName: 'Trần Ngọc Hải',
        department: 'Công nghệ thông tin',
        allowance: 700000,
        welfareName: 'Phụ cấp xăng xe / đi lại',
        grantDate: '2024-01-01',
        status: 'active'
      },
      {
        id: 16,
        employeeId: 'emp001',
        employeeName: 'Trần Ngọc Hải',
        department: 'Công nghệ thông tin',
        allowance: 300000,
        welfareName: 'Phụ cấp điện thoại',
        grantDate: '2024-01-01',
        status: 'active'
      },
      {
        id: 17,
        employeeId: 'emp002',
        employeeName: 'Trần Thị Bình',
        department: 'Nhân sự',
        allowance: 770000,
        welfareName: 'Phụ cấp ăn trưa',
        grantDate: '2024-01-01',
        status: 'active'
      },
      {
        id: 18,
        employeeId: 'emp002',
        employeeName: 'Trần Thị Bình',
        department: 'Nhân sự',
        allowance: 500000,
        welfareName: 'Thẻ tập gym & wellness',
        grantDate: '2024-01-01',
        status: 'active'
      }
    ];
    return this.delayResponse({ data: welfareHistory, success: true });
  }

  // Lấy lịch sử phúc lợi của một nhân viên cụ thể
  async getEmployeeWelfareHistory(employeeId) {
    const allHistory = await this.getWelfareHistory();
    const employeeHistory = allHistory.data.filter(h => 
      h.employeeId === employeeId || h.employeeId?.toLowerCase() === employeeId?.toLowerCase()
    );
    return this.delayResponse({ data: employeeHistory, success: true });
  }

  // Tạo/cập nhật phúc lợi nhân viên
  async createWelfareHistory(welfareData) {
    const newWelfare = {
      id: Date.now(),
      ...welfareData,
      status: welfareData.status || 'active'
    };
    return this.delayResponse({ 
      data: newWelfare, 
      success: true, 
      message: 'Đã thêm phúc lợi nhân viên thành công' 
    });
  }

  // Cập nhật phúc lợi nhân viên
  async updateWelfareHistory(id, welfareData) {
    return this.delayResponse({
      data: { id, ...welfareData },
      success: true,
      message: 'Đã cập nhật phúc lợi nhân viên thành công'
    });
  }

  // Xóa phúc lợi nhân viên
  async deleteWelfareHistory(id) {
    return this.delayResponse({
      data: { id },
      success: true,
      message: 'Đã xóa phúc lợi nhân viên thành công'
    });
  }

  // Cấp nhiều phúc lợi cùng lúc
  async grantWelfares(welfaresArray) {
    const grantedWelfares = welfaresArray.map((welfare, index) => ({
      id: Date.now() + index,
      ...welfare,
      status: welfare.status || 'active'
    }));
    return this.delayResponse({
      data: grantedWelfares,
      success: true,
      message: `Đã cấp ${grantedWelfares.length} phúc lợi thành công`
    });
  }

  // ============================================
  // INSURANCE HISTORY APIs (Bảo hiểm nhân viên)
  // ============================================

  // Lấy lịch sử bảo hiểm của tất cả nhân viên
  async getInsuranceHistory() {
    const insuranceHistory = [
      {
        id: 1,
        employeeId: 'EMP001',
        employeeName: 'Nguyễn Văn A',
        department: 'Phòng Hành chính',
        insuranceName: 'Bảo hiểm xã hội (BHXH)',
        employerRate: '17.5%',
        employeeRate: '8%',
        grantDate: '2024-01-15',
        status: 'active'
      },
      {
        id: 2,
        employeeId: 'EMP001',
        employeeName: 'Nguyễn Văn A',
        department: 'Phòng Hành chính',
        insuranceName: 'Bảo hiểm y tế (BHYT)',
        employerRate: '3%',
        employeeRate: '1.5%',
        grantDate: '2024-01-15',
        status: 'active'
      },
      {
        id: 3,
        employeeId: 'EMP001',
        employeeName: 'Nguyễn Văn A',
        department: 'Phòng Hành chính',
        insuranceName: 'Bảo hiểm thất nghiệp (BHTN)',
        employerRate: '1%',
        employeeRate: '1%',
        grantDate: '2024-01-15',
        status: 'active'
      },
      {
        id: 4,
        employeeId: 'EMP002',
        employeeName: 'Trần Thị B',
        department: 'Phòng Kế toán',
        insuranceName: 'Bảo hiểm xã hội (BHXH)',
        employerRate: '17.5%',
        employeeRate: '8%',
        grantDate: '2024-02-01',
        status: 'active'
      },
      {
        id: 5,
        employeeId: 'EMP002',
        employeeName: 'Trần Thị B',
        department: 'Phòng Kế toán',
        insuranceName: 'Bảo hiểm y tế (BHYT)',
        employerRate: '3%',
        employeeRate: '1.5%',
        grantDate: '2024-02-01',
        status: 'active'
      },
      {
        id: 6,
        employeeId: 'EMP003',
        employeeName: 'Lê Văn C',
        department: 'Phòng Nhân sự',
        insuranceName: 'Bảo hiểm xã hội (BHXH)',
        employerRate: '17.5%',
        employeeRate: '8%',
        grantDate: '2024-01-20',
        status: 'suspended'
      },
      {
        id: 7,
        employeeId: 'EMP003',
        employeeName: 'Lê Văn C',
        department: 'Phòng Nhân sự',
        insuranceName: 'Bảo hiểm tai nạn 24/24',
        employerRate: '100%',
        employeeRate: '0%',
        grantDate: '2024-01-20',
        status: 'active'
      },
      {
        id: 8,
        employeeId: 'EMP005',
        employeeName: 'Hoàng Văn E',
        department: 'Phòng IT',
        insuranceName: 'Bảo hiểm xã hội (BHXH)',
        employerRate: '17.5%',
        employeeRate: '8%',
        grantDate: '2024-03-01',
        status: 'active'
      },
      {
        id: 9,
        employeeId: 'EMP005',
        employeeName: 'Hoàng Văn E',
        department: 'Phòng IT',
        insuranceName: 'Bảo hiểm y tế (BHYT)',
        employerRate: '3%',
        employeeRate: '1.5%',
        grantDate: '2024-03-01',
        status: 'active'
      },
      {
        id: 10,
        employeeId: 'EMP005',
        employeeName: 'Hoàng Văn E',
        department: 'Phòng IT',
        insuranceName: 'Bảo hiểm thất nghiệp (BHTN)',
        employerRate: '1%',
        employeeRate: '1%',
        grantDate: '2024-03-01',
        status: 'active'
      },
      {
        id: 11,
        employeeId: 'EMP005',
        employeeName: 'Hoàng Văn E',
        department: 'Phòng IT',
        insuranceName: 'Bảo hiểm tai nạn 24/24',
        employerRate: '100%',
        employeeRate: '0%',
        grantDate: '2024-03-15',
        status: 'active'
      },
      {
        id: 12,
        employeeId: 'emp001',
        employeeName: 'Trần Ngọc Hải',
        department: 'Công nghệ thông tin',
        insuranceName: 'Bảo hiểm xã hội (BHXH)',
        employerRate: '17.5%',
        employeeRate: '8%',
        grantDate: '2024-01-01',
        status: 'active'
      },
      {
        id: 13,
        employeeId: 'emp001',
        employeeName: 'Trần Ngọc Hải',
        department: 'Công nghệ thông tin',
        insuranceName: 'Bảo hiểm y tế (BHYT)',
        employerRate: '3%',
        employeeRate: '1.5%',
        grantDate: '2024-01-01',
        status: 'active'
      },
      {
        id: 14,
        employeeId: 'emp001',
        employeeName: 'Trần Ngọc Hải',
        department: 'Công nghệ thông tin',
        insuranceName: 'Bảo hiểm thất nghiệp (BHTN)',
        employerRate: '1%',
        employeeRate: '1%',
        grantDate: '2024-01-01',
        status: 'active'
      },
      {
        id: 15,
        employeeId: 'emp002',
        employeeName: 'Trần Thị Bình',
        department: 'Nhân sự',
        insuranceName: 'Bảo hiểm xã hội (BHXH)',
        employerRate: '17.5%',
        employeeRate: '8%',
        grantDate: '2024-01-01',
        status: 'active'
      },
      {
        id: 16,
        employeeId: 'emp002',
        employeeName: 'Trần Thị Bình',
        department: 'Nhân sự',
        insuranceName: 'Bảo hiểm y tế (BHYT)',
        employerRate: '3%',
        employeeRate: '1.5%',
        grantDate: '2024-01-01',
        status: 'active'
      }
    ];
    return this.delayResponse({ data: insuranceHistory, success: true });
  }

  // Lấy lịch sử bảo hiểm của một nhân viên cụ thể
  async getEmployeeInsuranceHistory(employeeId) {
    const allHistory = await this.getInsuranceHistory();
    const employeeHistory = allHistory.data.filter(h => 
      h.employeeId === employeeId || h.employeeId?.toLowerCase() === employeeId?.toLowerCase()
    );
    return this.delayResponse({ data: employeeHistory, success: true });
  }

  // Tạo/cập nhật bảo hiểm nhân viên
  async createInsuranceHistory(insuranceData) {
    const newInsurance = {
      id: Date.now(),
      ...insuranceData,
      status: insuranceData.status || 'active'
    };
    return this.delayResponse({ 
      data: newInsurance, 
      success: true, 
      message: 'Đã thêm bảo hiểm nhân viên thành công' 
    });
  }

  // Cập nhật bảo hiểm nhân viên
  async updateInsuranceHistory(id, insuranceData) {
    return this.delayResponse({
      data: { id, ...insuranceData },
      success: true,
      message: 'Đã cập nhật bảo hiểm nhân viên thành công'
    });
  }

  // Xóa bảo hiểm nhân viên
  async deleteInsuranceHistory(id) {
    return this.delayResponse({
      data: { id },
      success: true,
      message: 'Đã xóa bảo hiểm nhân viên thành công'
    });
  }

  // Cấp nhiều bảo hiểm cùng lúc
  async grantInsurances(insurancesArray) {
    const grantedInsurances = insurancesArray.map((insurance, index) => ({
      id: Date.now() + index,
      ...insurance,
      status: insurance.status || 'active'
    }));
    return this.delayResponse({
      data: grantedInsurances,
      success: true,
      message: `Đã cấp ${grantedInsurances.length} bảo hiểm thành công`
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
      emergencyContactName: 'Nguyễn Thị B',
      emergencyContactRelationship: 'Vợ',
      emergencyContactPhone: '0987654321',
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
    // Dữ liệu riêng cho từng employee
    const balanceData = {
      'emp001': { // Employee
        annual: { total: 12, used: 3, pending: 1, remaining: 8, carriedForward: 0 },
        sick: { total: 5, used: 1, pending: 0, remaining: 4 },
        unpaid: { used: 0 }
      },
      'mgr001': { // Manager
        annual: { total: 15, used: 5, pending: 2, remaining: 8, carriedForward: 3 },
        sick: { total: 5, used: 0, pending: 0, remaining: 5 },
        unpaid: { used: 1 }
      },
      'acc001': { // Accountant
        annual: { total: 12, used: 4, pending: 0, remaining: 8, carriedForward: 2 },
        sick: { total: 5, used: 2, pending: 1, remaining: 2 },
        unpaid: { used: 0 }
      },
      'adm001': { // Admin
        annual: { total: 15, used: 2, pending: 0, remaining: 13, carriedForward: 5 },
        sick: { total: 5, used: 0, pending: 0, remaining: 5 },
        unpaid: { used: 0 }
      }
    };

    const defaultBalance = {
      annual: { total: 12, used: 0, pending: 0, remaining: 12, carriedForward: 0 },
      sick: { total: 5, used: 0, pending: 0, remaining: 5 },
      unpaid: { used: 0 }
    };

    const userData = balanceData[employeeId] || defaultBalance;

    const balance = {
      employeeId: employeeId,
      year: new Date().getFullYear(),
      ...userData,
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
    // Lịch sử riêng cho từng employee
    const historyData = {
      'emp001': [ // Employee
        { id: 'lh-emp-001', type: 'annual', startDate: '2024-03-10', endDate: '2024-03-12', days: 3, status: 'approved', approvedBy: 'Nguyễn Văn Quản Lý', approvedDate: '2024-03-05' },
        { id: 'lh-emp-002', type: 'sick', startDate: '2024-02-15', endDate: '2024-02-15', days: 1, status: 'approved', approvedBy: 'Nguyễn Văn Quản Lý', approvedDate: '2024-02-15' },
        { id: 'lh-emp-003', type: 'annual', startDate: '2024-12-20', endDate: '2024-12-21', days: 2, status: 'pending', approvedBy: null, approvedDate: null },
      ],
      'mgr001': [ // Manager
        { id: 'lh-mgr-001', type: 'annual', startDate: '2024-01-15', endDate: '2024-01-19', days: 5, status: 'approved', approvedBy: 'Admin', approvedDate: '2024-01-10' },
        { id: 'lh-mgr-002', type: 'annual', startDate: '2024-06-01', endDate: '2024-06-02', days: 2, status: 'pending', approvedBy: null, approvedDate: null },
        { id: 'lh-mgr-003', type: 'unpaid', startDate: '2024-08-10', endDate: '2024-08-10', days: 1, status: 'approved', approvedBy: 'Admin', approvedDate: '2024-08-05' },
      ],
      'acc001': [ // Accountant
        { id: 'lh-acc-001', type: 'annual', startDate: '2024-02-20', endDate: '2024-02-23', days: 4, status: 'approved', approvedBy: 'Admin', approvedDate: '2024-02-15' },
        { id: 'lh-acc-002', type: 'sick', startDate: '2024-04-05', endDate: '2024-04-06', days: 2, status: 'approved', approvedBy: 'Admin', approvedDate: '2024-04-05' },
        { id: 'lh-acc-003', type: 'sick', startDate: '2024-11-25', endDate: '2024-11-25', days: 1, status: 'pending', approvedBy: null, approvedDate: null },
      ],
      'adm001': [ // Admin
        { id: 'lh-adm-001', type: 'annual', startDate: '2024-05-01', endDate: '2024-05-02', days: 2, status: 'approved', approvedBy: 'System', approvedDate: '2024-04-28' },
      ]
    };

    const history = historyData[employeeId] || [];
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
  // SUPPORT & HELP APIs (Dùng shared store để đồng bộ)
  // ============================================

  // Employee xem tickets của mình
  async getSupportTickets(employeeId) {
    // Lọc tickets theo employeeId nếu có, không thì trả về tất cả (cho demo)
    const tickets = employeeId
      ? supportTicketsStore.filter(t => t.employeeId === employeeId)
      : supportTicketsStore;
    return this.delayResponse({ data: [...tickets].reverse(), success: true });
  }

  // Employee tạo ticket mới
  // Flow: Employee tạo → status: 'pending' → Manager xem xét
  async createSupportTicket(ticketData) {
    const today = new Date();
    const dateStr = today.toLocaleDateString('vi-VN');

    const newTicket = {
      id: 'ticket' + this.generateId(),
      ...ticketData,
      status: 'pending', // Bắt đầu với trạng thái chờ Manager xem xét
      createdDate: dateStr,
      lastUpdate: dateStr,
      employeeId: ticketData.employeeId || 'emp001',
      employeeName: ticketData.employeeName || 'Trần Ngọc Hải',
      assignedTo: ticketData.category === 'technical' ? 'IT Support' : 'HR Department'
    };

    // Thêm vào shared store
    supportTicketsStore.push(newTicket);

    return this.delayResponse({
      data: newTicket,
      success: true,
      message: 'Yêu cầu hỗ trợ đã được tạo và gửi đến Manager'
    });
  }

  // Cập nhật ticket (status)
  // Flow: pending → forwarded (Manager chuyển Admin)
  //       forwarded → processing (Admin bắt đầu xử lý)
  //       processing → admin_resolved (Admin hoàn thành)
  //       admin_resolved → notified (Manager thông báo Employee)
  async updateSupportTicket(ticketId, updates) {
    const ticketIndex = supportTicketsStore.findIndex(t => t.id === ticketId);
    if (ticketIndex !== -1) {
      const currentTicket = supportTicketsStore[ticketIndex];

      // Tạo message phù hợp với từng action
      let message = 'Yêu cầu hỗ trợ đã được cập nhật';
      if (updates.status === 'forwarded') {
        message = 'Đã chuyển yêu cầu lên Admin xử lý';
      } else if (updates.status === 'processing') {
        message = 'Admin đã bắt đầu xử lý yêu cầu';
      } else if (updates.status === 'admin_resolved') {
        message = 'Admin đã xử lý xong, đã gửi về Manager';
      } else if (updates.status === 'notified') {
        message = 'Đã thông báo kết quả cho nhân viên';
      }

      supportTicketsStore[ticketIndex] = {
        ...currentTicket,
        ...updates,
        lastUpdate: new Date().toLocaleDateString('vi-VN')
      };

      return this.delayResponse({
        data: supportTicketsStore[ticketIndex],
        success: true,
        message: message
      });
    }
    return this.delayResponse({
      data: null,
      success: false,
      message: 'Không tìm thấy ticket'
    });
  }

  // Admin/Manager xem tất cả tickets
  async getAllSupportTickets() {
    return this.delayResponse({ data: [...supportTicketsStore].reverse(), success: true });
  }

  // Admin phản hồi và xử lý ticket
  // Flow: Admin xử lý → status: 'admin_resolved' → Gửi về Manager
  async respondToTicket(ticketId, responseData) {
    const ticketIndex = supportTicketsStore.findIndex(t => t.id === ticketId);
    if (ticketIndex !== -1) {
      supportTicketsStore[ticketIndex] = {
        ...supportTicketsStore[ticketIndex],
        adminResponse: responseData.adminResponse || responseData.response,
        status: responseData.status || 'admin_resolved',
        lastUpdate: new Date().toLocaleDateString('vi-VN'),
        respondedAt: new Date().toISOString(),
        respondedBy: 'Admin'
      };
      return this.delayResponse({
        data: supportTicketsStore[ticketIndex],
        success: true,
        message: 'Admin đã xử lý xong, đã gửi về Manager'
      });
    }
    return this.delayResponse({
      data: null,
      success: false,
      message: 'Không tìm thấy ticket'
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

  // ============================================
  // TASK METRICS FOR EVALUATION APIs
  // ============================================

  async getEmployeeTasksForEvaluation(employeeId, startDate, endDate) {
    // Mock data: tasks assigned to an employee within the evaluation period
    const employeeTasks = [
      {
        id: 'et001',
        title: 'Thiết kế giao diện dashboard mới',
        description: 'Tạo wireframe và mockup cho dashboard phiên bản 2.0',
        columnId: 'done',
        dueDate: '2024-12-10',
        completedDate: '2024-12-09',
        department: 'IT',
        assignees: ['Nguyễn Văn An']
      },
      {
        id: 'et002',
        title: 'Viết API documentation',
        description: 'Cập nhật tài liệu API cho các endpoints mới',
        columnId: 'done',
        dueDate: '2024-12-12',
        completedDate: '2024-12-11',
        department: 'IT',
        assignees: ['Nguyễn Văn An']
      },
      {
        id: 'et003',
        title: 'Implement authentication system',
        description: 'Xây dựng hệ thống đăng nhập với JWT và OAuth',
        columnId: 'inProgress',
        dueDate: '2024-12-20',
        completedDate: null,
        department: 'IT',
        assignees: ['Nguyễn Văn An', 'Trần Thị Bình']
      },
      {
        id: 'et004',
        title: 'Fix responsive issues',
        description: 'Sửa các vấn đề hiển thị trên mobile',
        columnId: 'done',
        dueDate: '2024-12-08',
        completedDate: '2024-12-10', // Late
        department: 'IT',
        assignees: ['Nguyễn Văn An']
      },
      {
        id: 'et005',
        title: 'Database optimization',
        description: 'Tối ưu hóa queries và indexes',
        columnId: 'review',
        dueDate: '2024-12-18',
        completedDate: null,
        department: 'IT',
        assignees: ['Nguyễn Văn An']
      },
      {
        id: 'et006',
        title: 'Setup CI/CD pipeline',
        description: 'Cấu hình GitHub Actions cho auto deployment',
        columnId: 'done',
        dueDate: '2024-12-15',
        completedDate: '2024-12-14',
        department: 'IT',
        assignees: ['Nguyễn Văn An']
      },
      {
        id: 'et007',
        title: 'Code review các PR của team',
        description: 'Review code cho 5 pull requests',
        columnId: 'done',
        dueDate: '2024-12-05',
        completedDate: '2024-12-05',
        department: 'IT',
        assignees: ['Nguyễn Văn An']
      },
      {
        id: 'et008',
        title: 'Viết unit tests cho auth module',
        description: 'Coverage tối thiểu 80%',
        columnId: 'done',
        dueDate: '2024-12-07',
        completedDate: '2024-12-06',
        department: 'IT',
        assignees: ['Nguyễn Văn An']
      },
      {
        id: 'et009',
        title: 'Training junior developer',
        description: 'Hướng dẫn nhân viên mới về codebase',
        columnId: 'todo',
        dueDate: '2024-12-25',
        completedDate: null,
        department: 'IT',
        assignees: ['Nguyễn Văn An']
      },
      {
        id: 'et010',
        title: 'Refactor legacy code',
        description: 'Cải thiện chất lượng code module cũ',
        columnId: 'inProgress',
        dueDate: '2024-12-22',
        completedDate: null,
        department: 'IT',
        assignees: ['Nguyễn Văn An']
      }
    ];

    return this.delayResponse({ data: employeeTasks, success: true });
  }

  async getTaskMetricsForEvaluation(employeeId, startDate, endDate) {
    // Calculate metrics from tasks
    const tasksResponse = await this.getEmployeeTasksForEvaluation(employeeId, startDate, endDate);
    const tasks = tasksResponse.data;

    const total = tasks.length;
    const done = tasks.filter(t => t.columnId === 'done').length;
    const inProgress = tasks.filter(t => t.columnId === 'inProgress').length;
    const review = tasks.filter(t => t.columnId === 'review').length;
    const todo = tasks.filter(t => t.columnId === 'todo').length;

    // Calculate on-time rate
    const completedTasks = tasks.filter(t => t.columnId === 'done');
    const onTimeTasks = completedTasks.filter(t => {
      if (!t.dueDate || !t.completedDate) return true;
      return new Date(t.completedDate) <= new Date(t.dueDate);
    });
    const onTimeRate = completedTasks.length > 0
      ? Math.round((onTimeTasks.length / completedTasks.length) * 100)
      : 0;

    // High priority completion
    const highPriorityTasks = tasks.filter(t => t.priority === 'high');
    const completedHighPriority = highPriorityTasks.filter(t => t.columnId === 'done').length;
    const highPriorityRate = highPriorityTasks.length > 0
      ? Math.round((completedHighPriority / highPriorityTasks.length) * 100)
      : 100;

    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    // Productivity score (weighted)
    const productivityScore = Math.round(
      (completionRate * 0.4) + (onTimeRate * 0.35) + (highPriorityRate * 0.25)
    );

    const metrics = {
      stats: { total, todo, inProgress, review, done },
      completionRate,
      onTimeRate,
      highPriorityRate,
      productivityScore,
      priorityDistribution: {
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length
      },
      suggestedKPIs: [
        {
          objective: 'Tỷ lệ hoàn thành công việc',
          target: 100,
          actual: completionRate,
          unit: '%',
          weight: 30,
          achievement: completionRate,
          comments: `Hoàn thành ${done}/${total} công việc được giao`
        },
        {
          objective: 'Tỷ lệ hoàn thành đúng hạn',
          target: 100,
          actual: onTimeRate,
          unit: '%',
          weight: 25,
          achievement: onTimeRate,
          comments: 'Đánh giá khả năng quản lý thời gian'
        },
        {
          objective: 'Hoàn thành công việc ưu tiên cao',
          target: 100,
          actual: highPriorityRate,
          unit: '%',
          weight: 25,
          achievement: highPriorityRate,
          comments: `Xử lý ${highPriorityTasks.length} công việc quan trọng`
        },
        {
          objective: 'Điểm năng suất tổng hợp',
          target: 100,
          actual: productivityScore,
          unit: 'điểm',
          weight: 20,
          achievement: productivityScore,
          comments: 'Đánh giá tổng hợp dựa trên nhiều yếu tố'
        }
      ],
      recommendations: this.generateTaskRecommendations(completionRate, onTimeRate, highPriorityRate, inProgress, done)
    };

    return this.delayResponse({ data: metrics, success: true });
  }

  generateTaskRecommendations(completionRate, onTimeRate, highPriorityRate, inProgress, done) {
    const recommendations = [];

    if (completionRate < 80) {
      recommendations.push('Cần cải thiện tỷ lệ hoàn thành công việc. Xem xét đào tạo về quản lý công việc.');
    }

    if (onTimeRate < 80) {
      recommendations.push('Cần cải thiện khả năng hoàn thành đúng deadline. Đề xuất khóa học quản lý thời gian.');
    }

    if (highPriorityRate < 90) {
      recommendations.push('Cần ưu tiên xử lý các công việc quan trọng trước.');
    }

    if (inProgress > done) {
      recommendations.push('Có nhiều công việc đang dở dang. Cần tập trung hoàn thành trước khi nhận việc mới.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Hiệu suất công việc tốt. Tiếp tục duy trì và có thể đảm nhận thêm trách nhiệm.');
    }

    return recommendations;
  }

  // ============================================
  // EMPLOYEE EVALUATION APIs
  // ============================================

  // Get all evaluations (for Manager/Admin)
  async getAllEvaluations() {
    return this.delayResponse({
      success: true,
      data: evaluationsStore
    });
  }

  // Get evaluations for a specific employee (for Employee view)
  async getMyEvaluations(employeeId) {
    const myEvaluations = evaluationsStore.filter(e => e.employeeId === employeeId);
    return this.delayResponse({
      success: true,
      data: myEvaluations.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate))
    });
  }

  // Get latest evaluation for each employee (for Manager list view)
  async getEmployeesWithEvaluations() {
    const employees = await this.getEmployees();
    const employeesWithEval = employees.data.map(emp => {
      const empEvaluations = evaluationsStore.filter(e => e.employeeId === emp.id);
      const latestEval = empEvaluations.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate))[0];
      return {
        ...emp,
        lastEvaluation: latestEval || null,
        evaluationCount: empEvaluations.length
      };
    });
    return this.delayResponse({
      success: true,
      data: employeesWithEval
    });
  }

  // Create new evaluation (Manager only)
  async createEvaluation(evaluationData) {
    const newEvaluation = {
      id: 'eval' + this.generateId(),
      ...evaluationData,
      createdAt: new Date().toISOString()
    };
    evaluationsStore.unshift(newEvaluation);
    return this.delayResponse({
      success: true,
      data: newEvaluation,
      message: 'Đã lưu đánh giá thành công!'
    });
  }

  // Update evaluation (Manager only)
  async updateEvaluation(evaluationId, updateData) {
    const index = evaluationsStore.findIndex(e => e.id === evaluationId);
    if (index === -1) {
      return this.delayResponse({
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }
    evaluationsStore[index] = {
      ...evaluationsStore[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return this.delayResponse({
      success: true,
      data: evaluationsStore[index],
      message: 'Đã cập nhật đánh giá!'
    });
  }

  // Delete evaluation (Admin only)
  async deleteEvaluation(evaluationId) {
    const index = evaluationsStore.findIndex(e => e.id === evaluationId);
    if (index === -1) {
      return this.delayResponse({
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }
    evaluationsStore.splice(index, 1);
    return this.delayResponse({
      success: true,
      message: 'Đã xóa đánh giá!'
    });
  }
}

// Create singleton instance
const fakeApi = new FakeApiService();

export default fakeApi;
