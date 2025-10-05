import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRole } from '../utils/auth';

const ProtectedRoute = ({ children, allow = ['admin'] }) => {
  const role = getRole();

  if (!role) {
    return <Navigate to="/role" replace />;
  }

  if (!allow.includes(role)) {
    // Redirect based on current role
    return <Navigate to={role === 'employee' ? '/employee' : '/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;


