import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const AddEmployee = () => {
  const [activeTab, setActiveTab] = useState('personal');
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
    employeeId: '',
    department: '',
    position: '',
    manager: '',
    startDate: '',
    employmentType: '',
    salary: '',
    
    // Dependents
    dependents: []
  });

  const departments = ['Development', 'Marketing', 'HR', 'Finance', 'Operations', 'Sales', 'Support'];
  const positions = ['Developer', 'Manager', 'Specialist', 'Analyst', 'Director', 'Coordinator', 'Assistant'];
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Intern', 'Freelance'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Employee data:', formData);
    // Here you would normally submit the data to your backend
  };

  const tabs = [
    { id: 'personal', name: 'Personal Information', icon: '👤' },
    { id: 'employment', name: 'Employment Details', icon: '💼' },
    { id: 'dependents', name: 'Dependents', icon: '👨‍👩‍👧‍👦' }
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Create New Employee</h1>
            <p className="text-purple-100 mt-1">Add a new employee to your organization</p>
          </div>
          <Button variant="secondary" size="md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ← Back to List
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <Card className="lg:col-span-1">
          <div className="text-center">
            {/* Profile Avatar */}
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">New Employee</h3>
            <p className="text-sm text-gray-500 mb-6">Upload a photo and fill in the details</p>
            
            {/* Actions */}
            <div className="space-y-3">
              <Button variant="primary" size="lg" className="w-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create Employee
              </Button>
              <Button variant="secondary" size="lg" className="w-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit}>
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  {/* Personal Details */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personal Details
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">Basic personal information</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        required
                        value={formData.firstName}
                        onChange={(value) => handleInputChange('firstName', value)}
                        placeholder="Enter first name"
                      />
                      <Input
                        label="Last Name"
                        required
                        value={formData.lastName}
                        onChange={(value) => handleInputChange('lastName', value)}
                        placeholder="Enter last name"
                      />
                      <Input
                        label="Date of Birth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(value) => handleInputChange('dateOfBirth', value)}
                      />
                      <div>
                        <label className="block text-sm font-medium texto-gray-700 mb-2">Gender</label>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="gender"
                              value="male"
                              checked={formData.gender === 'male'}
                              onChange={(e) => handleInputChange('gender', e.target.value)}
                              className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Male</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              checked={formData.gender === 'female'}
                              onChange={(e) => handleInputChange('gender', e.target.value)}
                              className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Female</span>
                          </label>
                        </div>
                      </div>
                      <Input
                        label="ID Number"
                        value={formData.idNumber}
                        onChange={(value) => handleInputChange('idNumber', value)}
                        placeholder="Enter ID number"
                      />
                      <Input
                        label="Tax Code"
                        value={formData.taxCode}
                        onChange={(value) => handleInputChange('taxCode', value)}
                        placeholder="Enter tax code"
                      />
                    </div>
                  </div>

                  {/* Contact & Address */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Contact & Address
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">How to reach the employee</p>
                    
                    <div className="space-y-4">
                      <Input
                        label="Personal Email"
                        type="email"
                        required
                        value={formData.personalEmail}
                        onChange={(value) => handleInputChange('personalEmail', value)}
                        placeholder="Enter email address"
                      />
                      <Input
                        label="Phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(value) => handleInputChange('phone', value)}
                        placeholder="Enter phone number"
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

                  {/* Marital Status */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Marital Status
                    </h3>
                    
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="maritalStatus"
                          value="single"
                          checked={formData.maritalStatus === 'single'}
                          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Single</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="maritalStatus"
                          value="married"
                          checked={formData.maritalStatus === 'married'}
                          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                          className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Married</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'employment' && (
                <div className="space-y-6">
                  <Input
                    label="Employee ID"
                    required
                    value={formData.employeeId}
                    onChange={(value) => handleInputChange('employeeId', value)}
                    placeholder="Auto-generated or manual"
                  />
                  
                  <Select
                    label="Department"
                    options={departments.map(dept => ({ value: dept, label: dept }))}
                    value={formData.department}
                    onChange={(value) => handleInputChange('department', value)}
                    required
                  />
                  
                  <Select
                    label="Position"
                    options={positions.map(pos => ({ value: pos, label: pos }))}
                    value={formData.position}
                    onChange={(value) => handleInputChange('position', value)}
                    required
                  />
                  
                  <Input
                    label="Start Date"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(value) => handleInputChange('startDate', value)}
                  />
                  
                  <Select
                    label="Employment Type"
                    options={employmentTypes.map(type => ({ value: type, label: type }))}
                    value={formData.employmentType}
                    onChange={(value) => handleInputChange('employmentType', value)}
                    required
                  />
                  
                  <Input
                    label="Salary"
                    type="number"
                    required
                    value={formData.salary}
                    onChange={(value) => handleInputChange('salary', value)}
                    placeholder="Enter annual salary"
                  />
                </div>
              )}

              {activeTab === 'dependents' && (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Dependents</h3>
                  <p className="text-gray-500 mb-4">Add family members and dependents if needed</p>
                  <Button variant="secondary">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Dependent
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AddEmployee;
