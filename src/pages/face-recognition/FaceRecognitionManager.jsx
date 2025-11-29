import React, { useState, useEffect } from 'react';
import { Camera, Users, Clock, BarChart3, UserCheck } from 'lucide-react';
import faceRecognitionApi from '../../services/faceRecognitionApi';
import MyAttendanceTab from '../../components/attendance/MyAttendanceTab';
import TeamAttendanceTab from '../../components/attendance/TeamAttendanceTab';

const FaceRecognitionManager = () => {
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
    { id: 'team_attendance', label: 'Chấm công Team', icon: Users },
    { id: 'reports', label: 'Báo cáo', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Purple Gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold">Quản lý Chấm công</h1>
            <p className="text-purple-200 mt-1">Manager Portal - Chấm công cá nhân & Quản lý team</p>
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
                  ? 'border-b-2 border-purple-600 text-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-purple-600' : 'text-gray-400'}`} />
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
              themeColor="purple"
              onStartRecognition={handleStartRecognition}
              onStopProcess={handleStopProcess}
              isLoading={isLoading}
              cameraActive={cameraActive}
            />
          )}

          {/* Tab: Chấm công Team */}
          {activeTab === 'team_attendance' && (
            <TeamAttendanceTab themeColor="purple" />
          )}

          {/* Tab: Báo cáo */}
          {activeTab === 'reports' && (
            <ReportsTab />
          )}
        </div>
      </div>
    </div>
  );
};

// Component báo cáo đơn giản
const ReportsTab = () => {
  const [stats, setStats] = useState({ totalEmployees: 0, present: 0, absent: 0, stillWorking: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await faceRecognitionApi.getAttendanceStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const attendanceRate = stats.totalEmployees > 0
    ? ((stats.present / stats.totalEmployees) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <BarChart3 className="text-purple-600" size={20} />
        Báo cáo chấm công hôm nay
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
          <div className="text-purple-600 text-sm font-medium mb-1">Tổng nhân viên</div>
          <div className="text-3xl font-bold text-purple-800">{stats.totalEmployees}</div>
        </div>
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="text-green-600 text-sm font-medium mb-1">Có mặt</div>
          <div className="text-3xl font-bold text-green-800">{stats.present}</div>
        </div>
        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
          <div className="text-red-600 text-sm font-medium mb-1">Vắng mặt</div>
          <div className="text-3xl font-bold text-red-800">{stats.absent}</div>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="text-blue-600 text-sm font-medium mb-1">Tỷ lệ chuyên cần</div>
          <div className="text-3xl font-bold text-blue-800">{attendanceRate}%</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Tiến độ chấm công hôm nay</span>
          <span className="text-sm text-gray-500">{stats.present}/{stats.totalEmployees}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${attendanceRate}%` }}
          ></div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
        <h4 className="font-semibold text-purple-900 mb-4">Thống kê nhanh</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Đang làm việc</span>
            <p className="text-xl font-bold text-purple-800">{stats.stillWorking} người</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Đã check-out</span>
            <p className="text-xl font-bold text-purple-800">{stats.checkedOut || 0} người</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognitionManager;
