import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { StatCard } from '../../components/admin/StatCard';
import { ActivityItem } from '../../components/admin/ActivityItem';
import { 
  Plus,
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Briefcase,
  UserCheck,
  Calendar,
  Send,
  Play,
  Hourglass,
  AlertCircle,
  BarChart3
} from 'lucide-react';

export const RecruiterDashboardView: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - will be replaced with API calls
  const stats = {
    activeJobs: 12,
    totalApplications: 156,
    pendingAssessments: 8,
    shortlistedCandidates: 24,
    interviewsScheduled: 6,
    offersExtended: 3
  };

  const recentActivity = [
    { id: '1', type: 'application', message: 'New application for Senior Developer', timestamp: new Date(Date.now() - 1000 * 60 * 30), user: 'John Doe' },
    { id: '2', type: 'assessment', message: 'Assessment completed by Jane Smith', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), user: 'Jane Smith' },
    { id: '3', type: 'shortlist', message: 'Candidate shortlisted for interview', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), user: 'Mike Johnson' },
    { id: '4', type: 'interview', message: 'Interview scheduled for tomorrow', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), user: 'Sarah Williams' },
  ];

  const upcomingInterviews = [
    { id: '1', candidate: 'John Doe', job: 'Senior Developer', time: '10:00 AM', date: 'Today' },
    { id: '2', candidate: 'Jane Smith', job: 'Frontend Engineer', time: '2:00 PM', date: 'Today' },
    { id: '3', candidate: 'Mike Johnson', job: 'Backend Developer', time: '11:00 AM', date: 'Tomorrow' },
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recruiter Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage jobs, applications, and candidate pipeline</p>
        </div>
        <Button 
          icon={Plus}
          onClick={() => navigate('/recruiter/job-management')}
        >
          Create Job Posting
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={Briefcase}
          trend={{ value: 12, isPositive: true }}
          description="Currently published"
        />
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={FileText}
          trend={{ value: 8, isPositive: true }}
          description="All time"
        />
        <StatCard
          title="Pending Assessments"
          value={stats.pendingAssessments}
          icon={Hourglass}
          trend={{ value: -2, isPositive: false }}
          description="Awaiting completion"
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlistedCandidates}
          icon={UserCheck}
          trend={{ value: 5, isPositive: true }}
          description="Ready for interview"
        />
        <StatCard
          title="Interviews Scheduled"
          value={stats.interviewsScheduled}
          icon={Calendar}
          trend={{ value: 2, isPositive: true }}
          description="This week"
        />
        <StatCard
          title="Offers Extended"
          value={stats.offersExtended}
          icon={CheckCircle}
          trend={{ value: 1, isPositive: true }}
          description="Pending response"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/recruiter/applications')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  type={activity.type as any}
                  message={activity.message}
                  timestamp={activity.timestamp}
                  user={activity.user}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Interviews</h2>
              <Button variant="outline" size="sm">
                View Calendar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <div key={interview.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{interview.candidate}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{interview.job}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{interview.time}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{interview.date}</p>
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
              onClick={() => navigate('/recruiter/job-management')}
            >
              <Briefcase className="w-6 h-6 mb-2" />
              <span>Manage Jobs</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              onClick={() => navigate('/recruiter/applications')}
            >
              <FileText className="w-6 h-6 mb-2" />
              <span>View Applications</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              onClick={() => navigate('/recruiter/manage-candidates')}
            >
              <Users className="w-6 h-6 mb-2" />
              <span>Candidates</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              onClick={() => navigate('/recruiter/analytics')}
            >
              <BarChart3 className="w-6 h-6 mb-2" />
              <span>Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};



