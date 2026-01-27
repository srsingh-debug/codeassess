# 🚀 Quick Start Guide - CodeAssess Microservices

Get your CodeAssess backend up and running in minutes!

## Prerequisites

- ✅ Docker & Docker Compose installed
- ✅ Node.js 20+ (for local development)
- ✅ Git

## 🏃 Fast Start with Docker (Recommended)

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Start all services
```bash
docker-compose up -d
```

This will start:
- MongoDB (Port 27017)
- Auth Service (Port 3001)
- Job Service (Port 3002)
- Candidate Service (Port 3003)
- Application Service (Port 3004)
- Assessment Service (Port 3005)
- API Gateway (Port 3000) - **Your main endpoint**

### 3. Verify services are running
```bash
curl http://localhost:3000/health
```

You should see:
```json
{
  "status": "ok",
  "service": "api-gateway",
  "services": {
    "auth": true,
    "job": true,
    "candidate": true,
    "application": true,
    "assessment": true
  }
}
```

### 4. Test the API

**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin User",
    "role": "admin"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

Save the `accessToken` from the response!

**Create a job (use the token):**
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Senior Software Engineer",
    "description": "We are looking for a senior software engineer...",
    "location": "Remote",
    "requiredSkills": ["JavaScript", "React", "Node.js"],
    "experience": "5+ years",
    "applicationDeadline": "2024-12-31T23:59:59Z",
    "status": "published"
  }'
```

**Get all jobs:**
```bash
curl http://localhost:3000/api/jobs \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🛠️ Local Development Setup

### 1. Install dependencies for all services
```bash
npm run install:all
```

### 2. Start MongoDB
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

### 3. Copy environment files
```bash
for dir in auth-service job-service candidate-service application-service assessment-service api-gateway; do
  cp $dir/env.example $dir/.env
done
```

### 4. Start services (in separate terminals)

**Terminal 1 - Auth Service:**
```bash
npm run dev:auth
```

**Terminal 2 - Job Service:**
```bash
npm run dev:job
```

**Terminal 3 - Candidate Service:**
```bash
npm run dev:candidate
```

**Terminal 4 - Application Service:**
```bash
npm run dev:application
```

**Terminal 5 - Assessment Service:**
```bash
npm run dev:assessment
```

**Terminal 6 - API Gateway:**
```bash
npm run dev:gateway
```

All services should start and connect to MongoDB!

## 📝 Common Commands

### Docker Commands
```bash
# Start all services
npm run docker:up

# Stop all services
npm run docker:down

# View logs
npm run docker:logs

# View specific service logs
docker-compose logs -f auth-service

# Rebuild services
npm run docker:build

# Restart services
npm run docker:restart
```

### Development Commands
```bash
# Install all dependencies
npm run install:all

# Build all services
npm run build:all

# Run specific service in dev mode
npm run dev:auth
npm run dev:job
npm run dev:candidate
npm run dev:application
npm run dev:assessment
npm run dev:gateway
```

## 🧪 Testing the System

### 1. Register Admin User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Test Admin",
    "role": "admin"
  }'
```

### 2. Register Candidate User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@test.com",
    "password": "candidate123",
    "name": "Test Candidate",
    "role": "candidate"
  }'
```

### 3. Create Job (as Admin)
Login as admin, get token, then:
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Full Stack Developer",
    "description": "Join our amazing team!",
    "location": "New York",
    "requiredSkills": ["JavaScript", "Python"],
    "experience": "3-5 years",
    "applicationDeadline": "2024-12-31",
    "status": "published"
  }'
```

### 4. Apply for Job (as Candidate)
Login as candidate, get token, then:
```bash
curl -X POST http://localhost:3000/api/applications \
  -H "Authorization: Bearer CANDIDATE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "JOB_ID_FROM_STEP_3",
    "candidateId": "CANDIDATE_ID",
    "answers": [
      {
        "questionId": "q1",
        "questionText": "Why do you want to join?",
        "answer": "I am passionate about..."
      }
    ]
  }'
```

### 5. Create Assessment (as Admin)
```bash
curl -X POST http://localhost:3000/api/assessments \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript Assessment",
    "description": "Test your JS knowledge",
    "questions": [
      {
        "text": "What is closure in JavaScript?",
        "type": "text",
        "points": 10
      },
      {
        "text": "What does === operator do?",
        "type": "multiple-choice",
        "options": ["Equality check", "Strict equality", "Assignment"],
        "correctAnswer": "Strict equality",
        "points": 5
      }
    ],
    "duration": 60,
    "passingScore": 70,
    "status": "published"
  }'
```

## 🔍 Monitoring

### Check Service Health
```bash
# API Gateway health (checks all services)
curl http://localhost:3000/health

# Individual service health
curl http://localhost:3001/health  # Auth
curl http://localhost:3002/health  # Job
curl http://localhost:3003/health  # Candidate
curl http://localhost:3004/health  # Application
curl http://localhost:3005/health  # Assessment
```

### View Service Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f auth-service
docker-compose logs -f api-gateway
```

## 🐛 Troubleshooting

### Services not starting?
```bash
# Check if ports are already in use
lsof -i :3000  # API Gateway
lsof -i :3001  # Auth Service
lsof -i :27017 # MongoDB

# Kill process using port
kill -9 <PID>
```

### MongoDB connection issues?
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Restart MongoDB
docker restart mongodb
```

### Services can't connect to each other?
```bash
# Check Docker network
docker network ls
docker network inspect backend_codeassess-network

# Ensure all services are on same network
```

### Clear everything and restart?
```bash
# Stop and remove all containers
docker-compose down -v

# Remove all data
docker volume prune

# Rebuild and start fresh
docker-compose up --build -d
```

## 📚 Next Steps

1. ✅ Read [README.md](./README.md) for complete documentation
2. ✅ Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. ✅ Review API endpoints in README
4. ✅ Set up your frontend to connect to `http://localhost:3000`
5. ✅ Customize environment variables for production

## 🎉 Success!

Your CodeAssess backend is now running! All services are:
- ✅ Containerized with Docker
- ✅ Connected via API Gateway
- ✅ Secured with JWT authentication
- ✅ Ready for production scaling

**API Gateway URL**: http://localhost:3000
**All requests should go through the gateway!**

Happy coding! 🚀

