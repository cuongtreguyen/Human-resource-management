import React, { useState, useRef } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Camera, Upload, Users, CheckCircle, AlertCircle } from 'lucide-react';

const FaceRecognition = () => {
  const [recognizedFaces, setRecognizedFaces] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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

      // Simulate face recognition
      const mockRecognition = {
        id: Date.now(),
        name: 'John Doe',
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        timestamp: new Date().toISOString(),
        department: 'Development'
      };

      setRecognizedFaces(prev => [mockRecognition, ...prev]);
    }
  };

  const sampleData = [
    { id: 1, name: 'John Doe', confidence: 98, timestamp: '2024-01-10T09:00:00', department: 'Development' },
    { id: 2, name: 'Jane Smith', confidence: 95, timestamp: '2024-01-10T09:15:00', department: 'Marketing' },
    { id: 3, name: 'Mike Johnson', confidence: 87, timestamp: '2024-01-10T09:30:00', department: 'HR' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Face Recognition System
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Camera Controls */}
              <Card title="Camera Control" subtitle="Capture and recognize faces">
                <div className="space-y-6">
                  {/* Video Feed */}
                  <div className="relative">
                    <video
                      ref={videoRef}
                      className="w-full max-w-lg mx-auto bg-gray-900 rounded-lg"
                      autoPlay
                      muted
                      style={{ display: isCameraActive ? 'block' : 'none' }}
                    />
                    <canvas
                      ref={canvasRef}
                      className="w-full max-w-lg mx-auto rounded-lg"
                      style={{ display: 'none' }}
                    />
                    {!isCameraActive && (
                      <div className="w-full max-w-lg mx-auto h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {!isCameraActive ? (
                      <Button 
                        onClick={startCamera}
                        className="flex items-center gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        Start Camera
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={capturePhoto}
                          variant="primary"
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Capture Face
                        </Button>
                        <Button 
                          onClick={stopCamera}
                          variant="secondary"
                        >
                          Stop Camera
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>

              {/* Recognition Results */}
              <Card title="Recent Recognitions" subtitle="Latest face recognition results">
                <div className="space-y-4">
                  {recognizedFaces.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No faces recognized yet</p>
                      <p className="text-sm">Start the camera and capture faces to see results</p>
                    </div>
                  ) : (
                    recognizedFaces.map((face) => (
                      <div key={face.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {face.confidence >= 90 ? (
                              <CheckCircle className="h-8 w-8 text-green-500" />
                            ) : (
                              <AlertCircle className="h-8 w-8 text-yellow-500" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{face.name}</h3>
                            <p className="text-sm text-gray-500">{face.department}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(face.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            face.confidence >= 90 
                              ? 'bg-green-100 text-green-800' 
                              : face.confidence >= 80 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {face.confidence}%
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* Sample Data */}
            <Card title="Today's Attendance" subtitle="Recent attendance records" className="mt-8">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sampleData.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.confidence >= 90 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.confidence}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FaceRecognition;
