import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  createOvertimeRequest,
  getOvertimeByStatus,
  getOvertimeDetails,
  setOvertimeStatus,
  formatOTListResponse,
  formatOTResponse,
  mapOTStatusToBackend,
  getMyOvertimeHistory,
  formatOTHistoryResponse,
} from '../services/overtimeService';
import { getRole } from '../utils/auth';

const OTContext = createContext();

const MONTHLY_QUOTA = 40; // 40 hours per month

export const useOTContext = () => {
  const context = useContext(OTContext);
  if (!context) {
    throw new Error('useOTContext must be used within an OTProvider');
  }
  return context;
};

export const OTProvider = ({ children }) => {
  // State để lưu danh sách OT từ API
  const [otRequests, setOTRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch OT list từ API - phân quyền theo role
  const fetchOTRequests = useCallback(async (status = null) => {
    setLoading(true);
    setError(null);
    try {
      const userRole = getRole();

      let data;
      if (userRole === 'employee') {
        // Employee: chỉ lấy OT của chính mình
        data = await getMyOvertimeHistory();
        const formattedData = formatOTHistoryResponse(data);
        setOTRequests(formattedData);
        return formattedData;
      } else {
        // Admin/Manager/Accountant: lấy tất cả OT
        data = await getOvertimeByStatus(status ? mapOTStatusToBackend(status) : null);
        const formattedData = formatOTListResponse(data);
        setOTRequests(formattedData);
        return formattedData;
      }
    } catch (err) {
      console.error('Error fetching OT requests:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load OT requests on mount
  useEffect(() => {
    fetchOTRequests();
  }, [fetchOTRequests]);

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

  // Create new OT request - GỌI API BACKEND
  const createOTRequest = async (requestData) => {
    setLoading(true);
    setError(null);
    try {
      // Map data từ frontend sang format backend cần
      const apiData = {
        employeeId: requestData.employeeId, // ID số từ database
        otDate: requestData.otDate, // Format: YYYY-MM-DD
        otHours: requestData.plannedHours || requestData.otHours,
        boardId: requestData.boardId || null,
        reason: requestData.reason,
        department: requestData.department,
      };

      const response = await createOvertimeRequest(apiData);
      const formattedResponse = formatOTResponse(response);

      // Thêm vào state local
      setOTRequests(prev => [...prev, formattedResponse]);

      // Refresh danh sách từ server
      await fetchOTRequests();

      return formattedResponse;
    } catch (err) {
      console.error('Error creating OT request:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update OT request - local state only (API không có endpoint update)
  const updateOTRequest = (id, updates) => {
    setOTRequests(prev => prev.map(ot =>
      ot.id === id ? { ...ot, ...updates } : ot
    ));
  };

  // Delete/Cancel OT request - GỌI API BACKEND
  const deleteOTRequest = async (id) => {
    setLoading(true);
    setError(null);
    try {
      // Gọi API để hủy OT (set status = CANCELLED)
      await setOvertimeStatus(id, 'CANCELLED');

      // Xóa khỏi state local
      setOTRequests(prev => prev.filter(ot => ot.id !== id));

      // Refresh danh sách
      await fetchOTRequests();
    } catch (err) {
      console.error('Error deleting OT request:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==================== APPROVAL WORKFLOW ====================

  // Manager approves OT - GỌI API BACKEND
  const approveOT = async (id, managerNote = '') => {
    setLoading(true);
    setError(null);
    try {
      await setOvertimeStatus(id, 'APPROVED', managerNote);

      // Update local state
      setOTRequests(prev => prev.map(ot =>
        ot.id === id ? {
          ...ot,
          status: 'approved',
          approvedAt: new Date().toISOString(),
          managerNote
        } : ot
      ));

      // Refresh danh sách
      await fetchOTRequests();
    } catch (err) {
      console.error('Error approving OT:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Manager rejects OT - GỌI API BACKEND
  const rejectOT = async (id, rejectReason = '') => {
    setLoading(true);
    setError(null);
    try {
      await setOvertimeStatus(id, 'REJECTED', rejectReason);

      // Update local state
      setOTRequests(prev => prev.map(ot =>
        ot.id === id ? {
          ...ot,
          status: 'rejected',
          approvedAt: new Date().toISOString(),
          managerNote: rejectReason
        } : ot
      ));

      // Refresh danh sách
      await fetchOTRequests();
    } catch (err) {
      console.error('Error rejecting OT:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Manager marks OT as completed - GỌI API BACKEND
  const completeOT = async (id, managerNote = '') => {
    setLoading(true);
    setError(null);
    try {
      await setOvertimeStatus(id, 'COMPLETED', managerNote);

      // Update local state
      setOTRequests(prev => prev.map(ot =>
        ot.id === id ? {
          ...ot,
          status: 'completed',
          managerNote
        } : ot
      ));

      // Refresh danh sách
      await fetchOTRequests();
    } catch (err) {
      console.error('Error completing OT:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Employee submits result report (giữ local vì BE chưa có endpoint)
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

  // Manager reviews OT result (giữ local vì BE chưa có endpoint)
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

  // Accountant approves for payroll (giữ local vì BE chưa có endpoint)
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

  // Reset/Refresh data từ API
  const refreshOTRequests = () => {
    return fetchOTRequests();
  };

  const value = {
    // State
    otRequests,
    loading,
    error,
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
    completeOT,
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
    refreshOTRequests,
    fetchOTRequests,
  };

  return (
    <OTContext.Provider value={value}>
      {children}
    </OTContext.Provider>
  );
};

export default OTContext;
