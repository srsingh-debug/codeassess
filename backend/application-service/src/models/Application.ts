import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  jobId: string;
  candidateId: string;
  answers: {
    questionId: string;
    questionText: string;
    answer: string;
  }[];
  status: 'applied' | 'shortlisted' | 'rejected' | 'need_more_info';
  appliedAt: Date;
  updatedAt: Date;
  notes?: string;
  reviewedBy?: string;
}

const applicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: String,
      required: true,
      index: true,
    },
    candidateId: {
      type: String,
      required: true,
      index: true,
    },
    answers: [
      {
        questionId: { type: String, required: true },
        questionText: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'rejected', 'need_more_info'],
      default: 'applied',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
    reviewedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
applicationSchema.index({ status: 1 });

export const Application = mongoose.model<IApplication>('Application', applicationSchema);

