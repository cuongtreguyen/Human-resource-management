import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Calendar, Clock, Users, TrendingUp, Eye, Edit, Save, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';

// Modal Attendance Details Component
const AttendanceDetailsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const attendanceRecords = [
    { date: '2025-03-03', startTime: '08:00', endTime: '18:00', hours: '10', overtime: '2', status: 'Late' },
    { date: '2025-03-04', startTime: '08:30', endTime: '18:30', hours: '10', overtime: '0.5', status: 'On time' },
    { date: '2025-03-05', startTime: '08:00', endTime: '18:00', hours: '10', overtime: '0', status: 'On time' },
    { date: '2025-03-06', startTime: '08:30', endTime: '18:30', hours: '10', overtime: '0.5', status: 'On time' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Late': return 'bg-red-100 text-red-800';
      case 'On time': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeBarWidth = (hours) => {
    return Math.min(Number(hours) * 10, 100); // Scale hours to percentage
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Attendance Details - Nguyễn Văn Bình</h2>
            <p className="text-sm text-gray-500 mt-1">March 2024 Attendance</p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              options={[
                { value: 'all', label: 'All' },
                { value: 'late', label: 'Late' },
                { value: 'on-time', label: 'On time' }
              ]}
              defaultValue="all"
              className="w-32"
            />
            <Button 
              onClick={onClose} 
              variant="secondary" 
              className="px-3 py-1 text-sm"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {attendanceRecords.map((record, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              {/* Date header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">{record.date}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Time bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Start {record.startTime}</span>
                  <span>End {record.endTime}</span>
                </div>
                <div className="relative">
                  <div className="w-full h-8 bg-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-lg transition-all duration-300"
                      style={{ width: `${getTimeBarWidth(record.hours)}%` }}
                    />
                  </div>
                  {/* Time scale */}
                  <div className="absolute top-9 left-0 right-0 text-xs text-gray-400 flex justify-between">
                    <span>08:00</span>
                    <span>10:00</span>
                    <span>12:00</span>
                    <span>14:00</span>
                    <span>16:00</span>
                    <span>18:00</span>
                  </div>
                </div>
              </div>

              {/* Status indicators */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Hours Worked</span>
                </div>
                {Number(record.overtime) > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">OT</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Edit Attendance Modal Component
const EditAttendanceModal = ({ isOpen, onClose, onSubmit, recordData }) => {
  const [formData, setFormData] = useState({
    checkIn: recordData?.clockIn || '08:00',
    checkOut: recordData?.clockOut || '18:00',
    status: recordData?.status || 'Late',
    lateMinutes: recordData?.lateMinutes || 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };
  
  const statusOptions = [
    { value: 'On Time', label: 'On Time' },
    { value: 'Late', label: 'Late' },
    { value: 'Absent', label: 'Absent' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit Attendance Record</h2>
          <Button 
            onClick={onClose} 
            variant="ghost" 
            className="px-3 py-1 text-sm"
          >
            ✕
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Date</label>
            <div className="text-gray-600">{recordData?.date || '2025-03-03'}</div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Check-in Time</label>
            <Input
              type="time"
              value={formData.checkIn}
              onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Check-out Time</label>
            <Input
              type="time"
              value={formData.checkOut}
              onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
            <Select
              options={statusOptions}
              defaultValue={formData.status}
              onChange={(value) => setFormData({...formData, status: value})}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Late Minutes</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormData({...formData, lateMinutes: Math.max(0, formData.lateMinutes - 5)})}
                className="p-1 border border-gray-300 rounded hover:bg-gray-50"
              >
                -
              </button>
              <Input
                type="number"
                value={formData.lateMinutes}
                onChange={(e) => setFormData({...formData, lateMinutes: Number(e.target.value)})}
                className="text-center"
              />
              <button
                type="button"
                onClick={() => setFormData({...formData, lateMinutes: formData.lateMinutes + 5})}
                className="p-1 border border-gray-300 rounded hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="primary"
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AttendanceList = () => {
  const [currentView, setCurrentView] = useState('summary'); // summary | employees | details
  const [showAttendanceDetails, setShowAttendanceDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filters, setFilters] = useState({
    department: 'Phòng phát triển Phần mềm',
    month: 'March',
    year: '2025',
    display: '1 records'
  });

  const employeeSummaryData = [
    {
      id: 1,
      name: 'Nguyễn Văn Bình',
      avatar: 'N',
      workingDays: 18,
      lateDays: 3,
      absentDays: 0,
      overtimeHours: 4
    },
    {
      id: 2,
      name: 'Trần Thị Mai',
      avatar: 'T',
      workingDays: 20,
      lateDays: 1,
      absentDays: 0,
      overtimeHours: 2.5
    },
    {
      id: 3,
      name: 'Lê Văn Hùng',
      avatar: 'L',
      workingDays: 19,
      lateDays: 2,
      absentDays: 1,
      overtimeHours: 6
    }
  ];

  const attendanceAnalytics = [
    { month: 'Jan', onTime: 95, late: 3, absent: 2 },
    { month: 'Feb', onTime: 92, late: 5, absent: 3 },
    { month: 'Mar', onTime: 88, late: 8, absent: 4 },
    { month: 'Apr', onTime: 91, late: 6, absent: 3 },
    { month: 'May', onTime: 93, late: 4, absent: 3 },
    { month: 'Jun', onTime: 90, late: 7, absent: 3 },
    { month: 'Jul', onTime: 94, late: 4, absent: 2 },
    { month: 'Aug', onTime: 89, late: 8, absent: 3 },
    { month: 'Sep', onTime: 87, late: 9, absent: 4 },
    { month: 'Oct', onTime: 92, late: 5, absent: 3 },
    { month: 'Nov', onTime: 93, late: 4, absent: 3 },
    { month: 'Dec', onTime: 95, late: 3, absent: 2 }
  ];

  const handleOpenDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowAttendanceDetails(true);
  };

  const handleEditRecord = (record) => {
    setSelectedEmployee(record);
    setShowEditModal(true);
    setShowAttendanceDetails(false);
  };

  if (currentView === 'summary') {
  return (
    <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Header with purple background */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
            <div className="container mx-auto">
              <div className="flex items-center justify-between">
          <div>
                  <h1 className="text-3xl font-bold text-white">Attendance Summary</h1>
                  <p className="text-purple-100 mt-1">Payroll calculation and attendance tracking</p>
          </div>
                <Button 
                  onClick={() => setCurrentView('employees')}
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-purple-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
            </Button>
          </div>
        </div>
      </div>

          <div className="container mx-auto p-6">
            {/* Filters */}
            <Card className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <Select
                    options={[
                      { value: 'Phòng phát triển Phần mềm', label: 'Phòng phát triển Phần mềm' },
                      { value: 'Phòng Marketing', label: 'Phòng Marketing' },
                      { value: 'Phòng HR', label: 'Phòng HR' }
                    ]}
                    defaultValue={filters.department}
                    onChange={(value) => setFilters({...filters, department: value})}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <Select
                    options={[
                      { value: 'January', label: 'January' },
                      { value: 'February', label: 'February' },
                      { value: 'March', label: 'March' },
                      { value: 'April', label: 'April' },
                      { value: 'May', label: 'May' },
                      { value: 'June', label: 'June' },
                      { value: 'July', label: 'July' },
                      { value: 'August', label: 'August' },
                      { value: 'September', label: 'September' },
                      { value: 'October', label: 'October' },
                      { value: 'November', label: 'November' },
                      { value: 'December', label: 'December' }
                    ]}
                    defaultValue={filters.month}
                    onChange={(value) => setFilters({...filters, month: value})}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <Select
                    options={[
                      { value: '2025', label: '2025' },
                      { value: '2024', label: '2024' }
                    ]}
                    defaultValue={filters.year}
                    onChange={(value) => setFilters({...filters, year: value})}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display</label>
                  <Select
                    options={[
                      { value: '1 records', label: '1 records' },
                      { value: '10 records', label: '10 records' },
                      { value: '20 records', label: '20 records' }
                    ]}
                    defaultValue={filters.display}
                    onChange={(value) => setFilters({...filters, display: value})}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-4">
                <Input
                  placeholder="Search employee name..."
                  icon={<Search className="h-4 w-4" />}
                  className="flex-1"
                />
                <Button variant="primary" icon={<Filter className="h-4 w-4" />}>
                  Apply Filters
                </Button>
                <Button variant="primary" icon={<Search className="h-4 w-4" />}>
                  Search
                </Button>
              </div>
            </Card>

      {/* Attendance Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Monthly Trends */}
              <Card title="Monthly Attendance Trends" icon={<TrendingUp className="h-5 w-5" />} className="lg:col-span-2">
                <div className="space-y-3">
                  {attendanceAnalytics.map((data, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 text-sm font-medium text-gray-700">{data.month}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${data.onTime}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{data.onTime}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-500 h-2 rounded-full"
                              style={{ width: `${data.late}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{data.late}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${data.absent}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{data.absent}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Statistics Cards */}
              <div className="space-y-4">
                <Card>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">91.5%</div>
                    <div className="text-sm text-gray-600">Monthly Average On-time rate</div>
                  </div>
                </Card>

                <Card>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-xl font-bold text-gray-900">Jan</div>
                    <div className="text-sm text-gray-600">Best Month 95% on-time</div>
              </div>
                </Card>
            </div>
          </div>

            {/* Employee Attendance Summary */}
            <Card 
              title="Employee Attendance Summary"
              actions={
                <div className="flex items-center gap-4">
                  <Button variant="primary" icon={<Clock className="h-4 w-4" />}>
                    Calculate Payroll
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">View:</span>
                    <Button variant="ghost" size="sm">
                      <div className="w-4 h-4 bg-purple-600 rounded-sm"></div>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <div className="w-4 h-4 border border-gray-400"></div>
                    </Button>
                  </div>
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">EMPLOYEE</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">WORKING DAYS</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">LATE DAYS</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">ABSENT DAYS</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">OVERTIME (HOURS)</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">DETAILS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeSummaryData.map((employee) => (
                      <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {employee.avatar}
                            </div>
                            <span className="font-medium text-gray-900">{employee.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <input 
                            type="text" 
                            value={employee.workingDays} 
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                            readOnly
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input 
                            type="text" 
                            value={employee.lateDays} 
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                            readOnly
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input 
                            type="text" 
                            value={employee.absentDays} 
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                            readOnly
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input 
                            type="text" 
                            value={employee.overtimeHours} 
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                            readOnly
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleOpenDetails(employee)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing 1 to 3 results
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="primary" size="sm">1</Button>
                  <Button variant="ghost" size="sm">2</Button>
                  <Button variant="ghost" size="sm">3</Button>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <AttendanceDetailsModal
          isOpen={showAttendanceDetails}
          onClose={() => setShowAttendanceDetails(false)}
        />

        <EditAttendanceModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={(data) => console.log('Save attendance:', data)}
          recordData={selectedEmployee}
        />
      </Layout>
    );
  }

  // Original attendance list view
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Employee Attendance
              </h1>
              <div className="flex gap-3">
                <Button 
                  variant="primary" 
                  onClick={() => setCurrentView('summary')}
                >
                  Go to Summary
                </Button>
              </div>
            </div>
            
            {/* Rest of original attendance list content */}
            <Card title="Attendance Record">
              <div className="space-y-4">
                {/* Filters remain the same */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <Select
                      options={[
                        { value: 'all', label: 'All Statuses' },
                        { value: 'on-time', label: 'On Time' },
                        { value: 'late', label: 'Late' },
                        { value: 'absent', label: 'Absent' }
                      ]}
                      defaultValue="all"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
          <Input
            type="date"
                      defaultValue="2024-01-01"
                      icon={<Calendar className="h-4 w-4" />}
                      className="w-full"
          />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
          <Input
            type="date"
                      defaultValue="2024-01-31"
                      icon={<Calendar className="h-4 w-4" />}
                      className="w-full"
                    />
          </div>
        </div>

                <div className="flex gap-3">
          <Input
            placeholder="Search by name..."
                    icon={<Search className="h-4 w-4" />}
            className="flex-1"
          />
                  <Button variant="primary">Search</Button>
                  <Button variant="secondary">Apply Filter</Button>
                </div>

                {/* Sample attendance records */}
                <div className="space-y-3">
                  {[
                    { name: 'Nguyễn Văn Bình', date: '2025-03-03', checkIn: '08:00', checkOut: '18:00', status: 'Late', overtime: '2h' },
                    { name: 'Trần Thị Mai', date: '2025-03-03', checkIn: '08:30', checkOut: '18:30', status: 'On time', overtime: '0.5h' },
                    { name: 'Lê Văn Hùng', date: '2025-03-03', checkIn: '08:15', checkOut: '18:15', status: 'Late', overtime: '1h' }
                  ].map((record, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {record.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{record.name}</div>
                            <div className="text-sm text-gray-500">{record.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Check In</div>
                            <div className="font-medium">{record.checkIn}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Check Out</div>
                            <div className="font-medium">{record.checkOut}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Overtime</div>
                            <div className="font-medium text-blue-600">{record.overtime}</div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            record.status === 'On time' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {record.status}
                          </span>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleEditRecord(record)}
                          >
                            <Edit className="h-4 w-4" />
          </Button>
        </div>
                      </div>
                    </div>
                  ))}
            </div>
        </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Modal for original view */}
      <EditAttendanceModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)} 
        onSubmit={(data) => console.log('Save attendance:', data)}
        recordData={selectedEmployee}
      />
    </Layout>
  );
};

export default AttendanceList;