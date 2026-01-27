import { useState, useEffect } from 'react';

interface DashboardStats {
  totalAssessments: number;
  activeCandidates: number;
  ongoingTests: number;
  completedToday: number;
  averageScore: number;
  completionRate: number;
  // Additional stats for today
  invitationsToday: number;
  testsStartedToday: number;
  pendingAssessments: number;
}

interface RecentActivity {
  id: string;
  type: string;
  candidate: string;
  assessment: string;
  timestamp: Date;
  score?: number;
}

interface UpcomingAssessment {
  id: string;
  name: string;
  scheduledFor: Date;
  candidatesInvited: number;
  candidatesCompleted: number;
}

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalAssessments: 0,
    activeCandidates: 0,
    ongoingTests: 0,
    completedToday: 0,
    averageScore: 0,
    completionRate: 0,
    invitationsToday: 0,
    testsStartedToday: 0,
    pendingAssessments: 0
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [upcomingAssessments, setUpcomingAssessments] = useState<UpcomingAssessment[]>([]);

  // Mock data initialization
  useEffect(() => {
    // In a real app, this would come from an API
    setStats({
      totalAssessments: 24,
      activeCandidates: 156,
      ongoingTests: 8,
      completedToday: 12,
      averageScore: 78.5,
      completionRate: 87.3,
      invitationsToday: 5,
      testsStartedToday: 7,
      pendingAssessments: 3
    });

    setRecentActivity([
      {
        id: '1',
        type: 'assessment_completed',
        candidate: 'John Doe',
        assessment: 'Frontend Developer Test',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        score: 85
      },
      {
        id: '2',
        type: 'assessment_started',
        candidate: 'Jane Smith',
        assessment: 'Backend Developer Assessment',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
      {
        id: '3',
        type: 'candidate_invited',
        candidate: 'Mike Johnson',
        assessment: 'Full Stack Challenge',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      }
    ]);

    setUpcomingAssessments([
      {
        id: '1',
        name: 'Senior React Developer',
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        candidatesInvited: 15,
        candidatesCompleted: 0
      },
      {
        id: '2',
        name: 'Python Backend Assessment',
        scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        candidatesInvited: 8,
        candidatesCompleted: 0
      }
    ]);
  }, []);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getActivityIcon = (type: string) => {
    return type;
  };

  const getActivityMessage = (activity: RecentActivity) => {
    switch (activity.type) {
      case 'assessment_completed':
        return `${activity.candidate} completed "${activity.assessment}" with ${activity.score}% score`;
      case 'assessment_started':
        return `${activity.candidate} started "${activity.assessment}"`;
      case 'candidate_invited':
        return `${activity.candidate} was invited to "${activity.assessment}"`;
      default:
        return 'Unknown activity';
    }
  };

  return {
    stats,
    recentActivity,
    upcomingAssessments,
    formatTimeAgo,
    getActivityIcon,
    getActivityMessage
  };
};