// src/hooks/useAccountantData.js
// Custom hooks cho Accountant với React Query caching

import { useQuery } from '@tanstack/react-query';
import { getPayrollDashboard, getPayrollSummary, getFilterOptions } from '../services/payrollService';
import { getAllBenefits, getAllInsuranceContracts } from '../services/benefitsService';
import { getLeaveRequests } from '../services/leaveService';

// Màu cho các phòng ban
const DEPARTMENT_COLORS = {
  'IT': '#3B82F6',
  'Công nghệ thông tin': '#3B82F6',
  'Sales': '#F59E0B',
  'Kinh doanh': '#F59E0B',
  'Marketing': '#10B981',
  'Operations': '#EC4899',
  'Vận hành': '#EC4899',
  'Finance': '#8B5CF6',
  'Tài chính': '#8B5CF6',
  'HR': '#EF4444',
  'Nhân sự': '#EF4444',
  'Human Resources': '#EF4444',
};

const getDepartmentColor = (department, index) => {
  return DEPARTMENT_COLORS[department] || ['#3B82F6', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#EF4444'][index % 6];
};

/**
 * Hook lấy dữ liệu Dashboard Accountant
 * Cache 5 phút, auto refetch khi focus window
 */
export const usePayrollDashboard = () => {
  return useQuery({
    queryKey: ['payroll-dashboard'],
    queryFn: async () => {
      console.log('🔄 Fetching payroll dashboard...');
      const dashboardData = await getPayrollDashboard();
      console.log('✅ Dashboard data received:', dashboardData);

      // Map data từ API sang format hiển thị
      return {
        // Tổng quan lương
        totalPayroll: dashboardData.totalPayroll || 0,
        pendingPayroll: dashboardData.pendingPayroll || 0,
        payrollGrowth: dashboardData.payrollGrowth || 0,

        // Chi tiết lương tháng này
        basicSalaryTotal: dashboardData.basicSalaryTotal || 0,
        allowanceTotal: dashboardData.allowanceTotal || 0,
        overtimeTotal: dashboardData.overtimeTotal || 0,
        bonusTotal: dashboardData.bonusTotal || 0,
        deductionTotal: dashboardData.deductionTotal || 0,

        // Bảo hiểm
        insuranceTotal: dashboardData.insuranceTotal || 0,

        // Lương theo phòng ban
        payrollByDepartment: (dashboardData.payrollByDepartment || []).map((dept, index) => ({
          name: dept.department,
          amount: dept.totalPayrollEmployeeByDepartment || 0,
          color: getDepartmentColor(dept.department, index)
        })),

        // Lương theo tháng
        monthlyPayroll: (dashboardData.monthlyPayroll || []).map(item => ({
          month: item.month,
          amount: item.totalPayroll || 0
        })),

        // Danh sách lương chờ xử lý
        pendingPayrollList: (dashboardData.pendingPayrollList || []).map(item => ({
          id: item.employeeId,
          name: item.firstName || 'N/A',
          department: item.department || 'N/A',
          salary: item.netSalary || 0,
          status: item.status
        })),

        // Placeholder cho phúc lợi
        pendingBenefitRequests: 0,
        pendingBenefits: []
      };
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
  });
};

/**
 * Hook lấy Payroll Summary
 */
export const usePayrollSummary = () => {
  return useQuery({
    queryKey: ['payroll-summary'],
    queryFn: async () => {
      const data = await getPayrollSummary();
      return {
        totalEmployees: data.totalEmployees || 0,
        totalPayroll: data.totalPayroll || 0,
        totalOTPay: data.totalOTPay || 0,
        totalInsurance: data.totalInsurance || 0,
        totalTax: data.totalTax || 0,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook lấy Filter Options
 */
export const useFilterOptions = () => {
  return useQuery({
    queryKey: ['filter-options'],
    queryFn: getFilterOptions,
    staleTime: 10 * 60 * 1000, // 10 phút (ít thay đổi)
  });
};

/**
 * Hook lấy danh sách Benefits
 */
export const useBenefits = () => {
  return useQuery({
    queryKey: ['benefits'],
    queryFn: async () => {
      const data = await getAllBenefits();
      const benefits = Array.isArray(data) ? data : data.data || [];
      return benefits.map(b => ({
        id: b.benefitId || b.id,
        name: b.benefitName || b.name,
        description: b.description || '',
        amount: b.allowanceAmount || 0,
        employees: b.numberOfEmployees || 0,
        status: b.status || 'ACTIVE',
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook lấy danh sách Insurance Contracts
 */
export const useInsuranceContracts = () => {
  return useQuery({
    queryKey: ['insurance-contracts'],
    queryFn: async () => {
      const data = await getAllInsuranceContracts();
      const contracts = Array.isArray(data) ? data : data.data || [];
      return contracts.map(i => ({
        id: i.id,
        name: i.insurenceName || i.name,
        provider: i.provider || '',
        employerRate: i.employerRate || 0,
        employeeRate: i.employeeRate || 0,
        effective: i.effective,
        expiry: i.expiry,
        status: i.status || 'ACTIVE',
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook lấy danh sách Leave Requests
 */
export const useLeaveRequests = (filters = {}) => {
  return useQuery({
    queryKey: ['leave-requests', filters],
    queryFn: async () => {
      const data = await getLeaveRequests(filters);
      const leaves = Array.isArray(data) ? data : data.data || [];
      return leaves.map(leave => ({
        id: leave.leaveId || leave.id,
        employeeId: leave.employeeId,
        employeeName: leave.employeeName || leave.fullName || 'N/A',
        department: leave.department || 'Chưa xác định',
        type: leave.leaveType || leave.type,
        startDate: leave.startDate,
        endDate: leave.endDate,
        days: leave.days || leave.totalDays || 1,
        reason: leave.reason || '',
        status: (leave.status || 'PENDING').toLowerCase(),
      }));
    },
    staleTime: 2 * 60 * 1000, // 2 phút (thay đổi thường xuyên hơn)
  });
};

/**
 * Hook kết hợp tất cả data cho Dashboard
 * Parallel fetching - tất cả API gọi cùng lúc
 */
export const useAccountantDashboardData = () => {
  const dashboard = usePayrollDashboard();
  const benefits = useBenefits();
  const insurance = useInsuranceContracts();

  return {
    // Main dashboard data
    dashboard: dashboard.data,
    dashboardLoading: dashboard.isLoading,
    dashboardError: dashboard.error,

    // Benefits
    benefits: benefits.data,
    benefitsLoading: benefits.isLoading,

    // Insurance
    insurance: insurance.data,
    insuranceLoading: insurance.isLoading,

    // Overall status
    isLoading: dashboard.isLoading,
    isError: dashboard.isError,
    error: dashboard.error,

    // Refetch functions
    refetchDashboard: dashboard.refetch,
    refetchAll: () => {
      dashboard.refetch();
      benefits.refetch();
      insurance.refetch();
    },
  };
};

export default {
  usePayrollDashboard,
  usePayrollSummary,
  useFilterOptions,
  useBenefits,
  useInsuranceContracts,
  useLeaveRequests,
  useAccountantDashboardData,
};
