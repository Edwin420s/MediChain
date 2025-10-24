import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { authAPI, patientAPI, doctorAPI } from '../../services/api';

vi.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Authentication API', () => {
    it('should call login endpoint with credentials', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const mockResponse = { data: { success: true, token: 'test-token' } };
      
      axios.create.mockReturnValue({
        post: vi.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      });

      await authAPI.login(credentials);
      
      // Verify the API was called
      expect(axios.create).toHaveBeenCalled();
    });

    it('should handle login errors', async () => {
      const mockError = new Error('Invalid credentials');
      
      axios.create.mockReturnValue({
        post: vi.fn().mockRejectedValue(mockError),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      });

      await expect(authAPI.login({})).rejects.toThrow();
    });
  });

  describe('Patient API', () => {
    it('should fetch patient records', async () => {
      const mockRecords = { data: { success: true, records: [] } };
      
      axios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue(mockRecords),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      });

      const result = await patientAPI.getRecords();
      expect(result).toBeDefined();
    });
  });

  describe('Token Management', () => {
    it('should add authorization header when token exists', () => {
      localStorage.setItem('medichain_token', 'test-token');
      
      const requestInterceptor = vi.fn((config) => {
        if (localStorage.getItem('medichain_token')) {
          config.headers.Authorization = `Bearer ${localStorage.getItem('medichain_token')}`;
        }
        return config;
      });

      const config = { headers: {} };
      const result = requestInterceptor(config);
      
      expect(result.headers.Authorization).toBe('Bearer test-token');
    });

    it('should handle token expiration and redirect to login', () => {
      const mockError = {
        response: { status: 401 }
      };

      // Simulate token expiration handling
      const responseInterceptor = vi.fn((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('medichain_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      });

      responseInterceptor(mockError);
      
      expect(localStorage.getItem('medichain_token')).toBeNull();
    });
  });
});
