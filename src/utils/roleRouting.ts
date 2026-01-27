import { UserRole } from '../types';

/**
 * Get the dashboard route for a specific role
 */
export const getDashboardRoute = (role: UserRole): string => {
  const roleRoutes: Record<UserRole, string> = {
    'admin': '/admin/dashboard',
    'recruiter': '/recruiter/dashboard',
    'hr': '/hr/dashboard',
    'interviewer': '/interviewer/dashboard',
    'hiring-manager': '/hiring-manager/dashboard',
    'candidate': '/candidate/dashboard',
  };
  
  return roleRoutes[role] || '/candidate/dashboard';
};

/**
 * Check if a role has access to a route
 */
export const hasRoleAccess = (
  userRole: UserRole | null | undefined,
  allowedRoles: UserRole[]
): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

/**
 * Get default redirect path for unauthorized access
 */
export const getUnauthorizedRedirect = (userRole: UserRole | null | undefined): string => {
  if (!userRole) return '/login';
  return getDashboardRoute(userRole);
};



