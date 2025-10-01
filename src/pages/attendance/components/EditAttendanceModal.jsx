// src/pages/attendance/components/EditAttendanceModal.jsx
import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

const EditAttendanceModal = ({ record, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: record?.date || '',
    checkInTime: record?.startTime || '08:00',
    checkOutTime: record?.endTime || '18:00',
    status: record?.status || 'On time',
    lateMinutes: 0
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    console.log(`Field ${field} changed to:`, value);
  };

  const handleSave = () => {
    const updatedRecord = {
      ...record,
      ...formData,
      startTime: formData.checkInTime,
      endTime: formData.checkOutTime
    };
    console.log('Saving attendance record:', updatedRecord);
    
    // Call onSave first to update the state
    onSave(updatedRecord);
    
    // Show alert after state update
    setTimeout(() => {
      alert(`Attendance record saved successfully!\nDate: ${formData.date}\nCheck-in: ${formData.checkInTime}\nCheck-out: ${formData.checkOutTime}\nStatus: ${formData.status}\nLate Minutes: ${formData.lateMinutes}`);
    }, 100);
  };

  const statusOptions = [
    { value: 'On time', label: 'On time' },
    { value: 'Late', label: 'Late' },
    { value: 'Absent', label: 'Absent' },
    { value: 'Early leave', label: 'Early leave' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Attendance Record</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date:
            </label>
            <input
              type="text"
              value={formData.date}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          {/* Check-in Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in Time:
            </label>
            <input
              type="time"
              value={formData.checkInTime}
              onChange={(e) => handleInputChange('checkInTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Check-out Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out Time:
            </label>
            <input
              type="time"
              value={formData.checkOutTime}
              onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status:
            </label>
            <div className="relative">
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* Late Minutes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Late Minutes:
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.lateMinutes}
                onChange={(e) => handleInputChange('lateMinutes', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
                max="480"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col">
                <button
                  type="button"
                  onClick={() => {
                    const newValue = Math.min(formData.lateMinutes + 1, 480);
                    handleInputChange('lateMinutes', newValue);
                    console.log('Late minutes increased to:', newValue);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xs"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newValue = Math.max(formData.lateMinutes - 1, 0);
                    handleInputChange('lateMinutes', newValue);
                    console.log('Late minutes decreased to:', newValue);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xs"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAttendanceModal;
