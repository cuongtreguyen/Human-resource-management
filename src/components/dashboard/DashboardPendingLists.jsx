import React, { memo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Receipt } from 'lucide-react';

// Lazy load pending lists - chỉ load khi cần
const PendingPayrollList = lazy(() => import('./PendingPayrollList'));
const PendingBenefitsList = lazy(() => import('./PendingBenefitsList'));

const DashboardPendingLists = memo(({ stats, formatFullCurrency }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Pending Payroll */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Lương chờ xử lý</h3>
          <DollarSign className="w-5 h-5 text-gray-400" />
        </div>
        <Suspense fallback={
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        }>
          <PendingPayrollList 
            items={stats?.pendingPayrollList || []} 
            formatFullCurrency={formatFullCurrency}
            onViewAll={() => navigate('/payroll')}
          />
        </Suspense>
      </div>

      {/* Pending Benefits */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Yêu cầu phúc lợi</h3>
          <Receipt className="w-5 h-5 text-gray-400" />
        </div>
        <Suspense fallback={
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        }>
          <PendingBenefitsList 
            items={stats?.pendingBenefits || []} 
            formatFullCurrency={formatFullCurrency}
            onViewAll={() => navigate('/benefits')}
          />
        </Suspense>
      </div>
    </div>
  );
});

DashboardPendingLists.displayName = 'DashboardPendingLists';

export default DashboardPendingLists;

