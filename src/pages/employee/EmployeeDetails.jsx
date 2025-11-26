import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import fakeApi from '../../services/fakeApi';
import { isAdmin } from '../../utils/auth';
import {
  User, Mail, Phone, Briefcase, Calendar,
  DollarSign, Edit, Trash2, ArrowLeft, CheckCircle,
  XCircle, Clock, Building2, CreditCard, Heart
} from 'lucide-react';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Chưa cập nhật';
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  const calculateWorkDuration = (hireDate) => {
    if (!hireDate) return 'Chưa cập nhật';
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
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin nhân viên...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !employee) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/employees')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </Layout>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Đang làm việc' },
      inactive: { bg: 'bg-red-100', text: 'text-red-700', label: 'Nghỉ việc' },
      on_leave: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Nghỉ phép' }
    };
    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium">{value || 'Chưa cập nhật'}</span>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/employees')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết nhân viên</h1>
          </div>

          {isAdmin() && (
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
                Chỉnh sửa
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl border p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {employee.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
                {getStatusBadge(employee.status)}
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{employee.position}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>{employee.department}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin liên hệ */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Thông tin liên hệ
            </h3>
            <div className="space-y-1">
              <InfoRow label="Email" value={employee.email} />
              <InfoRow label="Số điện thoại" value={employee.phone} />
              <InfoRow label="Địa chỉ" value={employee.address} />
            </div>
          </div>

          {/* Thông tin cá nhân */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Thông tin cá nhân
            </h3>
            <div className="space-y-1">
              <InfoRow label="Ngày sinh" value={formatDate(employee.dateOfBirth)} />
              <InfoRow label="Giới tính" value={employee.gender} />
              <InfoRow label="Tình trạng hôn nhân" value={employee.maritalStatus} />
            </div>
          </div>

          {/* Giấy tờ tùy thân */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              Giấy tờ tùy thân
            </h3>
            <div className="space-y-1">
              <InfoRow label="Số CCCD/CMND" value={employee.idCard} />
              <InfoRow label="Ngày cấp" value={formatDate(employee.idCardIssueDate)} />
              <InfoRow label="Nơi cấp" value={employee.idCardIssuePlace} />
            </div>
          </div>

          {/* Thông tin công việc */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange-600" />
              Thông tin công việc
            </h3>
            <div className="space-y-1">
              <InfoRow label="Mã nhân viên" value={employee.id} />
              <InfoRow label="Phòng ban" value={employee.department} />
              <InfoRow label="Chức vụ" value={employee.position} />
              <InfoRow label="Quản lý trực tiếp" value={employee.manager} />
              <InfoRow label="Địa điểm làm việc" value={employee.workLocation} />
              <InfoRow label="Loại nhân viên" value={employee.employeeType} />
              <InfoRow label="Loại hợp đồng" value={employee.contractType} />
            </div>
          </div>

          {/* Thời gian làm việc */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Thời gian làm việc
            </h3>
            <div className="space-y-1">
              <InfoRow label="Ngày vào làm" value={formatDate(employee.hireDate)} />
              <InfoRow label="Thâm niên" value={calculateWorkDuration(employee.hireDate)} />
            </div>
          </div>

          {/* Thông tin lương (Admin only) */}
          {isAdmin() && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Thông tin lương
              </h3>
              <div className="space-y-1">
                <InfoRow label="Lương cơ bản" value={formatCurrency(employee.salary)} />
              </div>
            </div>
          )}

          {/* Liên hệ khẩn cấp */}
          <div className="bg-white rounded-xl border p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Liên hệ khẩn cấp
            </h3>
            {employee.emergencyContact ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-gray-500 text-sm">Họ và tên</span>
                  <p className="text-gray-900 font-medium">{employee.emergencyContact.name || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Mối quan hệ</span>
                  <p className="text-gray-900 font-medium">{employee.emergencyContact.relationship || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Số điện thoại</span>
                  <p className="text-gray-900 font-medium">{employee.emergencyContact.phone || 'Chưa cập nhật'}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Chưa cập nhật thông tin liên hệ khẩn cấp</p>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn xóa nhân viên <strong>{employee.name}</strong>?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
