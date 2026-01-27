import mongoose, { Document, Schema } from 'mongoose';

/**
 * Job Status Enum - Represents the lifecycle stage of a job
 */
export enum JobStatus {
  DRAFT = 'draft',                    // Initial creation, not yet submitted
  PENDING_APPROVAL = 'pending_approval', // Submitted for hiring manager approval
  APPROVED = 'approved',              // Approved by hiring manager, ready to publish
  PUBLISHED = 'published',           // Live on job board, accepting applications
  CLOSED = 'closed',                 // No longer accepting applications
  FILLED = 'filled',                 // Position has been filled
  CANCELLED = 'cancelled'            // Job posting cancelled
}

/**
 * Employment Type Enum
 */
export enum EmploymentType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  TEMPORARY = 'temporary'
}

/**
 * Work Location Type Enum
 */
export enum WorkLocationType {
  REMOTE = 'remote',
  ONSITE = 'onsite',
  HYBRID = 'hybrid'
}

/**
 * Job Priority Enum
 */
export enum JobPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

/**
 * Approval Status Interface
 */
export interface IApprovalStatus {
  status: 'pending' | 'approved' | 'rejected' | 'not_required';
  approvedBy?: string; // User ID of hiring manager
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  comments?: string;
}

/**
 * Compensation Interface
 */
export interface ICompensation {
  min?: number;        // Minimum salary/rate
  max?: number;        // Maximum salary/rate
  currency: string;    // e.g., 'USD', 'EUR'
  period: 'hourly' | 'monthly' | 'yearly';
  equity?: string;     // Equity information
  benefits?: string[]; // List of benefits
}

/**
 * Requirements Interface
 */
export interface IRequirements {
  minExperience?: number;      // Years of experience
  maxExperience?: number;
  education?: string[];         // Required education levels
  certifications?: string[];    // Required certifications
  skills: string[];           // Required skills
  languages?: string[];        // Required languages
  visaSponsorship?: boolean;   // Whether visa sponsorship is available
}

/**
 * Application Settings Interface
 */
export interface IApplicationSettings {
  requireCoverLetter: boolean;
  requirePortfolio: boolean;
  requireReferences: boolean;
  maxApplications?: number;    // Maximum number of applications to accept
  autoRejectThreshold?: number; // Auto-reject if score below this
  assessmentRequired: boolean; // Whether assessment is required
  assessmentId?: string;       // Assessment ID if required
}

/**
 * Job Posting Interface
 */
export interface IJob extends Document {
  // Basic Information
  title: string;
  description: string;
  shortDescription?: string;   // Brief summary for job board
  
  // Location & Work Type
  location: string;            // City, State/Country
  workLocationType: WorkLocationType;
  employmentType: EmploymentType;
  
  // Requirements
  requirements: IRequirements;
  
  // Compensation
  compensation?: ICompensation;
  
  // Application Settings
  applicationSettings: IApplicationSettings;
  applicationDeadline?: Date;
  
  // Status & Workflow
  status: JobStatus;
  priority: JobPriority;
  approvalStatus: IApprovalStatus;
  
  // Ownership & Tracking
  createdBy: string;           // User ID who created the job
  createdByRole: string;       // Role of creator (recruiter, hiring-manager, etc.)
  approvedBy?: string;         // User ID who approved (hiring manager)
  publishedBy?: string;        // User ID who published
  publishedAt?: Date;
  
  // Job Board
  publicLink?: string;         // Public URL slug
  isActive: boolean;           // Whether job is visible on job board
  viewsCount: number;          // Number of times job was viewed
  applicationsCount: number;   // Number of applications received
  
  // Metadata
  department?: string;
  team?: string;
  reportingTo?: string;        // Manager/role this position reports to
  tags?: string[];             // Tags for categorization
  
  // Dates
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  filledAt?: Date;
  
  // Additional Information
  companyInfo?: {
    name?: string;
    website?: string;
    logo?: string;
  };
  
  // Internal Notes (not visible to candidates)
  internalNotes?: string;
  
  // Rejection/Closure Information
  closureReason?: string;
}

const approvalStatusSchema = new Schema<IApprovalStatus>(
  {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'not_required'],
      default: 'not_required',
    },
    approvedBy: {
      type: String,
    },
    approvedAt: {
      type: Date,
    },
    rejectedBy: {
      type: String,
    },
    rejectedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
    comments: {
      type: String,
    },
  },
  { _id: false }
);

const compensationSchema = new Schema<ICompensation>(
  {
    min: {
      type: Number,
    },
    max: {
      type: Number,
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly',
    },
    equity: {
      type: String,
    },
    benefits: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const requirementsSchema = new Schema<IRequirements>(
  {
    minExperience: {
      type: Number,
      min: 0,
    },
    maxExperience: {
      type: Number,
      min: 0,
    },
    education: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one skill is required',
      },
    },
    languages: {
      type: [String],
      default: [],
    },
    visaSponsorship: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const applicationSettingsSchema = new Schema<IApplicationSettings>(
  {
    requireCoverLetter: {
      type: Boolean,
      default: false,
    },
    requirePortfolio: {
      type: Boolean,
      default: false,
    },
    requireReferences: {
      type: Boolean,
      default: false,
    },
    maxApplications: {
      type: Number,
      min: 1,
    },
    autoRejectThreshold: {
      type: Number,
      min: 0,
      max: 100,
    },
    assessmentRequired: {
      type: Boolean,
      default: true,
    },
    assessmentId: {
      type: String,
    },
  },
  { _id: false }
);

const jobSchema = new Schema<IJob>(
  {
    // Basic Information
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      minlength: 100,
    },
    shortDescription: {
      type: String,
      maxlength: 500,
    },
    
    // Location & Work Type
    location: {
      type: String,
      required: true,
      trim: true,
    },
    workLocationType: {
      type: String,
      enum: Object.values(WorkLocationType),
      required: true,
      default: WorkLocationType.ONSITE,
    },
    employmentType: {
      type: String,
      enum: Object.values(EmploymentType),
      required: true,
      default: EmploymentType.FULL_TIME,
    },
    
    // Requirements
    requirements: {
      type: requirementsSchema,
      required: true,
    },
    
    // Compensation
    compensation: {
      type: compensationSchema,
    },
    
    // Application Settings
    applicationSettings: {
      type: applicationSettingsSchema,
      required: true,
      default: () => ({
        requireCoverLetter: false,
        requirePortfolio: false,
        requireReferences: false,
        assessmentRequired: true,
      }),
    },
    applicationDeadline: {
      type: Date,
      validate: {
        validator: function(this: IJob, value: Date) {
          if (!value) return true; // Optional
          return value > new Date();
        },
        message: 'Application deadline must be in the future',
      },
    },
    
    // Status & Workflow
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.DRAFT,
      required: true,
    },
    priority: {
      type: String,
      enum: Object.values(JobPriority),
      default: JobPriority.MEDIUM,
    },
    approvalStatus: {
      type: approvalStatusSchema,
      required: true,
      default: () => ({
        status: 'not_required',
      }),
    },
    
    // Ownership & Tracking
    createdBy: {
      type: String,
      required: true,
      index: true,
    },
    createdByRole: {
      type: String,
      required: true,
    },
    approvedBy: {
      type: String,
    },
    publishedBy: {
      type: String,
    },
    publishedAt: {
      type: Date,
    },
    
    // Job Board
    publicLink: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    applicationsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    // Metadata
    department: {
      type: String,
      trim: true,
    },
    team: {
      type: String,
      trim: true,
    },
    reportingTo: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    
    // Dates
    closedAt: {
      type: Date,
    },
    filledAt: {
      type: Date,
    },
    
    // Additional Information
    companyInfo: {
      name: String,
      website: String,
      logo: String,
    },
    
    // Internal Notes
    internalNotes: {
      type: String,
    },
    
    // Closure Information
    closureReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
jobSchema.index({ status: 1, isActive: 1 });
jobSchema.index({ createdBy: 1, status: 1 });
jobSchema.index({ 'approvalStatus.status': 1 });
jobSchema.index({ applicationDeadline: 1 });
jobSchema.index({ workLocationType: 1, employmentType: 1 });
jobSchema.index({ 'requirements.skills': 1 });
jobSchema.index({ tags: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ priority: 1, createdAt: -1 });

// Virtual for generating public link
jobSchema.virtual('publicUrl').get(function(this: IJob) {
  if (this.publicLink) {
    return `/jobs/${this.publicLink}`;
  }
  return `/jobs/${this._id}`;
});

// Pre-save middleware to generate public link if not provided
jobSchema.pre('save', function(next) {
  const doc = this as IJob & { isNew: boolean; _id: any };
  if (doc.isNew && !doc.publicLink && doc.status === JobStatus.PUBLISHED) {
    // Generate slug from title
    const slug = doc.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    doc.publicLink = `${slug}-${doc._id.toString().slice(-6)}`;
  }
  next();
});

// Method to check if job is accepting applications
jobSchema.methods.isAcceptingApplications = function(this: IJob): boolean {
  if (this.status !== JobStatus.PUBLISHED || !this.isActive) {
    return false;
  }
  if (this.applicationDeadline && this.applicationDeadline < new Date()) {
    return false;
  }
  if (this.applicationSettings.maxApplications && 
      this.applicationsCount >= this.applicationSettings.maxApplications) {
    return false;
  }
  return true;
};

// Method to increment views
jobSchema.methods.incrementViews = function(this: IJob & Document) {
  this.viewsCount += 1;
  return this.save();
};

// Method to increment applications
jobSchema.methods.incrementApplications = function(this: IJob & Document) {
  this.applicationsCount += 1;
  return this.save();
};

export const Job = mongoose.model<IJob>('Job', jobSchema);
