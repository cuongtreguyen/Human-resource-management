import React from 'react';

const DepartmentDistribution = ({ departments = [] }) => {
  const getColorForIndex = (index) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500', 
      'bg-orange-500'
    ];
    return colors[index % 4];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Department Distribution</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {departments.map((dept, index) => (
            <div key={dept.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${getColorForIndex(index)}`}></div>
                <span className="text-sm font-medium text-gray-900">{dept.name}</span>
              </div>
              <span className="text-sm text-gray-500">{dept.count} employees</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDistribution;

