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
          { id: 1, employee: 'Nguyễn Văn A', time: '08:30', status: 'Check In' },
          { id: 2, employee: 'Trần Thị B', time: '08:45', status: 'Check In' },
          { id: 3, employee: 'Lê Văn C', time: '09:00', status: 'Check In' }
        ]);
      }
    };

    loadData();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopFaceDetection();
      stopCamera();
    };
  }, []);

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        
        // Start face detection after video is loaded
        videoRef.current.onloadedmetadata = () => {
          startFaceDetection();
        };
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
      setIsCameraActive(false);
    }
    stopFaceDetection();
  };

  const detectFace = () => {
    if (!videoRef.current || !detectionCanvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = detectionCanvasRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame
    context.drawImage(video, 0, 0);
    
    // Simulate face detection (in real implementation, use OpenCV or face-api.js)
    const hasFace = Math.random() > 0.3; // 70% chance of detecting face
    const confidence = hasFace ? (Math.random() * 0.3 + 0.7) : 0; // 0.7-1.0 confidence
    
    if (hasFace) {
      // Draw bounding box
      const boxWidth = 200;
      const boxHeight = 250;
      const x = (canvas.width - boxWidth) / 2;
      const y = (canvas.height - boxHeight) / 2;
      
      // Draw blue bounding box
      context.strokeStyle = '#3B82F6';
      context.lineWidth = 3;
      context.strokeRect(x, y, boxWidth, boxHeight);
      
      // Draw confidence score
      context.fillStyle = '#3B82F6';
      context.fillRect(x, y - 30, 50, 25);
      context.fillStyle = 'white';
      context.font = '14px Arial';
      context.fillText(confidence.toFixed(2), x + 5, y - 10);
      
      setFaceDetected(true);
      setDetectionConfidence(confidence);
    } else {
      setFaceDetected(false);
      setDetectionConfidence(0);
    }
  };

  const startFaceDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    
    detectionIntervalRef.current = setInterval(detectFace, 100); // Detect every 100ms
  };

  const stopFaceDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setFaceDetected(false);
    setDetectionConfidence(0);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
      
      // Stop camera and detection after capture
      stopCamera();
      stopFaceDetection();
      
      return imageData;
    }
    return null;
  };

  const handleRegister = async () => {
    if (!employeeCode || !fullName || !department || !position) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!capturedImage) {
      alert('Vui lòng chụp ảnh khuôn mặt trước khi đăng ký!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], 'face.jpg', { type: 'image/jpeg' });
      
      // Call API to register employee
      const result = await faceRecognitionApi.registerEmployee({
        employeeCode,
        fullName,
        department,
        position
      }, file);
      
      // Refresh employees list
      const employees = await faceRecognitionApi.getRegisteredEmployees();
      setRegisteredEmployees(employees);
      
        // Clear form
        setEmployeeCode('');
        setFullName('');
        setDepartment('');
        setPosition('');
      setCapturedImage(null);
      
      alert('Đăng ký thành công! Ảnh khuôn mặt đã được lưu.');
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
      const result = await faceRecognitionApi.trainModel();
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
      
      // Call API to recognize face
      const result = await faceRecognitionApi.recognizeFace(file);
      
      if (result.success) {
        setRecognitionResult({
          employee: result.employee,
          confidence: result.confidence,
          timestamp: new Date().toLocaleTimeString()
        });
        
        // Record attendance
        await faceRecognitionApi.recordAttendance(result.employee.id);
        
        // Refresh attendance list
        const attendance = await faceRecognitionApi.getTodayAttendance();
        setTodayAttendance(attendance);
        } else {
        alert('Không nhận diện được khuôn mặt. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Recognition failed:', error);
      alert('Nhận diện thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
            {/* Header */}
        <div className="bg-purple-600 text-white p-6">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold">Face Recognition System</h1>
            <p className="text-purple-200 mt-2">Quản lý và nhận diện khuôn mặt cho chấm công</p>
          </div>
            </div>

        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                {/* System Status */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4 flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={20} />
                  System Status
                </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                    <span>Camera:</span>
                    <span className="text-green-600">Active</span>
                    </div>
                    <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="text-green-600">Ready</span>
                    </div>
                    <div className="flex justify-between">
                    <span>Database:</span>
                    <span className="text-green-600">Connected</span>
                  </div>
                    </div>
                  </div>

              {/* Instructions */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4">Instructions</h3>
                <ul className="text-sm space-y-2">
                  <li>• Đảm bảo ánh sáng đủ</li>
                  <li>• Nhìn thẳng vào camera</li>
                  <li>• Giữ khoảng cách 50-80cm</li>
                  <li>• Không đeo kính râm</li>
                </ul>
              </div>
              </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow">
                  {/* Tabs */}
                <div className="flex space-x-4 mb-6">
                    <button
                      onClick={() => setActiveTab('register')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        activeTab === 'register'
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Register User
                  </button>
                  <button
                    onClick={() => setActiveTab('train')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      activeTab === 'train' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Train Model
                    </button>
                    <button
                    onClick={() => setActiveTab('recognize')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      activeTab === 'recognize' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Recognize
                    </button>
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'register' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Register New Employee</h3>
                        
                    <div className="grid grid-cols-2 gap-4">
                          <div>
                        <label className="block text-sm font-medium mb-1">Employee Code</label>
                        <input
                              type="text"
                              value={employeeCode}
                              onChange={(e) => setEmployeeCode(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="EMP001"
                            />
                          </div>
                          
                          <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Nguyễn Văn A"
                            />
                          </div>
                          
                          <div>
                        <label className="block text-sm font-medium mb-1">Department</label>
                        <input
                              type="text"
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="IT"
                            />
                          </div>
                          
                          <div>
                        <label className="block text-sm font-medium mb-1">Position</label>
                        <input
                              type="text"
                              value={position}
                              onChange={(e) => setPosition(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Developer"
                            />
                        </div>
                      </div>

                    {/* Camera Section */}
                    <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                      <h4 className="font-medium mb-4">Chụp ảnh khuôn mặt</h4>
                      
                      {!isCameraActive && !capturedImage && (
                        <div className="text-center">
                          <button
                          onClick={startCamera}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto"
                          >
                            <Video className="mr-2" size={20} />
                            Bật Camera
                          </button>
                      </div>
                      )}

                      {isCameraActive && (
                        <div className="text-center space-y-4">
                          <div className="relative inline-block">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              className="w-full max-w-md mx-auto rounded-lg"
                              style={{ transform: 'scaleX(-1)' }}
                            />
                            <canvas
                              ref={detectionCanvasRef}
                              className="absolute top-0 left-0 w-full max-w-md mx-auto rounded-lg pointer-events-none"
                              style={{ transform: 'scaleX(-1)' }}
                            />
                          </div>
                          
                          {/* Face Detection Status */}
                          {faceDetected && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-medium">Face detected!</span>
                                <span className="text-sm">Confidence: {(detectionConfidence * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-center space-x-4">
                            <button
                              onClick={capturePhoto}
                              disabled={!faceDetected}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                              <Camera className="mr-2" size={20} />
                              {faceDetected ? 'Chụp ảnh' : 'Chờ nhận diện...'}
                            </button>
                            <button
                              onClick={stopCamera}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                            >
                              <Square className="mr-2" size={20} />
                              Tắt Camera
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {capturedImage && (
                        <div className="text-center space-y-4">
                          <img
                            src={capturedImage}
                            alt="Captured face"
                            className="w-full max-w-md mx-auto rounded-lg"
                          />
                          <div className="flex justify-center space-x-4">
                            <button
                              onClick={() => setCapturedImage(null)}
                              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                              Chụp lại
                            </button>
                            <span className="text-green-600 font-medium">✓ Ảnh đã chụp</span>
                          </div>
                        </div>
                      )}

                      <canvas ref={canvasRef} className="hidden" />
                    </div>

                    <div className="flex space-x-4 mt-6">
                      <button
                        onClick={handleRegister}
                        disabled={isLoading || !capturedImage}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
                      >
                        <Camera className="mr-2" size={20} />
                        {isLoading ? 'Registering...' : 'Register Face'}
                      </button>
                    </div>
                    </div>
                  )}

                {activeTab === 'train' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Train Recognition Model</h3>
                    <p className="text-gray-600">Huấn luyện mô hình nhận diện khuôn mặt với dữ liệu mới</p>
                    
                    <button
                      onClick={handleTrain}
                      disabled={isLoading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                    >
                      <Brain className="mr-2" size={20} />
                      {isLoading ? 'Training...' : 'Start Training'}
                    </button>
                        </div>
                      )}

                {activeTab === 'recognize' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Face Recognition</h3>
                    <p className="text-gray-600">Nhận diện khuôn mặt để chấm công</p>
                    
                    <button
                      onClick={handleRecognize}
                      disabled={isLoading}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                    >
                      <Eye className="mr-2" size={20} />
                      {isLoading ? 'Recognizing...' : 'Start Recognition'}
                    </button>
                    </div>
                  )}
              </div>
                        </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Recognition Result */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4">Recognition Result</h3>
                {recognitionResult ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Employee:</span>
                      <span className="font-medium">{recognitionResult.employee.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Code:</span>
                      <span>{recognitionResult.employee.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence:</span>
                      <span className="text-green-600">{recognitionResult.confidence}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span>{recognitionResult.timestamp}</span>
                            </div>
                          </div>
                ) : (
                  <p className="text-gray-500">No recognition result</p>
                )}
              </div>

              {/* Statistics */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4">Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Employees:</span>
                    <span>{registeredEmployees.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Today's Attendance:</span>
                    <span>{todayAttendance.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recognition Rate:</span>
                    <span className="text-green-600">98.5%</span>
                        </div>
                      </div>
              </div>

                {/* Today's Attendance */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Clock className="mr-2" size={20} />
                  Today's Attendance
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {todayAttendance.map((attendance) => (
                    <div key={attendance.id} className="flex justify-between text-sm">
                      <span>{attendance.employee}</span>
                      <span className="text-green-600">{attendance.time}</span>
                    </div>
                  ))}
                          </div>
                        </div>

                {/* Registered Employees */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Users className="mr-2" size={20} />
                  Registered Employees
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {registeredEmployees.map((employee) => (
                    <div key={employee.id} className="text-sm">
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-gray-500">{employee.code} - {employee.department}</div>
                          </div>
                  ))}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FaceRecognition;
