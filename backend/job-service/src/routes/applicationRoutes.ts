import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { ApplicationController } from "../controllers/applicationController";

const router = Router();

// Candidate routes
router.post(
  "/apply",
  authenticate,
  //authorize("candidate"),
  ApplicationController.applyForJob,
);
router.get(
  "/my-applications",
  authenticate,
  //authorize("candidate"),
  ApplicationController.getMyApplications,
);

router.get('/:jobId', ApplicationController.getJobApplications);

// Recruiter/Admin routes
router.get(
  "/job/:jobId",
  authenticate,
  authorize("recruiter", "admin"),
  ApplicationController.getJobApplications,
);
router.patch(
  "/:id/status",
  authenticate,
  authorize("recruiter", "admin"),
  ApplicationController.updateStatus,
);

export default router;
