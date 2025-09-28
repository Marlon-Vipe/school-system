import { useApi } from './useApi';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import type { Student, Course, Payment } from '../types/api';

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  activeCourses: number;
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export function useDashboard() {
  // Get students data
  const { data: students, loading: studentsLoading, error: studentsError } = useApi<Student[]>(
    async () => {
      const response = await api.get(API_ENDPOINTS.DEMO.STUDENTS);
      return response.data.data || [];
    },
    []
  );

  // Get courses data
  const { data: courses, loading: coursesLoading, error: coursesError } = useApi<Course[]>(
    async () => {
      const response = await api.get(API_ENDPOINTS.DEMO.COURSES);
      return response.data.data || [];
    },
    []
  );

  // Get payments data
  const { data: payments, loading: paymentsLoading, error: paymentsError } = useApi<Payment[]>(
    async () => {
      const response = await api.get(API_ENDPOINTS.DEMO.PAYMENTS);
      return response.data.data || [];
    },
    []
  );

  // Calculate stats
  const completedPayments = payments?.filter(p => p.status === 'completed') || [];
  const monthlyPayments = payments?.filter(p => {
    if (p.status !== 'completed' || !p.paidAt) return false;
    const paymentDate = new Date(p.paidAt);
    const now = new Date();
    return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
  }) || [];

  const stats: DashboardStats = {
    totalStudents: students?.length || 0,
    activeStudents: students?.filter(s => s.status === 'active').length || 0,
    totalCourses: courses?.length || 0,
    activeCourses: courses?.filter(c => c.status === 'active').length || 0,
    totalPayments: payments?.length || 0,
    completedPayments: completedPayments.length,
    pendingPayments: payments?.filter(p => p.status === 'pending').length || 0,
    totalRevenue: completedPayments.reduce((sum, p) => {
      const amount = typeof p.amount === 'number' ? p.amount : parseFloat(p.amount?.toString() || '0');
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0),
    monthlyRevenue: monthlyPayments.reduce((sum, p) => {
      const amount = typeof p.amount === 'number' ? p.amount : parseFloat(p.amount?.toString() || '0');
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0)
  };

  const loading = studentsLoading || coursesLoading || paymentsLoading;
  const error = studentsError || coursesError || paymentsError;

  return {
    stats,
    students,
    courses,
    payments,
    loading,
    error
  };
}
