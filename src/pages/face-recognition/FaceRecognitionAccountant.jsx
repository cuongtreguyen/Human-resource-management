import React, { useState, useEffect } from 'react';
import { Camera, Eye, CheckCircle, Users, Clock, Video } from 'lucide-react';
import faceRecognitionPortalApi from '../../services/faceRecognitionPortalApi';

const FaceRecognitionAccountant = () => {
    const [activeTab, setActiveTab] = useState('recognize'); // Default to recognize, removed register
    const [systemStatus, setSystemStatus] = useState('connected');
    const [systemMessage, setSystemMessage] = useState('Hệ thống hoạt động');
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

    const handleStartRecognition = async (type = 'check_in') => {
        setIsLoading(true);
        try {
            console.log('Checking model status before recognition...');

            const data = await faceRecognitionPortalApi.startRecognition(type);
            if (data.status === 'success') {
                alert('Bắt đầu nhận diện thành công! Hệ thống sẽ tự động chấm công khi phát hiện khuôn mặt.');
                setRecognitionActive(true);
                setCameraActive(true);
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
            {/* Header with Emerald Gradient */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-2xl shadow-lg mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold">Face Recognition System</h1>
                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        <div className={`w-3 h-3 rounded-full ${systemStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className="text-sm font-medium">{systemMessage}</span>
                    </div>
                </div>
                <p className="text-emerald-100">Quản lý nhận diện khuôn mặt và chấm công (Accountant Portal)</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex">
                        {[
                            { id: 'recognize', label: 'Nhận diện', icon: Eye },
                            { id: 'attendance', label: 'Chấm công', icon: CheckCircle },
                            { id: 'employees', label: 'Danh sách nhân viên', icon: Users },
                            { id: 'reports', label: 'Báo cáo hôm nay', icon: Clock }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-4 px-4 text-center font-medium text-sm flex items-center justify-center space-x-2 transition-colors ${activeTab === tab.id
                                    ? 'border-b-2 border-emerald-600 text-emerald-600 bg-emerald-50'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-emerald-600' : 'text-gray-400'}`} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Recognize Tab */}
                    {activeTab === 'recognize' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Camera Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Camera className="text-emerald-600" size={20} />
                                    Camera nhận diện
                                </h3>
                                <div className="relative bg-gray-100 rounded-xl overflow-hidden h-80 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    {!cameraActive ? (
                                        <div className="text-center p-6">
                                            <div className="bg-gray-200 p-4 rounded-full inline-block mb-4">
                                                <Camera className="h-12 w-12 text-gray-400" />
                                            </div>
                                            <p className="text-gray-600 font-medium">Camera chưa được khởi động</p>
                                            <p className="text-gray-400 text-sm mt-1">Nhấn nút bên dưới để bắt đầu</p>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                                            <div className="text-center">
                                                <Eye className="h-16 w-16 text-emerald-500 mx-auto mb-4 animate-pulse" />
                                                <p className="text-white font-medium text-lg">Đang nhận diện khuôn mặt...</p>
                                                <div className="mt-4 flex justify-center space-x-1">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    {!cameraActive ? (
                                        <button
                                            onClick={() => handleStartRecognition('check_in')}
                                            disabled={isLoading}
                                            className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm transition-all hover:shadow-md"
                                        >
                                            <Eye className="h-5 w-5" />
                                            <span>Bắt đầu nhận diện</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleStopProcess}
                                            disabled={isLoading}
                                            className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm transition-all hover:shadow-md"
                                        >
                                            <Video className="h-5 w-5" />
                                            <span>Dừng camera</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Recognition Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <CheckCircle className="text-emerald-600" size={20} />
                                    Kết quả nhận diện
                                </h3>

                                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 h-80 overflow-y-auto">
                                    <div className="text-center py-8">
                                        <p className="text-emerald-800 font-medium mb-2">Hệ thống đang chờ dữ liệu...</p>
                                        <p className="text-emerald-600 text-sm">
                                            Thông tin nhân viên sẽ hiển thị tại đây khi được nhận diện thành công.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Attendance Tab */}
                    {activeTab === 'attendance' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Camera Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Camera className="text-emerald-600" size={20} />
                                    Camera chấm công
                                </h3>
                                <div className="relative bg-gray-100 rounded-xl overflow-hidden h-80 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    {!cameraActive ? (
                                        <div className="text-center p-6">
                                            <div className="bg-gray-200 p-4 rounded-full inline-block mb-4">
                                                <Camera className="h-12 w-12 text-gray-400" />
                                            </div>
                                            <p className="text-gray-600 font-medium">Camera chưa được khởi động</p>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                                            <div className="text-center">
                                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4 animate-pulse" />
                                                <p className="text-white font-medium text-lg">Sẵn sàng chấm công</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => handleStartRecognition('check_in')}
                                        disabled={isLoading}
                                        className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm transition-all hover:shadow-md"
                                    >
                                        <CheckCircle className="h-5 w-5" />
                                        <span>Check In</span>
                                    </button>

                                    <button
                                        onClick={() => handleStartRecognition('check_out')}
                                        disabled={isLoading}
                                        className="flex-1 bg-orange-500 text-white px-4 py-3 rounded-xl hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm transition-all hover:shadow-md"
                                    >
                                        <Clock className="h-5 w-5" />
                                        <span>Check Out</span>
                                    </button>
                                </div>
                            </div>

                            {/* Instructions Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Clock className="text-emerald-600" size={20} />
                                    Hướng dẫn chấm công
                                </h3>

                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                    <h4 className="font-semibold text-blue-900 mb-4 text-lg">Lưu ý quan trọng:</h4>
                                    <ul className="space-y-3">
                                        {[
                                            'Đảm bảo khuôn mặt nằm chính giữa khung hình camera',
                                            'Giữ khoảng cách 50-70cm so với camera',
                                            'Không đeo khẩu trang hoặc kính râm quá tối màu',
                                            'Đảm bảo điều kiện ánh sáng tốt, không bị ngược sáng',
                                            'Hệ thống sẽ tự động xác nhận khi nhận diện thành công'
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-blue-800">
                                                <div className="min-w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-xs font-bold mt-0.5">
                                                    {idx + 1}
                                                </div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
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
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">Tổng: 3 nhân viên</span>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {['Mã nhân viên', 'Họ và tên', 'Phòng ban', 'Chức vụ', 'Trạng thái'].map((header) => (
                                                <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {[
                                            { id: 'EMP001', name: 'Nguyễn Văn A', dept: 'IT', role: 'Developer' },
                                            { id: 'EMP002', name: 'Trần Thị B', dept: 'HR', role: 'Manager' },
                                            { id: 'EMP003', name: 'Lê Văn C', dept: 'Finance', role: 'Accountant' }
                                        ].map((emp, idx) => (
                                            <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-900">{emp.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.dept}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.role}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
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
                                <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                                    <Clock size={16} />
                                    <span className="text-sm font-medium">{new Date().toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {['Mã nhân viên', 'Họ và tên', 'Check-in', 'Check-out', 'Trạng thái'].map((header) => (
                                                <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-900">EMP001</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Nguyễn Văn A</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">08:30</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">17:30</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                    Có mặt
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-900">EMP002</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Trần Thị B</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">09:00</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
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
        </div>
    );
};

export default FaceRecognitionAccountant;
