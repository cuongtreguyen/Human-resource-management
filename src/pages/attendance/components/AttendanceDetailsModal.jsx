// src/pages/attendance/components/AttendanceDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Edit, Clock } from 'lucide-react';

const AttendanceDetailsModal = ({ employee, onClose, onEditRecord, onSaveRecord }) => {
  const [selectedMonth, setSelectedMonth] = useState('March 2024');
  const [statusFilter, setStatusFilter] = useState('All');
  const [overtimeChecked, setOvertimeChecked] = useState({});

  // Mock attendance data - now with state management
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 1,
      date: '2025-03-03',
      startTime: '08:00',
      endTime: '19:00',
      hoursWorked: 11,
      status: 'Late',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 2,
      date: '2025-03-04',
      startTime: '08:00',
      endTime: '18:30',
      hoursWorked: 10.5,
      status: 'On time',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 3,
      date: '2025-03-06',
      startTime: '08:30',
      endTime: '18:00',
      hoursWorked: 9.5,
      status: 'On time',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 4,
      date: '2025-03-07',
      startTime: '08:00',
      endTime: '19:30',
      hoursWorked: 11.5,
      status: 'On time',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 5,
      date: '2025-03-10',
      startTime: '08:15',
      endTime: '18:15',
      hoursWorked: 10,
      status: 'Late',
      statusColor: 'bg-yellow-100 text-yellow-800'
    }
  ]);

  const handleOvertimeToggle = (recordId) => {
    setOvertimeChecked(prev => ({
      ...prev,
      [recordId]: !prev[recordId]
    }));
    console.log(`Overtime toggled for record ${recordId}:`, !overtimeChecked[recordId]);
  };

  const handleEditRecord = (record) => {
    onEditRecord(record);
  };

  const handleSaveRecord = (updatedRecord) => {
    console.log('Saving record in AttendanceDetailsModal:', updatedRecord);
    setAttendanceRecords(prev => {
      const newRecords = prev.map(record => 
        record.id === updatedRecord.id ? {
          ...record,
          startTime: updatedRecord.startTime,
          endTime: updatedRecord.endTime,
          status: updatedRecord.status,
          statusColor: updatedRecord.status === 'Late' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
        } : record
      );
      console.log('Updated records:', newRecords);
      return newRecords;
    });
    
    // Call parent callback if provided
    if (onSaveRecord) {
      onSaveRecord(updatedRecord);
    }
  };

  // Listen for record updates from EditAttendanceModal
  useEffect(() => {
    const handleRecordUpdate = (event) => {
      const updatedRecord = event.detail;
      console.log('Received record update event:', updatedRecord);
      handleSaveRecord(updatedRecord);
    };

    window.addEventListener('attendanceRecordUpdated', handleRecordUpdate);
    return () => {
      window.removeEventListener('attendanceRecordUpdated', handleRecordUpdate);
    };
  }, []);

  const filteredRecords = attendanceRecords.filter(record => {
    if (statusFilter === 'All') return true;
    return record.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Attendance Details - {employee.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="text-lg font-semibold text-gray-900">
            {selectedMonth} Attendance
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                console.log('Status filter changed to:', e.target.value);
              }}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="All">All</option>
              <option value="On time">On time</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div key={record.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  {/* Date */}
                  <div className="text-sm font-medium text-gray-900">
                    {record.date}
                  </div>

                  {/* Hours Worked Bar */}
                  <div className="flex-1 mx-6">
                    <div className="relative">
                      {/* Time Bar */}
                      <div className="h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-between px-3 text-white text-sm font-medium">
                        <span>{record.startTime}</span>
                        <span>Hours Worked</span>
                        <span>{record.endTime}</span>
                      </div>
                      
                      {/* Hours Display */}
                      <div className="text-center mt-2 text-sm text-gray-600">
                        {record.hoursWorked} hours
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${record.statusColor}`}>
                      {record.status}
                    </span>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleEditRecord(record)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Overtime Checkbox */}
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={overtimeChecked[record.id] || false}
                        onChange={() => handleOvertimeToggle(record.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-xs text-blue-600 font-medium">OT</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {attendanceRecords.length}
                </div>
                <div className="text-sm text-gray-600">Total Days</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {attendanceRecords.filter(r => r.status === 'On time').length}
                </div>
                <div className="text-sm text-gray-600">On Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {attendanceRecords.filter(r => r.status === 'Late').length}
                </div>
                <div className="text-sm text-gray-600">Late</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {attendanceRecords.reduce((sum, r) => sum + r.hoursWorked, 0).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Total Hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={() => {
              console.log('Exporting report for:', employee.name);
              alert(`Exporting attendance report for ${employee.name}\nPeriod: ${selectedMonth}\nRecords: ${filteredRecords.length}`);
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDetailsModal;
