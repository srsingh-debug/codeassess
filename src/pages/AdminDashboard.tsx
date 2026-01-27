import React from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { mockAnalytics, mockAssessments, mockAttempts } from '../data/mockData';
import { 
  Users, 
  FileText, 
  BarChart3, 
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const stats = [
    {
      title: 'Total Candidates',
      value: mockAnalytics.totalCandidates.toString(),
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Average Score',
      value: `${mockAnalytics.averageScore}%`,
      icon: BarChart3,
      color: 'green'
    },
    {
      title: 'Completion Rate',
      value: `${mockAnalytics.completionRate}%`,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Active Tests',
      value: mockAssessments.filter(a => a.status === 'published').length.toString(),
      icon: FileText,
      color: 'orange'
    }
  ];

  const recentAttempts = mockAttempts.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-blue-100">
          Monitor assessments, manage candidates, and analyze performance metrics.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button icon={Plus} onClick={() => onNavigate('assessment-creation')}>
          Create Assessment
        </Button>
        <Button variant="outline" onClick={() => onNavigate('manage-candidates')}>
          Manage Candidates
        </Button>
        <Button variant="outline">
          Generate with AI
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow" padding="lg">
            <div className={`bg-${stat.color}-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.title}</div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Score Distribution</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(mockAnalytics.scoreDistribution).map(([range, count]) => (
                <div key={range} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${
                      range === 'excellent' ? 'bg-green-500' :
                      range === 'good' ? 'bg-blue-500' :
                      range === 'average' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm text-gray-700 capitalize">
                      {range} {
                        range === 'excellent' ? '(90-100%)' :
                        range === 'good' ? '(80-89%)' :
                        range === 'average' ? '(70-79%)' : '(<70%)'
                      }
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Attempts */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Attempts</h3>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-end justify-between space-x-1">
              {mockAnalytics.monthlyAttempts.map((attempts, index) => {
                const height = (attempts / Math.max(...mockAnalytics.monthlyAttempts)) * 100;
                return (
                  <div
                    key={index}
                    className="bg-blue-500 rounded-t hover:bg-blue-600 transition-colors flex-1"
                    style={{ height: `${height}%` }}
                    title={`Month ${index + 1}: ${attempts} attempts`}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assessments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Available Assessments</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableAssessments.slice(0, 3).map((assessment) => {
              const status = getAssessmentStatus(assessment.id);
              const attempt = userAttempts.find(a => a.assessmentId === assessment.id);
              
              return (
                <div 
                  key={assessment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{assessment.title}</h4>
                        {getStatusBadge(status)}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{assessment.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{assessment.duration} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{assessment.questions.length} questions</span>
                        </div>
                      </div>

                      {attempt?.score && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-600">Last Score: </span>
                          <span className="font-medium text-gray-900">{attempt.score}%</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2">
                      {status === 'not_started' && (
                        <Button 
                          size="sm" 
                          icon={Play}
                          onClick={() => onNavigate('assessment-attempt')}
                        >
                          Start
                        </Button>
                      )}
                      {status === 'in_progress' && (
                        <Button 
                          variant="warning" 
                          size="sm" 
                          icon={AlertCircle}
                          onClick={() => onNavigate('assessment-attempt')}
                        >
                          Continue
                        </Button>
                      )}
                      {(status === 'completed' || status === 'scored') && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onNavigate('results')}
                        >
                          View Results
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAttempts.map((attempt) => {
              const assessment = availableAssessments.find(a => a.id === attempt.assessmentId);
              if (!assessment) return null;
              
              return (
                <div key={attempt.id} className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-gray-900">{assessment.title}</div>
                    <div className="text-sm text-gray-600">
                      {attempt.startedAt.toLocaleDateString()} • {Math.round(attempt.timeSpent / 60)} minutes
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(attempt.status)}
                    {attempt.score && (
                      <div className="text-sm text-gray-600 mt-1">{attempt.score}%</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};