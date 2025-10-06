import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Employee pages
import EmployeeList from './pages/EmployeeList';
import FaceRecognition from './pages/FaceRecognition';
import AttendanceList from './pages/AttendanceList';
import AttendanceCreate from './pages/AttendanceCreate';
import UserList from './pages/UserList';

// Import Payroll pages
import PayrollList from './pages/PayrollList';
import PayrollPolicies from './pages/PayrollPolicies';

// Import Chat and Task Management pages
import Chat from './pages/Chat';
import TaskManagement from './pages/TaskManagement';

// Import Reports, Documents, and Settings pages
import Reports from './pages/Reports';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import EmployeeDetails from './pages/EmployeeDetails';
import EditEmployee from './pages/EditEmployee';
import Test from './pages/Test';
import RoleManagement from './pages/RoleManagement';
import LeaveManagement from './pages/LeaveManagement';
import LeaveRequest from './pages/LeaveRequest';
import TaskDelegation from './pages/TaskDelegation';
import NotificationCenter from './pages/NotificationCenter';
import WorkflowManager from './pages/WorkflowManager';
import CameraTest from './pages/CameraTest';

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

const TaskManagementPlaceholder = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Task Management</h1>
      <p className="text-gray-600">Task management page coming soon...</p>
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
      <Route path="/employees/view/:id" element={<EmployeeDetails />} />
      <Route path="/employees/edit/:id" element={<EditEmployee />} />
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
      <Route path="/leaves/create" element={<LeaveRequest />} />
      <Route path="/leaves/delegation" element={<TaskDelegation />} />
      <Route path="/leaves/workflow" element={<WorkflowManager />} />
      
      {/* Notification Routes */}
      <Route path="/notifications" element={<NotificationCenter />} />
      
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
      <Route path="/tasks" element={<TaskManagement />} />
      <Route path="/face-recognition" element={<FaceRecognition />} />
      
      {/* Reports, Documents, and Settings Routes */}
      <Route path="/reports" element={<Reports />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/settings" element={<Settings />} />
      
      {/* Test Routes */}
      <Route path="/test" element={<Test />} />
      <Route path="/camera-test" element={<CameraTest />} />
      
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;