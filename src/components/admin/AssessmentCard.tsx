import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Edit, 
  Trash2, 
  Copy, 
  Eye,
  Users,
  Clock,
  Target
} from 'lucide-react';

interface AssessmentCardProps {
  id: string;
  title: string;
  description: string;
  duration: number;
  candidatesCount: number;
  averageScore?: number;
  createdAt: Date;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onView: (id: string) => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ 
  id,
  title,
  description,
  duration,
  candidatesCount,
  averageScore,
  createdAt,
  onEdit,
  onDelete,
  onDuplicate,
  onView
}) => {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {description}
            </p>
          </div>
          <Badge variant="info">
            {createdAt.toLocaleDateString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 mr-1" />
            <span>{duration} min</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4 mr-1" />
            <span>{candidatesCount} candidates</span>
          </div>
          {averageScore && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Target className="w-4 h-4 mr-1" />
              <span>{averageScore}% avg. score</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            icon={Eye}
            onClick={() => onView(id)}
          >
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            icon={Edit}
            onClick={() => onEdit(id)}
          >
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            icon={Copy}
            onClick={() => onDuplicate(id)}
          >
            Duplicate
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            icon={Trash2}
            onClick={() => onDelete(id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};