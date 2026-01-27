import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-auto border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © 2025 CodeAssess Admin Portal. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Dashboard
            </button>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Documentation</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};