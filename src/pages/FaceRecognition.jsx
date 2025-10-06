import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Camera, Upload, Users, CheckCircle, AlertCircle, X, User, Brain, Eye, Clock, AlertTriangle, Database, RefreshCw } from 'lucide-react';

const FaceRecognition = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [systemStatus, setSystemStatus] = useState('disconnected');
  const [employeeCode, setEmployeeCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [registeredEmployees, setRegisteredEmployees] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Check system status
  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/status');
        if (response.ok) {
          const data = await response.json();
          setSystemStatus('connected');
          console.log('API Status:', data);
        } else {
          setSystemStatus('disconnected');
        }
      } catch (error) {
        console.log('API Error:', error);
        setSystemStatus('disconnected');
      }
    };
    
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load employees and attendance data
  useEffect(() => {
    loadEmployees();
    loadTodayAttendance();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/employees');
      if (response.ok) {
        const data = await response.json();
        setRegisteredEmployees(data.employees || []);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadTodayAttendance = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/attendance/today');
      if (response.ok) {
        const data = await response.json();
        setTodayAttendance(data.attendance || []);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  // Keyboard event listener for photo capture
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 's' && isCameraActive && activeTab === 'register') {
        capturePhoto();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isCameraActive, activeTab]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      const photoData = canvas.toDataURL('image/jpeg');
      const newPhoto = {
        id: Date.now(),
        data: photoData,
        timestamp: new Date().toISOString()
      };

      setCapturedPhotos(prev => [...prev, newPhoto]);
    }
  };

  const registerEmployee = async () => {
    if (!employeeCode || !fullName || capturedPhotos.length === 0) {
      alert('Please fill in all fields and capture at least one photo');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_code: employeeCode,
          full_name: fullName,
          department: department,
          position: position,
          photos: capturedPhotos.map(photo => photo.data)
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(`Employee ${fullName} registered successfully!`);
        // Clear form
        setEmployeeCode('');
        setFullName('');
        setDepartment('');
        setPosition('');
        setCapturedPhotos([]);
        stopCamera();
        // Reload employees list
        loadEmployees();
      } else {
        alert(`Registration failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please check if the API is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const recognizeFace = async (checkType = 'check_in') => {
    if (!isCameraActive) {
      alert('Please start camera first');
      return;
    }

    setIsLoading(true);
    try {
      // Capture current frame
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        const photoData = canvas.toDataURL('image/jpeg');

        const response = await fetch('http://localhost:5000/api/recognize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            photo: photoData,
            check_type: checkType
          })
        });

        const result = await response.json();

        if (result.success && result.recognized) {
          setRecognitionResult({
            name: result.name,
            employee_code: result.employee_code,
            confidence: result.confidence,
            check_type: result.check_type,
            timestamp: result.timestamp
          });
          
          // Reload attendance data
          loadTodayAttendance();
          
          // Clear result after 3 seconds
          setTimeout(() => setRecognitionResult(null), 3000);
        } else {
          alert(result.message || 'Face not recognized');
        }
      }
    } catch (error) {
      console.error('Recognition error:', error);
      alert('Recognition failed. Please check if the API is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Face Recognition System
              </h1>
              <p className="text-lg text-gray-600">
                Biometric attendance management with SQLite database
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Panel */}
              <div className="space-y-6">
                {/* System Status */}
                <Card title="SYSTEM STATUS">
                  <div className={`p-4 rounded-lg ${
                    systemStatus === 'connected' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center">
                      {systemStatus === 'connected' ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span className={`font-medium ${
                        systemStatus === 'connected' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {systemStatus === 'connected' 
                          ? 'API Connected - Ready' 
                          : 'Could not connect to API on port 5000'
                        }
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Recognition Result */}
                {recognitionResult && (
                  <Card title="RECOGNITION RESULT">
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
                  </Card>
                )}

                {/* Statistics */}
                <Card title="STATISTICS">
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
                </Card>
              </div>

              {/* Center Panel */}
              <div>
                <Card>
                  {/* Tabs */}
                  <div className="flex border-b border-gray-200 mb-6">
                    <button
                      onClick={() => setActiveTab('register')}
                      className={`px-4 py-2 font-medium text-sm ${
                        activeTab === 'register'
                          ? 'text-purple-600 border-b-2 border-purple-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Register Employee
                    </button>
                    <button
                      onClick={() => setActiveTab('attendance')}
                      className={`px-4 py-2 font-medium text-sm ${
                        activeTab === 'attendance'
                          ? 'text-purple-600 border-b-2 border-purple-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Attendance
                    </button>
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'register' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Register New Employee</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Employee Code
                            </label>
                            <Input
                              type="text"
                              placeholder="e.g., EMP001"
                              value={employeeCode}
                              onChange={(e) => setEmployeeCode(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <Input
                              type="text"
                              placeholder="Enter full name"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Department
                            </label>
                            <Input
                              type="text"
                              placeholder="e.g., IT Department"
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Position
                            </label>
                            <Input
                              type="text"
                              placeholder="e.g., Software Developer"
                              value={position}
                              onChange={(e) => setPosition(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Camera Controls */}
                      <div className="flex gap-3 mb-4">
                        <Button 
                          onClick={startCamera}
                          disabled={!employeeCode || !fullName}
                          className="flex items-center gap-2"
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
                      </div>

                      {/* Camera Feed */}
                      {isCameraActive && (
                        <div className="space-y-4">
                          <div className="relative">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-64 bg-gray-900 rounded-lg object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                              Press 'S' to capture photo
                            </div>
                          </div>
                          
                          {/* Hidden canvas for photo capture */}
                          <canvas ref={canvasRef} className="hidden" />
                          
                          {/* Captured Photos Preview */}
                          {capturedPhotos.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-900">Captured Photos ({capturedPhotos.length})</h4>
                              <div className="grid grid-cols-3 gap-2">
                                {capturedPhotos.map((photo) => (
                                  <img
                                    key={photo.id}
                                    src={photo.data}
                                    alt={`Photo ${photo.id}`}
                                    className="w-full h-20 object-cover rounded border"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Register Button */}
                      <Button 
                        onClick={registerEmployee}
                        disabled={isLoading || !employeeCode || !fullName || capturedPhotos.length === 0}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Database className="h-4 w-4" />
                        {isLoading ? 'Registering...' : 'Register Employee'}
                      </Button>
                    </div>
                  )}

                  {activeTab === 'attendance' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Face Recognition Attendance</h3>
                        
                        {/* Camera Controls */}
                        <div className="flex gap-3 mb-4">
                          <Button 
                            onClick={startCamera}
                            className="flex items-center gap-2"
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
                        </div>

                        {/* Camera Feed */}
                        {isCameraActive && (
                          <div className="relative mb-4">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-64 bg-gray-900 rounded-lg object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                              Camera Active
                            </div>
                            {/* Hidden canvas for photo capture */}
                            <canvas ref={canvasRef} className="hidden" />
                          </div>
                        )}

                        {/* Recognition Buttons */}
                        <div className="flex gap-3">
                          <Button 
                            onClick={() => recognizeFace('check_in')}
                            disabled={isLoading || !isCameraActive}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                          >
                            <Clock className="h-4 w-4" />
                            {isLoading ? 'Recognizing...' : 'Check In'}
                          </Button>
                          <Button 
                            onClick={() => recognizeFace('check_out')}
                            disabled={isLoading || !isCameraActive}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                          >
                            <Clock className="h-4 w-4" />
                            {isLoading ? 'Recognizing...' : 'Check Out'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Right Panel */}
              <div className="space-y-6">
                {/* Today's Attendance */}
                <Card title="TODAY'S ATTENDANCE">
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
                </Card>

                {/* Registered Employees */}
                <Card title="REGISTERED EMPLOYEES">
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {registeredEmployees.length === 0 ? (
                      <p className="text-gray-500 text-sm">No employees registered</p>
                    ) : (
                      registeredEmployees.map((employee) => (
                        <div key={employee.employee_code} className="p-2 bg-gray-50 rounded text-sm">
                          <div className="font-medium">{employee.full_name}</div>
                          <div className="text-gray-600">
                            {employee.employee_code} | {employee.department}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <Button 
                    onClick={loadEmployees}
                    className="w-full mt-3 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FaceRecognition;