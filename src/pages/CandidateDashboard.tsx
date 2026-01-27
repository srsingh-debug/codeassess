import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { mockAssessments, mockAttempts } from '../data/mockData';
import { 
  Clock, 
  Play, 
  CheckCircle, 
  AlertCircle,
  Trophy,
  Calendar,
  Target,
  Code
} from 'lucide-react';

export const CandidateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const availableAssessments = mockAssessments.filter(a => a.status === 'published');
  const userAttempts = mockAttempts;
  
  const getAssessmentStatus = (assessmentId: string) => {
    const attempt = userAttempts.find(a => a.assessmentId === assessmentId);
    if (!attempt) return 'not_started';
    return attempt.status;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'scored':
        return <Badge variant="info">Scored</Badge>;
      default:
        return <Badge variant="default">Available</Badge>;
    }
  };

  const stats = {
    completed: userAttempts.filter(a => a.status === 'completed').length,
    inProgress: userAttempts.filter(a => a.status === 'in_progress').length,
    averageScore: userAttempts.filter(a => a.score).reduce((acc, a) => acc + (a.score || 0), 0) / userAttempts.filter(a => a.score).length || 0
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-blue-100">
          Ready to showcase your coding skills? Take assessments and track your progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center" padding="lg">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.completed}</div>
          <div className="text-sm text-gray-600">Tests Completed</div>
        </Card>

        <Card className="text-center" padding="lg">
          <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.inProgress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </Card>

        <Card className="text-center" padding="lg">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{Math.round(stats.averageScore)}%</div>
          <div className="text-sm text-gray-600">Average Score</div>
        </Card>
      </div>

      {/* Available Assessments */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Available Assessments</h2>
          <p className="text-gray-600">Choose from available coding assessments to test your skills.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableAssessments.map((assessment) => {
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
                        <h3 className="font-semibold text-gray-900">{assessment.title}</h3>
                        {getStatusBadge(status)}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{assessment.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{assessment.duration} minutes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>{assessment.questions.length} questions</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Code className="w-4 h-4" />
                          <span>{assessment.allowedLanguages.join(', ')}</span>
                        </div>
                      </div>

                      {attempt?.score && (
                        <div className="mt-3 flex items-center space-x-2">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Score: {attempt.score}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2">
                      {status === 'not_started' && (
                        <Button 
                          size="sm" 
                          icon={Play}
                          onClick={() => navigate('/candidate/assessment-attempt')}
                        >
                          Start Test
                        </Button>
                      )}
                      {status === 'in_progress' && (
                        <Button 
                          variant="warning" 
                          size="sm" 
                          icon={AlertCircle}
                          onClick={() => navigate('/candidate/assessment-attempt')}
                        >
                          Continue
                        </Button>
                      )}
                      {(status === 'completed' || status === 'scored') && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate('/candidate/results')}
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
      {userAttempts.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userAttempts.slice(0, 3).map((attempt) => {
                const assessment = availableAssessments.find(a => a.id === attempt.assessmentId);
                if (!assessment) return null;
                
                return (
                  <div key={attempt.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <div className="font-medium text-gray-900">{assessment.title}</div>
                      <div className="text-sm text-gray-600 flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{attempt.startedAt.toLocaleDateString()}</span>
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
      )}
    </div>
  );
};