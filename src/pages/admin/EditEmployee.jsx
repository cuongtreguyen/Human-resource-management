import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { getEmployeeById, updateEmployee } from '../../services/api';
import adminLogService from '../../services/adminLogService';
import { User, Phone, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const originalDataRef = useRef(null); // Lưu dữ liệu gốc để so sánh

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    name: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    idNumber: '',
    idCard: '',
    idCardIssueDate: '',
    idCardIssuePlace: '',
    taxCode: '',
    personalEmail: '',
    phone: '',
    permanentAddress: '',
    temporaryAddress: '',
    address: '',

    // Employment Details
    department: '',
    position: '',
    employeeCode: '',
    companyEmail: '',
    email: '',
    contractCode: '',
    contractType: '',
    baseSalary: '',
    salary: '',
    signDate: '',
    hireDate: '',
    manager: '',
    workLocation: '',
    employeeType: '',
    status: '',
    role: '',
    timeIn: '',
    timeOut: '',
    shift: '',

    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: ''
  });

  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          toast.error('ID nhân viên không hợp lệ');
          navigate('/employees');
          return;
        }

        console.log('📋 Loading employee data for ID:', id);
        
        // Dùng API thật - getEmployeeById hỗ trợ cả ID số và employeeId string
        const data = await getEmployeeById(id);
        console.log('✅ Loaded employee data:', data);
        
        if (data) {
          // Tách tên thành firstName và lastName
          // Ưu tiên dùng firstName/lastName từ API, nếu không có thì tách từ name
          let firstName = data.firstName || '';
          let lastName = data.lastName || '';
          let fullName = data.name || '';
          
          if (!firstName && !lastName && fullName) {
            const nameParts = fullName.split(' ').filter(p => p.trim());
            lastName = nameParts.pop() || '';
            firstName = nameParts.join(' ') || '';
          } else if (firstName || lastName) {
            fullName = `${firstName} ${lastName}`.trim();
          }
          
          // Chuyển đổi gender từ API (male/female) sang form (Nam/Nữ)
          const convertGenderForDisplay = (gender) => {
            if (!gender) return '';
            if (gender === 'male' || gender === 'Nam') return 'Nam';
            if (gender === 'female' || gender === 'Nữ') return 'Nữ';
            return gender;
          };

          const loadedData = {
            // Personal Information
            firstName: firstName,
            lastName: lastName,
            name: fullName,
            dateOfBirth: data.dateOfBirth || '',
            gender: convertGenderForDisplay(data.gender),
            maritalStatus: data.maritalStatus || '',
            idNumber: data.idCard || data.idNumber || '',
            idCard: data.idCard || data.idNumber || '',
            idCardIssueDate: data.idCardIssueDate || '',
            idCardIssuePlace: data.idCardIssuePlace || '',
            taxCode: data.taxCode || '',
            personalEmail: data.personalEmail || '',
            phone: data.phone || '',
            permanentAddress: data.permanentAddress || data.address || '',
            temporaryAddress: data.temporaryAddress || '',
            address: data.address || data.permanentAddress || '',
            
            // Employment Details
            department: data.department || '',
            position: data.position || '',
            employeeCode: data.employeeId || data.employeeCode || data.id || '',
            companyEmail: data.email || '',
            email: data.email || '',
            contractCode: data.contractCode || '',
            contractType: data.contractType || '',
            baseSalary: data.salary ? (data.salary / 1000000).toString() : '',
            salary: data.salary || '',
            signDate: data.startDate || data.hireDate || data.signDate || '',
            hireDate: data.startDate || data.hireDate || '',
            manager: data.manager || '',
            workLocation: data.workLocation || '',
            employeeType: data.employeeType || '',
            status: data.status || '',
            // Normalize role: đảm bảo role là uppercase để match với options (ACCOUNTANT, MANAGER, EMPLOYEE)
            role: data.role ? data.role.toUpperCase() : '',
            // Xử lý timeIn/timeOut - có thể là object {hour, minute} hoặc string "HH:mm"
            timeIn: data.timeIn 
              ? (typeof data.timeIn === 'object' && data.timeIn.hour !== undefined
                  ? `${String(data.timeIn.hour).padStart(2, '0')}:${String(data.timeIn.minute || 0).padStart(2, '0')}`
                  : data.timeIn)
              : '',
            timeOut: data.timeOut
              ? (typeof data.timeOut === 'object' && data.timeOut.hour !== undefined
                  ? `${String(data.timeOut.hour).padStart(2, '0')}:${String(data.timeOut.minute || 0).padStart(2, '0')}`
                  : data.timeOut)
              : '',
            shift: data.shift || '',
            
            // Emergency Contact - hỗ trợ cả format object và flat
            emergencyContactName: data.emergencyContactName || data.emergencyContact?.name || '',
            emergencyContactRelationship: data.emergencyContactRelationship || data.emergencyContact?.relationship || '',
            emergencyContactPhone: data.emergencyContactPhone || data.emergencyContact?.phone || ''
          };
          
          console.log('📝 Form data loaded:', loadedData);
          setFormData(loadedData);
          // Lưu dữ liệu gốc để so sánh khi log
          originalDataRef.current = { ...loadedData };
        } else {
          throw new Error('Không tìm thấy dữ liệu nhân viên');
        }
      } catch (err) {
        console.error('❌ Error loading employee:', err);
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          id: id
        });
        setError(err.message || 'Không thể tải thông tin nhân viên');
        // Không navigate ngay, để hiển thị error message
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEmployeeData();
    } else {
      setError('ID nhân viên không hợp lệ');
      setLoading(false);
    }
  }, [id, navigate]);

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
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (!id) {
        toast.error('ID nhân viên không hợp lệ');
        return;
      }

      console.log('💾 Saving employee data for ID:', id);
      
      // Chuyển đổi gender từ tiếng Việt sang tiếng Anh
      const convertGender = (gender) => {
        if (!gender) return undefined;
        if (gender === 'Nam' || gender === 'male') return 'male';
        if (gender === 'Nữ' || gender === 'female') return 'female';
        return gender; // Giữ nguyên nếu đã đúng format
      };

      // Chuyển đổi status sang lowercase và đảm bảo đúng format
      const convertStatus = (status) => {
        if (!status) return 'active'; // Mặc định
        const statusLower = status.toLowerCase();
        const validStatuses = ['active', 'inactive', 'on_leave', 'terminated'];
        if (validStatuses.includes(statusLower)) {
          return statusLower;
        }
        // Nếu không hợp lệ, trả về active
        return 'active';
      };

      // Prepare employee data for API - chỉ gửi các field có giá trị
      const employeeData = {
        // Basic Info
        name: formData.name || `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        email: formData.companyEmail || formData.email || undefined,
        personalEmail: formData.personalEmail || undefined,
        phone: formData.phone || undefined,
        status: convertStatus(formData.status),
        
        // Personal Information
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: convertGender(formData.gender),
        maritalStatus: formData.maritalStatus || undefined,
        
        // ID Card Information - chỉ dùng idNumber, không dùng idCard
        idNumber: formData.idNumber || formData.idCard || undefined,
        idCardIssueDate: formData.idCardIssueDate || undefined,
        idCardIssuePlace: formData.idCardIssuePlace || undefined,
        taxCode: formData.taxCode || undefined,
        
        // Address
        address: formData.permanentAddress || formData.address || undefined,
        permanentAddress: formData.permanentAddress || undefined,
        temporaryAddress: formData.temporaryAddress || undefined,
        
        // Employment Details
        department: formData.department || undefined,
        position: formData.position || undefined,
        employeeId: formData.employeeCode || id, // employeeId là string (EMP001)
        manager: formData.manager || undefined,
        workLocation: formData.workLocation || undefined,
        employeeType: formData.employeeType || undefined,
        contractType: formData.contractType || undefined,
        contractCode: formData.contractCode || undefined,
        startDate: formData.signDate || formData.hireDate || undefined, // API dùng startDate
        salary: formData.baseSalary && !isNaN(parseInt(formData.baseSalary)) 
          ? parseInt(formData.baseSalary) * 1000000 
          : (formData.salary && !isNaN(parseInt(formData.salary)) ? parseInt(formData.salary) : undefined),
        role: formData.role || undefined,
        
        // Work Schedule - xử lý timeIn/timeOut nếu có (theo schema Swagger cần đầy đủ hour, minute, second, nano)
        ...(formData.timeIn && typeof formData.timeIn === 'string' && formData.timeIn.includes(':') ? {
          timeIn: {
            hour: parseInt(formData.timeIn.split(':')[0]) || 0,
            minute: parseInt(formData.timeIn.split(':')[1] || 0) || 0,
            second: 0,
            nano: 0
          }
        } : {}),
        ...(formData.timeOut && typeof formData.timeOut === 'string' && formData.timeOut.includes(':') ? {
          timeOut: {
            hour: parseInt(formData.timeOut.split(':')[0]) || 0,
            minute: parseInt(formData.timeOut.split(':')[1] || 0) || 0,
            second: 0,
            nano: 0
          }
        } : {}),
        shift: formData.shift || undefined,
        
        // Emergency Contact
        emergencyContactName: formData.emergencyContactName || undefined,
        emergencyContactRelationship: formData.emergencyContactRelationship || undefined,
        emergencyContactPhone: formData.emergencyContactPhone || undefined,
      };

      // Loại bỏ các field undefined, empty string, hoặc NaN
      // Giữ lại: số 0, false, null, object (kể cả timeIn/timeOut), Date
      Object.keys(employeeData).forEach(key => {
        const value = employeeData[key];
        if (value === undefined || value === '' || (typeof value === 'number' && isNaN(value))) {
          delete employeeData[key];
        }
      });
      
      console.log('📤 Updating employee with data:', employeeData);
      await updateEmployee(id, employeeData);
      console.log('✅ Employee updated successfully');

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

      toast.success('Cập nhật nhân viên thành công!');
      navigate('/employees');
    } catch (err) {
      toast.error('Không thể cập nhật nhân viên');
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const departments = ['Công nghệ thông tin', 'Marketing', 'Kinh doanh', 'Nhân sự', 'Tài chính'];
  const positions = ['Lập trình viên', 'Quản lý nhân sự', 'Chuyên viên Marketing', 'Kế toán viên', 'Nhân viên kinh doanh', 'Quản lý vận hành', 'Trưởng phòng Nhân sự', 'Kế toán', 'Chuyên viên Marketing', 'Nhân viên Kinh doanh', 'Trưởng phòng Vận hành'];
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
  const shifts = ['Ca sáng', 'Ca chiều', 'Ca tối', 'Ca đêm', 'Tùy chỉnh'];
  const relationships = ['Cha', 'Mẹ', 'Vợ', 'Chồng', 'Anh/Chị/Em', 'Người thân khác'];
  const managers = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Minh C', 'Phạm Thu D'];
  const roles = [
    { value: 'ACCOUNTANT', label: 'ACCOUNTANT' },
    { value: 'MANAGER', label: 'MANAGER' },
    { value: 'EMPLOYEE', label: 'EMPLOYEE' }
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

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Lỗi</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  // Retry load
                  const loadEmployeeData = async () => {
                    try {
                      const data = await getEmployeeById(id);
                      if (data) {
                        let firstName = data.firstName || '';
                        let lastName = data.lastName || '';
                        let fullName = data.name || '';
                        if (!firstName && !lastName && fullName) {
                          const nameParts = fullName.split(' ').filter(p => p.trim());
                          lastName = nameParts.pop() || '';
                          firstName = nameParts.join(' ') || '';
                        } else if (firstName || lastName) {
                          fullName = `${firstName} ${lastName}`.trim();
                        }
                        // Chuyển đổi gender từ API (male/female) sang form (Nam/Nữ)
                        const convertGenderForDisplay = (gender) => {
                          if (!gender) return '';
                          if (gender === 'male' || gender === 'Nam') return 'Nam';
                          if (gender === 'female' || gender === 'Nữ') return 'Nữ';
                          return gender;
                        };

                        const loadedData = {
                          firstName, lastName, name: fullName,
                          dateOfBirth: data.dateOfBirth || '',
                          gender: convertGenderForDisplay(data.gender),
                          maritalStatus: data.maritalStatus || '',
                          idNumber: data.idCard || data.idNumber || '',
                          idCard: data.idCard || data.idNumber || '',
                          idCardIssueDate: data.idCardIssueDate || '',
                          idCardIssuePlace: data.idCardIssuePlace || '',
                          taxCode: data.taxCode || '',
                          personalEmail: data.personalEmail || '',
                          phone: data.phone || '',
                          permanentAddress: data.permanentAddress || data.address || '',
                          temporaryAddress: data.temporaryAddress || '',
                          address: data.address || data.permanentAddress || '',
                          department: data.department || '',
                          position: data.position || '',
                          employeeCode: data.employeeId || data.employeeCode || data.id || '',
                          companyEmail: data.email || '',
                          email: data.email || '',
                          contractCode: data.contractCode || '',
                          contractType: data.contractType || '',
                          baseSalary: data.salary ? (data.salary / 1000000).toString() : '',
                          salary: data.salary || '',
                          signDate: data.startDate || data.hireDate || data.signDate || '',
                          hireDate: data.startDate || data.hireDate || '',
                          manager: data.manager || '',
                          workLocation: data.workLocation || '',
                          employeeType: data.employeeType || '',
                          status: data.status || '',
                          // Normalize role: đảm bảo role là uppercase để match với options (ACCOUNTANT, MANAGER, EMPLOYEE)
                          role: data.role ? data.role.toUpperCase() : '',
                          timeIn: data.timeIn 
                            ? (typeof data.timeIn === 'object' && data.timeIn.hour !== undefined
                                ? `${String(data.timeIn.hour).padStart(2, '0')}:${String(data.timeIn.minute || 0).padStart(2, '0')}`
                                : data.timeIn)
                            : '',
                          timeOut: data.timeOut
                            ? (typeof data.timeOut === 'object' && data.timeOut.hour !== undefined
                                ? `${String(data.timeOut.hour).padStart(2, '0')}:${String(data.timeOut.minute || 0).padStart(2, '0')}`
                                : data.timeOut)
                            : '',
                          shift: data.shift || '',
                          emergencyContactName: data.emergencyContactName || data.emergencyContact?.name || '',
                          emergencyContactRelationship: data.emergencyContactRelationship || data.emergencyContact?.relationship || '',
                          emergencyContactPhone: data.emergencyContactPhone || data.emergencyContact?.phone || ''
                        };
                        setFormData(loadedData);
                        originalDataRef.current = { ...loadedData };
                        setError(null);
                      }
                    } catch (err) {
                      setError(err.message || 'Lỗi không xác định');
                    } finally {
                      setLoading(false);
                    }
                  };
                  loadEmployeeData();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Thử lại
              </button>
              <button
                onClick={() => navigate('/employees')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Kiểm tra nếu không có formData (có thể do lỗi load)
  if (!formData || Object.keys(formData).length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy dữ liệu</h2>
            <p className="text-gray-600 mb-4">Không thể tải thông tin nhân viên</p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-500" />
                  Thông tin cá nhân
                </h3>
                <p className="text-sm text-gray-600 mb-4">Thông tin cá nhân cơ bản</p>

                {/* Personal Details */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Thông tin chi tiết</h4>
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
                      label="Ngày sinh"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(value) => handleInputChange('dateOfBirth', value)}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giới tính
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="Nam"
                            checked={formData.gender === 'Nam'}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="mr-2"
                          />
                          Nam
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="Nữ"
                            checked={formData.gender === 'Nữ'}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="mr-2"
                          />
                          Nữ
                        </label>
                      </div>
                    </div>
                    <Input
                      label="Số CMND/CCCD"
                      value={formData.idNumber || formData.idCard}
                      onChange={(value) => {
                        handleInputChange('idNumber', value);
                        handleInputChange('idCard', value);
                      }}
                      placeholder="Nhập số CMND/CCCD"
                    />
                    <Input
                      label="Mã số thuế"
                      value={formData.taxCode}
                      onChange={(value) => handleInputChange('taxCode', value)}
                      placeholder="Nhập mã số thuế"
                    />
                    <Select
                      label="Tình trạng hôn nhân"
                      options={maritalStatuses.map(status => ({ value: status, label: status }))}
                      value={formData.maritalStatus}
                      onChange={(value) => handleInputChange('maritalStatus', value)}
                      placeholder="-- Chọn tình trạng hôn nhân --"
                    />
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
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-500" />
                    Liên hệ & Địa chỉ
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Email cá nhân"
                      type="email"
                      value={formData.personalEmail}
                      onChange={(value) => handleInputChange('personalEmail', value)}
                      placeholder="Nhập email cá nhân"
                    />
                    <Input
                      label="Số điện thoại"
                      value={formData.phone}
                      onChange={(value) => handleInputChange('phone', value)}
                      placeholder="Nhập số điện thoại"
                    />
                    <Input
                      label="Địa chỉ thường trú"
                      value={formData.permanentAddress || formData.address}
                      onChange={(value) => {
                        handleInputChange('permanentAddress', value);
                        handleInputChange('address', value);
                      }}
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

              {/* Job Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-500" />
                  Thông tin công việc
                </h3>
                <p className="text-sm text-gray-600 mb-4">Thông tin hợp đồng lao động</p>
                
                {/* Company Information */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Thông tin công ty</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Phòng ban"
                      options={departments.map(dept => ({ value: dept, label: dept }))}
                      value={formData.department}
                      onChange={(value) => handleInputChange('department', value)}
                      placeholder="-- Chọn phòng ban --"
                    />
                    <Select
                      label="Chức vụ"
                      options={positions.map(pos => ({ value: pos, label: pos }))}
                      value={formData.position}
                      onChange={(value) => handleInputChange('position', value)}
                      placeholder="-- Chọn chức vụ --"
                    />
                    <Input
                      label="Mã nhân viên"
                      value={formData.employeeCode}
                      onChange={(value) => handleInputChange('employeeCode', value)}
                      placeholder="Nhập mã nhân viên"
                    />
                    <Input
                      label="Email công ty"
                      type="email"
                      value={formData.companyEmail || formData.email}
                      onChange={(value) => {
                        handleInputChange('companyEmail', value);
                        handleInputChange('email', value);
                      }}
                      placeholder="Nhập email công ty"
                    />
                  </div>
                </div>

                {/* Contract Details */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Chi tiết hợp đồng</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Mã hợp đồng"
                      value={formData.contractCode}
                      onChange={(value) => handleInputChange('contractCode', value)}
                      placeholder="Nhập mã hợp đồng"
                    />
                    <Select
                      label="Loại hợp đồng"
                      options={contractTypes.map(type => ({ value: type, label: type }))}
                      value={formData.contractType}
                      onChange={(value) => handleInputChange('contractType', value)}
                      placeholder="-- Chọn loại hợp đồng --"
                    />
                    <Input
                      label="Lương cơ bản"
                      value={formData.baseSalary}
                      onChange={(value) => handleInputChange('baseSalary', value)}
                      placeholder="Nhập lương cơ bản"
                    />
                    <Input
                      label="Ngày ký"
                      type="date"
                      value={formData.signDate || formData.hireDate}
                      onChange={(value) => {
                        handleInputChange('signDate', value);
                        handleInputChange('hireDate', value);
                      }}
                    />
                    <Select
                      label="Quản lý trực tiếp"
                      options={managers.map(mgr => ({ value: mgr, label: mgr }))}
                      value={formData.manager}
                      onChange={(value) => handleInputChange('manager', value)}
                      placeholder="-- Chọn quản lý trực tiếp --"
                    />
                    <Select
                      label="Địa điểm làm việc"
                      options={workLocations.map(loc => ({ value: loc, label: loc }))}
                      value={formData.workLocation}
                      onChange={(value) => handleInputChange('workLocation', value)}
                      placeholder="-- Chọn địa điểm làm việc --"
                    />
                    <Select
                      label="Loại nhân viên"
                      options={employeeTypes.map(type => ({ value: type, label: type }))}
                      value={formData.employeeType}
                      onChange={(value) => handleInputChange('employeeType', value)}
                      placeholder="-- Chọn loại nhân viên --"
                    />
                    <Select
                      label="Trạng thái"
                      options={statuses}
                      value={formData.status}
                      onChange={(value) => handleInputChange('status', value)}
                      placeholder="-- Chọn trạng thái --"
                    />
                    <Select
                      label="Vai trò (Role)"
                      options={roles}
                      value={formData.role}
                      onChange={(value) => handleInputChange('role', value)}
                      placeholder={formData.role ? `Hiện tại: ${formData.role}` : "-- Chọn vai trò --"}
                      helperText={formData.role ? `Vai trò hiện tại của nhân viên: ${formData.role}` : "Chọn vai trò cho nhân viên"}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Nhập số tiền theo triệu đồng (ví dụ: 10 cho 10 triệu)</p>
                </div>

                {/* Work Schedule */}
                <div>
                  <div className="flex items-center mb-4">
                    <h4 className="text-md font-semibold text-gray-800">Lịch làm việc</h4>
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
