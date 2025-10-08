import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import fakeApi from '../services/fakeApi';

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
    
    // Job Information
    employeeId: '',
    department: '',
    position: '',
    startDate: '',
    status: '',
    manager: '',
    
    // Salary Information
    salary: '',
    payGrade: '',
    benefits: '',
    
    // Additional Information
    emergencyContact: '',
    emergencyPhone: '',
    notes: ''
  });

  useEffect(() => {
    loadEmployeeData();
  }, [id, loadEmployeeData]);

  const loadEmployeeData = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call to get employee data
      const response = await fakeApi.getEmployeeById(id);
      setFormData(response.data);
    } catch (err) {
      console.error('Error loading employee:', err);
      alert('Failed to load employee data');
    } finally {
      setLoading(false);
    }
  }, [id]);

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
      alert('Employee updated successfully!');
      navigate('/employees');
    } catch (err) {
      alert('Failed to update employee');
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const departments = ['IT', 'Human Resources', 'Marketing', 'Finance', 'Sales', 'Operations'];
  const positions = ['Software Developer', 'HR Manager', 'Marketing Specialist', 'Accountant', 'Sales Executive', 'Operations Manager'];
  const statuses = ['Active', 'Inactive', 'On Leave', 'Terminated'];
  const genders = ['Male', 'Female', 'Other'];
  const payGrades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading employee data...</p>
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
                <h1 className="text-3xl font-bold">Edit Employee</h1>
                <p className="text-blue-100 mt-1">Update employee information</p>
              </div>
              <Button 
                variant="secondary" 
                size="md" 
                onClick={() => navigate('/employees')}
              >
                ← Back to Employees
              </Button>
            </div>
          </div>

          {/* Edit Form */}
          <Card title={`Edit Employee ID: ${id}`}>
            <div className="space-y-8">
              
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(value) => handleInputChange('firstName', value)}
                    placeholder="Enter first name"
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(value) => handleInputChange('lastName', value)}
                    placeholder="Enter last name"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                    placeholder="Enter email address"
                  />
                  <Input
                    label="Phone"
                    value={formData.phone}
                    onChange={(value) => handleInputChange('phone', value)}
                    placeholder="Enter phone number"
                  />
                  <Input
                    label="Address"
                    value={formData.address}
                    onChange={(value) => handleInputChange('address', value)}
                    placeholder="Enter address"
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(value) => handleInputChange('dateOfBirth', value)}
                  />
                  <Select
                    label="Gender"
                    options={genders.map(gender => ({ value: gender, label: gender }))}
                    value={formData.gender}
                    onChange={(value) => handleInputChange('gender', value)}
                  />
                </div>
              </div>

              {/* Job Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Job Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Employee ID"
                    value={formData.employeeId}
                    onChange={(value) => handleInputChange('employeeId', value)}
                    placeholder="Enter employee ID"
                  />
                  <Select
                    label="Department"
                    options={departments.map(dept => ({ value: dept, label: dept }))}
                    value={formData.department}
                    onChange={(value) => handleInputChange('department', value)}
                  />
                  <Select
                    label="Position"
                    options={positions.map(pos => ({ value: pos, label: pos }))}
                    value={formData.position}
                    onChange={(value) => handleInputChange('position', value)}
                  />
                  <Input
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(value) => handleInputChange('startDate', value)}
                  />
                  <Select
                    label="Status"
                    options={statuses.map(status => ({ value: status, label: status }))}
                    value={formData.status}
                    onChange={(value) => handleInputChange('status', value)}
                  />
                  <Input
                    label="Manager"
                    value={formData.manager}
                    onChange={(value) => handleInputChange('manager', value)}
                    placeholder="Enter manager name"
                  />
                </div>
              </div>

              {/* Salary Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Salary Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Annual Salary"
                    type="number"
                    value={formData.salary}
                    onChange={(value) => handleInputChange('salary', value)}
                    placeholder="Enter annual salary"
                  />
                  <Select
                    label="Pay Grade"
                    options={payGrades.map(grade => ({ value: grade, label: grade }))}
                    value={formData.payGrade}
                    onChange={(value) => handleInputChange('payGrade', value)}
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Benefits
                    </label>
                    <textarea
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      value={formData.benefits}
                      onChange={(e) => handleInputChange('benefits', e.target.value)}
                      placeholder="Enter benefits information"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Emergency Contact Name"
                    value={formData.emergencyContact}
                    onChange={(value) => handleInputChange('emergencyContact', value)}
                    placeholder="Enter emergency contact name"
                  />
                  <Input
                    label="Emergency Contact Phone"
                    value={formData.emergencyPhone}
                    onChange={(value) => handleInputChange('emergencyPhone', value)}
                    placeholder="Enter emergency contact phone"
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Additional Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Enter any additional notes or comments"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/employees')}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
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
