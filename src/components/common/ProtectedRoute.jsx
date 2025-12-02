import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRole, isAuthenticated } from '../../utils/auth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  // Đọc trực tiếp từ localStorage mỗi lần render
  const userRole = getRole();
  const isAuth = isAuthenticated();

  // If not authenticated, redirect to login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // If no specific roles required, allow access
  if (allowedRoles.length === 0) {
    return children;
  }

  // If user role is not in allowed roles, redirect to appropriate dashboard
  if (!allowedRoles.includes(userRole)) {
    if (userRole === 'employee') {
      return <Navigate to="/employee" replace />;
    }
    if (userRole === 'admin' || userRole === 'manager' || userRole === 'accountant') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
