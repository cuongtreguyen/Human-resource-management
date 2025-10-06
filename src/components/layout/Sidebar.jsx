import React from 'react';
import { Link } from 'react-router-dom';
import { X, Users, UserPlus, Calendar, Clock, DollarSign, FileText, Settings, Home, BarChart3, MessageCircle, CheckSquare, User, Shield, Bell, UserCheck, Activity } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentPath }) => {
  const navigationGroups = [
    {
      title: 'DASHBOARD',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
      ]
    },
    {
      title: 'USER MANAGEMENT',
      items: [
        { name: 'Internal Chat', href: '/chat', icon: MessageCircle },
        { name: 'Face Recognition Portal', href: '/face-recognition', icon: User },
      ]
    },
    {
      title: 'EMPLOYEE MANAGEMENT',
      items: [
        { name: 'Employee List', href: '/employees', icon: Users },
        { name: 'Add Employee', href: '/employees/add', icon: UserPlus },
        { name: 'Export Data', href: '/employees/export', icon: FileText },
      ]
    },
    {
      title: 'ATTENDANCE MANAGEMENT',
      items: [
        { name: 'Attendance List', href: '/attendance', icon: Clock },
        { name: 'Attendance Creation', href: '/attendance/create', icon: Calendar },
      ]
    },
    {
      title: 'PAYROLL MANAGEMENT',
      items: [
        { name: 'Payroll List', href: '/payroll', icon: DollarSign },
        { name: 'Financial Policy', href: '/payroll/policies', icon: FileText },
      ]
    },
    {
      title: 'LEAVE MANAGEMENT',
      items: [
        { name: 'Leave Management', href: '/leaves', icon: Calendar },
        { name: 'Create Leave', href: '/leaves/create', icon: UserPlus },
        { name: 'Task Delegation', href: '/leaves/delegation', icon: Users },
      ]
    },
    {
      title: 'SYSTEM MANAGEMENT',
      items: [
        { name: 'Task Management', href: '/tasks', icon: CheckSquare },
        { name: 'Documents', href: '/documents', icon: FileText },
        { name: 'Reports', href: '/reports', icon: BarChart3 },
        { name: 'Notifications', href: '/notifications', icon: Bell },
        { name: 'Role Management', href: '/admin/roles', icon: Shield },
        { name: 'User List', href: '/admin/users', icon: UserCheck },
        { name: 'Logs Monitor', href: '/admin/logs', icon: Activity },
        { name: 'Settings', href: '/settings', icon: Settings },
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
      <div className={`fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 lg:hidden">
          <h1 className="text-xl font-semibold text-gray-900">HR Management</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
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
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@company.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;


