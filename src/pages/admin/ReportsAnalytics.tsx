import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { 
  LineChart, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  FileText, 
  Clock, 
  Target,
  Download,
  Filter,
  Calendar,
  ArrowLeft
} from 'lucide-react';

import React from 'react';
import { AnalyticsView } from '../../views/admin/AnalyticsView';

interface ReportsAnalyticsProps {
  onNavigate: (view: string) => void;
}

export const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({ onNavigate }) => {
  return <AnalyticsView onNavigate={onNavigate} />;
};
