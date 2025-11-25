import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import fakeApi from '../../services/fakeApi';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    maritalStatus: '',

    // ID Card Information
    idCard: '',
    idCardIssueDate: '',
    idCardIssuePlace: '',

    // Job Information
    employeeId: '',
    department: '',
    position: '',
    startDate: '',
    status: '',
    manager: '',
    workLocation: '',
    employeeType: '',
    contractType: '',

    // Salary Information
    salary: '',
    payGrade: '',
    benefits: '',

    // Education
    education: '',
    educationDetails: '',

    // Bank Information
    bankAccount: '',
    bankName: '',
    bankBranch: '',

    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',

    // Additional Information
    notes: ''
  });

  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        setLoading(true);
        // Simulate API call to get employee data
        const response = await fakeApi.getEmployeeById(id);
        if (response.success && response.data) {
          const data = response.data;
          // Handle emergency contact if it's an object
          const emergencyContactValue = typeof data.emergencyContact === 'object'
            ? (data.emergencyContact?.name || '')
            : (data.emergencyContact || '');
          const emergencyPhoneValue = typeof data.emergencyContact === 'object'
            ? (data.emergencyContact?.phone || '')
            : (data.emergencyPhone || '');

          setFormData({
            ...data,
            emergencyContactName: emergencyContactValue,
            emergencyContactRelationship: typeof data.emergencyContact === 'object' ? (data.emergencyContact?.relationship || '') : '',
            emergencyContactPhone: emergencyPhoneValue,
          });
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
      alert('Cập nhật nhân viên thành công!');
      navigate('/employees');
    } catch (err) {
      alert('Không thể cập nhật nhân viên');
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const departments = ['Công nghệ', 'Nhân sự', 'Marketing', 'Tài chính', 'Kinh doanh', 'Vận hành'];
  const positions = ['Lập trình viên', 'Quản lý nhân sự', 'Chuyên viên Marketing', 'Kế toán', 'Nhân viên kinh doanh', 'Quản lý vận hành'];
  const statuses = ['Đang làm việc', 'Nghỉ việc', 'Nghỉ phép', 'Đã thôi việc'];
  const genders = ['Nam', 'Nữ', 'Khác'];
  const nationalities = ['Việt Nam', 'Hoa Kỳ', 'Hàn Quốc', 'Nhật Bản', 'Trung Quốc', 'Khác'];
  const maritalStatuses = ['Độc thân', 'Đã kết hôn', 'Ly hôn', 'Góa'];
  const workLocations = ['Văn phòng HCM', 'Văn phòng Hà Nội', 'Văn phòng Đà Nẵng', 'Remote', 'Hybrid'];
  const employeeTypes = ['Full-time', 'Part-time', 'Contract', 'Intern'];
  const contractTypes = ['Chính thức', 'Thử việc', 'Hợp đồng ngắn hạn', 'Theo dự án'];
  const educationLevels = ['Trung học', 'Cao đẳng', 'Đại học', 'Thạc sĩ', 'Tiến sĩ'];
  const relationships = ['Bố', 'Mẹ', 'Vợ', 'Chồng', 'Anh/Chị/Em', 'Người thân khác'];
  const banks = [
    'Vietcombank', 'Techcombank', 'VPBank', 'BIDV', 'Agribank',
    'MB Bank', 'ACB', 'Sacombank', 'VIB', 'TPBank', 'Khác'
  ];
  const payGrades = [
    { value: 'Bậc 1', label: 'Bậc 1 - Nhân viên mới (0-2 năm kinh nghiệm)' },
    { value: 'Bậc 2', label: 'Bậc 2 - Nhân viên (2-4 năm kinh nghiệm)' },
    { value: 'Bậc 3', label: 'Bậc 3 - Nhân viên cấp cao (4-6 năm kinh nghiệm)' },
    { value: 'Bậc 4', label: 'Bậc 4 - Chuyên gia (6-10 năm kinh nghiệm)' },
    { value: 'Bậc 5', label: 'Bậc 5 - Chuyên gia cấp cao (>10 năm kinh nghiệm)' }
  ];

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
                    label="Họ"
                    value={formData.firstName}
                    onChange={(value) => handleInputChange('firstName', value)}
                    placeholder="Nhập họ"
                  />
                  <Input
                    label="Tên"
                    value={formData.lastName}
                    onChange={(value) => handleInputChange('lastName', value)}
                    placeholder="Nhập tên"
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
                    label="Địa chỉ"
                    value={formData.address}
                    onChange={(value) => handleInputChange('address', value)}
                    placeholder="Nhập địa chỉ"
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
                    label="Quốc tịch"
                    options={nationalities.map(nation => ({ value: nation, label: nation }))}
                    value={formData.nationality}
                    onChange={(value) => handleInputChange('nationality', value)}
                  />
                  <Select
                    label="Tình trạng hôn nhân"
                    options={maritalStatuses.map(status => ({ value: status, label: status }))}
                    value={formData.maritalStatus}
                    onChange={(value) => handleInputChange('maritalStatus', value)}
                  />
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
                  <Input
                    label="Mã nhân viên"
                    value={formData.employeeId}
                    onChange={(value) => handleInputChange('employeeId', value)}
                    placeholder="Nhập mã nhân viên"
                  />
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
                    label="Ngày bắt đầu"
                    type="date"
                    value={formData.startDate}
                    onChange={(value) => handleInputChange('startDate', value)}
                  />
                  <Select
                    label="Trạng thái"
                    options={statuses.map(status => ({ value: status, label: status }))}
                    value={formData.status}
                    onChange={(value) => handleInputChange('status', value)}
                  />
                  <Input
                    label="Quản lý"
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
                      label="Lương năm"
                      type="number"
                      value={formData.salary}
                      onChange={(value) => handleInputChange('salary', value)}
                      placeholder="Nhập lương năm (VNĐ)"
                    />
                    <p className="text-xs text-gray-500 mt-1">Ví dụ: 15000000 (15 triệu VNĐ/năm)</p>
                  </div>
                  <div>
                    <Select
                      label="Bậc lương"
                      options={payGrades}
                      value={formData.payGrade}
                      onChange={(value) => handleInputChange('payGrade', value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Bậc lương dựa trên kinh nghiệm và năng lực</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phúc lợi
                    </label>
                    <textarea
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      value={formData.benefits}
                      onChange={(e) => handleInputChange('benefits', e.target.value)}
                      placeholder="Nhập thông tin phúc lợi"
                    />
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Học vấn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Trình độ học vấn"
                    options={educationLevels.map(level => ({ value: level, label: level }))}
                    value={formData.education}
                    onChange={(value) => handleInputChange('education', value)}
                  />
                  <Input
                    label="Chi tiết học vấn"
                    value={formData.educationDetails}
                    onChange={(value) => handleInputChange('educationDetails', value)}
                    placeholder="VD: Cử nhân Công nghệ thông tin - ĐH Bách Khoa"
                  />
                </div>
              </div>

              {/* Bank Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Thông tin ngân hàng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Số tài khoản"
                    value={formData.bankAccount}
                    onChange={(value) => handleInputChange('bankAccount', value)}
                    placeholder="Nhập số tài khoản"
                  />
                  <Select
                    label="Ngân hàng"
                    options={banks.map(bank => ({ value: bank, label: bank }))}
                    value={formData.bankName}
                    onChange={(value) => handleInputChange('bankName', value)}
                  />
                  <Input
                    label="Chi nhánh"
                    value={formData.bankBranch}
                    onChange={(value) => handleInputChange('bankBranch', value)}
                    placeholder="VD: Chi nhánh Quận 1"
                  />
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
