import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fakeApi from '../services/fakeApi';
import { getRole, getUserId } from '../utils/auth';
import Layout from '../components/layout/Layout';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    address: '',
    birthday: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: ''
  });

  const userRole = getRole();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userId = getUserId() || 'emp001';
      const response = await fakeApi.getEmployeeProfile(userId);
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        position: response.data.position,
        department: response.data.department,
        address: response.data.address,
        birthday: response.data.birthday,
        emergencyContactName: response.data.emergencyContact?.name || '',
        emergencyContactPhone: response.data.emergencyContact?.phone || '',
        emergencyContactRelationship: response.data.emergencyContact?.relationship || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const profileData = {
        ...formData,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship
        }
      };
      await fakeApi.updateSettings('profile', profileData);
      setProfile({ ...profile, ...profileData });
      setEditing(false);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Lỗi khi cập nhật thông tin!');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      position: profile.position,
      department: profile.department,
      address: profile.address,
      birthday: profile.birthday,
      emergencyContactName: profile.emergencyContact?.name || '',
      emergencyContactPhone: profile.emergencyContact?.phone || '',
      emergencyContactRelationship: profile.emergencyContact?.relationship || ''
    });
    setEditing(false);
  };

  const tabs = [
    { id: 'personal', name: 'Thông tin cá nhân', icon: '👤' },
    { id: 'skills', name: 'Kỹ năng', icon: '💼' },
    { id: 'education', name: 'Học vấn', icon: '🎓' },
    { id: 'emergency', name: 'Liên hệ khẩn cấp', icon: '🚨' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-8 rounded-lg mx-6 mt-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-purple-600 text-3xl font-bold shadow-lg">
                {profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile?.name}</h1>
              <p className="text-purple-100 mt-1">{profile?.position} • {profile?.department}</p>
              <p className="text-purple-200 text-sm mt-1">{profile?.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {userRole === 'admin' ? 'Quản trị viên' : userRole === 'manager' ? 'Quản lý' : 'Kế toán'}
                </span>
                <span className="px-3 py-1 bg-green-500/30 rounded-full text-sm">
                  Đang làm việc
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all duration-200 shadow-lg font-medium"
              >
                Chỉnh sửa
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all duration-200 shadow-lg font-medium"
                >
                  Lưu
                </button>
              </>
            )}
            </div>
          </div>
        </div>

        <div className="p-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-white rounded-lg shadow-sm p-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin cá nhân</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{profile?.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{profile?.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{profile?.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                  {editing ? (
                    <input
                      type="date"
                      value={formData.birthday}
                      onChange={(e) => handleInputChange('birthday', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {profile?.birthday ? new Date(profile.birthday).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chức vụ</label>
                  <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{profile?.position}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phòng ban</label>
                  <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{profile?.department}</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                  {editing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{profile?.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày vào làm</label>
                  <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                    {profile?.hireDate ? new Date(profile.hireDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Kỹ năng</h2>
              <div className="flex flex-wrap gap-3">
                {profile?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              {(!profile?.skills || profile.skills.length === 0) && (
                <p className="text-gray-500 text-center py-8">Chưa có thông tin kỹ năng</p>
              )}
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Học vấn</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-purple-600 pl-4 py-2">
                  <h3 className="font-semibold text-gray-900">{profile?.education}</h3>
                </div>
                {profile?.languages && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Ngôn ngữ</h3>
                    <div className="space-y-2">
                      {profile.languages.map((lang, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                          <span className="text-gray-700">{lang}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Liên hệ khẩn cấp</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên người liên hệ</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {profile?.emergencyContact?.name || 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mối quan hệ</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.emergencyContactRelationship}
                      onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {profile?.emergencyContact?.relationship || 'N/A'}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {profile?.emergencyContact?.phone || 'N/A'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Profile;
