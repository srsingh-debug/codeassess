import { Request, Response, NextFunction } from 'express';
import { Application } from '../models/Application';
import axios from 'axios';

const JOB_SERVICE_URL = process.env.JOB_SERVICE_URL || 'http://localhost:3002';
const CANDIDATE_SERVICE_URL = process.env.CANDIDATE_SERVICE_URL || 'http://localhost:3003';

export class ApplicationController {
  // Create new application
  static async createApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId, candidateId, answers } = req.body;
      const userId = (req as any).user?.userId;

      // Check if already applied
      const existingApplication = await Application.findOne({ jobId, candidateId });
      if (existingApplication) {
        return res.status(409).json({
          success: false,
          error: { message: 'Already applied to this job', code: 'ALREADY_APPLIED' },
        });
      }

      const application = await Application.create({
        jobId,
        candidateId,
        answers,
        status: 'applied',
      });

      res.status(201).json({
        success: true,
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get applications by job
  static async getApplicationsByJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;
      const { status, page = 1, limit = 10 } = req.query;

      const query: any = { jobId };
      if (status) {
        query.status = status;
      }

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Application.countDocuments(query);
      const applications = await Application.find(query)
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      res.json({
        success: true,
        data: applications,
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

  // Get applications by candidate
  static async getApplicationsByCandidate(req: Request, res: Response, next: NextFunction) {
    try {
      const { candidateId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Application.countDocuments({ candidateId });
      const applications = await Application.find({ candidateId })
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      res.json({
        success: true,
        data: applications,
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

  // Get application by ID
  static async getApplicationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const application = await Application.findById(id);

      if (!application) {
        return res.status(404).json({
          success: false,
          error: { message: 'Application not found', code: 'APPLICATION_NOT_FOUND' },
        });
      }

      res.json({
        success: true,
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update application status
  static async updateApplicationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const userId = (req as any).user?.userId;

      const application = await Application.findByIdAndUpdate(
        id,
        {
          status,
          notes,
          reviewedBy: userId,
        },
        { new: true, runValidators: true }
      );

      if (!application) {
        return res.status(404).json({
          success: false,
          error: { message: 'Application not found', code: 'APPLICATION_NOT_FOUND' },
        });
      }

      res.json({
        success: true,
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get application statistics
  static async getApplicationStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.query;

      const matchStage: any = {};
      if (jobId) {
        matchStage.jobId = jobId;
      }

      const stats = await Application.aggregate([
        ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      const formattedStats = {
        applied: 0,
        shortlisted: 0,
        rejected: 0,
        need_more_info: 0,
        total: 0,
      };

      stats.forEach((stat) => {
        formattedStats[stat._id as keyof typeof formattedStats] = stat.count;
        formattedStats.total += stat.count;
      });

      res.json({
        success: true,
        data: formattedStats,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete application
  static async deleteApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const application = await Application.findByIdAndDelete(id);

      if (!application) {
        return res.status(404).json({
          success: false,
          error: { message: 'Application not found', code: 'APPLICATION_NOT_FOUND' },
        });
      }

      res.json({
        success: true,
        data: { message: 'Application deleted successfully' },
      });
    } catch (error) {
      next(error);
    }
  }
}

