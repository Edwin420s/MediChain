import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medichain_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('medichain_token');
      localStorage.removeItem('medichain_user');
      localStorage.removeItem('medichain_hedera');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }
    
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('Network error - please check your connection');
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const patientAPI = {
  getRecords: () => api.get('/patients/records'),
  getRecord: (id) => api.get(`/patients/records/${id}`),
  uploadRecord: (formData) => api.post('/patients/records', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  grantAccess: (data) => api.post('/patients/consent', data),
  revokeAccess: (consentId) => api.delete(`/patients/consent/${consentId}`),
  getConsents: () => api.get('/patients/consents'),
  getAuditLogs: () => api.get('/patients/audit'),
  generateEmergencyQR: () => api.post('/patients/emergency-qr'),
};

export const doctorAPI = {
  getPatients: () => api.get('/doctors/patients'),
  getPatientRecords: (patientDid) => api.get(`/doctors/patients/${patientDid}/records`),
  requestAccess: (data) => api.post('/doctors/access-requests', data),
  uploadRecord: (formData) => api.post('/doctors/records', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAccessRequests: () => api.get('/doctors/access-requests'),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (data) => api.post('/admin/departments', data),
  getDoctors: (status = 'all') => api.get(`/admin/doctors?status=${status}`),
  approveDoctor: (doctorId) => api.post(`/admin/doctors/${doctorId}/approve`),
  rejectDoctor: (doctorId) => api.post(`/admin/doctors/${doctorId}/reject`),
  registerPatient: (data) => api.post('/admin/patients', data),
  getSystemLogs: () => api.get('/admin/system-logs'),
};

export const hederaAPI = {
  getTransaction: (txId) => api.get(`/hedera/transactions/${txId}`),
  verifyConsent: (data) => api.post('/hedera/verify-consent', data),
};

export default api;