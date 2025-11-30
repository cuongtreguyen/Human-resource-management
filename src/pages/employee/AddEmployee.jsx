import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import fakeApi from '../../services/fakeApi';
import adminLogService from '../../services/adminLogService';
import { User, Phone, Check, X } from 'lucide-react';
import { logCreateEmployee } from '../../utils/systemLogger';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    idNumber: '',
    idCardIssueDate: '',
    idCardIssuePlace: '',
    taxCode: '',
    personalEmail: '',
    phone: '',
    permanentAddress: '',
    temporaryAddress: '',
    
    // Employment Details
    department: '',
    position: '',
    employeeCode: '',
    companyEmail: '',
    contractCode: '',
    contractType: '',
    baseSalary: '',
    signDate: '',
    manager: '',
    workLocation: '',
    employeeType: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate required fields
  const validateForm = () => {
    const newErrors = {};

    // Personal Information - Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Họ là bắt buộc';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Tên là bắt buộc';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
    }
    if (!formData.gender) {
      newErrors.gender = 'Giới tính là bắt buộc';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    }
    if (!formData.personalEmail.trim()) {
      newErrors.personalEmail = 'Email cá nhân là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail)) {
      newErrors.personalEmail = 'Vui lòng nhập email hợp lệ';
    }

    // Employment Details - Required fields
    if (!formData.department) {
      newErrors.department = 'Phòng ban là bắt buộc';
    }
    if (!formData.position) {
      newErrors.position = 'Chức vụ là bắt buộc';
    }
    if (!formData.employeeCode.trim()) {
      newErrors.employeeCode = 'Mã nhân viên là bắt buộc';
    }
    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = 'Email công ty là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
      newErrors.companyEmail = 'Vui lòng nhập email hợp lệ';
    }
    if (!formData.contractType) {
      newErrors.contractType = 'Loại hợp đồng là bắt buộc';
    }

    setErrors(newErrors);
    
    // Return both validation result and errors for tab switching
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    };
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // Validate form before submitting
    const validation = validateForm();
    if (!validation.isValid) {
      // Switch to the first tab with errors
      const newErrors = validation.errors;
      const hasPersonalErrors = newErrors.firstName || newErrors.lastName || newErrors.dateOfBirth || newErrors.gender || newErrors.phone || newErrors.personalEmail;
      const hasEmploymentErrors = newErrors.department || newErrors.position || newErrors.employeeCode || newErrors.companyEmail || newErrors.contractType;

      if (hasPersonalErrors) {
        setActiveTab('personal');
      } else if (hasEmploymentErrors) {
        setActiveTab('employment');
      }
      return;
    }

    setSaving(true);

    try {
      // Prepare employee data for API
      // Đảm bảo mapping đúng với Profile.jsx và EmployeeDetails.jsx
      const employeeData = {
        // Basic Info
        id: formData.employeeCode, // Mã nhân viên (dùng làm id)
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.companyEmail, // Email công ty (chính)
        personalEmail: formData.personalEmail, // Email cá nhân
        phone: formData.phone,
        status: 'active',
        
        // Personal Information
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        
        // ID Card Information
        idCard: formData.idNumber, // Profile.jsx dùng idCard hoặc idNumber
        idNumber: formData.idNumber, // Để tương thích với cả 2
        idCardIssueDate: formData.idCardIssueDate,
        idCardIssuePlace: formData.idCardIssuePlace,
        taxCode: formData.taxCode,
        
        // Address
        address: formData.permanentAddress, // Profile.jsx dùng address hoặc permanentAddress
        permanentAddress: formData.permanentAddress,
        temporaryAddress: formData.temporaryAddress,
        
        // Employment Details
        department: formData.department,
        position: formData.position,
        employeeCode: formData.employeeCode,
        manager: formData.manager,
        workLocation: formData.workLocation,
        employeeType: formData.employeeType,
        contractType: formData.contractType,
        contractCode: formData.contractCode,
        hireDate: formData.signDate || new Date().toISOString().split('T')[0],
        salary: formData.baseSalary ? parseInt(formData.baseSalary) * 1000000 : 0,
        
        // Emergency Contact
        emergencyContact: formData.emergencyContactName || formData.emergencyContactRelationship || formData.emergencyContactPhone ? {
          name: formData.emergencyContactName,
          relationship: formData.emergencyContactRelationship,
          phone: formData.emergencyContactPhone
        } : null
      };

      const response = await fakeApi.createEmployee(employeeData);

      if (response.success) {
<<<<<<< HEAD
        // Ghi log khi tạo nhân viên mới
        await adminLogService.logEmployeeCreate(
          formData.employeeCode,
          `${formData.firstName} ${formData.lastName}`
        );

=======
        // Log hành động tạo nhân viên
        const employeeName = `${formData.firstName} ${formData.lastName}`;
        const employeeId = response.data?.id || response.data?.employeeId || 'unknown';
        logCreateEmployee(employeeId, employeeName);
        
>>>>>>> 1ca03c9fc33ead406f505540c84dc2bd4a86c0b7
        alert('Nhân viên mới đã được tạo thành công!');
        navigate('/employees');
      } else {
        alert('Có lỗi xảy ra khi tạo nhân viên');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Có lỗi xảy ra khi tạo nhân viên');
    } finally {
      setSaving(false);
    }
  };

  // Check if form is valid (for enabling/disabling button)
  const isFormValid = () => {
    return formData.firstName.trim() &&
           formData.lastName.trim() &&
           formData.dateOfBirth &&
           formData.gender &&
           formData.phone.trim() &&
           formData.personalEmail.trim() &&
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail) &&
           formData.department &&
           formData.position &&
           formData.employeeCode.trim() &&
           formData.companyEmail.trim() &&
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail) &&
           formData.contractType;
  };

  const handleCancel = () => {
    navigate('/employees');
  };

  const tabs = [
    { id: 'personal', label: 'Thông tin cá nhân' },
    { id: 'employment', label: 'Thông tin công việc' }
  ];

  const departments = [
    'Công nghệ thông tin',
    'Marketing',
    'Kinh doanh',
    'Nhân sự',
    'Tài chính'
  ];

  const positions = [
    'Lập trình viên',
    'Trưởng phòng Nhân sự',
    'Kế toán',
    'Chuyên viên Marketing',
    'Nhân viên Kinh doanh',
    'Trưởng phòng Vận hành'
  ];

  const contractTypes = [
    'Toàn thời gian',
    'Bán thời gian',
    'Hợp đồng',
    'Thực tập'
  ];

  const maritalStatuses = ['Độc thân', 'Đã kết hôn', 'Ly hôn', 'Góa'];
  const workLocations = ['Văn phòng Hà Nội', 'Văn phòng TP. Hồ Chí Minh', 'Văn phòng Đà Nẵng', 'Remote', 'Hybrid'];
  const employeeTypes = ['Toàn thời gian', 'Bán thời gian', 'Hợp đồng', 'Thực tập'];
  const relationships = ['Cha', 'Mẹ', 'Vợ', 'Chồng', 'Anh/Chị/Em', 'Người thân khác'];
  
  // Get managers list (for now, use employees as managers)
  const managers = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Minh C', 'Phạm Thu D'];


  return (
    <Layout>
      <div className="flex gap-6">
        {/* Left Sidebar */}
        <div className="w-80 space-y-6">
          {/* Employee Profile */}
          <Card>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-16 h-16 text-purple-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Nhân viên mới</h2>
              <p className="text-sm text-purple-600">Tải ảnh và điền thông tin chi tiết</p>
            </div>
          </Card>

          {/* Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác</h3>
            <div className="space-y-3">
              <Button
                onClick={handleSubmit}
                disabled={saving || !isFormValid()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4 mr-2" />
                {saving ? 'Đang tạo...' : 'Tạo nhân viên'}
              </Button>
              {!isFormValid() && (
                <p className="text-xs text-amber-600 mt-2 text-center">
                  Vui lòng điền đầy đủ các trường bắt buộc
                </p>
              )}
              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card>
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
                <p className="text-gray-600">Thông tin cá nhân cơ bản</p>

                {/* Personal Details */}
                <div>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Thông tin chi tiết</h3>
                    <User className="w-4 h-4 ml-2 text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Thông tin cá nhân cơ bản</p>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Họ"
                      value={formData.firstName}
                      onChange={(value) => handleInputChange('firstName', value)}
                      placeholder="Nhập họ"
                      required
                      error={errors.firstName}
                    />
                    <Input
                      label="Tên"
                      value={formData.lastName}
                      onChange={(value) => handleInputChange('lastName', value)}
                      placeholder="Nhập tên"
                      required
                      error={errors.lastName}
                    />
                    <Input
                      label="Ngày sinh"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(value) => handleInputChange('dateOfBirth', value)}
                      required
                      error={errors.dateOfBirth}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giới tính <span className="text-red-500">*</span>
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="mr-2"
                          />
                          Nam
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.gender === 'female'}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="mr-2"
                          />
                          Nữ
                        </label>
                      </div>
                      {errors.gender && (
                        <p className="text-sm text-red-600 mt-1">{errors.gender}</p>
                      )}
                    </div>
                    <Input
                      label="Số CMND/CCCD"
                      value={formData.idNumber}
                      onChange={(value) => handleInputChange('idNumber', value)}
                      placeholder="Nhập số CMND/CCCD"
                      helperText="Số CMND/CCCD của nhân viên (9 hoặc 12 chữ số)"
                    />
                    <Input
                      label="Mã số thuế"
                      value={formData.taxCode}
                      onChange={(value) => handleInputChange('taxCode', value)}
                      placeholder="Nhập mã số thuế"
                      helperText="Mã số thuế cá nhân (MST) - dùng để khai báo thuế thu nhập cá nhân"
                    />
                    <div>
                      <Select
                        label="Tình trạng hôn nhân"
                        value={formData.maritalStatus}
                        onChange={(value) => handleInputChange('maritalStatus', value)}
                        options={maritalStatuses.map(status => ({ value: status, label: status }))}
                        placeholder="-- Chọn tình trạng hôn nhân --"
                      />
                    </div>
                    <Input
                      label="Ngày cấp CMND/CCCD"
                      type="date"
                      value={formData.idCardIssueDate}
                      onChange={(value) => handleInputChange('idCardIssueDate', value)}
                    />
                    <Input
                      label="Nơi cấp CMND/CCCD"
                      value={formData.idCardIssuePlace}
                      onChange={(value) => handleInputChange('idCardIssuePlace', value)}
                      placeholder="Nhập nơi cấp"
                    />
                  </div>
                </div>

                {/* Contact & Address */}
                <div>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Liên hệ & Địa chỉ</h3>
                    <Phone className="w-4 h-4 ml-2 text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Thông tin liên lạc của nhân viên</p>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Email cá nhân"
                      type="email"
                      value={formData.personalEmail}
                      onChange={(value) => handleInputChange('personalEmail', value)}
                      placeholder="Nhập email cá nhân"
                      required
                      error={errors.personalEmail}
                    />
                    <Input
                      label="Số điện thoại"
                      value={formData.phone}
                      onChange={(value) => handleInputChange('phone', value)}
                      placeholder="Nhập số điện thoại"
                      required
                      error={errors.phone}
                    />
                    <Input
                      label="Địa chỉ thường trú"
                      value={formData.permanentAddress}
                      onChange={(value) => handleInputChange('permanentAddress', value)}
                      placeholder="Nhập địa chỉ thường trú"
                    />
                    <Input
                      label="Địa chỉ tạm trú"
                      value={formData.temporaryAddress}
                      onChange={(value) => handleInputChange('temporaryAddress', value)}
                      placeholder="Nhập địa chỉ tạm trú"
                    />
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'employment' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Thông tin công việc</h1>
                <p className="text-gray-600">Thông tin hợp đồng lao động</p>

                {/* Company Information */}
                <div>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Thông tin công ty</h3>
                    <User className="w-4 h-4 ml-2 text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Chi tiết phòng ban và chức vụ</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Select
                        label="Phòng ban"
                        value={formData.department}
                        onChange={(value) => handleInputChange('department', value)}
                        options={departments.map(dept => ({ value: dept, label: dept }))}
                        placeholder="-- Chọn phòng ban --"
                        required
                        error={errors.department}
                      />
                    </div>
                    <div>
                      <Select
                        label="Chức vụ"
                        value={formData.position}
                        onChange={(value) => handleInputChange('position', value)}
                        options={positions.map(pos => ({ value: pos, label: pos }))}
                        placeholder="-- Chọn chức vụ --"
                        required
                        error={errors.position}
                      />
                    </div>
                    <Input
                      label="Mã nhân viên"
                      value={formData.employeeCode}
                      onChange={(value) => handleInputChange('employeeCode', value)}
                      placeholder="Nhập mã nhân viên"
                      required
                      error={errors.employeeCode}
                    />
                    <Input
                      label="Email công ty"
                      type="email"
                      value={formData.companyEmail}
                      onChange={(value) => handleInputChange('companyEmail', value)}
                      placeholder="Nhập email công ty"
                      required
                      error={errors.companyEmail}
                    />
                  </div>
                </div>

                {/* Contract Details */}
                <div>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Chi tiết hợp đồng</h3>
                    <User className="w-4 h-4 ml-2 text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Thông tin hợp đồng lao động</p>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Mã hợp đồng"
                      value={formData.contractCode}
                      onChange={(value) => handleInputChange('contractCode', value)}
                      placeholder="Nhập mã hợp đồng"
                    />
                    <div>
                      <Select
                        label="Loại hợp đồng"
                        value={formData.contractType}
                        onChange={(value) => handleInputChange('contractType', value)}
                        options={contractTypes.map(type => ({ value: type, label: type }))}
                        placeholder="-- Chọn loại hợp đồng --"
                        required
                        error={errors.contractType}
                      />
                    </div>
                    <Input
                      label="Lương cơ bản"
                      value={formData.baseSalary}
                      onChange={(value) => handleInputChange('baseSalary', value)}
                      placeholder="Nhập lương cơ bản"
                    />
                    <Input
                      label="Ngày ký"
                      type="date"
                      value={formData.signDate}
                      onChange={(value) => handleInputChange('signDate', value)}
                    />
                    <div>
                      <Select
                        label="Quản lý trực tiếp"
                        value={formData.manager}
                        onChange={(value) => handleInputChange('manager', value)}
                        options={managers.map(mgr => ({ value: mgr, label: mgr }))}
                        placeholder="-- Chọn quản lý trực tiếp --"
                      />
                    </div>
                    <div>
                      <Select
                        label="Địa điểm làm việc"
                        value={formData.workLocation}
                        onChange={(value) => handleInputChange('workLocation', value)}
                        options={workLocations.map(loc => ({ value: loc, label: loc }))}
                        placeholder="-- Chọn địa điểm làm việc --"
                      />
                    </div>
                    <div>
                      <Select
                        label="Loại nhân viên"
                        value={formData.employeeType}
                        onChange={(value) => handleInputChange('employeeType', value)}
                        options={employeeTypes.map(type => ({ value: type, label: type }))}
                        placeholder="-- Chọn loại nhân viên --"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Nhập số tiền theo triệu đồng (ví dụ: 10 cho 10 triệu)</p>
                </div>

                {/* Emergency Contact */}
                <div>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Liên hệ khẩn cấp</h3>
                    <Phone className="w-4 h-4 ml-2 text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Thông tin người liên hệ khẩn cấp</p>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Họ và tên"
                      value={formData.emergencyContactName}
                      onChange={(value) => handleInputChange('emergencyContactName', value)}
                      placeholder="Nhập họ và tên"
                    />
                    <div>
                      <Select
                        label="Mối quan hệ"
                        value={formData.emergencyContactRelationship}
                        onChange={(value) => handleInputChange('emergencyContactRelationship', value)}
                        options={relationships.map(rel => ({ value: rel, label: rel }))}
                        placeholder="-- Chọn mối quan hệ --"
                      />
                    </div>
                    <Input
                      label="Số điện thoại"
                      value={formData.emergencyContactPhone}
                      onChange={(value) => handleInputChange('emergencyContactPhone', value)}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

              </div>
            )}

          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AddEmployee;
