import React, { memo, useMemo } from 'react';

const DashboardCharts = memo(({ stats, formatCurrency, formatFullCurrency }) => {
  // Memoize maxAmount để tránh tính toán lại
  const maxAmount = useMemo(() => {
    if (!stats?.monthlyPayroll?.length) return 1;
    return Math.max(...stats.monthlyPayroll.map(m => m.amount));
  }, [stats?.monthlyPayroll]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Monthly Payroll Chart */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi phí lương 6 tháng gần nhất</h3>
        <div className="flex items-end justify-between h-48 px-2">
          {stats?.monthlyPayroll?.map((month, index) => {
            const height = maxAmount > 0 ? (month.amount / maxAmount) * 150 : 0;
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">{formatCurrency(month.amount)}</span>
                <div
                  className="w-12 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t hover:from-emerald-600 hover:to-emerald-500 transition-colors cursor-pointer"
                  style={{ height: `${height}px` }}
                  title={formatFullCurrency(month.amount)}
                ></div>
                <span className="text-xs text-gray-500 font-medium">{month.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payroll by Department */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lương theo phòng ban</h3>
        <div className="space-y-3">
          {stats?.payrollByDepartment?.map((dept, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: dept.color }}
              ></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700">{dept.name}</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(dept.amount)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${stats.totalPayroll > 0 ? (dept.amount / stats.totalPayroll) * 100 : 0}%`,
                      backgroundColor: dept.color
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

DashboardCharts.displayName = 'DashboardCharts';

export default DashboardCharts;

