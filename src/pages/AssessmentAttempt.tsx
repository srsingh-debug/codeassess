import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { mockAssessments } from '../data/mockData';
import { 
  Clock, 
  Play, 
  Square,
  AlertTriangle, 
  CheckCircle,
  Code,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';

export const AssessmentAttempt: React.FC = () => {
  const navigate = useNavigate();
  // Using first assessment as example
  const assessment = mockAssessments[0];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(assessment.duration * 60); // in seconds
  const [selectedLanguage, setSelectedLanguage] = useState(assessment.allowedLanguages[0]);
  const [code, setCode] = useState(assessment.questions[0]?.starterCode || '');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);

  const currentQuestion = assessment.questions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchWarnings(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleRunCode = () => {
    setIsRunning(true);
    
    // Simulate code execution
    setTimeout(() => {
      setTestResults([
        { testCase: 1, passed: true, output: 'Expected output', executionTime: '0.02s' },
        { testCase: 2, passed: false, output: 'Unexpected output', executionTime: '0.01s' }
      ]);
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmit = () => {
    // Navigate to results page
    navigate('/candidate/results');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center" padding="lg">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{assessment.title}</h1>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">{assessment.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{assessment.duration} minutes</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{assessment.questions.length} questions</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Code className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{assessment.allowedLanguages.join(', ')}</span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-left">
                  <h4 className="font-medium text-yellow-800 mb-2">Important Instructions</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• You cannot pause the timer once started</li>
                    <li>• Switching tabs or windows will be detected and logged</li>
                    <li>• Your code will be automatically saved as you type</li>
                    <li>• Test your code thoroughly before submitting</li>
                    <li>• The assessment will auto-submit when time expires</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button size="lg" icon={Play} onClick={() => setShowInstructions(false)}>
              Start Assessment
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Timer */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="font-semibold text-gray-900">{assessment.title}</h1>
              <Badge variant="info">
                Question {currentQuestionIndex + 1} of {assessment.questions.length}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {tabSwitchWarnings > 0 && (
                <Badge variant="warning">
                  Tab switches: {tabSwitchWarnings}
                </Badge>
              )}
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm">{formatTime(timeRemaining)}</span>
              </div>
              <Button variant="danger" size="sm" onClick={handleSubmit}>
                Submit Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
          {/* Question Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">{currentQuestion.title}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{currentQuestion.description}</p>
                </div>
                
                {/* Test Cases */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Test Cases</h4>
                  <div className="space-y-3">
                    {currentQuestion.testCases.filter(tc => !tc.isHidden).map((testCase, index) => (
                      <div key={testCase.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm">
                          <div className="text-gray-600 mb-1">Input:</div>
                          <div className="font-mono text-xs bg-white p-2 rounded border">{testCase.input}</div>
                          <div className="text-gray-600 mb-1 mt-2">Expected Output:</div>
                          <div className="font-mono text-xs bg-white p-2 rounded border">{testCase.expectedOutput}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              >
                Previous
              </Button>
              <Button 
                variant="outline"
                disabled={currentQuestionIndex === assessment.questions.length - 1}
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Code Editor Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Code Editor</h3>
                  <Select
                    options={assessment.allowedLanguages.map(lang => ({ value: lang, label: lang }))}
                    value={selectedLanguage}
                    onChange={setSelectedLanguage}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={16}
                  className="font-mono text-sm"
                  placeholder="Write your code here..."
                />
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-xs text-gray-500">
                    Auto-save enabled • Last saved: just now
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      icon={Play}
                      loading={isRunning}
                      onClick={handleRunCode}
                    >
                      Run Code
                    </Button>
                    <Button variant="outline" size="sm">
                      Test Cases
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            {testResults.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Test Results</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {result.passed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Square className="w-5 h-5 text-red-500" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Test Case {result.testCase}
                            </div>
                            <div className="text-xs text-gray-500">
                              {result.executionTime} • {result.output}
                            </div>
                          </div>
                        </div>
                        <Badge variant={result.passed ? 'success' : 'danger'}>
                          {result.passed ? 'Passed' : 'Failed'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};