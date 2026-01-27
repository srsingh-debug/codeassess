# Role-Based Dashboard Plan
## CodeAssess Platform - Persona-Driven Dashboard Architecture

**Version:** 1.0  
**Last Updated:** December 2024  
**Status:** Planning Phase

---

## Table of Contents

1. [Overview](#overview)
2. [User Roles & Personas](#user-roles--personas)
3. [Dashboard Architecture](#dashboard-architecture)
4. [Feature Access Matrix](#feature-access-matrix)
5. [Implementation Plan](#implementation-plan)
6. [Route Structure](#route-structure)
7. [Component Architecture](#component-architecture)
8. [Navigation & Routing Logic](#navigation--routing-logic)
9. [Security & Permissions](#security--permissions)
10. [Future Enhancements](#future-enhancements)

---

## Overview

This document outlines the comprehensive plan for implementing role-based dashboards in the CodeAssess platform. The system supports six distinct user roles, each with tailored dashboards and feature access based on their responsibilities and workflow needs.

### Objectives

- Provide role-specific dashboards optimized for each user persona
- Implement granular feature access control based on roles
- Ensure seamless user experience with intuitive navigation
- Maintain security and data privacy through role-based access control (RBAC)
- Enable scalable architecture for future role additions

---

## User Roles & Personas

### 1. Admin
**Persona:** System Administrator  
**Primary Responsibilities:**
- Full system oversight and management
- User and role management
- System configuration and settings
- Comprehensive analytics and reporting

**Dashboard URL:** `/admin/dashboard`

### 2. Candidate
**Persona:** Job Applicant / Assessment Taker  
**Primary Responsibilities:**
- Take coding assessments
- View assessment results
- Apply for job positions
- Track personal progress and achievements

**Dashboard URL:** `/candidate/dashboard`

### 3. Recruiter
**Persona:** Talent Acquisition Specialist  
**Primary Responsibilities:**
- Create and manage job postings
- Source and evaluate candidates
- Manage candidate pipeline
- Coordinate assessment assignments

**Dashboard URL:** `/recruiter/dashboard`

### 4. HR
**Persona:** Human Resources Manager  
**Primary Responsibilities:**
- Oversee hiring compliance
- Manage candidate documentation
- Ensure process quality
- Generate HR reports and analytics

**Dashboard URL:** `/hr/dashboard`

### 5. Interviewer
**Persona:** Technical Interviewer / Evaluator  
**Primary Responsibilities:**
- Conduct technical interviews
- Review candidate assessments
- Provide evaluation feedback
- Rate candidate performance

**Dashboard URL:** `/interviewer/dashboard`

### 6. Hiring Manager
**Persona:** Department Head / Team Lead  
**Primary Responsibilities:**
- Define hiring requirements
- Review shortlisted candidates
- Make final hiring decisions
- Manage team hiring needs

**Dashboard URL:** `/hiring-manager/dashboard`

---

## Dashboard Architecture

### Admin Dashboard (`/admin/dashboard`)

#### Core Features

**Assessment Management**
- ✅ Create new assessments
- ✅ Edit existing assessments
- ✅ Manage assessment lifecycle (draft → published → archived)
- ✅ Send assessment links to candidates
- ✅ View all assessment attempts and results

**Candidate Management**
- ✅ View complete candidate database
- ✅ Search and filter candidates
- ✅ Manage candidate profiles
- ✅ View candidate assessment history
- ✅ Export candidate data

**Job Management**
- ✅ Create and edit job postings
- ✅ Manage job status (draft → published → closed)
- ✅ Set job requirements and criteria
- ✅ View job application statistics

**Application Management**
- ✅ View all job applications
- ✅ Filter by status, job, or candidate
- ✅ Manage application workflow
- ✅ Bulk actions on applications

**Analytics & Reports**
- ✅ System-wide analytics dashboard
- ✅ Assessment performance metrics
- ✅ Candidate statistics
- ✅ Job application metrics
- ✅ Time-to-hire analytics
- ✅ Custom report generation

**System Settings**
- ✅ User management (CRUD operations)
- ✅ Role management and permissions
- ✅ System configuration
- ✅ Integration settings
- ✅ Audit logs

---

### Candidate Dashboard (`/candidate/dashboard`)

#### Core Features

**My Dashboard Overview**
- 📊 Upcoming assessments (with countdown)
- 📈 Recent assessment results
- 📋 Job application status
- 🏆 Achievement badges and milestones
- 📅 Calendar view of assessments

**Assessments**
- ✅ View assigned assessments
- ✅ Take assessments (with timer)
- ✅ View assessment history
- ✅ Download assessment results
- ✅ View detailed feedback

**My Progress**
- 📊 Performance tracking over time
- 📈 Skill development analytics
- 🏆 Achievement badges
- 📝 Learning recommendations
- 📉 Weak areas identification

**Job Board**
- 🔍 Browse available jobs
- 📄 View job details
- 📝 Apply for jobs
- 📋 Track application status
- 💼 Saved jobs

**Profile Management**
- ✏️ Edit personal information
- 📄 Resume/CV upload and management
- 🎯 Skills and experience
- 🔗 Social profiles (LinkedIn, GitHub)
- 📧 Notification preferences

---

### Recruiter Dashboard (`/recruiter/dashboard`)

#### Core Features

**Dashboard Overview**
- 📊 Active job postings count
- 📈 New applications (last 24h, 7d, 30d)
- ⏰ Pending assessments
- 🎯 Pipeline status
- 📉 Key recruitment metrics

**Job Management**
- ✅ Create new job postings
- ✏️ Edit job descriptions
- 📊 Manage job status
- 🔍 View job analytics
- 📋 Duplicate jobs

**Candidate Pipeline**
- 👥 View all applications
- 🔍 Filter by status, job, date
- 📊 Pipeline visualization
- 📝 Candidate profiles
- 📧 Bulk communication

**Assessment Management**
- ✅ Assign assessments to candidates
- 📊 View assessment results
- 📧 Send assessment links
- ⏰ Track completion status
- 📈 Assessment performance metrics

**Candidate Evaluation**
- 👤 Review candidate profiles
- 📊 View assessment scores
- 📝 Application status management
- 💬 Candidate notes
- ⭐ Candidate ratings

**Reports & Analytics**
- 📊 Recruitment funnel metrics
- ⏱️ Time-to-hire analytics
- 📈 Source effectiveness
- 💰 Cost-per-hire
- 📉 Offer acceptance rates

---

### HR Dashboard (`/hr/dashboard`)

#### Core Features

**Dashboard Overview**
- ⚠️ Pending approvals
- 🚨 Compliance alerts
- 💚 System health status
- 📊 HR metrics overview
- 📅 Upcoming deadlines

**Candidate Management**
- 👥 View all candidates
- ✅ Background check status
- 📄 Document verification
- 🔍 Compliance checks
- 📋 Candidate documentation

**Application Review**
- 📝 Review applications
- ✅ Compliance verification
- 📄 Document validation
- 🔍 Eligibility checks
- 📊 Application quality metrics

**Assessment Oversight**
- 👀 Monitor assessment completion
- 📊 Review assessment results
- ✅ Quality assurance
- 📈 Assessment analytics
- 🚨 Flag suspicious activity

**Reports & Analytics**
- 📊 HR metrics dashboard
- ✅ Compliance reports
- 🌍 Diversity metrics
- 📈 Hiring funnel analysis
- 📉 Turnover analytics

**User Management**
- 👥 Manage internal users
- 🔐 Role assignments
- 🔒 Access control
- 📊 User activity logs
- 🔄 Permission management

---

### Interviewer Dashboard (`/interviewer/dashboard`)

#### Core Features

**Dashboard Overview**
- 📅 Upcoming interviews (next 7 days)
- ⏳ Pending evaluations
- 👤 Assigned candidates
- 📊 Interview statistics
- 📈 Performance metrics

**Candidate Evaluation**
- 👤 View assigned candidates
- 📊 Assessment results review
- 📄 Candidate profiles
- 📝 Interview preparation notes
- 🎯 Evaluation criteria

**Interview Management**
- 📅 Schedule interviews
- 📝 Interview notes
- 📋 Evaluation forms
- ⏰ Interview reminders
- 📧 Candidate communication

**Assessment Review**
- 👀 Review candidate assessments
- 💻 Code review
- 🔍 Technical evaluation
- 📊 Score assessment
- 💬 Provide feedback

**Feedback & Ratings**
- ✅ Submit interview feedback
- ⭐ Rate candidates
- 📝 Recommendation notes
- 🎯 Technical skills rating
- 💼 Cultural fit assessment

**My Schedule**
- 📅 Interview calendar
- ⏰ Upcoming interviews
- 📋 Interview history
- 🔔 Notifications
- 📊 Interview statistics

---

### Hiring Manager Dashboard (`/hiring-manager/dashboard`)

#### Core Features

**Dashboard Overview**
- 👥 Team hiring needs
- 📊 Open positions
- 📈 Candidate pipeline status
- ⏱️ Time-to-fill metrics
- 🎯 Hiring goals progress

**Job Posting Management**
- ✅ Create job requirements
- ✅ Approve job postings
- 🎯 Set hiring criteria
- 📊 Job performance metrics
- 📋 Budget management

**Candidate Review**
- 👤 Review shortlisted candidates
- 📊 Assessment results
- 💬 Interview feedback
- 📄 Candidate profiles
- ⭐ Candidate ratings

**Decision Making**
- ✅ Make hiring decisions
- ✅ Approve/reject candidates
- 💼 Offer management
- 📝 Decision notes
- 📧 Candidate communication

**Team Analytics**
- 📊 Team hiring metrics
- ⏱️ Time-to-fill analytics
- 📈 Quality of hires
- 💰 Hiring costs
- 🎯 Team performance

**Reports**
- 📊 Department hiring reports
- 💰 Budget analysis
- 📈 Hiring trends
- 📉 Team growth metrics
- 🎯 Strategic insights

---

## Feature Access Matrix

| Feature | Admin | Recruiter | HR | Interviewer | Hiring Manager | Candidate |
|---------|:-----:|:---------:|:--:|:-----------:|:--------------:|:---------:|
| **Assessment Management** |
| Create Assessments | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit Assessments | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Delete Assessments | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Assessment Lifecycle | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Send Assessment Links | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View All Assessments | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Take Assessments | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View Own Assessment Results | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Candidate Management** |
| View All Candidates | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| View Own Profile | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Edit Candidate Profiles | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ (own) |
| Export Candidate Data | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Job Management** |
| Create Jobs | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Edit Jobs | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Delete Jobs | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Approve Jobs | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| View All Jobs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Apply for Jobs | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Application Management** |
| View All Applications | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| View Own Applications | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage Application Status | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Make Hiring Decisions | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Interview Management** |
| Schedule Interviews | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Conduct Interviews | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| View Interview Feedback | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Submit Interview Feedback | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Analytics & Reports** |
| System Analytics | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Recruitment Analytics | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| HR Analytics | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Own Progress Analytics | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **System Management** |
| User Management | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Role Management | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| System Settings | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Access Control | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |

---

## Implementation Plan

### Phase 1: Foundation Setup (Week 1-2)

**Tasks:**
1. Update route configuration to include all role-based routes
2. Create dashboard component structure
3. Update TypeScript types for new roles
4. Implement role-based routing logic in `useAuth.ts`
5. Update `AuthPage.tsx` to redirect based on role

**Deliverables:**
- Updated `routeConfig.ts` with all role routes
- Dashboard component stubs for each role
- Updated navigation types

### Phase 2: Dashboard Components (Week 3-4)

**Tasks:**
1. Create `RecruiterDashboard.tsx`
2. Create `HRDashboard.tsx`
3. Create `InterviewerDashboard.tsx`
4. Create `HiringManagerDashboard.tsx`
5. Refactor existing `AdminDashboard.tsx` if needed
6. Ensure `CandidateDashboard.tsx` is complete

**Deliverables:**
- All dashboard components with basic layout
- Role-specific widgets and cards
- Initial data fetching hooks

### Phase 3: Navigation & Sidebar (Week 5)

**Tasks:**
1. Update `Sidebar.tsx` with role-specific menus
2. Create menu configuration for each role
3. Implement dynamic menu rendering
4. Add role-based icons and labels

**Deliverables:**
- Role-specific sidebar menus
- Dynamic navigation based on user role
- Updated menu items configuration

### Phase 4: Route Protection & Permissions (Week 6)

**Tasks:**
1. Update `ProtectedRoute` component
2. Implement role-based route guards
3. Add permission checks for features
4. Create unauthorized access handling

**Deliverables:**
- Enhanced route protection
- Permission middleware
- Error handling for unauthorized access

### Phase 5: Feature Implementation (Week 7-10)

**Tasks:**
1. Implement recruiter-specific features
2. Implement HR-specific features
3. Implement interviewer-specific features
4. Implement hiring manager-specific features
5. Create shared components for common features

**Deliverables:**
- Complete feature set for each role
- Reusable component library
- API integration for all features

### Phase 6: Testing & Refinement (Week 11-12)

**Tasks:**
1. Test all role-based dashboards
2. Verify permission enforcement
3. User acceptance testing
4. Performance optimization
5. Bug fixes and refinements

**Deliverables:**
- Tested and validated dashboards
- Performance optimizations
- Documentation updates

---

## Route Structure

### Current Routes

```typescript
// Admin routes
/admin/dashboard
/admin/assessment-creation
/admin/manage-assessments
/admin/manage-candidates
/admin/send-links
/admin/reports-analytics
/admin/job-management
/admin/applications

// Candidate routes
/candidate/dashboard
/candidate/assessment-attempt
/candidate/results
/candidate/my-progress
```

### New Routes to Add

```typescript
// Recruiter routes
/recruiter/dashboard
/recruiter/jobs
/recruiter/candidates
/recruiter/applications
/recruiter/assessments
/recruiter/analytics

// HR routes
/hr/dashboard
/hr/candidates
/hr/applications
/hr/compliance
/hr/reports
/hr/users

// Interviewer routes
/interviewer/dashboard
/interviewer/schedule
/interviewer/candidates
/interviewer/evaluations
/interviewer/feedback

// Hiring Manager routes
/hiring-manager/dashboard
/hiring-manager/jobs
/hiring-manager/candidates
/hiring-manager/decisions
/hiring-manager/analytics
```

### Route Configuration Update

```typescript
// Update routeConfig.ts allowedRoles type
allowedRoles: ('admin' | 'candidate' | 'recruiter' | 'hr' | 'interviewer' | 'hiring-manager' | 'public')[]

// Add new route entries
'recruiter-dashboard': {
  path: 'recruiter-dashboard',
  urlPath: '/recruiter/dashboard',
  component: RecruiterDashboard,
  allowedRoles: ['recruiter', 'admin'],
  layout: true
},
// ... (similar for other roles)
```

---

## Component Architecture

### Dashboard Component Structure

```
src/
├── pages/
│   ├── admin/
│   │   └── AdminDashboard.tsx (existing)
│   ├── candidate/
│   │   └── CandidateDashboard.tsx (existing)
│   ├── recruiter/
│   │   └── RecruiterDashboard.tsx (new)
│   ├── hr/
│   │   └── HRDashboard.tsx (new)
│   ├── interviewer/
│   │   └── InterviewerDashboard.tsx (new)
│   └── hiring-manager/
│       └── HiringManagerDashboard.tsx (new)
├── views/
│   ├── admin/ (existing)
│   ├── candidate/ (existing)
│   ├── recruiter/ (new)
│   ├── hr/ (new)
│   ├── interviewer/ (new)
│   └── hiring-manager/ (new)
└── components/
    ├── shared/ (common components)
    └── role-specific/ (role-specific components)
```

### Shared Components

**Common Dashboard Components:**
- `DashboardCard.tsx` - Reusable card component
- `MetricWidget.tsx` - Metric display widget
- `DataTable.tsx` - Generic data table
- `FilterBar.tsx` - Filtering component
- `StatusBadge.tsx` - Status indicator
- `ActionButton.tsx` - Action button component

**Role-Specific Components:**
- `CandidateCard.tsx` - Candidate information card
- `AssessmentCard.tsx` - Assessment display card
- `JobCard.tsx` - Job posting card
- `ApplicationCard.tsx` - Application status card
- `InterviewCard.tsx` - Interview schedule card

---

## Navigation & Routing Logic

### Post-Login Routing

```typescript
// Update AuthPage.tsx or useAuth.ts
const getDashboardRoute = (role: string): string => {
  const roleRoutes: Record<string, string> = {
    'admin': '/admin/dashboard',
    'recruiter': '/recruiter/dashboard',
    'hr': '/hr/dashboard',
    'interviewer': '/interviewer/dashboard',
    'hiring-manager': '/hiring-manager/dashboard',
    'candidate': '/candidate/dashboard'
  };
  
  return roleRoutes[role] || '/candidate/dashboard';
};
```

### Sidebar Menu Configuration

```typescript
// Create menuConfig.ts
export const menuConfig = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'assessments', label: 'Assessments', path: '/admin/manage-assessments' },
    // ... more items
  ],
  recruiter: [
    { id: 'dashboard', label: 'Dashboard', path: '/recruiter/dashboard' },
    { id: 'jobs', label: 'Jobs', path: '/recruiter/jobs' },
    // ... more items
  ],
  // ... other roles
};
```

---

## Security & Permissions

### Route Protection

```typescript
// Enhanced ProtectedRoute component
<ProtectedRoute 
  allowedRoles={['admin', 'recruiter']}
  fallbackPath="/unauthorized"
>
  <Component />
</ProtectedRoute>
```

### Feature-Level Permissions

```typescript
// Permission hook
const usePermission = (feature: string) => {
  const { user } = useAuth();
  return hasPermission(user?.role, feature);
};

// Usage
const canCreateJob = usePermission('job.create');
```

### API-Level Permissions

- Backend middleware to verify role permissions
- JWT token includes role information
- API endpoints validate role before processing

---

## Future Enhancements

### Phase 2 Features

1. **Customizable Dashboards**
   - Drag-and-drop widget arrangement
   - Personal dashboard preferences
   - Saved dashboard layouts

2. **Advanced Analytics**
   - Predictive analytics
   - AI-powered insights
   - Custom report builder

3. **Collaboration Features**
   - Team workspaces
   - Shared candidate notes
   - Interview scheduling integration

4. **Mobile Responsiveness**
   - Mobile-optimized dashboards
   - Mobile app (future)
   - Push notifications

5. **Integration Capabilities**
   - ATS integration
   - Calendar integration
   - Email/Slack notifications

---

## Success Metrics

### Key Performance Indicators (KPIs)

1. **User Adoption**
   - Dashboard usage by role
   - Feature utilization rates
   - User satisfaction scores

2. **Efficiency Metrics**
   - Time-to-complete tasks
   - Navigation efficiency
   - Error rates

3. **Business Metrics**
   - Hiring velocity
   - Candidate quality
   - Process efficiency

---

## Documentation & Training

### User Guides

- Admin Dashboard Guide
- Recruiter Dashboard Guide
- HR Dashboard Guide
- Interviewer Dashboard Guide
- Hiring Manager Dashboard Guide
- Candidate Dashboard Guide

### Technical Documentation

- API documentation for role-based endpoints
- Component library documentation
- Permission system documentation
- Deployment guide

---

## Appendix

### Role Definitions

**Admin:** Full system access, can manage all aspects of the platform.

**Recruiter:** Focus on sourcing, job posting, and candidate pipeline management.

**HR:** Focus on compliance, documentation, and process oversight.

**Interviewer:** Focus on candidate evaluation and interview management.

**Hiring Manager:** Focus on hiring decisions and team needs.

**Candidate:** Self-service portal for assessments and job applications.

### Technology Stack

- **Frontend:** React + TypeScript
- **Routing:** React Router v7
- **State Management:** React Context + Hooks
- **API:** RESTful APIs via API Gateway
- **Authentication:** JWT tokens
- **Authorization:** Role-based access control (RBAC)

---

**Document Status:** Ready for Implementation  
**Next Steps:** Begin Phase 1 - Foundation Setup  
**Owner:** Development Team  
**Review Date:** Weekly during implementation



