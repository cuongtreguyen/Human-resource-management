import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      category: 'Dashboard',
      items: [
        { name: 'Dashboard', icon: '🏠', path: '/dashboard' }
      ]
    },
    {
      category: 'USER MANAGEMENT',
      items: [
        { name: 'My Profile', icon: '👤', path: '/profile' },
        { name: 'Internal Chat', icon: '💬', path: '/chat' },
        { name: 'Face Recognition Portal', icon: '👁️', path: '/face-recognition' }
      ]
    },
    {
      category: 'EMPLOYEE MANAGEMENT',
      items: [
        { name: 'Employee List', icon: '👥', path: '/employees' },
        { name: 'Add Employee', icon: '➕', path: '/employees/add' },
        { name: 'Export Data', icon: '📊', path: '/employees/export' }
      ]
    },
    {
      category: 'ATTENDANCE MANAGEMENT',
      items: [
        { name: 'Attendance List', icon: '📅', path: '/attendance' },
        { name: 'Attendance Creation', icon: '⏰', path: '/attendance/create' },
        { name: 'Attendance Summary', icon: '📈', path: '/attendance/summary' }
      ]
    },
    {
      category: 'PAYROLL MANAGEMENT',
      items: [
        { name: 'Payroll List', icon: '💰', path: '/payroll' },
        { name: 'Financial Policy', icon: '📄', path: '/payroll/policies' }
      ]
    },
    {
      category: 'REQUEST MANAGEMENT',
      items: [
        { name: 'Request List', icon: '📋', path: '/requests' },
        { name: 'Create Request', icon: '📝', path: '/requests/create' }
      ]
    },
    {
      category: 'LEAVE MANAGEMENT',
      items: [
        { name: 'Leave Management', icon: '📚', path: '/leaves' },
        { name: 'Create Leave', icon: '📜', path: '/leaves/create' }
      ]
    },
    {
      category: 'RECRUITMENT MANAGEMENT',
      items: [
        { name: 'Recruitment Management', icon: '💼', path: '/recruitment' },
        { name: 'Positions List', icon: '📋', path: '/recruitment/positions' },
        { name: 'Applications List', icon: '📄', path: '/recruitment/applications' }
      ]
    },
    {
      category: 'SYSTEM MANAGEMENT',
      items: [
        { name: 'User List', icon: '👥', path: '/admin/users' },
        { name: 'Role Management', icon: '⚙️', path: '/admin/roles' },
        { name: 'Logs Monitor', icon: '📊', path: '/admin/logs' }
      ]
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-200 flex flex-col z-40">
      {/* User Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <div>
            <p className="font-semibold text-gray-900">admin</p>
            <p className="text-sm text-gray-500">Administrator</p>
          </div>
          <button className="ml-auto text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3m8 16a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <p className="px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {section.category}
            </p>
            
            {section.category === 'Dashboard' ? (
              // Dashboard is special category
              section.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-purple-50 text-purple-600 border-r-2 border-purple-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))
            ) : (
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    to={item.path}
                    className={`flex items-center px-6 py-2 text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-purple-50 text-purple-600 border-r-2 border-purple-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-base mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
