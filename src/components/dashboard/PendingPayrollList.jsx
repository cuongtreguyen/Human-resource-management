import React, { memo } from 'react';
import { DollarSign } from 'lucide-react';

const PendingPayrollList = memo(({ items, formatFullCurrency, onViewAll }) => {
  if (!items || items.length === 0) {
    return (
      <>
        <div className="text-center py-8 text-gray-500">
          <p>Không có lương chờ xử lý</p>
        </div>
        <button
          onClick={onViewAll}
          className="w-full mt-4 py-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
        >
          Xem tất cả & Xử lý
        </button>
      </>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {items.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">
                {item.name?.charAt(0) || '?'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.department}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{formatFullCurrency(item.salary)}</p>
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Chờ duyệt</span>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onViewAll}
        className="w-full mt-4 py-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
      >
        Xem tất cả & Xử lý
      </button>
    </>
  );
});

PendingPayrollList.displayName = 'PendingPayrollList';

export default PendingPayrollList;

