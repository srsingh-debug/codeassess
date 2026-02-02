import { Router } from 'express';
import { JobController } from '../controllers/jobController';
import { authenticate, authorize } from '../middleware/auth';
import { validate, jobSchemas } from '../middleware/validation';

const router = Router();

// Public routes (no authentication required)
router.get('/public', JobController.getPublicJobs);
router.get('/public/:link', JobController.getJobByPublicLink);

// Protected routes - Job CRUD
router.get('/',authenticate, JobController.getJobs);
router.get('/stats', authenticate, JobController.getJobStats);
router.get('/:id', authenticate, JobController.getJobById);
router.post(
  '/',
  authenticate,
  authorize('recruiter', 'hiring-manager', 'admin'),
  validate(jobSchemas.create),
  JobController.createJob
);
router.put(
  '/:id',
  authenticate,
  authorize('recruiter', 'hiring-manager', 'admin'),
  validate(jobSchemas.update),
  JobController.updateJob
);
router.delete(
  '/:id',
  authenticate,
  authorize('recruiter', 'hiring-manager', 'admin'),
  JobController.deleteJob
);

// Approval workflow routes
router.post(
  '/:id/submit',
  authenticate,
  authorize('recruiter', 'hiring-manager', 'admin'),
  validate(jobSchemas.submit),
  JobController.submitForApproval
);
router.post(
  '/:id/approve',
  authenticate,
  authorize('hiring-manager', 'admin'),
  validate(jobSchemas.approve),
  JobController.approveJob
);
router.post(
  '/:id/reject',
  authenticate,
  authorize('hiring-manager', 'admin'),
  validate(jobSchemas.reject),
  JobController.rejectJob
);
router.post(
  '/:id/publish',
  authenticate,
  authorize('recruiter', 'admin'),
  JobController.publishJob
);
router.post(
  '/:id/close',
  authenticate,
  authorize('recruiter', 'hiring-manager', 'admin'),
  JobController.closeJob
);



export default router;

