import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Edit, 
  Trash2, 
  Mail,
  Eye
} from 'lucide-react';
import { Candidate } from '../../hooks/admin/useCandidateManagement';

interface CandidateTableRowProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: (candidateId: string) => void;
  onEdit: (candidate: Candidate) => void;
  onDelete: (candidateId: string) => void;
  onViewResults: (candidateId: string) => void;
  onSendInvite: (candidateId: string) => void;
}

export const CandidateTableRow: React.FC<CandidateTableRowProps> = ({ 
  candidate,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onViewResults,
  onSendInvite
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'invited':
        return <Badge variant="info">Invited</Badge>;
      case 'not_started':
        return <Badge variant="default">Not Started</Badge>;
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  };

  return (
    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-3 py-2 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(candidate.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
        />
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {candidate.name}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {candidate.email}
        </div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {candidate.position}
        </div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        {getStatusBadge(candidate.status)}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
        {candidate.invitedAt.toLocaleDateString()}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
        {candidate.lastActivity ? candidate.lastActivity.toLocaleDateString() : '-'}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {candidate.score ? `${candidate.score}%` : '-'}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            icon={Eye}
            onClick={() => onViewResults(candidate.id)}
          >
            <span className="sr-only">View</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            icon={Edit}
            onClick={() => onEdit(candidate)}
          >
            <span className="sr-only">Edit</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            icon={Mail}
            onClick={() => onSendInvite(candidate.id)}
          >
            <span className="sr-only">Send Invite</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            icon={Trash2}
            onClick={() => onDelete(candidate.id)}
          >
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </td>
    </tr>
  );
};