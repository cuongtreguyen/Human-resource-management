import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRole, isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const userRole = getRole();
  const isAuth = isAuthenticated();

  // Debug logs
  console.log('ProtectedRoute - userRole:', userRole);
  console.log('ProtectedRoute - isAuth:', isAuth);
  console.log('ProtectedRoute - allowedRoles:', allowedRoles);
  console.log('ProtectedRoute - current path:', window.location.pathname);

  // If not authenticated, redirect to login
  if (!isAuth) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If no specific roles required, allow access
  if (allowedRoles.length === 0) {
    console.log('ProtectedRoute - No roles required, allowing access');
    return children;
  }

  // If user role is not in allowed roles, redirect to appropriate dashboard
  if (!allowedRoles.includes(userRole)) {
    console.log('ProtectedRoute - Role not allowed, redirecting');
    switch (userRole) {
      case 'employee':
        return <Navigate to="/employee" replace />;
      case 'manager':
      case 'accountant':
      case 'admin':
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  console.log('ProtectedRoute - Access granted');
  return children;
};

export default ProtectedRoute;
