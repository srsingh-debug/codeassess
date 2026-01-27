import React, { useState } from 'react';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { AssessmentLanding } from './AssessmentLanding';
import { CandidateAuth } from './CandidateAuth';
import { InstructionsModal } from './InstructionsModal';
import { AssessmentInProgress } from './AssessmentInProgress';
import { FinalSubmission } from './FinalSubmission';
import { ConfirmationPage } from './ConfirmationPage';
import { CandidateResultsPage } from './CandidateResultsPage';

type FlowStep = 
  | 'landing' 
  | 'auth' 
  | 'instructions' 
  | 'assessment' 
  | 'submission' 
  | 'confirmation' 
  | 'results';

interface UserData {
  name: string;
  email: string;
  isGuest: boolean;
}

export const CandidateFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('landing');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeSpent, setTimeSpent] = useState(0);

  // Mock assessment data
  const assessmentData = {
    title: 'Frontend Developer Assessment',
    description: 'Test your JavaScript, React, and problem-solving skills with this comprehensive coding assessment.',
    duration: 90, // minutes
    questionCount: 5,
    allowedLanguages: ['javascript', 'typescript', 'python'],
    rules: [
      'You have 90 minutes to complete all questions',
      'You can switch between questions at any time',
      'Your progress is automatically saved',
      'Use only the allowed programming languages',
      'External resources and copy-paste are not permitted'
    ],
    instructions: [
      'Read each question carefully before starting to code',
      'Test your solution with the provided sample inputs',
      'Ensure your code handles edge cases appropriately',
      'Submit your final answers before time runs out',
      'Review your solutions before final submission'
    ]
  };

  // Mock questions data
  const questions = [
    {
      id: '1',
      title: 'Two Sum Problem',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
      difficulty: 'easy' as const,
      sampleInput: 'nums = [2,7,11,15], target = 9',
      sampleOutput: '[0,1]',
      starterCode: 'function twoSum(nums, target) {\n    // Your code here\n    return [];\n}'
    },
    {
      id: '2',
      title: 'Valid Parentheses',
      description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.',
      difficulty: 'medium' as const,
      sampleInput: 's = "()[]{}"',
      sampleOutput: 'true',
      starterCode: 'function isValid(s) {\n    // Your code here\n    return false;\n}'
    },
    {
      id: '3',
      title: 'Binary Tree Traversal',
      description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.\n\nInorder traversal visits nodes in this order: left subtree, root, right subtree.',
      difficulty: 'hard' as const,
      sampleInput: 'root = [1,null,2,3]',
      sampleOutput: '[1,3,2]',
      starterCode: 'function inorderTraversal(root) {\n    // Your code here\n    return [];\n}'
    }
  ];

  // Mock results data
  const resultsData = {
    assessmentTitle: assessmentData.title,
    overallScore: 85,
    totalQuestions: questions.length,
    questionsAnswered: Object.keys(answers).length,
    timeSpent: timeSpent,
    totalDuration: assessmentData.duration,
    passed: true,
    questions: [
      {
        id: '1',
        title: 'Two Sum Problem',
        difficulty: 'easy' as const,
        score: 100,
        timeTaken: 15,
        passed: true
      },
      {
        id: '2',
        title: 'Valid Parentheses',
        difficulty: 'medium' as const,
        score: 85,
        timeTaken: 25,
        passed: true
      },
      {
        id: '3',
        title: 'Binary Tree Traversal',
        difficulty: 'hard' as const,
        score: 70,
        timeTaken: 35,
        passed: true
      }
    ],
    strengths: [
      'Strong algorithmic thinking and problem-solving approach',
      'Clean and readable code structure',
      'Good time management throughout the assessment',
      'Proper handling of edge cases in most solutions'
    ],
    improvements: [
      'Consider optimizing time complexity in some solutions',
      'Add more comprehensive error handling',
      'Include more detailed comments for complex logic',
      'Practice with more advanced data structures'
    ]
  };

  const handleStartAssessment = () => {
    setCurrentStep('auth');
  };

  const handleAuthenticated = (user: UserData) => {
    setUserData(user);
    setCurrentStep('instructions');
  };

  const handleSkipAuth = () => {
    setUserData({ name: 'Anonymous', email: '', isGuest: true });
    setCurrentStep('instructions');
  };

  const handleContinueFromInstructions = () => {
    setCurrentStep('assessment');
  };

  const handleSubmitAssessment = () => {
    setTimeSpent(65 * 60); // 65 minutes in seconds
    setCurrentStep('submission');
  };

  const handleGoBackToAssessment = () => {
    setCurrentStep('assessment');
  };

  const handleFinalSubmit = () => {
    setCurrentStep('confirmation');
  };

  const handleViewResults = () => {
    setCurrentStep('results');
  };

  const handleCloseFlow = () => {
    // Reset flow or redirect to main application
    setCurrentStep('landing');
    setUserData(null);
    setAnswers({});
    setTimeSpent(0);
  };

  const handleRetakeAssessment = () => {
    setAnswers({});
    setTimeSpent(0);
    setCurrentStep('assessment');
  };

  return (
    <ThemeProvider>
      {currentStep === 'landing' && (
        <AssessmentLanding
          onStartAssessment={handleStartAssessment}
          assessmentData={assessmentData}
        />
      )}

      {currentStep === 'auth' && (
        <CandidateAuth
          onAuthenticated={handleAuthenticated}
          onSkip={handleSkipAuth}
        />
      )}

      {currentStep === 'instructions' && (
        <InstructionsModal
          isOpen={true}
          onContinue={handleContinueFromInstructions}
          assessmentData={assessmentData}
        />
      )}

      {currentStep === 'assessment' && (
        <AssessmentInProgress
          onSubmitAssessment={handleSubmitAssessment}
          questions={questions}
          duration={assessmentData.duration}
          allowedLanguages={assessmentData.allowedLanguages}
        />
      )}

      {currentStep === 'submission' && (
        <FinalSubmission
          onSubmit={handleFinalSubmit}
          onGoBack={handleGoBackToAssessment}
          questions={questions}
          answers={answers}
          timeSpent={timeSpent}
          totalDuration={assessmentData.duration}
        />
      )}

      {currentStep === 'confirmation' && (
        <ConfirmationPage
          onClose={handleCloseFlow}
          assessmentData={{
            title: assessmentData.title,
            submissionTime: new Date(),
            questionsAnswered: Object.keys(answers).length,
            totalQuestions: questions.length,
            timeSpent: timeSpent,
            totalDuration: assessmentData.duration
          }}
          showInstantResults={true}
          onViewResults={handleViewResults}
        />
      )}

      {currentStep === 'results' && (
        <CandidateResultsPage
          onClose={handleCloseFlow}
          onRetake={handleRetakeAssessment}
          resultsData={resultsData}
        />
      )}
    </ThemeProvider>
  );
};