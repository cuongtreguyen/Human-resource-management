import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut, X, Trash2 } from 'lucide-react';
import { getRole } from '../../utils/auth';
import fakeApi from '../../services/fakeApi';

const Header = ({ onLogout, onMenuClick }) => {
  const navigate = useNavigate();
  const userRole = getRole();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const notificationRef = useRef(null);

  // Load notifications
  useEffect(() => {
    loadNotifications();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await fakeApi.getNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (notificationId) => {
    try {
      await fakeApi.markNotificationRead(notificationId);
      setNotifications(notifications.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true }
          : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId, e) => {
    e.stopPropagation(); // Ngăn chặn click event bubble lên parent
    try {
      await fakeApi.deleteNotification(notificationId);
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  // Màu sắc theo role
  const themeColors = {
    admin: {
      badge: 'bg-blue-500',
      headerBg: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200',
    },
    accountant: {
      badge: 'bg-emerald-500',
      headerBg: 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200',
    },
    manager: {
      badge: 'bg-purple-500',
      headerBg: 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200',
    }
  };

  const currentTheme = themeColors[userRole] || themeColors.admin;

  return (
    <header className={`${currentTheme.headerBg} shadow-sm border-b h-16`}>
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side - Menu button and Title */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Page title */}
          <div className="hidden lg:block ml-4">
            <h2 className="text-xl font-semibold text-gray-900">
              EMPLOYEE HUB
            </h2>
          </div>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative cursor-pointer z-10"
              title="Thông báo"
              type="button"
            >
              <Bell className="h-6 w-6 pointer-events-none" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full pointer-events-none"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900">Thông báo</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto flex-1">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500 text-sm">Đang tải...</div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>Không có thông báo</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => {
                          if (!notification.read) {
                            markAsRead(notification.id);
                          }
                        }}
                        className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors group ${
                          !notification.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                            !notification.read ? 'bg-blue-500' : 'bg-transparent'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => deleteNotification(notification.id, e)}
                            className="flex-shrink-0 p-1.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            title="Xóa thông báo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={() => navigate('/notifications')}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Xem tất cả
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-900">
                {userRole === 'admin' && 'Quản trị viên'}
                {userRole === 'manager' && 'Quản lý'}
                {userRole === 'accountant' && 'Kế toán'}
              </p>
              <p className="text-xs text-gray-500">
                {userRole === 'admin' && 'admin@company.com'}
                {userRole === 'manager' && 'manager@company.com'}
                {userRole === 'accountant' && 'accountant@company.com'}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  // Chuyển đến profile page dựa trên role
                  if (userRole === 'employee') {
                    navigate('/employee/profile');
                  } else {
                    navigate('/profile');
                  }
                }}
                className={`h-8 w-8 ${currentTheme.badge} rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}
                title="Xem hồ sơ"
              >
                <User className="h-5 w-5 text-white" />
              </button>
              
              <button
                onClick={onLogout}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                title="Đăng xuất"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


