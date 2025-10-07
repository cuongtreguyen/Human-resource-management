import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, TrendingUp, Download, BarChart3 } from 'lucide-react';
import EmployeeLayout from '../../components/layout/EmployeeLayout';
import fakeApi from '../../services/fakeApi';

const EmployeeAttendanceSummary = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fakeApi.getAttendanceRecords();
        setAttendanceData(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading attendance data:', error);
        setLoading(false);
      }
    };
    load();
  }, []);

  // Tính toán thống kê
  const calculateStats = () => {
    const totalDays = attendanceData.length;
    const presentDays = attendanceData.filter(r => r.status === 'present' || r.status === 'overtime').length;
    const lateDays = attendanceData.filter(r => r.status === 'late').length;
    const absentDays = attendanceData.filter(r => r.status === 'absent').length;
    const totalHours = attendanceData.reduce((sum, r) => sum + (parseFloat(r.hoursWorked) || 0), 0);
    const avgHoursPerDay = totalDays > 0 ? totalHours / totalDays : 0;
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    return {
      totalDays,
      presentDays,
      lateDays,
      absentDays,
      totalHours,
      avgHoursPerDay,
      attendanceRate
    };
  };

  const stats = calculateStats();

  // Dữ liệu biểu đồ theo tuần
  const weeklyData = [
    { week: 'Tuần 1', hours: 40, present: 5, late: 0 },
    { week: 'Tuần 2', hours: 38, present: 4, late: 1 },
    { week: 'Tuần 3', hours: 42, present: 5, late: 0 },
    { week: 'Tuần 4', hours: 35, present: 4, late: 1 }
  ];

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <a 
              href="/employee" 
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft size={18} />
              <span>Quay lại</span>
            </a>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm">
              <Download size={18} />
              <span>Tải báo cáo</span>
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Tổng quan chấm công</h1>
            <p className="text-purple-100">Thống kê chi tiết về tình hình chấm công của bạn</p>
          </div>
        </div>

        {/* Bộ lọc tháng */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Chọn tháng:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Thẻ thống kê chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tỷ lệ có mặt</p>
                <p className="text-2xl font-bold text-gray-900">{stats.attendanceRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng giờ làm</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalHours.toFixed(1)}h</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Trung bình/ngày</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgHoursPerDay.toFixed(1)}h</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <BarChart3 className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày đi muộn</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lateDays}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Biểu đồ thống kê */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Biểu đồ giờ làm theo tuần */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Giờ làm việc theo tuần</h3>
            <div className="space-y-4">
              {weeklyData.map((week, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{week.week}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{week.hours}h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{week.present} ngày</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phân tích trạng thái */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân tích trạng thái</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Có mặt</span>
                </div>
                <span className="text-sm font-bold text-green-700">{stats.presentDays} ngày</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Đi muộn</span>
                </div>
                <span className="text-sm font-bold text-yellow-700">{stats.lateDays} ngày</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Vắng mặt</span>
                </div>
                <span className="text-sm font-bold text-red-700">{stats.absentDays} ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bảng chi tiết */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Chi tiết chấm công tháng {selectedMonth}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giờ làm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!loading && attendanceData.slice(0, 10).map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{r.checkIn || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{r.checkOut || '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.hoursWorked}h</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        r.status === 'present' ? 'bg-green-100 text-green-700' :
                        r.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                        r.status === 'overtime' ? 'bg-purple-100 text-purple-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {r.status === 'present' ? 'Có mặt' :
                         r.status === 'late' ? 'Đi muộn' :
                         r.status === 'overtime' ? 'Tăng ca' :
                         'Vắng mặt'}
                      </span>
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td className="px-6 py-12 text-center text-gray-500" colSpan={5}>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeAttendanceSummary;
