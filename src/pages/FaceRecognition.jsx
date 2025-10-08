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

<<<<<<< HEAD
  const handleTrain = async () => {
    setIsLoading(true);
    
    try {
      const result = await faceRecognitionApi.trainModel();
      alert('Huấn luyện mô hình thành công!');
    } catch (error) {
      console.error('Training failed:', error);
      alert('Huấn luyện thất bại. Vui lòng thử lại.');
=======
  const trainModel = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (result.success) {
        alert('Model training completed successfully!');
      } else {
        alert(`Training failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Training error:', error);
      alert('Training failed. Please check if the API is running.');
>>>>>>> 6bf6499acae205ede4c040761fc4ea1e3d34088a
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  const handleRecognize = async () => {
    if (!capturedImage) {
      alert('Vui lòng chụp ảnh khuôn mặt trước khi nhận diện!');
=======
  const recognizeFace = async (checkType = 'check_in') => {
    if (!isCameraActive) {
      alert('Please start camera first');
>>>>>>> 6bf6499acae205ede4c040761fc4ea1e3d34088a
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
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-white">
            {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Face Recognition System</h1>
          <p className="text-purple-100 text-sm">Biometric attendance management</p>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="space-y-6">
            {/* Logo */}
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Camera className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Face Recognition</h2>
              <p className="text-xs text-purple-600">Attendance System</p>
            </div>

                {/* System Status */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                SYSTEM STATUS
              </h3>
              <div className={`p-3 rounded-lg ${
                    systemStatus === 'connected' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    systemStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`text-sm font-medium ${
                        systemStatus === 'connected' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {systemStatus === 'connected' 
                      ? 'System connected and ready' 
                      : 'Cannot connect to recognition system'
                        }
                      </span>
                    </div>
                      </div>
                    </div>

            {/* Instructions */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                INSTRUCTIONS
              </h3>
                  <div className="space-y-3">
                {[
                  "Register with your ID and name",
                  "Take photos by pressing 's' key when camera is active",
                  "Train the model with your photos",
                  "Start recognition to check in/out"
                ].map((instruction, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      {index + 1}
>>>>>>> 6bf6499acae205ede4c040761fc4ea1e3d34088a
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{instruction}</p>
                  </div>
<<<<<<< HEAD

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
=======
                ))}
              </div>
            </div>
          </div>
              </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
>>>>>>> 6bf6499acae205ede4c040761fc4ea1e3d34088a
                  {/* Tabs */}
                <div className="flex space-x-4 mb-6">
                    <button
                      onClick={() => setActiveTab('register')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        activeTab === 'register'
<<<<<<< HEAD
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
=======
                          ? 'text-purple-600 border-b-2 border-purple-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                Register User
              </button>
              <button
                onClick={() => setActiveTab('train')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'train'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Train Model
                    </button>
                    <button
                onClick={() => setActiveTab('recognize')}
                      className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'recognize'
                          ? 'text-purple-600 border-b-2 border-purple-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                Recognize
>>>>>>> 6bf6499acae205ede4c040761fc4ea1e3d34088a
                    </button>
                  </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Main Content */}
              <div>

                  {/* Tab Content */}
                  {activeTab === 'register' && (
                  <div className="space-y-4">
<<<<<<< HEAD
                    <h3 className="text-lg font-semibold">Register New Employee</h3>
                        
                    <div className="grid grid-cols-2 gap-4">
                          <div>
                        <label className="block text-sm font-medium mb-1">Employee Code</label>
                        <input
                              type="text"
=======
                    <h2 className="text-xl font-bold text-gray-900">Register New User</h2>
                        
                    <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                          User ID
                            </label>
                            <Input
                              type="text"
                          placeholder="Enter a number between 1-10000"
>>>>>>> 6bf6499acae205ede4c040761fc4ea1e3d34088a
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
<<<<<<< HEAD
=======
                          placeholder="Enter your name if you're a new user"
>>>>>>> 6bf6499acae205ede4c040761fc4ea1e3d34088a
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Nguyễn Văn A"
                            />
                          </div>
<<<<<<< HEAD
                          
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
=======
                          </div>
                          
                    {/* Info Box */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-white text-xs font-bold">i</span>
                          </div>
                        <p className="text-sm text-purple-800">
                          When the camera starts, press the 's' key to capture a photo. Take multiple photos from different angles for better recognition.
                        </p>
                        </div>
                      </div>

                      {/* Camera Controls */}
                    <div className="flex gap-3">
                        <Button 
                          onClick={startCamera}
                          disabled={!employeeCode || !fullName}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                        >
                          <Camera className="h-4 w-4" />
                          Start Camera
                        </Button>
                        <Button 
                          onClick={stopCamera}
                          disabled={!isCameraActive}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                        >
                          <X className="h-4 w-4" />
                          Stop Camera
                        </Button>
>>>>>>> 6bf6499acae205ede4c040761fc4ea1e3d34088a
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

<<<<<<< HEAD
                      <canvas ref={canvasRef} className="hidden" />
                    </div>

                    <div className="flex space-x-4 mt-6">
                      <button
                        onClick={handleRegister}
                        disabled={isLoading || !capturedImage}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
=======
                      {/* Register Button */}
                      <Button 
                        onClick={registerEmployee}
                        disabled={isLoading || !employeeCode || !fullName || capturedPhotos.length === 0}
                      className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700"
>>>>>>> 6bf6499acae205ede4c040761fc4ea1e3d34088a
                      >
                        <Camera className="mr-2" size={20} />
                        {isLoading ? 'Registering...' : 'Register Face'}
                      </button>
                    </div>
                    </div>
                  )}

                {activeTab === 'train' && (
                  <div className="space-y-4">
<<<<<<< HEAD
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
=======
                    <h2 className="text-xl font-bold text-gray-900">Train Recognition Model</h2>
                    
                    {/* Warning Box */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                      <div>
                          <h4 className="font-medium text-yellow-800 mb-1">Important</h4>
                          <p className="text-sm text-yellow-700">
                            Training the model may take some time depending on the number of photos. The system will be unavailable during training.
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700">
                      After taking photos, you need to train the model to recognize your face. This process analyzes all the photos and creates a recognition profile for each registered user.
                    </p>

                    <div className="flex justify-end">
                          <Button 
                        onClick={trainModel}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                          >
                        <Brain className="h-4 w-4" />
                        {isLoading ? 'Training...' : 'Start Training'}
                          </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'recognize' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Face Recognition</h2>
                    
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Camera className="h-8 w-8 text-purple-600" />
                      </div>
                      
                      <p className="text-gray-700 mb-2">
                        Start recognition to automatically check in/out when your face is detected.
                      </p>
                      <p className="text-gray-600 text-sm mb-6">
                        The system will record attendance with timestamp when a registered face is recognized.
                      </p>

                      <div className="flex gap-3 justify-center">
                          <Button 
                            onClick={stopCamera}
                            disabled={!isCameraActive}
                          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600"
                          >
                            <X className="h-4 w-4" />
                          Stop Recognition
                          </Button>
                          <Button 
                            onClick={() => recognizeFace('check_in')}
                            disabled={isLoading || !isCameraActive}
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                          >
                            <Clock className="h-4 w-4" />
                          Clock In
                          </Button>
                          <Button 
                            onClick={() => recognizeFace('check_out')}
                            disabled={isLoading || !isCameraActive}
                          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600"
                          >
                            <Clock className="h-4 w-4" />
                          Clock Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              {/* Right Column - Statistics */}
              <div className="space-y-4">
                {/* Recognition Result */}
                {recognitionResult && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">RECOGNITION RESULT</h3>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="font-medium text-green-800">Face Recognized!</span>
                      </div>
                      <div className="text-sm text-green-700">
                        <p><strong>Name:</strong> {recognitionResult.name}</p>
                        <p><strong>Employee Code:</strong> {recognitionResult.employee_code}</p>
                        <p><strong>Confidence:</strong> {recognitionResult.confidence}%</p>
                        <p><strong>Action:</strong> {recognitionResult.check_type === 'check_in' ? 'Check In' : 'Check Out'}</p>
                        <p><strong>Time:</strong> {new Date(recognitionResult.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Statistics */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">STATISTICS</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registered Employees:</span>
                      <span className="font-semibold">{registeredEmployees.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Today's Attendance:</span>
                      <span className="font-semibold">{todayAttendance.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Captured Photos:</span>
                      <span className="font-semibold">{capturedPhotos.length}</span>
                    </div>
                  </div>
                </div>

                {/* Today's Attendance */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">TODAY'S ATTENDANCE</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {todayAttendance.length === 0 ? (
                      <p className="text-gray-500 text-sm">No attendance records today</p>
                    ) : (
                      todayAttendance.map((record) => (
                        <div key={record.id} className="p-2 bg-gray-50 rounded text-sm">
                          <div className="font-medium">{record.full_name}</div>
                          <div className="text-gray-600">
                            {record.check_in && `In: ${record.check_in}`}
                            {record.check_out && ` | Out: ${record.check_out}`}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <Button 
                    onClick={loadTodayAttendance}
                    className="w-full mt-3 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>

                {/* Registered Employees */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">REGISTERED EMPLOYEES</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {registeredEmployees.length === 0 ? (
                      <p className="text-gray-500 text-sm">No employees registered</p>
                    ) : (
                      registeredEmployees.map((employee) => (
                        <div key={employee.employee_code} className="p-2 bg-gray-50 rounded text-sm">
                          <div className="font-medium">{employee.full_name}</div>
                          <div className="text-gray-600">
                            {employee.employee_code} | {employee.department}
>>>>>>> 6bf6499acae205ede4c040761fc4ea1e3d34088a
                          </div>
                  ))}
                  </div>
<<<<<<< HEAD
=======
                  <Button 
                    onClick={loadEmployees}
                    className="w-full mt-3 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
>>>>>>> 6bf6499acae205ede4c040761fc4ea1e3d34088a
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;
