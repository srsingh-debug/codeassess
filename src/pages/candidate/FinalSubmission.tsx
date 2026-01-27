import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { 
  CheckCircle, 
  Circle, 
  AlertTriangle, 
  Send,
  ArrowLeft,
  Clock,
  FileText,
  Code
} from 'lucide-react';

interface Question {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface FinalSubmissionProps {
  onSubmit: () => void;
  onGoBack: () => void;
  questions: Question[];
  answers: Record<string, string>;
  timeSpent: number;
  totalDuration: number;
}

export const FinalSubmission: React.FC<FinalSubmissionProps> = ({
  onSubmit,
  onGoBack,
  questions,
  answers,
  timeSpent,
  totalDuration
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const timeSpentMinutes = Math.round(timeSpent / 60);
  const timeRemainingMinutes = Math.round((totalDuration * 60 - timeSpent) / 60);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate submission process
    await new Promise(resolve => setTimeout(resolve, 2000));
    onSubmit();
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
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                Final Submission
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {answeredCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Questions Answered
              </div>
            </CardContent>
          </Card>

          <Card className="text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="bg-red-100 dark:bg-red-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Circle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {unansweredCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Questions Unanswered
              </div>
            </CardContent>
          </Card>

          <Card className="text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {timeSpentMinutes}m
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Time Spent
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question review */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Question Review
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Review your progress before final submission
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {questions.map((question, index) => {
                const isAnswered = answers[question.id];
                
                return (
                  <div 
                    key={question.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium px-3 py-1 rounded">
                        Q{index + 1}
                      </span>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {question.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {isAnswered ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <Badge variant="success">Answered</Badge>
                        </>
                      ) : (
                        <>
                          <Circle className="w-5 h-5 text-gray-400" />
                          <Badge variant="default">Not Answered</Badge>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Warning for unanswered questions */}
        {unansweredCount > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Incomplete Assessment
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                  You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}. 
                  You can still go back and complete them if you have time remaining ({timeRemainingMinutes} minutes left).
                </p>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    icon={ArrowLeft}
                    onClick={onGoBack}
                  >
                    Go Back to Questions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submission section */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Ready to Submit?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Once you submit, you won't be able to make any changes to your answers.
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Submission Summary
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Questions Completed:</span>
                  <span className="ml-2 font-medium text-blue-900 dark:text-blue-100">
                    {answeredCount}/{questions.length}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Time Used:</span>
                  <span className="ml-2 font-medium text-blue-900 dark:text-blue-100">
                    {timeSpentMinutes}/{totalDuration} minutes
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                icon={ArrowLeft}
                onClick={onGoBack}
                className="sm:w-auto"
              >
                Go Back
              </Button>
              <Button 
                icon={Send}
                onClick={() => setShowConfirmModal(true)}
                className="sm:w-auto"
                size="lg"
              >
                Submit Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Submission"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  Final Confirmation
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Are you sure you want to submit your assessment? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">
              Submission Details:
            </h5>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <div>• {answeredCount} out of {questions.length} questions answered</div>
              <div>• {timeSpentMinutes} minutes spent</div>
              <div>• {timeRemainingMinutes} minutes remaining</div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              icon={Send}
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Yes, Submit Assessment'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};