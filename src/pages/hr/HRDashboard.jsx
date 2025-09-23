import React, { useState, useContext, createContext } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Login from "../login/login";

// Import các trang HR
import EmployeeManagement from "./EmployeeManagement";
import NewEmployeeControl from "./NewEmployeeControl";
import LeaveApproval from "./LeaveApproval";

// Import các trang Accounting
import TimeTracking from "../accounting/TimeTracking";
import PayrollManagement from "../accounting/PayrollManagement";

// Import các trang Employee
import WorkSchedule from "../employee/WorkSchedule";
import AttendanceRecord from "../employee/AttendanceRecord";


const ThemeContext = createContext();

const financialData = [
  { month: "Jan", income: 4000, expenses: 2400 },
  { month: "Feb", income: 3000, expenses: 1398 },
  { month: "Mar", income: 2000, expenses: 9800 },
  { month: "Apr", income: 2780, expenses: 3908 },
  { month: "May", income: 1890, expenses: 4800 },
  { month: "Jun", income: 2390, expenses: 3800 },
];

const AccountingDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Financial Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Monthly Summary</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#4CAF50" />
                <Bar dataKey="expenses" fill="#F44336" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const HRDashboard = () => {
  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="display-6 fw-bold text-dark mb-1">HR Dashboard</h2>
          <p className="text-muted">Tổng quan quản lý nhân sự</p>
        </div>
        <div className="d-flex align-items-center">
          <div className="bg-success rounded-circle me-2" style={{width: '12px', height: '12px', animation: 'pulse 2s infinite'}}></div>
          <span className="text-muted small">Hệ thống hoạt động</span>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card card-hover shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title fw-semibold text-dark">Tổng quan chấm công</h5>
                <span className="badge bg-success">Hôm nay</span>
              </div>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                  <div className="d-flex align-items-center">
                    <div className="bg-success rounded-circle p-2 me-3">
                      <i className="bi bi-person text-white"></i>
                    </div>
                    <span>Present Today</span>
                  </div>
                  <div className="text-end">
                    <div className="h4 fw-bold text-success mb-0">45/50</div>
                    <small className="text-muted">90% Attendance</small>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                  <div className="d-flex align-items-center">
                    <div className="bg-warning rounded-circle p-2 me-3">
                      <i className="bi bi-calendar text-white"></i>
                    </div>
                    <span>On Leave</span>
                  </div>
                  <div className="text-end">
                    <div className="h4 fw-bold text-warning mb-0">3</div>
                    <small className="text-muted">Approved Leaves</small>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                  <div className="d-flex align-items-center">
                    <div className="bg-danger rounded-circle p-2 me-3">
                      <i className="bi bi-clock text-white"></i>
                    </div>
                    <span>Late Arrivals</span>
                  </div>
                  <div className="text-end">
                    <div className="h4 fw-bold text-danger mb-0">2</div>
                    <small className="text-muted">Need Attention</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card card-hover shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-4">Leave Requests</h5>
              <div className="d-flex flex-column gap-3">
                {[
                  { name: "Alice Smith", dept: "Engineering", days: 3, status: "pending" },
                  { name: "Bob Johnson", dept: "Marketing", days: 1, status: "approved" },
                  { name: "Carol White", dept: "Design", days: 2, status: "pending" },
                ].map((request, index) => (
                  <div key={index} className="p-3 border rounded">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="fw-semibold mb-1">{request.name}</h6>
                        <p className="text-muted small mb-0">{request.dept}</p>
                      </div>
                      <span className={`badge ${request.status === "approved" ? "bg-success" : "bg-warning"}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-muted small mt-2 mb-0">{request.days} days requested</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card card-hover shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-4">Department Overview</h5>
              <div className="d-flex flex-column gap-3">
                {[
                  { dept: "Engineering", count: 20, color: "primary" },
                  { dept: "Marketing", count: 12, color: "success" },
                  { dept: "Design", count: 8, color: "info" },
                  { dept: "Sales", count: 10, color: "warning" },
                ].map((dept, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                    <span>{dept.dept}</span>
                    <span className={`fw-semibold text-${dept.color}`}>{dept.count} employees</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeeDashboard = () => {
  return (
    <div className="p-4">
      <h2 className="display-6 fw-bold text-dark mb-4">Employee Dashboard</h2>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-4">Personal Information</h5>
              <div className="d-flex align-items-center">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="rounded-circle me-3"
                  style={{width: '64px', height: '64px'}}
                />
                <div>
                  <h6 className="fw-semibold mb-1">John Doe</h6>
                  <p className="text-muted mb-0">Software Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ role, onLogout, toggleTheme, isDark }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center me-3">
            <div className="bg-gradient-primary rounded d-flex align-items-center justify-content-center me-2" style={{width: '32px', height: '32px'}}>
              <i className="bi bi-building text-white"></i>
            </div>
            <span className="navbar-brand fw-bold text-dark mb-0">Company Dashboard</span>
          </div>
          <div className="d-none d-md-block">
            <span className="badge bg-primary">
              {role === 'hr' ? 'HR Manager' : role === 'accounting' ? 'Kế toán' : 'Nhân viên'}
            </span>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <button
            onClick={toggleTheme}
            className="btn btn-outline-secondary btn-sm me-2"
            title={isDark ? "Chuyển sang sáng" : "Chuyển sang tối"}
          >
            <i className={`bi ${isDark ? 'bi-sun' : 'bi-moon'}`}></i>
          </button>
          <button
            onClick={onLogout}
            className="btn btn-outline-danger btn-sm"
            title="Đăng xuất"
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

const Sidebar = ({ role, activePage, setActivePage }) => {
  const menuItems = {
    accounting: [
      { id: 'time-tracking', icon: 'bi-clock', text: "Chấm công" },
      { id: 'payroll', icon: 'bi-cash-stack', text: "Quản lý lương" },
      { id: 'financial-overview', icon: 'bi-graph-up', text: "Tổng quan tài chính" },
    ],
    hr: [
      { id: 'hr-dashboard', icon: 'bi-speedometer2', text: "Dashboard HR" },
      { id: 'employee-management', icon: 'bi-people', text: "Quản lý nhân viên" },
      { id: 'new-employee', icon: 'bi-person-plus', text: "Kiểm soát người mới" },
      { id: 'leave-approval', icon: 'bi-file-text', text: "Duyệt đơn nghỉ phép" },
    ],
    employee: [
      { id: 'work-schedule', icon: 'bi-calendar3', text: "Lịch làm việc" },
      { id: 'attendance', icon: 'bi-clock-history', text: "Bảng chấm công" },
      { id: 'profile', icon: 'bi-person', text: "Hồ sơ cá nhân" },
    ],
  };

  return (
    <div className="sidebar position-fixed top-0 start-0" style={{width: '250px', zIndex: 1000}}>
      <div className="p-3">
        <h5 className="text-light mb-4">Menu</h5>
        <nav className="nav flex-column">
          {menuItems[role]?.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`nav-link text-start d-flex align-items-center mb-1 ${
                activePage === item.id ? 'active' : ''
              }`}
            >
              <i className={`bi ${item.icon} me-3`}></i>
              <span>{item.text}</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="position-absolute bottom-0 start-0 w-100 p-3 border-top border-secondary">
        <div className="d-flex align-items-center p-2 rounded" style={{background: 'rgba(255,255,255,0.1)'}}>
          <div className="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '32px', height: '32px'}}>
            <i className="bi bi-person text-white"></i>
          </div>
          <div>
            <p className="text-light mb-0 small fw-medium">
              {role === 'hr' ? 'HR Manager' : role === 'accounting' ? 'Kế toán' : 'Nhân viên'}
            </p>
            <p className="text-muted mb-0" style={{fontSize: '0.75rem'}}>Đang hoạt động</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HRApp = () => {
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [activePage, setActivePage] = useState(null);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleLogin = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
    // Set trang mặc định cho từng role
    if (role === 'hr') {
      setActivePage('hr-dashboard');
    } else if (role === 'accounting') {
      setActivePage('time-tracking');
    } else if (role === 'employee') {
      setActivePage('work-schedule');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setActivePage(null);
  };

  // Component mapping cho từng trang
  const getPageComponent = () => {
    if (!activePage) return null;

    const pageComponents = {
      // HR Pages
      'hr-dashboard': HRDashboard,
      'employee-management': EmployeeManagement,
      'new-employee': NewEmployeeControl,
      'leave-approval': LeaveApproval,
      
      // Accounting Pages
      'time-tracking': TimeTracking,
      'payroll': PayrollManagement,
      'financial-overview': AccountingDashboard,
      
      // Employee Pages
      'work-schedule': WorkSchedule,
      'attendance': AttendanceRecord,
      'profile': EmployeeDashboard,
    };

    const Component = pageComponents[activePage];
    return Component ? <Component /> : null;
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={isDark ? "dark" : ""}>
        {!isAuthenticated ? (
          <Login onLogin={handleLogin} />
        ) : (
          <div className="d-flex">
            <Sidebar 
              role={userRole} 
              activePage={activePage}
              setActivePage={setActivePage}
            />
            <div className="flex-grow-1" style={{marginLeft: '250px'}}>
              <Navbar
                role={userRole}
                onLogout={handleLogout}
                toggleTheme={toggleTheme}
                isDark={isDark}
              />
              <main className="p-4">
                {getPageComponent()}
              </main>
            </div>
          </div>
        )}
      </div>
    </ThemeContext.Provider>
  );
};

export default HRApp;