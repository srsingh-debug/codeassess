import React from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Clock,
  FileText,
  Code,
  X
} from 'lucide-react';

interface ConfirmationPageProps {
  onClose: () => void;
  assessmentData: {
    title: string;
    submissionTime: Date;
    questionsAnswered: number;
    totalQuestions: number;
    timeSpent: number;
    totalDuration: number;
  };
  showInstantResults?: boolean;
  onViewResults?: () => void;
}

export const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
  onClose,
  assessmentData,
  showInstantResults = false,
  onViewResults
}) => {
  const handleDownloadSummary = () => {
    // Simulate download
    const summaryData = {
      assessment: assessmentData.title,
      submittedAt: assessmentData.submissionTime.toISOString(),
      questionsAnswered: assessmentData.questionsAnswered,
      totalQuestions: assessmentData.totalQuestions,
      timeSpent: `${Math.round(assessmentData.timeSpent / 60)} minutes`,
      totalDuration: `${assessmentData.totalDuration} minutes`
    };
    
    const blob = new Blob([JSON.stringify(summaryData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment-summary-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                Assessment Complete
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success message */}
        <div className="text-center mb-12">
          <div className="bg-green-100 dark:bg-green-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Submission Successful!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Thank you for completing the assessment
          </p>
          <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold">
            {assessmentData.title}
          </p>
        </div>

        {/* Submission summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {assessmentData.questionsAnswered}/{assessmentData.totalQuestions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Questions Answered
              </div>
            </CardContent>
          </Card>

          <Card className="text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {Math.round(assessmentData.timeSpent / 60)}m
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Time Spent
              </div>
            </CardContent>
          </Card>

          <Card className="text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {assessmentData.submissionTime.toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Submitted At
              </div>
            </CardContent>
          </Card>

          <Card className="text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="bg-orange-100 dark:bg-orange-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                Results via Email
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Within 24 hours
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next steps */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              What happens next?
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    Assessment Review
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Our team will review your submission and evaluate your code quality, logic, and problem-solving approach.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-100 dark:bg-green-900/30 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 dark:text-green-400 text-sm font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    Results Notification
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    You'll receive detailed results via email within 24 hours, including your score and feedback.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 dark:text-purple-400 text-sm font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    Next Steps
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Based on your performance, you may be contacted for the next stage of the evaluation process.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            icon={Download}
            onClick={handleDownloadSummary}
            className="sm:w-auto"
          >
            Download Summary
          </Button>
          
          {showInstantResults && onViewResults && (
            <Button 
              onClick={onViewResults}
              className="sm:w-auto"
            >
              View Results
            </Button>
          )}
          
          <Button 
            variant="outline"
            onClick={onClose}
            className="sm:w-auto"
          >
            Close
          </Button>
        </div>

        {/* Contact information */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Questions about your assessment? Contact us at{' '}
            <a 
              href="mailto:support@codeassess.com" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              support@codeassess.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};