import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign, Users, FileText, Calculator, TrendingUp, TrendingDown,
  CreditCard, Wallet, PiggyBank, Receipt, Clock, CheckCircle,
  AlertCircle, BarChart3, PieChart, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const AccountantDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Giả lập data cho Accountant
      const accountantStats = {
        // Tổng quan lương
        totalPayroll: 2850000000,
        pendingPayroll: 23,
        completedPayroll: 133,
        payrollGrowth: 5.2,

        // Chi tiết lương tháng này
        basicSalaryTotal: 2200000000,
        allowanceTotal: 350000000,
        overtimeTotal: 180000000,
        bonusTotal: 120000000,
        deductionTotal: 85000000,

        // Phúc lợi & Bảo hiểm
        insuranceTotal: 420000000,
        benefitsTotal: 150000000,
        pendingBenefitRequests: 7,

        // Chấm công (để tính lương)
        totalWorkDays: 22,
        avgAttendanceRate: 94.5,
        overtimeHours: 156,

        // Lương theo phòng ban
        payrollByDepartment: [
          { name: 'Công nghệ thông tin', amount: 850000000, employees: 45, color: '#3B82F6' },
          { name: 'Kinh doanh', amount: 620000000, employees: 32, color: '#F59E0B' },
          { name: 'Marketing', amount: 380000000, employees: 28, color: '#10B981' },
          { name: 'Vận hành', amount: 350000000, employees: 21, color: '#EC4899' },
          { name: 'Tài chính', amount: 320000000, employees: 18, color: '#8B5CF6' },
          { name: 'Nhân sự', amount: 180000000, employees: 12, color: '#EF4444' },
        ],

        // Lương 6 tháng gần nhất
        monthlyPayroll: [
          { month: 'T8', amount: 2650000000 },
          { month: 'T9', amount: 2700000000 },
          { month: 'T10', amount: 2720000000 },
          { month: 'T11', amount: 2780000000 },
          { month: 'T12', amount: 2800000000 },
          { month: 'T1', amount: 2850000000 },
        ],

        // Nhân viên chờ xử lý lương
        pendingPayrollList: [
          { id: 1, name: 'Nguyễn Văn A', department: 'IT', salary: 18000000, status: 'pending' },
          { id: 2, name: 'Trần Thị B', department: 'Marketing', salary: 15000000, status: 'pending' },
          { id: 3, name: 'Lê Minh C', department: 'Sales', salary: 20000000, status: 'pending' },
        ],

        // Yêu cầu phúc lợi chờ duyệt
        pendingBenefits: [
          { id: 1, name: 'Phạm Thu D', type: 'Bảo hiểm sức khỏe', amount: 5000000 },
          { id: 2, name: 'Hoàng Đức E', type: 'Hỗ trợ đào tạo', amount: 3000000 },
        ]
      };
      setStats(accountantStats);
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} tỷ`;
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)} triệu`;
    }
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const formatFullCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-2xl mb-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Bảng điều khiển Kế toán</h1>
        <p className="text-emerald-100">Tổng quan tài chính và lương</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Tổng lương tháng */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng lương tháng này</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalPayroll)}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600">+{stats?.payrollGrowth}% so với tháng trước</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Lương chờ xử lý */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Lương chờ xử lý</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingPayroll}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  Cần duyệt
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Bảo hiểm */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Chi phí bảo hiểm</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.insuranceTotal)}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  BHXH + BHYT
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Phúc lợi chờ duyệt */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Phúc lợi chờ duyệt</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingBenefitRequests}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  Yêu cầu mới
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Receipt className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Salary Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Lương cơ bản</p>
              <p className="text-sm font-bold text-gray-900">{formatCurrency(stats?.basicSalaryTotal)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Phụ cấp</p>
              <p className="text-sm font-bold text-gray-900">{formatCurrency(stats?.allowanceTotal)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tăng ca</p>
              <p className="text-sm font-bold text-gray-900">{formatCurrency(stats?.overtimeTotal)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Thưởng</p>
              <p className="text-sm font-bold text-gray-900">{formatCurrency(stats?.bonusTotal)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Khấu trừ</p>
              <p className="text-sm font-bold text-gray-900">{formatCurrency(stats?.deductionTotal)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Payroll Chart */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi phí lương 6 tháng gần nhất</h3>
          <div className="flex items-end justify-between h-48 px-2">
            {stats?.monthlyPayroll?.map((month, index) => {
              const maxAmount = Math.max(...stats.monthlyPayroll.map(m => m.amount));
              const height = (month.amount / maxAmount) * 150;
              return (
                <div key={index} className="flex flex-col items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">{formatCurrency(month.amount)}</span>
                  <div
                    className="w-12 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t hover:from-emerald-600 hover:to-emerald-500 transition-colors cursor-pointer"
                    style={{ height: `${height}px` }}
                    title={formatFullCurrency(month.amount)}
                  ></div>
                  <span className="text-xs text-gray-500 font-medium">{month.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payroll by Department */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lương theo phòng ban</h3>
          <div className="space-y-3">
            {stats?.payrollByDepartment?.map((dept, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: dept.color }}
                ></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">{dept.name}</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(dept.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(dept.amount / stats.totalPayroll) * 100}%`,
                        backgroundColor: dept.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pending Payroll */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Lương chờ xử lý</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats?.pendingPayrollList?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatFullCurrency(item.salary)}</p>
                  <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Chờ duyệt</span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/payroll')}
            className="w-full mt-4 py-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            Xem tất cả & Xử lý
          </button>
        </div>

        {/* Pending Benefits */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Yêu cầu phúc lợi</h3>
            <Receipt className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats?.pendingBenefits?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatFullCurrency(item.amount)}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/admin/benefits')}
            className="w-full mt-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            Xem tất cả & Duyệt
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <button
            onClick={() => navigate('/payroll')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <DollarSign className="w-6 h-6 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">Bảng lương</span>
          </button>

          <button
            onClick={() => navigate('/payroll/policies')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Chính sách</span>
          </button>

          <button
            onClick={() => navigate('/admin/benefits')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <Receipt className="w-6 h-6 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">Phúc lợi</span>
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-700">Báo cáo</span>
          </button>

          <button
            onClick={() => navigate('/attendance')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors"
          >
            <Clock className="w-6 h-6 text-orange-600" />
            <span className="text-xs font-medium text-orange-700">Chấm công</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard;
