import { Request, Response, NextFunction } from 'express';
import { Candidate } from '../models/Candidate';

export class CandidateController {
  // Create or get candidate profile
  static async getOrCreateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { email, name } = (req as any).user;

      let candidate = await Candidate.findOne({ userId });

      if (!candidate) {
        // Create profile if doesn't exist
        candidate = await Candidate.create({
          userId,
          email,
          name,
        });
      }

      res.json({
        success: true,
        data: candidate,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get candidate by ID (admin only)
  static async getCandidateById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const candidate = await Candidate.findById(id);

      if (!candidate) {
        return res.status(404).json({
          success: false,
          error: { message: 'Candidate not found', code: 'CANDIDATE_NOT_FOUND' },
        });
      }

      res.json({
        success: true,
        data: candidate,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all candidates (admin only, with pagination)
  static async getAllCandidates(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search, skills } = req.query;

      const query: any = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      if (skills) {
        const skillsArray = (skills as string).split(',');
        query.skills = { $in: skillsArray };
      }

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Candidate.countDocuments(query);
      const candidates = await Candidate.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      res.json({
        success: true,
        data: candidates,
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

  // Update candidate profile
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const updates = req.body;

      // Don't allow updating userId or email
      delete updates.userId;
      delete updates.email;

      const candidate = await Candidate.findOneAndUpdate(
        { userId },
        updates,
        { new: true, runValidators: true }
      );

      if (!candidate) {
        return res.status(404).json({
          success: false,
          error: { message: 'Candidate profile not found', code: 'PROFILE_NOT_FOUND' },
        });
      }

      res.json({
        success: true,
        data: candidate,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete candidate profile
  static async deleteProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      const candidate = await Candidate.findOneAndDelete({ userId });

      if (!candidate) {
        return res.status(404).json({
          success: false,
          error: { message: 'Candidate profile not found', code: 'PROFILE_NOT_FOUND' },
        });
      }

      res.json({
        success: true,
        data: { message: 'Profile deleted successfully' },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get candidate stats (admin only)
  static async getCandidateStats(req: Request, res: Response, next: NextFunction) {
    try {
      const total = await Candidate.countDocuments();
      
      const skillsAggregation = await Candidate.aggregate([
        { $unwind: '$skills' },
        { $group: { _id: '$skills', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);

      res.json({
        success: true,
        data: {
          totalCandidates: total,
          topSkills: skillsAggregation,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

