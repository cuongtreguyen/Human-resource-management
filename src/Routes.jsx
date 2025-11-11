import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/common';
import Layout from './components/layout/Layout';
import EmployeeLayout from './components/layout/EmployeeLayout';

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

// Profile page
import Profile from './pages/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Admin Area */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/face-recognition"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <FaceRecognition />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EmployeeList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/add"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/view/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EmployeeDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EditEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/export"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ExportData />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AttendanceList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance/create"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AttendanceCreate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payroll"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PayrollList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payroll/policies"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PayrollPolicies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaves"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <LeaveManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaves/create"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <LeaveRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaves/delegation"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TaskDelegation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaves/workflow"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <WorkflowManager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <NotificationCenter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruitment"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RecruitmentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruitment/positions"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PositionsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruitment/applications"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ApplicationsList />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/users" element={<UserList />} />
        <Route
          path="/admin/roles"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RoleManagement />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/logs" element={<LogsMonitor />} />
        <Route path="/admin/users-test" element={<TestUserList />} />

        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/test" element={<Test />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TaskManagement />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Employee Portal */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeePortal />} />
        <Route path="attendance" element={<EmployeeAttendance />} />
        <Route
          path="attendance/summary"
          element={<EmployeeAttendanceSummary />}
        />
        <Route path="leave" element={<EmployeeLeave />} />
        <Route path="payroll" element={<EmployeePayroll />} />
        <Route path="tasks" element={<EmployeeTasks />} />
        <Route path="documents" element={<EmployeeDocuments />} />
        <Route path="profile" element={<EmployeeProfile />} />
        <Route path="chat" element={<EmployeeChat />} />
        <Route
          path="performance"
          element={<EmployeePerformanceReview />}
        />
        <Route
          path="training"
          element={<EmployeeTrainingDevelopment />}
        />
        <Route path="benefits" element={<EmployeeBenefitsInsurance />} />
        <Route path="support" element={<EmployeeSupportHelp />} />
      </Route>

      {/* Shared Feature Routes */}
      <Route
        path="/face-recognition-portal"
        element={
          <ProtectedRoute allowedRoles={['admin', 'employee']}>
            <FaceRecognitionPortal />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;