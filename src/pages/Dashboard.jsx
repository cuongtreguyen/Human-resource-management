import React from 'react';
import { getRole } from '../utils/auth';
import { AdminDashboard, ManagerDashboard, AccountantDashboard } from './dashboard/index';

const Dashboard = () => {
  const userRole = getRole();

  // Render dashboard theo role
  switch (userRole) {
    case 'manager':
      return <ManagerDashboard />;
    case 'accountant':
      return <AccountantDashboard />;
    case 'admin':
    default:
      return <AdminDashboard />;
  }
};

export default Dashboard;
