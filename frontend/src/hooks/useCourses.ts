import { useApi, useMutation } from './useApi';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import type { 
  Course, 
  CreateCourseRequest, 
  UpdateCourseRequest, 
  ApiResponse 
} from '../types/api';

// Hook to get all courses
export function useCourses() {
  return useApi<Course[]>(
    async () => {
      // Using demo endpoint for now (no authentication required)
      const response = await api.get<ApiResponse<Course[]>>(API_ENDPOINTS.DEMO.COURSES);
      return response.data.data || [];
    },
    []
  );
}

// Hook to get a single course
export function useCourse(id: string) {
  return useApi<Course>(
    async () => {
      const response = await api.get<ApiResponse<Course>>(API_ENDPOINTS.COURSES.GET(id));
      return response.data.data!;
    },
    [id]
  );
}

// Hook to create a course
export function useCreateCourse() {
  return useMutation<ApiResponse<Course>, CreateCourseRequest>(
    async (courseData) => {
      const response = await api.post<ApiResponse<Course>>(
        API_ENDPOINTS.DEMO.COURSES_CREATE,
        courseData
      );
      return response.data;
    }
  );
}

// Hook to update a course
export function useUpdateCourse() {
  return useMutation<ApiResponse<Course>, { id: string; data: UpdateCourseRequest }>(
    async ({ id, data }) => {
      const response = await api.put<ApiResponse<Course>>(
        API_ENDPOINTS.DEMO.COURSES_UPDATE(id),
        data
      );
      return response.data;
    }
  );
}

// Hook to delete a course
export function useDeleteCourse() {
  return useMutation<ApiResponse<void>, string>(
    async (id) => {
      const response = await api.delete<ApiResponse<void>>(API_ENDPOINTS.DEMO.COURSES_DELETE(id));
      return response.data;
    }
  );
}

