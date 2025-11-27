import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/common';
import Layout from './components/layout/Layout';
import EmployeeLayout from './components/layout/EmployeeLayout';

// Pages
import Login from './pages/login/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/employee/EmployeeList';
import AddEmployee from './pages/employee/AddEmployee';
import EditEmployee from './pages/employee/EditEmployee';
import EmployeeDetails from './pages/employee/EmployeeDetails';
import FaceRecognition from './pages/face-recognition/FaceRecognition';
import FaceRecognitionPortal from './pages/face-recognition/FaceRecognitionPortal';
import AttendanceList from './pages/attendance/AttendanceList';
import PayrollList from './pages/payroll/PayrollList';
import PayrollPolicies from './pages/payroll/PayrollPolicies';
import LeaveManagement from './pages/leave/LeaveManagement';
import LeaveRequest from './pages/leave/LeaveRequest';
import TaskManagement from './pages/task/TaskManagement';
import TaskDelegation from './pages/task/TaskDelegation';

// Admin Pages
import LogsMonitor from './pages/admin/LogsMonitor';
import AdminBenefits from './pages/admin/AdminBenefits';
import AdminSupportTickets from './pages/admin/AdminSupportTickets';

// Other Pages
import Chat from './pages/Chat';
import Reports from './pages/Reports';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import Test from './pages/Test';
import NotificationCenter from './pages/NotificationCenter';
import WorkflowManager from './pages/WorkflowManager';
import EmployeePortal from './pages/employee/EmployeePortal';
import EmployeeAttendance from './pages/employee/Attendance';
import EmployeeLeave from './pages/employee/Leave';
import EmployeePayroll from './pages/employee/Payroll';
import EmployeeTasks from './pages/employee/Tasks';
import EmployeeTaskBoard from './pages/employee/EmployeeTaskBoard';
import EmployeeDocuments from './pages/employee/Documents';
import EmployeeProfile from './pages/employee/Profile';
import EmployeeChat from './pages/employee/Chat';
import EmployeeAttendanceSummary from './pages/employee/AttendanceSummary';
import EmployeeBenefitsInsurance from './pages/employee/BenefitsInsurance';
import EmployeeSupportHelp from './pages/employee/SupportHelp';
import SimpleEmployeeEvaluation from './pages/evaluation/SimpleEmployeeEvaluation';
import RecruitmentManagement from './pages/recruitment/RecruitmentManagement';
import PositionsList from './pages/recruitment/PositionsList';
import ApplicationsList from './pages/recruitment/ApplicationsList';
import Profile from './pages/Profile';

// Route wrappers for different access levels
const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin']}>{children}</ProtectedRoute>
);

const ManagerRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['manager']}>{children}</ProtectedRoute>
);

const AdminManagerRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin', 'manager']}>{children}</ProtectedRoute>
);

const AccountantRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['accountant']}>{children}</ProtectedRoute>
);

const AdminAccountantRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin', 'accountant']}>{children}</ProtectedRoute>
);

const ManagerAccountantRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['manager', 'accountant']}>{children}</ProtectedRoute>
);

const AdminManagerAccountantRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin', 'manager', 'accountant']}>{children}</ProtectedRoute>
);

const StaffRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin', 'manager', 'accountant']}>{children}</ProtectedRoute>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Staff Area (Admin, Manager, Accountant) */}
      <Route element={<StaffRoute><Layout /></StaffRoute>}>
        {/* Dashboard - All staff */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Face Recognition - Admin, Manager & Accountant */}
        <Route path="/face-recognition" element={<AdminManagerAccountantRoute><FaceRecognition /></AdminManagerAccountantRoute>} />

        {/* Employees */}
        <Route path="/employees" element={<EmployeeList />} /> {/* All staff can view */}
        <Route path="/employees/view/:id" element={<EmployeeDetails />} /> {/* All staff can view */}
        <Route path="/employees/add" element={<AdminRoute><AddEmployee /></AdminRoute>} /> {/* Admin only */}
        <Route path="/employees/edit/:id" element={<AdminRoute><EditEmployee /></AdminRoute>} /> {/* Admin only */}

        {/* Attendance - Log chấm công */}
        <Route path="/attendance" element={<AttendanceList />} /> {/* All staff can view */}

        {/* Payroll */}
        <Route path="/payroll" element={<PayrollList />} /> {/* All staff can view */}
        <Route path="/payroll/policies" element={<AccountantRoute><PayrollPolicies /></AccountantRoute>} /> {/* Accountant only */}

        {/* Leaves - Manager only */}
        <Route path="/leaves" element={<ManagerRoute><LeaveManagement /></ManagerRoute>} />
        <Route path="/leaves/create" element={<ManagerRoute><LeaveRequest /></ManagerRoute>} />
        <Route path="/leaves/workflow" element={<ManagerRoute><WorkflowManager /></ManagerRoute>} />

        {/* Task Delegation - Manager only */}
        <Route path="/task-delegation" element={<ManagerRoute><TaskDelegation /></ManagerRoute>} />

        {/* Recruitment - Admin only */}
        <Route path="/recruitment" element={<AdminRoute><RecruitmentManagement /></AdminRoute>} />
        <Route path="/recruitment/positions" element={<AdminRoute><PositionsList /></AdminRoute>} />
        <Route path="/recruitment/applications" element={<AdminRoute><ApplicationsList /></AdminRoute>} />

        {/* Admin Only */}
        <Route path="/admin/logs" element={<AdminRoute><LogsMonitor /></AdminRoute>} />
        <Route path="/settings" element={<AdminRoute><Settings /></AdminRoute>} />

        {/* Admin & Accountant - Admin chỉ xem, Accountant được duyệt */}
        <Route path="/admin/benefits" element={<AdminAccountantRoute><AdminBenefits /></AdminAccountantRoute>} />

        {/* Support Tickets - Admin & Manager có thể xem và xử lý */}
        <Route path="/admin/support-tickets" element={<AdminManagerRoute><AdminSupportTickets /></AdminManagerRoute>} />

        {/* System */}
        <Route path="/notifications" element={<NotificationCenter />} /> {/* All staff */}
        <Route path="/tasks" element={<AdminManagerRoute><TaskManagement /></AdminManagerRoute>} /> {/* Admin & Manager */}
        <Route path="/evaluations" element={<AdminManagerRoute><SimpleEmployeeEvaluation /></AdminManagerRoute>} /> {/* Admin & Manager */}
        <Route path="/chat" element={<Chat />} /> {/* All staff */}
        <Route path="/profile" element={<Profile />} /> {/* All staff */}
        <Route path="/reports" element={<ManagerAccountantRoute><Reports /></ManagerAccountantRoute>} /> {/* Manager & Accountant */}
        <Route path="/documents" element={<ManagerAccountantRoute><Documents /></ManagerAccountantRoute>} /> {/* Manager & Accountant */}
        <Route path="/test" element={<Test />} />
      </Route>

      {/* Employee Portal */}
      <Route path="/employee" element={<ProtectedRoute allowedRoles={['employee']}><EmployeeLayout /></ProtectedRoute>}>
        <Route index element={<EmployeePortal />} />
        <Route path="attendance" element={<EmployeeAttendance />} />
        <Route path="attendance/summary" element={<EmployeeAttendanceSummary />} />
        <Route path="leave" element={<EmployeeLeave />} />
        <Route path="payroll" element={<EmployeePayroll />} />
        <Route path="tasks" element={<EmployeeTaskBoard />} />
        <Route path="documents" element={<EmployeeDocuments />} />
        <Route path="profile" element={<EmployeeProfile />} />
        <Route path="chat" element={<EmployeeChat />} />
        <Route path="benefits" element={<EmployeeBenefitsInsurance />} />
        <Route path="support" element={<EmployeeSupportHelp />} />
      </Route>

      {/* Shared Routes */}
      <Route path="/face-recognition-portal" element={<ProtectedRoute allowedRoles={['admin', 'employee']}><FaceRecognitionPortal /></ProtectedRoute>} />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
