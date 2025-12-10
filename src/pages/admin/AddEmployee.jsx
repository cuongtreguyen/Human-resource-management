import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { createEmployee } from '../../services/api';
import adminLogService from '../../services/adminLogService';
import { User, Phone, Check, X, Clock } from 'lucide-react';
import { logCreateEmployee } from '../../utils/systemLogger';
import { toast } from 'react-toastify';

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
    timeIn: '',
    timeOut: '',
    shift: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: ''
  });

  const handleInputChange = (field, value) => {
    // Nếu chọn ca làm việc, tự động set thời gian vào và ra
    if (field === 'shift') {
      const shiftTimes = {
        'Ca sáng': { timeIn: '08:00', timeOut: '17:00' },
        'Ca chiều': { timeIn: '13:00', timeOut: '22:00' },
        'Ca tối': { timeIn: '18:00', timeOut: '02:00' },
        'Ca đêm': { timeIn: '22:00', timeOut: '06:00' },
        'Tùy chỉnh': { timeIn: '', timeOut: '' }
      };
      
      const times = shiftTimes[value] || { timeIn: '', timeOut: '' };
      
      setFormData(prev => ({
        ...prev,
        [field]: value,
        timeIn: times.timeIn,
        timeOut: times.timeOut
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
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
      // Chuyển đổi timeIn/timeOut từ string "HH:mm" sang object {hour, minute, second, nano}
      const parseTime = (timeString) => {
        if (!timeString || typeof timeString !== 'string' || !timeString.includes(':')) {
          return null;
        }
        const [hour, minute] = timeString.split(':').map(Number);
        return {
          hour: hour || 0,
          minute: minute || 0,
          second: 0,
          nano: 0
        };
      };

      // Prepare employee data for API theo schema
      const employeeData = {
        // Basic Info
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.companyEmail || '',
        position: formData.position || '',
        department: formData.department || '',
        phone: formData.phone || '',
        status: 'active', // Mặc định là active khi tạo mới
        
        // Personal Information
        personalEmail: formData.personalEmail || '',
        dateOfBirth: formData.dateOfBirth || '',
        gender: formData.gender || '',
        idNumber: formData.idNumber || '',
        taxCode: formData.taxCode || '',
        employeeId: formData.employeeCode || '',
        
        // Contract
        contractCode: formData.contractCode || '',
        contractType: formData.contractType || '',
        
        // Address
        permanentAddress: formData.permanentAddress || '',
        temporaryAddress: formData.temporaryAddress || '',
        
        // ID Card
        idCardIssueDate: formData.idCardIssueDate || '',
        idCardIssuePlace: formData.idCardIssuePlace || '',
        
        // Other
        maritalStatus: formData.maritalStatus || '',
        employeeType: formData.employeeType || '',
        
        // Emergency Contact
        emergencyContactName: formData.emergencyContactName || '',
        emergencyContactPhone: formData.emergencyContactPhone || '',
        emergencyContactRelationship: formData.emergencyContactRelationship || '',
        
        // Work Schedule
        timeIn: parseTime(formData.timeIn),
        timeOut: parseTime(formData.timeOut),
        shift: formData.shift || '',
        workLocation: formData.workLocation || '',
        
        // Employment
        hireDate: formData.signDate || new Date().toISOString().split('T')[0],
        salary: formData.baseSalary ? parseInt(formData.baseSalary) * 1000000 : 0
      };

      // Loại bỏ các field null hoặc empty string
      Object.keys(employeeData).forEach(key => {
        if (employeeData[key] === null || employeeData[key] === '') {
          delete employeeData[key];
        }
      });

      console.log('📤 Creating employee with data:', employeeData);
      
      const response = await createEmployee(employeeData);
      console.log('✅ Employee created:', response);

      // Ghi log khi tạo nhân viên mới
      await adminLogService.logEmployeeCreate(
        formData.employeeCode,
        `${formData.firstName} ${formData.lastName}`
      );

      toast.success('Nhân viên mới đã được tạo thành công!');
      navigate('/employees');
    } catch (error) {
      console.error('❌ Error creating employee:', error);
      toast.error('Đã có lỗi xảy ra khi tạo nhân viên. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  // Check if form is valid (for enabling/disabling button)
  const isFormValid = () => {
    const firstNameValid = formData.firstName && formData.firstName.trim().length > 0;
    const lastNameValid = formData.lastName && formData.lastName.trim().length > 0;
    const dateOfBirthValid = formData.dateOfBirth && formData.dateOfBirth.trim().length > 0;
    const genderValid = formData.gender && (formData.gender === 'male' || formData.gender === 'female' || formData.gender === 'Nam' || formData.gender === 'Nữ');
    const phoneValid = formData.phone && formData.phone.trim().length > 0;
    const personalEmailValid = formData.personalEmail && 
                               formData.personalEmail.trim().length > 0 && 
                               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail.trim());
    const departmentValid = formData.department && formData.department.trim().length > 0;
    const positionValid = formData.position && formData.position.trim().length > 0;
    const employeeCodeValid = formData.employeeCode && formData.employeeCode.trim().length > 0;
    const companyEmailValid = formData.companyEmail && 
                              formData.companyEmail.trim().length > 0 && 
                              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail.trim());
    const contractTypeValid = formData.contractType && formData.contractType.trim().length > 0;

    // Debug log để kiểm tra
    if (process.env.NODE_ENV === 'development') {
      const missingFields = [];
      if (!firstNameValid) missingFields.push('Họ');
      if (!lastNameValid) missingFields.push('Tên');
      if (!dateOfBirthValid) missingFields.push('Ngày sinh');
      if (!genderValid) missingFields.push('Giới tính');
      if (!phoneValid) missingFields.push('Số điện thoại');
      if (!personalEmailValid) missingFields.push('Email cá nhân');
      if (!departmentValid) missingFields.push('Phòng ban');
      if (!positionValid) missingFields.push('Chức vụ');
      if (!employeeCodeValid) missingFields.push('Mã nhân viên');
      if (!companyEmailValid) missingFields.push('Email công ty');
      if (!contractTypeValid) missingFields.push('Loại hợp đồng');
      
      if (missingFields.length > 0) {
        console.log('❌ Các trường chưa điền đủ:', missingFields);
        console.log('📋 Form data:', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          phone: formData.phone,
          personalEmail: formData.personalEmail,
          department: formData.department,
          position: formData.position,
          employeeCode: formData.employeeCode,
          companyEmail: formData.companyEmail,
          contractType: formData.contractType
        });
      }
    }

    return firstNameValid &&
           lastNameValid &&
           dateOfBirthValid &&
           genderValid &&
           phoneValid &&
           personalEmailValid &&
           departmentValid &&
           positionValid &&
           employeeCodeValid &&
           companyEmailValid &&
           contractTypeValid;
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
  const shifts = ['Ca sáng', 'Ca chiều', 'Ca tối', 'Ca đêm', 'Tùy chỉnh'];
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
                <div className="text-xs text-amber-600 mt-2 text-center space-y-1">
                  <p className="font-semibold">Vui lòng điền đầy đủ các trường bắt buộc:</p>
                  <div className="text-left mt-2 space-y-1">
                    {(!formData.firstName || !formData.firstName.trim()) && (
                      <p>• Họ (Thông tin cá nhân)</p>
                    )}
                    {(!formData.lastName || !formData.lastName.trim()) && (
                      <p>• Tên (Thông tin cá nhân)</p>
                    )}
                    {(!formData.dateOfBirth || !formData.dateOfBirth.trim()) && (
                      <p>• Ngày sinh (Thông tin cá nhân)</p>
                    )}
                    {(!formData.gender || (formData.gender !== 'male' && formData.gender !== 'female' && formData.gender !== 'Nam' && formData.gender !== 'Nữ')) && (
                      <p>• Giới tính (Thông tin cá nhân)</p>
                    )}
                    {(!formData.phone || !formData.phone.trim()) && (
                      <p>• Số điện thoại (Thông tin cá nhân)</p>
                    )}
                    {(!formData.personalEmail || !formData.personalEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail.trim())) && (
                      <p>• Email cá nhân hợp lệ (Thông tin cá nhân)</p>
                    )}
                    {(!formData.department || !formData.department.trim()) && (
                      <p>• Phòng ban (Thông tin công việc)</p>
                    )}
                    {(!formData.position || !formData.position.trim()) && (
                      <p>• Chức vụ (Thông tin công việc)</p>
                    )}
                    {(!formData.employeeCode || !formData.employeeCode.trim()) && (
                      <p>• Mã nhân viên (Thông tin công việc)</p>
                    )}
                    {(!formData.companyEmail || !formData.companyEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail.trim())) && (
                      <p>• Email công ty hợp lệ (Thông tin công việc)</p>
                    )}
                    {(!formData.contractType || !formData.contractType.trim()) && (
                      <p>• Loại hợp đồng (Thông tin công việc)</p>
                    )}
                  </div>
                </div>
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

                {/* Work Schedule */}
                <div>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Lịch làm việc</h3>
                    <Clock className="w-4 h-4 ml-2 text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Thời gian vào, thời gian ra và ca làm việc của nhân viên</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Select
                        label="Ca làm việc"
                        value={formData.shift}
                        onChange={(value) => handleInputChange('shift', value)}
                        options={shifts.map(shift => ({ value: shift, label: shift }))}
                        placeholder="-- Chọn ca làm việc --"
                        helperText="Chọn ca làm việc, thời gian sẽ tự động được thiết lập"
                        required
                      />
                    </div>
                    <div></div>
                    <Input
                      label="Thời gian vào"
                      type="time"
                      value={formData.timeIn}
                      onChange={(value) => handleInputChange('timeIn', value)}
                      placeholder="Chọn thời gian vào"
                      helperText={formData.shift === 'Tùy chỉnh' ? "Nhập thời gian vào tùy chỉnh" : formData.shift ? "Tự động thiết lập theo ca làm việc, có thể chỉnh sửa" : "Thời gian bắt đầu làm việc trong ngày"}
                    />
                    <Input
                      label="Thời gian ra"
                      type="time"
                      value={formData.timeOut}
                      onChange={(value) => handleInputChange('timeOut', value)}
                      placeholder="Chọn thời gian ra"
                      helperText={formData.shift === 'Tùy chỉnh' ? "Nhập thời gian ra tùy chỉnh" : formData.shift ? "Tự động thiết lập theo ca làm việc, có thể chỉnh sửa" : "Thời gian kết thúc làm việc trong ngày"}
                    />
                  </div>
                  {formData.shift && formData.shift !== 'Tùy chỉnh' && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>{formData.shift}:</strong> Thời gian vào {formData.timeIn} - Thời gian ra {formData.timeOut}
                      </p>
                    </div>
                  )}
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
