// React Hook for API Service
import { useState, useCallback } from 'react';
import { ApiService } from '../lib/api/apiService';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

export const useApiService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = useCallback(async <T>(
    requestFn: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T> | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await requestFn();
      
      if (!result.success) {
        throw new Error(result.error || 'Request failed');
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      console.error('API Service Error:', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================
  // MENTORS
  // ========================

  const getMentors = useCallback(async (search?: string) => {
    return handleRequest(() => ApiService.getMentors(search));
  }, [handleRequest]);

  const getMentorById = useCallback(async (id: string) => {
    return handleRequest(() => ApiService.getMentorById(id));
  }, [handleRequest]);

  const createMentor = useCallback(async (data: any) => {
    return handleRequest(() => ApiService.createMentor(data));
  }, [handleRequest]);

  const updateMentor = useCallback(async (id: string, data: any) => {
    return handleRequest(() => ApiService.updateMentor(id, data));
  }, [handleRequest]);

  const deleteMentor = useCallback(async (id: string) => {
    return handleRequest(() => ApiService.deleteMentor(id));
  }, [handleRequest]);

  // ========================
  // MENTEES
  // ========================

  const getMentees = useCallback(async () => {
    return handleRequest(() => ApiService.getMentees());
  }, [handleRequest]);

  // ========================
  // USERS
  // ========================

  const getUsers = useCallback(async () => {
    return handleRequest(() => ApiService.getUsers());
  }, [handleRequest]);

  // ========================
  // HEALTH CHECK
  // ========================

  const healthCheck = useCallback(async () => {
    return handleRequest(() => ApiService.healthCheck());
  }, [handleRequest]);

  return {
    // State
    loading,
    error,
    
    // Actions
    getMentors,
    getMentorById,
    createMentor,
    updateMentor,
    deleteMentor,
    getMentees,
    getUsers,
    healthCheck,
    
    // Utilities
    clearError: () => setError(null),
  };
};

export default useApiService;
