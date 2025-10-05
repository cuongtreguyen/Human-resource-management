import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import fakeApi from '../services/fakeApi';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: 'Development',
    designation: '',
    joiningDate: '',
    employmentStatus: 'Active',
    address: ''
  });

  const departments = ['Development', 'Marketing', 'HR', 'Finance', 'Operations', 'Sales', 'Support'];
  const employmentStatuses = ['Active', 'Inactive', 'Contract', 'Probation'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Format data for API
      const employeeData = {
        name: formData.fullName,
        email: formData.email,
        position: formData.designation,
        department: formData.department,
        phone: formData.phone,
        hireDate: formData.joiningDate,
        status: formData.employmentStatus.toLowerCase(),
        address: formData.address
      };

      const response = await fakeApi.createEmployee(employeeData);
      alert('Employee created successfully!');
      navigate('/employees');
    } catch (err) {
      alert('Failed to create employee');
      console.error('Create employee error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/employees');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  return (
    <Layout>
      {/* Modal-style overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Add Employee</h2>
                  <button
              onClick={handleGoBack}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
                  </button>
            </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                        required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
                  </div>

              {/* Email */}
                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                        type="email"
                        required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                        type="tel"
                        required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="+919876543210"
                        value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                  </div>

              {/* Designation */}
                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
                        <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g. Software Engineer"
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                />
                </div>

              {/* Joining Date */}
              <div>
                <label className="block text-sm font-medium text-gray- Bru mb-2">Joining Date *</label>
                <input
                    type="date"
                    required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={formData.joiningDate}
                  onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                />
              </div>

              {/* Employment Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={formData.employmentStatus}
                  onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                >
                  {employmentStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
              <textarea
                    required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 resize-vertical"
                placeholder="Enter address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  Chọn tệp
                </button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <span className="text-sm text-gray-500">
                  {selectedFile ? selectedFile.name : "Không có tệp nào được chọn"}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading && (
                  <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-B5" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Add Employee
              </button>
                </div>
            </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddEmployee;