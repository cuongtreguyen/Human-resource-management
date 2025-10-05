import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import fakeApi from '../services/fakeApi';

// Placeholder admin sidebar component (dark theme)
const AdminSidebar = () => {
  const menuItems = [
    {
      category: 'EMPLOYEE MANAGEMENT',
      items: [
        { name: 'Employee List', icon: '👥', path: '/employees' },
        { name: 'Add Employee', icon: '➕', path: '/employees/add' },
        { name: 'Export Data', icon: '📊', path: '/employees/export' }
      ]
    },
    {
      category: 'ATTENDANCE MANAGEMENT',
      items: [
        { name: 'Attendance List', icon: '📅', path: '/attendance' },
        { name: 'Attendance Creation', icon: '⏰', path: '/attendance/create' },
        { name: 'Attendance Summary', icon: '📈', path: '/attendance/summary' }
      ]
    },
    {
      category: 'PAYROLL MANAGEMENT',
        items: [
          { name: 'Payroll List', icon: '💰', path: '/payroll' },
          { name: 'Financial Policy', icon: '📄', path: '/payroll/policies' }
      ]
    },
    {
      category: 'REQUEST MANAGEMENT',
      items: [
        { name: 'Request List', icon: '📋', path: '/requests' },
        { name: 'Create Request', icon: '📝', path: '/requests/create' }
      ]
    },
    {
      category: 'LEAVE MANAGEMENT',
      items: [
        { name: 'Leave Management', icon: '📚', path: '/leaves' },
        { name: 'Create Leave', icon: '📜', path: '/leaves/create' }
      ]
    },
    {
      category: 'RECRUITMENT MANAGEMENT',
      items: [
        { name: 'Recruitment Management', icon: '💼', path: '/recruitment' },
        { name: 'Positions List', icon: '📋', path: '/recruitment/positions' },
        { name: 'Applications List', icon: '📄', path: '/ Recruitments/applications' }
      ]
    },
    {
      category: 'SYSTEM MANAGEMENT',
      items: [
        { name: 'User List', icon: '👥', path: '/admin/users', active: true },
        { name: 'Role Management', icon: '⚙️', path: '/admin/roles' },
        { name: 'Logs Monitor', icon: '📊', path: '/admin/logs' }
      ]
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-gray-800 flex flex-col z-40">
      {/* Scrollbar */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="absolute right-0 top-0 w-1 bg-gray-700"></div>
        
        {/* Menu Items */}
        <div className="px-6">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {section.category}
              </p>
              
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <a
                    key={itemIndex}
                    href={item.path}
                    className={`flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                      item.active
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span className="text-base mr-3">{item.icon}</span>
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    role: 'All Roles',
    status: 'All Status'
  });

  const roles = ['All Roles', 'Administrator', 'HR Manager', 'Employee', 'Manager'];
  const statuses = ['All Status', 'Active', 'Inactive', 'Locked'];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fakeApi.getUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users');
      console.error('Users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(filters.search.toLowerCase()) ||
                         (user.name && user.name.toLowerCase().includes(filters.search.toLowerCase())) ||
                         (user.email && user.email.toLowerCase().includes(filters.search.toLowerCase()));
    const matchesRole = filters.role === 'All Roles' || user.role === filters.role;
    const matchesStatus = filters.status === 'All Status' || user.status === filters.status;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      role: 'All Roles',
      status: 'All Status'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex items-center justify-center w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex items-center justify-center w-full">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Users</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={loadUsers}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <AdminSidebar />
      
      <div className="flex-1 ml-72">
        <main className="p-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-purple-100 mt-1">Manage system users and their permissions.</p>
              </div>
              <Button variant="secondary" size="md">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                ← Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <div className="text-purple-600 mb-3">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-purple-600">1</h3>
              <p className="text-gray-600">Total Users</p>
            </Card>

            <Card className="text-center">
              <div className="text-green-600 mb-3">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-600">0</h3>
              <p className="text-gray-600">Active Users</p>
            </Card>

            <Card className="text-center">
              <div className="text-yellow-600 mb-3">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-yellow-600">0</h3>
              <p className="text-gray-600">Locked Accounts</p>
            </Card>

            <Card className="text-center">
              <div className="text-purple-600 mb-3">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-purple-600">1</h3>
              <p className="text-gray-600">Total Roles</p>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card title="Search & Filter" className="mb-6">
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <Input
                  label="Search"
                  placeholder="Search by username, email, name..."
                  value={filters.search}
                  onChange={(value) => handleFilterChange('search', value)}
                />
              </div>
              <Select
                label="Role"
                options={roles.map(role => ({ value: role, label: role }))}
                value={filters.role}
                onChange={(value) => handleFilterChange('role', value)}
              />
              <Select
                label="Status"
                options={statuses.map(status => ({ value: status, label: status }))}
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
              />
            </div>
            
            <div className="flex justify-end">
              <Button variant="danger" size="sm" onClick={clearFilters}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </Button>
            </div>
          </Card>

          {/* User Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      USERNAME
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NAME
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EMAIL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ROLE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STATUS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      LAST LOGIN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.name || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.status || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.lastLogin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-purple-600 hover:text-purple-900">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-900">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing 1 - 1 of 1 results
              </div>
              <div className="flex items-center space-x-1">
                <button disabled className="px-3 py-1 text-sm text-gray-400 cursor-not-allowed">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
                <button className="px-3 py-1 text-sm text-gray-400 cursor-not-allowed">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default UserList;
