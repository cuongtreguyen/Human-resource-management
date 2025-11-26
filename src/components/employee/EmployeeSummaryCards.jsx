import React from 'react';
import Card from '../ui/Card';

const EmployeeSummaryCards = ({ totalEmployees, activeEmployees }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="text-center">
        <div className="text-blue-600 mb-3">
          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-blue-600">{totalEmployees}</h3>
        <p className="text-gray-600">Tổng nhân viên</p>
      </Card>

      <Card className="text-center">
        <div className="text-green-600 mb-3">
          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-600">{activeEmployees}</h3>
        <p className="text-gray-600">Đang làm việc</p>
      </Card>
    </div>
  );
};

export default EmployeeSummaryCards;

