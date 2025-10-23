import React, { useState, useEffect } from 'react';
import { Camera, User, Eye, CheckCircle, AlertCircle, Users, Clock, Video, Square, Info, Play, Square as StopIcon } from 'lucide-react';
import faceRecognitionPortalApi from '../services/faceRecognitionPortalApi';

const FaceRecognitionPortal = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [systemStatus, setSystemStatus] = useState('connected');
  const [systemMessage, setSystemMessage] = useState('Hệ thống hoạt động');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [recognitionActive, setRecognitionActive] = useState(false);

  // Check system status periodically
  useEffect(() => {
    const checkStatus = async () => {
      const data = await faceRecognitionPortalApi.checkSystemStatus();
      setSystemStatus(data.status);
      setSystemMessage(data.message);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTakePhotos = async () => {
    if (!userId || !userName || !department || !position) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setIsLoading(true);
    try {
      const data = await faceRecognitionPortalApi.takePhotos(userId, userName);
      if (data.status === 'success') {
        alert('Khởi động camera thành công! Nhấn phím "s" để chụp ảnh.');
        setCameraActive(true);
      } else {
        alert('Khởi động camera thất bại: ' + data.message);
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      alert('Khởi động camera thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!userId || !userName || !department || !position) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setIsLoading(true);
    try {
      const data = await faceRecognitionPortalApi.registerEmployee({
        employeeCode: userId,
        fullName: userName,
        department: department,
        position: position
      });
      
      if (data.success) {
        alert('Đăng ký nhân viên thành công! Đang huấn luyện mô hình...');
        
        // Tự động train model sau khi đăng ký thành công
        try {
          const trainData = await faceRecognitionPortalApi.trainModel();
          if (trainData.status === 'success') {
            alert('Huấn luyện mô hình thành công! Bây giờ có thể sử dụng chấm công.');
          } else {
            alert('Đăng ký thành công nhưng huấn luyện mô hình thất bại. Vui lòng train thủ công.');
          }
        } catch (trainError) {
          console.error('Auto training failed:', trainError);
          alert('Đăng ký thành công nhưng huấn luyện mô hình thất bại. Vui lòng train thủ công.');
        }
        
        setUserId('');
        setUserName('');
        setDepartment('');
        setPosition('');
      } else {
        alert('Đăng ký thất bại: ' + data.message);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleStartRecognition = async (type = 'check_in') => {
    setIsLoading(true);
    try {
      // Kiểm tra và train model trước khi nhận diện
      console.log('Checking model status before recognition...');
      
      const data = await faceRecognitionPortalApi.startRecognition(type);
      if (data.status === 'success') {
        alert('Bắt đầu nhận diện thành công! Hệ thống sẽ tự động chấm công khi phát hiện khuôn mặt.');
        setRecognitionActive(true);
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
      const data = await faceRecognitionPortalApi.stopProcess();
      if (data.status === 'success') {
        alert('Dừng quá trình thành công!');
        setCameraActive(false);
        setRecognitionActive(false);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Face Recognition System</h1>
          <p className="text-gray-600 mt-1">Quản lý nhận diện khuôn mặt và chấm công</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${systemStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">{systemMessage}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'register', label: 'Đăng ký nhân viên', icon: User },
            { id: 'recognize', label: 'Nhận diện', icon: Eye },
            { id: 'attendance', label: 'Chấm công', icon: CheckCircle },
            { id: 'employees', label: 'Danh sách nhân viên', icon: Users },
            { id: 'reports', label: 'Báo cáo hôm nay', icon: Clock }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Register Tab */}
        {activeTab === 'register' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Camera Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Camera</h3>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden h-64">
                {!cameraActive ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Camera chưa được khởi động</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                    <div className="text-center">
                      <Video className="h-12 w-12 text-gray-600 mx-auto mb-2 animate-pulse" />
                      <p className="text-gray-700">Camera đang hoạt động</p>
                      <p className="text-sm text-gray-500 mt-1">Nhấn phím 's' để chụp ảnh</p>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleTakePhotos}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Video className="h-4 w-4" />
                <span>Khởi động camera</span>
              </button>
            </div>

            {/* Form Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Thông tin nhân viên</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã nhân viên *
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mã nhân viên"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phòng ban *
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập phòng ban"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chức vụ *
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập chức vụ"
                  />
                </div>
                
                <button
                  onClick={handleRegister}
                  disabled={isLoading || !userId || !userName || !department || !position}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4" />
                      <span>Đăng ký nhân viên</span>
                    </>
                  )}
                </button>
                
              </div>
            </div>
          </div>
        )}

        {/* Recognize Tab */}
        {activeTab === 'recognize' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Camera Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Camera nhận diện</h3>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden h-64">
                {!cameraActive ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Camera chưa được khởi động</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                    <div className="text-center">
                      <Eye className="h-12 w-12 text-green-600 mx-auto mb-2 animate-pulse" />
                      <p className="text-gray-700">Đang nhận diện khuôn mặt...</p>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleStartRecognition('check_in')}
                disabled={isLoading}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Bắt đầu nhận diện</span>
              </button>
            </div>

            {/* Recognition Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Kết quả nhận diện</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">
                  Hệ thống sẽ tự động nhận diện khuôn mặt và hiển thị thông tin nhân viên khi phát hiện.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Camera Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Camera chấm công</h3>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden h-64">
                {!cameraActive ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Camera chưa được khởi động</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 text-orange-600 mx-auto mb-2 animate-pulse" />
                      <p className="text-gray-700">Sẵn sàng chấm công</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStartRecognition('check_in')}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Check In</span>
                </button>
                
                <button
                  onClick={() => handleStartRecognition('check_out')}
                  disabled={isLoading}
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Clock className="h-4 w-4" />
                  <span>Check Out</span>
                </button>
              </div>
            </div>

            {/* Attendance Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Chấm công</h3>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Hướng dẫn:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Đảm bảo khuôn mặt được nhìn thấy rõ ràng</li>
                  <li>• Giữ khoảng cách phù hợp với camera</li>
                  <li>• Ánh sáng đủ để camera nhận diện</li>
                  <li>• Hệ thống sẽ tự động xác định check-in/check-out</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Danh sách nhân viên đã đăng ký</h3>
              <span className="text-sm text-gray-600">Tổng: 3 nhân viên</span>
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã nhân viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Họ và tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phòng ban
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chức vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EMP001</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Nguyễn Văn A</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">IT</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Developer</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Đã đăng ký
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EMP002</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Trần Thị B</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">HR</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Manager</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Đã đăng ký
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EMP003</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Lê Văn C</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Finance</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Accountant</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Đã đăng ký
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Báo cáo chấm công hôm nay</h3>
              <span className="text-sm text-gray-600">{new Date().toLocaleDateString('vi-VN')}</span>
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã nhân viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Họ và tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check-in
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check-out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EMP001</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Nguyễn Văn A</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">08:30</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">17:30</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Có mặt
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EMP002</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Trần Thị B</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">09:00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Đang làm việc
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceRecognitionPortal;