import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate?: (view: string) => void; // Optional since components use useNavigate
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  if (!user) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>;
  }

  // Use AdminLayout for admin users
  if (user.role === 'admin') {
    return (
      <AdminLayout 
        currentView={currentView} 
        onNavigate={onNavigate}
      >
        {children}
      </AdminLayout>
    );
  }

  // For non-admin users, use the regular layout with consistent sidebar behavior
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar 
        currentView={currentView}
        onNavigate={onNavigate}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={handleMobileMenuClose}
      />
      
      <div className="flex flex-col flex-1">
        <Header 
          onMobileMenuToggle={handleMobileMenuToggle}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};