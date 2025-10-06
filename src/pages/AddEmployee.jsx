import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { User, Phone, MapPin, Users, Calendar, Check, X, Upload } from 'lucide-react';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  
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
    maritalStatus: '',
    
    // Employment Details
    department: '',
    position: '',
    employeeCode: '',
    companyEmail: '',
    contractCode: '',
    contractType: '',
    baseSalary: '',
    signDate: '',
    startDate: '',
    endDate: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      navigate('/employees');
    }, 2000);
  };

  const handleCancel = () => {
    navigate('/employees');
  };

  const tabs = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'employment', label: 'Employment Details' },
    { id: 'dependents', label: 'Dependents' }
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
                disabled={saving}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                {saving ? 'Creating...' : 'Create Employee'}
              </Button>
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
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                    />
                    <Input
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                    />
                    <Input
                      label="Date of Birth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
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
                    </div>
                    <Input
                      label="ID Number"
                      value={formData.idNumber}
                      onChange={(e) => handleInputChange('idNumber', e.target.value)}
                      placeholder="Enter ID number"
                    />
                    <Input
                      label="Tax Code"
                      value={formData.taxCode}
                      onChange={(e) => handleInputChange('taxCode', e.target.value)}
                      placeholder="Enter tax code"
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
                      onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                      placeholder="Enter personal email"
                    />
                    <Input
                      label="Phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                    <Input
                      label="Permanent Address"
                      value={formData.permanentAddress}
                      onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                      placeholder="Enter permanent address"
                    />
                    <Input
                      label="Temporary Address"
                      value={formData.temporaryAddress}
                      onChange={(e) => handleInputChange('temporaryAddress', e.target.value)}
                      placeholder="Enter temporary address"
                    />
                  </div>
                </div>

                {/* Marital Status */}
                <div>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Marital Status</h3>
                    <Users className="w-4 h-4 ml-2 text-purple-500" />
                  </div>
                  
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="maritalStatus"
                        value="single"
                        checked={formData.maritalStatus === 'single'}
                        onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                        className="mr-2"
                      />
                      Single
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="maritalStatus"
                        value="married"
                        checked={formData.maritalStatus === 'married'}
                        onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                        className="mr-2"
                      />
                      Married
                    </label>
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
                    <Select
                      label="Department"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      options={departments.map(dept => ({ value: dept, label: dept }))}
                      placeholder="-- Select Department --"
                    />
                    <Select
                      label="Position"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      options={positions.map(pos => ({ value: pos, label: pos }))}
                      placeholder="-- Select Position --"
                    />
                    <Input
                      label="Employee Code"
                      value={formData.employeeCode}
                      onChange={(e) => handleInputChange('employeeCode', e.target.value)}
                      placeholder="Enter employee code"
                    />
                    <Input
                      label="Company Email"
                      type="email"
                      value={formData.companyEmail}
                      onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                      placeholder="Enter company email"
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
                      onChange={(e) => handleInputChange('contractCode', e.target.value)}
                      placeholder="Enter contract code"
                    />
                    <Select
                      label="Contract Type"
                      value={formData.contractType}
                      onChange={(e) => handleInputChange('contractType', e.target.value)}
                      options={contractTypes.map(type => ({ value: type, label: type }))}
                      placeholder="-- Select Contract Type --"
                    />
                    <Input
                      label="Base Salary"
                      value={formData.baseSalary}
                      onChange={(e) => handleInputChange('baseSalary', e.target.value)}
                      placeholder="Enter base salary"
                    />
                    <Input
                      label="Sign Date"
                      type="date"
                      value={formData.signDate}
                      onChange={(e) => handleInputChange('signDate', e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Enter amount in millions (e.g. 10 for 10 million)</p>
                </div>

                {/* Contract Period */}
                <div>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Contract Period</h3>
                    <Calendar className="w-4 h-4 ml-2 text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Contract validity dates</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Start Date"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                    <Input
                      label="End Date"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'dependents' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dependents</h1>
                    <p className="text-gray-600">Family members and tax dependents</p>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Add Dependent
                  </Button>
                </div>

                {/* Empty State */}
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No dependents added yet</p>
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
