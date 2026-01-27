# Admin Routes Documentation

## Overview
This document lists all available routes for the Admin role in the CodeAssess platform.

## Admin Dashboard Routes

### 1. Admin Dashboard
- **Path:** `/admin/dashboard`
- **Component:** `DashboardView`
- **Description:** Main admin dashboard with system overview and metrics
- **Access:** Admin only
- **Layout:** Yes

### 2. Assessment Creation
- **Path:** `/admin/assessment-creation`
- **Component:** `AssessmentCreation`
- **Description:** Create new coding assessments
- **Access:** Admin only
- **Layout:** Yes

### 3. Manage Assessments
- **Path:** `/admin/manage-assessments`
- **Component:** `AssessmentManagementView`
- **Description:** View and manage all assessments (edit, delete, publish)
- **Access:** Admin only
- **Layout:** Yes

### 4. Manage Candidates
- **Path:** `/admin/manage-candidates`
- **Component:** `CandidateManagementView`
- **Description:** View and manage all candidate profiles
- **Access:** Admin only
- **Layout:** Yes

### 5. Send Assessment Links
- **Path:** `/admin/send-links`
- **Component:** `SendAssessmentLink`
- **Description:** Send assessment links to candidates via email
- **Access:** Admin only
- **Layout:** Yes

### 6. Reports & Analytics
- **Path:** `/admin/reports-analytics`
- **Component:** `AnalyticsView`
- **Description:** View system-wide analytics, reports, and metrics
- **Access:** Admin only
- **Layout:** Yes

### 7. Job Management
- **Path:** `/admin/job-management`
- **Component:** `JobManagementPage`
- **Description:** Create and manage job postings
- **Access:** Admin only
- **Layout:** Yes

### 8. Application Dashboard
- **Path:** `/admin/applications`
- **Component:** `ApplicationDashboard`
- **Description:** View and manage all job applications
- **Access:** Admin only
- **Layout:** Yes

## Shared Routes (Available to Admin)

### Profile
- **Path:** `/profile`
- **Component:** `ProfilePage`
- **Description:** Manage user profile settings
- **Access:** Admin, Candidate, Recruiter, HR, Interviewer, Hiring Manager
- **Layout:** Yes

## Public Routes (Available to Admin)

### Landing Page
- **Path:** `/`
- **Component:** `LandingPage`
- **Description:** Public landing page
- **Access:** All users
- **Layout:** No

### Job Board
- **Path:** `/jobs`
- **Component:** `JobBoardPage`
- **Description:** Browse available job postings
- **Access:** All users
- **Layout:** No

### Job Details
- **Path:** `/job/:id`
- **Component:** `JobDetailsPage`
- **Description:** View detailed job information
- **Access:** All users
- **Layout:** No

### Apply for Job
- **Path:** `/apply/:id`
- **Component:** `ApplyJobPage`
- **Description:** Apply for a specific job
- **Access:** All users
- **Layout:** No

## Route Configuration

All routes are configured in `src/config/routes.ts` and can be easily extended or modified.

### Adding New Admin Routes

To add a new admin route:

1. Create the component in `src/pages/admin/` or `src/views/admin/`
2. Add route configuration to `src/config/routes.ts`:

```typescript
{
  path: 'new-admin-page',
  urlPath: '/admin/new-page',
  component: NewAdminPage,
  allowedRoles: ['admin'],
  layout: true,
  title: 'New Admin Page',
  description: 'Description of the page',
}
```

3. The route will be automatically registered and protected

## Navigation

Routes are automatically available in:
- Sidebar navigation (based on role)
- Direct URL access (with role protection)
- Programmatic navigation using React Router

## Route Protection

All admin routes are protected by:
- Authentication check (user must be logged in)
- Role-based access control (only admin role allowed)
- Automatic redirect to appropriate dashboard if unauthorized



