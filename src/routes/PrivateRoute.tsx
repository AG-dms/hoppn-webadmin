import AccessDenid from '@/components/AccessDenid';
import type { RootState } from '@/store';
import { Role } from '@utils/enum/Role';
import { isUserRole } from '@utils/type-guards/isUserRole';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  roles: Role[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles }) => {
  const userRoles = useSelector((state: RootState) => state.auth.user_roles);
  const isAuthorized = isUserRole(userRoles);

  const isAllowed = isUserRole(userRoles) && roles.some(role => userRoles.includes(role));

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }
  if (isAuthorized && !isAllowed) {
    return <AccessDenid />;
  }

  return <Outlet />;
};

export default PrivateRoute;
