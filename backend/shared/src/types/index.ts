// Shared types across all microservices

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'candidate';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: 'admin' | 'candidate';
  iat?: number;
  exp?: number;
}

// Job types
export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  requiredSkills: string[];
  experience: string;
  applicationDeadline: Date;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'closed';
  publicLink: string;
}

export interface CreateJobDto {
  title: string;
  description: string;
  location: string;
  requiredSkills: string[];
  experience: string;
  applicationDeadline: Date;
  status?: 'draft' | 'published' | 'closed';
}

export interface UpdateJobDto {
  title?: string;
  description?: string;
  location?: string;
  requiredSkills?: string[];
  experience?: string;
  applicationDeadline?: Date;
  status?: 'draft' | 'published' | 'closed';
}

// Candidate types
export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCandidateDto {
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  resumeUrl?: string;
}

export interface UpdateCandidateDto {
  name?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  resumeUrl?: string;
}

// Application types
export interface ApplicationAnswer {
  questionId: string;
  questionText: string;
  answer: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  answers: ApplicationAnswer[];
  status: 'applied' | 'shortlisted' | 'rejected' | 'need_more_info';
  appliedAt: Date;
  updatedAt: Date;
}

export interface ApplicationWithDetails extends Application {
  job?: Job;
  candidate?: Candidate;
}

export interface CreateApplicationDto {
  jobId: string;
  candidateId: string;
  answers: ApplicationAnswer[];
}

export interface UpdateApplicationDto {
  status: 'applied' | 'shortlisted' | 'rejected' | 'need_more_info';
  answers?: ApplicationAnswer[];
}

// Assessment types
export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'coding';
  options?: string[];
  correctAnswer?: string;
  points: number;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  duration: number; // in minutes
  passingScore: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
}

export interface CreateAssessmentDto {
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  duration: number;
  passingScore: number;
  createdBy: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface UpdateAssessmentDto {
  title?: string;
  description?: string;
  questions?: AssessmentQuestion[];
  duration?: number;
  passingScore?: number;
  status?: 'draft' | 'published' | 'archived';
}

// Assessment Attempt types
export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  candidateId: string;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in seconds
  score?: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'scored';
  answers: {
    questionId: string;
    answer: string;
    isCorrect?: boolean;
    points?: number;
  }[];
}

// Event types for inter-service communication
export interface ServiceEvent {
  eventType: string;
  timestamp: Date;
  data: any;
  source: string;
}

export interface JobCreatedEvent extends ServiceEvent {
  eventType: 'job.created';
  data: Job;
}

export interface ApplicationCreatedEvent extends ServiceEvent {
  eventType: 'application.created';
  data: Application;
}

export interface AssessmentCompletedEvent extends ServiceEvent {
  eventType: 'assessment.completed';
  data: AssessmentAttempt;
}

