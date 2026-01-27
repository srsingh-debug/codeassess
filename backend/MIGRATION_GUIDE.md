# Migration Guide: Convex → Microservices

This guide helps you migrate your frontend from Convex backend to the new microservices architecture.

## Overview of Changes

| Aspect | Before (Convex) | After (Microservices) |
|--------|----------------|----------------------|
| **Backend** | Convex serverless | Node.js microservices |
| **Database** | Convex DB | MongoDB |
| **API Style** | Convex mutations/queries | REST APIs |
| **Authentication** | Convex auth | JWT tokens |
| **URL** | Convex cloud | http://localhost:3000 |

## Step-by-Step Migration

### 1. Update API Base URL

**Before:**
```typescript
// Using Convex client
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL);
```

**After:**
```typescript
// Using axios or fetch
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 2. Update Authentication

**Before (Convex):**
```typescript
const { isLoading, isAuthenticated } = useConvexAuth();
```

**After (JWT):**
```typescript
// src/utils/api.ts
export const setAuthToken = (token: string) => {
  localStorage.setItem('accessToken', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  localStorage.removeItem('accessToken');
  delete api.defaults.headers.common['Authorization'];
};

// src/hooks/useAuth.ts
export const useAuth = () => {
  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data.data;
    
    setAuthToken(accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  };

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  return { login, logout };
};
```

### 3. Update API Calls

#### Jobs API

**Before (Convex):**
```typescript
// Get jobs
const jobs = useQuery(api.jobs.getPublishedJobsFunction);

// Create job
const createJob = useMutation(api.jobs.createJobFunction);
await createJob({ title, description, ... });
```

**After (REST):**
```typescript
// Get jobs
export const getJobs = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const response = await api.get('/jobs', { params });
  return response.data;
};

// Create job
export const createJob = async (jobData: CreateJobDto) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

// In component
const { data: jobs, isLoading } = useQuery(['jobs'], () => getJobs());
```

#### Applications API

**Before (Convex):**
```typescript
const createApplication = useMutation(api.applications.createApplicationFunction);
await createApplication({ jobId, candidateId, answers });
```

**After (REST):**
```typescript
export const createApplication = async (applicationData: {
  jobId: string;
  candidateId: string;
  answers: Array<{
    questionId: string;
    questionText: string;
    answer: string;
  }>;
}) => {
  const response = await api.post('/applications', applicationData);
  return response.data;
};
```

#### Candidates API

**Before (Convex):**
```typescript
const updateCandidate = useMutation(api.candidates.updateCandidateFunction);
```

**After (REST):**
```typescript
export const updateCandidateProfile = async (updates: UpdateCandidateDto) => {
  const response = await api.put('/candidates/profile', updates);
  return response.data;
};

export const getCandidateProfile = async () => {
  const response = await api.get('/candidates/profile');
  return response.data;
};
```

#### Assessments API

**Before (Convex):**
```typescript
const assessments = useQuery(api.assessments.getAllAssessmentsFunction);
const createAssessment = useMutation(api.assessments.createAssessmentFunction);
```

**After (REST):**
```typescript
export const getAssessments = async () => {
  const response = await api.get('/assessments');
  return response.data;
};

export const createAssessment = async (assessmentData: CreateAssessmentDto) => {
  const response = await api.post('/assessments', assessmentData);
  return response.data;
};

export const startAssessment = async (assessmentId: string) => {
  const response = await api.post('/assessments/attempts/start', { assessmentId });
  return response.data;
};

export const submitAssessment = async (attemptId: string, data: {
  answers: Array<{ questionId: string; answer: string }>;
  timeSpent: number;
}) => {
  const response = await api.post(`/assessments/attempts/${attemptId}/submit`, data);
  return response.data;
};
```

### 4. Create API Service Layer

Create `src/services/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout user
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string; role: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),
  getCurrentUser: () =>
    api.get('/auth/me'),
};

// Jobs API
export const jobsApi = {
  getAll: (params?: any) => api.get('/jobs', { params }),
  getById: (id: string) => api.get(`/jobs/${id}`),
  getByPublicLink: (link: string) => api.get(`/jobs/public/${link}`),
  create: (data: any) => api.post('/jobs', data),
  update: (id: string, data: any) => api.put(`/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/jobs/${id}`),
  getStats: () => api.get('/jobs/stats'),
};

// Candidates API
export const candidatesApi = {
  getProfile: () => api.get('/candidates/profile'),
  updateProfile: (data: any) => api.put('/candidates/profile', data),
  getAll: (params?: any) => api.get('/candidates', { params }),
  getById: (id: string) => api.get(`/candidates/${id}`),
  getStats: () => api.get('/candidates/stats'),
};

// Applications API
export const applicationsApi = {
  create: (data: any) => api.post('/applications', data),
  getById: (id: string) => api.get(`/applications/${id}`),
  getByJob: (jobId: string, params?: any) =>
    api.get(`/applications/job/${jobId}`, { params }),
  getByCandidate: (candidateId: string, params?: any) =>
    api.get(`/applications/candidate/${candidateId}`, { params }),
  updateStatus: (id: string, data: { status: string; notes?: string }) =>
    api.put(`/applications/${id}/status`, data),
  getStats: (params?: any) => api.get('/applications/stats', { params }),
};

// Assessments API
export const assessmentsApi = {
  getAll: (params?: any) => api.get('/assessments', { params }),
  getById: (id: string) => api.get(`/assessments/${id}`),
  create: (data: any) => api.post('/assessments', data),
  update: (id: string, data: any) => api.put(`/assessments/${id}`, data),
  delete: (id: string) => api.delete(`/assessments/${id}`),
  startAttempt: (assessmentId: string) =>
    api.post('/assessments/attempts/start', { assessmentId }),
  submitAttempt: (attemptId: string, data: any) =>
    api.post(`/assessments/attempts/${attemptId}/submit`, data),
  getMyAttempts: () => api.get('/assessments/attempts/my-attempts'),
  getStats: (params?: any) => api.get('/assessments/stats', { params }),
};
```

### 5. Update React Query Hooks

Create custom hooks for data fetching:

```typescript
// src/hooks/useJobs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '../services/api';

export const useJobs = (params?: any) => {
  return useQuery(['jobs', params], () => jobsApi.getAll(params));
};

export const useJob = (id: string) => {
  return useQuery(['job', id], () => jobsApi.getById(id));
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation(jobsApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, data }: { id: string; data: any }) => jobsApi.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['jobs']);
      },
    }
  );
};
```

### 6. Update Environment Variables

Create `.env` file:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

For production:
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
```

### 7. Update Package.json

Remove Convex dependencies:
```bash
npm uninstall convex
```

Add axios and react-query:
```bash
npm install axios @tanstack/react-query
```

### 8. Remove Convex-specific Code

Delete or update:
- `convex.json`
- `src/convex/` directory (old Convex functions)
- Convex provider from `App.tsx`

## Testing the Migration

1. **Start backend services:**
```bash
cd backend
docker-compose up -d
```

2. **Verify API Gateway is running:**
```bash
curl http://localhost:3000/health
```

3. **Start frontend:**
```bash
npm run dev
```

4. **Test authentication flow:**
   - Register a new user
   - Login
   - Verify token is stored
   - Make authenticated requests

5. **Test each feature:**
   - Jobs listing
   - Job creation
   - Application submission
   - Assessment taking

## Common Issues & Solutions

### CORS Errors
The API Gateway has CORS enabled. If you face issues, update `backend/api-gateway/src/index.ts`:
```typescript
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
}));
```

### Authentication Errors
Ensure token is included in requests:
```typescript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Response Format Differences
All responses now follow this format:
```typescript
{
  success: boolean;
  data?: any;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}
```

## Rollback Plan

If needed, you can keep both backends running:
1. Keep Convex as fallback
2. Gradually migrate features
3. Use feature flags to switch between backends

## Benefits of Migration

✅ Full control over backend logic
✅ Better scalability
✅ Standard REST APIs
✅ Independent service deployment
✅ Better monitoring and logging
✅ Cost-effective for production
✅ Industry-standard architecture

---

**Need help?** Check the backend README.md or ARCHITECTURE.md for more details!

