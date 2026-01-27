import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessment extends Document {
  title: string;
  description: string;
  questions: {
    id: string;
    text: string;
    type: 'multiple-choice' | 'text' | 'coding';
    options?: string[];
    correctAnswer?: string;
    points: number;
  }[];
  duration: number; // in minutes
  passingScore: number;
  createdBy: string; // Admin user ID
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  tags?: string[];
}

const assessmentSchema = new Schema<IAssessment>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    questions: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        type: {
          type: String,
          enum: ['multiple-choice', 'text', 'coding'],
          required: true,
        },
        options: [String],
        correctAnswer: String,
        points: { type: Number, required: true, default: 10 },
      },
    ],
    duration: {
      type: Number,
      required: true,
      default: 60, // 60 minutes
    },
    passingScore: {
      type: Number,
      required: true,
      default: 70,
    },
    createdBy: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes
assessmentSchema.index({ status: 1 });
assessmentSchema.index({ createdBy: 1 });
assessmentSchema.index({ tags: 1 });

export const Assessment = mongoose.model<IAssessment>('Assessment', assessmentSchema);

