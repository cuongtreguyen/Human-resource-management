import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { PY_API } from '../../services/config';
import { Calendar, Clock, Eye, Search } from 'lucide-react';
import AttendanceDetailsModal from '../../components/attendance/AttendanceDetailsModal';

const AttendanceList = () => {
  const [showAttendanceDetails, setShowAttendanceDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadAttendanceData();
  }, [selectedDate]);

  const getAttendanceStatus = (record) => {
    if (!record.check_in) {
      return { status: 'absent', color: 'bg-red-100 text-red-800', text: 'Vắng mặt' };
    }
    
    if (!record.check_out) {
      return { status: 'working', color: 'bg-blue-100 text-blue-800', text: 'Đang làm việc' };
    }

    const checkInTime = record.check_in;
    const checkOutTime = record.check_out;
    const standardStartTime = '08:00';
    const standardEndTime = '18:00';
    
    const normalizeTime = (timeStr) => {
      const [hour, min] = timeStr.split(':').map(Number);
      return hour * 60 + min;
    };
    
    const checkInMinutes = normalizeTime(checkInTime);
    const checkOutMinutes = normalizeTime(checkOutTime);
    const standardStartMinutes = normalizeTime(standardStartTime);
    const standardEndMinutes = normalizeTime(standardEndTime);
    
    const isEarly = checkInMinutes < standardStartMinutes;
    const isLate = checkInMinutes > standardStartMinutes;
    const isEarlyCheckout = checkOutMinutes < standardEndMinutes;
    const isLateCheckout = checkOutMinutes > standardEndMinutes;
    
    if (isEarly && isLateCheckout) {
      return { status: 'early-late', color: 'bg-cyan-100 text-cyan-800', text: 'Đi sớm & Về muộn' };
    } else if (isEarly && isEarlyCheckout) {
      return { status: 'early-early', color: 'bg-teal-100 text-teal-800', text: 'Đi sớm & Về sớm' };
    } else if (isLate && isEarlyCheckout) {
      return { status: 'late-early', color: 'bg-orange-100 text-orange-800', text: 'Đi trễ & Về sớm' };
    } else if (isLate && isLateCheckout) {
      return { status: 'late-late', color: 'bg-amber-100 text-amber-800', text: 'Đi trễ & Về muộn' };
    } else if (isEarly) {
      return { status: 'early', color: 'bg-emerald-100 text-emerald-800', text: 'Đi sớm' };
    } else if (isLate) {
      return { status: 'late', color: 'bg-yellow-100 text-yellow-800', text: 'Đi trễ' };
    } else if (isEarlyCheckout) {
      return { status: 'early-checkout', color: 'bg-purple-100 text-purple-800', text: 'Về sớm' };
    } else if (isLateCheckout) {
      return { status: 'late-checkout', color: 'bg-indigo-100 text-indigo-800', text: 'Về muộn' };
    } else {
      return { status: 'ontime', color: 'bg-green-100 text-green-800', text: 'Đúng giờ' };
    }
  };

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading attendance for date:', selectedDate);
      
      const flaskResponse = await fetch(`${PY_API}/attendance/daily?date=${selectedDate}`);
      
      if (flaskResponse.ok) {
        const flaskData = await flaskResponse.json();
        console.log('Flask API data:', flaskData);
        setAttendanceData(flaskData || []);
      } else {
        console.error('Flask API error:', flaskResponse.status, flaskResponse.statusText);
        setError('Không thể kết nối đến hệ thống face recognition');
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
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Employee Attendance
              </h1>
            </div>
            
            {/* Date Selector */}
            <Card className="mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chọn ngày để xem dữ liệu chấm công</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      loadAttendanceData();
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
            <Card title="Attendance Record">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="Search by name..."
                    icon={<Search className="h-4 w-4" />}
                    className="flex-1"
                  />
                  <Button 
                    variant="primary" 
                    icon={<Clock className="h-4 w-4" />}
                    onClick={loadAttendanceData}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Refresh'}
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
                    attendanceData.map((record) => (
                      <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {record.name ? record.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{record.name || 'Unknown'}</div>
                              <div className="text-sm text-gray-500">{record.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-sm text-gray-500">Check In</div>
                              <div className="font-medium">{record.check_in || '-'}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-500">Check Out</div>
                              <div className="font-medium">{record.check_out || '-'}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-500">Hours Worked</div>
                              <div className="font-medium text-blue-600">
                                {record.check_in && record.check_out ? 
                                  (() => {
                                    const [inHour, inMin] = record.check_in.split(':').map(Number);
                                    const [outHour, outMin] = record.check_out.split(':').map(Number);
                                    const inMinutes = inHour * 60 + inMin;
                                    const outMinutes = outHour * 60 + outMin;
                                    const totalMinutes = outMinutes - inMinutes;
                                    const hours = Math.floor(totalMinutes / 60);
                                    const minutes = totalMinutes % 60;
                                    return `${hours}h ${minutes}m`;
                                  })() : '-'
                                }
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAttendanceStatus(record).color}`}>
                              {getAttendanceStatus(record).text}
                            </span>
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => handleOpenDetails(record)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
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
