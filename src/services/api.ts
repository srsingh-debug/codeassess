import axios, { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_AUTH_URL || "http://localhost:3000/api-gateway";

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// // Request interceptor to add auth token
// jobsApiInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// // Response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       localStorage.removeItem("auth-user");
//       // Redirect to login page if not already there
//       if (window.location.pathname !== "/auth") {
//         window.location.href = "/auth";
//       }
//     }
//     return Promise.reject(error);
//   },
// );

// // Response interceptor to handle errors
// jobsApiInstance.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       localStorage.removeItem("auth-user");
//       // Redirect to login page if not already there
//       if (window.location.pathname !== "/auth") {
//         window.location.href = "/auth";
//       }
//     }
//     return Promise.reject(error);
//   },
// );

const requestInterceptor = (config: any) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Response interceptor (handle 401)
const responseInterceptor = (response: any) => response;

const responseErrorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("auth-user");
    if (window.location.pathname !== "/auth") {
      window.location.href = "/auth";
    }
  }
  return Promise.reject(error);
};

// Attach interceptors to both instances
[api].forEach((instance) => {
  instance.interceptors.request.use(requestInterceptor, (error) =>
    Promise.reject(error),
  );
  instance.interceptors.response.use(
    responseInterceptor,
    responseErrorInterceptor,
  );
});

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/api/auth/login", { email, password });
    return response.data;
  },

  register: async (data: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }) => {
    const response = await api.post("/auth/api/auth/register", data);
    return response.data;
  },

  logout: async (refreshToken?: string) => {
    const response = await api.post("/auth/api/auth/logout", { refreshToken });
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post("/auth/api/auth/refresh-token", { refreshToken });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/api/auth/me");
    return response.data;
  },

  verifyToken: async (token: string) => {
    const response = await api.post(
      "/auth/verify",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  },
};

// Helper functions for token management
export const setAuthToken = (accessToken: string, refreshToken?: string) => {
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("auth-user");
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

// Application Status Enum
export enum ApplicationStatus {
  APPLIED = "applied",
  SHORTLISTED = "shortlisted",
  INTERVIEW = "interview",
  OFFERED = "offered",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
}

// Job API
export interface JobCreateData {
  title: string;
  description: string;
  shortDescription?: string;
  location: string;
  workLocationType: "remote" | "onsite" | "hybrid";
  employmentType:
    | "full-time"
    | "part-time"
    | "contract"
    | "internship"
    | "temporary";
  requirements: {
    minExperience?: number;
    maxExperience?: number;
    education?: string[];
    certifications?: string[];
    skills: string[];
    languages?: string[];
    visaSponsorship?: boolean;
  };
  compensation?: {
    min?: number;
    max?: number;
    currency: string;
    period: "hourly" | "monthly" | "yearly";
    equity?: string;
    benefits?: string[];
  };
  applicationSettings: {
    requireCoverLetter: boolean;
    requirePortfolio: boolean;
    requireReferences: boolean;
    maxApplications?: number;
    autoRejectThreshold?: number;
    assessmentRequired: boolean;
    assessmentId?: string;
  };
  applicationDeadline?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  department?: string;
  team?: string;
  reportingTo?: string;
  tags?: string[];
  internalNotes?: string;
  companyInfo?: {
    name?: string;
    website?: string;
    logo?: string;
  };
}

//application api from job-service

export interface ApplicationCreateData {
  jobId: string;
  candidateId?: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  resumeUrl: string;
  roleInterest: string;
  expectedSalaryRange: string;
  preScreeningAnswers?: Record<string, string>;
  status?: ApplicationStatus;
}

// export const jobService ={
//   createDraft: async (payload: JobCreateData) => {
//     const response = await jobsApiInstance.post("/api/jobs", payload);
//     return response.data;
//   },
// };

export type JobUpdateData = Partial<JobCreateData>;

export const jobApi = {
  create: async (data: JobCreateData) => {
    const response = await api.post("/job/api/jobs", data);
    return response.data;
  },

  getAll: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    tags?: string[];
    workLocationType?: string;
    employmentType?: string;
  }) => {
    const response = await api.get("/job/api/jobs", { params });
    return response.data;
  },

  getPublic: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    workLocationType?: string;
    employmentType?: string;
    skills?: string[];
  }) => {
    const response = await api.get("/job/api/jobs/public", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/job/api/jobs/${id}`);
    return response.data;
  },

  getByPublicLink: async (link: string) => {
    const response = await api.get(`/job/api/jobs/public/${link}`);
    return response.data;
  },

  update: async (id: string, data: JobUpdateData) => {
    const response = await api.put(`/job/api/jobs/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/job/api/jobs/${id}`);
    return response.data;
  },

  submitForApproval: async (id: string) => {
    const response = await api.post(`/job/api/jobs/${id}/submit`, {});
    return response.data;
  },

  approve: async (id: string, comments?: string) => {
    const response = await api.post(`/job/api/jobs/${id}/approve`, { comments });
    return response.data;
  },

  reject: async (id: string, rejectionReason: string, comments?: string) => {
    const response = await api.post(`/job/api/jobs/${id}/reject`, {
      rejectionReason,
      comments,
    });
    return response.data;
  },

  publish: async (id: string) => {
    const response = await api.post(`/job/api/jobs/${id}/publish`, {});
    return response.data;
  },

  close: async (id: string, closureReason?: string) => {
    const response = await api.post(`/job/api/jobs/${id}/close`, { closureReason });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/job/api/jobs/stats");
    return response.data;
  },
};

//to apply we need the job id to which our application data is being sent to
export const applicationApi = {
  apply: async (jobId: string, data: ApplicationCreateData) => {
    const response = await api.post(`/job/api/applications/apply`, data);
    return response.data;
  },
};

// export const applicationApi = {
//   apply: async (jobId: string, data: ApplicationCreateData) => {
//     const response = await api.post(`/job/api/applications/apply/${jobId}`, data);
//     return response.data;
//   },
// };
