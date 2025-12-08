import React, { memo } from 'react';
import {
  DollarSign, Clock, PiggyBank, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const DashboardStatsCards = memo(({ stats, formatCurrency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* Tổng lương tháng */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Tổng lương tháng này</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalPayroll)}</p>
            <div className="flex items-center gap-1 mt-2">
              {stats?.payrollGrowth >= 0 ? (
                <>
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600">+{stats?.payrollGrowth?.toFixed(1)}% so với tháng trước</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-600">{stats?.payrollGrowth?.toFixed(1)}% so với tháng trước</span>
                </>
              )}
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Lương chờ xử lý */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Lương chờ xử lý</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.pendingPayroll}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                Cần duyệt
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Bảo hiểm */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Chi phí bảo hiểm</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.insuranceTotal)}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                BHXH + BHYT
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <PiggyBank className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
});

DashboardStatsCards.displayName = 'DashboardStatsCards';

export default DashboardStatsCards;

