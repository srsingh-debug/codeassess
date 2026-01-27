import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { routeConfig, routeMap } from './config/routes';
import { UserRole } from './types';
import { hasRoleAccess, getUnauthorizedRedirect } from './utils/roleRouting';

// Create a component for protected routes
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles: UserRole[];
  isPublic?: boolean;
}> = ({ children, allowedRoles, isPublic = false }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Public routes don't require authentication
  if (isPublic) {
    return <>{children}</>;
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed
  if (!hasRoleAccess(user.role, allowedRoles)) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={getUnauthorizedRedirect(user.role)} replace />;
  }

  return <>{children}</>;
};

// Create a component for each route
const RouteComponent: React.FC<{ path: string }> = ({ path }) => {
  const route = routeMap[path];
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!route) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">The page you're looking for doesn't exist.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Home
        </button>
      </div>
    );
  }

  const Component = route.component;
  // Components now use React Router's useNavigate hook directly
  const content = <Component />;

  // Apply layout if needed
  if (route.layout && user) {
    return (
      <Layout currentView={path} onNavigate={(view) => window.location.href = `/${view}`}>
        {content}
      </Layout>
    );
  }

  return content;
};

function AppContent() {
  return (
    <Routes>
      {/* Dynamically generate routes from configuration */}
      {routeConfig.map((route) => {
        // Landing and auth pages are public (don't require authentication)
        const isPublic = route.path === 'landing' || route.path === 'auth';
        
        return (
          <Route
            key={route.path}
            path={route.urlPath}
            element={
              <ProtectedRoute allowedRoles={route.allowedRoles} isPublic={isPublic}>
                <RouteComponent path={route.path} />
              </ProtectedRoute>
            }
          />
        );
      })}

      {/* Redirects for backward compatibility */}
      <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/candidate-dashboard" element={<Navigate to="/candidate/dashboard" replace />} />

      {/* Catch-all route */}
      <Route path="*" element={
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">The page you're looking for doesn't exist.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NotificationsProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </NotificationsProvider>
    </ThemeProvider>
  );
}

export default App;