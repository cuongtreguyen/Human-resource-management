import React, { useEffect, useState } from 'react';
import {
  User, Mail, Phone, MapPin, Briefcase,
  Building2, CreditCard, Heart, FileText, Users
} from 'lucide-react';
import fakeApi from '../services/fakeApi';
import { getRole, getUserInfo } from '../utils/auth';
import Layout from '../components/layout/Layout';

const Profile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRole = getRole();
  const userInfo = getUserInfo();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // Lấy danh sách employees và tìm employee theo email hoặc name từ userInfo
      const res = await fakeApi.getEmployees();
      let foundEmployee = null;

      if (userInfo) {
        // Tìm theo email nếu có
        if (userInfo.email) {
          foundEmployee = res.data.find(emp => emp.email === userInfo.email);
        }
        // Nếu không tìm thấy theo email, tìm theo name
        if (!foundEmployee && userInfo.name) {
          foundEmployee = res.data.find(emp => emp.name === userInfo.name);
        }
      }

      // Nếu không tìm thấy, lấy employee đầu tiên làm fallback (cho demo)
      if (!foundEmployee && res.data.length > 0) {
        foundEmployee = res.data[0];
      }

      setEmployee(foundEmployee);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Đang làm việc' },
      inactive: { bg: 'bg-red-100', text: 'text-red-700', label: 'Nghỉ việc' },
      on_leave: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Nghỉ phép' }
    };
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getRoleBadge = () => {
    const roleLabels = {
      admin: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Quản trị viên' },
      manager: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Quản lý' },
      accountant: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Kế toán' }
    };
    const config = roleLabels[userRole] || roleLabels.admin;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </span>
      <span className="text-gray-900 font-medium text-right">{value || 'Chưa cập nhật'}</span>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!employee) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Không tìm thấy thông tin nhân viên</p>
            <p className="text-sm text-gray-500 mt-2">Vui lòng liên hệ phòng Nhân sự để cập nhật thông tin</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Màu sắc theo role
  const roleColors = {
    admin: {
      gradient: 'from-blue-500 to-blue-600',
      text: 'text-blue-600',
      bg: 'bg-blue-500'
    },
    manager: {
      gradient: 'from-purple-500 to-purple-600',
      text: 'text-purple-600',
      bg: 'bg-purple-500'
    },
    accountant: {
      gradient: 'from-emerald-500 to-emerald-600',
      text: 'text-emerald-600',
      bg: 'bg-emerald-500'
    }
  };

  const currentTheme = roleColors[userRole] || roleColors.admin;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentTheme.gradient} text-white py-8 px-6 shadow-lg`}>
          <div className="max-w-5xl mx-auto">
            <div>
              <h1 className="text-3xl font-bold mb-2">Hồ sơ cá nhân</h1>
              <p className="opacity-90">Thông tin chi tiết của bạn trong hệ thống</p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
            <div className="flex items-center gap-6">
              <div className={`w-24 h-24 bg-gradient-to-br ${currentTheme.gradient} rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
                {employee.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
                  {getStatusBadge(employee.status)}
                  {getRoleBadge()}
                </div>
                <p className={`text-xl ${currentTheme.text} font-semibold mb-3`}>{employee.position}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Building2 className={`w-4 h-4 ${currentTheme.text}`} />
                    {employee.department}
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className={`w-4 h-4 ${currentTheme.text}`} />
                    ID: {employee.id}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid thông tin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Thông tin cá nhân */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
                <User className={`w-5 h-5 ${currentTheme.text}`} />
                Thông tin cá nhân
              </h3>
              <div className="space-y-1">
                <InfoRow label="Ngày sinh" value={formatDate(employee.dateOfBirth || employee.birthDate || employee.birthday)} />
                <InfoRow label="Giới tính" value={employee.gender} />
                <InfoRow label="Tình trạng hôn nhân" value={employee.maritalStatus} />
              </div>
            </div>

            {/* Thông tin liên hệ */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
                <Mail className="w-5 h-5 text-blue-600" />
                Thông tin liên hệ
              </h3>
              <div className="space-y-1">
                <InfoRow label="Email" value={employee.email} icon={Mail} />
                <InfoRow label="Số điện thoại" value={employee.phone} icon={Phone} />
              </div>
            </div>

            {/* Giấy tờ tùy thân */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
                <CreditCard className="w-5 h-5 text-green-600" />
                Giấy tờ tùy thân
              </h3>
              <div className="space-y-1">
                <InfoRow label="Số CCCD/CMND" value={employee.idCard || employee.idNumber} />
                <InfoRow label="Ngày cấp" value={formatDate(employee.idCardIssueDate)} />
                <InfoRow label="Nơi cấp" value={employee.idCardIssuePlace} />
                <InfoRow label="Mã số thuế" value={employee.taxCode} />
              </div>
            </div>

            {/* Thông tin công việc */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
                <Briefcase className={`w-5 h-5 ${currentTheme.text}`} />
                Thông tin công việc
              </h3>
              <div className="space-y-1">
                <InfoRow label="Phòng ban" value={employee.department} />
                <InfoRow label="Chức vụ" value={employee.position} />
                <InfoRow label="Quản lý trực tiếp" value={employee.manager} />
                <InfoRow label="Địa điểm làm việc" value={employee.workLocation} />
                <InfoRow label="Loại nhân viên" value={employee.employeeType} />
                <InfoRow label="Loại hợp đồng" value={employee.contractType} />
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
                <MapPin className="w-5 h-5 text-red-600" />
                Địa chỉ
              </h3>
              <div className="space-y-1">
                <InfoRow label="Địa chỉ thường trú" value={employee.permanentAddress || employee.address} />
                <InfoRow label="Địa chỉ tạm trú" value={employee.temporaryAddress} />
              </div>
            </div>

            {/* Liên hệ khẩn cấp - Full width */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
                <Heart className="w-5 h-5 text-red-600" />
                Liên hệ khẩn cấp
              </h3>
              {employee.emergencyContact ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
                    <p className="text-gray-900 font-medium">{employee.emergencyContact.name || 'Chưa cập nhật'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Mối quan hệ</p>
                    <p className="text-gray-900 font-medium">{employee.emergencyContact.relationship || 'Chưa cập nhật'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                    <p className="text-gray-900 font-medium">{employee.emergencyContact.phone || 'Chưa cập nhật'}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Chưa cập nhật thông tin liên hệ khẩn cấp</p>
                  <p className="text-sm mt-1">Vui lòng liên hệ phòng Nhân sự để bổ sung</p>
                </div>
              )}
            </div>
          </div>

          {/* Ghi chú */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Cần cập nhật thông tin?</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Nếu có thay đổi về thông tin cá nhân, vui lòng gửi yêu cầu để phòng Nhân sự hỗ trợ cập nhật.
                  </p>
                </div>
              </div>
              <a
                href="/admin/support-tickets"
                className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Liên hệ HR
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
