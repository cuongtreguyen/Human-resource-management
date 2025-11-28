import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserPlus, Clock, Calendar, DollarSign,
  CheckCircle, XCircle, TrendingUp,
  HelpCircle, PieChart
} from 'lucide-react';
import fakeApi from '../../services/fakeApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fakeApi.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      setError('Không thể tải dữ liệu bảng điều khiển');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl mb-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Bảng điều khiển Admin</h1>
        <p className="text-blue-100">Tổng quan hệ thống quản lý nhân sự</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Tổng nhân viên */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng nhân viên</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalEmployees}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {stats?.activeEmployees} đang làm
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Nhân viên mới */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Nhân viên mới tháng này</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.newHiresThisMonth}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600">+{stats?.newHiresThisMonth} người</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Đang nghỉ phép */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Đang nghỉ phép</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.employeesOnLeave}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  {stats?.pendingLeaveRequests} chờ duyệt
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tổng lương */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng lương tháng</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(stats?.totalPayrollAmount || 0)}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  {stats?.pendingPayroll} chờ xử lý
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Đúng giờ hôm nay</p>
            <p className="text-lg font-bold text-gray-900">{stats?.onTimeToday}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Đi muộn hôm nay</p>
            <p className="text-lg font-bold text-gray-900">{stats?.lateToday}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Vắng mặt hôm nay</p>
            <p className="text-lg font-bold text-gray-900">{stats?.absentToday}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Tỷ lệ chấm công TB</p>
            <p className="text-lg font-bold text-gray-900">{stats?.averageAttendance}%</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Weekly Attendance Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chấm công tuần này</h3>
          <div className="flex items-end justify-between h-48 px-2">
            {stats?.weeklyAttendance?.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="flex flex-col gap-1">
                  <div
                    className="w-8 bg-green-400 rounded-t"
                    style={{ height: `${(day.present / 150) * 120}px` }}
                    title={`Có mặt: ${day.present}`}
                  ></div>
                  <div
                    className="w-8 bg-yellow-400"
                    style={{ height: `${(day.late / 150) * 120}px` }}
                    title={`Đi muộn: ${day.late}`}
                  ></div>
                  <div
                    className="w-8 bg-red-400 rounded-b"
                    style={{ height: `${(day.absent / 150) * 120}px` }}
                    title={`Vắng: ${day.absent}`}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{day.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <span className="text-xs text-gray-600">Có mặt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
              <span className="text-xs text-gray-600">Đi muộn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span className="text-xs text-gray-600">Vắng mặt</span>
            </div>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố phòng ban</h3>
          <div className="space-y-3">
            {stats?.departments?.map((dept, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: dept.color }}
                ></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">{dept.name}</span>
                    <span className="text-sm font-medium text-gray-900">{dept.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${(dept.count / stats.totalEmployees) * 100}%`,
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

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <button
            onClick={() => navigate('/employees/add')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <UserPlus className="w-6 h-6 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Thêm nhân viên</span>
          </button>

          <button
            onClick={() => navigate('/attendance')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
          >
            <Clock className="w-6 h-6 text-green-600" />
            <span className="text-xs font-medium text-green-700">Chấm công</span>
          </button>

          <button
            onClick={() => navigate('/payroll')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <DollarSign className="w-6 h-6 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">Bảng lương</span>
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            <PieChart className="w-6 h-6 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-700">Báo cáo</span>
          </button>

          <button
            onClick={() => navigate('/admin/support-tickets')}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors"
          >
            <HelpCircle className="w-6 h-6 text-pink-600" />
            <span className="text-xs font-medium text-pink-700">Hỗ trợ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
