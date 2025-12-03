import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import {
  Camera,
  Eye,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  Search,
  RefreshCw,
  AlertCircle,
  History,
  X,
  User,
} from 'lucide-react';
import faceRecognitionApi from '../../services/faceRecognitionApi';
import { getUserId, getCurrentUserName } from '../../utils/auth';
import { PY_API } from '../../services/config';

const FaceRecognitionAccountant = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [systemStatus, setSystemStatus] = useState('idle');
  const [systemMessage, setSystemMessage] = useState('Hệ thống đang khởi động...');
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceResult, setAttendanceResult] = useState(null);

  // Employee list data
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // Self attendance status
  const [todayAttendance, setTodayAttendance] = useState({
    hasCheckedIn: false,
    hasCheckedOut: false,
    checkInTime: null,
    checkOutTime: null,
  });

  // Modal for viewing employee details
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Lịch sử chấm công cá nhân
  const [myAttendanceHistory, setMyAttendanceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const currentUserId = getUserId();
  const currentUserName = getCurrentUserName();

  // Check system status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await faceRecognitionApi.checkSystemStatus();
        setSystemStatus(data.status || 'idle');
        setSystemMessage(data.message || 'System is idle');
      } catch {
        setSystemStatus('error');
        setSystemMessage('Không thể kết nối hệ thống');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch self attendance status
  useEffect(() => {
    const fetchSelfAttendance = async () => {
      if (!currentUserId) return;
      try {
        const data = await faceRecognitionApi.getEmployeeAttendance(currentUserId);
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = Array.isArray(data)
          ? data.find(record => record.date === today)
          : null;

        if (todayRecord) {
          setTodayAttendance({
            hasCheckedIn: !!todayRecord.check_in || !!todayRecord.checkIn,
            hasCheckedOut: !!todayRecord.check_out || !!todayRecord.checkOut,
            checkInTime: todayRecord.check_in || todayRecord.checkIn,
            checkOutTime: todayRecord.check_out || todayRecord.checkOut,
          });
        } else {
          setTodayAttendance({
            hasCheckedIn: false,
            hasCheckedOut: false,
            checkInTime: null,
            checkOutTime: null,
          });
        }
      } catch (error) {
        console.error('Error fetching self attendance:', error);
      }
    };

    fetchSelfAttendance();
    const interval = setInterval(fetchSelfAttendance, 30000);
    return () => clearInterval(interval);
  }, [currentUserId]);

  // Fetch employee attendance list
  useEffect(() => {
    loadEmployeeAttendance();
  }, [selectedDate]);

  const loadEmployeeAttendance = async () => {
    setLoadingEmployees(true);
    try {
      const response = await fetch(`${PY_API}/api/attendance/daily?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setEmployeeAttendance(data || []);
      } else {
        setEmployeeAttendance([]);
      }
    } catch (error) {
      console.error('Error loading employee attendance:', error);
      setEmployeeAttendance([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Load lịch sử chấm công cá nhân
  const loadMyAttendanceHistory = async () => {
    if (!currentUserId) return;

    setLoadingHistory(true);
    try {
      const data = await faceRecognitionApi.getEmployeeAttendance(currentUserId);
      if (Array.isArray(data)) {
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMyAttendanceHistory(sorted);
      } else {
        setMyAttendanceHistory([]);
      }
    } catch (error) {
      console.error('Error loading my attendance history:', error);
      setMyAttendanceHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Load history khi chuyển sang tab lịch sử
  useEffect(() => {
    if (activeTab === 'history') {
      loadMyAttendanceHistory();
    }
  }, [activeTab, currentUserId]);

  const handleStartRecognition = async (type) => {
    setIsLoading(true);
    setAttendanceResult(null);
    try {
      const data = await faceRecognitionApi.startRecognition(type);
      alert(data.message);
      setAttendanceResult(data);

      if (data.status === 'success' && currentUserId) {
        setTimeout(async () => {
          try {
            const attendanceData = await faceRecognitionApi.getEmployeeAttendance(currentUserId);
            const today = new Date().toISOString().split('T')[0];
            const todayRecord = Array.isArray(attendanceData)
              ? attendanceData.find(record => record.date === today)
              : null;

            if (todayRecord) {
              setTodayAttendance({
                hasCheckedIn: !!todayRecord.check_in || !!todayRecord.checkIn,
                hasCheckedOut: !!todayRecord.check_out || !!todayRecord.checkOut,
                checkInTime: todayRecord.check_in || todayRecord.checkIn,
                checkOutTime: todayRecord.check_out || todayRecord.checkOut,
              });
            }
            // Refresh employee list
            loadEmployeeAttendance();
          } catch (error) {
            console.error('Error refreshing attendance:', error);
          }
        }, 2000);
      }
    } catch {
      alert('❌ Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopProcess = async () => {
    setIsLoading(true);
    try {
      const data = await faceRecognitionApi.stopProcess();
      alert(data.message);
    } catch {
      alert('❌ Dừng quá trình thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const getShift = (checkInTime) => {
    if (!checkInTime) return { text: '-', color: 'text-gray-400' };
    const [hour] = checkInTime.split(':').map(Number);
    if (hour < 12) return { text: 'Ca sáng', color: 'text-blue-600' };
    if (hour < 18) return { text: 'Ca chiều', color: 'text-orange-600' };
    return { text: 'Ca tối', color: 'text-emerald-600' };
  };

  const getStatus = (record) => {
    const checkIn = record.check_in || record.checkIn;
    const checkOut = record.check_out || record.checkOut;

    if (!checkIn) return { text: 'Vắng mặt', color: 'bg-red-100 text-red-800' };
    if (!checkOut) return { text: 'Đang làm', color: 'bg-blue-100 text-blue-800' };

    const [outHour] = checkOut.split(':').map(Number);
    if (outHour >= 18) return { text: 'OT', color: 'bg-purple-100 text-purple-800' };
    return { text: 'Tan ca', color: 'bg-green-100 text-green-800' };
  };

  const getStatusColor = () => ({
    running: 'bg-yellow-400',
    success: 'bg-green-400',
    error: 'bg-red-400',
    idle: 'bg-gray-300',
  }[systemStatus] || 'bg-gray-300');

  // Filter employees by search
  const filteredEmployees = employeeAttendance.filter(record => {
    const name = record.name || record.employeeName || '';
    const id = record.id || record.employee_id || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           String(id).includes(searchTerm);
  });

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Hệ thống chấm công</h1>
              <p className="text-emerald-100">Accountant Portal - Chấm công & Theo dõi nhân viên</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
              <span className="text-sm">{systemMessage}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'attendance', label: 'Chấm công của tôi', icon: CheckCircle },
                { id: 'employees', label: 'Theo dõi nhân viên', icon: Users },
                { id: 'history', label: 'Lịch sử', icon: History },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-4 text-center font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                    activeTab === tab.id
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

          <div className="p-6">
            {/* Tab: Chấm công của tôi */}
            {activeTab === 'attendance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Chấm công bằng khuôn mặt</h3>

                {/* Status Banner */}
                <div className={`rounded-lg p-4 border ${
                  todayAttendance.hasCheckedOut
                    ? 'bg-gray-50 border-gray-200'
                    : todayAttendance.hasCheckedIn
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {todayAttendance.hasCheckedOut ? (
                        <CheckCircle className="h-6 w-6 text-gray-500" />
                      ) : todayAttendance.hasCheckedIn ? (
                        <Clock className="h-6 w-6 text-yellow-500" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-emerald-500" />
                      )}
                      <div>
                        <p className={`font-medium ${
                          todayAttendance.hasCheckedOut ? 'text-gray-700'
                            : todayAttendance.hasCheckedIn ? 'text-yellow-700'
                            : 'text-emerald-700'
                        }`}>
                          {todayAttendance.hasCheckedOut
                            ? '✅ Đã hoàn thành chấm công hôm nay'
                            : todayAttendance.hasCheckedIn
                            ? '🕐 Đang làm việc - Chưa chấm công ra'
                            : '📋 Chưa chấm công hôm nay'}
                        </p>
                        {(todayAttendance.checkInTime || todayAttendance.checkOutTime) && (
                          <p className="text-sm text-gray-600 mt-1">
                            {todayAttendance.checkInTime && `Vào: ${todayAttendance.checkInTime}`}
                            {todayAttendance.checkInTime && todayAttendance.checkOutTime && ' | '}
                            {todayAttendance.checkOutTime && `Ra: ${todayAttendance.checkOutTime}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date().toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>

                {/* Camera placeholder */}
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-8 text-center">
                  <Eye className="h-16 w-16 mx-auto text-emerald-500 mb-4" />
                  <p className="text-gray-600">
                    {todayAttendance.hasCheckedOut
                      ? 'Bạn đã hoàn thành chấm công hôm nay. Hẹn gặp lại ngày mai!'
                      : todayAttendance.hasCheckedIn
                      ? 'Bạn đã chấm công vào. Nhấn "Chấm công ra" khi kết thúc làm việc.'
                      : 'Nhấn nút bên dưới để bắt đầu chấm công bằng khuôn mặt.'}
                  </p>
                </div>

                {attendanceResult && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <p className="text-green-700">{attendanceResult.message}</p>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button
                    onClick={handleStopProcess}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 text-sm disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                    Dừng
                  </button>

                  {/* Nút Check In - Ẩn nếu đã check in */}
                  {!todayAttendance.hasCheckedIn && (
                    <button
                      onClick={() => handleStartRecognition('clockin')}
                      disabled={isLoading}
                      className="px-6 py-2 text-white rounded-lg flex items-center gap-2 text-sm transition-all bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Chấm công vào
                    </button>
                  )}

                  {/* Nút Check Out - Hiện khi đã check in, Ẩn khi đã check out */}
                  {todayAttendance.hasCheckedIn && !todayAttendance.hasCheckedOut && (
                    <button
                      onClick={() => handleStartRecognition('clockout')}
                      disabled={isLoading}
                      className="px-6 py-2 text-white rounded-lg flex items-center gap-2 text-sm transition-all bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50"
                    >
                      <Clock className="w-4 h-4" />
                      Chấm công ra
                    </button>
                  )}

                  {/* Hiển thị thông báo khi đã hoàn thành */}
                  {todayAttendance.hasCheckedIn && todayAttendance.hasCheckedOut && (
                    <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Đã hoàn thành chấm công hôm nay
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Theo dõi nhân viên */}
            {activeTab === 'employees' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Danh sách chấm công nhân viên</h3>
                  <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">{selectedDate}</span>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên hoặc ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={loadEmployeeAttendance}
                    disabled={loadingEmployees}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingEmployees ? 'animate-spin' : ''}`} />
                    Làm mới
                  </button>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">HỌ TÊN</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">PHÒNG BAN</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">CA LÀM</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">GIỜ VÀO</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">GIỜ RA</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">TRẠNG THÁI</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">THAO TÁC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingEmployees ? (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-gray-500">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                                <span>Đang tải...</span>
                              </div>
                            </td>
                          </tr>
                        ) : filteredEmployees.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-gray-500">
                              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                              <p>Chưa có dữ liệu chấm công cho ngày {selectedDate}</p>
                            </td>
                          </tr>
                        ) : (
                          filteredEmployees.map((record, index) => {
                            const checkIn = record.check_in || record.checkIn;
                            const checkOut = record.check_out || record.checkOut;
                            const shift = getShift(checkIn);
                            const status = getStatus(record);

                            return (
                              <tr key={record.id || index} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <span className="text-sm font-mono text-gray-600">
                                    {record.employee_id || record.id || `NV${String(index + 1).padStart(3, '0')}`}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                      {(record.name || record.employeeName || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium text-gray-900">
                                      {record.name || record.employeeName || 'Không xác định'}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                  {record.department || 'IT'}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className={`text-sm font-medium ${shift.color}`}>{shift.text}</span>
                                </td>
                                <td className="py-3 px-4 text-center font-medium text-gray-900">
                                  {checkIn || '-'}
                                </td>
                                <td className="py-3 px-4 text-center font-medium text-gray-900">
                                  {checkOut || '-'}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.color}`}>
                                    {status.text}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <button
                                    onClick={() => {
                                      setSelectedEmployee(record);
                                      setShowDetailModal(true);
                                    }}
                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                                    title="Xem chi tiết"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{filteredEmployees.length}</div>
                    <div className="text-sm text-blue-700">Tổng số</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {filteredEmployees.filter(r => (r.check_out || r.checkOut)).length}
                    </div>
                    <div className="text-sm text-green-700">Hoàn thành</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {filteredEmployees.filter(r => (r.check_in || r.checkIn) && !(r.check_out || r.checkOut)).length}
                    </div>
                    <div className="text-sm text-yellow-700">Đang làm</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {filteredEmployees.filter(r => !(r.check_in || r.checkIn)).length}
                    </div>
                    <div className="text-sm text-red-700">Vắng mặt</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Lịch sử */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Lịch sử chấm công của tôi</h3>
                  <button
                    onClick={loadMyAttendanceHistory}
                    disabled={loadingHistory}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 text-sm disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingHistory ? 'animate-spin' : ''}`} />
                    Làm mới
                  </button>
                </div>

                {/* Thông tin user */}
                <div className="bg-emerald-50 rounded-lg p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {(currentUserName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{currentUserName || 'Chưa đăng nhập'}</p>
                    <p className="text-sm text-gray-600">ID: {currentUserId || 'N/A'}</p>
                  </div>
                </div>

                {/* Bảng lịch sử */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">NGÀY</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">CA LÀM</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">GIỜ VÀO</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">GIỜ RA</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">TRẠNG THÁI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingHistory ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-500">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                                <span>Đang tải...</span>
                              </div>
                            </td>
                          </tr>
                        ) : myAttendanceHistory.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-500">
                              <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                              <p>Chưa có lịch sử chấm công</p>
                            </td>
                          </tr>
                        ) : (
                          myAttendanceHistory.map((record, index) => {
                            const checkIn = record.check_in || record.checkIn;
                            const checkOut = record.check_out || record.checkOut;
                            const shift = getShift(checkIn);
                            const status = getStatus(record);

                            return (
                              <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <span className="font-medium text-gray-900">{record.date || 'N/A'}</span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className={`text-sm font-medium ${shift.color}`}>{shift.text}</span>
                                </td>
                                <td className="py-3 px-4 text-center font-medium text-green-600">
                                  {checkIn || '-'}
                                </td>
                                <td className="py-3 px-4 text-center font-medium text-orange-600">
                                  {checkOut || '-'}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.color}`}>
                                    {status.text}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Thống kê */}
                {myAttendanceHistory.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {myAttendanceHistory.filter(r => (r.check_in || r.checkIn) && (r.check_out || r.checkOut)).length}
                      </div>
                      <div className="text-sm text-green-700">Ngày hoàn thành</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {myAttendanceHistory.length}
                      </div>
                      <div className="text-sm text-blue-700">Tổng số ngày</div>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-emerald-600">
                        {myAttendanceHistory.filter(r => {
                          const checkOut = r.check_out || r.checkOut;
                          if (!checkOut) return false;
                          const [hour] = checkOut.split(':').map(Number);
                          return hour >= 18;
                        }).length}
                      </div>
                      <div className="text-sm text-emerald-700">Ngày OT</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Employee Detail Modal */}
      {showDetailModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDetailModal(false)} />

            <div className="relative inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle bg-white rounded-2xl shadow-xl transform transition-all">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Chi tiết chấm công</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Employee Info */}
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl mb-4">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {(selectedEmployee.name || selectedEmployee.employeeName || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {selectedEmployee.name || selectedEmployee.employeeName || 'Không xác định'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    ID: {selectedEmployee.employee_id || selectedEmployee.id || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phòng ban: {selectedEmployee.department || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Attendance Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">Ngày</span>
                  </div>
                  <span className="font-medium text-gray-900">{selectedDate}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Giờ vào</span>
                  </div>
                  <span className="font-medium text-green-700">
                    {selectedEmployee.check_in || selectedEmployee.checkIn || 'Chưa chấm'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span className="text-gray-700">Giờ ra</span>
                  </div>
                  <span className="font-medium text-orange-700">
                    {selectedEmployee.check_out || selectedEmployee.checkOut || 'Chưa chấm'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Trạng thái</span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatus(selectedEmployee).color}`}>
                    {getStatus(selectedEmployee).text}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default FaceRecognitionAccountant;
