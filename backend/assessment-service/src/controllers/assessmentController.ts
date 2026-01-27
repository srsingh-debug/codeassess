import { Request, Response, NextFunction } from 'express';
import { Assessment } from '../models/Assessment';
import { AssessmentAttempt } from '../models/AssessmentAttempt';
import { v4 as uuidv4 } from 'uuid';

export class AssessmentController {
  // Create assessment
  static async createAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, questions, duration, passingScore, status, tags } = req.body;
      const userId = (req as any).user?.userId;

      // Generate IDs for questions if not provided
      const questionsWithIds = questions.map((q: any) => ({
        ...q,
        id: q.id || uuidv4(),
      }));

      const assessment = await Assessment.create({
        title,
        description,
        questions: questionsWithIds,
        duration,
        passingScore,
        status: status || 'draft',
        tags,
        createdBy: userId,
      });

      res.status(201).json({
        success: true,
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all assessments
  static async getAssessments(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, page = 1, limit = 10, search } = req.query;
      const userRole = (req as any).user?.role;

      const query: any = {};

      // If not admin, only show published assessments
      if (userRole !== 'admin') {
        query.status = 'published';
      } else if (status) {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Assessment.countDocuments(query);
      const assessments = await Assessment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      res.json({
        success: true,
        data: assessments,
        meta: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get assessment by ID
  static async getAssessmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userRole = (req as any).user?.role;

      const assessment = await Assessment.findById(id);

      if (!assessment) {
        return res.status(404).json({
          success: false,
          error: { message: 'Assessment not found', code: 'ASSESSMENT_NOT_FOUND' },
        });
      }

      // If not admin, only show published assessments
      if (userRole !== 'admin' && assessment.status !== 'published') {
        return res.status(403).json({
          success: false,
          error: { message: 'Assessment not available', code: 'FORBIDDEN' },
        });
      }

      res.json({
        success: true,
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update assessment
  static async updateAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const userId = (req as any).user?.userId;

      const assessment = await Assessment.findById(id);

      if (!assessment) {
        return res.status(404).json({
          success: false,
          error: { message: 'Assessment not found', code: 'ASSESSMENT_NOT_FOUND' },
        });
      }

      // Check if user is the creator
      if (assessment.createdBy !== userId) {
        return res.status(403).json({
          success: false,
          error: { message: 'Unauthorized to update this assessment', code: 'UNAUTHORIZED' },
        });
      }

      Object.assign(assessment, updates);
      await assessment.save();

      res.json({
        success: true,
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete assessment
  static async deleteAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;

      const assessment = await Assessment.findById(id);

      if (!assessment) {
        return res.status(404).json({
          success: false,
          error: { message: 'Assessment not found', code: 'ASSESSMENT_NOT_FOUND' },
        });
      }

      // Check if user is the creator
      if (assessment.createdBy !== userId) {
        return res.status(403).json({
          success: false,
          error: { message: 'Unauthorized to delete this assessment', code: 'UNAUTHORIZED' },
        });
      }

      await Assessment.findByIdAndDelete(id);

      res.json({
        success: true,
        data: { message: 'Assessment deleted successfully' },
      });
    } catch (error) {
      next(error);
    }
  }

  // Start assessment attempt
  static async startAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const { assessmentId } = req.body;
      const candidateId = (req as any).user?.userId;

      // Check if already attempted
      const existingAttempt = await AssessmentAttempt.findOne({
        assessmentId,
        candidateId,
      });

      if (existingAttempt && existingAttempt.status === 'completed') {
        return res.status(409).json({
          success: false,
          error: { message: 'Assessment already completed', code: 'ALREADY_COMPLETED' },
        });
      }

      if (existingAttempt && existingAttempt.status === 'in_progress') {
        return res.json({
          success: true,
          data: existingAttempt,
        });
      }

      const attempt = await AssessmentAttempt.create({
        assessmentId,
        candidateId,
        status: 'in_progress',
        startedAt: new Date(),
      });

      res.status(201).json({
        success: true,
        data: attempt,
      });
    } catch (error) {
      next(error);
    }
  }

  // Submit assessment attempt
  static async submitAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const { attemptId } = req.params;
      const { answers, timeSpent } = req.body;

      const attempt = await AssessmentAttempt.findById(attemptId);

      if (!attempt) {
        return res.status(404).json({
          success: false,
          error: { message: 'Attempt not found', code: 'ATTEMPT_NOT_FOUND' },
        });
      }

      if (attempt.status === 'completed') {
        return res.status(409).json({
          success: false,
          error: { message: 'Assessment already completed', code: 'ALREADY_COMPLETED' },
        });
      }

      // Get assessment for scoring
      const assessment = await Assessment.findById(attempt.assessmentId);
      if (!assessment) {
        return res.status(404).json({
          success: false,
          error: { message: 'Assessment not found', code: 'ASSESSMENT_NOT_FOUND' },
        });
      }

      // Score the answers
      let totalScore = 0;
      const scoredAnswers = answers.map((answer: any) => {
        const question = assessment.questions.find((q) => q.id === answer.questionId);
        if (question && question.correctAnswer) {
          const isCorrect = answer.answer === question.correctAnswer;
          const points = isCorrect ? question.points : 0;
          totalScore += points;
          return { ...answer, isCorrect, points };
        }
        return answer;
      });

      attempt.answers = scoredAnswers;
      attempt.score = totalScore;
      attempt.timeSpent = timeSpent;
      attempt.completedAt = new Date();
      attempt.status = 'scored';
      await attempt.save();

      res.json({
        success: true,
        data: attempt,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get attempts by candidate
  static async getAttemptsByCandidate(req: Request, res: Response, next: NextFunction) {
    try {
      const candidateId = (req as any).user?.userId;

      const attempts = await AssessmentAttempt.find({ candidateId }).sort({
        startedAt: -1,
      });

      res.json({
        success: true,
        data: attempts,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get assessment statistics
  static async getAssessmentStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { assessmentId } = req.query;

      const matchStage: any = {};
      if (assessmentId) {
        matchStage.assessmentId = assessmentId;
      }

      const stats = await AssessmentAttempt.aggregate([
        ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
        {
          $group: {
            _id: null,
            totalAttempts: { $sum: 1 },
            averageScore: { $avg: '$score' },
            averageTime: { $avg: '$timeSpent' },
            completed: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
            },
          },
        },
      ]);

      res.json({
        success: true,
        data: stats[0] || {
          totalAttempts: 0,
          averageScore: 0,
          averageTime: 0,
          completed: 0,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

