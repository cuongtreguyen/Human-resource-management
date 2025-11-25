import React from 'react';
import { Link } from 'react-router-dom';
import { X, Users, UserPlus, Calendar, Clock, DollarSign, FileText, Settings, Home, BarChart3, MessageCircle, CheckSquare, User, Bell, Activity, Heart, Award } from 'lucide-react';
import { getRole } from '../../utils/auth';

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentPath }) => {
  const userRole = getRole();

  // Màu sắc theo role
  const themeColors = {
    admin: {
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      activeBg: 'bg-blue-50',
      activeText: 'text-blue-700',
      activeBorder: 'border-blue-700',
      activeIcon: 'text-blue-500',
      footerBadge: 'bg-blue-500',
      hoverBg: 'hover:bg-blue-50',
    },
    accountant: {
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      activeBg: 'bg-emerald-50',
      activeText: 'text-emerald-700',
      activeBorder: 'border-emerald-700',
      activeIcon: 'text-emerald-500',
      footerBadge: 'bg-emerald-500',
      hoverBg: 'hover:bg-emerald-50',
    },
    manager: {
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      activeBg: 'bg-purple-50',
      activeText: 'text-purple-700',
      activeBorder: 'border-purple-700',
      activeIcon: 'text-purple-500',
      footerBadge: 'bg-purple-500',
      hoverBg: 'hover:bg-purple-50',
    }
  };

  const currentTheme = themeColors[userRole] || themeColors.admin;

  const navigationGroups = [
    {
      title: 'BẢNG ĐIỀU KHIỂN',
      items: [
        { name: 'Trang chủ', href: '/dashboard', icon: Home, allowedRoles: ['admin', 'manager', 'accountant'] },
      ]
    },
    {
      title: 'QUẢN LÝ NGƯỜI DÙNG',
      items: [
        { name: 'Chat nội bộ', href: '/chat', icon: MessageCircle, allowedRoles: ['admin', 'manager', 'accountant'] },
        { name: 'Nhận diện khuôn mặt', href: '/face-recognition', icon: User, allowedRoles: ['admin', 'manager', 'accountant'] },
      ]
    },
    {
      title: 'QUẢN LÝ NHÂN VIÊN',
      items: [
        { name: 'Danh sách nhân viên', href: '/employees', icon: Users, allowedRoles: ['admin', 'manager', 'accountant'] },
        { name: 'Xuất dữ liệu', href: '/employees/export', icon: FileText, allowedRoles: ['admin'] },
      ]
    },
    {
      title: 'QUẢN LÝ CHẤM CÔNG',
      items: [
        { name: 'Danh sách chấm công', href: '/attendance', icon: Clock, allowedRoles: ['admin', 'manager', 'accountant'] },
        { name: 'Tạo chấm công', href: '/attendance/create', icon: Calendar, allowedRoles: ['admin', 'manager', 'accountant'] },
      ]
    },
    {
      title: 'QUẢN LÝ LƯƠNG',
      items: [
        { name: 'Danh sách lương', href: '/payroll', icon: DollarSign, allowedRoles: ['admin', 'manager', 'accountant'] },
        { name: 'Chính sách tài chính', href: '/payroll/policies', icon: FileText, allowedRoles: ['admin', 'accountant'] },
      ]
    },
    {
      title: 'QUẢN LÝ NGHỈ PHÉP',
      items: [
        { name: 'Quản lý nghỉ phép', href: '/leaves', icon: Calendar, allowedRoles: ['admin', 'manager'] },
        { name: 'Tạo đơn nghỉ phép', href: '/leaves/create', icon: UserPlus, allowedRoles: ['manager'] }, // Chỉ Manager tạo đơn
      ]
    },
    {
      title: 'QUẢN LÝ CÔNG VIỆC',
      items: [
        { name: 'Quản lý công việc', href: '/tasks', icon: CheckSquare, allowedRoles: ['manager'] }, // Chỉ Manager
        { name: 'Bàn giao công việc', href: '/task-delegation', icon: Users, allowedRoles: ['admin', 'manager'] }, // Admin + Manager
      ]
    },
    {
      title: 'ĐÁNH GIÁ & PHÁT TRIỂN',
      items: [
        { name: 'Đánh giá nhân viên', href: '/evaluations', icon: Award, allowedRoles: ['admin', 'manager'] },
      ]
    },
    {
      title: 'QUẢN LÝ HỆ THỐNG',
      items: [
        { name: 'Tài liệu', href: '/documents', icon: FileText, allowedRoles: ['admin', 'manager', 'accountant'] },
        { name: 'Báo cáo', href: '/reports', icon: BarChart3, allowedRoles: ['admin', 'manager', 'accountant'] },
        { name: 'Thông báo', href: '/notifications', icon: Bell, allowedRoles: ['admin', 'manager', 'accountant'] },
        { name: 'Phúc lợi & Bảo hiểm', href: '/admin/benefits', icon: Heart, allowedRoles: ['admin', 'accountant'] }, // Admin + Accountant
        { name: 'Nhật ký hệ thống', href: '/admin/logs', icon: Activity, allowedRoles: ['admin'] },
        { name: 'Cài đặt', href: '/settings', icon: Settings, allowedRoles: ['admin'] },
      ]
    }
  ];

  // Filter navigation groups and items based on user role
  const filteredNavigationGroups = navigationGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.allowedRoles.includes(userRole))
    }))
    .filter(group => group.items.length > 0); // Remove empty groups

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 ${currentTheme.bg} shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:z-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 lg:hidden">
          <h1 className="text-xl font-semibold text-gray-900">Quản lý Nhân sự</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4 flex-1 overflow-y-auto">
          <div className="space-y-6">
            {filteredNavigationGroups.map((group) => (
              <div key={group.title}>
                {/* Group Title */}
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {group.title}
                </h3>

                {/* Group Items */}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = currentPath === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${isActive
                          ? `${currentTheme.activeBg} ${currentTheme.activeText} border-r-2 ${currentTheme.activeBorder}`
                          : `text-gray-700 ${currentTheme.hoverBg} hover:text-gray-900`
                          }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon
                          className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? currentTheme.activeIcon : 'text-gray-400 group-hover:text-gray-500'
                            }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`h-8 w-8 ${currentTheme.footerBadge} rounded-full flex items-center justify-center`}>
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;


