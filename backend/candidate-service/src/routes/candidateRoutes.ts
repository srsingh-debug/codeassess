import { Router } from 'express';
import { CandidateController } from '../controllers/candidateController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Candidate routes
router.get('/profile', authenticate, CandidateController.getOrCreateProfile);
router.put('/profile', authenticate, CandidateController.updateProfile);
router.delete('/profile', authenticate, CandidateController.deleteProfile);

// Admin routes
router.get('/', authenticate, authorize('admin'), CandidateController.getAllCandidates);
router.get('/stats', authenticate, authorize('admin'), CandidateController.getCandidateStats);
router.get('/:id', authenticate, authorize('admin'), CandidateController.getCandidateById);

export default router;

