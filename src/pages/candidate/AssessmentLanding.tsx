import React from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { 
  Clock, 
  FileText, 
  Code, 
  Shield, 
  Play,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface AssessmentLandingProps {
  onStartAssessment: () => void;
  assessmentData: {
    title: string;
    description: string;
    duration: number;
    questionCount: number;
    allowedLanguages: string[];
    rules: string[];
  };
}

export const AssessmentLanding: React.FC<AssessmentLandingProps> = ({ 
  onStartAssessment, 
  assessmentData 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header with theme toggle */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                CodeAssess
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome section */}
        <div className="text-center mb-12">
          <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Your Assessment
          </h1>
          <h2 className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-4">
            {assessmentData.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {assessmentData.description}
          </p>
        </div>

        {/* Assessment overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {assessmentData.duration} min
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total Duration
              </div>
            </CardContent>
          </Card>

          <Card className="text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {assessmentData.questionCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Questions
              </div>
            </CardContent>
          </Card>

          <Card className="text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {assessmentData.allowedLanguages.join(', ')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Languages
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rules and guidelines */}
        <Card className="mb-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Assessment Guidelines
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessmentData.rules.map((rule, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{rule}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-12">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Important Notice
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Once started, the timer cannot be paused</li>
                <li>• Tab switching and copy-paste activities will be monitored</li>
                <li>• Your progress is automatically saved</li>
                <li>• Ensure stable internet connection throughout the assessment</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Start button */}
        <div className="text-center">
          <Button 
            size="lg" 
            icon={Play}
            onClick={onStartAssessment}
            className="px-12 py-4 text-lg font-semibold"
          >
            Start Assessment
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            By clicking "Start Assessment", you agree to follow all guidelines and rules.
          </p>
        </div>
      </main>
    </div>
  );
};