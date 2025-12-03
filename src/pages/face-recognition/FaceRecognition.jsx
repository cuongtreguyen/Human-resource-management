import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../../components/layout/Layout';
import {
  Camera,
  Eye,
  CheckCircle,
  Clock,
  Video,
  Info,
  Square as StopIcon,
  AlertCircle,
  Calendar,
  Search,
  RefreshCw,
  Users,
} from 'lucide-react';
import faceRecognitionApi from '../../services/faceRecognitionApi';
import { getRole, getUserId, getCurrentUserName } from '../../utils/auth';
import { PY_API } from '../../services/config';

const FaceRecognition = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [systemStatus, setSystemStatus] = useState('idle');
  const [systemMessage, setSystemMessage] = useState('System is idle');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceResult, setAttendanceResult] = useState(null);

  // Trạng thái chấm công hôm nay (cho Employee)
  const [todayAttendance, setTodayAttendance] = useState({
    hasCheckedIn: false,
    hasCheckedOut: false,
    checkInTime: null,
    checkOutTime: null,
  });

  // Danh sách chấm công nhân viên
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const userRole = getRole();
  const currentUserId = getUserId();
  const currentUserName = getCurrentUserName();

  // Màu sắc theo role
  const roleColors = useMemo(() => {
    switch (userRole) {
      case 'admin':
        return {
          primary: 'blue',
          headerGradient: 'from-blue-500 to-blue-600',
          sidebarGradient: 'from-blue-50 to-blue-100',
          iconBg: 'from-blue-100 to-blue-200',
          iconColor: 'text-blue-500',
          textAccent: 'text-blue-600',
          infoBg: 'bg-blue-50',
          infoText: 'text-blue-700',
          infoIcon: 'text-blue-400',
          btnPrimary: 'bg-blue-600 hover:bg-blue-700',
          btnSecondary: 'bg-blue-500 hover:bg-blue-600',
          focusRing: 'focus:ring-blue-500',
          tabActive: 'border-blue-500 text-blue-600',
          recognizeBg: 'from-blue-50 to-blue-100',
        };
      case 'manager':
        return {
          primary: 'purple',
          headerGradient: 'from-purple-600 to-purple-700',
          sidebarGradient: 'from-purple-50 to-purple-100',
          iconBg: 'from-purple-100 to-purple-200',
          iconColor: 'text-purple-500',
          textAccent: 'text-purple-600',
          infoBg: 'bg-purple-50',
          infoText: 'text-purple-700',
          infoIcon: 'text-purple-400',
          btnPrimary: 'bg-purple-600 hover:bg-purple-700',
          btnSecondary: 'bg-purple-500 hover:bg-purple-600',
          focusRing: 'focus:ring-purple-500',
          tabActive: 'border-purple-500 text-purple-600',
          recognizeBg: 'from-purple-50 to-purple-100',
        };
      case 'accountant':
        return {
          primary: 'emerald',
          headerGradient: 'from-emerald-600 to-emerald-700',
          sidebarGradient: 'from-emerald-50 to-emerald-100',
          iconBg: 'from-emerald-100 to-emerald-200',
          iconColor: 'text-emerald-500',
          textAccent: 'text-emerald-600',
          infoBg: 'bg-emerald-50',
          infoText: 'text-emerald-700',
          infoIcon: 'text-emerald-400',
          btnPrimary: 'bg-emerald-600 hover:bg-emerald-700',
          btnSecondary: 'bg-emerald-500 hover:bg-emerald-600',
          focusRing: 'focus:ring-emerald-500',
          tabActive: 'border-emerald-500 text-emerald-600',
          recognizeBg: 'from-emerald-50 to-emerald-100',
        };
      default: // employee
        return {
          primary: 'orange',
          headerGradient: 'from-orange-500 to-orange-600',
          sidebarGradient: 'from-orange-50 to-orange-100',
          iconBg: 'from-orange-100 to-orange-200',
          iconColor: 'text-orange-500',
          textAccent: 'text-orange-600',
          infoBg: 'bg-orange-50',
          infoText: 'text-orange-700',
          infoIcon: 'text-orange-400',
          btnPrimary: 'bg-orange-600 hover:bg-orange-700',
          btnSecondary: 'bg-orange-500 hover:bg-orange-600',
          focusRing: 'focus:ring-orange-500',
          tabActive: 'border-orange-500 text-orange-600',
          recognizeBg: 'from-orange-50 to-orange-100',
        };
    }
  }, [userRole]);

  // 🕒 Check backend system status every 2s
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await faceRecognitionApi.checkSystemStatus();
        setSystemStatus(data.status || 'idle');
        setSystemMessage(data.message || 'System is idle');
      } catch {
        setSystemStatus('error');
        setSystemMessage('Cannot connect to recognition system');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // 📅 Fetch trạng thái chấm công hôm nay
  useEffect(() => {
    const fetchTodayAttendance = async () => {
      // Cần có userId để fetch
      if (!currentUserId) {
        console.log('No currentUserId, skipping attendance fetch');
        return;
      }

      try {
        console.log('Fetching attendance for userId:', currentUserId);
        const data = await faceRecognitionApi.getEmployeeAttendance(currentUserId);
        console.log('Attendance data:', data);

        // Tìm record của ngày hôm nay
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = Array.isArray(data)
          ? data.find(record => record.date === today)
          : null;

        console.log('Today record:', todayRecord);

        if (todayRecord) {
          setTodayAttendance({
            hasCheckedIn: !!todayRecord.check_in || !!todayRecord.checkIn,
            hasCheckedOut: !!todayRecord.check_out || !!todayRecord.checkOut,
            checkInTime: todayRecord.check_in || todayRecord.checkIn,
            checkOutTime: todayRecord.check_out || todayRecord.checkOut,
          });
        } else {
          // Reset nếu không có record hôm nay (qua ngày mới)
          setTodayAttendance({
            hasCheckedIn: false,
            hasCheckedOut: false,
            checkInTime: null,
            checkOutTime: null,
          });
        }
      } catch (error) {
        console.error('Error fetching today attendance:', error);
      }
    };

    fetchTodayAttendance();

    // Refresh mỗi 30 giây để cập nhật trạng thái
    const interval = setInterval(fetchTodayAttendance, 30000);
    return () => clearInterval(interval);
  }, [currentUserId]);

  // Fetch danh sách chấm công theo ngày
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

  // Helper functions cho bảng
  const getShift = (checkInTime) => {
    if (!checkInTime) return { text: '-', color: 'text-gray-400' };
    const [hour] = checkInTime.split(':').map(Number);
    if (hour < 12) return { text: 'Ca sáng', color: 'text-blue-600' };
    if (hour < 18) return { text: 'Ca chiều', color: 'text-orange-600' };
    return { text: 'Ca tối', color: 'text-purple-600' };
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

  // Filter employees by search
  const filteredEmployees = employeeAttendance.filter(record => {
    const name = record.name || record.employeeName || '';
    const id = record.id || record.employee_id || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           String(id).includes(searchTerm);
  });

  const updateStatus = (status, message) => {
    setSystemStatus(status);
    setSystemMessage(message);
  };

  const handleTakePhotos = async () => {
    if (!userId) {
      alert('Please enter a User ID');
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Take photos
      const data = await faceRecognitionApi.takePhotos(userId, userName);
      updateStatus(data.status, data.message);

      if (data.status === 'success') {
        // Step 2: Auto train model after photos captured
        updateStatus('running', 'Đang huấn luyện model...');
        try {
          const trainData = await faceRecognitionApi.trainModel();
          updateStatus(trainData.status, trainData.message);
          if (trainData.status === 'success') {
            alert('✅ Đăng ký và train model thành công!');
          } else {
            alert(`⚠️ Đăng ký thành công nhưng train thất bại: ${trainData.message}`);
          }
        } catch {
          updateStatus('error', 'Không thể train model');
          alert('⚠️ Đăng ký thành công nhưng train model thất bại');
        }
      }
    } catch {
      updateStatus('error', 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRecognition = async (type) => {
    setIsLoading(true);
    setAttendanceResult(null);
    try {
      const data = await faceRecognitionApi.startRecognition(type);
      updateStatus(data.status, data.message);
      alert(data.message);
      setAttendanceResult(data);

      // Refresh trạng thái chấm công sau khi nhận diện thành công (cho Employee)
      if (data.status === 'success' && userRole === 'employee' && currentUserId) {
        // Đợi 2 giây để backend cập nhật
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
          } catch (error) {
            console.error('Error refreshing attendance:', error);
          }
        }, 2000);
      }
    } catch {
      updateStatus('error', 'An error occurred');
      alert('❌ Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopProcess = async () => {
    setIsLoading(true);
    try {
      const data = await faceRecognitionApi.stopProcess();
      updateStatus(data.status, data.message);
    } catch {
      updateStatus('error', 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => ({
    running: 'bg-yellow-400',
    success: 'bg-green-400',
    error: 'bg-red-400',
    idle: 'bg-gray-300',
  }[systemStatus] || 'bg-gray-300');

  const getStatusBgColor = () => ({
    running: 'bg-yellow-50',
    success: 'bg-green-50',
    error: 'bg-red-50',
    idle: 'bg-gray-50',
  }[systemStatus] || 'bg-gray-50');

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className={`bg-gradient-to-r ${roleColors.headerGradient} p-6 rounded-lg shadow-lg text-white`}>
          <h1 className="text-2xl font-bold">Hệ thống nhận diện khuôn mặt</h1>
          <p className="text-white/80">Chụp ảnh tự động & chấm công</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className={`p-6 border-b border-gray-100 bg-gradient-to-r ${roleColors.sidebarGradient} text-center`}>
              <div className={`w-32 h-32 mx-auto bg-gradient-to-r ${roleColors.iconBg} rounded-full flex items-center justify-center`}>
                <Camera className={`h-16 w-16 ${roleColors.iconColor}`} />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">Face Recognition</h2>
              <p className={`text-sm ${roleColors.textAccent} font-medium`}>Attendance System</p>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">System Status</h3>
                <div className={`mt-2 p-3 rounded-md ${getStatusBgColor()}`}>
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full ${getStatusColor()} mr-2`} />
                    <p className="text-sm text-gray-600">{systemMessage}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Instructions</h3>
                <ul className="mt-2 space-y-2 text-sm text-gray-600">
                  <li>① Enter your ID and name to register.</li>
                  <li>② The system will automatically capture <strong>7 photos</strong> when your face is visible.</li>
                  <li>③ Move your face slightly for multiple angles.</li>
                  <li>④ Model will be <strong>trained automatically</strong> after capture.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Panel */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <nav className="flex border-b border-gray-200 bg-gray-50">
              {[
                { id: 'register', label: 'Đăng ký khuôn mặt', icon: Camera },
                { id: 'recognize', label: 'Chấm công', icon: CheckCircle },
                { id: 'attendance', label: 'Danh sách chấm công', icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? `border-b-2 ${roleColors.tabActive}`
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Register */}
              {activeTab === 'register' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">Đăng ký khuôn mặt mới</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mã nhân viên</label>
                      <input
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="VD: NV001"
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${roleColors.focusRing}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                      <input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Nhập họ và tên"
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${roleColors.focusRing}`}
                      />
                    </div>
                  </div>

                  <div className={`${roleColors.infoBg} rounded-md p-4 text-sm ${roleColors.infoText} flex`}>
                    <Info className={`h-5 w-5 ${roleColors.infoIcon} mr-2 flex-shrink-0`} />
                    <p>
                      Hệ thống sẽ <strong>tự động chụp 7 ảnh</strong> và <strong>train model</strong> sau khi hoàn tất.
                      Di chuyển khuôn mặt nhẹ theo các hướng khác nhau để tăng độ chính xác.
                    </p>
                  </div>

                  <div className="camera-container bg-gray-100 rounded-md p-4 text-center">
                    <Camera className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Camera sẽ hiển thị khi bắt đầu chụp tự động.</p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleStopProcess}
                      disabled={isLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      <StopIcon className="w-4 h-4" />
                      Dừng
                    </button>
                    <button
                      onClick={handleTakePhotos}
                      disabled={isLoading}
                      className={`px-4 py-2 ${roleColors.btnPrimary} text-white rounded-md flex items-center gap-2 text-sm disabled:opacity-50`}
                    >
                      <Video className="w-4 h-4" />
                      {isLoading ? 'Đang xử lý...' : 'Đăng ký & Train Model'}
                    </button>
                  </div>
                </div>
              )}

              {/* Recognize */}
              {activeTab === 'recognize' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">Chấm công bằng khuôn mặt</h3>

                  {/* Hiển thị trạng thái chấm công hôm nay */}
                  <div className={`rounded-lg p-4 border ${
                    todayAttendance.hasCheckedOut
                      ? 'bg-gray-50 border-gray-200'
                      : todayAttendance.hasCheckedIn
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {todayAttendance.hasCheckedOut ? (
                          <CheckCircle className="h-6 w-6 text-gray-500" />
                        ) : todayAttendance.hasCheckedIn ? (
                          <Clock className="h-6 w-6 text-yellow-500" />
                        ) : (
                          <AlertCircle className="h-6 w-6 text-blue-500" />
                        )}
                        <div>
                          <p className={`font-medium ${
                            todayAttendance.hasCheckedOut
                              ? 'text-gray-700'
                              : todayAttendance.hasCheckedIn
                              ? 'text-yellow-700'
                              : 'text-blue-700'
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

                  <div className={`bg-gradient-to-r ${roleColors.recognizeBg} rounded-md p-6 text-center`}>
                    <Eye className={`h-16 w-16 mx-auto ${roleColors.iconColor} mb-2`} />
                    <p className="text-gray-600 mb-2">
                      {todayAttendance.hasCheckedOut
                        ? 'Bạn đã hoàn thành chấm công hôm nay. Hẹn gặp lại ngày mai!'
                        : todayAttendance.hasCheckedIn
                        ? 'Bạn đã chấm công vào. Nhấn "Chấm công ra" khi kết thúc làm việc.'
                        : 'Bắt đầu nhận diện để tự động chấm công vào/ra khi phát hiện khuôn mặt của bạn.'}
                    </p>
                  </div>

                  {attendanceResult && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <div>
                          <p className="text-green-700">{attendanceResult.message}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between gap-3">
                    <button
                      onClick={handleStopProcess}
                      disabled={isLoading}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      <StopIcon className="w-4 h-4" />
                      Dừng
                    </button>

                    {/* Nút Check In - Ẩn nếu đã check in */}
                    {!todayAttendance.hasCheckedIn && (
                      <button
                        onClick={() => handleStartRecognition('clockin')}
                        disabled={isLoading}
                        className={`px-4 py-2 text-white rounded-md flex items-center gap-2 text-sm transition-all ${roleColors.btnPrimary} disabled:opacity-50`}
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
                        className={`px-4 py-2 text-white rounded-md flex items-center gap-2 text-sm transition-all ${roleColors.btnSecondary} disabled:opacity-50`}
                      >
                        <Clock className="w-4 h-4" />
                        Chấm công ra
                      </button>
                    )}

                    {/* Hiển thị thông báo khi đã hoàn thành */}
                    {todayAttendance.hasCheckedIn && todayAttendance.hasCheckedOut && (
                      <div className="px-4 py-2 bg-green-100 text-green-700 rounded-md flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Đã hoàn thành chấm công hôm nay
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Danh sách chấm công */}
              {activeTab === 'attendance' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Danh sách chấm công</h3>
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
                        className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${roleColors.focusRing} focus:border-transparent`}
                      />
                    </div>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${roleColors.focusRing}`}
                    />
                    <button
                      onClick={loadEmployeeAttendance}
                      disabled={loadingEmployees}
                      className={`px-4 py-2 ${roleColors.btnPrimary} text-white rounded-lg flex items-center gap-2 disabled:opacity-50`}
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
                          </tr>
                        </thead>
                        <tbody>
                          {loadingEmployees ? (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-gray-500">
                                <div className="flex items-center justify-center gap-2">
                                  <div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${roleColors.textAccent}`} style={{ borderColor: 'currentColor', borderTopColor: 'transparent' }}></div>
                                  <span>Đang tải...</span>
                                </div>
                              </td>
                            </tr>
                          ) : filteredEmployees.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-gray-500">
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
                                      <div className={`w-8 h-8 ${roleColors.btnPrimary} text-white rounded-full flex items-center justify-center text-sm font-medium`}>
                                        {(record.name || record.employeeName || 'U').charAt(0).toUpperCase()}
                                      </div>
                                      <span className="font-medium text-gray-900">
                                        {record.name || record.employeeName || 'Không xác định'}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-600">
                                    {record.department || 'N/A'}
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FaceRecognition;
