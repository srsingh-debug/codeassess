import { Router } from 'express';
import { ApplicationController } from '../controllers/applicationController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Application routes
router.post('/', authenticate, ApplicationController.createApplication);
router.get('/stats', authenticate, authorize('admin'), ApplicationController.getApplicationStats);
router.get('/:id', authenticate, ApplicationController.getApplicationById);
router.get('/job/:jobId', authenticate, authorize('admin'), ApplicationController.getApplicationsByJob);
router.get('/candidate/:candidateId', authenticate, ApplicationController.getApplicationsByCandidate);
router.put('/:id/status', authenticate, authorize('admin'), ApplicationController.updateApplicationStatus);
router.delete('/:id', authenticate, authorize('admin'), ApplicationController.deleteApplication);

export default router;

