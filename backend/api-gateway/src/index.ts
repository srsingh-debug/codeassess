import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import proxyRoutes from './routes/proxy';
import { generalLimiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/logger';
import axios from 'axios';
import { SERVICES } from './config/services';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;



// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(generalLimiter);

// Health check
app.get('/health', async (req, res) => {
  const services = {
    auth: false,
    job: false,
    candidate: false,
    application: false,
    assessment: false,
  };

  // Check all services
  try {
    await axios.get(`${SERVICES.AUTH}/health`, { timeout: 2000 });
    services.auth = true;
  } catch {}

  try {
    await axios.get(`${SERVICES.JOB}/health`, { timeout: 2000 });
    services.job = true;
  } catch {}

  try {
    await axios.get(`${SERVICES.CANDIDATE}/health`, { timeout: 2000 });
    services.candidate = true;
  } catch {}

  try {
    await axios.get(`${SERVICES.APPLICATION}/health`, { timeout: 2000 });
    services.application = true;
  } catch {}

  try {
    await axios.get(`${SERVICES.ASSESSMENT}/health`, { timeout: 2000 });
    services.assessment = true;
  } catch {}

  const allHealthy = Object.values(services).every((status) => status);

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ok' : 'degraded',
    service: 'api-gateway',
    services,
  });
});

// API routes
app.use('/api-gateway', proxyRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND',
    },
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Gateway Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR',
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\n📡 Service URLs:');
  console.log(`  - Auth Service: ${SERVICES.AUTH}`);
  console.log(`  - Job Service: ${SERVICES.JOB}`);
  console.log(`  - Candidate Service: ${SERVICES.CANDIDATE}`);
  console.log(`  - Application Service: ${SERVICES.APPLICATION}`);
  console.log(`  - Assessment Service: ${SERVICES.ASSESSMENT}`);
});

