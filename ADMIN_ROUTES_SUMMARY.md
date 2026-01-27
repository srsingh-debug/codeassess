# Admin Routes Summary

## Quick Reference

All admin routes are configured in `src/config/routes.ts` and automatically registered in the application.

### Admin Dashboard Routes

| Route | Path | Component | Description |
|-------|------|-----------|-------------|
| Admin Dashboard | `/admin/dashboard` | `DashboardView` | Main admin dashboard |
| Create Assessment | `/admin/assessment-creation` | `AssessmentCreation` | Create new assessments |
| Manage Assessments | `/admin/manage-assessments` | `AssessmentManagementView` | Manage all assessments |
| Manage Candidates | `/admin/manage-candidates` | `CandidateManagementView` | Manage all candidates |
| Send Links | `/admin/send-links` | `SendAssessmentLink` | Send assessment links |
| Reports & Analytics | `/admin/reports-analytics` | `AnalyticsView` | View analytics |
| Job Management | `/admin/job-management` | `JobManagementPage` | Manage jobs |
| Applications | `/admin/applications` | `ApplicationDashboard` | Manage applications |

### Navigation

All routes are automatically:
- ✅ Protected by role-based access control
- ✅ Available in sidebar navigation
- ✅ Accessible via direct URL
- ✅ Included in route configuration

### Adding New Routes

To add a new admin route:

1. Create component in `src/pages/admin/` or `src/views/admin/`
2. Add to `src/config/routes.ts`:

```typescript
{
  path: 'new-page',
  urlPath: '/admin/new-page',
  component: NewPage,
  allowedRoles: ['admin'],
  layout: true,
  title: 'New Page',
  description: 'Page description',
}
```

3. Add to `src/config/menus.ts` if it should appear in sidebar:

```typescript
{
  id: 'new-page',
  label: 'New Page',
  icon: YourIcon,
  path: '/admin/new-page',
}
```

The route will be automatically registered and protected!
