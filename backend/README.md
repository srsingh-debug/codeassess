# CodeAssess Backend - Microservices Architecture

A production-ready microservices architecture for the CodeAssess recruitment and assessment platform.

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   React App     │
│   (Frontend)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                             │
│                    (Port 3000)                               │
│  - Rate Limiting                                             │
│  - Request Routing                                           │
│  - Load Balancing                                            │
└─────┬──────┬──────┬──────┬──────┬────────────────────────────┘
      │      │      │      │      │
      ▼      ▼      ▼      ▼      ▼
   ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
   │Auth│ │Job │ │Cand│ │App │ │Asse│
   │Svc │ │Svc │ │Svc │ │Svc │ │Svc │
   └─┬──┘ └─┬──┘ └─┬──┘ └─┬──┘ └─┬──┘
     │      │      │      │      │
     ▼      ▼      ▼      ▼      ▼
   ┌────────────────────────────────┐
   │         MongoDB                │
   │  (Separate DBs per service)    │
   └────────────────────────────────┘
```

## 🚀 Services

### 1. **API Gateway** (Port 3000)
- Single entry point for all client requests
- Request routing to appropriate microservices
- Rate limiting and request throttling
- Service health monitoring
- Centralized logging

### 2. **Auth Service** (Port 3001)
- User registration and authentication
- JWT token generation and validation
- Refresh token management
- Password hashing with bcrypt
- Role-based access control (Admin/Candidate)

### 3. **Job Service** (Port 3002)
- Job posting management
- Job search and filtering
- Public job links
- Job statistics
- Admin-only job creation and editing

### 4. **Candidate Service** (Port 3003)
- Candidate profile management
- Skills and experience tracking
- Resume management
- Candidate search (admin)
- Profile updates

### 5. **Application Service** (Port 3004)
- Job application management
- Application status tracking
- Pre-screening answers
- Application statistics
- Admin review and notes

### 6. **Assessment Service** (Port 3005)
- Assessment creation and management
- Multiple question types (multiple-choice, text, coding)
- Assessment attempts tracking
- Auto-scoring for objective questions
- Time tracking and limits
- Assessment statistics

## 📦 Technology Stack

- **Runtime**: Node.js 20 with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (separate DB per service)
- **Authentication**: JWT + Refresh Tokens
- **API Gateway**: http-proxy-middleware
- **Containerization**: Docker & Docker Compose
- **Security**: Helmet, CORS, bcrypt, rate-limiting
- **Validation**: Joi

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 20+ and npm
- Docker and Docker Compose
- MongoDB (if running locally without Docker)

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Set environment variables**
```bash
# Copy environment files
cp api-gateway/env.example api-gateway/.env
cp auth-service/env.example auth-service/.env
cp job-service/env.example job-service/.env
cp candidate-service/env.example candidate-service/.env
cp application-service/env.example application-service/.env
cp assessment-service/env.example assessment-service/.env

# Update .env files with your configuration
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Check service health**
```bash
curl http://localhost:3000/health
```

5. **View logs**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f auth-service
```

### Option 2: Local Development

1. **Install dependencies for all services**
```bash
# Run this in each service directory
cd auth-service && npm install
cd ../job-service && npm install
cd ../candidate-service && npm install
cd ../application-service && npm install
cd ../assessment-service && npm install
cd ../api-gateway && npm install
```

2. **Start MongoDB**
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Or use local MongoDB installation
```

3. **Start services in development mode**

Open 6 terminal windows and run:
```bash
# Terminal 1 - Auth Service
cd auth-service && npm run dev

# Terminal 2 - Job Service
cd job-service && npm run dev

# Terminal 3 - Candidate Service
cd candidate-service && npm run dev

# Terminal 4 - Application Service
cd application-service && npm run dev

# Terminal 5 - Assessment Service
cd assessment-service && npm run dev

# Terminal 6 - API Gateway
cd api-gateway && npm run dev
```

## 📡 API Endpoints

### Authentication (`/api/auth`)
```
POST   /api/auth/register         - Register new user
POST   /api/auth/login            - Login user
POST   /api/auth/refresh-token    - Refresh access token
POST   /api/auth/logout           - Logout user
GET    /api/auth/me               - Get current user
POST   /api/auth/verify           - Verify token (internal)
```

### Jobs (`/api/jobs`)
```
GET    /api/jobs                  - Get all jobs (with filters)
GET    /api/jobs/:id              - Get job by ID
GET    /api/jobs/public/:link     - Get job by public link
POST   /api/jobs                  - Create job (admin)
PUT    /api/jobs/:id              - Update job (admin)
DELETE /api/jobs/:id              - Delete job (admin)
GET    /api/jobs/stats            - Get job statistics (admin)
```

### Candidates (`/api/candidates`)
```
GET    /api/candidates/profile    - Get/create current user profile
PUT    /api/candidates/profile    - Update profile
DELETE /api/candidates/profile    - Delete profile
GET    /api/candidates            - Get all candidates (admin)
GET    /api/candidates/:id        - Get candidate by ID (admin)
GET    /api/candidates/stats      - Get candidate statistics (admin)
```

### Applications (`/api/applications`)
```
POST   /api/applications                    - Create application
GET    /api/applications/:id                - Get application by ID
GET    /api/applications/job/:jobId         - Get applications by job (admin)
GET    /api/applications/candidate/:candidateId - Get applications by candidate
PUT    /api/applications/:id/status         - Update application status (admin)
DELETE /api/applications/:id                - Delete application (admin)
GET    /api/applications/stats              - Get application statistics (admin)
```

### Assessments (`/api/assessments`)
```
GET    /api/assessments                     - Get all assessments
GET    /api/assessments/:id                 - Get assessment by ID
POST   /api/assessments                     - Create assessment (admin)
PUT    /api/assessments/:id                 - Update assessment (admin)
DELETE /api/assessments/:id                 - Delete assessment (admin)
GET    /api/assessments/stats               - Get assessment statistics (admin)
POST   /api/assessments/attempts/start      - Start assessment attempt
POST   /api/assessments/attempts/:attemptId/submit - Submit assessment
GET    /api/assessments/attempts/my-attempts - Get candidate attempts
```

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Refresh Tokens**: Long-lived tokens for session management
3. **Password Hashing**: bcrypt with salt rounds
4. **Rate Limiting**: Prevent brute force attacks
5. **Helmet**: Security headers
6. **CORS**: Controlled cross-origin access
7. **Input Validation**: Joi validation for all inputs
8. **Role-Based Access**: Admin and Candidate roles
9. **Service-to-Service Auth**: Token verification between services

## 📊 Database Design

Each service has its own MongoDB database:

- `codeassess_auth` - User accounts and tokens
- `codeassess_jobs` - Job postings
- `codeassess_candidates` - Candidate profiles
- `codeassess_applications` - Job applications
- `codeassess_assessments` - Assessments and attempts

## 🧪 Testing

```bash
# Unit tests (to be implemented)
npm test

# Integration tests (to be implemented)
npm run test:integration

# E2E tests (to be implemented)
npm run test:e2e
```

## 📈 Monitoring & Logging

- Request/Response logging in API Gateway
- Service health checks at `/health` endpoint
- Error logging with stack traces
- Aggregated logs via Docker Compose

## 🔧 Environment Variables

### API Gateway
```env
PORT=3000
NODE_ENV=development
AUTH_SERVICE_URL=http://localhost:3001
JOB_SERVICE_URL=http://localhost:3002
CANDIDATE_SERVICE_URL=http://localhost:3003
APPLICATION_SERVICE_URL=http://localhost:3004
ASSESSMENT_SERVICE_URL=http://localhost:3005
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Auth Service
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/codeassess_auth
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=30d
```

### Other Services
See individual `env.example` files in each service directory.

## 🚀 Deployment

### Docker Compose
```bash
# Production build and start
docker-compose -f docker-compose.yml up -d

# Scale services
docker-compose up -d --scale job-service=3

# Update services
docker-compose pull
docker-compose up -d
```

### Kubernetes (Coming Soon)
Kubernetes manifests for production deployment.

## 🔄 Development Workflow

1. Make changes to service code
2. Service auto-reloads (in dev mode)
3. Test via API Gateway at `http://localhost:3000`
4. Run tests
5. Commit and push changes

## 📝 API Response Format

All APIs return consistent response format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@codeassess.com

---

**Built with ❤️ using Microservices Architecture**

