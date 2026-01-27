import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { mockAttempts, mockAssessments } from '../data/mockData';
import { 
  Trophy, 
  Clock, 
  Target, 
  Download, 
  RotateCcw,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  Calendar
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  // Using the completed attempt as example
  const attempt = mockAttempts[0];
  const assessment = mockAssessments.find(a => a.id === attempt.assessmentId);
  
  if (!assessment) return null;

  const score = attempt.score || 0;
  const isPassed = score >= 70;
  const timeSpentMinutes = Math.round(attempt.timeSpent / 60);
  const efficiency = Math.round((timeSpentMinutes / assessment.duration) * 100);

  // Mock question results
  const questionResults = [
    { questionTitle: 'Array Sum', score: 100, timeTaken: 8, difficulty: 'easy' },
    { questionTitle: 'Binary Search', score: 70, timeTaken: 25, difficulty: 'medium' }
  ];

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className={`rounded-xl p-6 text-white ${isPassed ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Assessment Results</h1>
            <p className="text-green-100">{assessment.title}</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{score}%</div>
            <Badge variant={isPassed ? 'success' : 'danger'} className="bg-white/20 text-white border-white/30">
              {isPassed ? 'PASSED' : 'FAILED'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center" padding="lg">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{score}%</div>
          <div className="text-sm text-gray-600">Overall Score</div>
        </Card>

        <Card className="text-center" padding="lg">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{timeSpentMinutes}m</div>
          <div className="text-sm text-gray-600">Time Spent</div>
        </Card>

        <Card className="text-center" padding="lg">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{efficiency}%</div>
          <div className="text-sm text-gray-600">Time Efficiency</div>
        </Card>
      </div>

      {/* Question Breakdown */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Question Breakdown</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questionResults.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                      Q{index + 1}
                    </span>
                    <h4 className="font-medium text-gray-900">{result.questionTitle}</h4>
                    <Badge variant={
                      result.difficulty === 'easy' ? 'success' :
                      result.difficulty === 'medium' ? 'warning' : 'danger'
                    }>
                      {result.difficulty}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{result.score}%</div>
                    <div className="text-xs text-gray-500">{result.timeTaken} min</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${result.score >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Analysis */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Performance Analysis</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Strengths</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Strong algorithmic thinking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Clean code structure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Good time management</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Areas for Improvement</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-700">Error handling could be improved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-700">Consider edge cases more thoroughly</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button icon={Download} variant="outline">
          Download Report
        </Button>
        <Button icon={RotateCcw} variant="outline">
          Retake Assessment
        </Button>
        <Button onClick={() => navigate('/candidate/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};