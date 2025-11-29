import React, { useState, useEffect } from 'react';
import { Users, Clock, Calendar, Search, Download, ChevronLeft, ChevronRight, CheckCircle, XCircle, TrendingUp, DollarSign, FileText } from 'lucide-react';
import faceRecognitionApi from '../../services/faceRecognitionApi';

const CompanyAttendanceTab = ({ themeColor = 'emerald' }) => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({ totalEmployees: 0, present: 0, absent: 0, checkedOut: 0, stillWorking: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('daily'); // daily | monthly
  const [loading, setLoading] = useState(true);
  const [monthlyReport, setMonthlyReport] = useState([]);

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

  const theme = themeColors[themeColor] || themeColors.emerald;

  // Load daily data
  useEffect(() => {
    if (viewMode === 'daily') {
      const fetchDailyData = async () => {
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
          console.error('Error fetching daily data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchDailyData();
    }
  }, [selectedDate, viewMode]);

  // Load monthly report
  useEffect(() => {
    if (viewMode === 'monthly') {
      const fetchMonthlyData = async () => {
        setLoading(true);
        try {
          const empData = await faceRecognitionApi.getRegisteredEmployees();
          setEmployees(empData);

          // Lấy thống kê theo tháng cho từng nhân viên
          const month = dateRange.start.substring(0, 7); // YYYY-MM
          const reports = await Promise.all(
            empData.map(async (emp) => {
              const monthlyData = await faceRecognitionApi.getMonthlyStats(emp.id, month);
              return {
                ...emp,
                stats: monthlyData.stats || {},
                records: monthlyData.records || []
              };
            })
          );
          setMonthlyReport(reports);
        } catch (error) {
          console.error('Error fetching monthly data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchMonthlyData();
    }
  }, [dateRange.start, viewMode]);

  // Merge employees với attendance cho daily view
  const dailyData = employees.map(emp => {
    const att = attendanceData.find(a => String(a.id) === String(emp.id));
    return {
      ...emp,
      checkIn: att?.check_in || null,
      checkOut: att?.check_out || null,
      status: att?.check_in ? (att?.check_out ? 'checked_out' : 'working') : 'absent'
    };
  });

  // Filter by search
  const filteredDaily = dailyData.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id?.toString().includes(searchTerm)
  );

  const filteredMonthly = monthlyReport.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id?.toString().includes(searchTerm)
  );

  const getStatusBadge = (status) => {
    const config = {
      absent: { label: 'Vắng', bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      working: { label: 'Đang làm', bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
      checked_out: { label: 'Đã về', bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle }
    };
    const c = config[status] || config.absent;
    const Icon = c.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        <Icon size={12} /> {c.label}
      </span>
    );
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const exportDailyCSV = () => {
    const headers = ['Mã NV', 'Họ tên', 'Check-in', 'Check-out', 'Trạng thái'];
    const rows = filteredDaily.map(emp => [
      emp.id,
      emp.name,
      emp.checkIn || 'N/A',
      emp.checkOut || 'N/A',
      emp.status === 'absent' ? 'Vắng' : emp.status === 'working' ? 'Đang làm' : 'Đã về'
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(csv, `attendance_daily_${selectedDate}.csv`);
  };

  const exportMonthlyCSV = () => {
    const headers = ['Mã NV', 'Họ tên', 'Ngày công', 'Có mặt', 'Vắng', 'Đi trễ', 'Tăng ca (h)', 'TB giờ làm'];
    const rows = filteredMonthly.map(emp => [
      emp.id,
      emp.name,
      emp.stats.totalDays || 0,
      emp.stats.presentDays || 0,
      emp.stats.absentDays || 0,
      emp.stats.lateDays || 0,
      emp.stats.overtimeHours || 0,
      emp.stats.avgWorkHours || '0h'
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(csv, `attendance_monthly_${dateRange.start.substring(0, 7)}.csv`);
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  // Tính tổng để hiển thị summary
  const totalStats = {
    totalWorkDays: filteredMonthly.reduce((sum, e) => sum + (e.stats.presentDays || 0), 0),
    totalAbsent: filteredMonthly.reduce((sum, e) => sum + (e.stats.absentDays || 0), 0),
    totalLate: filteredMonthly.reduce((sum, e) => sum + (e.stats.lateDays || 0), 0),
    totalOT: filteredMonthly.reduce((sum, e) => sum + (e.stats.overtimeHours || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'daily' ? `${theme.button} text-white` : 'text-gray-600 hover:text-gray-900'}`}
          >
            Theo ngày
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'monthly' ? `${theme.button} text-white` : 'text-gray-600 hover:text-gray-900'}`}
          >
            Tổng hợp tháng
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {viewMode === 'daily' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${theme.bg} p-4 rounded-xl border ${theme.border}`}>
            <div className="flex items-center gap-2 mb-1">
              <Users size={18} className={theme.text} />
              <span className="text-sm text-gray-600">Tổng NV</span>
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
              <span className="text-sm text-gray-600">Vắng</span>
            </div>
            <div className="text-2xl font-bold text-red-800">{stats.absent}</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${theme.bg} p-4 rounded-xl border ${theme.border}`}>
            <div className="flex items-center gap-2 mb-1">
              <FileText size={18} className={theme.text} />
              <span className="text-sm text-gray-600">Tổng công</span>
            </div>
            <div className={`text-2xl font-bold ${theme.light}`}>{totalStats.totalWorkDays}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-200">
            <div className="flex items-center gap-2 mb-1">
              <XCircle size={18} className="text-red-600" />
              <span className="text-sm text-gray-600">Tổng vắng</span>
            </div>
            <div className="text-2xl font-bold text-red-800">{totalStats.totalAbsent}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={18} className="text-yellow-600" />
              <span className="text-sm text-gray-600">Tổng trễ</span>
            </div>
            <div className="text-2xl font-bold text-yellow-800">{totalStats.totalLate}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={18} className="text-blue-600" />
              <span className="text-sm text-gray-600">Tổng OT</span>
            </div>
            <div className="text-2xl font-bold text-blue-800">{totalStats.totalOT.toFixed(1)}h</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {viewMode === 'daily' ? (
          <div className="flex items-center gap-2">
            <button onClick={() => changeDate(-1)} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
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
            <button onClick={() => changeDate(1)} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className={`px-3 py-2 rounded-lg ${theme.button} text-white text-sm`}
            >
              Hôm nay
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Tháng:</span>
            <input
              type="month"
              value={dateRange.start.substring(0, 7)}
              onChange={(e) => setDateRange({ ...dateRange, start: `${e.target.value}-01` })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 w-64"
            />
          </div>
          <button
            onClick={viewMode === 'daily' ? exportDailyCSV : exportMonthlyCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download size={18} />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
        {viewMode === 'daily' ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={theme.header}>
              <tr>
                {['Mã NV', 'Họ và tên', 'Check-in', 'Check-out', 'Trạng thái'].map((header) => (
                  <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredDaily.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Không có dữ liệu</td>
                </tr>
              ) : (
                filteredDaily.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className={`px-6 py-4 text-sm font-medium ${theme.light}`}>{emp.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{emp.name}</td>
                    <td className="px-6 py-4 text-sm">{emp.checkIn?.substring(0, 5) || <span className="text-gray-400">--:--</span>}</td>
                    <td className="px-6 py-4 text-sm">{emp.checkOut?.substring(0, 5) || <span className="text-gray-400">--:--</span>}</td>
                    <td className="px-6 py-4">{getStatusBadge(emp.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={theme.header}>
              <tr>
                {['Mã NV', 'Họ tên', 'Ngày công', 'Có mặt', 'Vắng', 'Đi trễ', 'Về sớm', 'OT (h)', 'TB giờ'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredMonthly.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">Không có dữ liệu</td>
                </tr>
              ) : (
                filteredMonthly.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className={`px-4 py-3 text-sm font-medium ${theme.light}`}>{emp.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{emp.name}</td>
                    <td className="px-4 py-3 text-sm text-center">{emp.stats.totalDays || 0}</td>
                    <td className="px-4 py-3 text-sm text-center text-green-700 font-medium">{emp.stats.presentDays || 0}</td>
                    <td className="px-4 py-3 text-sm text-center text-red-700 font-medium">{emp.stats.absentDays || 0}</td>
                    <td className="px-4 py-3 text-sm text-center text-yellow-700">{emp.stats.lateDays || 0}</td>
                    <td className="px-4 py-3 text-sm text-center text-orange-700">{emp.stats.earlyLeaveDays || 0}</td>
                    <td className="px-4 py-3 text-sm text-center text-blue-700">{emp.stats.overtimeHours || 0}</td>
                    <td className="px-4 py-3 text-sm text-center">{emp.stats.avgWorkHours || '0h'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CompanyAttendanceTab;
