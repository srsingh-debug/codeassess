import React from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LucideIcon } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, icon: Icon, children }) => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              {title}
            </span>
          </div>
          {children}
        </div>
      </div>
    </header>
  );
};