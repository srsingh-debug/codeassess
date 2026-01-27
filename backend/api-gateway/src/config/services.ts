export const SERVICES = {
  AUTH: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  JOB: process.env.JOB_SERVICE_URL || 'http://localhost:3002',
  CANDIDATE: process.env.CANDIDATE_SERVICE_URL || 'http://localhost:3003',
  APPLICATION: process.env.APPLICATION_SERVICE_URL || 'http://localhost:3004',
  ASSESSMENT: process.env.ASSESSMENT_SERVICE_URL || 'http://localhost:3005',
};

export const SERVICE_ROUTES = {
  '/api/auth': SERVICES.AUTH,
  '/api/jobs': SERVICES.JOB,
  '/api/candidates': SERVICES.CANDIDATE,
  '/api/applications': SERVICES.APPLICATION,
  '/api/assessments': SERVICES.ASSESSMENT,
};

