import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate, authSchemas } from '../middleware/validation';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 150 * 60 * 1000, // 15 minutes
  max: 500, // 5 requests per window
  message: 'Too many authentication attempts, please try again later',
});

// Public routes
router.post('/register', authLimiter, validate(authSchemas.register), AuthController.register);
router.post('/login', validate(authSchemas.login), AuthController.login);
router.post('/refresh-token', validate(authSchemas.refreshToken), AuthController.refreshToken);
router.post('/logout', validate(authSchemas.logout), AuthController.logout);

// Protected routes
router.get('/me', authenticate, AuthController.getCurrentUser);

// Internal route for token verification (used by API Gateway)
router.post('/verify', AuthController.verifyToken);

export default router;

