import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { StatCard } from '../../components/admin/StatCard';
import { ActivityItem } from '../../components/admin/ActivityItem';
import { 
  Briefcase,
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  FileText,
  BarChart3,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

export const HiringManagerDashboardView: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - will be replaced with API calls
  const stats = {
    pendingApprovals: 5,
    activePositions: 8,
    candidatesInReview: 12,
    offersPending: 3,
    recentHires: 2,
    rejectionRate: 15
  };

  const pendingApprovals = [
    { 
      id: '1', 
      job: 'Senior Developer', 
      candidate: 'John Doe', 
      status: 'pending',
      submittedBy: 'Recruiter: Sarah',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    { 
      id: '2', 
      job: 'Frontend Engineer', 
      candidate: 'Jane Smith', 
      status: 'pending',
      submittedBy: 'Recruiter: Mike',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 6)
    },
    { 
      id: '3', 
      job: 'Backend Developer', 
      candidate: 'Mike Johnson', 
      status: 'pending',
      submittedBy: 'Recruiter: Sarah',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
    },
  ];

  const recentDecisions = [
    { id: '1', type: 'approval', message: 'Approved candidate for Senior Developer', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), candidate: 'John Doe' },
    { id: '2', type: 'rejection', message: 'Rejected candidate for Frontend Engineer', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), candidate: 'Jane Smith' },
    { id: '3', type: 'approval', message: 'Approved candidate for Backend Developer', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), candidate: 'Mike Johnson' },
  ];

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hiring Manager Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Review candidates and make hiring decisions</p>
        </div>
        <Button 
          variant="outline"
          onClick={() => navigate('/hiring-manager/job-approvals')}
        >
          View All Approvals
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={Clock}
          trend={{ value: 2, isPositive: false }}
          description="Require your review"
          highlight={stats.pendingApprovals > 0}
        />
        <StatCard
          title="Active Positions"
          value={stats.activePositions}
          icon={Briefcase}
          trend={{ value: 1, isPositive: true }}
          description="Open roles"
        />
        <StatCard
          title="Candidates in Review"
          value={stats.candidatesInReview}
          icon={UserCheck}
          trend={{ value: 3, isPositive: true }}
          description="Awaiting decision"
        />
        <StatCard
          title="Offers Pending"
          value={stats.offersPending}
          icon={CheckCircle}
          trend={{ value: 1, isPositive: true }}
          description="Awaiting response"
        />
        <StatCard
          title="Recent Hires"
          value={stats.recentHires}
          icon={TrendingUp}
          trend={{ value: 2, isPositive: true }}
          description="Last 30 days"
        />
        <StatCard
          title="Rejection Rate"
          value={`${stats.rejectionRate}%`}
          icon={BarChart3}
          trend={{ value: -2, isPositive: true }}
          description="Lower is better"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pending Approvals</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/hiring-manager/job-approvals')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{approval.job}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Candidate: {approval.candidate}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{approval.submittedBy}</span>
                    <span>{formatTimeAgo(approval.submittedAt)}</span>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate(`/hiring-manager/decisions/${approval.id}`)}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Decisions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Decisions</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/hiring-manager/decisions')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDecisions.map((decision) => (
                <div key={decision.id} className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    decision.type === 'approval' 
                      ? 'bg-green-100 dark:bg-green-900' 
                      : 'bg-red-100 dark:bg-red-900'
                  }`}>
                    {decision.type === 'approval' ? (
                      <ThumbsUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <ThumbsDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{decision.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatTimeAgo(decision.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              onClick={() => navigate('/hiring-manager/job-approvals')}
            >
              <FileText className="w-6 h-6 mb-2" />
              <span>Job Approvals</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              onClick={() => navigate('/hiring-manager/decisions')}
            >
              <UserCheck className="w-6 h-6 mb-2" />
              <span>Candidate Decisions</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              onClick={() => navigate('/hiring-manager/analytics')}
            >
              <BarChart3 className="w-6 h-6 mb-2" />
              <span>Team Analytics</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              onClick={() => navigate('/profile')}
            >
              <Calendar className="w-6 h-6 mb-2" />
              <span>My Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};



