// src/components/RequireRole.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireRole = ({ allowedRoles, children }) => {
  const userRole = localStorage.getItem('role');

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RequireRole;
