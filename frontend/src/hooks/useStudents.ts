import { useApi, useMutation } from './useApi';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import type { 
  Student, 
  CreateStudentRequest, 
  UpdateStudentRequest, 
  ApiResponse, 
  PaginatedResponse,
  StudentQueryParams,
  StudentFilters
} from '../types/api';

// Hook to get all students (demo endpoint for development)
export function useStudents() {
  return useApi<Student[]>(
    async () => {
      console.log('useStudents: Fetching students from API...')
      // Using demo endpoint for now (no authentication required)
      const response = await api.get<ApiResponse<Student[]>>(API_ENDPOINTS.DEMO.STUDENTS);
      console.log('useStudents: Received students:', response.data.data?.length || 0)
      return response.data.data || [];
    },
    []
  );
}

// Hook to get students with pagination and filters (authenticated endpoint)
export function useStudentsPaginated(params?: StudentQueryParams) {
  return useApi<PaginatedResponse<Student>>(
    async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.courseId) queryParams.append('courseId', params.courseId);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await api.get<PaginatedResponse<Student>>(
        `${API_ENDPOINTS.STUDENTS.BASE}?${queryParams.toString()}`
      );
      return response.data;
    },
    [params]
  );
}

// Hook to get a single student
export function useStudent(id: string) {
  return useApi<Student>(
    async () => {
      const response = await api.get<ApiResponse<Student>>(API_ENDPOINTS.STUDENTS.GET(id));
      return response.data.data!;
    },
    [id]
  );
}

// Hook to get students by course
export function useStudentsByCourse(courseId: string) {
  return useApi<Student[]>(
    async () => {
      const response = await api.get<ApiResponse<Student[]>>(
        API_ENDPOINTS.STUDENTS.GET_BY_COURSE(courseId)
      );
      return response.data.data || [];
    },
    [courseId]
  );
}

// Hook to get recent students
export function useRecentStudents(limit: number = 5) {
  return useApi<Student[]>(
    async () => {
      const response = await api.get<ApiResponse<Student[]>>(
        `${API_ENDPOINTS.STUDENTS.RECENT}?limit=${limit}`
      );
      return response.data.data || [];
    },
    [limit]
  );
}

// Hook to get student statistics
export function useStudentStats() {
  return useApi<any>(
    async () => {
      const response = await api.get<ApiResponse<any>>(API_ENDPOINTS.STUDENTS.STATS);
      return response.data.data;
    },
    []
  );
}

// Hook to create a student (using demo endpoint for development)
export function useCreateStudent() {
  return useMutation<ApiResponse<Student>, CreateStudentRequest>(
    async (studentData) => {
      console.log('useCreateStudent: Sending data to:', API_ENDPOINTS.DEMO.STUDENTS_CREATE);
      console.log('useCreateStudent: Data:', studentData);
      
      try {
        const response = await api.post<ApiResponse<Student>>(
          API_ENDPOINTS.DEMO.STUDENTS_CREATE,
          studentData
        );
        console.log('useCreateStudent: Response:', response);
        return response.data;
      } catch (error) {
        console.error('useCreateStudent: Error:', error);
        throw error;
      }
    }
  );
}

// Hook to update a student (using demo endpoint for development)
export function useUpdateStudent() {
  return useMutation<ApiResponse<Student>, { id: string; data: UpdateStudentRequest }>(
    async ({ id, data }) => {
      const response = await api.put<ApiResponse<Student>>(
        API_ENDPOINTS.DEMO.STUDENTS_UPDATE(id),
        data
      );
      return response.data;
    }
  );
}

// Hook to delete a student (using demo endpoint for development)
export function useDeleteStudent() {
  return useMutation<ApiResponse<void>, { id: string; soft?: boolean }>(
    async ({ id, soft = true }) => {
      console.log('useDeleteStudent: Eliminando estudiante con ID:', id, 'soft:', soft);
      const url = `${API_ENDPOINTS.DEMO.STUDENTS_DELETE(id)}?soft=${soft}`;
      console.log('useDeleteStudent: URL completa:', url);
      console.log('useDeleteStudent: API_ENDPOINTS.DEMO.STUDENTS_DELETE:', API_ENDPOINTS.DEMO.STUDENTS_DELETE(id));
      
      try {
        console.log('useDeleteStudent: Enviando petición DELETE...');
        const response = await api.delete<ApiResponse<void>>(url);
        console.log('useDeleteStudent: Respuesta completa:', response);
        console.log('useDeleteStudent: Respuesta exitosa:', response.data);
        return response.data;
      } catch (error) {
        console.error('useDeleteStudent: Error en la petición:', error);
        console.error('useDeleteStudent: Error response:', error?.response);
        throw error;
      }
    }
  );
}

