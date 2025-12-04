import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/common';
import Layout from './components/layout/Layout';
import EmployeeLayout from './components/layout/EmployeeLayout';

// Pages
import Login from './pages/login/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/admin/EmployeeList';
import AddEmployee from './pages/employee/AddEmployee';
import EditEmployee from './pages/employee/EditEmployee';
import EmployeeDetails from './pages/employee/EmployeeDetails';
import FaceRecognition from './pages/face-recognition/FaceRecognition';
import FaceRecognitionPortal from './pages/face-recognition/FaceRecognitionPortal';
import FaceRecognitionManager from './pages/face-recognition/FaceRecognitionManager';
import FaceRecognitionAccountant from './pages/face-recognition/FaceRecognitionAccountant';
import AttendanceList from './pages/attendance/AttendanceList';
import PayrollList from './pages/payroll/PayrollList';
import PayrollCalculation from './pages/payroll/PayrollCalculation';
import PayrollDetails from './pages/payroll/PayrollDetails';
import PayrollPolicies from './pages/payroll/PayrollPolicies';
import LeaveManagement from './pages/leave/LeaveManagement';
import LeaveDetail from './pages/leave/LeaveDetail';
import LeaveRequest from './pages/leave/LeaveRequest';
import TaskManagement from './pages/task/TaskManagement';
import TaskDelegation from './pages/task/TaskDelegation';

// Kanban Pages
import BoardList from './pages/kanban/BoardList';
import KanbanBoard from './pages/kanban/KanbanBoard';

// Admin Pages
import LogsMonitor from './pages/admin/LogsMonitor';
import AdminBenefits from './pages/admin/AdminBenefits';
import AdminSupportTickets from './pages/admin/AdminSupportTickets';

// Other Pages
import Reports from './pages/Reports';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import NotificationCenter from './pages/NotificationCenter';
import WorkflowManager from './pages/WorkflowManager';
import EmployeePortal from './pages/employee/EmployeePortal';
import EmployeeAttendance from './pages/employee/Attendance';
import EmployeeLeave from './pages/employee/Leave';
import EmployeePayroll from './pages/employee/Payroll';
import EmployeeTaskBoard from './pages/employee/EmployeeTaskBoard';
import EmployeeKanbanView from './pages/employee/EmployeeKanbanView';
import EmployeeDocuments from './pages/employee/Documents';
import EmployeeProfile from './pages/employee/Profile';
import EmployeeAttendanceSummary from './pages/employee/AttendanceSummary';
import EmployeeBenefitsInsurance from './pages/employee/BenefitsInsurance';
import EmployeeSupportHelp from './pages/employee/SupportHelp';
import EmployeeMyEvaluation from './pages/employee/MyEvaluation';
import SimpleEmployeeEvaluation from './pages/evaluation/SimpleEmployeeEvaluation';
import RecruitmentManagement from './pages/recruitment/RecruitmentManagement';
import PositionsList from './pages/recruitment/PositionsList';
import ApplicationsList from './pages/recruitment/ApplicationsList';
import Profile from './pages/Profile';

// OT Management Pages
import OTManagement from './pages/overtime/OTManagement';
import OTRequest from './pages/employee/OTRequest';
import OTReport from './pages/employee/OTReport';

// ============================================
// ROUTE WRAPPERS - Simplified với factory function
// ============================================
const createRoleRoute = (allowedRoles) => ({ children }) => (
  <ProtectedRoute allowedRoles={allowedRoles}>{children}</ProtectedRoute>
);

const AdminRoute = createRoleRoute(['admin']);
const ManagerRoute = createRoleRoute(['manager']);
const AccountantRoute = createRoleRoute(['accountant']);
const AdminManagerRoute = createRoleRoute(['admin', 'manager']);
const AdminAccountantRoute = createRoleRoute(['admin', 'accountant']);
const ManagerAccountantRoute = createRoleRoute(['manager', 'accountant']);
const AdminManagerAccountantRoute = createRoleRoute(['admin', 'manager', 'accountant']);
const StaffRoute = createRoleRoute(['admin', 'manager', 'accountant']);

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route element={<StaffRoute><Layout /></StaffRoute>}>
        {/* Core */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />

        {/* Employee Management */}
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/view/:id" element={<EmployeeDetails />} />
        <Route path="employees/add" element={<AdminRoute><AddEmployee /></AdminRoute>} />
        <Route path="employees/edit/:id" element={<AdminRoute><EditEmployee /></AdminRoute>} />

        {/* Attendance */}
        <Route path="attendance" element={<AttendanceList />} />

        {/* Payroll */}
        <Route path="payroll" element={<PayrollList />} />
        <Route path="payroll/calculate/:employeeId" element={<AdminAccountantRoute><PayrollCalculation /></AdminAccountantRoute>} />
        <Route path="payroll/details/:employeeId" element={<AdminAccountantRoute><PayrollDetails /></AdminAccountantRoute>} />
        <Route path="payroll/policies" element={<AccountantRoute><PayrollPolicies /></AccountantRoute>} />

        {/* Leaves - Admin có thể duyệt tất cả, Manager và Accountant có thể xem */}
        <Route path="leaves" element={<AdminManagerAccountantRoute><LeaveManagement /></AdminManagerAccountantRoute>} />
        <Route path="leaves/:id" element={<AdminManagerAccountantRoute><LeaveDetail /></AdminManagerAccountantRoute>} />
        <Route path="leaves/create" element={<ManagerAccountantRoute><LeaveRequest /></ManagerAccountantRoute>} />
        <Route path="leaves/workflow" element={<ManagerRoute><WorkflowManager /></ManagerRoute>} />

        {/* Tasks - Legacy */}
        <Route path="tasks" element={<AdminManagerRoute><TaskManagement /></AdminManagerRoute>} />
        <Route path="task-delegation" element={<ManagerRoute><TaskDelegation /></ManagerRoute>} />

        {/* Kanban Board System */}
        <Route path="kanban" element={<AdminManagerRoute><BoardList /></AdminManagerRoute>} />
        <Route path="kanban/:boardId" element={<AdminManagerRoute><KanbanBoard /></AdminManagerRoute>} />

        {/* OT Management */}
        <Route path="overtime" element={<ManagerRoute><OTManagement /></ManagerRoute>} />
        <Route path="overtime/payroll" element={<Navigate to="/payroll" replace />} />

        {/* Documents - Manager & Accountant */}
        <Route path="documents" element={<ManagerAccountantRoute><Documents /></ManagerAccountantRoute>} />

        {/* Reports - Manager & Accountant */}
        <Route path="reports" element={<ManagerAccountantRoute><Reports /></ManagerAccountantRoute>} />

        {/* Evaluations - Admin & Manager */}
        <Route path="evaluations" element={<AdminManagerRoute><SimpleEmployeeEvaluation /></AdminManagerRoute>} />

        {/* Recruitment - Admin only */}
        <Route path="recruitment" element={<AdminRoute><RecruitmentManagement /></AdminRoute>} />
        <Route path="recruitment/positions" element={<AdminRoute><PositionsList /></AdminRoute>} />
        <Route path="recruitment/applications" element={<AdminRoute><ApplicationsList /></AdminRoute>} />

        {/* Face Recognition - Separate routes per role */}
        <Route path="face-recognition" element={<AdminRoute><FaceRecognition /></AdminRoute>} />
        <Route path="face-recognition-manager" element={<ManagerRoute><FaceRecognitionManager /></ManagerRoute>} />
        <Route path="face-recognition-accountant" element={<AccountantRoute><FaceRecognitionAccountant /></AccountantRoute>} />

        {/* Admin Functions */}
        <Route path="admin/logs" element={<AdminRoute><LogsMonitor /></AdminRoute>} />
        <Route path="admin/benefits" element={<AdminAccountantRoute><AdminBenefits /></AdminAccountantRoute>} />
        <Route path="benefits" element={<AdminAccountantRoute><AdminBenefits /></AdminAccountantRoute>} />
        <Route path="admin/support-tickets" element={<AdminManagerRoute><AdminSupportTickets /></AdminManagerRoute>} />
        <Route path="settings" element={<AdminRoute><Settings /></AdminRoute>} />

        {/* System */}
        <Route path="notifications" element={<NotificationCenter />} />
      </Route>

      {/* ============================================
          EMPLOYEE ROUTES
          Layout: EmployeeLayout với Sidebar
          ============================================ */}
      <Route path="employee" element={<ProtectedRoute allowedRoles={['employee']}><EmployeeLayout /></ProtectedRoute>}>
        <Route index element={<EmployeePortal />} />
        <Route path="profile" element={<EmployeeProfile />} />
        <Route path="attendance" element={<EmployeeAttendance />} />
        <Route path="attendance/summary" element={<EmployeeAttendanceSummary />} />
        <Route path="leave" element={<EmployeeLeave />} />
        <Route path="payroll" element={<EmployeePayroll />} />
        <Route path="tasks" element={<EmployeeTaskBoard />} />
        <Route path="kanban" element={<EmployeeKanbanView />} />
        <Route path="documents" element={<EmployeeDocuments />} />
        <Route path="benefits" element={<EmployeeBenefitsInsurance />} />
        <Route path="support" element={<EmployeeSupportHelp />} />
        <Route path="evaluation" element={<EmployeeMyEvaluation />} />
        <Route path="ot" element={<OTRequest />} />
        <Route path="ot/report" element={<OTReport />} />
      </Route>

      {/* ============================================
          SHARED ROUTES
          ============================================ */}
      <Route path="face-recognition-portal" element={<ProtectedRoute allowedRoles={['admin', 'employee']}><FaceRecognitionPortal /></ProtectedRoute>} />

      {/* ============================================
          REDIRECTS
          ============================================ */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
