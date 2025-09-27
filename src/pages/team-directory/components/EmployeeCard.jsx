import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const EmployeeCard = ({
  employee,
  onViewProfile,
  onSendMessage,
  onCall,
  onEmail,
  viewMode = 'grid'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Status styles
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'busy':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'away':
        return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'offline':
        return 'text-gray-500 bg-gray-100 border-gray-200';
      default:
        return 'text-gray-500 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return 'Circle';
      case 'busy': return 'Clock';
      case 'away': return 'Moon';
      case 'offline': return 'CircleSlash';
      default: return 'Circle';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Đang online';
      case 'busy': return 'Bận';
      case 'away': return 'Vắng mặt';
      case 'offline': return 'Offline';
      default: return 'Không xác định';
    }
  };

  // Last seen formatter
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return '';
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  // Activities
  const getActivityIcon = (type) => {
    switch (type) {
      case 'checkin': return 'LogIn';
      case 'checkout': return 'LogOut';
      case 'leave_request': return 'Calendar';
      case 'overtime': return 'Clock';
      case 'meeting': return 'Users';
      case 'training': return 'BookOpen';
      case 'interview': return 'UserCheck';
      case 'client_meeting': return 'Handshake';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'checkin': return 'text-green-600';
      case 'checkout': return 'text-blue-600';
      case 'leave_request': return 'text-yellow-600';
      case 'overtime': return 'text-pink-600';
      case 'meeting': return 'text-indigo-600';
      case 'training': return 'text-purple-600';
      case 'interview': return 'text-orange-600';
      case 'client_meeting': return 'text-teal-600';
      default: return 'text-gray-500';
    }
  };

  const getActivityText = (activity) => {
    switch (activity?.type) {
      case 'checkin': return `Check-in lúc ${activity.time}`;
      case 'checkout': return `Check-out lúc ${activity.time}`;
      case 'leave_request': return `Xin nghỉ phép: ${activity.reason}`;
      case 'overtime': return `Làm thêm ${activity.hours} giờ`;
      case 'meeting': return `Họp: ${activity.title}`;
      case 'training': return `Đào tạo: ${activity.title}`;
      case 'interview': return `Phỏng vấn: ${activity.candidate}`;
      case 'client_meeting': return `Gặp khách hàng: ${activity.client}`;
      default: return 'Hoạt động khác';
    }
  };

  // ---------------- LIST MODE ----------------
  if (viewMode === 'list') {
    return (
      <div
        className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onViewProfile(employee)}
      >
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md">
              <Image
                src={employee?.avatar}
                alt={employee?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${getStatusColor(employee?.status)}`}
            >
              <Icon name={getStatusIcon(employee?.status)} size={10} />
            </div>
          </div>

          {/* Employee Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg truncate">
                  {employee?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {employee?.role} • {employee?.department}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {employee?.employeeId}
                </p>
                <p className="text-xs text-gray-500">
                  {getStatusText(employee?.status)}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="hidden lg:block min-w-0 flex-1">
            {employee?.activities?.length > 0 && (
              <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <Icon
                  name={getActivityIcon(employee.activities[0].type)}
                  size={16}
                  className={getActivityColor(employee.activities[0].type)}
                />
                <span className="text-sm text-gray-600 truncate">
                  {getActivityText(employee.activities[0])}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- GRID MODE ----------------
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 ${
        isHovered ? 'border-blue-200' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewProfile(employee)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-gray-100 shadow-md">
              <Image
                src={employee?.avatar}
                alt={employee?.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Status */}
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${getStatusColor(employee?.status)}`}
            >
              <Icon name={getStatusIcon(employee?.status)} size={12} />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 text-xl">{employee?.name}</h3>
            <p className="text-gray-600 font-medium">{employee?.role}</p>
            <p className="text-sm text-gray-500">{employee?.department}</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-3 text-sm">
          <Icon name="MapPin" size={16} className="text-gray-400" />
          <span className="text-gray-600">{employee?.location}</span>
        </div>

        <div className="flex items-center space-x-3 text-sm">
          <Icon name="Mail" size={16} className="text-gray-400" />
          <span className="text-gray-600 truncate">{employee?.email}</span>
        </div>

        {employee?.phone && (
          <div className="flex items-center space-x-3 text-sm">
            <Icon name="Phone" size={16} className="text-gray-400" />
            <span className="text-gray-600">{employee?.phone}</span>
          </div>
        )}
      </div>

      {/* Activities */}
      {employee?.activities?.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Hoạt động gần đây</p>
          <div className="space-y-3">
            {employee.activities.slice(0, 2).map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(
                    activity.type
                  )} bg-opacity-10`}
                >
                  <Icon
                    name={getActivityIcon(activity.type)}
                    size={16}
                    className={getActivityColor(activity.type)}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {getActivityText(activity)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.date === new Date().toISOString().split('T')[0]
                      ? 'Hôm nay'
                      : activity.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {employee?.skills?.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Kỹ năng</p>
          <div className="flex flex-wrap gap-2">
            {employee.skills.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
              >
                {skill}
              </span>
            ))}
            {employee.skills.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                +{employee.skills.length - 3} khác
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div
          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            employee?.status
          )}`}
        >
          <Icon name={getStatusIcon(employee?.status)} size={12} />
          <span>{getStatusText(employee?.status)}</span>
        </div>

        <span className="text-sm text-gray-500">
          {employee?.status === 'offline'
            ? `Hoạt động ${formatLastSeen(employee?.lastSeen)}`
            : 'Đang hoạt động'}
        </span>
      </div>
    </div>
  );
};

export default EmployeeCard;
