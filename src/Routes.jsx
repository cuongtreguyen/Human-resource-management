import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Employee pages
import EmployeeList from './pages/EmployeeList';
import AddEmployee from './pages/AddEmployee';
import FaceRecognition from './pages/FaceRecognition';
import AttendanceList from './pages/AttendanceList';
import AttendanceCreate from './pages/AttendanceCreate';
import UserList from './pages/UserList';

// Import Payroll pages
import PayrollList from './pages/PayrollList';
import PayrollPolicies from './pages/PayrollPolicies';

// Placeholder components for other pages

const AttendanceSummary = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900">Attendance Summary</h1>
      <p className="text-gray-600">Attendance summary page coming soon...</p>
    </div>
  </div>
);

const RequestList = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Request Management</h1>
      <p className="text-gray-600">Request list page coming soon...</p>
    </div>
  </div>
);

const CreateRequest = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Request</h1>
      <p className="text-gray-600">Create request page coming soon...</p>
    </div>
  </div>
);

const LeaveManagement = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Leave Management</h1>
      <p className="text-gray-600">Leave management page coming soon...</p>
    </div>
  </div>
);

const CreateLeave = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Leave</h1>
      <p className="text-gray-600">Create leave page coming soon...</p>
    </div>
  </div>
);

const RecruitmentManagement = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Recruitment Management</h1>
      <p className="text-gray-600">Recruitment page coming soon...</p>
    </div>
  </div>
);

const PositionsList = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Positions List</h1>
      <p className="text-gray-600">Positions list page coming soon...</p>
    </div>
  </div>
);

const ApplicationsList = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Applications List</h1>
      <p className="text-gray-600">Applications list page coming soon...</p>
    </div>
  </div>
);

const RoleManagement = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Role Management</h1>
      <p className="text-gray-600">Role management page coming soon...</p>
    </div>
  </div>
);

const LogsMonitor = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Logs Monitor</h1>
      <p className="text-gray-600">Logs monitor page coming soon...</p>
    </div>
  </div>
);

const Profile = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
      <p className="text-gray-600">Profile page coming soon...</p>
    </div>
  </div>
);

const Chat = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Internal Chat</h1>
      <p className="text-gray-600">Internal chat page coming soon...</p>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Employee Routes */}
      <Route path="/employees" element={<EmployeeList />} />
      <Route path="/employees/add" element={<AddEmployee />} />
      <Route path="/employees/export" element={<div>Export Data</div>} />
      
      {/* Attendance Routes */}
      <Route path="/attendance" element={<AttendanceList />} />
      <Route path="/attendance/create" element={<AttendanceCreate />} />
      <Route path="/attendance/summary" element={<AttendanceSummary />} />
      
      {/* Payroll Routes */}
      <Route path="/payroll" element={<PayrollList />} />
      <Route path="/payroll/policies" element={<PayrollPolicies />} />
      
      {/* Request Routes */}
      <Route path="/requests" element={<RequestList />} />
      <Route path="/requests/create" element={<CreateRequest />} />
      
      {/* Leave Routes */}
      <Route path="/leaves" element={<LeaveManagement />} />
      <Route path="/leaves/create" element={<CreateLeave />} />
      
      {/* Recruitment Routes */}
      <Route path="/recruitment" element={<RecruitmentManagement />} />
      <Route path="/recruitment/positions" element={<PositionsList />} />
      <Route path="/recruitment/applications" element={<ApplicationsList />} />
      
      {/* Admin Routes */}
      <Route path="/admin/users" element={<UserList />} />
      <Route path="/admin/roles" element={<RoleManagement />} />
      <Route path="/admin/logs" element={<LogsMonitor />} />
      
      {/* User Routes */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/face-recognition" element={<FaceRecognition />} />
      
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;