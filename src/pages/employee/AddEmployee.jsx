import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { User, Phone, Check, X } from 'lucide-react';

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
    idNumber: '',
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
    signDate: ''
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
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.personalEmail.trim()) {
      newErrors.personalEmail = 'Personal email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail)) {
      newErrors.personalEmail = 'Please enter a valid email address';
    }

    // Employment Details - Required fields
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    if (!formData.position) {
      newErrors.position = 'Position is required';
    }
    if (!formData.employeeCode.trim()) {
      newErrors.employeeCode = 'Employee code is required';
    }
    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = 'Company email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
      newErrors.companyEmail = 'Please enter a valid email address';
    }
    if (!formData.contractType) {
      newErrors.contractType = 'Contract type is required';
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
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      console.log('New employee payload', formData);
      navigate('/employees');
    }, 2000);
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
    { id: 'personal', label: 'Personal Information' },
    { id: 'employment', label: 'Employment Details' }
  ];

  const departments = [
    'IT Department',
    'Human Resources',
    'Finance',
    'Marketing',
    'Sales',
    'Operations'
  ];

  const positions = [
    'Software Developer',
    'HR Manager',
    'Accountant',
    'Marketing Specialist',
    'Sales Representative',
    'Operations Manager'
  ];

  const contractTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship'
  ];


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
              <h2 className="text-xl font-semibold text-gray-900 mb-2">New Employee</h2>
              <p className="text-sm text-purple-600">Upload a photo and fill in the details</p>
            </div>
          </Card>

          {/* Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={handleSubmit}
                disabled={saving || !isFormValid()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4 mr-2" />
                {saving ? 'Creating...' : 'Create Employee'}
              </Button>
              {!isFormValid() && (
                <p className="text-xs text-amber-600 mt-2 text-center">
                  Please fill in all required fields
                </p>
              )}
              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
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
                <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
                <p className="text-gray-600">Basic personal information</p>

                {/* Personal Details */}
                <div>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
                    <User className="w-4 h-4 ml-2 text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Basic personal information</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={formData.firstName}
                      onChange={(value) => handleInputChange('firstName', value)}
                      placeholder="Enter first name"
                      required
                      error={errors.firstName}
                    />
                    <Input
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(value) => handleInputChange('lastName', value)}
                      placeholder="Enter last name"
                      required
                      error={errors.lastName}
                    />
                    <Input
                      label="Date of Birth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(value) => handleInputChange('dateOfBirth', value)}
                      required
                      error={errors.dateOfBirth}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender <span className="text-red-500">*</span>
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
                          Male
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
                          Female
                        </label>
                      </div>
                      {errors.gender && (
                        <p className="text-sm text-red-600 mt-1">{errors.gender}</p>
                      )}
                    </div>
                    <Input
                      label="ID Number"
                      value={formData.idNumber}
                      onChange={(value) => handleInputChange('idNumber', value)}
                      placeholder="Enter ID number (CMND/CCCD)"
                      helperText="Số CMND/CCCD của nhân viên (9 hoặc 12 chữ số)"
                    />
                    <Input
                      label="Tax Code"
                      value={formData.taxCode}
                      onChange={(value) => handleInputChange('taxCode', value)}
                      placeholder="Enter tax code"
                      helperText="Mã số thuế cá nhân (MST) - dùng để khai báo thuế thu nhập cá nhân"
                    />
                  </div>
                </div>

                {/* Contact & Address */}
                <div>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Contact & Address</h3>
                    <Phone className="w-4 h-4 ml-2 text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">How to reach the employee</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Personal Email"
                      type="email"
                      value={formData.personalEmail}
                      onChange={(value) => handleInputChange('personalEmail', value)}
                      placeholder="Enter personal email"
                      required
                      error={errors.personalEmail}
                    />
                    <Input
                      label="Phone"
                      value={formData.phone}
                      onChange={(value) => handleInputChange('phone', value)}
                      placeholder="Enter phone number"
                      required
                      error={errors.phone}
                    />
                    <Input
                      label="Permanent Address"
                      value={formData.permanentAddress}
                      onChange={(value) => handleInputChange('permanentAddress', value)}
                      placeholder="Enter permanent address"
                    />
                    <Input
                      label="Temporary Address"
                      value={formData.temporaryAddress}
                      onChange={(value) => handleInputChange('temporaryAddress', value)}
                      placeholder="Enter temporary address"
                    />
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'employment' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Employment Details</h1>
                <p className="text-gray-600">Employment contract information</p>

                {/* Company Information */}
                <div>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                    <User className="w-4 h-4 ml-2 text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Department and position details</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Select
                        label="Department"
                        value={formData.department}
                        onChange={(value) => handleInputChange('department', value)}
                        options={departments.map(dept => ({ value: dept, label: dept }))}
                        placeholder="-- Select Department --"
                        required
                        error={errors.department}
                      />
                    </div>
                    <div>
                      <Select
                        label="Position"
                        value={formData.position}
                        onChange={(value) => handleInputChange('position', value)}
                        options={positions.map(pos => ({ value: pos, label: pos }))}
                        placeholder="-- Select Position --"
                        required
                        error={errors.position}
                      />
                    </div>
                    <Input
                      label="Employee Code"
                      value={formData.employeeCode}
                      onChange={(value) => handleInputChange('employeeCode', value)}
                      placeholder="Enter employee code"
                      required
                      error={errors.employeeCode}
                    />
                    <Input
                      label="Company Email"
                      type="email"
                      value={formData.companyEmail}
                      onChange={(value) => handleInputChange('companyEmail', value)}
                      placeholder="Enter company email"
                      required
                      error={errors.companyEmail}
                    />
                  </div>
                </div>

                {/* Contract Details */}
                <div>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Contract Details</h3>
                    <User className="w-4 h-4 ml-2 text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Employment contract information</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Contract Code"
                      value={formData.contractCode}
                      onChange={(value) => handleInputChange('contractCode', value)}
                      placeholder="Enter contract code"
                    />
                    <div>
                      <Select
                        label="Contract Type"
                        value={formData.contractType}
                        onChange={(value) => handleInputChange('contractType', value)}
                        options={contractTypes.map(type => ({ value: type, label: type }))}
                        placeholder="-- Select Contract Type --"
                        required
                        error={errors.contractType}
                      />
                    </div>
                    <Input
                      label="Base Salary"
                      value={formData.baseSalary}
                      onChange={(value) => handleInputChange('baseSalary', value)}
                      placeholder="Enter base salary"
                    />
                    <Input
                      label="Sign Date"
                      type="date"
                      value={formData.signDate}
                      onChange={(value) => handleInputChange('signDate', value)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Enter amount in millions (e.g. 10 for 10 million)</p>
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
