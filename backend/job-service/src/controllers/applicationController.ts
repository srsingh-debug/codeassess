import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import Application, { ApplicationStatus } from "../models/Application";
import { Job, JobStatus } from "../models/Job";

export class ApplicationController {
  /**
   * CANDIDATE: Apply for a job
   */
  static async applyForJob(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      // if (!userId || userRole !== "candidate") {
      //   res.status(403).json({
      //     success: false,
      //     error: {
      //       message: "Only candidates can apply for jobs",
      //       code: "FORBIDDEN",
      //     },
      //   });
      //   return;
      // }

      const { jobId, ...candidateDetails } = req.body;

      // 1. Check if job exists and is published
      const job = await Job.findById(jobId);
      // if (!job || job.status !== JobStatus.PUBLISHED || !job.isActive) {
      //   res.status(400).json({
      //     success: false,
      //     error: {
      //       message: "Job is no longer accepting applications",
      //       code: "JOB_NOT_AVAILABLE",
      //     },
      //   });
      //   return;
      // }

      // 2. Check for duplicate application
      const existingApplication = await Application.findOne({
        jobId,
        candidateId: userId,
      });
      // if (existingApplication) {
      //   res.status(400).json({
      //     success: false,
      //     error: {
      //       message: "You have already applied for this job",
      //       code: "DUPLICATE_APPLICATION",
      //     },
      //   });
      //   return;
      // }

      // 3. Map pre-screening questions if they come from frontend `answers` object
      // Based on ApplyJobPage.tsx: question "2" is interest, "3" is salary
      //const finalRoleInterest = roleInterest || (answers && answers["2"]);
      //const finalExpectedSalary =
        //expectedSalaryRange || (answers && answers["3"]);

      // 4. Create application
      const application = await Application.create({
        jobId,
        candidateId: userId,
        ...candidateDetails,
        status: ApplicationStatus.APPLIED,
      });

      // 5. Increment job application count
      await (job as any).incrementApplications();

      res.status(201).json({
        success: true,
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * RECRUITER/ADMIN: Get all applications for a specific job
   */
  static async getJobApplications(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { jobId } = req.params;
      const applications = await Application.find({ jobId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CANDIDATE: Get my applications
   */
  static async getMyApplications(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      const applications = await Application.find({ candidateId: userId }).sort(
        { createdAt: -1 },
      );

      res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * RECRUITER/ADMIN: Update application status (Checkpoints 4-8)
   */
  static async updateStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!Object.values(ApplicationStatus).includes(status)) {
        res.status(400).json({
          success: false,
          error: { message: "Invalid status", code: "INVALID_STATUS" },
        });
        return;
      }

      const application = await Application.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true },
      );

      if (!application) {
        res.status(404).json({
          success: false,
          error: { message: "Application not found", code: "NOT_FOUND" },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }
}
