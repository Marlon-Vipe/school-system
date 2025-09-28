import { useApi, useMutation } from './useApi';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import type { 
  Payment, 
  CreatePaymentRequest, 
  UpdatePaymentRequest, 
  UpdatePaymentStatusRequest,
  ApiResponse, 
  PaginatedResponse,
  PaymentQueryParams,
  PaymentStats
} from '../types/api';

// Hook to get all payments with pagination and filters
export function usePayments(params?: PaymentQueryParams) {
  console.log('usePayments: Hook called with params:', params)
  
  return useApi<PaginatedResponse<Payment>>(
    async () => {
      console.log('usePayments: Making API call to:', API_ENDPOINTS.DEMO.PAYMENTS)
      // Using demo endpoint for now (no authentication required)
      const response = await api.get<ApiResponse<Payment[]>>(API_ENDPOINTS.DEMO.PAYMENTS);
      
      console.log('usePayments: API response received:', response.data)
      
      const result = {
        success: true,
        message: 'Payments retrieved successfully',
        data: response.data.data || [],
        pagination: {
          page: 1,
          limit: 10,
          total: response.data.data?.length || 0,
          totalPages: 1
        }
      };
      
      console.log('usePayments: Returning result:', result)
      return result;
    },
    [params]
  );
}

// Hook to get payment statistics
export function usePaymentStats() {
  return useApi<PaymentStats>(
    async () => {
      const response = await api.get<ApiResponse<PaymentStats>>(API_ENDPOINTS.PAYMENTS.STATS);
      return response.data.data!;
    },
    []
  );
}

// Hook to get recent payments
export function useRecentPayments(params?: PaymentQueryParams) {
  return useApi<Payment[]>(
    async () => {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.method) queryParams.append('method', params.method);

      const response = await api.get<ApiResponse<Payment[]>>(
        `${API_ENDPOINTS.PAYMENTS.RECENT}?${queryParams.toString()}`
      );
      return response.data.data || [];
    },
    [params]
  );
}

// Hook to get a single payment
export function usePayment(id: string) {
  return useApi<Payment>(
    async () => {
      const response = await api.get<ApiResponse<Payment>>(API_ENDPOINTS.PAYMENTS.GET(id));
      return response.data.data!;
    },
    [id]
  );
}

// Hook to get payments by student
export function usePaymentsByStudent(studentId: string, params?: PaymentQueryParams) {
  return useApi<Payment[]>(
    async () => {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.method) queryParams.append('method', params.method);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await api.get<ApiResponse<Payment[]>>(
        `${API_ENDPOINTS.PAYMENTS.GET_BY_STUDENT(studentId)}?${queryParams.toString()}`
      );
      return response.data.data || [];
    },
    [studentId, params]
  );
}

// Hook to create a payment
export function useCreatePayment() {
  return useMutation<ApiResponse<Payment>, CreatePaymentRequest>(
    async (paymentData) => {
      console.log('useCreatePayment: Creating payment with data:', paymentData);
      
      // Using demo endpoint for real payment creation
      const response = await api.post<ApiResponse<Payment>>(
        API_ENDPOINTS.DEMO.PAYMENTS,
        paymentData
      );
      
      console.log('useCreatePayment: Payment created successfully:', response.data);
      return response.data;
    }
  );
}

// Hook to update a payment
export function useUpdatePayment() {
  return useMutation<ApiResponse<Payment>, { id: string; data: UpdatePaymentRequest }>(
    async ({ id, data }) => {
      console.log('useUpdatePayment: Updating payment:', id, 'with data:', data);
      
      // Using demo endpoint for real payment update
      const response = await api.put<ApiResponse<Payment>>(
        API_ENDPOINTS.DEMO.PAYMENTS_UPDATE(id),
        data
      );
      
      console.log('useUpdatePayment: Payment updated successfully:', response.data);
      return response.data;
    }
  );
}

// Hook to delete a payment
export function useDeletePayment() {
  return useMutation<ApiResponse<void>, { id: string }>(
    async ({ id }) => {
      console.log('useDeletePayment: Deleting payment:', id);
      
      // Using demo endpoint for real payment deletion
      const response = await api.delete<ApiResponse<void>>(API_ENDPOINTS.DEMO.PAYMENTS_DELETE(id));
      
      console.log('useDeletePayment: Payment deleted successfully');
      return response.data;
    }
  );
}

// Hook to update payment status
export function useUpdatePaymentStatus() {
  return useMutation<ApiResponse<Payment>, { id: string; data: UpdatePaymentStatusRequest }>(
    async ({ id, data }) => {
      console.log('useUpdatePaymentStatus: Updating payment status:', id, 'to:', data.status);
      
      // Using demo endpoint for real payment status update
      const response = await api.post<ApiResponse<Payment>>(
        API_ENDPOINTS.DEMO.PAYMENTS_UPDATE_STATUS(id),
        data
      );
      
      console.log('useUpdatePaymentStatus: Payment status updated successfully:', response.data);
      return response.data;
    }
  );
}

// Hook to complete payment
export function useCompletePayment() {
  return useMutation<ApiResponse<Payment>, { id: string; notes?: string }>(
    async ({ id, notes }) => {
      console.log('useCompletePayment: Completing payment:', id);
      
      // Using demo endpoint for payment status update
      const response = await api.post<ApiResponse<Payment>>(
        API_ENDPOINTS.DEMO.PAYMENTS_UPDATE_STATUS(id),
        { status: 'completed', notes }
      );
      
      console.log('useCompletePayment: Payment completed successfully:', response.data);
      return response.data;
    }
  );
}

// Hook to fail payment
export function useFailPayment() {
  return useMutation<ApiResponse<Payment>, { id: string; notes?: string }>(
    async ({ id, notes }) => {
      console.log('useFailPayment: Failing payment:', id);
      
      // Using demo endpoint for payment status update
      const response = await api.post<ApiResponse<Payment>>(
        API_ENDPOINTS.DEMO.PAYMENTS_UPDATE_STATUS(id),
        { status: 'failed', notes }
      );
      
      console.log('useFailPayment: Payment failed successfully:', response.data);
      return response.data;
    }
  );
}

// Hook to refund payment
export function useRefundPayment() {
  return useMutation<ApiResponse<Payment>, { id: string; notes?: string }>(
    async ({ id, notes }) => {
      console.log('useRefundPayment: Refunding payment:', id);
      
      // Using demo endpoint for payment status update
      const response = await api.post<ApiResponse<Payment>>(
        API_ENDPOINTS.DEMO.PAYMENTS_UPDATE_STATUS(id),
        { status: 'refunded', notes }
      );
      
      console.log('useRefundPayment: Payment refunded successfully:', response.data);
      return response.data;
    }
  );
}