import React from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const QuotaIndicator = ({ used, remaining, quota, size = 'md' }) => {
  const percentage = Math.round((used / quota) * 100);
  const isLow = remaining <= 5;
  const isFull = remaining <= 0;

  const getColor = () => {
    if (isFull) return 'red';
    if (isLow) return 'yellow';
    return 'green';
  };

  const colorClasses = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      progress: 'bg-green-500',
      icon: CheckCircle
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      progress: 'bg-yellow-500',
      icon: AlertTriangle
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      progress: 'bg-red-500',
      icon: AlertTriangle
    }
  };

  const color = getColor();
  const classes = colorClasses[color];
  const Icon = classes.icon;

  if (size === 'sm') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${classes.bg} ${classes.border} border`}>
        <Clock className={`w-4 h-4 ${classes.text}`} />
        <span className={`text-sm font-medium ${classes.text}`}>
          {used}/{quota}h
        </span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl ${classes.bg} ${classes.border} border`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${classes.text}`} />
          <span className={`font-medium ${classes.text}`}>Quota OT tháng này</span>
        </div>
        <span className={`text-lg font-bold ${classes.text}`}>
          {remaining}h còn lại
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full ${classes.progress} transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>Đã dùng: {used}h</span>
        <span>Tổng: {quota}h</span>
      </div>

      {isFull && (
        <p className="mt-2 text-sm text-red-600 font-medium">
          Bạn đã hết quota OT trong tháng này!
        </p>
      )}

      {isLow && !isFull && (
        <p className="mt-2 text-sm text-yellow-600 font-medium">
          Quota OT còn lại ít, hãy sử dụng cẩn thận!
        </p>
      )}
    </div>
  );
};

export default QuotaIndicator;
