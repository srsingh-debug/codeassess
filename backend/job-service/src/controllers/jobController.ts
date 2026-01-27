import { Response, NextFunction } from "express";
import { Job, JobStatus, IJob } from "../models/Job";
import { AuthRequest } from "../middleware/auth";

export class JobController {
  // Create a new job (draft)
  static async createJob(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        res.status(401).json({
          success: false,
          error: { message: "Authentication required", code: "AUTH_REQUIRED" },
        });
        return;
      }

      // Only recruiter and hiring-manager can create jobs
      if (!["recruiter", "hiring-manager", "admin"].includes(userRole)) {
        res.status(403).json({
          success: false,
          error: {
            message: "Insufficient permissions to create jobs",
            code: "FORBIDDEN",
          },
        });
        return;
      }

      const jobData = {
        ...req.body,
        status: JobStatus.DRAFT,
        createdBy: userId,
        createdByRole: userRole,
        approvalStatus: {
          status: "not_required" as const,
        },
        isActive: false,
        viewsCount: 0,
        applicationsCount: 0,
      };

      const job = await Job.create(jobData);

      res.status(201).json({
        success: true,
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all jobs (with filters and role-based access)
  static async getJobs(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {
        status,
        page = "1",
        limit = "10",
        search,
        department,
        tags,
        workLocationType,
        employmentType,
      } = req.query;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      const query: Record<string, unknown> = {};

      // // Role-based filtering
      // if (userRole === 'candidate') {
      //   // Candidates only see published and active jobs
      //   query.status = JobStatus.PUBLISHED;
      //   query.isActive = true;
      // } else if (userRole === 'recruiter'  /*userRole === 'hiring-manager'*/) {
      //   // Recruiters and hiring managers see their own jobs + published jobs
      //   if (status) {
      //     query.status = status;
      //   }
      //   // If no status filter, show user's jobs or published jobs
      //   if (!status && userId) {
      //     query.$or = [
      //       { createdBy: userId },
      //       { status: JobStatus.PUBLISHED, isActive: true },
      //     ];
      //   }
      // } else if (userRole === 'admin' || userRole === 'hiring-manager') {
      //   // Admins see all jobs
      //   if (status) {
      //     query.status = status;
      //   }
      // } else {
      //   // Default: only published jobs
      //   query.status = JobStatus.PUBLISHED;
      //   query.isActive = true;
      // }

      // Role-based filtering
      if (userRole === "candidate") {
        query.status = JobStatus.PUBLISHED;
        query.isActive = true;
      } else if (userRole === "recruiter") {

      /**
       * RECRUITER
       * - sees jobs they created
       */
        if (status) {
          query.status = status;
        } /*else {
          query.createdBy = userId;
        }*/
      } else if (userRole === "hiring-manager") {

      /**
       * HIRING MANAGER
       * - sees ALL pending approval jobs
       * - optionally published jobs
       */
        if (status) {
          query.status = status;
        }//  else {
        //   query.status = JobStatus.PENDING_APPROVAL;
        // }
      } else if (userRole === "admin") {

      /**
       * ADMIN
       * - sees everything
       */
        if (status) {
          query.status = status;
        }
      }

      // Search
      if (search && typeof search === "string") {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ];
      }

      // Filters
      if (department && typeof department === "string") {
        query.department = department;
      }

      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        query.tags = { $in: tagArray };
      }

      if (workLocationType && typeof workLocationType === "string") {
        query.workLocationType = workLocationType;
      }

      if (employmentType && typeof employmentType === "string") {
        query.employmentType = employmentType;
      }

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      console.log("this is query", query);
      const total = await Job.countDocuments(query);
      const jobs = await Job.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

      // Filter out internal notes for non-creators
      const filteredJobs = jobs.map((job) => {
        const jobObj = job as Record<string, unknown>;
        if (userId && jobObj.createdBy === userId) {
          return jobObj;
        }
        // Remove internal notes for non-creators
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { internalNotes: _internalNotes, ...publicJob } = jobObj;
        return publicJob;
      });

      res.json({
        success: true,
        data: filteredJobs,
        meta: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get public jobs (for job board - no auth required)
  static async getPublicJobs(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {
        page = "1",
        limit = "10",
        search,
        location,
        workLocationType,
        employmentType,
        skills,
      } = req.query;

      const query: Record<string, unknown> = {
        status: JobStatus.PUBLISHED,
        isActive: true,
      };

      // Check if application deadline hasn't passed
      query.$or = [
        { applicationDeadline: { $exists: false } },
        { applicationDeadline: { $gte: new Date() } },
      ];

      // Search
      if (search && typeof search === "string") {
        query.$or = [
          ...(Array.isArray(query.$or) ? query.$or : []),
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ];
      }

      // Filters
      if (location && typeof location === "string") {
        query.location = { $regex: location, $options: "i" };
      }

      if (workLocationType && typeof workLocationType === "string") {
        query.workLocationType = workLocationType;
      }

      if (employmentType && typeof employmentType === "string") {
        query.employmentType = employmentType;
      }

      if (skills) {
        const skillArray = Array.isArray(skills) ? skills : [skills];
        query["requirements.skills"] = { $in: skillArray };
      }

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      const total = await Job.countDocuments(query);
      const jobs = await Job.find(query)
        .select("-internalNotes -approvalStatus -createdBy -createdByRole")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

      res.json({
        success: true,
        data: jobs,
        meta: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get job by ID (role-based view)
  static async getJobById(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      const job = await Job.findById(id);
    

      if (!job) {
        res.status(404).json({
          success: false,
          error: { message: "Job not found", code: "JOB_NOT_FOUND" },
        });
        return;
      }

      // Role-based access control
      if (userRole === "candidate") {
        // Candidates can only see published jobs
        if (job.status !== JobStatus.PUBLISHED || !job.isActive) {
          res.status(404).json({
            success: false,
            error: { message: "Job not found", code: "JOB_NOT_FOUND" },
          });
          return;
        }
      }

      // Filter out internal notes for non-creators
      const jobObj = job.toObject();
      if (userId && job.createdBy === userId) {
        res.json({
          success: true,
          data: jobObj,
        });
        return;
      }

      // Remove internal fields for non-creators
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {
        internalNotes: _internalNotes,
        approvalStatus: _approvalStatus,
        createdBy: _createdBy,
        createdByRole: _createdByRole,
        ...publicJob
      } = jobObj;
      res.json({
        success: true,
        data: publicJob,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get job by public link
  static async getJobByPublicLink(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { link } = req.params;

      const job = await Job.findOne({
        publicLink: link,
        status: JobStatus.PUBLISHED,
        isActive: true,
      });

      if (!job) {
        res.status(404).json({
          success: false,
          error: { message: "Job not found", code: "JOB_NOT_FOUND" },
        });
        return;
      }

      // Increment views
      job.viewsCount += 1;
      await job.save();

      // Return public view (no internal fields)
      const jobObj = job.toObject();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {
        internalNotes: _internalNotes,
        approvalStatus: _approvalStatus,
        createdBy: _createdBy,
        createdByRole: _createdByRole,
        ...publicJob
      } = jobObj;

      res.json({
        success: true,
        data: publicJob,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update job
  static async updateJob(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: { message: "Authentication required", code: "AUTH_REQUIRED" },
        });
        return;
      }

      const job = await Job.findById(id);

      if (!job) {
        res.status(404).json({
          success: false,
          error: { message: "Job not found", code: "JOB_NOT_FOUND" },
        });
        return;
      }

      // Check permissions
      const canEdit =
        job.createdBy === userId ||
        userRole === "admin" ||
        (userRole === "hiring-manager" &&
          job.status === JobStatus.PENDING_APPROVAL);

      if (!canEdit) {
        res.status(403).json({
          success: false,
          error: {
            message: "Unauthorized to update this job",
            code: "UNAUTHORIZED",
          },
        });
        return;
      }

      // Can only edit draft or pending_approval jobs
      if (![JobStatus.DRAFT, JobStatus.PENDING_APPROVAL].includes(job.status)) {
        res.status(400).json({
          success: false,
          error: {
            message: "Can only edit jobs in draft or pending_approval status",
            code: "INVALID_STATUS",
          },
        });
        return;
      }

      // Update job
      Object.assign(job, req.body);
      await job.save();

      res.json({
        success: true,
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete job
  static async deleteJob(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: { message: "Authentication required", code: "AUTH_REQUIRED" },
        });
        return;
      }

      const job = await Job.findById(id);

      if (!job) {
        res.status(404).json({
          success: false,
          error: { message: "Job not found", code: "JOB_NOT_FOUND" },
        });
        return;
      }

      // Check permissions
      const canDelete = job.createdBy === userId || userRole === "admin";

      if (!canDelete) {
        res.status(403).json({
          success: false,
          error: {
            message: "Unauthorized to delete this job",
            code: "UNAUTHORIZED",
          },
        });
        return;
      }

      // Can only delete draft or cancelled jobs
      if (![JobStatus.DRAFT, JobStatus.CANCELLED].includes(job.status)) {
        res.status(400).json({
          success: false,
          error: {
            message: "Can only delete jobs in draft or cancelled status",
            code: "INVALID_STATUS",
          },
        });
        return;
      }

      await Job.findByIdAndDelete(id);

      res.json({
        success: true,
        data: { message: "Job deleted successfully" },
      });
    } catch (error) {
      next(error);
    }
  }

  // Submit job for approval
  static async submitForApproval(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: { message: "Authentication required", code: "AUTH_REQUIRED" },
        });
        return;
      }

      const job = await Job.findById(id);

      if (!job) {
        res.status(404).json({
          success: false,
          error: { message: "Job not found", code: "JOB_NOT_FOUND" },
        });
        return;
      }

      // Check permissions
      if (job.createdBy !== userId && userRole !== "admin") {
        res.status(403).json({
          success: false,
          error: {
            message: "Unauthorized to submit this job",
            code: "UNAUTHORIZED",
          },
        });
        return;
      }

      // Can only submit draft jobs
      if (job.status !== JobStatus.DRAFT) {
        res.status(400).json({
          success: false,
          error: {
            message: "Can only submit jobs in draft status",
            code: "INVALID_STATUS",
          },
        });
        return;
      }

      // Update status
      job.status = JobStatus.PENDING_APPROVAL;
      job.approvalStatus = {
        status: "pending",
      };
      await job.save();

      res.json({
        success: true,
        data: job,
        message: "Job submitted for approval",
      });
    } catch (error) {
      next(error);
    }
  }

  // Approve job (hiring manager)
  static async approveJob(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: { message: "Authentication required", code: "AUTH_REQUIRED" },
        });
        return;
      }

      // Only hiring-manager and admin can approve
      if (!["hiring-manager", "admin"].includes(userRole || "")) {
        res.status(403).json({
          success: false,
          error: {
            message: "Only hiring managers can approve jobs",
            code: "FORBIDDEN",
          },
        });
        return;
      }

      const job = await Job.findById(id);

      if (!job) {
        res.status(404).json({
          success: false,
          error: { message: "Job not found", code: "JOB_NOT_FOUND" },
        });
        return;
      }

      // Can only approve pending jobs
      if (job.status !== JobStatus.PENDING_APPROVAL) {
        res.status(400).json({
          success: false,
          error: {
            message: "Can only approve jobs in pending_approval status",
            code: "INVALID_STATUS",
          },
        });
        return;
      }

      // Update status
      job.status = JobStatus.APPROVED;
      job.approvalStatus = {
        status: "approved",
        approvedBy: userId,
        approvedAt: new Date(),
        comments: req.body.comments,
      };
      job.approvedBy = userId;
      await job.save();

      res.json({
        success: true,
        data: job,
        message: "Job approved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Reject job (hiring manager)
  static async rejectJob(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: { message: "Authentication required", code: "AUTH_REQUIRED" },
        });
        return;
      }

      // Only hiring-manager and admin can reject
      if (!["hiring-manager", "admin"].includes(userRole || "")) {
        res.status(403).json({
          success: false,
          error: {
            message: "Only hiring managers can reject jobs",
            code: "FORBIDDEN",
          },
        });
        return;
      }

      const job = await Job.findById(id);

      if (!job) {
        res.status(404).json({
          success: false,
          error: { message: "Job not found", code: "JOB_NOT_FOUND" },
        });
        return;
      }

      // Can only reject pending jobs
      if (job.status !== JobStatus.PENDING_APPROVAL) {
        res.status(400).json({
          success: false,
          error: {
            message: "Can only reject jobs in pending_approval status",
            code: "INVALID_STATUS",
          },
        });
        return;
      }

      // Update status
      job.status = JobStatus.DRAFT;
      job.approvalStatus = {
        status: "rejected",
        rejectedBy: userId,
        rejectedAt: new Date(),
        rejectionReason: req.body.rejectionReason,
        comments: req.body.comments,
      };
      await job.save();

      res.json({
        success: true,
        data: job,
        message: "Job rejected and returned to draft",
      });
    } catch (error) {
      next(error);
    }
  }

  // Publish job (recruiter/admin)
  static async publishJob(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: { message: "Authentication required", code: "AUTH_REQUIRED" },
        });
        return;
      }

      // Only recruiter and admin can publish
      if (!["recruiter", "admin"].includes(userRole || "")) {
        res.status(403).json({
          success: false,
          error: {
            message: "Only recruiters can publish jobs",
            code: "FORBIDDEN",
          },
        });
        return;
      }

      const job = await Job.findById(id);

      if (!job) {
        res.status(404).json({
          success: false,
          error: { message: "Job not found", code: "JOB_NOT_FOUND" },
        });
        return;
      }

      // Can only publish approved jobs
      if (job.status !== JobStatus.APPROVED) {
        res.status(400).json({
          success: false,
          error: {
            message: "Can only publish jobs in approved status",
            code: "INVALID_STATUS",
          },
        });
        return;
      }

      // Generate public link if not exists
      if (!job.publicLink) {
        const slug = job.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        job.publicLink = `${slug}-${job._id.toString().slice(-6)}`;
      }

      // Update status
      job.status = JobStatus.PUBLISHED;
      job.isActive = true;
      job.publishedBy = userId;
      job.publishedAt = new Date();
      await job.save();

      res.json({
        success: true,
        data: job,
        message: "Job published successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Close job
  static async closeJob(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: { message: "Authentication required", code: "AUTH_REQUIRED" },
        });
        return;
      }

      const job = await Job.findById(id);

      if (!job) {
        res.status(404).json({
          success: false,
          error: { message: "Job not found", code: "JOB_NOT_FOUND" },
        });
        return;
      }

      // Check permissions
      const canClose =
        job.createdBy === userId ||
        userRole === "admin" ||
        userRole === "hiring-manager";

      if (!canClose) {
        res.status(403).json({
          success: false,
          error: {
            message: "Unauthorized to close this job",
            code: "UNAUTHORIZED",
          },
        });
        return;
      }

      // Can only close published jobs
      if (job.status !== JobStatus.PUBLISHED) {
        res.status(400).json({
          success: false,
          error: {
            message: "Can only close jobs in published status",
            code: "INVALID_STATUS",
          },
        });
        return;
      }

      // Update status
      job.status = JobStatus.CLOSED;
      job.isActive = false;
      job.closedAt = new Date();
      job.closureReason = req.body.closureReason || "Manually closed";
      await job.save();

      res.json({
        success: true,
        data: job,
        message: "Job closed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Get job statistics
  static async getJobStats(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: { message: "Authentication required", code: "AUTH_REQUIRED" },
        });
        return;
      }

      const matchQuery: Record<string, unknown> = {};

      // Role-based filtering
      if (userRole !== "admin") {
        matchQuery.createdBy = userId;
      }

      const stats = await Job.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalViews: { $sum: "$viewsCount" },
            totalApplications: { $sum: "$applicationsCount" },
          },
        },
      ]);

      const formattedStats: Record<string, number> = {
        draft: 0,
        pending_approval: 0,
        approved: 0,
        published: 0,
        closed: 0,
        filled: 0,
        cancelled: 0,
        total: 0,
        totalViews: 0,
        totalApplications: 0,
      };

      stats.forEach((stat) => {
        const status = stat._id as string;
        if (status in formattedStats) {
          formattedStats[status] = stat.count;
        }
        formattedStats.total += stat.count;
        formattedStats.totalViews += stat.totalViews || 0;
        formattedStats.totalApplications += stat.totalApplications || 0;
      });

      res.json({
        success: true,
        data: formattedStats,
      });
    } catch (error) {
      next(error);
    }
  }
}
