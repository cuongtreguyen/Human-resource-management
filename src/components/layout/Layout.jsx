import React, { useState, createContext, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const LayoutContext = createContext(false);

const Layout = ({ children }) => {
  const isInsideLayout = useContext(LayoutContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (isInsideLayout) {
    return children || <Outlet />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <LayoutContext.Provider value={true}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPath={location.pathname}
        />

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <Header
            onLogout={handleLogout}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            onNotificationClick={() => navigate('/notifications')}
          />

          {/* Page content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
};

export default Layout;
