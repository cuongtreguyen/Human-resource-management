import React from 'react';
import { useNavigate } from 'react-router-dom';
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
    { icon: HelpCircle, label: 'Hỗ trợ', path: '/employee/support' },
  ];

  const handleLogout = () => {
    clearRole();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-center h-16 bg-gradient-to-r from-purple-600 to-purple-700">
          <h1 className="text-white text-xl font-bold">Employee Portal</h1>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.path;
              
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              Đăng xuất
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button
            className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
            onClick={() => {
              const sidebar = document.querySelector('.fixed.inset-y-0.left-0');
              sidebar.classList.toggle('-translate-x-full');
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
