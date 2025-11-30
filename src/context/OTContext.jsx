import React, { createContext, useContext, useState, useEffect } from 'react';

const OTContext = createContext();

// Key for localStorage
const STORAGE_KEY = 'hrm_ot_requests';
const MONTHLY_QUOTA = 40; // 40 hours per month

export const useOTContext = () => {
  const context = useContext(OTContext);
  if (!context) {
    throw new Error('useOTContext must be used within an OTProvider');
  }
  return context;
};

// Default OT requests (sample data for demo)
const defaultOTRequests = [
  {
    id: 'ot001',
    employeeId: 'emp001',
    employeeName: 'Nguyễn Văn An',
    department: 'IT',
    taskId: 't3',
    taskTitle: 'Implement authentication system',
    taskDeadline: '2024-12-20',
    departmentId: 'it',
    otDate: '2024-12-10',
    plannedHours: 3,
    reason: 'Hoàn thành module authentication trước deadline',
    status: 'payroll_approved',
    submittedAt: '2024-12-10T14:30:00',
    approvedAt: '2024-12-10T15:00:00',
    approvedBy: 'Manager Trần',
    rejectReason: null,
    report: {
      actualHours: 3,
      completedWork: 'Hoàn thành JWT authentication và OAuth integration',
      progress: 85,
      submittedAt: '2024-12-10T21:00:00'
    },
    review: {
      reviewedAt: '2024-12-11T09:00:00',
      reviewedBy: 'Manager Trần',
      rating: 5,
      feedback: 'Công việc tốt, đúng tiến độ'
    },
    payrollApproved: true,
    payrollApprovedBy: 'Kế toán Linh',
    payrollApprovedAt: '2024-12-11T10:00:00',
    calculatedPay: 306818
  },
  {
    id: 'ot002',
    employeeId: 'emp002',
    employeeName: 'Trần Thị Bình',
    department: 'IT',
    taskId: 't1',
    taskTitle: 'Thiết kế giao diện dashboard mới',
    taskDeadline: '2024-12-15',
    departmentId: 'it',
    otDate: '2024-12-12',
    plannedHours: 2,
    reason: 'Hoàn thiện UI mockup',
    status: 'reviewed',
    submittedAt: '2024-12-12T14:00:00',
    approvedAt: '2024-12-12T14:30:00',
    approvedBy: 'Manager Trần',
    rejectReason: null,
    report: {
      actualHours: 2,
      completedWork: 'Hoàn thành mockup cho 3 màn hình chính',
      progress: 70,
      submittedAt: '2024-12-12T20:00:00'
    },
    review: {
      reviewedAt: '2024-12-13T09:00:00',
      reviewedBy: 'Manager Trần',
      rating: 4,
      feedback: 'Tốt, cần bổ sung thêm responsive'
    },
    payrollApproved: false,
    payrollApprovedBy: null,
    payrollApprovedAt: null,
    calculatedPay: null
  },
  {
    id: 'ot003',
    employeeId: 'emp003',
    employeeName: 'Lê Văn Cường',
    department: 'IT',
    taskId: 't2',
    taskTitle: 'Viết API documentation',
    taskDeadline: '2024-12-18',
    departmentId: 'it',
    otDate: '2024-12-14',
    plannedHours: 3,
    reason: 'Cập nhật tài liệu cho các endpoints mới',
    status: 'completed',
    submittedAt: '2024-12-14T14:30:00',
    approvedAt: '2024-12-14T15:00:00',
    approvedBy: 'Manager Trần',
    rejectReason: null,
    report: {
      actualHours: 2.5,
      completedWork: 'Hoàn thành 80% tài liệu API',
      progress: 80,
      submittedAt: '2024-12-14T20:30:00'
    },
    review: null,
    payrollApproved: false,
    payrollApprovedBy: null,
    payrollApprovedAt: null,
    calculatedPay: null
  },
  {
    id: 'ot004',
    employeeId: 'emp001',
    employeeName: 'Nguyễn Văn An',
    department: 'IT',
    taskId: 't4',
    taskTitle: 'Fix responsive issues',
    taskDeadline: '2024-12-16',
    departmentId: 'it',
    otDate: '2024-12-15',
    plannedHours: 2,
    reason: 'Sửa lỗi hiển thị trên mobile',
    status: 'approved',
    submittedAt: '2024-12-15T14:00:00',
    approvedAt: '2024-12-15T14:30:00',
    approvedBy: 'Manager Trần',
    rejectReason: null,
    report: null,
    review: null,
    payrollApproved: false,
    payrollApprovedBy: null,
    payrollApprovedAt: null,
    calculatedPay: null
  },
  {
    id: 'ot005',
    employeeId: 'emp004',
    employeeName: 'Phạm Thị Dung',
    department: 'IT',
    taskId: 't3',
    taskTitle: 'Implement authentication system',
    taskDeadline: '2024-12-20',
    departmentId: 'it',
    otDate: '2024-12-16',
    plannedHours: 4,
    reason: 'Hoàn thành OAuth2 integration',
    status: 'pending',
    submittedAt: '2024-12-16T14:00:00',
    approvedAt: null,
    approvedBy: null,
    rejectReason: null,
    report: null,
    review: null,
    payrollApproved: false,
    payrollApprovedBy: null,
    payrollApprovedAt: null,
    calculatedPay: null
  }
];

export const OTProvider = ({ children }) => {
  // Initialize state from localStorage or use default
  const [otRequests, setOTRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultOTRequests;
    } catch {
      return defaultOTRequests;
    }
  });

  // Save to localStorage whenever otRequests change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(otRequests));
  }, [otRequests]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newData = JSON.parse(e.newValue);
          setOTRequests(newData);
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ==================== VALIDATION HELPERS ====================

  // Check if can register OT (before 5 PM deadline)
  const canRegisterOT = (otDate) => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDay = new Date(otDate);
    selectedDay.setHours(0, 0, 0, 0);

    // Past date: NOT allowed
    if (selectedDay < today) {
      return {
        allowed: false,
        reason: 'Không thể đăng ký OT cho ngày đã qua',
        timeLeft: null
      };
    }

    // Today: Must be before 5 PM
    if (selectedDay.getTime() === today.getTime()) {
      const deadline = new Date();
      deadline.setHours(17, 0, 0, 0);

      if (now >= deadline) {
        return {
          allowed: false,
          reason: 'Đã quá hạn đăng ký OT (17:00). Vui lòng đăng ký trước 5 giờ chiều.',
          timeLeft: null
        };
      }

      // Calculate time remaining
      const diffMs = deadline - now;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      return {
        allowed: true,
        reason: `Còn ${hours} giờ ${minutes} phút để đăng ký`,
        timeLeft: `${hours}:${minutes.toString().padStart(2, '0')}`
      };
    }

    // Future dates - no time restriction
    return {
      allowed: true,
      reason: 'Có thể đăng ký OT cho ngày này',
      timeLeft: null
    };
  };

  // Check monthly quota (40h/month)
  const checkMonthlyQuota = (employeeId, month, requestedHours = 0) => {
    const monthKey = month || new Date().toISOString().slice(0, 7); // YYYY-MM

    const usedHours = otRequests
      .filter(ot =>
        ot.employeeId === employeeId &&
        ot.otDate.startsWith(monthKey) &&
        ['approved', 'completed', 'reviewed', 'payroll_approved'].includes(ot.status)
      )
      .reduce((sum, ot) => sum + (ot.report?.actualHours || ot.plannedHours), 0);

    const remaining = MONTHLY_QUOTA - usedHours;

    if (requestedHours > remaining) {
      return {
        allowed: false,
        used: usedHours,
        remaining: Math.max(0, remaining),
        quota: MONTHLY_QUOTA,
        message: `Chỉ còn ${Math.max(0, remaining)}h OT trong tháng này`
      };
    }

    return {
      allowed: true,
      used: usedHours,
      remaining,
      quota: MONTHLY_QUOTA,
      message: `Còn ${remaining}h OT trong tháng`
    };
  };

  // Validate OT hours (1-4 hours)
  const validateOTHours = (hours) => {
    if (hours < 1) {
      return { valid: false, message: 'OT phải ít nhất 1 giờ' };
    }
    if (hours > 4) {
      return { valid: false, message: 'Tối đa 4 giờ OT mỗi ngày' };
    }
    return { valid: true, message: '' };
  };

  // ==================== CRUD OPERATIONS ====================

  // Create new OT request
  const createOTRequest = (requestData) => {
    const newRequest = {
      id: `ot${Date.now()}`,
      ...requestData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      approvedAt: null,
      approvedBy: null,
      rejectReason: null,
      report: null,
      review: null,
      payrollApproved: false,
      payrollApprovedBy: null,
      payrollApprovedAt: null,
      calculatedPay: null
    };

    setOTRequests(prev => [...prev, newRequest]);
    return newRequest;
  };

  // Update OT request
  const updateOTRequest = (id, updates) => {
    setOTRequests(prev => prev.map(ot =>
      ot.id === id ? { ...ot, ...updates } : ot
    ));
  };

  // Delete OT request (only pending can be deleted)
  const deleteOTRequest = (id) => {
    setOTRequests(prev => prev.filter(ot => ot.id !== id));
  };

  // ==================== APPROVAL WORKFLOW ====================

  // Manager approves OT
  const approveOT = (id, approvedBy) => {
    setOTRequests(prev => prev.map(ot =>
      ot.id === id ? {
        ...ot,
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy
      } : ot
    ));
  };

  // Manager rejects OT
  const rejectOT = (id, rejectReason, rejectedBy) => {
    setOTRequests(prev => prev.map(ot =>
      ot.id === id ? {
        ...ot,
        status: 'rejected',
        approvedAt: new Date().toISOString(),
        approvedBy: rejectedBy,
        rejectReason
      } : ot
    ));
  };

  // Employee submits result report
  const submitReport = (id, reportData) => {
    setOTRequests(prev => prev.map(ot =>
      ot.id === id ? {
        ...ot,
        status: 'completed',
        report: {
          ...reportData,
          submittedAt: new Date().toISOString()
        }
      } : ot
    ));
  };

  // Manager reviews OT result
  const reviewOT = (id, reviewData) => {
    setOTRequests(prev => prev.map(ot =>
      ot.id === id ? {
        ...ot,
        status: 'reviewed',
        review: {
          ...reviewData,
          reviewedAt: new Date().toISOString()
        }
      } : ot
    ));
  };

  // Accountant approves for payroll
  const approveForPayroll = (id, approvedBy, hourlyRate) => {
    setOTRequests(prev => prev.map(ot => {
      if (ot.id === id) {
        const actualHours = ot.report?.actualHours || ot.plannedHours;
        const calculatedPay = Math.round(actualHours * hourlyRate * 1.5);

        return {
          ...ot,
          status: 'payroll_approved',
          payrollApproved: true,
          payrollApprovedBy: approvedBy,
          payrollApprovedAt: new Date().toISOString(),
          calculatedPay
        };
      }
      return ot;
    }));
  };

  // ==================== QUERY METHODS ====================

  // Get OT requests by employee
  const getOTByEmployee = (employeeId) => {
    return otRequests.filter(ot => ot.employeeId === employeeId);
  };

  // Get OT requests by status
  const getOTByStatus = (status) => {
    if (status === 'all') return otRequests;
    return otRequests.filter(ot => ot.status === status);
  };

  // Get pending OT requests (for Manager)
  const getPendingOT = () => {
    return otRequests.filter(ot => ot.status === 'pending');
  };

  // Get OT awaiting review (for Manager)
  const getOTForReview = () => {
    return otRequests.filter(ot => ot.status === 'completed');
  };

  // Get OT awaiting payroll approval (for Accountant)
  // After employee submits report (completed), it goes directly to accountant
  const getOTForPayroll = () => {
    return otRequests.filter(ot => ot.status === 'completed');
  };

  // Get approved OT that needs report (for Employee)
  const getOTNeedingReport = (employeeId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return otRequests.filter(ot => {
      const otDate = new Date(ot.otDate);
      otDate.setHours(0, 0, 0, 0);

      return ot.employeeId === employeeId &&
             ot.status === 'approved' &&
             otDate <= today;
    });
  };

  // Get OT statistics
  const getOTStatistics = (month = null) => {
    const monthKey = month || new Date().toISOString().slice(0, 7);
    const monthRequests = otRequests.filter(ot => ot.otDate.startsWith(monthKey));

    const totalHours = monthRequests
      .filter(ot => ['approved', 'completed', 'reviewed', 'payroll_approved'].includes(ot.status))
      .reduce((sum, ot) => sum + (ot.report?.actualHours || ot.plannedHours), 0);

    const totalPay = monthRequests
      .filter(ot => ot.payrollApproved && ot.calculatedPay)
      .reduce((sum, ot) => sum + ot.calculatedPay, 0);

    return {
      total: monthRequests.length,
      pending: monthRequests.filter(ot => ot.status === 'pending').length,
      approved: monthRequests.filter(ot => ot.status === 'approved').length,
      completed: monthRequests.filter(ot => ot.status === 'completed').length,
      reviewed: monthRequests.filter(ot => ot.status === 'reviewed').length,
      payrollApproved: monthRequests.filter(ot => ot.status === 'payroll_approved').length,
      rejected: monthRequests.filter(ot => ot.status === 'rejected').length,
      totalHours,
      totalPay
    };
  };

  // Get payroll summary for a month
  const getPayrollSummary = (month) => {
    const monthKey = month || new Date().toISOString().slice(0, 7);

    const approvedOT = otRequests.filter(ot =>
      ot.otDate.startsWith(monthKey) &&
      ot.status === 'payroll_approved' &&
      ot.payrollApproved
    );

    // Group by employee
    const byEmployee = approvedOT.reduce((acc, ot) => {
      if (!acc[ot.employeeId]) {
        acc[ot.employeeId] = {
          employeeId: ot.employeeId,
          employeeName: ot.employeeName,
          department: ot.department,
          requests: [],
          totalHours: 0,
          totalPay: 0
        };
      }
      acc[ot.employeeId].requests.push(ot);
      acc[ot.employeeId].totalHours += ot.report?.actualHours || ot.plannedHours;
      acc[ot.employeeId].totalPay += ot.calculatedPay || 0;
      return acc;
    }, {});

    return {
      month: monthKey,
      employees: Object.values(byEmployee),
      totalRequests: approvedOT.length,
      totalHours: approvedOT.reduce((sum, ot) => sum + (ot.report?.actualHours || ot.plannedHours), 0),
      totalPay: approvedOT.reduce((sum, ot) => sum + (ot.calculatedPay || 0), 0)
    };
  };

  // Reset to default data
  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    setOTRequests(defaultOTRequests);
  };

  const value = {
    otRequests,
    // Validation
    canRegisterOT,
    checkMonthlyQuota,
    validateOTHours,
    MONTHLY_QUOTA,
    // CRUD
    createOTRequest,
    updateOTRequest,
    deleteOTRequest,
    // Workflow
    approveOT,
    rejectOT,
    submitReport,
    reviewOT,
    approveForPayroll,
    // Queries
    getOTByEmployee,
    getOTByStatus,
    getPendingOT,
    getOTForReview,
    getOTForPayroll,
    getOTNeedingReport,
    getOTStatistics,
    getPayrollSummary,
    // Utils
    resetToDefault,
  };

  return (
    <OTContext.Provider value={value}>
      {children}
    </OTContext.Provider>
  );
};

export default OTContext;
