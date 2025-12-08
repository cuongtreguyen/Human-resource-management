// src/pages/NotificationCenter.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Calendar,
  Users,
  CheckCheck,
  Filter
} from 'lucide-react';
import { isAdmin, getRole } from '../utils/auth';
import * as api from '../services/api';

const NotificationCenter = () => {
  const userRole = getRole();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // ===== Màu sắc theo role =====
  const getBannerColor = () => {
    switch (userRole) {
      case 'admin':
        return 'from-blue-500 to-blue-600';
      case 'manager':
        return 'from-purple-600 to-purple-700';
      case 'accountant':
        return 'from-emerald-600 to-emerald-700';
      default:
        return 'from-orange-500 to-orange-600';
    }
  };

  const getSubtitleColor = () => {
    switch (userRole) {
      case 'admin':
        return 'text-blue-100';
      case 'manager':
        return 'text-purple-100';
      case 'accountant':
        return 'text-emerald-100';
      default:
        return 'text-orange-100';
    }
  };

  // ===== Load dữ liệu =====
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const result = await api.getNotifications();
      setNotifications(result);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // ===== Đánh dấu đã đọc =====
  const markAsRead = async (notificationId) => {
    try {
      await api.markNotificationRead(notificationId);
      setNotifications(notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // ===== Đánh dấu tất cả đã đọc =====
  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  // ===== Icon theo loại =====
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

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
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

  const unreadCount = notifications.filter(n => !n.read).length;

  // ===== Lọc =====
  const filteredNotifications =
    filter === 'all'
      ? notifications
      : filter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type.includes(filter));

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Đang tải thông báo...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getBannerColor()} text-white p-6 rounded-xl shadow-lg`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Trung tâm thông báo</h1>
              <p className={`${getSubtitleColor()} mt-1`}>Quản lý tất cả thông báo của bạn</p>
            </div>
            {!isAdmin() && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-3">
                <Bell className="h-7 w-7" />
                <div>
                  <div className="text-2xl font-bold">{unreadCount}</div>
                  <div className={`${getSubtitleColor()} text-sm`}>Chưa đọc</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{notifications.length}</div>
                <div className="text-sm text-gray-500">Tổng thông báo</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{unreadCount}</div>
                <div className="text-sm text-gray-500">Chưa đọc</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.type === 'task_assigned').length}
                </div>
                <div className="text-sm text-gray-500">Công việc</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.type.includes('leave')).length}
                </div>
                <div className="text-sm text-gray-500">Nghỉ phép</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Actions */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'unread', label: 'Chưa đọc' },
                  { value: 'task', label: 'Công việc' },
                  { value: 'leave', label: 'Nghỉ phép' }
                ].map(item => (
                  <button
                    key={item.value}
                    onClick={() => setFilter(item.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === item.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCheck className="h-4 w-4" />
                Đánh dấu tất cả đã đọc
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Danh sách thông báo</h3>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">Không có thông báo nào</p>
                <p className="text-gray-400 text-sm mt-1">Bạn đã xem hết tất cả thông báo</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-5 cursor-pointer transition-all hover:bg-gray-50 ${
                    !notification.read ? 'bg-purple-50/50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl flex-shrink-0 ${
                        notification.type === 'task_assigned'
                          ? 'bg-blue-100'
                          : notification.type === 'leave_approved'
                          ? 'bg-green-100'
                          : notification.type === 'leave_rejected'
                          ? 'bg-red-100'
                          : notification.type === 'task_delegation'
                          ? 'bg-purple-100'
                          : notification.type === 'deadline_approaching'
                          ? 'bg-orange-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4
                            className={`font-semibold ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <p
                            className={`text-sm mt-1 ${
                              !notification.read ? 'text-gray-700' : 'text-gray-500'
                            }`}
                          >
                            {notification.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              notification.priority === 'high'
                                ? 'bg-red-100 text-red-700'
                                : notification.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {notification.priority === 'high'
                              ? 'Quan trọng'
                              : notification.priority === 'medium'
                              ? 'Trung bình'
                              : 'Thấp'}
                          </span>
                          {!notification.read && (
                            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(notification.createdAt).toLocaleString('vi-VN')}
                        </div>

                        <div className="flex gap-2">
                          {notification.type === 'task_assigned' && (
                            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                              Xem công việc
                            </button>
                          )}
                          {notification.type.includes('leave') && (
                            <button className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                              Xem đơn nghỉ
                            </button>
                          )}
                          {notification.type === 'task_delegation' && (
                            <button className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
                              Xem bàn giao
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotificationCenter;
