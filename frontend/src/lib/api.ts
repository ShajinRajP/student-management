import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Study Materials API
export const studyMaterialsAPI = {
  getAll: (params?: { department?: string; subject?: string; search?: string }) =>
    api.get('/study-materials', { params }),
  
  getById: (id: string) =>
    api.get(`/study-materials/${id}`),
  
  upload: (formData: FormData) =>
    api.post('/study-materials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  generateSummary: (id: string) =>
    api.post(`/study-materials/${id}/summary`),
  
  update: (id: string, data: any) =>
    api.put(`/study-materials/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/study-materials/${id}`),
  
  getSubjects: (department: string) =>
    api.get(`/study-materials/subjects/${department}`)
};

// Auth API
export const authAPI = {
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    role: 'student' | 'admin';
    department?: string;
  }) => api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getCurrentUser: () =>
    api.get('/auth/me')
};

export default api;