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
import TeamDirectory from "./pages/team-directory";  // ✅ đúng thư mục
import LoginPortal from "./pages/login-portal";
// import AttendanceManagement from "./pages/attendance-management";
import PayrollDashboard from "./pages/payroll-dashboard";
import RecruitmentPortal from "./pages/recruitment-portal";

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
          <Route path="/team-directory" element={<TeamDirectory />} />  {/* ✅ route chuẩn */}
          <Route path="/login-portal" element={<LoginPortal />} />
          {/* <Route path="/attendance-management" element={<AttendanceManagement />} /> */}
          <Route path="/payroll-dashboard" element={<PayrollDashboard />} />
          <Route path="/recruitment-portal" element={<RecruitmentPortal />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
