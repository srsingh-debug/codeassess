import React from 'react';
import { DashboardView } from '../../views/admin/DashboardView';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  return <DashboardView onNavigate={onNavigate} />;
};