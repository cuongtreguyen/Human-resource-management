import React, { useState, useEffect } from 'react';
import { Users, BarChart3, UserCheck, Building2 } from 'lucide-react';
import faceRecognitionApi from '../../services/faceRecognitionApi';
import MyAttendanceTab from '../../components/attendance/MyAttendanceTab';
import CompanyAttendanceTab from '../../components/attendance/CompanyAttendanceTab';

const FaceRecognitionAccountant = () => {
  const [activeTab, setActiveTab] = useState('my_attendance');
  const [systemStatus, setSystemStatus] = useState('connected');
  const [systemMessage, setSystemMessage] = useState('Hệ thống hoạt động');
  const [isLoading, setIsLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  // Check system status periodically
  useEffect(() => {
    const checkStatus = async () => {
      const data = await faceRecognitionApi.checkSystemStatus();
      setSystemStatus(data.status === 'idle' || data.status === 'success' ? 'connected' : data.status);
      setSystemMessage(data.message);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartRecognition = async (type = 'check_in') => {
    setIsLoading(true);
    try {
      const data = await faceRecognitionApi.startRecognition(type);
      if (data.status === 'success') {
        setCameraActive(true);
      } else {
        alert('Bắt đầu nhận diện thất bại: ' + data.message);
      }
    } catch (error) {
      console.error('Recognition failed:', error);
      alert('Bắt đầu nhận diện thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopProcess = async () => {
    setIsLoading(true);
    try {
      const data = await faceRecognitionApi.stopProcess();
      if (data.status === 'success') {
        setCameraActive(false);
      } else {
        alert('Dừng quá trình thất bại: ' + data.message);
      }
    } catch (error) {
      console.error('Stop process failed:', error);
      alert('Dừng quá trình thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'my_attendance', label: 'Chấm công của tôi', icon: UserCheck },
    { id: 'company_attendance', label: 'Tổng hợp công ty', icon: Building2 },
    { id: 'reports', label: 'Báo cáo & Tính công', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Emerald Gradient */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold">Quản lý Chấm công</h1>
            <p className="text-emerald-200 mt-1">Accountant Portal - Chấm công cá nhân & Tổng hợp công ty</p>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
            <div className={`w-3 h-3 rounded-full ${systemStatus === 'connected' || systemStatus === 'idle' || systemStatus === 'success' ? 'bg-green-400' : systemStatus === 'running' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="text-sm font-medium">{systemMessage}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-4 text-center font-medium text-sm flex items-center justify-center space-x-2 transition-colors ${activeTab === tab.id
                  ? 'border-b-2 border-emerald-600 text-emerald-600 bg-emerald-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Tab: Chấm công của tôi */}
          {activeTab === 'my_attendance' && (
            <MyAttendanceTab
              themeColor="emerald"
              onStartRecognition={handleStartRecognition}
              onStopProcess={handleStopProcess}
              isLoading={isLoading}
              cameraActive={cameraActive}
            />
          )}

          {/* Tab: Tổng hợp công ty */}
          {activeTab === 'company_attendance' && (
            <CompanyAttendanceTab themeColor="emerald" />
          )}

          {/* Tab: Báo cáo & Tính công */}
          {activeTab === 'reports' && (
            <PayrollReportsTab />
          )}
        </div>
      </div>
    </div>
  );
};

// Component báo cáo và tính công cho Accountant
const PayrollReportsTab = () => {
  const [stats, setStats] = useState({ totalEmployees: 0, present: 0, absent: 0, stillWorking: 0 });
  const [employees, setEmployees] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, empData] = await Promise.all([
          faceRecognitionApi.getAttendanceStats(),
          faceRecognitionApi.getRegisteredEmployees()
        ]);
        setStats(statsData);
        setEmployees(empData);

        // Lấy dữ liệu tháng
        const monthlyReports = await Promise.all(
          empData.map(async (emp) => {
            const data = await faceRecognitionApi.getMonthlyStats(emp.id, selectedMonth);
            return { ...emp, ...data };
          })
        );
        setMonthlyData(monthlyReports);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth]);

  const exportPayrollSummary = () => {
    const headers = ['Mã NV', 'Họ tên', 'Ngày công', 'Có mặt', 'Vắng', 'Trễ', 'OT (h)', 'Ghi chú'];
    const rows = monthlyData.map(emp => [
      emp.id,
      emp.name,
      emp.stats?.totalDays || 0,
      emp.stats?.presentDays || 0,
      emp.stats?.absentDays || 0,
      emp.stats?.lateDays || 0,
      emp.stats?.overtimeHours || 0,
      emp.stats?.lateDays > 3 ? 'Cần xem xét' : ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payroll_summary_${selectedMonth}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Tính tổng
  const totalWorkDays = monthlyData.reduce((sum, e) => sum + (e.stats?.presentDays || 0), 0);
  const totalAbsent = monthlyData.reduce((sum, e) => sum + (e.stats?.absentDays || 0), 0);
  const totalLate = monthlyData.reduce((sum, e) => sum + (e.stats?.lateDays || 0), 0);
  const totalOT = monthlyData.reduce((sum, e) => sum + (e.stats?.overtimeHours || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 className="text-emerald-600" size={20} />
          Báo cáo & Tính công
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={exportPayrollSummary}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
          >
            Xuất báo cáo lương
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
          <div className="text-emerald-600 text-sm font-medium mb-1">Tổng công</div>
          <div className="text-2xl font-bold text-emerald-800">{totalWorkDays}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
          <div className="text-red-600 text-sm font-medium mb-1">Tổng vắng</div>
          <div className="text-2xl font-bold text-red-800">{totalAbsent}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <div className="text-yellow-600 text-sm font-medium mb-1">Tổng trễ</div>
          <div className="text-2xl font-bold text-yellow-800">{totalLate}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="text-blue-600 text-sm font-medium mb-1">Tổng OT</div>
          <div className="text-2xl font-bold text-blue-800">{totalOT.toFixed(1)}h</div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-emerald-50 border-b border-gray-200">
          <h4 className="font-semibold text-emerald-900">Chi tiết chấm công tháng {selectedMonth}</h4>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Mã NV', 'Họ tên', 'Ngày công', 'Có mặt', 'Vắng', 'Trễ', 'Về sớm', 'OT', 'TB giờ'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {monthlyData.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500">Không có dữ liệu</td>
              </tr>
            ) : (
              monthlyData.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-emerald-700">{emp.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{emp.name}</td>
                  <td className="px-4 py-3 text-sm text-center">{emp.stats?.totalDays || 0}</td>
                  <td className="px-4 py-3 text-sm text-center text-green-700 font-medium">{emp.stats?.presentDays || 0}</td>
                  <td className="px-4 py-3 text-sm text-center text-red-700 font-medium">{emp.stats?.absentDays || 0}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    {(emp.stats?.lateDays || 0) > 0 ? (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        {emp.stats?.lateDays}
                      </span>
                    ) : '0'}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-orange-700">{emp.stats?.earlyLeaveDays || 0}</td>
                  <td className="px-4 py-3 text-sm text-center text-blue-700">{emp.stats?.overtimeHours || 0}h</td>
                  <td className="px-4 py-3 text-sm text-center">{emp.stats?.avgWorkHours || '0h'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
        <h4 className="font-semibold text-emerald-900 mb-2">Ghi chú tính lương</h4>
        <ul className="text-sm text-emerald-800 space-y-1">
          <li>• Giờ làm việc chuẩn: 08:00 - 17:30</li>
          <li>• Đi trễ: Check-in sau 08:15</li>
          <li>• Về sớm: Check-out trước 17:15</li>
          <li>• Tăng ca: Check-out sau 18:00</li>
          <li>• Nhân viên trễ {'>'}3 lần/tháng cần xem xét kỷ luật</li>
        </ul>
      </div>
    </div>
  );
};

export default FaceRecognitionAccountant;
