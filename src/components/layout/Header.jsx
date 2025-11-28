import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { getRole } from '../../utils/auth';

const Header = ({ onLogout, onMenuClick, onNotificationClick }) => {
  const userRole = getRole();

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
          <button
            onClick={onNotificationClick}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative cursor-pointer z-10"
            title="Thông báo"
            type="button"
          >
            <Bell className="h-6 w-6 pointer-events-none" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full pointer-events-none"></span>
          </button>

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
              <div className={`h-8 w-8 ${currentTheme.badge} rounded-full flex items-center justify-center`}>
                <User className="h-5 w-5 text-white" />
              </div>
              
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


