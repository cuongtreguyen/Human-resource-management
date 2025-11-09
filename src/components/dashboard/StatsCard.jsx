import React from 'react';

const StatsCard = ({ icon, label, value, iconBgColor = 'bg-blue-500' }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

