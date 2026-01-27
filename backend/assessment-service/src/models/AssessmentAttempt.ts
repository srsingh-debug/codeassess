import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessmentAttempt extends Document {
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

const assessmentAttemptSchema = new Schema<IAssessmentAttempt>(
  {
    assessmentId: {
      type: String,
      required: true,
      index: true,
    },
    candidateId: {
      type: String,
      required: true,
      index: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed', 'scored'],
      default: 'not_started',
    },
    answers: [
      {
        questionId: { type: String, required: true },
        answer: { type: String, required: true },
        isCorrect: Boolean,
        points: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
assessmentAttemptSchema.index({ assessmentId: 1, candidateId: 1 });
assessmentAttemptSchema.index({ status: 1 });

export const AssessmentAttempt = mongoose.model<IAssessmentAttempt>(
  'AssessmentAttempt',
  assessmentAttemptSchema
);

