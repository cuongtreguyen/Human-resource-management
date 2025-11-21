import React from 'react';
import { Link } from 'react-router-dom';
import { X, Users, UserPlus, Calendar, Clock, DollarSign, FileText, Settings, Home, BarChart3, MessageCircle, CheckSquare, User, Bell, Activity, Heart } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentPath }) => {
  const navigationGroups = [
    {
      title: 'BẢNG ĐIỀU KHIỂN',
      items: [
        { name: 'Trang chủ', href: '/dashboard', icon: Home },
      ]
    },
    {
      title: 'QUẢN LÝ NGƯỜI DÙNG',
      items: [
        { name: 'Chat nội bộ', href: '/chat', icon: MessageCircle },
        { name: 'Nhận diện khuôn mặt', href: '/face-recognition', icon: User },
      ]
    },
    {
      title: 'QUẢN LÝ NHÂN VIÊN',
      items: [
        { name: 'Danh sách nhân viên', href: '/employees', icon: Users },
        { name: 'Thêm nhân viên', href: '/employees/add', icon: UserPlus },
        { name: 'Xuất dữ liệu', href: '/employees/export', icon: FileText },
      ]
    },
    {
      title: 'QUẢN LÝ CHẤM CÔNG',
      items: [
        { name: 'Danh sách chấm công', href: '/attendance', icon: Clock },
        { name: 'Tạo chấm công', href: '/attendance/create', icon: Calendar },
      ]
    },
    {
      title: 'QUẢN LÝ LƯƠNG',
      items: [
        { name: 'Danh sách lương', href: '/payroll', icon: DollarSign },
        { name: 'Chính sách tài chính', href: '/payroll/policies', icon: FileText },
      ]
    },
    {
      title: 'QUẢN LÝ NGHỈ PHÉP',
      items: [
        { name: 'Quản lý nghỉ phép', href: '/leaves', icon: Calendar },
        { name: 'Tạo đơn nghỉ phép', href: '/leaves/create', icon: UserPlus },
        { name: 'Bàn giao công việc', href: '/leaves/delegation', icon: Users },
      ]
    },
    {
      title: 'QUẢN LÝ HỆ THỐNG',
      items: [
        { name: 'Quản lý công việc', href: '/tasks', icon: CheckSquare },
        { name: 'Tài liệu', href: '/documents', icon: FileText },
        { name: 'Báo cáo', href: '/reports', icon: BarChart3 },
        { name: 'Thông báo', href: '/notifications', icon: Bell },
        { name: 'Phúc lợi & Bảo hiểm', href: '/admin/benefits', icon: Heart },
        { name: 'Nhật ký hệ thống', href: '/admin/logs', icon: Activity },
        { name: 'Cài đặt', href: '/settings', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
            {navigationGroups.map((group) => (
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
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon
                          className={`mr-3 h-5 w-5 flex-shrink-0 ${
                            isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
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
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Quản trị viên</p>
              <p className="text-xs text-gray-500">admin@company.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;


