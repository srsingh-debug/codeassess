import React, { useState } from 'react';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { AdminDashboard } from './AdminDashboard';
import { AssessmentCreation } from './AssessmentCreation';
import { CandidateManagement } from './CandidateManagement';
import { SendAssessmentLink } from './SendAssessmentLink';

type AdminView = 'dashboard' | 'assessment-creation' | 'candidate-management' | 'send-links';

export const AdminFlow: React.FC = () => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  const handleNavigate = (view: string) => {
    setCurrentView(view as AdminView);
  };

  return (
    <ThemeProvider>
      {currentView === 'dashboard' && (
        <AdminDashboard onNavigate={handleNavigate} />
      )}
      
      {currentView === 'assessment-creation' && (
        <AssessmentCreation onNavigate={handleNavigate} />
      )}
      
      {currentView === 'candidate-management' && (
        <CandidateManagement onNavigate={handleNavigate} />
      )}
      
      {currentView === 'send-links' && (
        <SendAssessmentLink onNavigate={handleNavigate} />
      )}
    </ThemeProvider>
  );
};