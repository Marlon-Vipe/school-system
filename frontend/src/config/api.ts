// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  TIMEOUT: 10000,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  
  // Students
  STUDENTS: {
    BASE: '/students',
    LIST: '/students',
    CREATE: '/students',
    GET: (id: string) => `/students/${id}`,
    UPDATE: (id: string) => `/students/${id}`,
    DELETE: (id: string) => `/students/${id}`,
    STATS: '/students/stats',
    RECENT: '/students/recent',
    GET_BY_COURSE: (courseId: string) => `/students/course/${courseId}`,
  },
  
  // Courses
  COURSES: {
    LIST: '/courses',
    CREATE: '/courses',
    GET: (id: string) => `/courses/${id}`,
    UPDATE: (id: string) => `/courses/${id}`,
    DELETE: (id: string) => `/courses/${id}`,
  },
  
  // Enrollments
  ENROLLMENTS: {
    LIST: '/enrollments',
    CREATE: '/enrollments',
    GET: (id: string) => `/enrollments/${id}`,
    UPDATE: (id: string) => `/enrollments/${id}`,
    DELETE: (id: string) => `/enrollments/${id}`,
  },
  
  // Payments
  PAYMENTS: {
    BASE: '/payments',
    LIST: '/payments',
    CREATE: '/payments',
    GET: (id: string) => `/payments/${id}`,
    UPDATE: (id: string) => `/payments/${id}`,
    DELETE: (id: string) => `/payments/${id}`,
    STATS: '/payments/stats',
    RECENT: '/payments/recent',
    GET_BY_STUDENT: (studentId: string) => `/payments/student/${studentId}`,
    UPDATE_STATUS: (id: string) => `/payments/${id}/status`,
    COMPLETE: (id: string) => `/payments/${id}/complete`,
    FAIL: (id: string) => `/payments/${id}/fail`,
    REFUND: (id: string) => `/payments/${id}/refund`,
  },
  
  // Users
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  
  // Roles
  ROLES: {
    LIST: '/roles',
    CREATE: '/roles',
    GET: (id: string) => `/roles/${id}`,
    UPDATE: (id: string) => `/roles/${id}`,
    DELETE: (id: string) => `/roles/${id}`,
  },
  
  // Cash Entries
  CASH: {
    BASE: '/cash',
    LIST: '/cash',
    CREATE: '/cash',
    GET: (id: string) => `/cash/${id}`,
    UPDATE: (id: string) => `/cash/${id}`,
    DELETE: (id: string) => `/cash/${id}`,
    STATS: '/cash/stats',
    DAILY_STATS: (date: string) => `/cash/stats/daily/${date}`,
    MONTHLY_STATS: (year: number, month: number) => `/cash/stats/monthly/${year}/${month}`,
    YEARLY_STATS: (year: number) => `/cash/stats/yearly/${year}`,
    CATEGORY_STATS: '/cash/stats/categories',
    CONFIRM: (id: string) => `/cash/${id}/confirm`,
    CANCEL: (id: string) => `/cash/${id}/cancel`,
  },
  
  // Purchases
  PURCHASES: {
    BASE: '/purchases',
    LIST: '/purchases',
    CREATE: '/purchases',
    GET: (id: string) => `/purchases/${id}`,
    UPDATE: (id: string) => `/purchases/${id}`,
    DELETE: (id: string) => `/purchases/${id}`,
    STATS: '/purchases/stats',
    APPROVE: (id: string) => `/purchases/${id}/approve`,
    REJECT: (id: string) => `/purchases/${id}/reject`,
    COMPLETE: (id: string) => `/purchases/${id}/complete`,
    CANCEL: (id: string) => `/purchases/${id}/cancel`,
  },
  
  // Health & Demo
  HEALTH: '/health',
  DEMO: {
    STUDENTS: '/demo/students',
    COURSES: '/demo/courses',
    ENROLLMENTS: '/demo/enrollments',
    PAYMENTS: '/demo/payments',
    STUDENTS_CREATE: '/demo/students',
    STUDENTS_UPDATE: (id: string) => `/demo/students/${id}`,
    STUDENTS_DELETE: (id: string) => `/demo/students/${id}`,
    COURSES_CREATE: '/demo/courses',
    COURSES_UPDATE: (id: string) => `/demo/courses/${id}`,
    COURSES_DELETE: (id: string) => `/demo/courses/${id}`,
    ENROLLMENTS_CREATE: '/demo/enrollments',
    ENROLLMENTS_UPDATE: (id: string) => `/demo/enrollments/${id}`,
    ENROLLMENTS_DELETE: (id: string) => `/demo/enrollments/${id}`,
    PAYMENTS_CREATE: '/demo/payments',
    PAYMENTS_UPDATE: (id: string) => `/demo/payments/${id}`,
    PAYMENTS_DELETE: (id: string) => `/demo/payments/${id}`,
    PAYMENTS_UPDATE_STATUS: (id: string) => `/demo/payments/${id}/status`,
    PURCHASES: '/demo/purchases',
    PURCHASES_CREATE: '/demo/purchases',
    PURCHASES_UPDATE: (id: string) => `/demo/purchases/${id}`,
    PURCHASES_DELETE: (id: string) => `/demo/purchases/${id}`,
    PURCHASES_APPROVE: (id: string) => `/demo/purchases/${id}/approve`,
    PURCHASES_REJECT: (id: string) => `/demo/purchases/${id}/reject`,
    PURCHASES_COMPLETE: (id: string) => `/demo/purchases/${id}/complete`,
    PURCHASES_CANCEL: (id: string) => `/demo/purchases/${id}/cancel`,
    PURCHASES_STATS: '/demo/purchases/stats',
  },
} as const;

