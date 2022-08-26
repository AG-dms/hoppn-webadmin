import type { RootState } from '@/store';
import {
  isAdmin,
  isCustomer,
  isManager,
  isSuperAdmin,
  isUserRole,
  isVendor,
} from '@utils/type-guards/isUserRole';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute: React.FC = () => {
  const userRoles = useSelector((state: RootState) => state.auth.user_roles);

  const token = useSelector((state: RootState) => state.auth.inviteToken);
  const isAuthorized = isUserRole(userRoles);
  const pathRole = () => {
    if (token) {
      return '/profile';
    }
    if (isSuperAdmin(userRoles)) {
      return '/super_admin';
    }
    if (isAdmin(userRoles)) {
      return '/admin';
    }
    if (isVendor(userRoles)) {
      return '/vendor_orders';
    }
    if (isManager(userRoles)) {
      return '/vendor/products';
    }
    if (isCustomer(userRoles)) {
      return '/profile';
    }
  };

  const path = pathRole();

  return !isAuthorized ? <Outlet /> : <Navigate to={path} />;
};

export default PublicRoute;
