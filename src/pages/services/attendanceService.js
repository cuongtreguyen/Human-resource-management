// src/services/attendanceService.js
import axios from 'axios';

const API_BASE = '/api/attendance'; // Thay bằng URL backend của bạn

// Mock data cho development
const mockEmployees = [
  { id: 'NV001', name: 'Nguyễn Văn A', department: 'IT', position: 'Developer' },
  { id: 'NV002', name: 'Trần Thị B', department: 'HR', position: 'HR Manager' },
  { id: 'NV003', name: 'Lê Văn C', department: 'Marketing', position: 'Marketing Lead' },
  { id: 'NV004', name: 'Phạm Thị D', department: 'Sales', position: 'Sales Executive' },
  { id: 'NV005', name: 'Hoàng Văn E', department: 'IT', position: 'DevOps Engineer' },
];

const mockAttendanceData = [
  {
    id: 1,
    empId: 'NV001',
    name: 'Nguyễn Văn A',
    department: 'IT',
    checkIn: '08:30',
    checkOut: '17:30',
    location: 'Văn phòng HN',
    status: 'Đúng giờ',
    overtime: 0
  },
  {
    id: 2,
    empId: 'NV002',
    name: 'Trần Thị B',
    department: 'HR',
    checkIn: '08:45',
    checkOut: '17:15',
    location: 'Văn phòng HN',
    status: 'Trễ',
    overtime: 0
  },
  {
    id: 3,
    empId: 'NV003',
    name: 'Lê Văn C',
    department: 'Marketing',
    checkIn: '09:00',
    checkOut: '18:00',
    location: 'Remote',
    status: 'Đúng giờ',
    overtime: 1
  },
  {
    id: 4,
    empId: 'NV004',
    name: 'Phạm Thị D',
    department: 'Sales',
    checkIn: '08:15',
    checkOut: '17:45',
    location: 'Chi nhánh SG',
    status: 'Đúng giờ',
    overtime: 0.5
  },
  {
    id: 5,
    empId: 'NV005',
    name: 'Hoàng Văn E',
    department: 'IT',
    checkIn: null,
    checkOut: null,
    location: null,
    status: 'Vắng',
    overtime: 0
  }
];

const mockLeaveRequests = [
  {
    id: 1,
    employeeId: 'NV001',
    employeeName: 'Nguyễn Văn A',
    department: 'IT',
    leaveType: 'annual',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    days: 3,
    reason: 'Nghỉ phép năm để đi du lịch',
    status: 'pending',
    approver: 'Trần Thị B',
    rejectionReason: null
  },
  {
    id: 2,
    employeeId: 'NV003',
    employeeName: 'Lê Văn C',
    department: 'Marketing',
    leaveType: 'sick',
    startDate: '2024-01-10',
    endDate: '2024-01-10',
    days: 1,
    reason: 'Nghỉ ốm',
    status: 'approved',
    approver: 'Trần Thị B',
    rejectionReason: null
  }
];

const mockHistory = [
  {
    id: 1,
    type: 'in',
    method: 'gps',
    location: 'Văn phòng HN',
    at: new Date().toISOString(),
    status: 'present',
    verified: { geo: true, qr: false, face: false }
  },
  {
    id: 2,
    type: 'out',
    method: 'gps',
    location: 'Văn phòng HN',
    at: new Date(Date.now() - 3600000).toISOString(),
    status: 'present',
    verified: { geo: true, qr: false, face: false }
  }
];

// Utility functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateMockStats = () => ({
  totalEmployees: mockEmployees.length,
  present: mockAttendanceData.filter(emp => emp.status === 'Đúng giờ' || emp.status === 'Trễ').length,
  absent: mockAttendanceData.filter(emp => emp.status === 'Vắng').length,
  late: mockAttendanceData.filter(emp => emp.status === 'Trễ').length,
  onLeave: mockLeaveRequests.filter(req => req.status === 'approved').length
});

export const attendanceService = {
  // 📊 Lấy thống kê tổng quan
  getStats: async (date = new Date()) => {
    try {
      await delay(500); // Simulate API call
      return {
        success: true,
        data: generateMockStats()
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        success: false,
        message: 'Không thể tải thống kê',
        data: generateMockStats()
      };
    }
  },

  // 📋 Lấy danh sách chấm công
  getAttendanceList: async (filters = {}) => {
    try {
      await delay(300);
      let filteredData = [...mockAttendanceData];
      
      if (filters.department && filters.department !== 'all') {
        filteredData = filteredData.filter(emp => 
          emp.department.toLowerCase() === filters.department.toLowerCase()
        );
      }
      
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredData = filteredData.filter(emp => 
          emp.name.toLowerCase().includes(search) || 
          emp.empId.toLowerCase().includes(search)
        );
      }
      
      return {
        success: true,
        data: filteredData
      };
    } catch (error) {
      console.error('Error fetching attendance list:', error);
      return {
        success: false,
        message: 'Không thể tải danh sách chấm công',
        data: []
      };
    }
  },

  // ⏰ Chấm công vào/ra
  checkIn: async (data) => {
    try {
      await delay(800); // Simulate processing time
      
      // Simulate validation
      if (data.method === 'gps' && !data.coords) {
        return {
          success: false,
          message: 'Không thể lấy vị trí GPS'
        };
      }
      
      if (data.method === 'qr' && !data.qrToken) {
        return {
          success: false,
          message: 'Vui lòng nhập QR token'
        };
      }
      
      if (data.method === 'face' && !data.selfieBase64) {
        return {
          success: false,
          message: 'Vui lòng chụp ảnh xác thực'
        };
      }
      
      // Add to mock history
      const newRecord = {
        id: Date.now(),
        type: data.type,
        method: data.method,
        location: data.location,
        at: new Date().toISOString(),
        status: 'present',
        verified: {
          geo: data.method === 'gps',
          qr: data.method === 'qr',
          face: data.method === 'face'
        }
      };
      
      mockHistory.unshift(newRecord);
      
      return {
        success: true,
        message: `Chấm công ${data.type === 'in' ? 'vào' : data.type === 'out' ? 'ra' : 'OT'} thành công`,
        data: newRecord
      };
    } catch (error) {
      console.error('Error checking in:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi chấm công'
      };
    }
  },

  // 📅 Lấy lịch sử chấm công của nhân viên
  getHistory: async (employeeId, startDate, endDate) => {
    try {
      await delay(300);
      return {
        success: true,
        data: mockHistory
      };
    } catch (error) {
      console.error('Error fetching history:', error);
      return {
        success: false,
        message: 'Không thể tải lịch sử chấm công',
        data: []
      };
    }
  },

  // 🏖️ Quản lý nghỉ phép
  getLeaveRequests: async (filters = {}) => {
    try {
      await delay(300);
      let filteredRequests = [...mockLeaveRequests];
      
      if (filters.status && filters.status !== 'all') {
        filteredRequests = filteredRequests.filter(req => req.status === filters.status);
      }
      
      return {
        success: true,
        data: filteredRequests
      };
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      return {
        success: false,
        message: 'Không thể tải danh sách đơn nghỉ phép',
        data: []
      };
    }
  },

  createLeaveRequest: async (data) => {
    try {
      await delay(500);
      
      const newRequest = {
        id: Date.now(),
        employeeId: data.employeeId,
        employeeName: data.employeeName,
        department: data.department,
        leaveType: data.leaveType,
        startDate: data.startDate,
        endDate: data.endDate,
        days: data.days,
        reason: data.reason,
        status: 'pending',
        approver: 'Trần Thị B',
        rejectionReason: null
      };
      
      mockLeaveRequests.unshift(newRequest);
      
      return {
        success: true,
        message: 'Gửi đơn nghỉ phép thành công',
        data: newRequest
      };
    } catch (error) {
      console.error('Error creating leave request:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi gửi đơn nghỉ phép'
      };
    }
  },

  approveLeaveRequest: async (requestId, status, reason = null) => {
    try {
      await delay(400);
      
      const requestIndex = mockLeaveRequests.findIndex(req => req.id === requestId);
      if (requestIndex === -1) {
        return {
          success: false,
          message: 'Không tìm thấy đơn nghỉ phép'
        };
      }
      
      mockLeaveRequests[requestIndex].status = status;
      if (status === 'rejected') {
        mockLeaveRequests[requestIndex].rejectionReason = reason;
      }
      
      return {
        success: true,
        message: status === 'approved' ? 'Duyệt đơn nghỉ phép thành công' : 'Từ chối đơn nghỉ phép thành công'
      };
    } catch (error) {
      console.error('Error approving leave:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi xử lý đơn nghỉ phép'
      };
    }
  },

  // 📥 Xuất báo cáo Excel
  exportReport: async (filters) => {
    try {
      await delay(1000);
      
      // Simulate Excel export
      const csvContent = "Mã NV,Họ tên,Phòng ban,Giờ vào,Giờ ra,Vị trí,Trạng thái\n" +
        mockAttendanceData.map(emp => 
          `${emp.empId},${emp.name},${emp.department},${emp.checkIn || '-'},${emp.checkOut || '-'},${emp.location || '-'},${emp.status}`
        ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `attendance_report_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return {
        success: true,
        message: 'Xuất báo cáo thành công'
      };
    } catch (error) {
      console.error('Error exporting report:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi xuất báo cáo'
      };
    }
  },

  // 📊 Lấy dữ liệu biểu đồ chấm công
  getAttendanceChart: async (period = 'week') => {
    try {
      await delay(300);
      
      const chartData = {
        week: [
          { date: '2024-01-15', present: 45, absent: 5, late: 8 },
          { date: '2024-01-16', present: 48, absent: 2, late: 6 },
          { date: '2024-01-17', present: 46, absent: 4, late: 7 },
          { date: '2024-01-18', present: 49, absent: 1, late: 5 },
          { date: '2024-01-19', present: 47, absent: 3, late: 9 },
          { date: '2024-01-20', present: 44, absent: 6, late: 4 },
          { date: '2024-01-21', present: 42, absent: 8, late: 3 }
        ],
        month: [
          { week: 'Tuần 1', present: 320, absent: 30, late: 45 },
          { week: 'Tuần 2', present: 335, absent: 15, late: 38 },
          { week: 'Tuần 3', present: 328, absent: 22, late: 42 },
          { week: 'Tuần 4', present: 342, absent: 8, late: 35 }
        ]
      };
      
      return {
        success: true,
        data: chartData[period] || chartData.week
      };
    } catch (error) {
      console.error('Error fetching chart data:', error);
      return {
        success: false,
        message: 'Không thể tải dữ liệu biểu đồ',
        data: []
      };
    }
  }
};

export default attendanceService;