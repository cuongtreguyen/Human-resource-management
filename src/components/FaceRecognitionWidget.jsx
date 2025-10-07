import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Clock, CheckCircle, AlertCircle, Brain, Database, RefreshCw } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';

const FaceRecognitionWidget = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('register');
  const [systemStatus, setSystemStatus] = useState('disconnected');
  const [employeeCode, setEmployeeCode] = useState('');
  const [fullName, setFullName] = useState('');
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
          setSystemStatus('connected');
        } else {
          setSystemStatus('disconnected');
        }
      } catch (error) {
        setSystemStatus('disconnected');
      }
    };
    
    if (isOpen) {
      checkSystemStatus();
      const interval = setInterval(checkSystemStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Load employees and attendance data
  useEffect(() => {
    if (isOpen) {
      loadEmployees();
      loadTodayAttendance();
    }
  }, [isOpen]);

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

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isCameraActive, activeTab, isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 320, 
          height: 240,
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
          photos: capturedPhotos.map(photo => photo.data)
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(`Employee ${fullName} registered successfully!`);
        setEmployeeCode('');
        setFullName('');
        setCapturedPhotos([]);
        stopCamera();
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
          
          loadTodayAttendance();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Face Recognition System</h2>
                <p className="text-purple-100 text-sm">Biometric attendance management</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 p-2"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex">
            {/* Left Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 p-4">
              <div className="space-y-6">
                {/* Logo */}
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Camera className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Face Recognition</h3>
                  <p className="text-xs text-purple-600">Attendance System</p>
                </div>

                {/* System Status */}
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                    SYSTEM STATUS
                  </h4>
                  <div className={`p-2 rounded-lg text-xs ${
                    systemStatus === 'connected' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        systemStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`font-medium ${
                        systemStatus === 'connected' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {systemStatus === 'connected' 
                          ? 'System connected' 
                          : 'Cannot connect to system'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                    INSTRUCTIONS
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Register with your ID and name",
                      "Take photos by pressing 's' key",
                      "Train the model with photos",
                      "Start recognition to check in/out"
                    ].map((instruction, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-4 h-4 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => setActiveTab('register')}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'register'
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
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Main Content */}
                <div>
                  {/* Tab Content */}
                  {activeTab === 'register' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900">Register New User</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            User ID
                          </label>
                          <Input
                            type="text"
                            placeholder="Enter a number between 1-10000"
                            value={employeeCode}
                            onChange={(e) => setEmployeeCode(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <Input
                            type="text"
                            placeholder="Enter your name if you're a new user"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Info Box */}
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center mr-2 mt-0.5">
                            <span className="text-white text-xs font-bold">i</span>
                          </div>
                          <p className="text-xs text-purple-800">
                            When the camera starts, press the 's' key to capture a photo. Take multiple photos from different angles for better recognition.
                          </p>
                        </div>
                      </div>

                      {/* Camera Controls */}
                      <div className="flex gap-2">
                        <Button 
                          onClick={startCamera}
                          disabled={!employeeCode || !fullName}
                          className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-xs px-3 py-2"
                        >
                          <Camera className="h-3 w-3" />
                          Start Camera
                        </Button>
                        <Button 
                          onClick={stopCamera}
                          disabled={!isCameraActive}
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-xs px-3 py-2"
                        >
                          <X className="h-3 w-3" />
                          Stop Camera
                        </Button>
                      </div>

                      {/* Camera Feed */}
                      {isCameraActive && (
                        <div className="space-y-3">
                          <div className="relative">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-48 bg-gray-900 rounded-lg object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                              Press 'S' to capture photo
                            </div>
                          </div>
                          
                          {/* Hidden canvas for photo capture */}
                          <canvas ref={canvasRef} className="hidden" />
                          
                          {/* Captured Photos Preview */}
                          {capturedPhotos.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-900 text-sm">Captured Photos ({capturedPhotos.length})</h4>
                              <div className="grid grid-cols-3 gap-2">
                                {capturedPhotos.map((photo) => (
                                  <img
                                    key={photo.id}
                                    src={photo.data}
                                    alt={`Photo ${photo.id}`}
                                    className="w-full h-16 object-cover rounded border"
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
                        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-sm"
                      >
                        <Database className="h-4 w-4" />
                        {isLoading ? 'Registering...' : 'Register Employee'}
                      </Button>
                    </div>
                  )}

                  {activeTab === 'train' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900">Train Recognition Model</h3>
                      
                      {/* Warning Box */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800 mb-1 text-sm">Important</h4>
                            <p className="text-xs text-yellow-700">
                              Training the model may take some time depending on the number of photos. The system will be unavailable during training.
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm">
                        After taking photos, you need to train the model to recognize your face. This process analyzes all the photos and creates a recognition profile for each registered user.
                      </p>

                      <div className="flex justify-end">
                        <Button 
                          onClick={trainModel}
                          disabled={isLoading}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-sm"
                        >
                          <Brain className="h-4 w-4" />
                          {isLoading ? 'Training...' : 'Start Training'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'recognize' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900">Face Recognition</h3>
                      
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Camera className="h-8 w-8 text-purple-600" />
                        </div>
                        
                        <p className="text-gray-700 mb-2 text-sm">
                          Start recognition to automatically check in/out when your face is detected.
                        </p>
                        <p className="text-gray-600 text-xs mb-4">
                          The system will record attendance with timestamp when a registered face is recognized.
                        </p>

                        <div className="flex gap-2 justify-center">
                          <Button 
                            onClick={stopCamera}
                            disabled={!isCameraActive}
                            className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-xs px-3 py-2"
                          >
                            <X className="h-3 w-3" />
                            Stop Recognition
                          </Button>
                          <Button 
                            onClick={() => recognizeFace('check_in')}
                            disabled={isLoading || !isCameraActive}
                            className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-xs px-3 py-2"
                          >
                            <Clock className="h-3 w-3" />
                            Clock In
                          </Button>
                          <Button 
                            onClick={() => recognizeFace('check_out')}
                            disabled={isLoading || !isCameraActive}
                            className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-xs px-3 py-2"
                          >
                            <Clock className="h-3 w-3" />
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
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">RECOGNITION RESULT</h4>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="font-medium text-green-800 text-sm">Face Recognized!</span>
                        </div>
                        <div className="text-xs text-green-700">
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
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">STATISTICS</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Registered Employees:</span>
                        <span className="font-semibold">{registeredEmployees.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Today's Attendance:</span>
                        <span className="font-semibold">{todayAttendance.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Captured Photos:</span>
                        <span className="font-semibold">{capturedPhotos.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Today's Attendance */}
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">TODAY'S ATTENDANCE</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {todayAttendance.length === 0 ? (
                        <p className="text-gray-500 text-xs">No attendance records today</p>
                      ) : (
                        todayAttendance.map((record) => (
                          <div key={record.id} className="p-2 bg-gray-50 rounded text-xs">
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
                      className="w-full mt-2 flex items-center justify-center gap-1 text-xs px-2 py-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Refresh
                    </Button>
                  </div>

                  {/* Registered Employees */}
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">REGISTERED EMPLOYEES</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {registeredEmployees.length === 0 ? (
                        <p className="text-gray-500 text-xs">No employees registered</p>
                      ) : (
                        registeredEmployees.map((employee) => (
                          <div key={employee.employee_code} className="p-2 bg-gray-50 rounded text-xs">
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
                      className="w-full mt-2 flex items-center justify-center gap-1 text-xs px-2 py-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognitionWidget;
