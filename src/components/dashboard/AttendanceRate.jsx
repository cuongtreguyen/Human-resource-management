import React from 'react';

const AttendanceRate = ({ rate = 0 }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Average Attendance Rate</h3>
      </div>
      <div className="p-6">
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">{rate}%</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">This month's average attendance</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRate;

