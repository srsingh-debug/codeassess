import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  Users, 
  Activity 
} from 'lucide-react';

interface ActivityItemProps {
  type: string;
  message: string;
  timeAgo: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ type, message, timeAgo }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assessment_completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'assessment_started':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'candidate_invited':
        return <Users className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
      <div className="flex-shrink-0 mt-0.5">
        {getActivityIcon(type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 dark:text-white font-medium">
          {message}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {timeAgo}
        </p>
      </div>
    </div>
  );
};