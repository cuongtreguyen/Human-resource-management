import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Camera, Upload, Users, CheckCircle, AlertCircle, X, User, Brain, Eye, Clock, AlertTriangle } from 'lucide-react';

const FaceRecognition = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [recognizedFaces, setRecognizedFaces] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [systemStatus, setSystemStatus] = useState('disconnected');
  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Check system status
  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        // Check Python API
        const pythonResponse = await fetch('http://localhost:5000/api/status');
        if (pythonResponse.ok) {
          const pythonData = await pythonResponse.json();
          console.log('Python API Status:', pythonData);
          setSystemStatus(pythonData.status === 'idle' || pythonData.status === 'success' ? 'connected' : 'running');
        } else {
          console.log('Python API not responding');
          setSystemStatus('disconnected');
        }
      } catch (error) {
        console.log('Python API Error:', error);
        setSystemStatus('disconnected');
      }
    };
    
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
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
        userId: userId,
        name: fullName,
        timestamp: new Date().toISOString()
      };

      setCapturedPhotos(prev => [...prev, newPhoto]);
    }
  };

  const trainModel = async () => {
    if (!userId || !fullName) {
      alert('Please enter User ID and Full Name first');
      return;
    }

    setIsTraining(true);
    try {
      // Use Python API to take photos
      const response = await fetch('http://localhost:5000/api/take-photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          name: fullName
        })
      });

      const result = await response.json();

      if (result.status === 'success') {
        alert(`Photo capture started for ${fullName}! The system will automatically take 50 photos.`);
        // Clear form after starting photo capture
        setUserId('');
        setFullName('');
        setCapturedPhotos([]);
      } else {
        alert(`Photo capture failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Photo capture error:', error);
      alert('Photo capture failed. Please check if the Python API is running.');
    } finally {
      setIsTraining(false);
    }
  };

  const checkIn = async () => {
    setIsRecognizing(true);
    try {
      // Use Python check-in API
      const response = await fetch('http://localhost:5000/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (result.status === 'success') {
        alert('Check-in started! Please look at the camera.');
      } else {
        alert(`Check-in failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Check-in error:', error);
      alert('Check-in failed. Please check if the Python API is running.');
    } finally {
      setIsRecognizing(false);
    }
  };

  const trainModelAfterPhotos = async () => {
    setIsTraining(true);
    try {
      // Train the model after photos are taken
      const response = await fetch('http://localhost:5000/api/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (result.status === 'success') {
        alert('Model training started! This will process all captured photos.');
      } else {
        alert(`Training failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Training error:', error);
      alert('Training failed. Please check if the Python API is running.');
    } finally {
      setIsTraining(false);
    }
  };

  // Handle keyboard events for photo capture
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 's' && isCameraActive && activeTab === 'register') {
        capturePhoto();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isCameraActive, activeTab]);


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
                Biometric attendance management
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel */}
              <div className="space-y-6">
                {/* Face Recognition Card */}
                <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Face Recognition</h3>
                    <p className="text-purple-100">Attendance System</p>
                  </div>
                </Card>

                {/* System Status */}
                <Card title="SYSTEM STATUS">
                  <div className={`p-4 rounded-lg ${
                    systemStatus === 'connected' 
                      ? 'bg-green-50 border border-green-200' 
                      : systemStatus === 'running'
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center">
                      {systemStatus === 'connected' ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : systemStatus === 'running' ? (
                        <Brain className="h-5 w-5 text-blue-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span className={`font-medium ${
                        systemStatus === 'connected' ? 'text-green-800' : 
                        systemStatus === 'running' ? 'text-blue-800' : 'text-red-800'
                      }`}>
                        {systemStatus === 'connected' 
                          ? 'Python API Connected - Ready' 
                          : systemStatus === 'running'
                          ? 'Python API Running - Processing...'
                          : 'Could not connect to Python API on port 5000'
                        }
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Instructions */}
                <Card title="INSTRUCTIONS">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</span>
                      <p className="text-gray-700">Register with your ID and name</p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</span>
                      <p className="text-gray-700">Take photos by pressing 's' key when camera is active</p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</span>
                      <p className="text-gray-700">Train the model with your photos</p>
                    </div>
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">4</span>
                      <p className="text-gray-700">Start recognition to check in/out</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Panel */}
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

                  {/* Tab Content */}
                  {activeTab === 'register' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Register New User</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              User ID
                            </label>
                            <input
                              type="text"
                              placeholder="Enter a number between 1-10000"
                              value={userId}
                              onChange={(e) => setUserId(e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              placeholder="Enter your name if you're a new user"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <p className="text-purple-800 text-sm">
                          When the camera starts, press the s key to capture a photo. Take multiple photos from different angles for better recognition.
                        </p>
                      </div>

                      {/* Camera Controls */}
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => setIsCameraActive(true)}
                          disabled={!userId || !fullName}
                          className="flex items-center gap-2"
                        >
                          <Camera className="h-4 w-4" />
                          Start Camera
                        </Button>
                        <Button 
                          onClick={() => setIsCameraActive(false)}
                          disabled={!isCameraActive}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                        >
                          <X className="h-4 w-4" />
                          Stop Camera
                        </Button>
                      </div>

                      {/* Status Display */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <Brain className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-blue-800 font-medium">
                            {systemStatus === 'running' ? 'System is capturing photos...' : 'Ready to capture photos'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'train' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Train Recognition Model</h3>
                        
                        {/* Warning Box */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                            <span className="text-yellow-800 font-medium">
                              Important: Training the model may take some time depending on the number of photos. The system will be unavailable during training.
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">
                          After taking photos, you need to train the model to recognize your face. This process analyzes all the photos and creates a recognition profile for each registered user.
                        </p>

                        <Button 
                          onClick={trainModelAfterPhotos}
                          disabled={isTraining}
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <Brain className="h-4 w-4" />
                          {isTraining ? 'Training Model...' : 'Start Training'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'recognize' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Face Recognition</h3>
                        
                        {/* Info Box */}
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center">
                            <CheckCircle className="h-8 w-8 text-purple-600 mr-3" />
                            <span className="text-purple-800">
                              Start recognition to automatically check in/out when your face is detected. The system will record attendance with timestamp when a registered face is recognized.
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            onClick={() => {/* Stop recognition */}}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                          >
                            <X className="h-4 w-4" />
                            Stop Recognition
                          </Button>
                          <Button 
                            onClick={checkIn}
                            disabled={isRecognizing}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                          >
                            <Clock className="h-4 w-4" />
                            Clock In
                          </Button>
                          <Button 
                            onClick={checkIn}
                            disabled={isRecognizing}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                          >
                            <Clock className="h-4 w-4" />
                            Clock Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

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
