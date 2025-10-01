import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";

// UI helpers
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";

// Page NotFound
import NotFound from "./pages/team-directory/NotFound";

// Pages
import CompanyHub from "./pages/company-hub";      
import MyProfile from "./pages/my-profile";
import Dashboard from "./pages/dashboard";
import TeamDirectory from "./pages/team-directory";
import LoginPortal from "./pages/login-portal";
// import AttendanceManagement from "./pages/attendance-management";
import PayrollDashboard from "./pages/payroll-dashboard";
import RecruitmentPortal from "./pages/recruitment-portal";

// ✅ Thêm 3 trang mới
import Settings from "./pages/settings";
import Help from "./pages/help";
import Admin from "./pages/admin";
import Reports from "./pages/reports";
import SubmitReport from "./pages/reports/SubmitReport";
import HR from "./pages/hr/HR";
import AttendancePage from "./pages/attendance";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<CompanyHub />} />
          <Route path="/company-hub" element={<CompanyHub />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team-directory" element={<TeamDirectory />} />
          <Route path="/login-portal" element={<LoginPortal />} />
          <Route path="/hr" element={<HR />} />
          {/* <Route path="/attendance-management" element={<AttendanceManagement />} /> */}
          <Route path="/payroll-dashboard" element={<PayrollDashboard />} />
          <Route path="/recruitment-portal" element={<RecruitmentPortal />} />

          {/* Route mới cho menu */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/submit" element={<SubmitReport />} />

            
            <Route path="/attendance" element={<AttendancePage />} />

          
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
