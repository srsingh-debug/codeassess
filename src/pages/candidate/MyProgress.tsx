import React from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { 
  TrendingUp, 
  Trophy, 
  Clock, 
  Target,
  Calendar,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react';

// Mock progress data
const mockProgressData = {
  overallStats: {
    totalAssessments: 8,
    completedAssessments: 6,
    averageScore: 82.5,
    totalTimeSpent: 420, // minutes
    rank: 15,
    totalCandidates: 156
  },
  recentAssessments: [
    {
      id: '1',
      title: 'Frontend React Assessment',
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      score: 85,
      timeSpent: 75,
      status: 'completed',
      difficulty: 'medium'
    },
    {
      id: '2',
      title: 'JavaScript Fundamentals',
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      score: 92,
      timeSpent: 45,
      status: 'completed',
      difficulty: 'easy'
    },
    {
      id: '3',
      title: 'Algorithm Challenge',
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      score: 78,
      timeSpent: 90,
      status: 'completed',
      difficulty: 'hard'
    }
  ],
  skillProgress: [
    { skill: 'JavaScript', level: 85, improvement: 12 },
    { skill: 'React', level: 78, improvement: 8 },
    { skill: 'Algorithms', level: 72, improvement: 15 },
    { skill: 'CSS', level: 88, improvement: 5 },
    { skill: 'Node.js', level: 65, improvement: 20 }
  ],
  monthlyProgress: [
    { month: 'Jan', assessments: 2, avgScore: 75 },
    { month: 'Feb', assessments: 1, avgScore: 82 },
    { month: 'Mar', assessments: 3, avgScore: 85 },
    { month: 'Apr', assessments: 2, avgScore: 88 }
  ]
};

export const MyProgress: React.FC = () => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Progress</h1>
        <p className="text-gray-600">
          Track your assessment performance and skill development over time.
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center" padding="lg">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {mockProgressData.overallStats.completedAssessments}/{mockProgressData.overallStats.totalAssessments}
          </div>
          <div className="text-sm text-gray-600">Assessments Completed</div>
        </Card>

        <Card className="text-center" padding="lg">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {mockProgressData.overallStats.averageScore}%
          </div>
          <div className="text-sm text-gray-600">Average Score</div>
        </Card>

        <Card className="text-center" padding="lg">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {Math.round(mockProgressData.overallStats.totalTimeSpent / 60)}h
          </div>
          <div className="text-sm text-gray-600">Total Time Spent</div>
        </Card>

        <Card className="text-center" padding="lg">
          <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            #{mockProgressData.overallStats.rank}
          </div>
          <div className="text-sm text-gray-600">
            of {mockProgressData.overallStats.totalCandidates} candidates
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Assessments */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Recent Assessments</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProgressData.recentAssessments.map((assessment) => (
                <div key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{assessment.title}</h3>
                    <Badge variant={assessment.score >= 80 ? 'success' : 'warning'}>
                      {assessment.score}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{assessment.completedAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{assessment.timeSpent}m</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(assessment.difficulty)}`}>
                      {assessment.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skill Progress */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Skill Progress</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProgressData.skillProgress.map((skill, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{skill.level}%</span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600">+{skill.improvement}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Progress Chart */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Monthly Progress</h2>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-4">
            {mockProgressData.monthlyProgress.map((data, index) => {
              const maxScore = Math.max(...mockProgressData.monthlyProgress.map(d => d.avgScore));
              const height = (data.avgScore / maxScore) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center space-y-2 mb-4">
                    <div className="text-xs text-gray-600">{data.avgScore}%</div>
                    <div
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                      style={{ height: `${height}%` }}
                      title={`${data.month}: ${data.assessments} assessments, ${data.avgScore}% avg score`}
                    />
                    <div className="text-xs text-gray-500">{data.assessments} tests</div>
                  </div>
                  <div className="text-sm font-medium text-gray-700">{data.month}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Recent Achievements</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="font-medium text-gray-900">High Scorer</div>
                <div className="text-sm text-gray-600">Scored 90%+ on 3 assessments</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Consistent Performer</div>
                <div className="text-sm text-gray-600">Maintained 80%+ average</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <div className="font-medium text-gray-900">Fast Learner</div>
                <div className="text-sm text-gray-600">20% improvement in Node.js</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};