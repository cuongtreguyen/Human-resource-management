import React from 'react';

const DashboardChartsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Monthly Payroll Chart Skeleton */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="flex items-end justify-between h-48 px-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-3 bg-gray-200 rounded w-12"></div>
              <div className="w-12 bg-gray-200 rounded-t" style={{ height: `${Math.random() * 100 + 50}px` }}></div>
              <div className="h-3 bg-gray-200 rounded w-8"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Payroll by Department Skeleton */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 bg-gray-200 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardChartsSkeleton;

