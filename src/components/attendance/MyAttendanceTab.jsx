import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle, Clock, Video, Calendar, TrendingUp, AlertCircle, History } from 'lucide-react';
import { getUserInfo } from '../../utils/auth';
import faceRecognitionApi from '../../services/faceRecognitionApi';

const MyAttendanceTab = ({ themeColor = 'purple', onStartRecognition, onStopProcess, isLoading, cameraActive }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState({ stats: {}, records: [] });
  const [loadingStats, setLoadingStats] = useState(true);
  const userInfo = getUserInfo();

  // Cập nhật thời gian
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Lấy thống kê chấm công của tháng hiện tại
  useEffect(() => {
    const fetchMonthlyStats = async () => {
      if (!userInfo?.id) return;
      setLoadingStats(true);
      try {
        const data = await faceRecognitionApi.getMonthlyStats(userInfo.id);
        setMonthlyData(data);
      } catch (error) {
        console.error('Error fetching monthly stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchMonthlyStats();
  }, [userInfo?.id]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      present: { label: 'Đúng giờ', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      late: { label: 'Đi trễ', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      early_leave: { label: 'Về sớm', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
      late_and_early: { label: 'Trễ & Về sớm', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      overtime: { label: 'Tăng ca', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      absent: { label: 'Vắng mặt', bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
    };
    const config = statusConfig[status] || statusConfig.present;
    return (
      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
        {config.label}
      </span>
    );
  };

  const themeColors = {
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700',
      light: 'text-purple-800',
      icon: 'text-purple-500'
    },
    emerald: {
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-600',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      light: 'text-emerald-800',
      icon: 'text-emerald-500'
    }
  };

  const theme = themeColors[themeColor] || themeColors.purple;
  const stats = monthlyData.stats || {};
  const records = monthlyData.records || [];

  // Lấy 7 bản ghi gần nhất
  const recentRecords = [...records].reverse().slice(0, 7);

  return (
    <div className="space-y-6">
      {/* Header thông tin cá nhân + Thời gian */}
      <div className={`bg-gradient-to-r ${theme.gradient} text-white p-6 rounded-xl`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">{userInfo?.name?.charAt(0) || 'U'}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">{userInfo?.name || 'Nhân viên'}</h3>
              <p className="text-white/80">{userInfo?.position || 'Chức vụ'} - {userInfo?.department || 'Phòng ban'}</p>
              <p className="text-white/60 text-sm">Mã NV: {userInfo?.id || 'N/A'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold font-mono">
              {currentTime.toLocaleTimeString('vi-VN')}
            </div>
            <div className="text-white/80">
              {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera chấm công */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Camera className={theme.text} size={20} />
            Chấm công của tôi
          </h3>

          <div className="relative bg-gray-100 rounded-xl overflow-hidden h-64 border-2 border-dashed border-gray-300 flex items-center justify-center">
            {!cameraActive ? (
              <div className="text-center p-6">
                <div className="bg-gray-200 p-4 rounded-full inline-block mb-4">
                  <Camera className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">Camera chưa được khởi động</p>
                <p className="text-gray-400 text-sm mt-1">Nhấn nút bên dưới để chấm công</p>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <CheckCircle className={`h-16 w-16 ${theme.icon} mx-auto mb-4 animate-pulse`} />
                  <p className="text-white font-medium text-lg">Đang nhận diện...</p>
                  <div className="mt-4 flex justify-center space-x-1">
                    <div className={`w-2 h-2 ${theme.button} rounded-full animate-bounce`} style={{ animationDelay: '0s' }}></div>
                    <div className={`w-2 h-2 ${theme.button} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                    <div className={`w-2 h-2 ${theme.button} rounded-full animate-bounce`} style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {!cameraActive ? (
              <>
                <button
                  onClick={() => onStartRecognition('check_in')}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm transition-all hover:shadow-md"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Check In</span>
                </button>
                <button
                  onClick={() => onStartRecognition('check_out')}
                  disabled={isLoading}
                  className="flex-1 bg-orange-500 text-white px-4 py-3 rounded-xl hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm transition-all hover:shadow-md"
                >
                  <Clock className="h-5 w-5" />
                  <span>Check Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={onStopProcess}
                disabled={isLoading}
                className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm transition-all hover:shadow-md"
              >
                <Video className="h-5 w-5" />
                <span>Dừng camera</span>
              </button>
            )}
          </div>
        </div>

        {/* Thống kê tháng này */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className={theme.text} size={20} />
            Thống kê tháng này
          </h3>

          {loadingStats ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className={`${theme.bg} p-4 rounded-xl border ${theme.border}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={16} className={theme.text} />
                  <span className="text-sm text-gray-600">Ngày công</span>
                </div>
                <div className={`text-2xl font-bold ${theme.light}`}>
                  {stats.presentDays || 0}/{stats.totalDays || 0}
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle size={16} className="text-yellow-600" />
                  <span className="text-sm text-gray-600">Đi trễ</span>
                </div>
                <div className="text-2xl font-bold text-yellow-800">
                  {stats.lateDays || 0} ngày
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={16} className="text-blue-600" />
                  <span className="text-sm text-gray-600">Tăng ca</span>
                </div>
                <div className="text-2xl font-bold text-blue-800">
                  {stats.overtimeHours || 0}h
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="text-sm text-gray-600">TB giờ làm</span>
                </div>
                <div className="text-2xl font-bold text-green-800">
                  {stats.avgWorkHours || '0h 0m'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lịch sử chấm công gần đây */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <History className={theme.text} size={20} />
          Lịch sử chấm công gần đây
        </h3>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Ngày', 'Check-in', 'Check-out', 'Giờ làm', 'Trạng thái'].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loadingStats ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                  </td>
                </tr>
              ) : recentRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Chưa có dữ liệu chấm công
                  </td>
                </tr>
              ) : (
                recentRecords.map((record, idx) => {
                  const workHours = record.workMinutes
                    ? `${Math.floor(record.workMinutes / 60)}h ${record.workMinutes % 60}m`
                    : '--';
                  return (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(record.date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.checkIn ? record.checkIn.substring(0, 5) : <span className="text-gray-400">--:--</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.checkOut ? record.checkOut.substring(0, 5) : <span className="text-gray-400">--:--</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {workHours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(record.status)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyAttendanceTab;
