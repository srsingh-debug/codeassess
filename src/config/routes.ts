import { lazy } from 'react';
import { UserRole, NavigationState } from '../types';

export interface RouteConfig {
  path: NavigationState;
  urlPath: string;
  component: React.ComponentType<any>;
  allowedRoles: UserRole[];
  layout: boolean;
  title?: string;
  description?: string;
}

// Lazy load all components
const LandingPage = lazy(() => import('../pages/LandingPage').then(module => ({ default: module.LandingPage })));
const AuthPage = lazy(() => import('../pages/AuthPage').then(module => ({ default: module.AuthPage })));
const CandidateFlow = lazy(() => import('../pages/candidate/CandidateFlow').then(module => ({ default: module.CandidateFlow })));
const AdminFlow = lazy(() => import('../pages/admin/AdminFlow').then(module => ({ default: module.AdminFlow })));

// Admin components
const DashboardView = lazy(() => import('../views/admin/DashboardView').then(module => ({ default: module.DashboardView })));
const AssessmentManagementView = lazy(() => import('../views/admin/AssessmentManagementView').then(module => ({ default: module.AssessmentManagementView })));
const CandidateManagementView = lazy(() => import('../views/admin/CandidateManagementView').then(module => ({ default: module.CandidateManagementView })));
const AnalyticsView = lazy(() => import('../views/admin/AnalyticsView').then(module => ({ default: module.AnalyticsView })));
const AssessmentCreation = lazy(() => import('../pages/admin/AssessmentCreation').then(module => ({ default: module.AssessmentCreation })));
const SendAssessmentLink = lazy(() => import('../pages/admin/SendAssessmentLink').then(module => ({ default: module.SendAssessmentLink })));
const JobManagementPage = lazy(() => import('../pages/admin/JobManagementPage').then(module => ({ default: module.JobManagementPage })));
const ApplicationDashboard = lazy(() => import('../pages/admin/ApplicationDashboard').then(module => ({ default: module.ApplicationDashboard })));

// Candidate components
const CandidateDashboard = lazy(() => import('../pages/CandidateDashboard').then(module => ({ default: module.CandidateDashboard })));
const AssessmentAttempt = lazy(() => import('../pages/AssessmentAttempt').then(module => ({ default: module.AssessmentAttempt })));
const ResultsPage = lazy(() => import('../pages/ResultsPage').then(module => ({ default: module.ResultsPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const MyProgress = lazy(() => import('../pages/candidate/MyProgress').then(module => ({ default: module.MyProgress })));

// Recruitment Platform components
const JobBoardPage = lazy(() => import('../pages/JobBoardPage').then(module => ({ default: module.JobBoardPage })));
const JobDetailsPage = lazy(() => import('../pages/JobDetailsPage').then(module => ({ default: module.JobDetailsPage })));
const ApplyJobPage = lazy(() => import('../pages/ApplyJobPage').then(module => ({ default: module.ApplyJobPage })));
const CreateJobPage = lazy(() => import('../pages/jobs/CreateJobPage').then(module => ({ default: module.CreateJobPage })));

// Recruiter components
const RecruiterDashboardView = lazy(() => import('../views/recruiter/RecruiterDashboardView').then(module => ({ default: module.RecruiterDashboardView })));

// Hiring Manager components
const HiringManagerDashboardView = lazy(() => import('../views/hiring-manager/HiringManagerDashboardView').then(module => ({ default: module.HiringManagerDashboardView })));

/**
 * Route configuration organized by role/category
 */
export const routeConfig: RouteConfig[] = [
  // Public routes
  {
    path: 'landing',
    urlPath: '/',
    component: LandingPage,
    allowedRoles: ['admin', 'candidate', 'recruiter', 'hr', 'interviewer', 'hiring-manager'],
    layout: false,
    title: 'Home',
  },
  {
    path: 'auth',
    urlPath: '/login',
    component: AuthPage,
    allowedRoles: ['admin', 'candidate', 'recruiter', 'hr', 'interviewer', 'hiring-manager'],
    layout: false,
    title: 'Login / Register',
    description: 'Sign in or create a new account',
  },
  {
    path: 'candidate-flow',
    urlPath: '/candidate-flow',
    component: CandidateFlow,
    allowedRoles: ['admin', 'candidate', 'recruiter', 'hr', 'interviewer', 'hiring-manager'],
    layout: false,
    title: 'Candidate Flow',
  },
  {
    path: 'admin-flow',
    urlPath: '/admin-flow',
    component: AdminFlow,
    allowedRoles: ['admin'],
    layout: false,
    title: 'Admin Flow',
  },

  // Job Board - Accessible to all authenticated users, especially candidates
  {
    path: 'job-board',
    urlPath: '/jobs',
    component: JobBoardPage,
    allowedRoles: ['admin', 'candidate', 'recruiter', 'hr', 'interviewer', 'hiring-manager'],
    layout: true,
    title: 'Job Board',
    description: 'Browse available job opportunities',
  },
  {
    path: 'job-details',
    urlPath: '/job/:id',
    component: JobDetailsPage,
    allowedRoles: ['admin', 'candidate', 'recruiter', 'hr', 'interviewer', 'hiring-manager'],
    layout: true,
    title: 'Job Details',
    description: 'View job details and requirements',
  },
  {
    path: 'apply-job',
    urlPath: '/apply/:id',
    component: ApplyJobPage,
    allowedRoles: ['candidate', 'admin', 'recruiter', 'hr', 'interviewer', 'hiring-manager'],
    layout: true,
    title: 'Apply for Job',
    description: 'Submit your job application',
  },

  // Admin Dashboard Routes
  {
    path: 'admin-dashboard',
    urlPath: '/admin/dashboard',
    component: DashboardView,
    allowedRoles: ['admin'],
    layout: true,
    title: 'Admin Dashboard',
    description: 'Overview of system metrics and activities',
  },
  {
    path: 'assessment-creation',
    urlPath: '/admin/assessment-creation',
    component: AssessmentCreation,
    allowedRoles: ['admin'],
    layout: true,
    title: 'Create Assessment',
    description: 'Create a new coding assessment',
  },
  {
    path: 'manage-assessments',
    urlPath: '/admin/manage-assessments',
    component: AssessmentManagementView,
    allowedRoles: ['admin'],
    layout: true,
    title: 'Manage Assessments',
    description: 'View and manage all assessments',
  },
  {
    path: 'manage-candidates',
    urlPath: '/admin/manage-candidates',
    component: CandidateManagementView,
    allowedRoles: ['admin'],
    layout: true,
    title: 'Manage Candidates',
    description: 'View and manage all candidates',
  },
  {
    path: 'send-links',
    urlPath: '/admin/send-links',
    component: SendAssessmentLink,
    allowedRoles: ['admin'],
    layout: true,
    title: 'Send Assessment Links',
    description: 'Send assessment links to candidates',
  },
  {
    path: 'reports-analytics',
    urlPath: '/admin/reports-analytics',
    component: AnalyticsView,
    allowedRoles: ['admin'],
    layout: true,
    title: 'Reports & Analytics',
    description: 'View system-wide analytics and reports',
  },
      {
        path: 'job-management',
        urlPath: '/admin/job-management',
        component: JobManagementPage,
        allowedRoles: ['admin'],
        layout: true,
        title: 'Job Management',
        description: 'Create and manage job postings',
      },
      {
        path: 'admin-create-job',
        urlPath: '/admin/jobs/create',
        component: CreateJobPage,
        allowedRoles: ['admin'],
        layout: true,
        title: 'Create Job',
        description: 'Create a new job posting',
      },
  {
    path: 'application-dashboard',
    urlPath: '/admin/applications',
    component: ApplicationDashboard,
    allowedRoles: ['admin'],
    layout: true,
    title: 'Application Dashboard',
    description: 'View and manage all job applications',
  },

  // Candidate Routes
  {
    path: 'candidate-dashboard',
    urlPath: '/candidate/dashboard',
    component: CandidateDashboard,
    allowedRoles: ['candidate'],
    layout: true,
    title: 'Candidate Dashboard',
    description: 'Your personal dashboard with assessments and progress',
  },
  {
    path: 'assessment-attempt',
    urlPath: '/candidate/assessment-attempt',
    component: AssessmentAttempt,
    allowedRoles: ['candidate'],
    layout: true,
    title: 'Take Assessment',
    description: 'Complete your coding assessment',
  },
  {
    path: 'results',
    urlPath: '/candidate/results',
    component: ResultsPage,
    allowedRoles: ['candidate'],
    layout: true,
    title: 'Assessment Results',
    description: 'View your assessment results and scores',
  },
  {
    path: 'my-progress',
    urlPath: '/candidate/my-progress',
    component: MyProgress,
    allowedRoles: ['candidate'],
    layout: true,
    title: 'My Progress',
    description: 'Track your learning progress and achievements',
  },

  // Recruiter Routes
  {
    path: 'recruiter-dashboard',
    urlPath: '/recruiter/dashboard',
    component: RecruiterDashboardView,
    allowedRoles: ['recruiter'],
    layout: true,
    title: 'Recruiter Dashboard',
    description: 'Manage jobs, applications, and candidate pipeline',
  },
  {
    path: 'recruiter-job-management',
    urlPath: '/recruiter/job-management',
    component: JobManagementPage,
    allowedRoles: ['recruiter'],
    layout: true,
    title: 'Job Management',
    description: 'Create and manage job postings',
  },
  {
    path: 'recruiter-create-job',
    urlPath: '/recruiter/jobs/create',
    component: CreateJobPage,
    allowedRoles: ['recruiter', 'hiring-manager'],
    layout: true,
    title: 'Create Job',
    description: 'Create a new job posting',
  },
  {
    path: 'recruiter-applications',
    urlPath: '/recruiter/applications',
    component: ApplicationDashboard,
    allowedRoles: ['recruiter'],
    layout: true,
    title: 'Applications',
    description: 'View and manage job applications',
  },
  {
    path: 'recruiter-candidates',
    urlPath: '/recruiter/manage-candidates',
    component: CandidateManagementView,
    allowedRoles: ['recruiter'],
    layout: true,
    title: 'Candidates',
    description: 'View and manage candidate profiles',
  },
  {
    path: 'recruiter-analytics',
    urlPath: '/recruiter/analytics',
    component: AnalyticsView,
    allowedRoles: ['recruiter'],
    layout: true,
    title: 'Recruitment Analytics',
    description: 'View recruitment metrics and analytics',
  },

  // Hiring Manager Routes
  {
    path: 'hiring-manager-dashboard',
    urlPath: '/hiring-manager/dashboard',
    component: HiringManagerDashboardView,
    allowedRoles: ['hiring-manager'],
    layout: true,
    title: 'Hiring Manager Dashboard',
    description: 'Review candidates and make hiring decisions',
  },
  {
    path: 'hiring-manager-job-approvals',
    urlPath: '/hiring-manager/job-approvals',
    component: JobManagementPage,
    allowedRoles: ['hiring-manager'],
    layout: true,
    title: 'Job Approvals',
    description: 'Review and approve job postings',
  },
  {
    path: 'hiring-manager-decisions',
    urlPath: '/hiring-manager/decisions',
    component: ApplicationDashboard,
    allowedRoles: ['hiring-manager'],
    layout: true,
    title: 'Candidate Decisions',
    description: 'Review candidates and make final decisions',
  },
  {
    path: 'hiring-manager-analytics',
    urlPath: '/hiring-manager/analytics',
    component: AnalyticsView,
    allowedRoles: ['hiring-manager'],
    layout: true,
    title: 'Team Analytics',
    description: 'View team hiring metrics and analytics',
  },

  // Shared Routes
  {
    path: 'profile',
    urlPath: '/profile',
    component: ProfilePage,
    allowedRoles: ['admin', 'candidate', 'recruiter', 'hr', 'interviewer', 'hiring-manager'],
    layout: true,
    title: 'Profile',
    description: 'Manage your profile',
  },
];

/**
 * Convert route config array to map for easy lookup
 */
export const routeMap: Record<string, RouteConfig> = routeConfig.reduce((acc, route) => {
  acc[route.path] = route;
  return acc;
}, {} as Record<string, RouteConfig>);

/**
 * Get routes by role
 */
export const getRoutesByRole = (role: UserRole): RouteConfig[] => {
  return routeConfig.filter(route => route.allowedRoles.includes(role));
};

/**
 * Get admin routes
 */
export const getAdminRoutes = (): RouteConfig[] => {
  return routeConfig.filter(route => 
    route.allowedRoles.includes('admin') && 
    route.urlPath.startsWith('/admin')
  );
};

