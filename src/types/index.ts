// Types for the coding assessment platform

export type UserRole = 'admin' | 'candidate' | 'recruiter' | 'hr' | 'interviewer' | 'hiring-manager';

export type NavigationState = 
  | 'landing' 
  | 'auth' 
  | 'candidate-dashboard' 
  | 'admin-dashboard' 
  | 'recruiter-dashboard'
  | 'hr-dashboard'
  | 'interviewer-dashboard'
  | 'hiring-manager-dashboard'
  | 'recruiter-job-management'
  | 'recruiter-applications'
  | 'recruiter-candidates'
  | 'recruiter-analytics'
  | 'hiring-manager-job-approvals'
  | 'hiring-manager-decisions'
  | 'hiring-manager-analytics'
  | 'assessment-creation' 
  | 'assessment-attempt' 
  | 'results' 
  | 'profile'
  | 'candidate-flow'
  | 'admin-flow'
  | 'reports-analytics'
  | 'my-progress'
  | 'practice-arena'
  | 'system-settings'
  | 'manage-assessments'
  | 'manage-candidates'
  | 'send-links'
  | 'my-achievements'
  | 'skill-assessment'
  | 'job-board'
  | 'job-details'
  | 'apply-job'
  | 'job-management'
  | 'application-dashboard'
  | 'candidate-application'
  | 'recruiter-create-job'
  | 'admin-create-job';
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt?: Date;
  isEmailVerified?: boolean;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  allowedLanguages: string[];
  questions: Question[];
  createdBy: string;
  createdAt: Date;
  status: 'draft' | 'published' | 'archived';
  plagiarismDetection: boolean;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  starterCode?: string;
  testCases: TestCase[];
  points: number;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Attempt {
  id: string;
  assessmentId: string;
  candidateId: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'scored';
  score?: number;
  timeSpent: number; // in seconds
  answers: Answer[];
  plagiarismFlags: string[];
}

export interface Answer {
  questionId: string;
  code: string;
  language: string;
  testResults: TestResult[];
}

export interface TestResult {
  testCaseId: string;
  passed: boolean;
  executionTime: number;
  output: string;
}

// Job-related types for the recruitment platform

export interface JobPost {
  id: string;
  title: string;
  description: string;
  location: string;
  education: string;
  jobType: string;
  compensation: string;
  requiredSkills: string[];
  experience: string;
  applicationDeadline: Date;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'closed';
  publicLink: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  resumeUrl?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  prescreeningAnswers: PreScreeningAnswer[];
  status: 'pending' | 'shortlisted' | 'rejected' | 'need_more_info';
  appliedAt: Date;
  updatedAt: Date;
}

export interface PreScreeningAnswer {
  questionId: string;
  questionText: string;
  answer: string;
}
