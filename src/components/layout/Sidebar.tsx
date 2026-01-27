import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Drawer } from '../ui/Drawer';
import { getMenuItems } from '../../config/menus';
import { 
  Code,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate?: (view: string) => void; // Optional since we use useNavigate
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onNavigate, 
  isMobileOpen, 
  onMobileClose 
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  // Get menu items based on user role
  const menuItems = getMenuItems(user?.role);

  const handleItemClick = (path: string) => {
    navigate(path);
    onMobileClose();
  };

  const toggleDesktopSidebar = () => {
    setIsDesktopCollapsed(!isDesktopCollapsed);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // For desktop, we show a collapsible sidebar
  // For mobile, we use the drawer
  return (
    <>
      {/* Desktop Sidebar - Collapsible */}
      <aside className={`hidden md:block ${isDesktopCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0 transition-all duration-300`}>
        <nav className="h-full flex flex-col">
          {/* Logo Section and Collapse/Expand Button */}
          <div className={`flex items-center ${isDesktopCollapsed ? 'justify-center py-4' : 'px-4 py-4'} border-b border-gray-200 dark:border-gray-700`}>
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Code className={`text-white ${isDesktopCollapsed ? 'w-6 h-6' : 'w-6 h-6'}`} />
              </div>
              {!isDesktopCollapsed && (
                <span className="font-bold text-xl text-gray-900 dark:text-white whitespace-nowrap ml-3">CodeAssess</span>
              )}
            </div>
            <button 
              onClick={toggleDesktopSidebar}
              className={`p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDesktopCollapsed ? '' : 'ml-auto'}`}
            >
              {isDesktopCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-6">
            <ul className={`space-y-2 ${isDesktopCollapsed ? 'px-2' : 'px-4'}`}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleItemClick(item.path)}
                      className={`
                        w-full flex items-center ${isDesktopCollapsed ? 'justify-center py-3' : 'space-x-3 px-3 py-2'} rounded-lg text-left
                        transition-colors duration-200
                        ${isActive 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-2 border-blue-600' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      {!isDesktopCollapsed && <span className="font-medium">{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          
          {/* Logout Button at Bottom */}
          <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${isDesktopCollapsed ? 'flex justify-center' : ''}`}>
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center ${isDesktopCollapsed ? 'justify-center py-3' : 'space-x-3 px-3 py-2'} 
                rounded-lg text-left transition-colors duration-200
                text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
              `}
            >
              <LogOut className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              {!isDesktopCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile Drawer */}
      <Drawer isOpen={isMobileOpen} onClose={onMobileClose} position="left">
        <div className="h-full flex flex-col bg-white dark:bg-gray-800">
          {/* Drawer Header with Logo */}
          <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">CodeAssess</span>
            <button 
              onClick={onMobileClose}
              className="ml-auto p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Drawer Content */}
          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-2 px-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleItemClick(item.path)}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left
                        transition-colors duration-200
                        ${isActive 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-2 border-blue-600' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* Logout Button at Bottom of Mobile Drawer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                handleLogout();
                onMobileClose();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
};