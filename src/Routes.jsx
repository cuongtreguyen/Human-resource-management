import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/common';

// Import pages
import Login from './pages/login/Login';
import Dashboard from './pages/Dashboard';

// Employee pages
import EmployeeList from './pages/employee/EmployeeList';
import AddEmployee from './pages/employee/AddEmployee';
import EditEmployee from './pages/employee/EditEmployee';
import EmployeeDetails from './pages/employee/EmployeeDetails';

// Face Recognition pages
import FaceRecognition from './pages/face-recognition/FaceRecognition';
import FaceRecognitionPortal from './pages/face-recognition/FaceRecognitionPortal';

// Attendance pages
import AttendanceList from './pages/attendance/AttendanceList';
import AttendanceCreate from './pages/attendance/AttendanceCreate';

// Payroll pages
import PayrollList from './pages/payroll/PayrollList';
import PayrollPolicies from './pages/payroll/PayrollPolicies';

// Leave pages
import LeaveManagement from './pages/leave/LeaveManagement';
import LeaveRequest from './pages/leave/LeaveRequest';

// Task pages
import TaskManagement from './pages/task/TaskManagement';
import TaskDelegation from './pages/task/TaskDelegation';

// Admin pages
import UserList from './pages/admin/UserList';
import RoleManagement from './pages/admin/RoleManagement';
import LogsMonitor from './pages/admin/LogsMonitor';
import TestUserList from './pages/admin/TestUserList';

// Other pages
import Chat from './pages/Chat';
import Reports from './pages/Reports';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import ExportData from './pages/ExportData';
import Test from './pages/Test';
import NotificationCenter from './pages/NotificationCenter';
import WorkflowManager from './pages/WorkflowManager';

// Employee Portal pages
import EmployeePortal from './pages/employee/EmployeePortal';
import EmployeeAttendance from './pages/employee/Attendance';
import EmployeeLeave from './pages/employee/Leave';
import EmployeePayroll from './pages/employee/Payroll';
import EmployeeTasks from './pages/employee/Tasks';
import EmployeeDocuments from './pages/employee/Documents';
import EmployeeProfile from './pages/employee/Profile';
import EmployeeChat from './pages/employee/Chat';
import EmployeeAttendanceSummary from './pages/employee/AttendanceSummary';
import EmployeePerformanceReview from './pages/employee/PerformanceReview';
import EmployeeTrainingDevelopment from './pages/employee/TrainingDevelopment';
import EmployeeBenefitsInsurance from './pages/employee/BenefitsInsurance';
import EmployeeSupportHelp from './pages/employee/SupportHelp';

// Recruitment pages
import RecruitmentManagement from './pages/recruitment/RecruitmentManagement';
import PositionsList from './pages/recruitment/PositionsList';
import ApplicationsList from './pages/recruitment/ApplicationsList';

// Leave pages
import CreateLeave from './pages/leave/CreateLeave';

// Profile page
import Profile from './pages/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['admin', 'manager', 'accountant']}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Employee Routes */}
      <Route path="/face-recognition" element={
        <ProtectedRoute allowedRoles={['admin', 'manager']}>
          <FaceRecognition />
        </ProtectedRoute>
      } />
      <Route path="/face-recognition-portal" element={
        <ProtectedRoute allowedRoles={['admin', 'manager', 'employee']}>
          <FaceRecognitionPortal />
        </ProtectedRoute>
      } />
      <Route path="/employees" element={
        <ProtectedRoute allowedRoles={['admin', 'manager']}>
          <EmployeeList />
        </ProtectedRoute>
      } />
      <Route path="/employees/add" element={
        <ProtectedRoute allowedRoles={['admin', 'manager']}>
          <AddEmployee />
        </ProtectedRoute>
      } />
      <Route path="/employees/view/:id" element={
        <ProtectedRoute allowedRoles={['admin', 'manager']}>
          <EmployeeDetails />
        </ProtectedRoute>
      } />
      <Route path="/employees/edit/:id" element={
        <ProtectedRoute allowedRoles={['admin', 'manager']}>
          <EditEmployee />
        </ProtectedRoute>
      } />
      <Route path="/employees/export" element={
        <ProtectedRoute allowedRoles={['admin', 'manager']}>
          <ExportData />
        </ProtectedRoute>
      } />
      
      {/* Attendance Routes */}
      <Route path="/attendance" element={
        <ProtectedRoute allowedRoles={['admin', 'manager']}>
          <AttendanceList />
        </ProtectedRoute>
      } />
      <Route path="/attendance/create" element={
        <ProtectedRoute allowedRoles={['admin', 'manager']}>
          <AttendanceCreate />
        </ProtectedRoute>
      } />
      
      {/* Payroll Routes */}
      <Route path="/payroll" element={
        <ProtectedRoute allowedRoles={['admin', 'manager', 'accountant']}>
          <PayrollList />
        </ProtectedRoute>
      } />
      <Route path="/payroll/policies" element={
        <ProtectedRoute allowedRoles={['admin', 'manager', 'accountant']}>
          <PayrollPolicies />
        </ProtectedRoute>
      } />
      
      
      {/* Leave Routes */}
      <Route path="/leaves" element={
        <ProtectedRoute allowedRoles={['admin', 'manager']}>
          <LeaveManagement />
        </ProtectedRoute>
      } />
      <Route path="/leaves/create" element={
        <ProtectedRoute allowedRoles={['admin', 'manager']}>
          <LeaveRequest />
        </ProtectedRoute>
      } />
      <Route path="/leaves/delegation" element={
        <ProtectedRoute allowedRoles={['admin', 'manager']}>
          <TaskDelegation />
        </ProtectedRoute>
      } />
      <Route path="/leaves/workflow" element={
        <ProtectedRoute allowedRoles={['admin', 'manager']}>
          <WorkflowManager />
        </ProtectedRoute>
      } />
      
      {/* Notification Routes */}
      <Route path="/notifications" element={
        <ProtectedRoute allowedRoles={['admin', 'manager']}>
          <NotificationCenter />
        </ProtectedRoute>
      } />
      
      {/* Recruitment Routes */}
      <Route path="/recruitment" element={
        <ProtectedRoute allowedRoles={['admin', 'manager']}>
          <RecruitmentManagement />
        </ProtectedRoute>
      } />
      <Route path="/recruitment/positions" element={
        <ProtectedRoute allowedRoles={['admin', 'manager']}>
          <PositionsList />
        </ProtectedRoute>
      } />
      <Route path="/recruitment/applications" element={
        <ProtectedRoute allowedRoles={['admin', 'manager']}>
          <ApplicationsList />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/users" element={<UserList />} />
      <Route path="/admin/roles" element={
        <ProtectedRoute allowedRoles={['admin', 'manager']}>
          <RoleManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/logs" element={<LogsMonitor />} />
      <Route path="/admin/users-test" element={<TestUserList />} />
      
      {/* Employee Portal Routes */}
      <Route path="/employee" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <EmployeePortal />
        </ProtectedRoute>
      } />
      <Route path="/employee/attendance" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <EmployeeAttendance />
        </ProtectedRoute>
      } />
      <Route path="/employee/attendance/summary" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <EmployeeAttendanceSummary />
        </ProtectedRoute>
      } />
      <Route path="/employee/leave" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <EmployeeLeave />
        </ProtectedRoute>
      } />
      <Route path="/employee/payroll" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <EmployeePayroll />
        </ProtectedRoute>
      } />
      <Route path="/employee/tasks" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <EmployeeTasks />
        </ProtectedRoute>
      } />
      <Route path="/employee/documents" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <EmployeeDocuments />
        </ProtectedRoute>
      } />
      <Route path="/employee/profile" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <EmployeeProfile />
        </ProtectedRoute>
      } />
      <Route path="/employee/chat" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <EmployeeChat />
        </ProtectedRoute>
      } />
      <Route path="/employee/performance" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <EmployeePerformanceReview />
        </ProtectedRoute>
      } />
      <Route path="/employee/training" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <EmployeeTrainingDevelopment />
        </ProtectedRoute>
      } />
      <Route path="/employee/benefits" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <EmployeeBenefitsInsurance />
        </ProtectedRoute>
      } />
      <Route path="/employee/support" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <EmployeeSupportHelp />
        </ProtectedRoute>
      } />
      
      {/* User Routes */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/tasks" element={
        <ProtectedRoute allowedRoles={['admin', 'manager', 'employee']}>
          <TaskManagement />
        </ProtectedRoute>
      } />
      
      {/* Reports, Documents, and Settings Routes */}
      <Route path="/reports" element={<Reports />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/settings" element={<Settings />} />
      
      {/* Test Routes */}
      <Route path="/test" element={<Test />} />
      
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;