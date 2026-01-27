import mongoose, { Document, Schema } from 'mongoose';

export interface ICandidate extends Document {
  userId: string; // Reference to auth service user
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  resumeUrl?: string;
  skills: string[];
  experience?: string;
  education?: {
    degree: string;
    institution: string;
    year: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const candidateSchema = new Schema<ICandidate>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
    },
    education: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
candidateSchema.index({ email: 1 });
candidateSchema.index({ userId: 1 });

export const Candidate = mongoose.model<ICandidate>('Candidate', candidateSchema);

