import { useState, useEffect } from 'react';
import { useMutation } from './useApi';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  User, 
  ApiResponse 
} from '../types/api';

// Auth hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    
    setLoading(false);
  }, []);

  // Login mutation
  const loginMutation = useMutation<LoginResponse, LoginRequest>(
    async (credentials) => {
      const response = await api.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      return response.data;
    }
  );

  // Register mutation
  const registerMutation = useMutation<ApiResponse<User>, RegisterRequest>(
    async (userData) => {
      const response = await api.post<ApiResponse<User>>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );
      return response.data;
    }
  );

  // Login function
  const login = async (credentials: LoginRequest) => {
    try {
      const result = await loginMutation.mutate(credentials);
      
      if (result.success && result.data) {
        localStorage.setItem('authToken', result.data.token);
        localStorage.setItem('userData', JSON.stringify(result.data.user));
        setUser(result.data.user);
        setIsAuthenticated(true);
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterRequest) => {
    try {
      const result = await registerMutation.mutate(userData);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    loginLoading: loginMutation.loading,
    registerLoading: registerMutation.loading,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}

