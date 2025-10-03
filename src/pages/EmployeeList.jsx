import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const EmployeeList = () => {
  const [employees] = useState([
    {
      id: 1,
      name: 'John Doe',
      department: 'Development',
      position: 'Senior Developer',
      email: 'john.doe@company.com',
      startDate: '2022-01-15',
      salary: 85000,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      department: 'Marketing',
      position: 'Marketing Manager',
      email: 'jane.smith@company.com',
      startDate: '2021-03-20',
      salary: 75000,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      department: 'HR',
      position: 'HR Specialist',
      email: 'mike.johnson@company.com',
      startDate: '2020-11-10',
      salary: 65000,
      status: 'Active'
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    department: 'All Departments',
    position: 'All Positions',
    salaryRange: 'All Ranges'
  });

  const departments = ['All Departments', 'Development', 'Marketing', 'HR', 'Finance', 'Operations'];
  const positions = ['All Positions', 'Developer', 'Manager', 'Specialist', 'Analyst', 'Director'];
  const salaryRanges = ['All Ranges', '$30k - $50k', '$50k - $70k', '$70k - $90k', '$90k+'];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         employee.email.toLowerCase().includes(filters.search.toLowerCase());
    const matchesDepartment = filters.department === 'All Departments' || employee.department === filters.department;
    const matchesPosition = filters.position === 'All Positions' || employee.position === filters.position;
    
    return matchesSearch && matchesDepartment && matchesPosition;
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
      department: 'All Departments',
      position: 'All Positions',
      salaryRange: 'All Ranges'
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Active: 'bg-green-100 text-green-800',
      Inactive: 'bg-red-100 text-red-800',
      Pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
        {status}
      </span>
    );
  };

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  const avgSalary = Math.round(employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length);

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Employee Management</h1>
            <p className="text-purple-100 mt-1">Manage your organization's workforce</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary" size="md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Employee
            </Button>
            <Button variant="outline" size="md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.293V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="text-center">
          <div className="text-blue-600 mb-3">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-blue-600">{totalEmployees}</h3>
          <p className="text-gray-600">Total Employees</p>
        </Card>

        <Card className="text-center">
          <div className="text-green-600 mb-3">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-green-600">{activeEmployees}</h3>
          <p className="text-gray-600">Active Employees</p>
        </Card>

        <Card className="text-center">
          <div className="text-purple-600 mb-3">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-purple-600">${avgSalary.toLocaleString()}</h3>
          <p className="text-gray-600">Avg. Salary</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card title="Search & Filter" className="mb-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                label="Search"
                placeholder="Search employee..."
                value={filters.search}
                onChange={(value) => handleFilterChange('search', value)}
              />
            </div>
            <Select
              label="Department"
              options={departments.map(dept => ({ value: dept, label: dept }))}
              value={filters.department}
              onChange={(value) => handleFilterChange('department', value)}
            />
            <Select
              label="Position"
              options={positions.map(pos => ({ value: pos, label: pos }))}
              value={filters.position}
              onChange={(value) => handleFilterChange('position', value)}
            />
            <Select
              label="Salary Range"
              options={salaryRanges.map(range => ({ value: range, label: range }))}
              value={filters.salaryRange}
              onChange={(value) => handleFilterChange('salaryRange', value)}
            />
          </div>
          
          {/* Filter Actions */}
          <div className="flex justify-between items-center">
            <Button variant="danger" size="sm" onClick={clearFilters}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </Button>
            <Button variant="primary" size="sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.293V19a2 2 0 01-2 2z" />
              </svg>
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Employee List */}
      <Card title="Employee List">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(employee.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${Math.round(employee.salary / 12).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(employee.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-purple-600 hover:text-purple-900">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
          
          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing 1 to {filteredEmployees.length} of {totalEmployees} results
          </div>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm">Previous</Button>
            <Button variant="secondary" size="sm">Next</Button>
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default EmployeeList;
