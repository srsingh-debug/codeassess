import React from 'react';
import { Badge } from '../ui/Badge';
import { Calendar, Users } from 'lucide-react';

interface UpcomingAssessmentCardProps {
  name: string;
  scheduledDate: string;
  candidatesInvited: number;
}

export const UpcomingAssessmentCard: React.FC<UpcomingAssessmentCardProps> = ({ 
  name, 
  scheduledDate, 
  candidatesInvited 
}) => {
  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
          {name}
        </h3>
        <Badge variant="info" size="sm">
          Scheduled
        </Badge>
      </div>
      <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-300">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>{scheduledDate}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span>{candidatesInvited} invited</span>
        </div>
      </div>
    </div>
  );
};