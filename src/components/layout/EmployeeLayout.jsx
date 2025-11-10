



import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  FileText, 
  DollarSign, 
  CheckSquare, 
  User, 
  MessageCircle,
  TrendingUp,
  BookOpen,
  Shield,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { clearRole } from '../../utils/auth';

const EmployeeLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Trang chủ', path: '/employee' },
    { icon: Calendar, label: 'Chấm công', path: '/employee/attendance' },
    { icon: FileText, label: 'Nghỉ phép', path: '/employee/leave' },
    { icon: DollarSign, label: 'Bảng lương', path: '/employee/payroll' },
    { icon: CheckSquare, label: 'Nhiệm vụ', path: '/employee/tasks' },
    { icon: BookOpen, label: 'Tài liệu', path: '/employee/documents' },
    { icon: User, label: 'Hồ sơ', path: '/employee/profile' },
    { icon: MessageCircle, label: 'Chat', path: '/employee/chat' },
    { icon: TrendingUp, label: 'Hiệu suất', path: '/employee/performance' },
    { icon: BookOpen, label: 'Đào tạo', path: '/employee/training' },
    { icon: Shield, label: 'Phúc lợi', path: '/employee/benefits' },
  ];

  const handleLogout = () => {
    clearRole();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex items-center justify-center h-16 bg-gradient-to-r from-purple-600 to-purple-700">
            <h1 className="text-white text-xl font-bold">Employee Portal</h1>
          </div>

          {/* Menu */}
          <nav className="mt-6 px-4 space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-purple-100 text-purple-700 border-r-4 border-purple-600'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <Icon
                    size={20}
                    className={`mr-3 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-purple-700' : 'text-gray-500'
                    }`}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom section: Hỗ trợ + Đăng xuất */}
        <div className="px-4 mb-4 space-y-2">
          <button
            onClick={() => navigate('/employee/support')}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200 group"
          >
            <HelpCircle size={20} className="mr-3 group-hover:scale-110 transition-transform duration-200" />
            Hỗ trợ
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
          >
            <LogOut size={20} className="mr-3 group-hover:scale-110 transition-transform duration-200" />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button
            className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
            onClick={() => {
              const sidebar = document.querySelector('.fixed.inset-y-0.left-0');
              sidebar.classList.toggle('-translate-x-full');
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children || <Outlet />}</main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
