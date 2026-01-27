// Mock data for demonstration purposes

import { User, Assessment, Question, Attempt, TestCase } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'candidate@example.com',
    name: 'John Doe',
    role: 'candidate',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Jane Smith',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    createdAt: new Date('2024-01-10')
  }
];

// Mock Test Cases
const mockTestCases: TestCase[] = [
  {
    id: '1',
    input: '[1, 2, 3, 4, 5]',
    expectedOutput: '15',
    isHidden: false
  },
  {
    id: '2',
    input: '[10, -5, 3]',
    expectedOutput: '8',
    isHidden: true
  }
];

// Mock Questions
export const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'Array Sum',
    description: 'Write a function that calculates the sum of all elements in an array.',
    difficulty: 'easy',
    language: 'javascript',
    starterCode: 'function arraySum(arr) {\n  // Your code here\n  return 0;\n}',
    testCases: mockTestCases,
    points: 10
  },
  {
    id: '2',
    title: 'Binary Search',
    description: 'Implement binary search algorithm to find an element in a sorted array.',
    difficulty: 'medium',
    language: 'python',
    starterCode: 'def binary_search(arr, target):\n    # Your code here\n    return -1',
    testCases: [
      {
        id: '3',
        input: '[1, 3, 5, 7, 9], 5',
        expectedOutput: '2',
        isHidden: false
      }
    ],
    points: 20
  }
];

// Mock Assessments
export const mockAssessments: Assessment[] = [
  {
    id: '1',
    title: 'Frontend Developer Assessment',
    description: 'Comprehensive test covering JavaScript, React, and problem-solving skills.',
    duration: 90,
    allowedLanguages: ['javascript', 'typescript'],
    questions: [mockQuestions[0]],
    createdBy: '2',
    createdAt: new Date('2024-12-01'),
    status: 'published',
    plagiarismDetection: true
  },
  {
    id: '2',
    title: 'Backend Developer Test',
    description: 'Algorithm and data structure challenges for backend developers.',
    duration: 120,
    allowedLanguages: ['python', 'java', 'javascript'],
    questions: mockQuestions,
    createdBy: '2',
    createdAt: new Date('2024-12-05'),
    status: 'published',
    plagiarismDetection: true
  }
];

// Mock Attempts
export const mockAttempts: Attempt[] = [
  {
    id: '1',
    assessmentId: '1',
    candidateId: '1',
    startedAt: new Date('2024-12-10T10:00:00'),
    completedAt: new Date('2024-12-10T11:15:00'),
    status: 'completed',
    score: 85,
    timeSpent: 4500, // 75 minutes in seconds
    answers: [],
    plagiarismFlags: []
  },
  {
    id: '2',
    assessmentId: '2',
    candidateId: '1',
    startedAt: new Date('2024-12-12T14:00:00'),
    status: 'in_progress',
    timeSpent: 1800, // 30 minutes in seconds
    answers: [],
    plagiarismFlags: []
  }
];

// Analytics data for charts
export const mockAnalytics = {
  totalCandidates: 156,
  averageScore: 78.5,
  completionRate: 87.3,
  monthlyAttempts: [42, 38, 51, 47, 62, 55, 48, 53, 59, 61, 58, 65],
  scoreDistribution: {
    excellent: 23, // 90-100
    good: 45,      // 80-89
    average: 52,   // 70-79
    poor: 36       // <70
  }
};