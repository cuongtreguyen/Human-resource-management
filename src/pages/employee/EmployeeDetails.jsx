import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { isAdmin } from '../../utils/auth';
import {
  User, Mail, Phone, Briefcase, Calendar,
  DollarSign, Edit, Trash2, ArrowLeft,
  XCircle, Building2, CreditCard, Heart, Clock
} from 'lucide-react';
import { http, JAVA_API } from '../../services/config';

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
      setError(null);
      console.log('📋 Loading employee details for ID:', id);

      const response = await http(`${JAVA_API}/employees/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Không thể tải thông tin nhân viên`);
      }

      const result = await response.json();
      const employeeData = result.data || result;

      if (employeeData) {
        setEmployee(employeeData);
        console.log('✅ Loaded employee:', employeeData);
      } else {
        throw new Error('Không tìm thấy nhân viên');
      }
    } catch (err) {
      console.error('Load employee error:', err);
      setError(err.message || 'Không thể tải thông tin nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/employees/edit/${employee?.id || id}`);
  };

  const handleDelete = async () => {
    try {
      const response = await http(`${JAVA_API}/employees/${employee?.id || id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể xóa nhân viên');
      }

      setShowDeleteModal(false);
      alert('Xóa nhân viên thành công');
      navigate('/employees');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Lỗi: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Chưa cập nhật';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !employee) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy</h2>
            <p className="text-gray-600 mb-4">{error || 'Không tìm thấy nhân viên'}</p>
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
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Đang làm việc' },
      inactive: { bg: 'bg-red-100', text: 'text-red-700', label: 'Nghỉ việc' },
      on_leave: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Nghỉ phép' }
    };
    const config = statusConfig[status?.toLowerCase()] || statusConfig.inactive;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value || 'Chưa cập nhật'}</span>
    </div>
  );

  const employeeName = employee.fullName || employee.name || 'N/A';
  const employeeDepartment = employee.department || employee.departmentName || 'N/A';
  const employeePosition = employee.position || employee.jobTitle || 'N/A';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/employees')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
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
                {employeeName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{employeeName}</h2>
                {getStatusBadge(employee.status)}
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{employeePosition}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>{employeeDepartment}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin cá nhân */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Thông tin cá nhân
            </h3>
            <div className="space-y-1">
              <InfoRow label="Mã nhân viên" value={employee.employeeId || employee.id} />
              <InfoRow label="Email" value={employee.email} />
              <InfoRow label="Số điện thoại" value={employee.phone || employee.phoneNumber} />
              <InfoRow label="Ngày sinh" value={formatDate(employee.dateOfBirth || employee.dob)} />
              <InfoRow label="Giới tính" value={employee.gender} />
              <InfoRow label="Địa chỉ" value={employee.address} />
            </div>
          </div>

          {/* Thông tin công việc */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              Thông tin công việc
            </h3>
            <div className="space-y-1">
              <InfoRow label="Phòng ban" value={employeeDepartment} />
              <InfoRow label="Chức vụ" value={employeePosition} />
              <InfoRow label="Ngày vào làm" value={formatDate(employee.startDate || employee.hireDate)} />
              <InfoRow label="Loại hợp đồng" value={employee.contractType} />
            </div>
          </div>

          {/* Thông tin lương */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Thông tin lương
            </h3>
            <div className="space-y-1">
              <InfoRow label="Lương cơ bản" value={formatCurrency(employee.salary || employee.baseSalary)} />
              <InfoRow label="Phụ cấp" value={formatCurrency(employee.allowance)} />
            </div>
          </div>

          {/* Thông tin ngân hàng */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              Thông tin ngân hàng
            </h3>
            <div className="space-y-1">
              <InfoRow label="Ngân hàng" value={employee.bankName} />
              <InfoRow label="Số tài khoản" value={employee.bankAccount || employee.bankAccountNumber} />
              <InfoRow label="Mã số thuế" value={employee.taxId || employee.taxCode} />
              <InfoRow label="Số BHXH" value={employee.insuranceNumber || employee.socialInsuranceNumber} />
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
              <p className="text-gray-600 mb-4">
                Bạn có chắc chắn muốn xóa nhân viên <strong>{employeeName}</strong>?
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployeeDetails;
