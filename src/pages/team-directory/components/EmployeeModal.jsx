import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EmployeeModal = ({ employee, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !employee) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-success bg-success/10 border-success/20';
      case 'busy': return 'text-warning bg-warning/10 border-warning/20';
      case 'away': return 'text-secondary bg-secondary/10 border-secondary/20';
      case 'offline': return 'text-muted-foreground bg-muted border-gray-200';
      default: return 'text-muted-foreground bg-muted border-gray-200';
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
      case 'checkin': return 'text-success';
      case 'checkout': return 'text-primary';
      case 'leave_request': return 'text-warning';
      case 'overtime': return 'text-accent';
      case 'meeting': return 'text-blue-500';
      case 'training': return 'text-purple-500';
      case 'interview': return 'text-orange-500';
      case 'client_meeting': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'checkin': return `Check-in lúc ${activity.time}`;
      case 'checkout': return `Check-out lúc ${activity.time}`;
      case 'leave_request': return `Xin ngh�?phép: ${activity.reason}`;
      case 'overtime': return `Làm thêm ${activity.hours} giờ`;
      case 'meeting': return `Họp: ${activity.title}`;
      case 'training': return `Đào tạo: ${activity.title}`;
      case 'interview': return `Phỏng vấn: ${activity.candidate}`;
      case 'client_meeting': return `Gặp khách hàng: ${activity.client}`;
      default: return 'Hoạt động khác';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(salary);
  };

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: 'User' },
    { id: 'activities', label: 'Hoạt động', icon: 'Activity' },
    { id: 'skills', label: 'K�?năng', icon: 'Award' },
    { id: 'contact', label: 'Liên hệ', icon: 'Phone' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-gray-200 rounded-lg shadow-strong w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card flex items-center justify-center ${getStatusColor(employee.status)}`}>
                <Icon name={getStatusIcon(employee.status)} size={10} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{employee.name}</h2>
              <p className="text-muted-foreground">{employee.role} �?{employee.department}</p>
              <p className="text-sm text-muted-foreground">Mã nhân viên: {employee.employeeId}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Thông tin cơ bản</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Icon name="Mail" size={16} className="text-muted-foreground" />
                      <span className="text-sm">{employee.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Phone" size={16} className="text-muted-foreground" />
                      <span className="text-sm">{employee.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="MapPin" size={16} className="text-muted-foreground" />
                      <span className="text-sm">{employee.location}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Calendar" size={16} className="text-muted-foreground" />
                      <span className="text-sm">Ngày vào làm: {formatDate(employee.joinDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Thông tin công việc</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Icon name="Building2" size={16} className="text-muted-foreground" />
                      <span className="text-sm">{employee.department}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Briefcase" size={16} className="text-muted-foreground" />
                      <span className="text-sm">{employee.role}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="DollarSign" size={16} className="text-muted-foreground" />
                      <span className="text-sm">{formatSalary(employee.salary)}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Circle" size={16} className="text-muted-foreground" />
                      <span className="text-sm">{getStatusText(employee.status)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Summary */}
              {employee.activities && employee.activities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Hoạt động gần đây</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {employee.activities.slice(0, 4).map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <Icon 
                          name={getActivityIcon(activity.type)} 
                          size={16} 
                          className={getActivityColor(activity.type)} 
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {getActivityText(activity)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.date === new Date().toISOString().split('T')[0] ? 'Hôm nay' : formatDate(activity.date)} lúc {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Lịch s�?hoạt động</h3>
              {employee.activities && employee.activities.length > 0 ? (
                <div className="space-y-3">
                  {employee.activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)} bg-current/10`}>
                        <Icon name={getActivityIcon(activity.type)} size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground">
                            {getActivityText(activity)}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {activity.date === new Date().toISOString().split('T')[0] ? 'Hôm nay' : formatDate(activity.date)} lúc {activity.time}
                          </span>
                        </div>
                        {activity.status && (
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              activity.status === 'completed' ? 'bg-success/10 text-success' :
                              activity.status === 'pending' ? 'bg-warning/10 text-warning' :
                              activity.status === 'approved' ? 'bg-success/10 text-success' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {activity.status === 'completed' ? 'Hoàn thành' :
                               activity.status === 'pending' ? 'Ch�?duyệt' :
                               activity.status === 'approved' ? 'Đã duyệt' :
                               activity.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Chưa có hoạt động nào</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Kỹ năng và chứng chỉ</h3>
              {employee.skills && employee.skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {employee.skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
                      <Icon name="Award" size={16} className="text-accent" />
                      <span className="text-sm font-medium text-foreground">{skill}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon name="Award" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Chưa có k�?năng nào được ghi nhận</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Thông tin liên hệ</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                    <Icon name="Mail" size={20} className="text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">{employee.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                    <Icon name="Phone" size={20} className="text-success" />
                    <div>
                      <p className="font-medium text-foreground">Điện thoại</p>
                      <p className="text-sm text-muted-foreground">{employee.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                    <Icon name="MapPin" size={20} className="text-warning" />
                    <div>
                      <p className="font-medium text-foreground">Địa điểm</p>
                      <p className="text-sm text-muted-foreground">{employee.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                    <Icon name="Building2" size={20} className="text-accent" />
                    <div>
                      <p className="font-medium text-foreground">Phòng ban</p>
                      <p className="text-sm text-muted-foreground">{employee.department}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  iconName="MessageCircle"
                  iconPosition="left"
                  className="flex-1"
                >
                  Nhắn tin
                </Button>
                <Button
                  variant="outline"
                  iconName="Phone"
                  iconPosition="left"
                  className="flex-1"
                >
                  Gọi điện
                </Button>
                <Button
                  variant="outline"
                  iconName="Mail"
                  iconPosition="left"
                  className="flex-1"
                >
                  Gửi email
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;

