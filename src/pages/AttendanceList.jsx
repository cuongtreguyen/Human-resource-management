import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { PY_API } from '../services/config';
import { Calendar, Clock, TrendingUp, Eye, Search, ChevronLeft, ChevronRight, Edit, Download, Save, X } from 'lucide-react';

// Modal Attendance Details Component
const AttendanceDetailsModal = ({ isOpen, onClose, selectedRecord }) => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({ check_in: '', check_out: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && selectedRecord) {
      loadAttendanceHistory();
    }
  }, [isOpen, selectedRecord]);

  const loadAttendanceHistory = async () => {
    if (!selectedRecord) return;
    
    setLoading(true);
    try {
      // Lấy dữ liệu attendance của nhân viên trong 30 ngày gần nhất
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const response = await fetch(`${PY_API}/attendance/range?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`);
      
      if (response.ok) {
        const allRecords = await response.json();
        // Lọc dữ liệu của nhân viên được chọn
        const employeeRecords = allRecords.filter(record => record.id === selectedRecord.id);
        setAttendanceHistory(employeeRecords);
      }
    } catch (error) {
      console.error('Failed to load attendance history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setEditForm({
      check_in: record.check_in || '',
      check_out: record.check_out || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setEditForm({ check_in: '', check_out: '' });
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;
    
    setSaving(true);
    try {
      // TODO: Implement API call to update attendance record
      console.log('Saving attendance record:', editingRecord, editForm);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setAttendanceHistory(prev => 
        prev.map(record => 
          record.date === editingRecord.date && record.id === editingRecord.id
            ? { ...record, check_in: editForm.check_in, check_out: editForm.check_out }
            : record
        )
      );
      
      setEditingRecord(null);
      setEditForm({ check_in: '', check_out: '' });
      alert('Cập nhật chấm công thành công!');
    } catch (error) {
      console.error('Failed to save attendance record:', error);
      alert('Cập nhật chấm công thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    if (!attendanceHistory.length) {
      alert('Không có dữ liệu để xuất');
      return;
    }

    // Create CSV content
    const headers = ['Ngày', 'Tên nhân viên', 'Check In', 'Check Out', 'Giờ làm việc', 'Trạng thái'];
    const csvContent = [
      headers.join(','),
      ...attendanceHistory.map(record => {
        const hoursWorked = calculateHoursWorked(record.check_in, record.check_out);
        const status = getAttendanceStatus(record).text;
        return [
          record.date,
          record.name || 'Unknown',
          record.check_in || '',
          record.check_out || '',
          hoursWorked,
          status
        ].join(',');
      })
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_${selectedRecord?.name || 'employee'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const getAttendanceStatus = (record) => {
    if (!record.check_in) {
      return { status: 'absent', color: 'bg-red-100 text-red-800', text: 'Vắng mặt' };
    }
    
    if (!record.check_out) {
      return { status: 'working', color: 'bg-blue-100 text-blue-800', text: 'Đang làm việc' };
    }

    // Phân tích giờ làm việc
    const checkInTime = record.check_in;
    const checkOutTime = record.check_out;
    
    // Chuẩn hóa thời gian check-in (8:00 AM)
    const standardStartTime = '08:00';
    const standardEndTime = '18:00';
    
    // Chuẩn hóa định dạng thời gian để so sánh chính xác
    const normalizeTime = (timeStr) => {
      const [hour, min, sec] = timeStr.split(':').map(Number);
      return hour * 60 + min; // Chuyển thành phút để so sánh
    };
    
    const checkInMinutes = normalizeTime(checkInTime);
    const checkOutMinutes = normalizeTime(checkOutTime);
    const standardStartMinutes = normalizeTime(standardStartTime); // 480 phút (8:00)
    const standardEndMinutes = normalizeTime(standardEndTime);     // 1080 phút (18:00)
    
    // So sánh thời gian
    const isEarly = checkInMinutes < standardStartMinutes;  // Đi sớm
    const isLate = checkInMinutes > standardStartMinutes;   // Đi trễ
    const isEarlyCheckout = checkOutMinutes < standardEndMinutes;  // Về sớm
    const isLateCheckout = checkOutMinutes > standardEndMinutes;   // Về muộn
    
    // Phân loại theo 3 trường hợp chính
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

  const getStatusColor = (record) => {
    return getAttendanceStatus(record).color;
  };

  const getStatusText = (record) => {
    return getAttendanceStatus(record).text;
  };

  const calculateHoursWorked = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '0';
    
    const [inHour, inMin] = checkIn.split(':').map(Number);
    const [outHour, outMin] = checkOut.split(':').map(Number);
    
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;
    
    const totalMinutes = outMinutes - inMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  const calculateTimeDeviation = (record) => {
    if (!record.check_in || !record.check_out) return null;
    
    const checkInTime = record.check_in;
    const checkOutTime = record.check_out;
    const standardStartTime = '08:00';
    const standardEndTime = '18:00';
    
    // Tính phút trễ/đi sớm
    const [inHour, inMin] = checkInTime.split(':').map(Number);
    const [stdHour, stdMin] = standardStartTime.split(':').map(Number);
    const inMinutes = inHour * 60 + inMin;
    const stdMinutes = stdHour * 60 + stdMin;
    const lateMinutes = Math.max(0, inMinutes - stdMinutes);  // Đi trễ
    const earlyMinutes = Math.max(0, stdMinutes - inMinutes); // Đi sớm
    
    // Tính phút về sớm/về muộn
    const [outHour, outMin] = checkOutTime.split(':').map(Number);
    const [endHour, endMin] = standardEndTime.split(':').map(Number);
    const outMinutes = outHour * 60 + outMin;
    const endMinutes = endHour * 60 + endMin;
    const earlyCheckoutMinutes = Math.max(0, endMinutes - outMinutes); // Về sớm
    const lateCheckoutMinutes = Math.max(0, outMinutes - endMinutes);   // Về muộn
    
    return {
      lateMinutes,
      earlyMinutes,
      earlyCheckoutMinutes,
      lateCheckoutMinutes
    };
  };

  const getTimeBarWidth = (record) => {
    if (!record.check_in || !record.check_out) return 0;
    
    const [inHour, inMin] = record.check_in.split(':').map(Number);
    const [outHour, outMin] = record.check_out.split(':').map(Number);
    
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;
    
    const totalMinutes = outMinutes - inMinutes;
    const hours = totalMinutes / 60;
    
    // Scale to percentage (assume 8 hours = 100%)
    return Math.min((hours / 8) * 100, 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Attendance Details - {selectedRecord?.name || 'Unknown Employee'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Employee ID: {selectedRecord?.id || 'N/A'} | 
              Last 30 days attendance history
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleExportData}
              variant="primary" 
              className="px-3 py-1 text-sm"
              icon={<Download className="h-4 w-4" />}
            >
              Export
            </Button>
            <Button 
              onClick={onClose} 
              variant="secondary" 
              className="px-3 py-1 text-sm"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading attendance history...</span>
              </div>
            </div>
          ) : attendanceHistory.length > 0 ? (
            attendanceHistory.map((record, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 bg-white">
              {/* Date header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{record.date}</h3>
                  <div className="text-sm text-gray-500 mt-1">Ngày làm việc</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(record)}`}>
                    {getStatusText(record)}
                  </span>
                  {!editingRecord && (
                    <Button
                      onClick={() => handleEditRecord(record)}
                      variant="secondary"
                      size="sm"
                      icon={<Edit className="h-4 w-4" />}
                      title="Chỉnh sửa"
                    />
                  )}
                </div>
              </div>

              {/* Time bar */}
              <div className="mb-4">
                {editingRecord && editingRecord.date === record.date ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Check In</label>
                        <Input
                          type="time"
                          value={editForm.check_in}
                          onChange={(e) => setEditForm(prev => ({ ...prev, check_in: e.target.value }))}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Check Out</label>
                        <Input
                          type="time"
                          value={editForm.check_out}
                          onChange={(e) => setEditForm(prev => ({ ...prev, check_out: e.target.value }))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleSaveEdit}
                        variant="primary"
                        size="sm"
                        icon={<Save className="h-4 w-4" />}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="secondary"
                        size="sm"
                        icon={<X className="h-4 w-4" />}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-700">Check In</div>
                      <div className="text-lg font-semibold text-gray-900">{record.check_in || 'Not checked in'}</div>
                      {record.check_in && (() => {
                        const deviation = calculateTimeDeviation(record);
                        if (deviation) {
                          if (deviation.lateMinutes > 0) {
                            return <div className="text-sm text-yellow-600 font-medium">Trễ {deviation.lateMinutes} phút</div>;
                          } else if (deviation.earlyMinutes > 0) {
                            return <div className="text-sm text-emerald-600 font-medium">Đi sớm {deviation.earlyMinutes} phút</div>;
                          }
                        }
                        return null;
                      })()}
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-700">Check Out</div>
                      <div className="text-lg font-semibold text-gray-900">{record.check_out || 'Still working'}</div>
                      {record.check_out && (() => {
                        const deviation = calculateTimeDeviation(record);
                        if (deviation) {
                          if (deviation.earlyCheckoutMinutes > 0) {
                            return <div className="text-sm text-purple-600 font-medium">Về sớm {deviation.earlyCheckoutMinutes} phút</div>;
                          } else if (deviation.lateCheckoutMinutes > 0) {
                            return <div className="text-sm text-indigo-600 font-medium">Về muộn {deviation.lateCheckoutMinutes} phút</div>;
                          }
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                )}
                {record.check_in && record.check_out && (
                  <div className="space-y-3">
                <div className="relative">
                      <div className="w-full h-10 bg-gray-200 rounded-lg overflow-hidden shadow-inner">
                    <div 
                          className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-lg transition-all duration-300 shadow-sm"
                          style={{ width: `${getTimeBarWidth(record)}%` }}
                    />
                  </div>
                  {/* Time scale */}
                      <div className="absolute top-12 left-0 right-0 text-xs text-gray-500 flex justify-between font-medium">
                    <span>08:00</span>
                    <span>10:00</span>
                    <span>12:00</span>
                    <span>14:00</span>
                    <span>16:00</span>
                    <span>18:00</span>
                  </div>
                </div>
                  </div>
                )}
              </div>

              {/* Status indicators */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full shadow-sm"></div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Giờ làm việc</div>
                      <div className="text-sm font-semibold text-gray-900">{calculateHoursWorked(record.check_in, record.check_out)}</div>
              </div>
            </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full shadow-sm ${
                      getStatusColor(record).includes('red') ? 'bg-red-500' : 
                      getStatusColor(record).includes('yellow') ? 'bg-yellow-500' : 
                      getStatusColor(record).includes('purple') ? 'bg-purple-500' : 
                      getStatusColor(record).includes('orange') ? 'bg-orange-500' : 
                      getStatusColor(record).includes('blue') ? 'bg-blue-500' : 
                      getStatusColor(record).includes('cyan') ? 'bg-cyan-500' :
                      getStatusColor(record).includes('teal') ? 'bg-teal-500' :
                      getStatusColor(record).includes('amber') ? 'bg-amber-500' :
                      getStatusColor(record).includes('emerald') ? 'bg-emerald-500' :
                      getStatusColor(record).includes('indigo') ? 'bg-indigo-500' :
                      'bg-green-500'
                    }`}></div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Trạng thái</div>
                      <div className="text-sm font-semibold text-gray-900">{getStatusText(record)}</div>
        </div>
      </div>
    </div>
                {(() => {
                  const deviation = calculateTimeDeviation(record);
                  if (deviation && (deviation.lateMinutes > 0 || deviation.earlyMinutes > 0 || deviation.earlyCheckoutMinutes > 0 || deviation.lateCheckoutMinutes > 0)) {
                    const parts = [];
                    if (deviation.lateMinutes > 0) parts.push(`Trễ ${deviation.lateMinutes} phút`);
                    if (deviation.earlyMinutes > 0) parts.push(`Đi sớm ${deviation.earlyMinutes} phút`);
                    if (deviation.earlyCheckoutMinutes > 0) parts.push(`Về sớm ${deviation.earlyCheckoutMinutes} phút`);
                    if (deviation.lateCheckoutMinutes > 0) parts.push(`Về muộn ${deviation.lateCheckoutMinutes} phút`);

  return (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-gray-400 rounded-full shadow-sm"></div>
          <div>
                          <div className="text-xs text-gray-500 font-medium">Chi tiết</div>
                          <div className="text-sm text-gray-700">
                            {parts.join(' • ')}
          </div>
          </div>
          </div>
                    );
                  }
                  return null;
                })()}
            </div>
          </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No attendance records found for this employee</p>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AttendanceList = () => {
  const [currentView, setCurrentView] = useState('employees'); // employees | details
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

    // Phân tích giờ làm việc
    const checkInTime = record.check_in;
    const checkOutTime = record.check_out;
    
    // Chuẩn hóa thời gian check-in (8:00 AM)
    const standardStartTime = '08:00';
    const standardEndTime = '18:00';
    
    // Chuẩn hóa định dạng thời gian để so sánh chính xác
    const normalizeTime = (timeStr) => {
      const [hour, min, sec] = timeStr.split(':').map(Number);
      return hour * 60 + min; // Chuyển thành phút để so sánh
    };
    
    const checkInMinutes = normalizeTime(checkInTime);
    const checkOutMinutes = normalizeTime(checkOutTime);
    const standardStartMinutes = normalizeTime(standardStartTime); // 480 phút (8:00)
    const standardEndMinutes = normalizeTime(standardEndTime);     // 1080 phút (18:00)
    
    // So sánh thời gian
    const isEarly = checkInMinutes < standardStartMinutes;  // Đi sớm
    const isLate = checkInMinutes > standardStartMinutes;   // Đi trễ
    const isEarlyCheckout = checkOutMinutes < standardEndMinutes;  // Về sớm
    const isLateCheckout = checkOutMinutes > standardEndMinutes;   // Về muộn
    
    // Phân loại theo 3 trường hợp chính
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
      
      // Chỉ sử dụng Flask API (face recognition system)
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

  // Employee Attendance view
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

            {/* Rest of original attendance list content */}
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

                {/* Attendance records from JSON */}
                <div className="space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang tải dữ liệu...</span>
                      </div>
                    </div>
                  ) : attendanceData.length > 0 ? (
                    attendanceData.map((record, index) => (
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