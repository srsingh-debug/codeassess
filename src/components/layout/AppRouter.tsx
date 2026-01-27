import React, { Suspense } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from './Layout';
import { routeMap, RouteConfig } from '../../routes/routeConfig';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface RouterProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const AppRouter: React.FC<RouterProps> = ({ currentView, onNavigate }) => {
  const { user } = useAuth();
  
  // Get route configuration
  const route: RouteConfig | undefined = routeMap[currentView];
  
  // If route doesn't exist, show 404
  if (!route) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">The page you're looking for doesn't exist.</p>
        <button 
          onClick={() => onNavigate('landing')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Home
        </button>
      </div>
    );
  }
  
  // Check if user has permission to access this route
  const userRole = user ? user.role : 'public';
  const hasPermission = route.allowedRoles.includes(userRole);
  
  // If user doesn't have permission, show access denied
  if (!hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
        <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 mb-4">
          <div className="bg-red-500 text-white rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          You don't have permission to access this page.
        </p>
        <button 
          onClick={() => onNavigate(user ? `${user.role}-dashboard` : 'landing')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {user ? `Go to ${user.role} dashboard` : 'Go Home'}
        </button>
      </div>
    );
  }
  
  // Render the component
  const Component = route.component;
  const componentProps = { onNavigate };
  
  const content = (
    <Suspense fallback={<LoadingSpinner />}>
      <Component {...componentProps} />
    </Suspense>
  );
  
  // Apply layout if needed
  if (route.layout && user) {
    return (
      <Layout currentView={currentView} onNavigate={onNavigate}>
        {content}
      </Layout>
    );
  }
  
  return content;
};