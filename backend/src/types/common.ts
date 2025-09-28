export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    type: string;
    message: string;
    statusCode: number;
  };
}

export interface StudentFilters {
  search?: string;
  status?: 'active' | 'inactive';
  courseId?: string;
}

export interface CourseFilters {
  search?: string;
  status?: 'active' | 'inactive';
  category?: string;
}

export interface EnrollmentFilters {
  status?: any; // Will be EnrollmentStatus enum from the entity
  studentId?: string;
  courseId?: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}



