import React from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
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
  Code,
  Eye,
  ArrowLeft
} from 'lucide-react';

interface Question {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  timeTaken: number;
  passed: boolean;
}

interface CandidateResultsPageProps {
  onClose: () => void;
  onRetake?: () => void;
  resultsData: {
    assessmentTitle: string;
    overallScore: number;
    totalQuestions: number;
    questionsAnswered: number;
    timeSpent: number;
    totalDuration: number;
    passed: boolean;
    questions: Question[];
    strengths: string[];
    improvements: string[];
  };
}

export const CandidateResultsPage: React.FC<CandidateResultsPageProps> = ({
  onClose,
  onRetake,
  resultsData
}) => {
  const timeSpentMinutes = Math.round(resultsData.timeSpent / 60);
  const efficiency = Math.round((timeSpentMinutes / resultsData.totalDuration) * 100);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'hard': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const handleDownloadReport = () => {
    const reportData = {
      assessment: resultsData.assessmentTitle,
      score: resultsData.overallScore,
      passed: resultsData.passed,
      questionsAnswered: resultsData.questionsAnswered,
      totalQuestions: resultsData.totalQuestions,
      timeSpent: `${timeSpentMinutes} minutes`,
      efficiency: `${efficiency}%`,
      questionResults: resultsData.questions.map(q => ({
        title: q.title,
        difficulty: q.difficulty,
        score: q.score,
        timeTaken: `${q.timeTaken} minutes`,
        passed: q.passed
      })),
      strengths: resultsData.strengths,
      areasForImprovement: resultsData.improvements,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment-results-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${resultsData.passed ? 'bg-green-600' : 'bg-red-600'}`}>
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                Assessment Results
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="outline" size="sm" icon={ArrowLeft} onClick={onClose}>
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results header */}
        <div className={`rounded-xl p-8 text-white mb-8 ${
          resultsData.passed 
            ? 'bg-gradient-to-r from-green-500 to-green-600' 
            : 'bg-gradient-to-r from-red-500 to-red-600'
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">{resultsData.assessmentTitle}</h1>
              <p className="text-lg opacity-90">
                {resultsData.passed ? 'Congratulations! You passed the assessment.' : 'Assessment completed. Keep practicing!'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{resultsData.overallScore}%</div>
              <Badge 
                variant={resultsData.passed ? 'success' : 'danger'} 
                className="bg-white/20 text-white border-white/30 text-lg px-4 py-2"
              >
                {resultsData.passed ? 'PASSED' : 'FAILED'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Performance metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {resultsData.overallScore}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Overall Score</div>
            </CardContent>
          </Card>

          <Card className="text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {timeSpentMinutes}m
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Time Spent</div>
            </CardContent>
          </Card>

          <Card className="text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {efficiency}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Time Efficiency</div>
            </CardContent>
          </Card>

          <Card className="text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="bg-orange-100 dark:bg-orange-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {resultsData.questionsAnswered}/{resultsData.totalQuestions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Questions Answered</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Question breakdown */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Question Breakdown
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resultsData.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded">
                          Q{index + 1}
                        </span>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {question.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {question.score}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {question.timeTaken} min
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full ${question.passed ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${question.score}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">0%</span>
                      <Badge variant={question.passed ? 'success' : 'danger'} size="sm">
                        {question.passed ? 'Passed' : 'Failed'}
                      </Badge>
                      <span className="text-gray-500 dark:text-gray-400">100%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance analysis */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Performance Analysis
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Strengths
                  </h3>
                  <div className="space-y-2">
                    {resultsData.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <XCircle className="w-5 h-5 mr-2 text-red-500" />
                    Areas for Improvement
                  </h3>
                  <div className="space-y-2">
                    {resultsData.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button icon={Download} variant="outline" onClick={handleDownloadReport}>
            Download Report
          </Button>
          <Button icon={Eye} variant="outline">
            Review Answers
          </Button>
          {onRetake && (
            <Button icon={RotateCcw} variant="outline" onClick={onRetake}>
              Retake Assessment
            </Button>
          )}
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </main>
    </div>
  );
};