import { useApi, useMutation } from './useApi';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import type { 
  Enrollment, 
  CreateEnrollmentRequest, 
  UpdateEnrollmentRequest, 
  ApiResponse, 
  PaginatedResponse,
  EnrollmentQueryParams,
  EnrollmentFilters,
  CompleteEnrollmentRequest,
  CancelEnrollmentRequest
} from '../types/api';

// Hook to get all enrollments (demo endpoint for development)
export function useEnrollments() {
  return useApi<Enrollment[]>(
    async () => {
      console.log('useEnrollments: Fetching enrollments from API...')
      // Using demo endpoint for now (no authentication required)
      const response = await api.get<ApiResponse<Enrollment[]>>(API_ENDPOINTS.DEMO.ENROLLMENTS);
      console.log('useEnrollments: Received enrollments:', response.data.data?.length || 0)
      return response.data.data || [];
    },
    []
  );
}

// Hook to get enrollments with pagination and filters (authenticated endpoint)
export function useEnrollmentsPaginated(params?: EnrollmentQueryParams) {
  return useApi<PaginatedResponse<Enrollment>>(
    async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.studentId) queryParams.append('studentId', params.studentId);
      if (params?.courseId) queryParams.append('courseId', params.courseId);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await api.get<PaginatedResponse<Enrollment>>(
        `${API_ENDPOINTS.ENROLLMENTS.BASE}?${queryParams.toString()}`
      );
      return response.data;
    },
    [params]
  );
}

// Hook to get a single enrollment
export function useEnrollment(id: string) {
  return useApi<Enrollment>(
    async () => {
      const response = await api.get<ApiResponse<Enrollment>>(API_ENDPOINTS.ENROLLMENTS.GET(id));
      return response.data.data!;
    },
    [id]
  );
}

// Hook to create an enrollment (using demo endpoint for development)
export function useCreateEnrollment() {
  return useMutation<ApiResponse<Enrollment>, CreateEnrollmentRequest>(
    async (enrollmentData) => {
      console.log('useCreateEnrollment: Creating enrollment:', enrollmentData);
      const response = await api.post<ApiResponse<Enrollment>>(
        API_ENDPOINTS.DEMO.ENROLLMENTS_CREATE,
        enrollmentData
      );
      return response.data;
    }
  );
}

// Hook to update an enrollment (using demo endpoint for development)
export function useUpdateEnrollment() {
  return useMutation<ApiResponse<Enrollment>, { id: string; data: UpdateEnrollmentRequest }>(
    async ({ id, data }) => {
      console.log('useUpdateEnrollment: Updating enrollment:', id, data);
      const response = await api.put<ApiResponse<Enrollment>>(
        API_ENDPOINTS.DEMO.ENROLLMENTS_UPDATE(id),
        data
      );
      return response.data;
    }
  );
}

// Hook to delete an enrollment (using demo endpoint for development)
export function useDeleteEnrollment() {
  return useMutation<ApiResponse<void>, { id: string }>(
    async ({ id }) => {
      console.log('useDeleteEnrollment: Deleting enrollment with ID:', id);
      const response = await api.delete<ApiResponse<void>>(API_ENDPOINTS.DEMO.ENROLLMENTS_DELETE(id));
      return response.data;
    }
  );
}

// Hook to approve an enrollment
export function useApproveEnrollment() {
  return useMutation<ApiResponse<Enrollment>, { id: string }>(
    async ({ id }) => {
      const response = await api.post<ApiResponse<Enrollment>>(
        `${API_ENDPOINTS.ENROLLMENTS.BASE}/${id}/approve`
      );
      return response.data;
    }
  );
}

// Hook to complete an enrollment
export function useCompleteEnrollment() {
  return useMutation<ApiResponse<Enrollment>, { id: string; data: CompleteEnrollmentRequest }>(
    async ({ id, data }) => {
      const response = await api.post<ApiResponse<Enrollment>>(
        `${API_ENDPOINTS.ENROLLMENTS.BASE}/${id}/complete`,
        data
      );
      return response.data;
    }
  );
}

// Hook to cancel an enrollment
export function useCancelEnrollment() {
  return useMutation<ApiResponse<Enrollment>, { id: string; data: CancelEnrollmentRequest }>(
    async ({ id, data }) => {
      const response = await api.post<ApiResponse<Enrollment>>(
        `${API_ENDPOINTS.ENROLLMENTS.BASE}/${id}/cancel`,
        data
      );
      return response.data;
    }
  );
}

// Hook to get enrollments by student
export function useEnrollmentsByStudent(studentId: string) {
  return useApi<Enrollment[]>(
    async () => {
      const response = await api.get<ApiResponse<Enrollment[]>>(
        `${API_ENDPOINTS.ENROLLMENTS.BASE}/student/${studentId}`
      );
      return response.data.data || [];
    },
    [studentId]
  );
}

// Hook to get enrollments by course
export function useEnrollmentsByCourse(courseId: string) {
  return useApi<Enrollment[]>(
    async () => {
      const response = await api.get<ApiResponse<Enrollment[]>>(
        `${API_ENDPOINTS.ENROLLMENTS.BASE}/course/${courseId}`
      );
      return response.data.data || [];
    },
    [courseId]
  );
}

