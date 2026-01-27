import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { 
  Users, 
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Filter,
  Download,
  Upload,
  Send,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';

interface CandidateManagementProps {
  onNavigate: (view: string) => void;
}

export const CandidateManagement: React.FC<CandidateManagementProps> = ({ onNavigate }) => {
  return <CandidateManagementView onNavigate={onNavigate} />;
};