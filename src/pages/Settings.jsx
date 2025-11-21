import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    companyName: 'HR Management System',
    companyEmail: 'hr@company.com',
    companyPhone: '+84 123 456 789',
    companyAddress: '123 Business Street, Ho Chi Minh City',
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'DD/MM/YYYY',
    language: 'vi',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordPolicy: 'medium'
    },
    system: {
      maintenanceMode: false,
      autoBackup: true,
      logLevel: 'info'
    }
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'Chung', icon: '⚙️' },
    { id: 'notifications', name: 'Thông báo', icon: '🔔' },
    { id: 'security', name: 'Bảo mật', icon: '🔒' },
    { id: 'system', name: 'Hệ thống', icon: '🖥️' }
  ];

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Đã lưu cài đặt thành công!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Lỗi khi lưu cài đặt. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleDirectSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Thông Tin Công Ty</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tên Công Ty</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => handleDirectSettingChange('companyName', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Công Ty</label>
            <input
              type="email"
              value={settings.companyEmail}
              onChange={(e) => handleDirectSettingChange('companyEmail', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Số Điện Thoại</label>
            <input
              type="tel"
              value={settings.companyPhone}
              onChange={(e) => handleDirectSettingChange('companyPhone', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Múi Giờ</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleDirectSettingChange('timezone', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
            >
              <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
              <option value="Asia/Bangkok">Asia/Bangkok</option>
              <option value="Asia/Singapore">Asia/Singapore</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Địa Chỉ Công Ty</label>
          <textarea
            rows={3}
            value={settings.companyAddress}
            onChange={(e) => handleDirectSettingChange('companyAddress', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white resize-vertical"
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Cài Đặt Hiển Thị</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Định Dạng Ngày</label>
            <select
              value={settings.dateFormat}
              onChange={(e) => handleDirectSettingChange('dateFormat', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ngôn Ngữ</label>
            <select
              value={settings.language}
              onChange={(e) => handleDirectSettingChange('language', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Tùy Chọn Thông Báo</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Thông báo Email</h4>
              <p className="text-sm text-gray-400">Nhận thông báo qua email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Thông báo SMS</h4>
              <p className="text-sm text-gray-400">Nhận thông báo qua SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.sms}
                onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Thông báo đẩy</h4>
              <p className="text-sm text-gray-400">Nhận thông báo đẩy trên trình duyệt</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Cài Đặt Bảo Mật</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Xác thực hai yếu tố</h4>
              <p className="text-sm text-gray-400">Thêm lớp bảo mật bổ sung</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.twoFactor}
                onChange={(e) => handleSettingChange('security', 'twoFactor', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Thời gian hết phiên (phút)</label>
            <input
              type="number"
              min="5"
              max="120"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Chính sách mật khẩu</label>
            <select
              value={settings.security.passwordPolicy}
              onChange={(e) => handleSettingChange('security', 'passwordPolicy', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
            >
              <option value="low">Thấp (6+ ký tự)</option>
              <option value="medium">Trung bình (8+ ký tự, chữ hoa/thường)</option>
              <option value="high">Cao (12+ ký tự, ký tự đặc biệt)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Cài Đặt Hệ Thống</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Chế độ bảo trì</h4>
              <p className="text-sm text-gray-400">Đặt hệ thống vào chế độ bảo trì</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.system.maintenanceMode}
                onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Sao lưu tự động</h4>
              <p className="text-sm text-gray-400">Tự động sao lưu dữ liệu hàng ngày</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.system.autoBackup}
                onChange={(e) => handleSettingChange('system', 'autoBackup', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Cấp độ ghi log</label>
            <select
              value={settings.system.logLevel}
              onChange={(e) => handleSettingChange('system', 'logLevel', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
            >
              <option value="debug">Gỡ lỗi</option>
              <option value="info">Thông tin</option>
              <option value="warn">Cảnh báo</option>
              <option value="error">Lỗi</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Cài Đặt Hệ Thống</h1>
            <p className="text-gray-400 text-sm">Trang chủ / Cài đặt</p>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{loading ? 'Đang lưu...' : 'Lưu Cài Đặt'}</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'system' && renderSystemSettings()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
