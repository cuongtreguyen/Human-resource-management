import React from 'react';

const DashboardStatsCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-40"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStatsCardsSkeleton;

