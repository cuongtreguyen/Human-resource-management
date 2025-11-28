import {
  UserPlus,
  ClipboardList,
  Calendar,
  FileText,
  DollarSign,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: UserPlus,
      label: 'Thêm nhân viên',
      description: 'Tạo hồ sơ nhân viên mới',
      color: 'blue',
      path: '/employees/add'
    },
    {
      icon: ClipboardList,
      label: 'Chấm công',
      description: 'Ghi nhận chấm công',
      color: 'green',
      path: '/attendance'
    },
    {
      icon: Calendar,
      label: 'Nghỉ phép',
      description: 'Quản lý đơn nghỉ phép',
      color: 'amber',
      path: '/leave'
    },
    {
      icon: DollarSign,
      label: 'Bảng lương',
      description: 'Xem bảng lương',
      color: 'purple',
      path: '/payroll'
    },
    {
      icon: FileText,
      label: 'Công việc',
      description: 'Quản lý công việc',
      color: 'indigo',
      path: '/tasks'
    },
    {
      icon: Users,
      label: 'Đánh giá',
      description: 'Đánh giá nhân viên',
      color: 'pink',
      path: '/evaluations'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    amber: 'bg-amber-100 text-amber-600 hover:bg-amber-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    indigo: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
    pink: 'bg-pink-100 text-pink-600 hover:bg-pink-200'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 ${colorClasses[action.color]}`}
            >
              <Icon size={24} className="mb-2" />
              <span className="text-sm font-medium">{action.label}</span>
              <span className="text-xs opacity-75 text-center mt-1">{action.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
