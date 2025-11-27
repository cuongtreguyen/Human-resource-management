import React, { useState, useEffect } from 'react';
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

const FaceRecognition = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [systemStatus, setSystemStatus] = useState('idle');
  const [systemMessage, setSystemMessage] = useState('System is idle');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceResult, setAttendanceResult] = useState(null);

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
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-lg shadow-lg text-white">
          <h1 className="text-2xl font-bold">Face Recognition System</h1>
          <p className="text-purple-100">Automatic photo capture & attendance</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50 text-center">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                <Camera className="h-16 w-16 text-purple-500" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">Face Recognition</h2>
              <p className="text-sm text-purple-600 font-medium">Attendance System</p>
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
                ['register', 'Register User'],
                ['recognize', 'Recognize'],
              ].map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-purple-500 text-purple-600'
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
                  <h3 className="text-lg font-semibold text-gray-800">Register New User</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                      <input
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="e.g., 101"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-md p-4 text-sm text-purple-700 flex">
                    <Info className="h-5 w-5 text-purple-400 mr-2" />
                    <p>
                      The system will <strong>automatically capture 50 photos</strong> when your face is detected.  
                      Move your face slightly in different directions for better recognition accuracy.
                    </p>
                  </div>

                  <div className="camera-container bg-gray-100 rounded-md p-4 text-center">
                    <Camera className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Camera will appear when backend starts auto capture.</p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleTakePhotos}
                      disabled={isLoading}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      <Video className="w-4 h-4" />
                      Start Auto Capture
                    </button>
                    <button
                      onClick={handleStopProcess}
                      disabled={isLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      <StopIcon className="w-4 h-4" />
                      Stop Process
                    </button>
                  </div>
                </div>
              )}


              {/* Recognize */}
              {activeTab === 'recognize' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">Face Recognition</h3>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-md p-6 text-center">
                    <Eye className="h-16 w-16 mx-auto text-purple-400 mb-2" />
                    <p className="text-gray-600 mb-2">
                      Start recognition to automatically clock in/out when your face is detected.
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
                      Stop
                    </button>
                    <button
                      onClick={() => handleStartRecognition('clockin')}
                      disabled={isLoading}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Clock In
                    </button>
                    <button
                      onClick={() => handleStartRecognition('clockout')}
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      <Clock className="w-4 h-4" />
                      Clock Out
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
