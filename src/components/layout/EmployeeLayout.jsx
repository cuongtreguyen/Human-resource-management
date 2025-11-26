



// import React, { useState, useCallback, useRef } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { 
//   Home, 
//   Calendar, 
//   FileText, 
//   DollarSign, 
//   CheckSquare, 
//   User, 
//   MessageCircle,
//   TrendingUp,
//   BookOpen,
//   Shield,
//   HelpCircle,
//   LogOut,
//   Menu,
//   X,
//   ChevronLeft,
//   ChevronRight
// } from 'lucide-react';
// import { clearRole } from '../../utils/auth';

// const EmployeeLayout = ({ children }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const isTogglingRef = useRef(false);

//   const menuItems = [
//     { icon: Home, label: 'Trang chủ', path: '/employee' },
//     { icon: Calendar, label: 'Chấm công', path: '/employee/attendance' },
//     { icon: FileText, label: 'Nghỉ phép', path: '/employee/leave' },
//     { icon: DollarSign, label: 'Bảng lương', path: '/employee/payroll' },
//     { icon: CheckSquare, label: 'Nhiệm vụ', path: '/employee/tasks' },
//     { icon: BookOpen, label: 'Tài liệu', path: '/employee/documents' },
//     { icon: User, label: 'Hồ sơ', path: '/employee/profile' },
//     { icon: MessageCircle, label: 'Chat', path: '/employee/chat' },
//     { icon: TrendingUp, label: 'Hiệu suất', path: '/employee/performance' },
//     { icon: BookOpen, label: 'Đào tạo', path: '/employee/training' },
//     { icon: Shield, label: 'Phúc lợi', path: '/employee/benefits' },
//   ];

//   const handleLogout = () => {
//     clearRole();
//     navigate('/login');
//   };

//   // Toggle sidebar - đơn giản và hiệu quả
//   const handleToggleSidebar = useCallback((e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
    
//     // Ngăn double click bằng cách check lock ngay lập tức
//     if (isTogglingRef.current) {
//       return;
//     }
    
//     // Set lock ngay lập tức
//     isTogglingRef.current = true;
    
//     // Toggle state
//     setSidebarOpen(prev => !prev);
    
//     // Unlock sau một khoảng thời gian ngắn
//     setTimeout(() => {
//       isTogglingRef.current = false;
//     }, 200);
//   }, []);

//   const handleCloseSidebar = useCallback((e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
    
//     // Ngăn double click
//     if (isTogglingRef.current) {
//       return;
//     }
    
//     isTogglingRef.current = true;
    
//     // Đóng sidebar - sử dụng functional update để tránh dependency
//     setSidebarOpen(prev => {
//       if (!prev) return prev; // Đã đóng rồi thì không làm gì
//       return false;
//     });
    
//     setTimeout(() => {
//       isTogglingRef.current = false;
//     }, 200);
//   }, []);

//   const handleOpenSidebar = useCallback((e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
    
//     // Ngăn double click
//     if (isTogglingRef.current) {
//       return;
//     }
    
//     isTogglingRef.current = true;
    
//     // Mở sidebar - sử dụng functional update để tránh dependency
//     setSidebarOpen(prev => {
//       if (prev) return prev; // Đã mở rồi thì không làm gì
//       return true;
//     });
    
//     setTimeout(() => {
//       isTogglingRef.current = false;
//     }, 200);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar */}
//       <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-xl flex flex-col justify-between transition-all duration-300 ease-in-out ${
//         sidebarOpen ? 'w-64' : '-translate-x-full'
//       }`}>
//         {/* Header */}
//         <div className="flex-1 overflow-y-auto">
//           <div className="flex items-center justify-between h-16 bg-gradient-to-r from-purple-600 to-purple-700 px-4">
//             <h1 className="text-white text-xl font-bold">Employee Portal</h1>
//             <button
//               onClick={handleCloseSidebar}
//               className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors flex-shrink-0"
//               title="Thu gọn"
//               type="button"
//             >
//               <ChevronLeft size={20} />
//             </button>
//           </div>

//           {/* Menu */}
//           {sidebarOpen && (
//             <nav className="mt-6 px-4 space-y-2">
//               {menuItems.map((item, index) => {
//                 const Icon = item.icon;
//                 const isActive = location.pathname === item.path;
//                 return (
//                   <button
//                     key={index}
//                     onClick={() => navigate(item.path)}
//                     className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
//                       isActive
//                         ? 'bg-purple-100 text-purple-700 border-r-4 border-purple-600'
//                         : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
//                     }`}
//                   >
//                     <Icon
//                       size={20}
//                       className={`mr-3 transition-transform duration-200 group-hover:scale-110 ${
//                         isActive ? 'text-purple-700' : 'text-gray-500'
//                       }`}
//                     />
//                     {item.label}
//                   </button>
//                 );
//               })}
//             </nav>
//           )}
//         </div>

//         {/* Bottom section: Hỗ trợ + Đăng xuất */}
//         {sidebarOpen && (
//           <div className="px-4 mb-4 space-y-2">
//             <button
//               onClick={() => navigate('/employee/support')}
//               className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200 group"
//             >
//               <HelpCircle size={20} className="mr-3 group-hover:scale-110 transition-transform duration-200" />
//               Hỗ trợ
//             </button>

//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
//             >
//               <LogOut size={20} className="mr-3 group-hover:scale-110 transition-transform duration-200" />
//               Đăng xuất
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Toggle Button khi sidebar đóng - chỉ hiển thị trên desktop */}
//       {!sidebarOpen && (
//         <button
//           onClick={handleOpenSidebar}
//           className="hidden lg:flex fixed left-4 top-4 z-40 p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 hover:scale-110 items-center justify-center"
//           title="Mở sidebar"
//           type="button"
//         >
//           <Menu size={24} />
//         </button>
//       )}

//       {/* Main content */}
//       <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
//         {/* Mobile menu button */}
//         <div className="lg:hidden">
//           {/* <button
//             className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
//             onClick={handleToggleSidebar}
//             type="button"
//           >
//             {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
//           </button> */}
//         </div>

//         {/* Page content */}
//         <main className="p-4 lg:p-8">{children || <Outlet />}</main>
//       </div>
//     </div>
//   );
// };

// export default EmployeeLayout;


// import React, { useState, useCallback, useRef } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { 
//   Home, 
//   Calendar, 
//   FileText, 
//   DollarSign, 
//   CheckSquare, 
//   User, 
//   MessageCircle,
//   TrendingUp,
//   BookOpen,
//   Shield,
//   HelpCircle,
//   LogOut,
//   ChevronLeft,
//   Menu
// } from 'lucide-react';
// import { clearRole } from '../../utils/auth';

// const EmployeeLayout = ({ children }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // 🧠 Khởi tạo state từ localStorage ngay từ đầu để tránh race condition
//   const getInitialSidebarState = () => {
//     try {
//       const savedState = localStorage.getItem('sidebarOpen');
//       if (savedState !== null) {
//         return JSON.parse(savedState);
//       }
//     } catch (error) {
//       console.error('Error reading sidebar state from localStorage:', error);
//     }
//     return true; // Default: sidebar mở
//   };
  
//   const [sidebarOpen, setSidebarOpen] = useState(getInitialSidebarState);
//   const isTogglingRef = useRef(false);

//   const menuItems = [
//     { icon: Home, label: 'Trang chủ', path: '/employee' },
//     { icon: Calendar, label: 'Chấm công', path: '/employee/attendance' },
//     { icon: FileText, label: 'Nghỉ phép', path: '/employee/leave' },
//     { icon: DollarSign, label: 'Bảng lương', path: '/employee/payroll' },
//     { icon: CheckSquare, label: 'Nhiệm vụ', path: '/employee/tasks' },
//     { icon: BookOpen, label: 'Tài liệu', path: '/employee/documents' },
//     { icon: User, label: 'Hồ sơ', path: '/employee/profile' },
//     { icon: MessageCircle, label: 'Chat', path: '/employee/chat' },
//     { icon: TrendingUp, label: 'Hiệu suất', path: '/employee/performance' },
//     { icon: BookOpen, label: 'Đào tạo', path: '/employee/training' },
//     { icon: Shield, label: 'Phúc lợi', path: '/employee/benefits' },
//   ];

//   const handleLogout = () => {
//     clearRole();
//     navigate('/login');
//   };

//   // 🟣 Toggle sidebar có lưu trạng thái vào localStorage
//   const handleToggleSidebar = useCallback((e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
//     if (isTogglingRef.current) return;

//     isTogglingRef.current = true;

//     setSidebarOpen(prev => {
//       const newState = !prev;
//       localStorage.setItem('sidebarOpen', JSON.stringify(newState));
//       return newState;
//     });

//     setTimeout(() => {
//       isTogglingRef.current = false;
//     }, 200);
//   }, []);

//   // 🟢 Khi đóng sidebar (ChevronLeft)
//   const handleCloseSidebar = useCallback((e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
//     if (isTogglingRef.current) return;

//     isTogglingRef.current = true;
//     setSidebarOpen(prev => {
//       if (!prev) return prev;
//       localStorage.setItem('sidebarOpen', 'false');
//       return false;
//     });

//     setTimeout(() => {
//       isTogglingRef.current = false;
//     }, 200);
//   }, []);

//   // 🟢 Khi mở sidebar
//   const handleOpenSidebar = useCallback((e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
//     if (isTogglingRef.current) return;

//     isTogglingRef.current = true;
//     setSidebarOpen(prev => {
//       if (prev) return prev;
//       localStorage.setItem('sidebarOpen', 'true');
//       return true;
//     });

//     setTimeout(() => {
//       isTogglingRef.current = false;
//     }, 200);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar */}
//       <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-xl flex flex-col justify-between transition-all duration-300 ease-in-out ${
//         sidebarOpen ? 'w-64' : '-translate-x-full'
//       }`}>
//         {/* Header */}
//         <div className="flex-1 overflow-y-auto">
//           <div className="flex items-center justify-between h-16 bg-gradient-to-r from-purple-600 to-purple-700 px-4">
//             <h1 className="text-white text-xl font-bold">Employee Portal</h1>
//             <button
//               onClick={handleCloseSidebar}
//               className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors flex-shrink-0"
//               title="Thu gọn"
//               type="button"
//             >
//               <ChevronLeft size={20} />
//             </button>
//           </div>

//           {/* Menu */}
//           {sidebarOpen && (
//             <nav className="mt-6 px-4 space-y-2">
//               {menuItems.map((item, index) => {
//                 const Icon = item.icon;
//                 const isActive = location.pathname === item.path;
//                 return (
//                   <button
//                     key={index}
//                     onClick={() => navigate(item.path)}
//                     className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
//                       isActive
//                         ? 'bg-purple-100 text-purple-700 border-r-4 border-purple-600'
//                         : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
//                     }`}
//                   >
//                     <Icon
//                       size={20}
//                       className={`mr-3 transition-transform duration-200 group-hover:scale-110 ${
//                         isActive ? 'text-purple-700' : 'text-gray-500'
//                       }`}
//                     />
//                     {item.label}
//                   </button>
//                 );
//               })}
//             </nav>
//           )}
//         </div>

//         {/* Bottom section */}
//         {sidebarOpen && (
//           <div className="px-4 mb-4 space-y-2">
//             <button
//               onClick={() => navigate('/employee/support')}
//               className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200 group"
//             >
//               <HelpCircle size={20} className="mr-3 group-hover:scale-110 transition-transform duration-200" />
//               Hỗ trợ
//             </button>

//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
//             >
//               <LogOut size={20} className="mr-3 group-hover:scale-110 transition-transform duration-200" />
//               Đăng xuất
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Toggle Button khi sidebar đóng */}
//       {!sidebarOpen && (
//         <button
//           onClick={handleOpenSidebar}
//           className="hidden lg:flex fixed left-4 top-4 z-40 p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 hover:scale-110 items-center justify-center"
//           title="Mở sidebar"
//           type="button"
//         >
//           <Menu size={24} />
//         </button>
//       )}

//       {/* Main content */}
//       <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
//         <main className="p-4 lg:p-8">{children || <Outlet />}</main>
//       </div>
//     </div>
//   );
// };

// export default EmployeeLayout;


















import React, { useState, useCallback, useRef } from 'react';
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
  LogOut,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { clearRole } from '../../utils/auth';

const EmployeeLayout = ({ children, sidebar = true }) => {
  // sidebar = true  → hiện sidebar (mặc định)
  // sidebar = false → ẩn hoàn toàn sidebar (dùng cho EmployeePortal)

  const navigate = useNavigate();
  const location = useLocation();
  const initializedRef = useRef(false);
  const isTogglingRef = useRef(false);

  // Lazy init từ localStorage (chỉ đọc 1 lần)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      try {
        const saved = localStorage.getItem('sidebarOpen');
        if (saved !== null) return JSON.parse(saved);
      } catch (e) {
        console.error('Error reading sidebar state:', e);
      }
    }
    return true; // mặc định mở
  });

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

  const handleToggleSidebar = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (isTogglingRef.current) return;

      isTogglingRef.current = true;
      setSidebarOpen((prev) => {
        const newState = !prev;
        try {
          localStorage.setItem('sidebarOpen', JSON.stringify(newState));
        } catch (err) {
          console.error(err);
        }
        return newState;
      });

      setTimeout(() => {
        isTogglingRef.current = false;
      }, 300);
    },
    []
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ========== SIDEBAR - CHỈ HIỆN KHI sidebar !== false ========== */}
      {sidebar && (
        <aside
          className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-lg ${
            sidebarOpen ? 'w-64' : 'w-16'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {sidebarOpen ? (
              <>
                <h1 className="text-xl font-bold text-purple-600">Employee Portal</h1>
                <button
                  onClick={handleToggleSidebar}
                  className="p-1 hover:bg-purple-50 rounded-lg transition-colors"
                  aria-label="Thu gọn sidebar"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
              </>
            ) : (
              <button
                onClick={handleToggleSidebar}
                className="p-1 hover:bg-purple-50 rounded-lg transition-colors mx-auto"
                aria-label="Mở rộng sidebar"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-3 py-3 mb-1 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-purple-100 text-purple-700 border-r-4 border-purple-600'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="ml-3 whitespace-nowrap">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-gray-200 p-2">
            <button
              onClick={() => navigate('/employee/support')}
              className="w-full flex items-center px-3 py-3 mb-1 text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200 group"
            >
              <HelpCircle className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="ml-3 whitespace-nowrap">Hỗ trợ</span>}
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="ml-3 whitespace-nowrap">Đăng xuất</span>}
            </button>
          </div>
        </aside>
      )}

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 overflow-auto">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default EmployeeLayout;