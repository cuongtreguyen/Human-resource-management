import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      category: 'Chính',
      items: [
        { name: 'Bảng điều khiển', path: '/dashboard', icon: 'LayoutDashboard', description: 'Tổng quan & thống kê' },
        { name: 'Quản lý nhân viên', path: '/team-directory', icon: 'Users', description: 'H�?sơ nhân viên' },
        { name: 'H�?sơ cá nhân', path: '/my-profile', icon: 'User', description: 'Cài đặt cá nhân' },
        { name: 'Trung tâm công ty', path: '/company-hub', icon: 'Building2', description: 'Thông tin t�?chức' },
      ]
    },
    {
      category: 'Công c�?,
      items: [
        { name: 'Phân tích', path: '/analytics', icon: 'BarChart3', description: 'Ch�?s�?hiệu suất' },
        { name: 'Báo cáo', path: '/reports', icon: 'FileText', description: 'Tạo báo cáo' },
        { name: 'Lịch', path: '/calendar', icon: 'Calendar', description: 'Lịch trình & s�?kiện' },
      ]
    },
    {
      category: 'Cài đặt',
      items: [
        { name: 'Cài đặt', path: '/settings', icon: 'Settings', description: 'Tùy chọn ứng dụng' },
        { name: 'Tr�?giúp', path: '/help', icon: 'HelpCircle', description: 'H�?tr�?& tài liệu' },
        { name: 'Quản tr�?, path: '/admin', icon: 'Shield', description: 'Quản lý h�?thống' },
      ]
    }
  ];

  const isActivePath = (path) => location?.pathname === path;
  const shouldShowContent = !isCollapsed || isHovered;

  return (
    <>
      <aside
        className={`fixed left-0 top-16 bottom-0 z-40 bg-card border-r border-gray-200 shadow-medium transition-all duration-300 ease-smooth ${
          isCollapsed && !isHovered ? 'w-16' : 'w-64'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {shouldShowContent && (
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-success rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={16} color="white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Truy cập nhanh</h2>
                <p className="text-xs text-muted-foreground">Điều hướng hiệu qu�?/p>
              </div>
            </div>
          )}
          
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className={`transition-all duration-300 ${
                isCollapsed && !isHovered ? 'mx-auto' : ''
              }`}
            >
              <Icon 
                name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                size={16} 
                className="transition-transform duration-300"
              />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navigationItems?.map((section, sectionIndex) => (
            <div key={section?.category} className="mb-6">
              {shouldShowContent && (
                <div className="px-4 mb-3 animate-fade-in">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section?.category}
                  </h3>
                </div>
              )}
              
              <div className="space-y-1 px-2">
                {section?.items?.map((item) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    className={`group flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      isActivePath(item?.path)
                        ? 'bg-primary/10 text-primary shadow-soft border-l-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <div className="relative">
                      <Icon 
                        name={item?.icon} 
                        size={18} 
                        className={`transition-all duration-300 ${
                          isActivePath(item?.path) 
                            ? 'text-primary animate-pulse-soft' :'text-current group-hover:scale-110'
                        }`}
                      />
                      {isActivePath(item?.path) && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-bounce-gentle"></div>
                      )}
                    </div>
                    
                    {shouldShowContent && (
                      <div className="flex-1 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <span className="truncate">{item?.name}</span>
                          {isActivePath(item?.path) && (
                            <Icon name="ChevronRight" size={14} className="text-primary" />
                          )}
                        </div>
                        {!isCollapsed && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {item?.description}
                          </p>
                        )}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-4">
          {shouldShowContent ? (
            <div className="animate-fade-in">
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-warning to-accent rounded-full flex items-center justify-center">
                  <Icon name="Sparkles" size={14} color="white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">Mẹo hay</p>
                  <p className="text-xs text-muted-foreground">Dùng Ctrl+K đ�?tìm kiếm nhanh</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-warning to-accent rounded-full flex items-center justify-center animate-pulse-soft">
                <Icon name="Sparkles" size={14} color="white" />
              </div>
            </div>
          )}
        </div>
      </aside>
      {/* Main content offset */}
      <div className={`transition-all duration-300 ${
        isCollapsed && !isHovered ? 'ml-16' : 'ml-64'
      }`}>
        {/* This div ensures proper spacing for main content */}
      </div>
    </>
  );
};

export default Sidebar;

