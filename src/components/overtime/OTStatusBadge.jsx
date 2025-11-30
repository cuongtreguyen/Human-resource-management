import React from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Star,
  DollarSign,
  AlertCircle
} from 'lucide-react';

const statusConfig = {
  pending: {
    label: 'Chờ duyệt',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock
  },
  approved: {
    label: 'Đã duyệt',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CheckCircle
  },
  rejected: {
    label: 'Từ chối',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle
  },
  completed: {
    label: 'Đã nộp báo cáo',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: FileText
  },
  reviewed: {
    label: 'Đã review',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: Star
  },
  payroll_approved: {
    label: 'Đã duyệt lương',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: DollarSign
  }
};

const OTStatusBadge = ({ status, size = 'md', showIcon = true }) => {
  const config = statusConfig[status] || {
    label: status,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: AlertCircle
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.color} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  );
};

export default OTStatusBadge;
