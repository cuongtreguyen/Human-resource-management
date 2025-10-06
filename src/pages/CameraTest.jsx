import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Camera, X, CheckCircle, AlertCircle } from 'lucide-react';

const CameraTest = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      setError(null);
      console.log('Requesting camera access...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      console.log('Camera stream obtained:', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        console.log('Camera started successfully');
      }
    } catch (error) {
      console.error('Camera error:', error);
      setError(`Camera error: ${error.message}`);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
      console.log('Camera stopped');
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
        timestamp: new Date().toLocaleString()
      };

      setCapturedPhotos(prev => [...prev, newPhoto]);
      console.log('Photo captured:', newPhoto);
    }
  };

  // Keyboard event listener
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 's' && isCameraActive) {
        capturePhoto();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isCameraActive]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg mb-6">
            <h1 className="text-3xl font-bold">Camera Test</h1>
            <p className="text-blue-100 mt-1">Test camera functionality</p>
          </div>

          {/* Error Display */}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </Card>
          )}

          {/* Camera Controls */}
          <Card title="Camera Controls" className="mb-6">
            <div className="flex gap-4 mb-4">
              <Button 
                onClick={startCamera}
                disabled={isCameraActive}
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
              <Button 
                onClick={capturePhoto}
                disabled={!isCameraActive}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                Capture Photo
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>• Click "Start Camera" to begin</p>
              <p>• Press 'S' key or click "Capture Photo" to take photos</p>
              <p>• Click "Stop Camera" when done</p>
            </div>
          </Card>

          {/* Camera Feed */}
          <Card title="Camera Feed">
            <div className="space-y-4">
              {isCameraActive ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 bg-gray-900 rounded-lg object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    Camera Active - Press 'S' to capture
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Camera className="h-12 w-12 mx-auto mb-2" />
                    <p>Camera not started</p>
                    <p className="text-sm">Click "Start Camera" to begin</p>
                  </div>
                </div>
              )}
              
              {/* Hidden canvas for photo capture */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </Card>

          {/* Captured Photos */}
          {capturedPhotos.length > 0 && (
            <Card title={`Captured Photos (${capturedPhotos.length})`} className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {capturedPhotos.map((photo) => (
                  <div key={photo.id} className="space-y-2">
                    <img
                      src={photo.data}
                      alt={`Photo ${photo.id}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <p className="text-xs text-gray-500 text-center">
                      {photo.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Debug Info */}
          <Card title="Debug Information" className="mt-6">
            <div className="space-y-2 text-sm">
              <p><strong>Camera Status:</strong> {isCameraActive ? 'Active' : 'Inactive'}</p>
              <p><strong>Photos Captured:</strong> {capturedPhotos.length}</p>
              <p><strong>Browser:</strong> {navigator.userAgent}</p>
              <p><strong>Media Devices:</strong> {navigator.mediaDevices ? 'Available' : 'Not Available'}</p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CameraTest;


