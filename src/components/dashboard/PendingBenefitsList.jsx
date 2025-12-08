import React, { memo } from 'react';
import { Receipt } from 'lucide-react';

const PendingBenefitsList = memo(({ items, formatFullCurrency, onViewAll }) => {
  if (!items || items.length === 0) {
    return (
      <>
        <div className="text-center py-8 text-gray-500">
          <p>Không có yêu cầu phúc lợi</p>
        </div>
        <button
          onClick={onViewAll}
          className="w-full mt-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
        >
          Xem tất cả & Duyệt
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
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                {item.name?.charAt(0) || '?'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.type}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{formatFullCurrency(item.amount)}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onViewAll}
        className="w-full mt-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
      >
        Xem tất cả & Duyệt
      </button>
    </>
  );
});

PendingBenefitsList.displayName = 'PendingBenefitsList';

export default PendingBenefitsList;

