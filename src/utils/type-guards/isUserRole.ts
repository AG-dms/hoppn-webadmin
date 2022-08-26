import { Role } from '@utils/enum/Role';

export function isUserRole(roles: string[]) {
  const availableRoles: string[] = Object.values(Role);

  if (!roles || !Array.isArray(roles)) {
    return false;
  }

  if (roles.every(v => availableRoles.includes(v))) {
    return true;
  }

  return false;
}

export function isSuperAdmin(roles: Role[]) {
  if (!roles || !Array.isArray(roles)) {
    return false;
  }
  if (roles.includes(Role.Superadmin)) {
    return true;
  }
  return false;
}

export function isAdmin(roles: Role[]) {
  if (!roles || !Array.isArray(roles)) {
    return false;
  }
  if (roles.includes(Role.Admin)) {
    return true;
  }
  return false;
}
export function isVendor(roles: Role[]) {
  if (!roles || !Array.isArray(roles)) {
    return false;
  }
  if (roles.includes(Role.Vendor)) {
    return true;
  }
  return false;
}

export function isCustomer(roles: Role[]) {
  if (!roles || !Array.isArray(roles)) {
    return false;
  }
  if (roles.includes(Role.Customer)) {
    return true;
  }
  return false;
}

export function isManager(roles: Role[]) {
  if (!roles || !Array.isArray(roles)) {
    return false;
  }
  if (roles.includes(Role.Manager)) {
    return true;
  }
  return false;
}
