import React, { useState, useEffect } from 'react';
import { Users, Clock, Calendar, Search, Filter, Download, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import faceRecognitionApi from '../../services/faceRecognitionApi';

const TeamAttendanceTab = ({ themeColor = 'purple' }) => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({ totalEmployees: 0, present: 0, absent: 0, checkedOut: 0, stillWorking: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const themeColors = {
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700',
      light: 'text-purple-800',
      header: 'bg-purple-100'
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-600',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      light: 'text-emerald-800',
      header: 'bg-emerald-100'
    }
  };

  const theme = themeColors[themeColor] || themeColors.purple;

  // Load employees và attendance data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [empData, attData, statsData] = await Promise.all([
          faceRecognitionApi.getRegisteredEmployees(),
          faceRecognitionApi.getDailyAttendance(selectedDate),
          faceRecognitionApi.getAttendanceStats(selectedDate)
        ]);
        setEmployees(empData);
        setAttendanceData(attData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching team data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate]);

  // Merge employees với attendance
  const mergedData = employees.map(emp => {
    const att = attendanceData.find(a => String(a.id) === String(emp.id));
    return {
      ...emp,
      checkIn: att?.check_in || null,
      checkOut: att?.check_out || null,
      status: att?.check_in ? (att?.check_out ? 'checked_out' : 'working') : 'absent'
    };
  });

  // Filter by search
  const filteredData = mergedData.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id?.toString().includes(searchTerm)
  );

  const getStatusBadge = (status, checkIn) => {
    if (status === 'absent') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          <XCircle size={12} /> Vắng mặt
        </span>
      );
    }
    if (status === 'working') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          <Clock size={12} /> Đang làm
        </span>
      );
    }
    // checked_out - kiểm tra đi trễ/về sớm
    const inTime = checkIn ? checkIn.substring(0, 5) : '';
    const isLate = inTime > '08:15';
    if (isLate) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          <AlertCircle size={12} /> Đi trễ
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        <CheckCircle size={12} /> Đúng giờ
      </span>
    );
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const exportCSV = () => {
    const headers = ['Mã NV', 'Họ tên', 'Check-in', 'Check-out', 'Trạng thái'];
    const rows = filteredData.map(emp => [
      emp.id,
      emp.name,
      emp.checkIn || 'N/A',
      emp.checkOut || 'N/A',
      emp.status === 'absent' ? 'Vắng' : emp.status === 'working' ? 'Đang làm' : 'Đã về'
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_team_${selectedDate}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`${theme.bg} p-4 rounded-xl border ${theme.border}`}>
          <div className="flex items-center gap-2 mb-1">
            <Users size={18} className={theme.text} />
            <span className="text-sm text-gray-600">Tổng nhân viên</span>
          </div>
          <div className={`text-2xl font-bold ${theme.light}`}>{stats.totalEmployees}</div>
        </div>

        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={18} className="text-green-600" />
            <span className="text-sm text-gray-600">Có mặt</span>
          </div>
          <div className="text-2xl font-bold text-green-800">{stats.present}</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={18} className="text-blue-600" />
            <span className="text-sm text-gray-600">Đang làm</span>
          </div>
          <div className="text-2xl font-bold text-blue-800">{stats.stillWorking}</div>
        </div>

        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <XCircle size={18} className="text-red-600" />
            <span className="text-sm text-gray-600">Vắng mặt</span>
          </div>
          <div className="text-2xl font-bold text-red-800">{stats.absent}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300">
            <Calendar size={18} className="text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-none focus:outline-none"
            />
          </div>
          <button
            onClick={() => changeDate(1)}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className={`px-3 py-2 rounded-lg ${theme.button} text-white text-sm`}
          >
            Hôm nay
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
            />
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download size={18} />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={theme.header}>
            <tr>
              {['Mã NV', 'Họ và tên', 'Số ảnh', 'Check-in', 'Check-out', 'Trạng thái'].map((header) => (
                <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Không có dữ liệu nhân viên
                </td>
              </tr>
            ) : (
              filteredData.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme.light}`}>
                    {emp.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${theme.bg} flex items-center justify-center`}>
                        <span className={`text-sm font-medium ${theme.text}`}>
                          {emp.name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {emp.photoCount || 0} ảnh
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {emp.checkIn ? emp.checkIn.substring(0, 5) : <span className="text-gray-400">--:--</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {emp.checkOut ? emp.checkOut.substring(0, 5) : <span className="text-gray-400">--:--</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(emp.status, emp.checkIn)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className={`${theme.bg} p-4 rounded-xl border ${theme.border}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Hiển thị {filteredData.length} / {employees.length} nhân viên
          </span>
          <span className="text-sm text-gray-500">
            Ngày: {new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamAttendanceTab;
