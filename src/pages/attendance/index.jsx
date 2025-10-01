// src/pages/attendance/index.jsx
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Filter, 
  Search, 
  Calculator, 
  Eye, 
  Grid3X3, 
  List,
  Edit,
  Check,
  X
} from 'lucide-react';
import AttendanceDetailsModal from './components/AttendanceDetailsModal';
import EditAttendanceModal from './components/EditAttendanceModal';
import { employeeService, getEmployeeInitials } from '../../services/employeeService';

const AttendancePage = () => {
  const [filters, setFilters] = useState({
    department: 'Công nghệ thông tin',
    month: 'March',
    year: '2025',
    display: '1 records'
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3);
  const [recordsPerPage, setRecordsPerPage] = useState(1);

  // Employee data from employeeService
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load employees data
  useEffect(() => {
    const loadEmployees = async () => {
    try {
      setLoading(true);
        const [employeesResponse, departmentsResponse] = await Promise.all([
          employeeService.getAllEmployees(),
          employeeService.getDepartments()
        ]);

        if (employeesResponse.success) {
          const employeesWithAttendance = employeesResponse.data.map(emp => ({
            ...emp,
            avatar: getEmployeeInitials(emp.name),
            workingDays: Math.floor(Math.random() * 5) + 18, // 18-22 days
            lateDays: Math.floor(Math.random() * 4), // 0-3 days
            absentDays: Math.floor(Math.random() * 2), // 0-1 days
            overtimeHours: Math.round((Math.random() * 8) * 10) / 10 // 0-8 hours
          }));
          
          setAllEmployees(employeesWithAttendance);
          setEmployees(employeesWithAttendance);
        }

        if (departmentsResponse.success) {
          setDepartments(departmentsResponse.data);
        }
    } catch (error) {
        console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

    loadEmployees();
  }, []);

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedRecord) => {
    console.log('Saving record:', updatedRecord);
    setShowEditModal(false);
    setEditingRecord(null);
    // Pass the updated record back to the details modal
    if (selectedEmployee) {
      // This will be handled by the AttendanceDetailsModal's handleSaveRecord
    }
  };

  const handleCalculatePayroll = () => {
    console.log('Calculating payroll...');
    
    // Mock API call for payroll calculation
    const mockPayrollData = {
      department: filters.department,
      period: `${filters.month} ${filters.year}`,
      totalEmployees: filteredEmployees.length,
      payrollSummary: {
        totalBaseSalary: 375000000,
        totalOvertime: 18000000,
        totalPenalties: 1200000,
        netPayroll: 391800000
      },
      employeePayrolls: filteredEmployees.map(emp => ({
        employeeId: emp.id,
        name: emp.name,
        baseSalary: 15000000,
        overtimePay: emp.overtimeHours * 93750 * 1.5,
        latePenalty: emp.lateDays * 50000,
        absentPenalty: emp.absentDays * 200000,
        netSalary: 15000000 + (emp.overtimeHours * 93750 * 1.5) - (emp.lateDays * 50000) - (emp.absentDays * 200000)
      }))
    };
    
    alert(`Payroll calculated successfully!\n\nDepartment: ${mockPayrollData.department}\nPeriod: ${mockPayrollData.period}\nTotal Employees: ${mockPayrollData.totalEmployees}\nNet Payroll: ${mockPayrollData.payrollSummary.netPayroll.toLocaleString()} VND`);
  };

  // Filter employees based on department and search term
  const filteredEmployees = employees.filter(emp => {
    const matchesDepartment = emp.department === filters.department;
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  // Pagination logic
  const totalFilteredEmployees = filteredEmployees.length;
  const totalPagesCalculated = Math.ceil(totalFilteredEmployees / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
        {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Attendance Summary</h1>
            <p className="text-purple-100 mt-1">Payroll calculation and attendance tracking</p>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="bg-purple-800 hover:bg-purple-900 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select 
              value={filters.department}
              onChange={(e) => {
                setFilters({...filters, department: e.target.value});
                setCurrentPage(1); // Reset to first page when changing department
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select 
              value={filters.month}
              onChange={(e) => setFilters({...filters, month: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
        </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select 
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
        </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Display</label>
            <select 
              value={filters.display}
              onChange={(e) => {
                const newDisplay = e.target.value;
                setFilters({...filters, display: newDisplay});
                // Extract number from "X records" format
                const recordsCount = parseInt(newDisplay.split(' ')[0]);
                setRecordsPerPage(recordsCount);
                setCurrentPage(1); // Reset to first page when changing records per page
                console.log(`Display changed to: ${recordsCount} records per page`);
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="1 records">1 records</option>
              <option value="5 records">5 records</option>
              <option value="10 records">10 records</option>
              <option value="25 records">25 records</option>
              <option value="50 records">50 records</option>
              <option value="100 records">100 records</option>
            </select>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search employee name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <button 
            onClick={() => {
              console.log('Applying filters:', filters);
              alert(`Filters applied!\nDepartment: ${filters.department}\nMonth: ${filters.month}\nYear: ${filters.year}\nDisplay: ${filters.display}`);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Apply Filters
          </button>
          <button 
            onClick={() => {
              console.log('Searching for:', searchTerm);
              if (searchTerm.trim()) {
                alert(`Searching for: "${searchTerm}"\nFound ${filteredEmployees.length} results`);
              } else {
                alert('Please enter a search term');
              }
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>

        {/* Employee Attendance Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Employee Attendance Summary</h2>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleCalculatePayroll}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Calculator className="w-4 h-4" />
                Calculate Payroll
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
      </div>
    </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Employee</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Working Days</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Late Days</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Absent Days</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Overtime (Hours)</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Details</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {employee.avatar}
                        </div>
                        <span className="font-medium text-gray-900">{employee.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <input
                        type="number"
                        value={employee.workingDays}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value) || 0;
                          setEmployees(prev => prev.map(emp => 
                            emp.id === employee.id ? { ...emp, workingDays: newValue } : emp
                          ));
                          console.log(`Updated working days for ${employee.name}: ${newValue}`);
                        }}
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <input
                        type="number"
                        value={employee.lateDays}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value) || 0;
                          setEmployees(prev => prev.map(emp => 
                            emp.id === employee.id ? { ...emp, lateDays: newValue } : emp
                          ));
                          console.log(`Updated late days for ${employee.name}: ${newValue}`);
                        }}
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <input
                        type="number"
                        value={employee.absentDays}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value) || 0;
                          setEmployees(prev => prev.map(emp => 
                            emp.id === employee.id ? { ...emp, absentDays: newValue } : emp
                          ));
                          console.log(`Updated absent days for ${employee.name}: ${newValue}`);
                        }}
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <input
                        type="number"
                        step="0.1"
                        value={employee.overtimeHours}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value) || 0;
                          setEmployees(prev => prev.map(emp => 
                            emp.id === employee.id ? { ...emp, overtimeHours: newValue } : emp
                          ));
                          console.log(`Updated overtime hours for ${employee.name}: ${newValue}`);
                        }}
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleViewDetails(employee)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, totalFilteredEmployees)} of {totalFilteredEmployees} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={currentPage === 1}
              >
                &lt;&lt;
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {[...Array(totalPagesCalculated)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === i + 1
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={currentPage === totalPagesCalculated}
              >
                &gt;
              </button>
              <button
                onClick={() => setCurrentPage(totalPagesCalculated)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={currentPage === totalPagesCalculated}
              >
                &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && selectedEmployee && (
        <AttendanceDetailsModal
          employee={selectedEmployee}
          onClose={() => setShowDetailsModal(false)}
          onEditRecord={handleEditRecord}
          onSaveRecord={(updatedRecord) => {
            console.log('Record saved from parent:', updatedRecord);
            // Update the main employees list if needed
            setEmployees(prev => prev.map(emp => 
              emp.id === selectedEmployee.id ? {
                ...emp,
                // Update summary stats based on the record changes
                workingDays: emp.workingDays,
                lateDays: emp.lateDays,
                absentDays: emp.absentDays,
                overtimeHours: emp.overtimeHours
              } : emp
            ));
          }}
        />
      )}

      {showEditModal && editingRecord && (
        <EditAttendanceModal
          record={editingRecord}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedRecord) => {
            console.log('EditAttendanceModal onSave called with:', updatedRecord);
            handleSaveEdit(updatedRecord);
            
            // Notify the details modal about the update
            if (selectedEmployee) {
              console.log('Dispatching attendanceRecordUpdated event');
              const event = new CustomEvent('attendanceRecordUpdated', { 
                detail: updatedRecord 
              });
              window.dispatchEvent(event);
            }
          }}
        />
      )}
    </div>
  );
};

export default AttendancePage;
