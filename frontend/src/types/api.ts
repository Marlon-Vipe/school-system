// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Paginated Response
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

// Student Types
export interface Student {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  status: 'active' | 'inactive' | 'suspended';
  courseId?: string;
  course?: Course;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentRequest {
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  status?: 'active' | 'inactive' | 'suspended';
  courseId?: string;
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {
  status?: 'active' | 'inactive' | 'suspended';
}

export interface StudentFilters {
  status?: 'active' | 'inactive' | 'suspended';
  courseId?: string;
  search?: string;
}

export interface StudentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive' | 'suspended';
  courseId?: string;
  sortBy?: 'name' | 'lastName' | 'email' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

// Course Types
export interface Course {
  id: string;
  name: string;
  description?: string;
  code: string;
  price: number;
  duration: number; // in hours
  status: 'active' | 'inactive' | 'draft';
  category?: string;
  maxStudents: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  name: string;
  description?: string;
  code: string;
  price: number;
  duration?: number;
  status?: 'active' | 'inactive' | 'draft';
  category?: string;
  maxStudents?: number;
  startDate?: string;
  endDate?: string;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  status?: 'active' | 'inactive' | 'draft';
}

// Enrollment Types
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  enrolledAt?: string;
  completedAt?: string;
  finalGrade?: number;
  notes?: string;
  student?: Student;
  course?: Course;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnrollmentRequest {
  studentId: string;
  courseId: string;
  status?: 'pending' | 'active' | 'completed' | 'cancelled';
  enrolledAt?: string;
  completedAt?: string;
  finalGrade?: number;
  notes?: string;
}

export interface UpdateEnrollmentRequest {
  status?: 'pending' | 'active' | 'completed' | 'cancelled';
  enrolledAt?: string;
  completedAt?: string;
  finalGrade?: number;
  notes?: string;
}

export interface EnrollmentFilters {
  status?: 'pending' | 'active' | 'completed' | 'cancelled';
  studentId?: string;
  courseId?: string;
  search?: string;
}

export interface EnrollmentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'pending' | 'active' | 'completed' | 'cancelled';
  studentId?: string;
  courseId?: string;
  sortBy?: 'createdAt' | 'enrolledAt' | 'completedAt' | 'status';
  sortOrder?: 'ASC' | 'DESC';
}

export interface CompleteEnrollmentRequest {
  finalGrade?: number;
  notes?: string;
}

export interface CancelEnrollmentRequest {
  notes?: string;
}

// Payment Types
export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'cash' | 'card' | 'transfer' | 'check';
  reference?: string;
  description?: string;
  dueDate: string;
  paidAt?: string;
  student?: Student;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  studentId: string;
  amount: number;
  method: 'cash' | 'card' | 'transfer' | 'check';
  description?: string;
  dueDate?: string;
  reference?: string;
}

export interface UpdatePaymentRequest {
  amount?: number;
  method?: 'cash' | 'card' | 'transfer' | 'check';
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  description?: string;
  dueDate?: string;
  reference?: string;
}

export interface PaymentFilters {
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  method?: 'cash' | 'card' | 'transfer' | 'check';
  studentId?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  method?: 'cash' | 'card' | 'transfer' | 'check';
  studentId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'amount' | 'dueDate' | 'paidAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaymentStats {
  total: number;
  pending: number;
  completed: number;
  failed: number;
  refunded: number;
  totalAmount: number;
  completedAmount: number;
  pendingAmount: number;
  averageAmount: number;
}

export interface UpdatePaymentStatusRequest {
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Role Types
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    expiresIn: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  lastName: string;
  role?: string;
}

// Cash Entry Types
export interface CashEntry {
  id: string;
  type: 'income' | 'expense';
  category: 'tuition_payment' | 'enrollment_fee' | 'material_fee' | 'other_income' | 
           'salaries' | 'utilities' | 'maintenance' | 'supplies' | 'marketing' | 'other_expense';
  amount: number;
  description: string;
  reference?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  transactionDate: string;
  userId: string;
  user?: User;
  paymentId?: string;
  receiptNumber?: string;
  attachments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCashEntryRequest {
  type: 'income' | 'expense';
  category: 'tuition_payment' | 'enrollment_fee' | 'material_fee' | 'other_income' | 
           'salaries' | 'utilities' | 'maintenance' | 'supplies' | 'marketing' | 'other_expense';
  amount: number;
  description: string;
  reference?: string;
  notes?: string;
  transactionDate: string;
  paymentId?: string;
  receiptNumber?: string;
  attachments?: string;
}

export interface UpdateCashEntryRequest {
  type?: 'income' | 'expense';
  category?: 'tuition_payment' | 'enrollment_fee' | 'material_fee' | 'other_income' | 
            'salaries' | 'utilities' | 'maintenance' | 'supplies' | 'marketing' | 'other_expense';
  amount?: number;
  description?: string;
  reference?: string;
  notes?: string;
  transactionDate?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  receiptNumber?: string;
  attachments?: string;
}

export interface CashEntryFilters {
  type?: 'income' | 'expense';
  category?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface CashEntryQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'transactionDate' | 'amount' | 'createdAt' | 'description';
  sortOrder?: 'ASC' | 'DESC';
  type?: 'income' | 'expense';
  category?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface CashEntryStats {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  pendingIncome: number;
  pendingExpenses: number;
  entriesCount: number;
}

export interface CashEntryResponse {
  data: CashEntry[];
  pagination: Pagination;
}

// Health Check
export interface HealthCheck {
  success: boolean;
  message: string;
  timestamp: string;
  environment: string;
}

