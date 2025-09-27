import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const location = useLocation();

  const primaryNavItems = [
    { name: 'Bảng điều khiển', path: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Quản lý nhân viên', path: '/team-directory', icon: 'Users' },
    { name: 'Hồ sơ cá nhân', path: '/my-profile', icon: 'User' },
    { name: 'Trung tâm công ty', path: '/company-hub', icon: 'Building2' },
  ];

  const secondaryNavItems = [
    { name: 'Cài đặt', path: '/settings', icon: 'Settings' },
    { name: 'Trợ giúp', path: '/help', icon: 'HelpCircle' },
    { name: 'Quản trị', path: '/admin', icon: 'Shield' },
  ];

  const isActivePath = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMoreMenu = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-gray-200 shadow-soft">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300">
                <Icon name="Users" size={18} color="white" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse-soft"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground tracking-tight">
                Hệ thống quản lý nhân sự
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Công việc trở nên tuyệt vời
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-muted/50 hover:scale-105 ${
                isActivePath(item?.path)
                  ? 'bg-primary/10 text-primary shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon 
                name={item?.icon} 
                size={16} 
                className={`transition-colors duration-300 ${
                  isActivePath(item?.path) ? 'text-primary' : 'text-current'
                }`}
              />
              <span>{item?.name}</span>
            </Link>
          ))}

          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMoreMenu}
              className={`flex items-center space-x-2 ${
                isMoreMenuOpen ? 'bg-muted/50' : ''
              }`}
            >
              <Icon name="MoreHorizontal" size={16} />
              <span>Thêm</span>
            </Button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-gray-200 rounded-lg shadow-strong animate-fade-in">
                <div className="py-2">
                  {secondaryNavItems?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      onClick={() => setIsMoreMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200"
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Icon name="Bell" size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse-soft"></span>
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-secondary to-muted rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground">Nguyễn Văn A</p>
              <p className="text-xs text-muted-foreground">Trưởng phòng HR</p>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="lg:hidden"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-gray-200 animate-fade-in">
          <nav className="px-6 py-4 space-y-2">
            {primaryNavItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActivePath(item?.path)
                    ? 'bg-primary/10 text-primary shadow-soft'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon 
                  name={item?.icon} 
                  size={18} 
                  className={`transition-colors duration-300 ${
                    isActivePath(item?.path) ? 'text-primary' : 'text-current'
                  }`}
                />
                <span>{item?.name}</span>
              </Link>
            ))}

            <div className="border-t border-gray-200 pt-4 mt-4">
              {secondaryNavItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200"
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
          style={{ top: '64px' }}
        ></div>
      )}
      {/* Overlay for more menu */}
      {isMoreMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMoreMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;
