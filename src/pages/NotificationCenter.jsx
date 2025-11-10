import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  User, 
  FileText,
  Mail,
  MessageSquare,
  Calendar,
  Users
} from 'lucide-react';
import fakeApi from '../services/fakeApi';

const NotificationCenter = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await fakeApi.getNotifications();
      setNotifications(response.data);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fakeApi.markNotificationRead(notificationId);
      setNotifications(notifications.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_assigned': return <User className="h-5 w-5 text-blue-500" />;
      case 'leave_approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'leave_rejected': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'task_delegation': return <Users className="h-5 w-5 text-purple-500" />;
      case 'deadline_approaching': return <Clock className="h-5 w-5 text-orange-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'border-l-red-500 bg-red-50';
    if (priority === 'medium') return 'border-l-yellow-500 bg-yellow-50';
    if (priority === 'low') return 'border-l-green-500 bg-green-50';
    return 'border-l-gray-500 bg-gray-50';
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'task_assigned':
        navigate('/tasks');
        break;
      case 'leave_approved':
      case 'leave_rejected':
        navigate('/leaves');
        break;
      case 'task_delegation':
        navigate('/leaves/delegation');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Đang tải thông báo...</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Trung tâm thông báo</h1>
              <p className="text-blue-100 mt-1">Cập nhật về công việc và nghỉ phép</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{unreadCount}</div>
                <div className="text-blue-100 text-sm">Thông báo chưa đọc</div>
              </div>
              <Bell className="h-8 w-8 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Notification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card title="Tổng thông báo" icon={<Bell className="h-5 w-5 text-blue-500" />}>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
              <div className="text-sm text-gray-500">Tất cả thông báo</div>
            </div>
          </Card>
          
          <Card title="Chưa đọc" icon={<AlertCircle className="h-5 w-5 text-red-500" />}>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
              <div className="text-sm text-gray-500">Cần xem</div>
            </div>
          </Card>
          
          <Card title="Công việc" icon={<User className="h-5 w-5 text-green-500" />}>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {notifications.filter(n => n.type === 'task_assigned').length}
              </div>
              <div className="text-sm text-gray-500">Giao việc</div>
            </div>
          </Card>
          
          <Card title="Nghỉ phép" icon={<Calendar className="h-5 w-5 text-purple-500" />}>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {notifications.filter(n => n.type.includes('leave')).length}
              </div>
              <div className="text-sm text-gray-500">Nghỉ phép</div>
            </div>
          </Card>
        </div>

        {/* Notifications List */}
        <Card title="Danh sách thông báo">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md ${getNotificationColor(notification.type, notification.priority)} ${
                    !notification.read ? 'ring-2 ring-blue-200' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                            notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {notification.priority}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(notification.createdAt).toLocaleString('vi-VN')}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {notification.type === 'task_assigned' && (
                            <Button variant="secondary" size="sm">
                              <User className="h-3 w-3 mr-1" />
                              Xem task
                            </Button>
                          )}
                          {notification.type.includes('leave') && (
                            <Button variant="secondary" size="sm">
                              <Calendar className="h-3 w-3 mr-1" />
                              Xem đơn nghỉ
                            </Button>
                          )}
                          {notification.type === 'task_delegation' && (
                            <Button variant="secondary" size="sm">
                              <Users className="h-3 w-3 mr-1" />
                              Xem bàn giao
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotificationCenter;
