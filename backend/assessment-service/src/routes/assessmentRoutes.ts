import { Router } from 'express';
import { AssessmentController } from '../controllers/assessmentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Assessment routes
router.get('/', authenticate, AssessmentController.getAssessments);
router.get('/stats', authenticate, authorize('admin'), AssessmentController.getAssessmentStats);
router.get('/:id', authenticate, AssessmentController.getAssessmentById);
router.post('/', authenticate, authorize('admin'), AssessmentController.createAssessment);
router.put('/:id', authenticate, authorize('admin'), AssessmentController.updateAssessment);
router.delete('/:id', authenticate, authorize('admin'), AssessmentController.deleteAssessment);

// Attempt routes
router.post('/attempts/start', authenticate, AssessmentController.startAttempt);
router.post('/attempts/:attemptId/submit', authenticate, AssessmentController.submitAttempt);
router.get('/attempts/my-attempts', authenticate, AssessmentController.getAttemptsByCandidate);

export default router;

