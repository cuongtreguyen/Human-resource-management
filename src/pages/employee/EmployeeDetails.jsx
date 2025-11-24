import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import fakeApi from '../../services/fakeApi';
import { isAdmin } from '../../utils/auth';
import {
  User, Mail, Phone, Briefcase, Calendar, MapPin,
  DollarSign, Award, Edit, Trash2, ArrowLeft, CheckCircle,
  XCircle, Clock, Building2, CreditCard, FileText, Heart,
  GraduationCap, Users, Home, Globe, Shield, Landmark
} from 'lucide-react';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadEmployeeDetails();
  }, [id]);

  const loadEmployeeDetails = async () => {
    try {
      setLoading(true);
      const response = await fakeApi.getEmployeeById(id);
      if (response.success) {
        setEmployee(response.data);
      } else {
        setError('Không tìm thấy nhân viên');
      }
    } catch (err) {
      console.error('Error loading employee:', err);
      setError('Không thể tải thông tin nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/employees/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      await fakeApi.deleteEmployee(id);
      setShowDeleteModal(false);
      navigate('/employees');
    } catch (err) {
      console.error('Error deleting employee:', err);
      alert('Không thể xóa nhân viên');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} tuổi`;
  };

  const calculateWorkDuration = (hireDate) => {
    if (!hireDate) return 'N/A';
    const startDate = new Date(hireDate);
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0) {
      return `${years} năm ${months} tháng`;
    } else {
      return `${months} tháng`;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Đang tải thông tin nhân viên...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !employee) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => navigate('/employees')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Đang làm việc'
      },
      inactive: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: <XCircle className="w-4 h-4" />,
        label: 'Ngừng làm'
      },
      on_leave: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: <Clock className="w-4 h-4" />,
        label: 'Nghỉ phép'
      }
    };

    const config = statusConfig[status] || statusConfig.inactive;

    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} ${config.text} font-semibold`}>
        {config.icon}
        <span>{config.label}</span>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', name: 'Tổng quan', icon: User },
    { id: 'personal', name: 'Thông tin cá nhân', icon: Home },
    { id: 'employment', name: 'Công việc', icon: Briefcase },
    { id: 'education', name: 'Học vấn', icon: GraduationCap },
    { id: 'emergency', name: 'Liên hệ khẩn cấp', icon: Heart },
    { id: 'bank', name: 'Ngân hàng', icon: Landmark }
  ];

  const InfoCard = ({ icon: Icon, label, value, colorClass = 'text-gray-600' }) => (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <Icon className={`w-5 h-5 ${colorClass} mt-0.5 flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-gray-900 font-medium break-words">{value || 'Chưa cập nhật'}</p>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header Section */}
        <div className="bg-white shadow-lg border-b border-indigo-100">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/employees')}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Chi tiết Nhân viên
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">Thông tin chi tiết và quản lý</p>
                </div>
              </div>

              {isAdmin() && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>
            <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-white shadow-xl border-4 border-white flex items-center justify-center overflow-hidden">
                    {employee.avatar && employee.avatar !== '/api/placeholder/150/150' ? (
                      <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">
                          {employee.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{employee.name}</h2>
                      <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span className="font-medium">{employee.position}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          <span>{employee.department}</span>
                        </div>
                      </div>
                      {getStatusBadge(employee.status)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-2 mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  Thông tin liên hệ
                </h3>
                <div className="space-y-3">
                  <InfoCard icon={Mail} label="Email" value={employee.email} colorClass="text-blue-600" />
                  <InfoCard icon={Phone} label="Số điện thoại" value={employee.phone} colorClass="text-green-600" />
                  <InfoCard icon={CreditCard} label="Mã nhân viên" value={employee.id} colorClass="text-purple-600" />
                </div>
              </div>

              {/* Employment Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-green-600" />
                  </div>
                  Thông tin công việc
                </h3>
                <div className="space-y-3">
                  <InfoCard icon={Calendar} label="Ngày vào làm" value={formatDate(employee.hireDate)} colorClass="text-orange-600" />
                  <InfoCard icon={Building2} label="Phòng ban" value={employee.department} colorClass="text-indigo-600" />
                  <InfoCard icon={Award} label="Chức vụ" value={employee.position} colorClass="text-pink-600" />
                </div>
              </div>

              {/* Work Duration */}
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  Thời gian làm việc
                </h3>
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                  <p className="text-sm text-orange-600 mb-2 font-semibold">Thâm niên</p>
                  <p className="text-3xl font-bold text-orange-900">{calculateWorkDuration(employee.hireDate)}</p>
                </div>
              </div>

              {/* Salary (Admin only) */}
              {isAdmin() && employee.salary && (
                <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    Thông tin lương
                  </h3>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <p className="text-sm text-purple-600 mb-2 font-semibold">Lương cơ bản</p>
                    <p className="text-3xl font-bold text-purple-900">{formatCurrency(employee.salary)}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  Thông tin cá nhân
                </h3>
                <div className="space-y-3">
                  <InfoCard icon={Calendar} label="Ngày sinh" value={`${formatDate(employee.dateOfBirth)} (${calculateAge(employee.dateOfBirth)})`} colorClass="text-blue-600" />
                  <InfoCard icon={User} label="Giới tính" value={employee.gender} colorClass="text-purple-600" />
                  <InfoCard icon={Globe} label="Quốc tịch" value={employee.nationality} colorClass="text-green-600" />
                  <InfoCard icon={Heart} label="Tình trạng hôn nhân" value={employee.maritalStatus} colorClass="text-pink-600" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  Giấy tờ tùy thân
                </h3>
                <div className="space-y-3">
                  <InfoCard icon={CreditCard} label="Số CCCD/CMND" value={employee.idCard} colorClass="text-blue-600" />
                  <InfoCard icon={Calendar} label="Ngày cấp" value={formatDate(employee.idCardIssueDate)} colorClass="text-orange-600" />
                  <InfoCard icon={MapPin} label="Nơi cấp" value={employee.idCardIssuePlace} colorClass="text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 md:col-span-2">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Home className="w-5 h-5 text-indigo-600" />
                  </div>
                  Địa chỉ liên hệ
                </h3>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-900 font-medium">{employee.address}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'employment' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  Chi tiết công việc
                </h3>
                <div className="space-y-3">
                  <InfoCard icon={Building2} label="Phòng ban" value={employee.department} colorClass="text-indigo-600" />
                  <InfoCard icon={Award} label="Chức vụ" value={employee.position} colorClass="text-purple-600" />
                  <InfoCard icon={Users} label="Quản lý trực tiếp" value={employee.manager} colorClass="text-green-600" />
                  <InfoCard icon={MapPin} label="Địa điểm làm việc" value={employee.workLocation} colorClass="text-orange-600" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  Loại hợp đồng
                </h3>
                <div className="space-y-3">
                  <InfoCard icon={FileText} label="Loại nhân viên" value={employee.employeeType} colorClass="text-blue-600" />
                  <InfoCard icon={FileText} label="Hợp đồng" value={employee.contractType} colorClass="text-purple-600" />
                  <InfoCard icon={Calendar} label="Ngày bắt đầu" value={formatDate(employee.hireDate)} colorClass="text-orange-600" />
                  <InfoCard icon={Clock} label="Thâm niên" value={calculateWorkDuration(employee.hireDate)} colorClass="text-green-600" />
                </div>
              </div>

              {isAdmin() && employee.salary && (
                <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 md:col-span-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    Thông tin lương & phúc lợi
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <p className="text-sm text-purple-600 mb-2 font-semibold">Lương cơ bản</p>
                      <p className="text-3xl font-bold text-purple-900">{formatCurrency(employee.salary)}</p>
                    </div>
                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <p className="text-sm text-green-600 mb-2 font-semibold">Lương tháng 13</p>
                      <p className="text-3xl font-bold text-green-900">{formatCurrency(employee.salary)}</p>
                    </div>
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <p className="text-sm text-blue-600 mb-2 font-semibold">Bảo hiểm</p>
                      <p className="text-3xl font-bold text-blue-900">{formatCurrency(employee.salary * 0.105)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'education' && (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  Trình độ học vấn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard icon={GraduationCap} label="Trình độ" value={employee.education} colorClass="text-blue-600" />
                  <InfoCard icon={FileText} label="Chi tiết" value={employee.educationDetails} colorClass="text-purple-600" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Heart className="w-5 h-5 text-red-600" />
                  </div>
                  Liên hệ khẩn cấp
                </h3>
                {employee.emergencyContact && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoCard icon={User} label="Họ và tên" value={employee.emergencyContact.name} colorClass="text-blue-600" />
                    <InfoCard icon={Heart} label="Mối quan hệ" value={employee.emergencyContact.relationship} colorClass="text-pink-600" />
                    <InfoCard icon={Phone} label="Số điện thoại" value={employee.emergencyContact.phone} colorClass="text-green-600" />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Landmark className="w-5 h-5 text-green-600" />
                  </div>
                  Thông tin ngân hàng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InfoCard icon={CreditCard} label="Số tài khoản" value={employee.bankAccount} colorClass="text-blue-600" />
                  <InfoCard icon={Landmark} label="Ngân hàng" value={employee.bankName} colorClass="text-green-600" />
                  <InfoCard icon={Building2} label="Chi nhánh" value={employee.bankBranch} colorClass="text-purple-600" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn xóa nhân viên <strong>{employee.name}</strong>?
                  Hành động này không thể hoàn tác.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployeeDetails;
