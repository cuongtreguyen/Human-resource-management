import React, { useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign, FileText, Receipt, BarChart3,
  AlertCircle, Wallet, CreditCard, Clock, TrendingUp, TrendingDown
} from 'lucide-react';
import { usePayrollDashboard } from '../../hooks/useAccountantData';

// Import skeleton components trực tiếp (không cần lazy load)
import DashboardStatsCardsSkeleton from '../../components/dashboard/DashboardStatsCardsSkeleton';
import DashboardChartsSkeleton from '../../components/dashboard/DashboardChartsSkeleton';

// Lazy load các components không quan trọng (chỉ load khi cần)
const DashboardCharts = lazy(() => import('../../components/dashboard/DashboardCharts'));
const DashboardPendingLists = lazy(() => import('../../components/dashboard/DashboardPendingLists'));
const DashboardStatsCards = lazy(() => import('../../components/dashboard/DashboardStatsCards'));

const AccountantDashboard = () => {
  const navigate = useNavigate();

  // Sử dụng React Query hook - tự động cache và refetch
  const { data: stats, isLoading: loading, error, refetch } = usePayrollDashboard();

  // Memoize format functions để tránh tạo lại mỗi lần render
  const formatCurrency = useMemo(() => (amount) => {
    if (!amount && amount !== 0) return '0';
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} tỷ`;
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)} triệu`;
    }
    return new Intl.NumberFormat('vi-VN').format(amount);
  }, []);

  const formatFullCurrency = useMemo(() => (amount) => {
    if (!amount && amount !== 0) return '0 VND';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  // Progressive loading: Hiển thị skeleton cho từng section thay vì full page loading
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600 mb-4">{error?.message || 'Không thể tải dữ liệu dashboard'}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-8 rounded-2xl shadow-xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Bảng điều khiển Kế toán</h1>
            <p className="text-emerald-100 text-base sm:text-lg">Tổng quan tài chính và lương</p>
          </div>
        </div>
      </div>

      {/* Main Stats Cards - Priority 1: Load ngay */}
      <Suspense fallback={<DashboardStatsCardsSkeleton />}>
        {loading ? (
          <DashboardStatsCardsSkeleton />
        ) : (
          <DashboardStatsCards stats={stats} formatCurrency={formatCurrency} />
        )}
      </Suspense>

      {/* Salary Breakdown - Priority 2: Load ngay sau stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Lương cơ bản</p>
              <p className="text-sm font-bold text-gray-900">
                {loading ? (
                  <span className="inline-block h-4 w-16 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  formatCurrency(stats?.basicSalaryTotal)
                )}
              </p>
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
              <p className="text-sm font-bold text-gray-900">
                {loading ? (
                  <span className="inline-block h-4 w-16 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  formatCurrency(stats?.allowanceTotal)
                )}
              </p>
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
              <p className="text-sm font-bold text-gray-900">
                {loading ? (
                  <span className="inline-block h-4 w-16 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  formatCurrency(stats?.overtimeTotal)
                )}
              </p>
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
              <p className="text-sm font-bold text-gray-900">
                {loading ? (
                  <span className="inline-block h-4 w-16 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  formatCurrency(stats?.bonusTotal)
                )}
              </p>
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
              <p className="text-sm font-bold text-gray-900">
                {loading ? (
                  <span className="inline-block h-4 w-16 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  formatCurrency(stats?.deductionTotal)
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts - Priority 3: Load sau khi stats đã hiển thị */}
      {!loading && (
        <Suspense fallback={<DashboardChartsSkeleton />}>
          <DashboardCharts 
            stats={stats} 
            formatCurrency={formatCurrency} 
            formatFullCurrency={formatFullCurrency} 
          />
        </Suspense>
      )}

      {/* Pending Lists - Priority 4: Load cuối cùng (lazy) */}
      {!loading && (
        <Suspense fallback={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-16 bg-gray-100 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        }>
          <DashboardPendingLists 
            stats={stats} 
            formatFullCurrency={formatFullCurrency} 
          />
        </Suspense>
      )}

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
            onClick={() => navigate('/benefits')}
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
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard;
