import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
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
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors (unauthorized) - DISABLED FOR DEVELOPMENT
    if (error.response?.status === 401) {
      console.log('API: 401 error detected, but redirect disabled for development');
      console.log('API: Error URL:', error.config?.url);
      // localStorage.removeItem('authToken');
      // window.location.href = '/login';
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  // GET request
  get: <T = any>(url: string, config?: any) => {
    return apiClient.get<T>(url, config);
  },

  // POST request
  post: <T = any>(url: string, data?: any, config?: any) => {
    return apiClient.post<T>(url, data, config);
  },

  // PUT request
  put: <T = any>(url: string, data?: any, config?: any) => {
    return apiClient.put<T>(url, data, config);
  },

  // PATCH request
  patch: <T = any>(url: string, data?: any, config?: any) => {
    return apiClient.patch<T>(url, data, config);
  },

  // DELETE request
  delete: <T = any>(url: string, config?: any) => {
    return apiClient.delete<T>(url, config);
  },
};

export default apiClient;
