import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { PY_API } from '../../services/config';
import attendanceApi from '../../services/attendanceApi';
import { Calendar, Clock, Eye, Search, Save, Edit2 } from 'lucide-react';
import AttendanceDetailsModal from '../../components/attendance/AttendanceDetailsModal';
import { getRole } from '../../utils/auth';

// Danh sách các trạng thái có thể chọn
const STATUS_OPTIONS = [
  { value: 'working', label: 'Đang làm', color: 'bg-blue-100 text-blue-800' },
  { value: 'done', label: 'Tan ca', color: 'bg-green-100 text-green-800' },
  { value: 'late', label: 'Đi muộn', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'early_leave', label: 'Về sớm', color: 'bg-orange-100 text-orange-800' },
  { value: 'absent', label: 'Vắng mặt', color: 'bg-red-100 text-red-800' },
  { value: 'leave', label: 'Nghỉ phép', color: 'bg-purple-100 text-purple-800' },
];

const AttendanceList = () => {
  const userRole = getRole();

  // Màu sắc theo role
  const getBannerColor = () => {
    switch (userRole) {
      case 'admin':
        return 'from-blue-500 to-blue-600';
      case 'manager':
        return 'from-purple-600 to-purple-700';
      case 'accountant':
        return 'from-emerald-600 to-emerald-700';
      default:
        return 'from-orange-500 to-orange-600';
    }
  };

  const getSubtitleColor = () => {
    switch (userRole) {
      case 'admin':
        return 'text-blue-100';
      case 'manager':
        return 'text-purple-100';
      case 'accountant':
        return 'text-emerald-100';
      default:
        return 'text-orange-100';
    }
  };
  const [showAttendanceDetails, setShowAttendanceDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStatus, setEditingStatus] = useState({}); // Track status being edited: { recordId: statusValue }
  const [editingRowId, setEditingRowId] = useState(null); // Which row is being edited
  const [selectedDate, setSelectedDate] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = window.sessionStorage.getItem('adminAttendanceDate');
      if (stored) return stored;
    }
    return new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    loadAttendanceData();
  }, [selectedDate]);

  // Xác định ca làm việc dựa vào giờ vào
  const getShift = (checkInTime) => {
    if (!checkInTime) return { text: '-', color: 'text-gray-400' };
    const [hour] = checkInTime.split(':').map(Number);
    if (hour < 12) {
      return { text: 'Ca sáng', color: 'text-blue-600' };
    } else if (hour < 18) {
      return { text: 'Ca chiều', color: 'text-orange-600' };
    } else {
      return { text: 'Ca tối', color: 'text-purple-600' };
    }
  };

  // Trạng thái chấm công: Đang làm, Tan ca, OT
  const getAttendanceStatus = (record) => {
    if (!record.check_in) {
      return { status: 'absent', color: 'bg-red-100 text-red-800', text: 'Vắng mặt' };
    }

    // Chưa check out -> Đang làm
    if (!record.check_out) {
      return { status: 'working', color: 'bg-blue-100 text-blue-800', text: 'Đang làm' };
    }

    // Kiểm tra OT (nếu check_out sau 18:00)
    const [outHour] = record.check_out.split(':').map(Number);
    if (outHour >= 18) {
      return { status: 'ot', color: 'bg-purple-100 text-purple-800', text: 'OT' };
    }

    // Đã check out -> Tan ca
    return { status: 'done', color: 'bg-green-100 text-green-800', text: 'Tan ca' };
  };

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading attendance for date:', selectedDate);

      // Try Flask API first (Python face recognition server)
      try {
        const flaskResponse = await fetch(`${PY_API}/api/attendance/daily?date=${selectedDate}`);
        if (flaskResponse.ok) {
          const flaskData = await flaskResponse.json();
          console.log('Flask API data:', flaskData);
          setAttendanceData(flaskData || []);
          return;
        }
      } catch (flaskErr) {
        console.log('Flask API not available, trying Java API:', flaskErr);
      }

      // Fallback to Java API (attendanceApi service)
      try {
        const javaData = await attendanceApi.getDailyAttendance(selectedDate);
        console.log('Java API data:', javaData);
        const dataArray = Array.isArray(javaData) ? javaData : javaData.data || [];
        setAttendanceData(dataArray);
      } catch (javaErr) {
        console.error('Java API error:', javaErr);
        setError('Không thể tải dữ liệu chấm công');
        setAttendanceData([]);
      }
    } catch (err) {
      console.error('Attendance data error:', err);
      setError('Lỗi khi tải dữ liệu chấm công');
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowAttendanceDetails(true);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-fade-in">
            <div className={`bg-gradient-to-r ${getBannerColor()} text-white p-6 rounded-xl shadow-lg mb-6`}>
              <h1 className="text-3xl font-bold">Chấm công nhân viên</h1>
              <p className={`${getSubtitleColor()} mt-1`}>Theo dõi và quản lý chấm công</p>
            </div>

            {/* Date Selector */}
            <Card className="mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chọn ngày để xem dữ liệu chấm công</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(value) => {
                      setSelectedDate(value);
                      if (typeof window !== 'undefined') {
                        window.sessionStorage.setItem('adminAttendanceDate', value);
                      }
                    }}
                    className="w-full"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <div>Ngày đang xem: <span className="font-medium">{selectedDate}</span></div>
                  <div>Số bản ghi: <span className="font-medium">{attendanceData.length}</span></div>
                </div>
              </div>
            </Card>

            {/* Error Message */}
            {error && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <div className="flex items-center gap-3 text-red-700">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600">!</span>
                  </div>
                  <div>
                    <div className="font-medium">Lỗi kết nối</div>
                    <div className="text-sm">{error}</div>
                  </div>
                </div>
              </Card>
            )}

            {/* Attendance Record */}
            <Card title="Bảng chấm công">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="Tìm theo tên..."
                    icon={<Search className="h-4 w-4" />}
                    className="flex-1"
                  />
                  <Button
                    variant="primary"
                    icon={<Clock className="h-4 w-4" />}
                    onClick={loadAttendanceData}
                    disabled={loading}
                  >
                    {loading ? 'Đang tải...' : 'Làm mới'}
                  </Button>
                </div>

                {/* Attendance records */}
                <div className="space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang tải dữ liệu...</span>
                      </div>
                    </div>
                  ) : attendanceData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">HỌ TÊN</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">PHÒNG BAN</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-700">CA LÀM</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-700">GIỜ VÀO</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-700">GIỜ RA</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-700">TRẠNG THÁI</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-700">THAO TÁC</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceData.map((record, index) => {
                            const shift = getShift(record.check_in);
                            const status = getAttendanceStatus(record);
                            return (
                              <tr key={record.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <span className="text-sm font-mono text-gray-600">
                                    {record.employee_id || record.id || `NV${String(index + 1).padStart(3, '0')}`}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                      {record.name ? record.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div className="font-medium text-gray-900">{record.name || 'Không xác định'}</div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-sm text-gray-600">{record.department || 'IT'}</span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className={`text-sm font-medium ${shift.color}`}>{shift.text}</span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className="font-medium text-gray-900">{record.check_in || '-'}</span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className="font-medium text-gray-900">{record.check_out || '-'}</span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.color}`}>
                                    {status.text}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleOpenDetails(record)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Chưa có dữ liệu chấm công cho ngày {selectedDate}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AttendanceDetailsModal
        isOpen={showAttendanceDetails}
        onClose={() => setShowAttendanceDetails(false)}
        selectedRecord={selectedEmployee}
      />
    </Layout>
  );
};

export default AttendanceList;
