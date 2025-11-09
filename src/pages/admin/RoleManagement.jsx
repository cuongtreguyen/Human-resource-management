import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { User, Lock, Trash2, Plus, Check, X } from 'lucide-react';

const RoleManagement = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [showAddRole, setShowAddRole] = useState(false);

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Administrator',
      description: 'Admin',
      permissions: {
        employeeManagement: 'Manage',
        userManagement: 'Manage',
        attendanceManagement: 'Manage',
        payrollManagement: 'Manage',
        requestManagement: 'Manage',
        recruitmentManagement: 'Manage',
        systemSettings: 'Manage'
      }
    },
    {
      id: 2,
      name: 'HR Manager',
      description: 'Human Resources Manager',
      permissions: {
        employeeManagement: 'Manage',
        userManagement: 'Update',
        attendanceManagement: 'Manage',
        payrollManagement: 'Manage',
        requestManagement: 'Manage',
        recruitmentManagement: 'Manage',
        systemSettings: 'Visible'
      }
    },
    {
      id: 3,
      name: 'Employee',
      description: 'Regular Employee',
      permissions: {
        employeeManagement: 'Visible',
        userManagement: 'None',
        attendanceManagement: 'Visible',
        payrollManagement: 'Visible',
        requestManagement: 'Add',
        recruitmentManagement: 'None',
        systemSettings: 'None'
      }
    }
  ]);

  const [permissions, setPermissions] = useState({
    employeeManagement: 'None',
    userManagement: 'None',
    attendanceManagement: 'None',
    payrollManagement: 'None',
    requestManagement: 'None',
    recruitmentManagement: 'None',
    systemSettings: 'None'
  });

  const permissionLevels = [
    { value: 'Manage', label: 'Manage', description: 'Can access update/delete pages' },
    { value: 'Update', label: 'Update', description: 'Can update information' },
    { value: 'Add', label: 'Add', description: 'Can add new items' },
    { value: 'Visible', label: 'Visible', description: 'View only' },
    { value: 'None', label: 'None', description: 'No access' }
  ];

  const modules = [
    { key: 'employeeManagement', label: 'Employee Management', icon: '👥' },
    { key: 'userManagement', label: 'User Management', icon: '👤' },
    { key: 'attendanceManagement', label: 'Attendance Management', icon: '⏰' },
    { key: 'payrollManagement', label: 'Payroll Management', icon: '💰' },
    { key: 'requestManagement', label: 'Request Management', icon: '📋' },
    { key: 'recruitmentManagement', label: 'Recruitment Management', icon: '🎯' },
    { key: 'systemSettings', label: 'System Settings', icon: '⚙️' }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setPermissions(role.permissions);
  };

  const handlePermissionChange = (module, level) => {
    setPermissions(prev => ({
      ...prev,
      [module]: level
    }));
  };

  const handleAddRole = () => {
    if (newRoleName.trim()) {
      const newRole = {
        id: roles.length + 1,
        name: newRoleName,
        description: newRoleDescription,
        permissions: { ...permissions }
      };
      setRoles([...roles, newRole]);
      setNewRoleName('');
      setNewRoleDescription('');
      setShowAddRole(false);
      alert('Role added successfully!');
    }
  };

  const handleDeleteRole = (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(role => role.id !== roleId));
      if (selectedRole && selectedRole.id === roleId) {
        setSelectedRole(null);
        setPermissions({
          employeeManagement: 'None',
          userManagement: 'None',
          attendanceManagement: 'None',
          payrollManagement: 'None',
          requestManagement: 'None',
          recruitmentManagement: 'None',
          systemSettings: 'None'
        });
      }
      alert('Role deleted successfully!');
    }
  };

  const handleUpdatePermissions = () => {
    if (selectedRole) {
      const updatedRoles = roles.map(role => 
        role.id === selectedRole.id 
          ? { ...role, permissions: { ...permissions } }
          : role
      );
      setRoles(updatedRoles);
      setSelectedRole({ ...selectedRole, permissions: { ...permissions } });
      alert('Permissions updated successfully!');
    }
  };

  const handleClearChanges = () => {
    if (selectedRole) {
      setPermissions(selectedRole.permissions);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Role and Access Management</h1>
                <p className="text-purple-100 mt-1">Configure and manage roles and permissions in the system</p>
              </div>
              <Button 
                variant="secondary" 
                size="md" 
                onClick={() => navigate('/dashboard')}
              >
                ← Back to Dashboard
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Role List */}
            <Card title="Role List">
              <div className="space-y-4">
                {/* Role Management */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Management</h3>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => setShowAddRole(true)}
                    className="mb-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Role
                  </Button>

                  {/* Add Role Form */}
                  {showAddRole && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <Input
                        label="Role Name"
                        value={newRoleName}
                        onChange={(value) => setNewRoleName(value)}
                        placeholder="Enter role name"
                      />
                      <Input
                        label="Description"
                        value={newRoleDescription}
                        onChange={(value) => setNewRoleDescription(value)}
                        placeholder="Enter role description"
                      />
                      <div className="flex space-x-2 mt-4">
                        <Button variant="primary" size="sm" onClick={handleAddRole}>
                          <Check className="h-4 w-4 mr-2" />
                          Add Role
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => setShowAddRole(false)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Role List */}
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedRole?.id === role.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleRoleSelect(role)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900">{role.name}</h4>
                            <p className="text-sm text-gray-600">{role.description}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRole(role.id);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Permission Configuration */}
            <Card title="Permission Configuration">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Configuration</h3>
                  <p className="text-gray-600 mb-4">
                    Configuring for role: <span className="font-medium text-purple-600">
                      {selectedRole ? selectedRole.name : 'Select a role'}
                    </span>
                  </p>

                  {/* Permission Levels */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-900 mb-2">Permission Levels:</h4>
                    <div className="space-y-1 text-sm text-blue-800">
                      {permissionLevels.map(level => (
                        <div key={level.value}>
                          <strong>{level.label}:</strong> {level.description}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Module Permissions */}
                  <div className="space-y-4">
                    {modules.map((module) => (
                      <div key={module.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{module.icon}</span>
                          <span className="font-medium text-gray-900">{module.label}</span>
                        </div>
                        <Select
                          options={permissionLevels.map(level => ({ value: level.value, label: level.label }))}
                          value={permissions[module.key]}
                          onChange={(value) => handlePermissionChange(module.key, value)}
                          className="w-32"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <Button 
                      variant="secondary" 
                      onClick={handleClearChanges}
                      disabled={!selectedRole}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Changes
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleUpdatePermissions}
                      disabled={!selectedRole}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Update Permissions
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoleManagement;
