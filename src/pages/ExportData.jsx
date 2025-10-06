import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import { Download, FileText, FileSpreadsheet, File, Calendar, Filter, Users, Building, Briefcase } from 'lucide-react';

const ExportData = () => {
  const [exportOptions, setExportOptions] = useState({
    format: 'excel',
    department: 'all',
    position: 'all',
    status: 'all',
    dateRange: 'all',
    startDate: '',
    endDate: '',
    includeColumns: {
      personalInfo: true,
      contactInfo: true,
      employmentInfo: true,
      salaryInfo: false,
      performanceInfo: false
    }
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleInputChange = (field, value) => {
    setExportOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleColumnToggle = (column) => {
    setExportOptions(prev => ({
      ...prev,
      includeColumns: {
        ...prev.includeColumns,
        [column]: !prev.includeColumns[column]
      }
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      // In real app, this would trigger file download
      alert('Export completed! File would be downloaded in real application.');
    }, 3000);
  };

  const formatOptions = [
    { value: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
    { value: 'csv', label: 'CSV (.csv)', icon: FileText },
    { value: 'pdf', label: 'PDF (.pdf)', icon: File }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'it', label: 'IT Department' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'operations', label: 'Operations' }
  ];

  const positionOptions = [
    { value: 'all', label: 'All Positions' },
    { value: 'manager', label: 'Manager' },
    { value: 'developer', label: 'Software Developer' },
    { value: 'accountant', label: 'Accountant' },
    { value: 'specialist', label: 'Specialist' },
    { value: 'assistant', label: 'Assistant' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'probation', label: 'Probation' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'this_year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const columnOptions = [
    { key: 'personalInfo', label: 'Personal Information', description: 'Name, DOB, Gender, ID' },
    { key: 'contactInfo', label: 'Contact Information', description: 'Email, Phone, Address' },
    { key: 'employmentInfo', label: 'Employment Details', description: 'Department, Position, Start Date' },
    { key: 'salaryInfo', label: 'Salary Information', description: 'Base Salary, Allowances' },
    { key: 'performanceInfo', label: 'Performance Data', description: 'Reviews, Ratings' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Export Employee Data</h1>
          <p className="text-gray-600">Export employee information in various formats for reporting and analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Export Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Format Selection */}
            <Card>
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Export Format</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {formatOptions.map((format) => (
                  <div
                    key={format.value}
                    onClick={() => handleInputChange('format', format.value)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      exportOptions.format === format.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <format.icon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-center">{format.label}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Filters */}
            <Card>
              <div className="flex items-center mb-4">
                <Filter className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Department"
                  value={exportOptions.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  options={departmentOptions}
                />
                <Select
                  label="Position"
                  value={exportOptions.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  options={positionOptions}
                />
                <Select
                  label="Status"
                  value={exportOptions.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  options={statusOptions}
                />
                <Select
                  label="Date Range"
                  value={exportOptions.dateRange}
                  onChange={(e) => handleInputChange('dateRange', e.target.value)}
                  options={dateRangeOptions}
                />
              </div>

              {/* Custom Date Range */}
              {exportOptions.dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={exportOptions.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={exportOptions.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              )}
            </Card>

            {/* Column Selection */}
            <Card>
              <div className="flex items-center mb-4">
                <Users className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Include Columns</h3>
              </div>
              <div className="space-y-3">
                {columnOptions.map((column) => (
                  <div key={column.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportOptions.includeColumns[column.key]}
                          onChange={() => handleColumnToggle(column.key)}
                          className="mr-3"
                        />
                        <span className="font-medium text-gray-900">{column.label}</span>
                      </div>
                      <p className="text-sm text-gray-500 ml-6">{column.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Export Summary & Actions */}
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-medium">
                    {formatOptions.find(f => f.value === exportOptions.format)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">
                    {departmentOptions.find(d => d.value === exportOptions.department)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Position:</span>
                  <span className="font-medium">
                    {positionOptions.find(p => p.value === exportOptions.position)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">
                    {statusOptions.find(s => s.value === exportOptions.status)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Records:</span>
                  <span className="font-medium text-purple-600">~150 employees</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export Data'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setExportOptions({
                      format: 'excel',
                      department: 'all',
                      position: 'all',
                      status: 'all',
                      dateRange: 'all',
                      startDate: '',
                      endDate: '',
                      includeColumns: {
                        personalInfo: true,
                        contactInfo: true,
                        employmentInfo: true,
                        salaryInfo: false,
                        performanceInfo: false
                      }
                    });
                  }}
                >
                  Reset Options
                </Button>
              </div>
            </Card>

            {/* Export History */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Exports</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium">Employee List - Excel</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium">IT Department - CSV</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium">Monthly Report - PDF</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExportData;
