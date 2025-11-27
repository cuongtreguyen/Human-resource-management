import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../../components/layout/Layout';
import {
  Camera,
  User,
  Eye,
  CheckCircle,
  Clock,
  Video,
  AlertCircle,
  Info,
  Square as StopIcon,
} from 'lucide-react';
import faceRecognitionApi from '../../services/faceRecognitionApi';
import { getRole } from '../../utils/auth';

const FaceRecognition = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [systemStatus, setSystemStatus] = useState('idle');
  const [systemMessage, setSystemMessage] = useState('System is idle');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceResult, setAttendanceResult] = useState(null);

  const userRole = getRole();

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
      const data = await faceRecognitionApi.takePhotos(userId, userName);
      updateStatus(data.status, data.message);
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
                  <li>② The system will automatically capture <strong>50 photos</strong> when your face is visible.</li>
                  <li>③ Move your face slightly for multiple angles.</li>
                  <li>④ After capturing, the system is ready for recognition.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Panel */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <nav className="flex border-b border-gray-200 bg-gray-50">
              {[
                ['register', 'Đăng ký khuôn mặt'],
                ['recognize', 'Chấm công'],
              ].map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? `border-b-2 ${roleColors.tabActive}`
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {label}
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
                      Hệ thống sẽ <strong>tự động chụp 50 ảnh</strong> khi phát hiện khuôn mặt của bạn.
                      Di chuyển khuôn mặt nhẹ theo các hướng khác nhau để tăng độ chính xác nhận diện.
                    </p>
                  </div>

                  <div className="camera-container bg-gray-100 rounded-md p-4 text-center">
                    <Camera className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Camera sẽ hiển thị khi bắt đầu chụp tự động.</p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleTakePhotos}
                      disabled={isLoading}
                      className={`px-4 py-2 ${roleColors.btnPrimary} text-white rounded-md flex items-center gap-2 text-sm disabled:opacity-50`}
                    >
                      <Video className="w-4 h-4" />
                      Bắt đầu chụp
                    </button>
                    <button
                      onClick={handleStopProcess}
                      disabled={isLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      <StopIcon className="w-4 h-4" />
                      Dừng
                    </button>
                  </div>
                </div>
              )}


              {/* Recognize */}
              {activeTab === 'recognize' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">Chấm công bằng khuôn mặt</h3>
                  <div className={`bg-gradient-to-r ${roleColors.recognizeBg} rounded-md p-6 text-center`}>
                    <Eye className={`h-16 w-16 mx-auto ${roleColors.iconColor} mb-2`} />
                    <p className="text-gray-600 mb-2">
                      Bắt đầu nhận diện để tự động chấm công vào/ra khi phát hiện khuôn mặt của bạn.
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

                  <div className="flex justify-between">
                    <button
                      onClick={handleStopProcess}
                      disabled={isLoading}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      <StopIcon className="w-4 h-4" />
                      Dừng
                    </button>
                    <button
                      onClick={() => handleStartRecognition('clockin')}
                      disabled={isLoading}
                      className={`px-4 py-2 ${roleColors.btnPrimary} text-white rounded-md flex items-center gap-2 text-sm disabled:opacity-50`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Chấm công vào
                    </button>
                    <button
                      onClick={() => handleStartRecognition('clockout')}
                      disabled={isLoading}
                      className={`px-4 py-2 ${roleColors.btnSecondary} text-white rounded-md flex items-center gap-2 text-sm disabled:opacity-50`}
                    >
                      <Clock className="w-4 h-4" />
                      Chấm công ra
                    </button>
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
