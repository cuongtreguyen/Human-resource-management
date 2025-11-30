import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import fakeApi from '../../services/fakeApi';
import adminLogService from '../../services/adminLogService';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const originalDataRef = useRef(null); // Lưu dữ liệu gốc để so sánh

  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',

    // ID Card Information
    idCard: '',
    idCardIssueDate: '',
    idCardIssuePlace: '',

    // Job Information
    department: '',
    position: '',
    hireDate: '',
    status: '',
    manager: '',
    workLocation: '',
    employeeType: '',
    contractType: '',

    // Salary Information
    salary: '',

    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: ''
  });

  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        setLoading(true);
        const response = await fakeApi.getEmployeeById(id);
        if (response.success && response.data) {
          const data = response.data;
          const loadedData = {
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            dateOfBirth: data.dateOfBirth || '',
            gender: data.gender || '',
            maritalStatus: data.maritalStatus || '',
            idCard: data.idCard || '',
            idCardIssueDate: data.idCardIssueDate || '',
            idCardIssuePlace: data.idCardIssuePlace || '',
            department: data.department || '',
            position: data.position || '',
            hireDate: data.hireDate || '',
            status: data.status || '',
            manager: data.manager || '',
            workLocation: data.workLocation || '',
            employeeType: data.employeeType || '',
            contractType: data.contractType || '',
            salary: data.salary || '',
            emergencyContactName: data.emergencyContact?.name || '',
            emergencyContactRelationship: data.emergencyContact?.relationship || '',
            emergencyContactPhone: data.emergencyContact?.phone || ''
          };
          setFormData(loadedData);
          // Lưu dữ liệu gốc để so sánh khi log
          originalDataRef.current = { ...loadedData };
        } else {
          alert('Không tìm thấy thông tin nhân viên');
          navigate('/employees');
        }
      } catch (err) {
        console.error('Error loading employee:', err);
        alert('Không thể tải thông tin nhân viên');
        navigate('/employees');
      } finally {
        setLoading(false);
      }
    };

    loadEmployeeData();
  }, [id, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await fakeApi.updateEmployee(id, formData);

      // Ghi log các thay đổi
      if (originalDataRef.current) {
        const changes = {};
        Object.keys(formData).forEach(key => {
          if (formData[key] !== originalDataRef.current[key]) {
            changes[key] = `${originalDataRef.current[key] || '(trống)'} → ${formData[key] || '(trống)'}`;
          }
        });

        if (Object.keys(changes).length > 0) {
          await adminLogService.logEmployeeUpdate(id, formData.name, changes);
        }
      }

      alert('Cập nhật nhân viên thành công!');
      navigate('/employees');
    } catch (err) {
      alert('Không thể cập nhật nhân viên');
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const departments = ['Công nghệ thông tin', 'Marketing', 'Kinh doanh', 'Nhân sự', 'Tài chính'];
  const positions = ['Lập trình viên', 'Quản lý nhân sự', 'Chuyên viên Marketing', 'Kế toán viên', 'Nhân viên kinh doanh', 'Quản lý vận hành'];
  const statuses = [
    { value: 'active', label: 'Đang làm việc' },
    { value: 'inactive', label: 'Nghỉ việc' },
    { value: 'on_leave', label: 'Nghỉ phép' }
  ];
  const genders = ['Nam', 'Nữ'];
  const maritalStatuses = ['Độc thân', 'Đã kết hôn', 'Ly hôn', 'Góa'];
  const workLocations = ['Văn phòng Hà Nội', 'Văn phòng TP. Hồ Chí Minh', 'Văn phòng Đà Nẵng', 'Remote', 'Hybrid'];
  const employeeTypes = ['Toàn thời gian', 'Bán thời gian', 'Hợp đồng', 'Thực tập'];
  const contractTypes = ['Hợp đồng không xác định thời hạn', 'Hợp đồng xác định thời hạn 1 năm', 'Hợp đồng xác định thời hạn 2 năm', 'Thử việc'];
  const relationships = ['Cha', 'Mẹ', 'Vợ', 'Chồng', 'Anh/Chị/Em', 'Người thân khác'];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Đang tải thông tin nhân viên...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Chỉnh sửa nhân viên</h1>
                <p className="text-blue-100 mt-1">Cập nhật thông tin nhân viên</p>
              </div>
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/employees')}
              >
                ← Quay lại danh sách
              </Button>
            </div>
          </div>

          {/* Edit Form */}
          <Card title={`Chỉnh sửa nhân viên ID: ${id}`}>
            <div className="space-y-8">

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Thông tin cá nhân
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Họ và tên"
                    value={formData.name}
                    onChange={(value) => handleInputChange('name', value)}
                    placeholder="Nhập họ và tên"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                    placeholder="Nhập địa chỉ email"
                  />
                  <Input
                    label="Số điện thoại"
                    value={formData.phone}
                    onChange={(value) => handleInputChange('phone', value)}
                    placeholder="Nhập số điện thoại"
                  />
                  <Input
                    label="Ngày sinh"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(value) => handleInputChange('dateOfBirth', value)}
                  />
                  <Select
                    label="Giới tính"
                    options={genders.map(gender => ({ value: gender, label: gender }))}
                    value={formData.gender}
                    onChange={(value) => handleInputChange('gender', value)}
                  />
                  <Select
                    label="Tình trạng hôn nhân"
                    options={maritalStatuses.map(status => ({ value: status, label: status }))}
                    value={formData.maritalStatus}
                    onChange={(value) => handleInputChange('maritalStatus', value)}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Địa chỉ"
                      value={formData.address}
                      onChange={(value) => handleInputChange('address', value)}
                      placeholder="Nhập địa chỉ"
                    />
                  </div>
                </div>
              </div>

              {/* ID Card Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Giấy tờ tùy thân
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Số CCCD/CMND"
                    value={formData.idCard}
                    onChange={(value) => handleInputChange('idCard', value)}
                    placeholder="Nhập số CCCD/CMND"
                  />
                  <Input
                    label="Ngày cấp"
                    type="date"
                    value={formData.idCardIssueDate}
                    onChange={(value) => handleInputChange('idCardIssueDate', value)}
                  />
                  <Input
                    label="Nơi cấp"
                    value={formData.idCardIssuePlace}
                    onChange={(value) => handleInputChange('idCardIssuePlace', value)}
                    placeholder="VD: Công an TP.HCM"
                  />
                </div>
              </div>

              {/* Job Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Thông tin công việc
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Phòng ban"
                    options={departments.map(dept => ({ value: dept, label: dept }))}
                    value={formData.department}
                    onChange={(value) => handleInputChange('department', value)}
                  />
                  <Select
                    label="Chức vụ"
                    options={positions.map(pos => ({ value: pos, label: pos }))}
                    value={formData.position}
                    onChange={(value) => handleInputChange('position', value)}
                  />
                  <Input
                    label="Ngày vào làm"
                    type="date"
                    value={formData.hireDate}
                    onChange={(value) => handleInputChange('hireDate', value)}
                  />
                  <Select
                    label="Trạng thái"
                    options={statuses}
                    value={formData.status}
                    onChange={(value) => handleInputChange('status', value)}
                  />
                  <Input
                    label="Quản lý trực tiếp"
                    value={formData.manager}
                    onChange={(value) => handleInputChange('manager', value)}
                    placeholder="Nhập tên quản lý"
                  />
                  <Select
                    label="Địa điểm làm việc"
                    options={workLocations.map(loc => ({ value: loc, label: loc }))}
                    value={formData.workLocation}
                    onChange={(value) => handleInputChange('workLocation', value)}
                  />
                  <Select
                    label="Loại nhân viên"
                    options={employeeTypes.map(type => ({ value: type, label: type }))}
                    value={formData.employeeType}
                    onChange={(value) => handleInputChange('employeeType', value)}
                  />
                  <Select
                    label="Loại hợp đồng"
                    options={contractTypes.map(type => ({ value: type, label: type }))}
                    value={formData.contractType}
                    onChange={(value) => handleInputChange('contractType', value)}
                  />
                </div>
              </div>

              {/* Salary Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Thông tin lương
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Lương tháng"
                      type="number"
                      value={formData.salary}
                      onChange={(value) => handleInputChange('salary', value)}
                      placeholder="Nhập lương tháng (VNĐ)"
                    />
                    <p className="text-xs text-gray-500 mt-1">Ví dụ: 15000000 (15 triệu VNĐ/tháng)</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Liên hệ khẩn cấp
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Tên người liên hệ khẩn cấp"
                    value={formData.emergencyContactName || ''}
                    onChange={(value) => handleInputChange('emergencyContactName', value)}
                    placeholder="VD: Nguyễn Văn A"
                  />
                  <Select
                    label="Mối quan hệ"
                    options={relationships.map(rel => ({ value: rel, label: rel }))}
                    value={formData.emergencyContactRelationship}
                    onChange={(value) => handleInputChange('emergencyContactRelationship', value)}
                  />
                  <Input
                    label="Số điện thoại"
                    value={formData.emergencyContactPhone || ''}
                    onChange={(value) => handleInputChange('emergencyContactPhone', value)}
                    placeholder="VD: 0901234567"
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Thông tin bổ sung
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Nhập ghi chú hoặc thông tin bổ sung"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/employees')}
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default EditEmployee;
