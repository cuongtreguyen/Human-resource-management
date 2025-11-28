import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X, Users, UserPlus, Calendar, Clock, DollarSign, FileText, Settings, Home,
  BarChart3, MessageCircle, CheckSquare, User, Bell, Activity, Heart, Award,
  HelpCircle, LogOut, ChevronLeft, Menu, BookOpen, TrendingUp, Shield
} from 'lucide-react';
import { getRole, clearRole } from '../../utils/auth';

const Sidebar = ({ sidebarOpen: mobileSidebarOpen, setSidebarOpen: setMobileSidebarOpen, currentPath }) => {
  const userRole = getRole();
  const navigate = useNavigate();
  const isTogglingRef = useRef(false);

  // Desktop sidebar state - lưu vào localStorage
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('desktopSidebarOpen');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading sidebar state:', e);
    }
    return true;
  });

  // Màu sắc theo role
  const themeColors = {
    admin: {
      primary: 'blue',
      headerBg: 'bg-gradient-to-r from-blue-600 to-blue-700',
      activeBg: 'bg-blue-100',
      activeText: 'text-blue-700',
      activeBorder: 'border-blue-600',
      activeIcon: 'text-blue-700',
      hoverBg: 'hover:bg-blue-50',
      hoverText: 'hover:text-blue-700',
      footerBadge: 'bg-blue-500',
      toggleBtnBg: 'bg-gradient-to-r from-blue-600 to-indigo-600',
      toggleBtnHover: 'hover:from-blue-700 hover:to-indigo-700',
    },
    accountant: {
      primary: 'emerald',
      headerBg: 'bg-gradient-to-r from-emerald-600 to-emerald-700',
      activeBg: 'bg-emerald-100',
      activeText: 'text-emerald-700',
      activeBorder: 'border-emerald-600',
      activeIcon: 'text-emerald-700',
      hoverBg: 'hover:bg-emerald-50',
      hoverText: 'hover:text-emerald-700',
      footerBadge: 'bg-emerald-500',
      toggleBtnBg: 'bg-gradient-to-r from-emerald-600 to-teal-600',
      toggleBtnHover: 'hover:from-emerald-700 hover:to-teal-700',
    },
    manager: {
      primary: 'purple',
      headerBg: 'bg-gradient-to-r from-purple-600 to-purple-700',
      activeBg: 'bg-purple-100',
      activeText: 'text-purple-700',
      activeBorder: 'border-purple-600',
      activeIcon: 'text-purple-700',
      hoverBg: 'hover:bg-purple-50',
      hoverText: 'hover:text-purple-700',
      footerBadge: 'bg-purple-500',
      toggleBtnBg: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      toggleBtnHover: 'hover:from-purple-700 hover:to-indigo-700',
    },
    employee: {
      primary: 'orange',
      headerBg: 'bg-gradient-to-r from-orange-500 to-orange-600',
      activeBg: 'bg-orange-100',
      activeText: 'text-orange-700',
      activeBorder: 'border-orange-600',
      activeIcon: 'text-orange-700',
      hoverBg: 'hover:bg-orange-50',
      hoverText: 'hover:text-orange-700',
      footerBadge: 'bg-orange-500',
      toggleBtnBg: 'bg-gradient-to-r from-orange-500 to-amber-500',
      toggleBtnHover: 'hover:from-orange-600 hover:to-amber-600',
    }
  };

  const currentTheme = themeColors[userRole] || themeColors.admin;

  // Role labels
  const roleLabels = {
    admin: 'Quản trị viên',
    manager: 'Quản lý',
    accountant: 'Kế toán',
    employee: 'Nhân viên'
  };

  // Navigation items theo role
  const getNavigationItems = () => {
    if (userRole === 'employee') {
      return [
        { name: 'Trang chủ', href: '/employee', icon: Home },
        { name: 'Chấm công', href: '/employee/attendance', icon: Calendar },
        { name: 'Nghỉ phép', href: '/employee/leave', icon: FileText },
        { name: 'Bảng lương', href: '/employee/payroll', icon: DollarSign },
        { name: 'Nhiệm vụ', href: '/employee/tasks', icon: CheckSquare },
        { name: 'Đánh giá của tôi', href: '/employee/evaluation', icon: Award },
        { name: 'Tài liệu', href: '/employee/documents', icon: BookOpen },
        { name: 'Hồ sơ', href: '/employee/profile', icon: User },
        { name: 'Chat', href: '/employee/chat', icon: MessageCircle },
        { name: 'Phúc lợi', href: '/employee/benefits', icon: Shield },
      ];
    }

    // Admin, Manager, Accountant navigation
    const allItems = [
      { name: 'Trang chủ', href: '/dashboard', icon: Home, allowedRoles: ['admin', 'manager', 'accountant'] },
      { name: 'Chat nội bộ', href: '/chat', icon: MessageCircle, allowedRoles: ['admin', 'manager', 'accountant'] },
      { name: 'Danh sách nhân viên', href: '/employees', icon: Users, allowedRoles: ['admin', 'manager', 'accountant'] },
      { name: 'Danh sách chấm công', href: '/attendance', icon: Clock, allowedRoles: ['admin', 'accountant'] },
      { name: 'Danh sách lương', href: '/payroll', icon: DollarSign, allowedRoles: ['admin', 'manager', 'accountant'] },
      { name: 'Chính sách tài chính', href: '/payroll/policies', icon: FileText, allowedRoles: ['accountant'] },
      { name: 'Duyệt đơn nghỉ phép', href: '/leaves', icon: Calendar, allowedRoles: ['manager'] },
      { name: 'Quản lý công việc', href: '/tasks', icon: CheckSquare, allowedRoles: ['manager'] },
      { name: 'Đánh giá nhân viên', href: '/evaluations', icon: Award, allowedRoles: ['admin', 'manager'] },
      { name: 'Tài liệu', href: '/documents', icon: FileText, allowedRoles: ['manager', 'accountant'] },
      { name: 'Báo cáo', href: '/reports', icon: BarChart3, allowedRoles: ['manager', 'accountant'] },
      { name: 'Thông báo', href: '/notifications', icon: Bell, allowedRoles: ['admin', 'manager', 'accountant'] },
      { name: 'Yêu cầu hỗ trợ', href: '/admin/support-tickets', icon: HelpCircle, allowedRoles: ['admin', 'manager'] },
      { name: 'Phúc lợi & Bảo hiểm', href: '/admin/benefits', icon: Heart, allowedRoles: ['accountant'] },
      { name: 'Nhật ký hệ thống', href: '/admin/logs', icon: Activity, allowedRoles: ['admin'] },
      { name: 'Cài đặt', href: '/settings', icon: Settings, allowedRoles: ['admin'] },
    ];

    return allItems.filter(item => item.allowedRoles?.includes(userRole));
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    clearRole();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleToggleSidebar = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isTogglingRef.current) return;

    isTogglingRef.current = true;
    setDesktopSidebarOpen((prev) => {
      const newState = !prev;
      try {
        localStorage.setItem('desktopSidebarOpen', JSON.stringify(newState));
      } catch (err) {
        console.error(err);
      }
      return newState;
    });

    setTimeout(() => {
      isTogglingRef.current = false;
    }, 300);
  }, []);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar for Desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-lg ${desktopSidebarOpen ? 'w-64' : 'w-16'
          }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between h-16 px-4 ${currentTheme.headerBg}`}>
          {desktopSidebarOpen ? (
            <>
              <h1 className="text-lg font-bold text-white truncate">
                {roleLabels[userRole] || 'HR System'}
              </h1>
              <button
                onClick={handleToggleSidebar}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Thu gọn sidebar"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
            </>
          ) : (
            <button
              onClick={handleToggleSidebar}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors mx-auto"
              aria-label="Mở rộng sidebar"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`w-full flex items-center px-3 py-3 mb-1 text-sm font-medium rounded-lg transition-all duration-200 group ${isActive
                  ? `${currentTheme.activeBg} ${currentTheme.activeText} border-r-4 ${currentTheme.activeBorder}`
                  : `text-gray-600 ${currentTheme.hoverBg} ${currentTheme.hoverText}`
                  }`}
                title={!desktopSidebarOpen ? item.name : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? currentTheme.activeIcon : 'text-gray-500'}`} />
                {desktopSidebarOpen && <span className="ml-3 whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-gray-200 p-2">
          {userRole === 'employee' && (
            <Link
              to="/employee/support"
              className={`w-full flex items-center px-3 py-3 mb-1 text-sm font-medium text-gray-600 ${currentTheme.hoverText} ${currentTheme.hoverBg} rounded-lg transition-all duration-200 group`}
              title={!desktopSidebarOpen ? 'Hỗ trợ' : undefined}
            >
              <HelpCircle className="w-5 h-5 flex-shrink-0" />
              {desktopSidebarOpen && <span className="ml-3 whitespace-nowrap">Hỗ trợ</span>}
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
            title={!desktopSidebarOpen ? 'Đăng xuất' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {desktopSidebarOpen && <span className="ml-3 whitespace-nowrap">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Sidebar for Mobile */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Mobile Header */}
        <div className={`flex items-center justify-between h-16 px-4 ${currentTheme.headerBg}`}>
          <h1 className="text-lg font-bold text-white">
            {roleLabels[userRole] || 'HR System'}
          </h1>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-2 rounded-md text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`w-full flex items-center px-3 py-3 mb-1 text-sm font-medium rounded-lg transition-all duration-200 group ${isActive
                  ? `${currentTheme.activeBg} ${currentTheme.activeText} border-r-4 ${currentTheme.activeBorder}`
                  : `text-gray-600 ${currentTheme.hoverBg} ${currentTheme.hoverText}`
                  }`}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? currentTheme.activeIcon : 'text-gray-500'}`} />
                <span className="ml-3 whitespace-nowrap">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Bottom section */}
        <div className="border-t border-gray-200 p-2">
          {userRole === 'employee' && (
            <Link
              to="/employee/support"
              className={`w-full flex items-center px-3 py-3 mb-1 text-sm font-medium text-gray-600 ${currentTheme.hoverText} ${currentTheme.hoverBg} rounded-lg transition-all duration-200 group`}
              onClick={() => setMobileSidebarOpen(false)}
            >
              <HelpCircle className="w-5 h-5 flex-shrink-0" />
              <span className="ml-3 whitespace-nowrap">Hỗ trợ</span>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="ml-3 whitespace-nowrap">Đăng xuất</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
