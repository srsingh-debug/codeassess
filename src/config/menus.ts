import { 
  BarChart3, 
  CheckCircle, 
  FileText, 
  Home, 
  Settings, 
  Users,
  PlusCircle,
  LineChart,
  TrendingUp,
  Play,
  Briefcase,
  UserCheck,
  LucideIcon
} from 'lucide-react';
import { UserRole } from '../types';
import { getRoutesByRole } from './routes';

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  description?: string;
}

/**
 * Get menu items for a specific role based on route configuration
 */
export const getMenuItemsByRole = (role: UserRole): MenuItem[] => {
  const routes = getRoutesByRole(role);
  
  // Filter routes that should appear in sidebar (layout: true, and not profile)
  const sidebarRoutes = routes.filter(route => 
    route.layout && 
    route.path !== 'profile' &&
    route.urlPath.includes(`/${role}`) || 
    (role === 'admin' && route.urlPath.startsWith('/admin'))
  );

  // Map routes to menu items with appropriate icons
  return sidebarRoutes.map(route => {
    const icon = getIconForRoute(route.path);
    return {
      id: route.path,
      label: route.title || route.path,
      icon,
      path: route.urlPath,
      description: route.description,
    };
  }).concat([
    // Always add profile at the end
    {
      id: 'profile',
      label: 'Profile',
      icon: Settings,
      path: '/profile',
      description: 'Manage your profile',
    }
  ]);
};

/**
 * Get icon for a specific route
 */
const getIconForRoute = (path: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    'admin-dashboard': BarChart3,
    'recruiter-dashboard': BarChart3,
    'hr-dashboard': BarChart3,
    'interviewer-dashboard': BarChart3,
    'hiring-manager-dashboard': BarChart3,
    'candidate-dashboard': Home,
    'assessment-creation': PlusCircle,
    'manage-assessments': FileText,
    'manage-candidates': Users,
    'send-links': UserCheck,
    'reports-analytics': LineChart,
    'job-management': Briefcase,
    'application-dashboard': UserCheck,
    'assessment-attempt': Play,
    'results': CheckCircle,
    'my-progress': TrendingUp,
    'profile': Settings,
  };

  return iconMap[path] || FileText;
};

/**
 * Admin menu items (explicitly defined for better control)
 */
export const adminMenuItems: MenuItem[] = [
  {
    id: 'admin-dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    path: '/admin/dashboard',
    description: 'Overview of system metrics and activities',
  },
  {
    id: 'assessment-creation',
    label: 'Create Assessment',
    icon: PlusCircle,
    path: '/admin/assessment-creation',
    description: 'Create a new coding assessment',
  },
  {
    id: 'manage-assessments',
    label: 'Manage Tests',
    icon: FileText,
    path: '/admin/manage-assessments',
    description: 'View and manage all assessments',
  },
  {
    id: 'manage-candidates',
    label: 'Candidates',
    icon: Users,
    path: '/admin/manage-candidates',
    description: 'View and manage all candidates',
  },
  {
    id: 'send-links',
    label: 'Send Links',
    icon: UserCheck,
    path: '/admin/send-links',
    description: 'Send assessment links to candidates',
  },
  {
    id: 'reports-analytics',
    label: 'Reports & Analytics',
    icon: LineChart,
    path: '/admin/reports-analytics',
    description: 'View system-wide analytics and reports',
  },
  {
    id: 'job-management',
    label: 'Job Management',
    icon: Briefcase,
    path: '/admin/job-management',
    description: 'Create and manage job postings',
  },
  {
    id: 'application-dashboard',
    label: 'Applications',
    icon: UserCheck,
    path: '/admin/applications',
    description: 'View and manage all job applications',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: Settings,
    path: '/profile',
    description: 'Manage your profile',
  },
];

/**
 * Candidate menu items
 */
export const candidateMenuItems: MenuItem[] = [
  {
    id: 'candidate-dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/candidate/dashboard',
    description: 'Your personal dashboard with assessments and progress',
  },
  {
    id: 'assessment-attempt',
    label: 'Take Assessment',
    icon: Play,
    path: '/candidate/assessment-attempt',
    description: 'Complete your coding assessment',
  },
  {
    id: 'results',
    label: 'Results',
    icon: CheckCircle,
    path: '/candidate/results',
    description: 'View your assessment results and scores',
  },
  {
    id: 'my-progress',
    label: 'My Progress',
    icon: TrendingUp,
    path: '/candidate/my-progress',
    description: 'Track your learning progress and achievements',
  },
  {
    id: 'job-board',
    label: 'Job Board',
    icon: Briefcase,
    path: '/jobs',
    description: 'Browse available job opportunities',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: Settings,
    path: '/profile',
    description: 'Manage your profile',
  },
];

/**
 * Recruiter menu items
 */
export const recruiterMenuItems: MenuItem[] = [
  {
    id: 'recruiter-dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/recruiter/dashboard',
    description: 'Overview of jobs, applications, and pipeline',
  },
  {
    id: 'recruiter-job-management',
    label: 'Job Management',
    icon: Briefcase,
    path: '/recruiter/job-management',
    description: 'Create and manage job postings',
  },
  {
    id: 'recruiter-applications',
    label: 'Applications',
    icon: UserCheck,
    path: '/recruiter/applications',
    description: 'View and manage job applications',
  },
  {
    id: 'recruiter-candidates',
    label: 'Candidates',
    icon: Users,
    path: '/recruiter/manage-candidates',
    description: 'View and manage candidate profiles',
  },
  {
    id: 'recruiter-analytics',
    label: 'Analytics',
    icon: LineChart,
    path: '/recruiter/analytics',
    description: 'View recruitment metrics and analytics',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: Settings,
    path: '/profile',
    description: 'Manage your profile',
  },
];

/**
 * Hiring Manager menu items
 */
export const hiringManagerMenuItems: MenuItem[] = [
  {
    id: 'hiring-manager-dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/hiring-manager/dashboard',
    description: 'Review candidates and make hiring decisions',
  },
  {
    id: 'hiring-manager-job-approvals',
    label: 'Job Approvals',
    icon: Briefcase,
    path: '/hiring-manager/job-approvals',
    description: 'Review and approve job postings',
  },
  {
    id: 'hiring-manager-decisions',
    label: 'Decisions',
    icon: UserCheck,
    path: '/hiring-manager/decisions',
    description: 'Review candidates and make final decisions',
  },
  {
    id: 'hiring-manager-analytics',
    label: 'Team Analytics',
    icon: LineChart,
    path: '/hiring-manager/analytics',
    description: 'View team hiring metrics and analytics',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: Settings,
    path: '/profile',
    description: 'Manage your profile',
  },
];

/**
 * Get menu items based on user role
 */
export const getMenuItems = (role: UserRole | null | undefined): MenuItem[] => {
  if (!role) return [];

  switch (role) {
    case 'admin':
      return adminMenuItems;
    case 'candidate':
      return candidateMenuItems;
    case 'recruiter':
      return recruiterMenuItems;
    case 'hr':
      // TODO: Add HR menu items when pages are created
      return [];
    case 'interviewer':
      // TODO: Add interviewer menu items when pages are created
      return [];
    case 'hiring-manager':
      return hiringManagerMenuItems;
    default:
      return candidateMenuItems;
  }
};

