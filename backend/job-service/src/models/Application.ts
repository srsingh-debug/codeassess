import mongoose, { Document, Schema } from "mongoose";

// Application Status Enum - Represents the lifecycle stage of a job
export enum ApplicationStatus {
  APPLIED = "applied",
  SHORTLISTED = "shortlisted",
  INTERVIEW = "interview",
  OFFERED = "offered",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
}

export interface IApplication extends Document {
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  resumeUrl: string;
  roleInterest: string;
  expectedSalaryRange: string;
  preScreeningAnswers?: Record<string, string>;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    candidateId: {
      type: String,
      //required: true,
      index: true,
    },
    candidateName: {
      type: String,
      required: true,
    },
    candidateEmail: {
      type: String,
      required: true,
    },
    candidatePhone: {
      type: String,
    },
    linkedinUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    resumeUrl: {
      type: String,
    },
    roleInterest: {
      type: String,
      required: true,
    },
    expectedSalaryRange: {
      type: String,
      required: true,
    },
    preScreeningAnswers: {
      type: Map,
      of: String,
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.APPLIED,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Avoid duplicate applications
ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export default mongoose.model<IApplication>("Application", ApplicationSchema);
