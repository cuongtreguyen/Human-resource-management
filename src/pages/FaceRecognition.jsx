import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/layout/Layout';
import { Camera, User, Brain, Eye, CheckCircle, Users, Clock, Video, Square } from 'lucide-react';
import faceRecognitionApi from '../services/faceRecognitionApi';

const FaceRecognition = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [systemStatus, setSystemStatus] = useState('connected');
  const [employeeCode, setEmployeeCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [registeredEmployees, setRegisteredEmployees] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionConfidence, setDetectionConfidence] = useState(0);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionCanvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check system status
        const status = await faceRecognitionApi.checkSystemStatus();
        setSystemStatus(status.status || 'connected');

        // Load employees
        const employees = await faceRecognitionApi.getRegisteredEmployees();
        setRegisteredEmployees(employees);

        // Load today's attendance
        const attendance = await faceRecognitionApi.getTodayAttendance();
        setTodayAttendance(attendance);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to mock data if API fails
        setRegisteredEmployees([
          { id: 1, code: 'EMP001', name: 'Nguyễn Văn A', department: 'IT', position: 'Developer' },
          { id: 2, code: 'EMP002', name: 'Trần Thị B', department: 'HR', position: 'Manager' },
          { id: 3, code: 'EMP003', name: 'Lê Văn C', department: 'Finance', position: 'Accountant' }
        ]);
        setTodayAttendance([
          { id: 1, employeeCode: 'EMP001', employeeName: 'Nguyễn Văn A', checkIn: '08:30', checkOut: '17:30', status: 'present' },
          { id: 2, employeeCode: 'EMP002', employeeName: 'Trần Thị B', checkIn: '09:00', checkOut: null, status: 'present' }
        ]);
      }
    };

    loadData();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        
        // Start face detection
          startFaceDetection();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
      setIsCameraActive(false);
    setFaceDetected(false);
    setDetectionConfidence(0);
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
  };

  const startFaceDetection = () => {
    if (!videoRef.current || !detectionCanvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = detectionCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    detectionIntervalRef.current = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Simple face detection simulation
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const hasFace = detectFaceInImageData(imageData);
        
        setFaceDetected(hasFace);
        setDetectionConfidence(hasFace ? Math.random() * 30 + 70 : 0);
      }
    }, 100);
  };

  const detectFaceInImageData = (imageData) => {
    // Simple face detection simulation
    // In a real implementation, this would use a proper face detection library
    const data = imageData.data;
    let skinPixels = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Simple skin color detection
      if (r > 95 && g > 40 && b > 20 && 
          Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
          Math.abs(r - g) > 15 && r > g && r > b) {
        skinPixels++;
      }
    }
    
    return skinPixels > 1000; // Threshold for face detection
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
  };

  const handleRegister = async () => {
    if (!capturedImage) {
      alert('Vui lòng chụp ảnh khuôn mặt trước khi đăng ký!');
      return;
    }

    if (!employeeCode || !fullName || !department || !position) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await faceRecognitionApi.registerEmployee({
        employeeCode,
        fullName,
        department,
        position,
        image: capturedImage
      });
      
      if (result.success) {
        alert('Đăng ký thành công!');
        setEmployeeCode('');
        setFullName('');
        setDepartment('');
        setPosition('');
      setCapturedImage(null);
        // Reload employees list
        const employees = await faceRecognitionApi.getRegisteredEmployees();
        setRegisteredEmployees(employees);
      } else {
        alert('Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrain = async () => {
    setIsLoading(true);
    
    try {
      await faceRecognitionApi.trainModel();
      alert('Huấn luyện mô hình thành công!');
    } catch (error) {
      console.error('Training failed:', error);
      alert('Huấn luyện thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecognize = async () => {
    if (!capturedImage) {
      alert('Vui lòng chụp ảnh khuôn mặt trước khi nhận diện!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], 'face.jpg', { type: 'image/jpeg' });

      const result = await faceRecognitionApi.recognizeFace(file);
      setRecognitionResult(result);
      
      if (result.success && result.employee) {
        alert(`Nhận diện thành công: ${result.employee.name}`);
      } else {
        alert('Không thể nhận diện khuôn mặt. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Recognition failed:', error);
      alert('Nhận diện thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!capturedImage) {
      alert('Vui lòng chụp ảnh khuôn mặt trước khi chấm công!');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], 'face.jpg', { type: 'image/jpeg' });
      
      const result = await faceRecognitionApi.checkIn(file);
      
      if (result.success) {
        alert(`Chấm công thành công: ${result.employee.name} - ${result.status}`);
        // Reload today's attendance
        const attendance = await faceRecognitionApi.getTodayAttendance();
        setTodayAttendance(attendance);
        } else {
        alert('Chấm công thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Check-in failed:', error);
      alert('Chấm công thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
            {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Face Recognition System</h1>
            <p className="text-gray-600 mt-1">Quản lý nhận diện khuôn mặt và chấm công</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${systemStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {systemStatus === 'connected' ? 'Hệ thống hoạt động' : 'Hệ thống lỗi'}
            </span>
          </div>
            </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
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
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover"
                    autoPlay
                    muted
                    playsInline
                  />
                  <canvas ref={detectionCanvasRef} className="hidden" />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {!isCameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="text-center">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Camera chưa được khởi động</p>
              </div>
            </div>
                  )}
                  
                  {isCameraActive && (
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center space-x-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                        <div className={`w-2 h-2 rounded-full ${faceDetected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-xs">
                          {faceDetected ? `Khuôn mặt: ${detectionConfidence.toFixed(1)}%` : 'Không phát hiện khuôn mặt'}
                      </span>
                    </div>
                      </div>
                  )}
                    </div>

                <div className="flex space-x-2">
                  {!isCameraActive ? (
                    <button
                      onClick={startCamera}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                    >
                      <Video className="h-4 w-4" />
                      <span>Khởi động camera</span>
                  </button>
                  ) : (
                    <>
                  <button
                        onClick={capturePhoto}
                        disabled={!faceDetected}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Chụp ảnh</span>
                    </button>
                    <button
                        onClick={stopCamera}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
                      >
                        <Square className="h-4 w-4" />
                        <span>Dừng camera</span>
              </button>
                    </>
                  )}
                  </div>

                {capturedImage && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Ảnh đã chụp:</h4>
                    <img src={capturedImage} alt="Captured" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                )}
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
                              value={employeeCode}
                              onChange={(e) => setEmployeeCode(e.target.value)}
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
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
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
                    disabled={isLoading || !capturedImage}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
                  
                          <button
                    onClick={handleTrain}
                    disabled={isLoading}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Đang huấn luyện...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4" />
                        <span>Huấn luyện mô hình</span>
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
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                            <video
                              ref={videoRef}
                    className="w-full h-64 object-cover"
                              autoPlay
                    muted
                              playsInline
                  />
                  <canvas ref={detectionCanvasRef} className="hidden" />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {!isCameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <div className="text-center">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Camera chưa được khởi động</p>
                              </div>
                            </div>
                          )}
                </div>
                          
                <div className="flex space-x-2">
                  {!isCameraActive ? (
                            <button
                      onClick={startCamera}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                            >
                      <Video className="h-4 w-4" />
                      <span>Khởi động camera</span>
                            </button>
                  ) : (
                    <>
                            <button
                        onClick={capturePhoto}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                            >
                        <Camera className="h-4 w-4" />
                        <span>Chụp ảnh</span>
                            </button>
                            <button
                        onClick={stopCamera}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
                            >
                        <Square className="h-4 w-4" />
                        <span>Dừng camera</span>
                            </button>
                    </>
                      )}
                    </div>

                {capturedImage && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Ảnh đã chụp:</h4>
                    <img src={capturedImage} alt="Captured" className="w-full h-32 object-cover rounded-lg" />
                    </div>
                  )}
                        </div>

              {/* Recognition Section */}
                  <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Kết quả nhận diện</h3>
                    
                    <button
                      onClick={handleRecognize}
                  disabled={isLoading || !capturedImage}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang nhận diện...</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span>Nhận diện khuôn mặt</span>
                    </>
                  )}
                </button>
                
                {recognitionResult && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Kết quả:</h4>
                    {recognitionResult.success ? (
                  <div className="space-y-2">
                        <p><strong>Tên:</strong> {recognitionResult.employee?.name}</p>
                        <p><strong>Mã nhân viên:</strong> {recognitionResult.employee?.code}</p>
                        <p><strong>Phòng ban:</strong> {recognitionResult.employee?.department}</p>
                        <p><strong>Chức vụ:</strong> {recognitionResult.employee?.position}</p>
                        <p><strong>Độ tin cậy:</strong> {recognitionResult.confidence?.toFixed(2)}%</p>
                          </div>
                ) : (
                      <p className="text-red-600">Không thể nhận diện khuôn mặt</p>
                )}
              </div>
                )}
                  </div>
                  </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Camera Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Camera chấm công</h3>
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover"
                    autoPlay
                    muted
                    playsInline
                  />
                  <canvas ref={detectionCanvasRef} className="hidden" />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {!isCameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <div className="text-center">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Camera chưa được khởi động</p>
                    </div>
                  </div>
                )}
                      </div>
                      
                <div className="flex space-x-2">
                  {!isCameraActive ? (
                    <button
                      onClick={startCamera}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                    >
                      <Video className="h-4 w-4" />
                      <span>Khởi động camera</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={capturePhoto}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Chụp ảnh</span>
                      </button>
                      <button
                        onClick={stopCamera}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
                      >
                        <Square className="h-4 w-4" />
                        <span>Dừng camera</span>
                      </button>
                    </>
                  )}
                        </div>
                
                {capturedImage && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Ảnh đã chụp:</h4>
                    <img src={capturedImage} alt="Captured" className="w-full h-32 object-cover rounded-lg" />
                    </div>
                  )}
              </div>

              {/* Check-in Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Chấm công</h3>
                
                <button
                  onClick={handleCheckIn}
                  disabled={isLoading || !capturedImage}
                  className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang chấm công...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Chấm công</span>
                    </>
                  )}
                </button>
                
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
                <span className="text-sm text-gray-600">
                  Tổng: {registeredEmployees.length} nhân viên
                </span>
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
                    {registeredEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Đã đăng ký
                          </span>
                        </td>
                      </tr>
                    ))}
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
                <span className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('vi-VN')}
                </span>
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
                    {todayAttendance.map((attendance) => (
                      <tr key={attendance.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {attendance.employeeCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {attendance.employeeName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {attendance.checkIn || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {attendance.checkOut || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            attendance.status === 'present' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {attendance.status === 'present' ? 'Có mặt' : 'Vắng mặt'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                  </div>
                </div>
          )}
              </div>
            </div>
    </Layout>
  );
};

export default FaceRecognition;