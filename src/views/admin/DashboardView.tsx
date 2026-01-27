import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { StatCard } from '../../components/admin/StatCard';
import { ActivityItem } from '../../components/admin/ActivityItem';
import { UpcomingAssessmentCard } from '../../components/admin/UpcomingAssessmentCard';
import { useAdminDashboard } from '../../hooks/admin/useAdminDashboard';
import { 
  Plus,
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Target,
  BarChart3,
  Calendar,
  Send,
  Play,
  Hourglass,
  Award,
  Zap,
  AlertCircle,
  TrendingDown,
  Star,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const {
    stats,
    recentActivity,
    upcomingAssessments,
    formatTimeAgo,
    getActivityMessage
  } = useAdminDashboard();

  // Filter today's activity
  const todaysActivity = recentActivity.filter(activity => {
    const today = new Date();
    const activityDate = new Date(activity.timestamp);
    return activityDate.toDateString() === today.toDateString();
  });

  // Mock data for top candidates
  const topCandidates = [
    { id: 1, name: 'Alex Johnson', score: 95, assessment: 'Frontend Developer Test' },
    { id: 2, name: 'Sam Wilson', score: 92, assessment: 'Backend Developer Assessment' },
    { id: 3, name: 'Taylor Brown', score: 89, assessment: 'Full Stack Challenge' },
  ];

  // Mock data for assessment trends
  const assessmentTrends = [
    { name: 'Frontend', completed: 12, inProgress: 3 },
    { name: 'Backend', completed: 8, inProgress: 5 },
    { name: 'Full Stack', completed: 5, inProgress: 2 },
  ];

  // Mock data for popular assessments
  const popularAssessments = [
    { id: 1, name: 'Frontend Developer Test', attempts: 42, completionRate: 85, averageScore: 78, trend: 'up' },
    { id: 2, name: 'Backend Developer Assessment', attempts: 38, completionRate: 72, averageScore: 82, trend: 'up' },
    { id: 3, name: 'Full Stack Challenge', attempts: 29, completionRate: 65, averageScore: 75, trend: 'down' },
    { id: 4, name: 'Python Backend Assessment', attempts: 24, completionRate: 78, averageScore: 85, trend: 'up' },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col h-full">
      {/* Main Content - Optimized for space */}
      <main className="flex-1">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Here's what's happening with your coding assessments today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button 
            icon={Plus} 
            onClick={() => navigate('/admin/assessment-creation')}
            size="md"
          >
            Create Assessment
          </Button>
          <Button 
            variant="outline" 
            icon={Users}
            onClick={() => navigate('/admin/manage-candidates')}
            size="md"
          >
            Manage Candidates
          </Button>
          <Button 
            variant="outline" 
            icon={TrendingUp}
            onClick={() => navigate('/admin/reports-analytics')}
            size="md"
          >
            View Reports
          </Button>
        </div>

        {/* Main Stats Cards - Limited to 4 essential stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Assessments"
            value={stats.totalAssessments}
            icon={FileText}
            iconColor="bg-blue-500"
          />
          <StatCard
            title="Active Candidates"
            value={stats.activeCandidates}
            icon={Users}
            iconColor="bg-green-500"
          />
          <StatCard
            title="Ongoing Tests"
            value={stats.ongoingTests}
            icon={Clock}
            iconColor="bg-yellow-500"
          />
          <StatCard
            title="Completed Today"
            value={stats.completedToday}
            icon={CheckCircle}
            iconColor="bg-purple-500"
          />
        </div>

        {/* Today's Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Today's Summary Card */}
          <Card variant="elevated" hover={true} shadow="lg" className="lg:col-span-1">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Today's Summary
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Send className="w-5 h-5 text-indigo-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Invitations</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{stats.invitationsToday}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Play className="w-5 h-5 text-teal-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Tests Started</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{stats.testsStartedToday}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Hourglass className="w-5 h-5 text-amber-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Pending</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{stats.pendingAssessments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-pink-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Avg. Score</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{stats.averageScore}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Activity Feed */}
          <Card variant="elevated" hover={true} shadow="lg" className="lg:col-span-2">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Today's Activity
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysActivity.length > 0 ? (
                  todaysActivity.map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      type={activity.type}
                      message={getActivityMessage(activity)}
                      timeAgo={formatTimeAgo(activity.timestamp)}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm py-4 text-center">
                    No activity recorded today
                  </p>
                )}
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top Performing Candidates */}
          <Card variant="elevated" hover={true} shadow="lg">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Top Performing Candidates
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCandidates.map((candidate, index) => (
                  <div key={candidate.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                        <span className="text-blue-800 dark:text-blue-200 font-medium text-sm">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{candidate.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{candidate.assessment}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{candidate.score}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assessment Distribution */}
          <Card variant="elevated" hover={true} shadow="lg">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                Assessment Distribution
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessmentTrends.map((assessment, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 dark:text-gray-300">{assessment.name}</span>
                      <span className="text-gray-900 dark:text-white">{assessment.completed + assessment.inProgress}</span>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <div 
                        className="bg-green-500" 
                        style={{ width: `${(assessment.completed / (assessment.completed + assessment.inProgress)) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-yellow-500" 
                        style={{ width: `${(assessment.inProgress / (assessment.completed + assessment.inProgress)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span className="flex items-center mr-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        Completed: {assessment.completed}
                      </span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                        In Progress: {assessment.inProgress}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Assessments */}
          <Card variant="elevated" hover={true} shadow="lg">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Popular Assessments
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularAssessments.map((assessment) => (
                  <div key={assessment.id} className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-150">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{assessment.name}</h3>
                      <div className="flex items-center">
                        {assessment.trend === 'up' ? (
                          <TrendingUpIcon className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Attempts</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{assessment.attempts}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Completion</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{assessment.completionRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Avg. Score</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{assessment.averageScore}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Assessments */}
          <Card variant="elevated" hover={true} shadow="lg">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Assessments
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAssessments.map((assessment) => (
                  <UpcomingAssessmentCard
                    key={assessment.id}
                    name={assessment.name}
                    scheduledDate={assessment.scheduledFor.toLocaleDateString()}
                    candidatesInvited={assessment.candidatesInvited}
                  />
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  Schedule New Assessment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card variant="elevated" hover={true} shadow="lg">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Performance Overview
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 text-cyan-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Completion Rate</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{stats.completionRate}%</span>
                </div>
                <div className="pt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-cyan-600 h-2 rounded-full" 
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Avg. Improvement</span>
                  </div>
                  <span className="font-semibold text-green-600 dark:text-green-400">+12%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Drop-off Rate</span>
                  </div>
                  <span className="font-semibold text-red-600 dark:text-red-400">18%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};