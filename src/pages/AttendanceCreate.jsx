import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import fakeApi from '../services/fakeApi';

const AttendanceCreate = () => {
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [attendanceSheet, setAttendanceSheet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await fakeApi.getEmployees();
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to load employees:', err);
    }
  };

  const departments = ['All Departments', 'Development', 'Marketing','Finance', 'Operations'];

  // Mock employees data - removed unused variable

  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
    if (value !== 'All Departments') {
      const filteredEmployees = employees.filter(emp => emp.department === value);
      setEmployeeList(filteredEmployees);
    } else {
      setEmployeeList(employees);
    }
  };

  const addToAttendanceSheet = (employee) => {
    const attendanceRecord = {
      id: Date.now(),
      employeeId: employee.id,
      employeeName: employee.name,
      date: new Date().toISOString().split('T')[0],
      clockIn: '',
      clockOut: '',
      overtime: '0',
      status: 'Present'
    };
    
    setAttendanceSheet(prev => [...prev, attendanceRecord]);
  };

  const removeFromAttendanceSheet = (recordId) => {
    setAttendanceSheet(prev => prev.filter(record => record.id !== recordId));
  };

  const updateAttendanceRecord = (recordId, field, value) => {
    setAttendanceSheet(prev => 
      prev.map(record => 
        record.id === recordId 
          ? { ...record, [field]: value }
          : record
      )
    );
  };

  const saveAttendance = async () => {
    try {
      setLoading(true);
      
      // Save each attendance record
      for (const record of attendanceSheet) {
        await fakeApi.createAttendanceRecord({
          employeeId: record.employeeId,
          date: record.date,
          checkIn: record.clockIn,
          checkOut: record.clockOut,
          status: record.status,
          overtime: parseFloat(record.overtime) || 0
        });
      }
      
      alert('Attendance records saved successfully!');
      navigate('/attendance');
    } catch (err) {
      alert('Failed to save attendance records');
      console.error('Save attendance error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/attendance');
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Attendance Management</h1>
            <p className="text-purple-100 mt-1">Select a department and add employees to the attendance sheet</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary" size="md" onClick={handleGoBack}>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              ← Back
            </Button>
            <Button 
              variant="success" 
              size="md" 
              onClick={saveAttendance}
              disabled={loading || attendanceSheet.length === 0}
            >
              {loading ? (
                <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 1m0 0l-3-1m3 1V7m0 0V3" />
                </svg>
              )}
              {loading ? 'Saving...' : 'Save Attendance'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee List */}
        <Card title="Employee List">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          
          <div className="mb-4">
            <Select
              label="Department"
              options={departments.map(dept => ({ value: dept, label: dept }))}
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              placeholder="-- Select Department --"
            />
          </div>

          {!selectedDepartment && (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500">Select a department to display employees</p>
            </div>
          )}

          {selectedDepartment && employeeList.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 mb-3">Available Employees</h4>
              {employeeList.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-medium mr-3">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-xs text-gray-500">{employee.department}</div>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => addToAttendanceSheet(employee)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}

          {selectedDepartment && employeeList.length === 0 && (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500">No employees found in this department</p>
            </div>
          )}
        </Card>

        {/* Attendance Sheet */}
        <Card title="Attendance Sheet">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-blue-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {attendanceSheet.length} employees added to attendance sheet
              </span>
              <Button variant="success" size="sm" onClick={saveAttendance}>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 1m0 0l-3-1m3 1V7m0 0V3" />
                </svg>
                Save Attendance
              </Button>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-7 gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            <div>EMPLOYEE</div>
            <div>DATE</div>
            <div>CHECK-IN</div>
            <div>CHECK-OUT</div>
            <div>OVERTIME</div>
            <div>STATUS</div>
            <div>ACTIONS</div>
          </div>

          {/* Table Body */}
          <div className="space-y-2">
            {attendanceSheet.map((record) => (
              <div key={record.id} className="grid grid-cols-7 gap-2 p-3 bg-gray-50 rounded-lg border">
                <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                <div>
                  <input
                    type="date"
                    value={record.date}
                    onChange={(e) => updateAttendanceRecord(record.id, 'date', e.target.value)}
                    className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <input
                    type="time"
                    value={record.clockIn}
                    onChange={(e) => updateAttendanceRecord(record.id, 'clockIn', e.target.value)}
                    className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <input
                    type="time"
                    value={record.clockOut}
                    onChange={(e) => updateAttendanceRecord(record.id, 'clockOut', e.target.value)}
                    className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={record.overtime}
                    onChange={(e) => updateAttendanceRecord(record.id, 'overtime', e.target.value)}
                    className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <select
                    value={record.status}
                    onChange={(e) => updateAttendanceRecord(record.id, 'status', e.target.value)}
                    className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => removeFromAttendanceSheet(record.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentlyColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {attendanceSheet.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-１２ text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m1 0V7a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v8a2 2 0 002-2h2a2 2 0 002-2V7m6 0v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7" />
              </svg>
              <p className="text-gray-500 mb-2">Select employees from the list on the left to add to the attendance sheet</p>
              <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m1 0V7a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v8a2 2 0 002-2h2a2 2 0 002-2V7m6 0v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7" />
              </svg>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default AttendanceCreate;
