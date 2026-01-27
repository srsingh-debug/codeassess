import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { 
  Clock, 
  Play, 
  Save,
  CheckCircle,
  Circle,
  AlertTriangle,
  Code,
  FileText,
  Eye,
  EyeOff,
  Menu,
  X
} from 'lucide-react';

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sampleInput: string;
  sampleOutput: string;
  starterCode: string;
}

interface AssessmentInProgressProps {
  onSubmitAssessment: () => void;
  questions: Question[];
  duration: number;
  allowedLanguages: string[];
}

export const AssessmentInProgress: React.FC<AssessmentInProgressProps> = ({
  onSubmitAssessment,
  questions,
  duration,
  allowedLanguages
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // in seconds
  const [selectedLanguage, setSelectedLanguage] = useState(allowedLanguages[0]);
  const [code, setCode] = useState(questions[0]?.starterCode || '');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cheatingWarnings, setCheatingWarnings] = useState<string[]>([]);
  const [showTestCases, setShowTestCases] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          onSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onSubmitAssessment]);

  // Auto-save effect
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (code !== (answers[currentQuestion?.id] || '')) {
        handleAutoSave();
      }
    }, 2000);

    return () => clearTimeout(autoSave);
  }, [code, currentQuestion?.id]);

  // Cheating detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const warning = `Tab switched at ${new Date().toLocaleTimeString()}`;
        setCheatingWarnings(prev => [...prev, warning]);
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      const warning = `Copy detected at ${new Date().toLocaleTimeString()}`;
      setCheatingWarnings(prev => [...prev, warning]);
    };

    const handlePaste = (e: ClipboardEvent) => {
      const warning = `Paste detected at ${new Date().toLocaleTimeString()}`;
      setCheatingWarnings(prev => [...prev, warning]);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
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

  const handleAutoSave = async () => {
    setIsSaving(true);
    // Simulate auto-save
    await new Promise(resolve => setTimeout(resolve, 500));
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: code }));
    setIsSaving(false);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    // Simulate code execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTestResults([
      { testCase: 1, passed: true, output: 'Expected output', executionTime: '0.02s' },
      { testCase: 2, passed: false, output: 'Unexpected output', executionTime: '0.01s' }
    ]);
    setIsRunning(false);
  };

  const handleQuestionChange = (index: number) => {
    // Save current answer
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: code }));
    
    // Load new question
    setCurrentQuestionIndex(index);
    setCode(answers[questions[index].id] || questions[index].starterCode || '');
    setTestResults([]);
    setSidebarOpen(false);
  };

  const getQuestionStatus = (questionId: string) => {
    return answers[questionId] ? 'answered' : 'unanswered';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'hard': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header with timer */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  Assessment
                </span>
              </div>
              
              <Badge variant="info" className="hidden sm:inline-flex">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {cheatingWarnings.length > 0 && (
                <Badge variant="warning" className="hidden sm:inline-flex">
                  {cheatingWarnings.length} warning(s)
                </Badge>
              )}
              
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                timeRemaining < 300 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm font-medium">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              
              <ThemeToggle />
              
              <Button 
                variant="danger" 
                size="sm" 
                onClick={onSubmitAssessment}
                className="hidden sm:inline-flex"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Question list */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full overflow-y-auto p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Questions
            </h3>
            <div className="space-y-3">
              {questions.map((question, index) => {
                const status = getQuestionStatus(question.id);
                const isActive = index === currentQuestionIndex;
                
                return (
                  <button
                    key={question.id}
                    onClick={() => handleQuestionChange(index)}
                    className={`
                      w-full text-left p-4 rounded-lg border transition-all duration-200
                      ${isActive 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Q{index + 1}
                      </span>
                      <div className="flex items-center space-x-2">
                        {status === 'answered' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {question.title}
                    </p>
                  </button>
                );
              })}
            </div>
            
            {/* Progress summary */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Progress</h4>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <div>Answered: {Object.keys(answers).length}/{questions.length}</div>
                <div>Time left: {formatTime(timeRemaining)}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Question panel */}
          <div className="lg:w-1/2 p-6 overflow-y-auto">
            <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentQuestion.title}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {currentQuestion.description}
                  </p>
                </div>
                
                {/* Sample test cases */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">Sample Test Case</h4>
                    <button
                      onClick={() => setShowTestCases(!showTestCases)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm flex items-center space-x-1"
                    >
                      {showTestCases ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{showTestCases ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  
                  {showTestCases && (
                    <div className="space-y-3">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="text-sm">
                          <div className="text-gray-600 dark:text-gray-300 mb-1">Input:</div>
                          <div className="font-mono text-xs bg-white dark:bg-gray-800 p-2 rounded border">
                            {currentQuestion.sampleInput}
                          </div>
                          <div className="text-gray-600 dark:text-gray-300 mb-1 mt-2">Expected Output:</div>
                          <div className="font-mono text-xs bg-white dark:bg-gray-800 p-2 rounded border">
                            {currentQuestion.sampleOutput}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code editor panel */}
          <div className="lg:w-1/2 p-6 overflow-y-auto">
            <div className="space-y-4 h-full flex flex-col">
              <Card className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Code Editor</h3>
                    <Select
                      options={allowedLanguages.map(lang => ({ value: lang, label: lang }))}
                      value={selectedLanguage}
                      onChange={setSelectedLanguage}
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    rows={20}
                    className="font-mono text-sm flex-1 resize-none bg-gray-50 dark:bg-gray-900"
                    placeholder="Write your code here..."
                  />
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <Save className="w-4 h-4" />
                      <span>
                        {isSaving ? 'Saving...' : 'Auto-saved'}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={Play}
                        loading={isRunning}
                        onClick={handleRunCode}
                      >
                        Run Tests
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Test results */}
              {testResults.length > 0 && (
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Test Results</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {testResults.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {result.passed ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <X className="w-5 h-5 text-red-500" />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                Test Case {result.testCase}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
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

              {/* Cheating warnings */}
              {cheatingWarnings.length > 0 && (
                <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                  <CardHeader>
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Security Warnings
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {cheatingWarnings.slice(-3).map((warning, index) => (
                        <div key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                          {warning}
                        </div>
                      ))}
                      {cheatingWarnings.length > 3 && (
                        <div className="text-xs text-yellow-600 dark:text-yellow-400">
                          +{cheatingWarnings.length - 3} more warnings
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};