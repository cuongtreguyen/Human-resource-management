import {
  UserPlus,
  Calendar,
  DollarSign,
  ClipboardCheck,
  Clock
} from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'hire',
      icon: UserPlus,
      message: 'Nhân viên mới Nguyễn Văn A đã được thêm',
      time: '2 giờ trước',
      color: 'blue'
    },
    {
      id: 2,
      type: 'leave',
      icon: Calendar,
      message: 'Trần Thị B đã gửi đơn xin nghỉ phép',
      time: '4 giờ trước',
      color: 'amber'
    },
    {
      id: 3,
      type: 'payroll',
      icon: DollarSign,
      message: 'Bảng lương tháng 11 đã được xử lý',
      time: '1 ngày trước',
      color: 'green'
    },
    {
      id: 4,
      type: 'attendance',
      icon: ClipboardCheck,
      message: 'Báo cáo chấm công đã được tạo',
      time: '2 ngày trước',
      color: 'purple'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
        <Clock size={20} className="text-gray-400" />
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${colorClasses[activity.color]}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
        Xem tất cả hoạt động
      </button>
    </div>
  );
};

export default RecentActivity;
