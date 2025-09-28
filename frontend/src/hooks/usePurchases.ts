import { useApi, useMutation } from './useApi';
import { api } from '../services/api';
import type { 
  Purchase, 
  CreatePurchaseRequest, 
  UpdatePurchaseRequest, 
  PurchaseQueryParams, 
  PurchaseResponse,
  PurchaseStats 
} from '../types/api';

// Get all purchases
export const usePurchases = (params: PurchaseQueryParams = {}) => {
  return useApi<PurchaseResponse>(
    async () => {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });

      // Add timestamp to prevent caching
      searchParams.append('_t', Date.now().toString());

      // Use real endpoint for production (with authentication)
      const response = await api.get(`/purchases?${searchParams.toString()}`);
      
      // Ensure all amounts are properly converted to numbers
      const data = response.data;
      if (data.data) {
        data.data = data.data.map((purchase: any) => ({
          ...purchase,
          amount: Number(purchase.amount)
        }));
      }
      
      return data;
    },
    [params]
  );
};

// Get purchase by ID
export const usePurchase = (id: string) => {
  return useApi<Purchase>(
    async () => {
      const response = await api.get(`/demo/purchases/${id}`);
      return response.data.data;
    },
    [id]
  );
};

// Get purchase statistics
export const usePurchaseStats = (startDate?: string, endDate?: string) => {
  return useApi<PurchaseStats>(
    async () => {
      const searchParams = new URLSearchParams();
      
      if (startDate) searchParams.append('startDate', startDate);
      if (endDate) searchParams.append('endDate', endDate);
      
      // Add timestamp to prevent caching
      searchParams.append('_t', Date.now().toString());

      const response = await api.get(`/purchases/stats?${searchParams.toString()}`);
      
      // Ensure all amounts are properly converted to numbers
      const stats = response.data.data;
      return {
        totalPurchases: Number(stats.totalPurchases),
        totalAmount: Number(stats.totalAmount),
        pendingPurchases: Number(stats.pendingPurchases),
        approvedPurchases: Number(stats.approvedPurchases),
        completedPurchases: Number(stats.completedPurchases),
        rejectedPurchases: Number(stats.rejectedPurchases),
        averageAmount: Number(stats.averageAmount)
      };
    },
    [startDate, endDate]
  );
};

// Create purchase mutation
export const useCreatePurchase = () => {
  return useMutation<Purchase, CreatePurchaseRequest>(
    async (data) => {
      const response = await api.post('/purchases', data);
      return response.data.data;
    }
  );
};

// Update purchase mutation
export const useUpdatePurchase = () => {
  return useMutation<Purchase, { id: string; data: UpdatePurchaseRequest }>(
    async ({ id, data }) => {
      const response = await api.put(`/purchases/${id}`, data);
      return response.data.data;
    }
  );
};

// Delete purchase mutation
export const useDeletePurchase = () => {
  return useMutation<void, string>(
    async (id) => {
      await api.delete(`/purchases/${id}`);
    }
  );
};

// Approve purchase mutation
export const useApprovePurchase = () => {
  return useMutation<Purchase, { id: string; approvedBy?: string }>(
    async ({ id, approvedBy }) => {
      const response = await api.post(`/purchases/${id}/approve`, { approvedBy });
      return response.data.data;
    }
  );
};

// Reject purchase mutation
export const useRejectPurchase = () => {
  return useMutation<Purchase, { id: string; rejectionReason: string; approvedBy?: string }>(
    async ({ id, rejectionReason, approvedBy }) => {
      const response = await api.post(`/purchases/${id}/reject`, { rejectionReason, approvedBy });
      return response.data.data;
    }
  );
};

// Complete purchase mutation
export const useCompletePurchase = () => {
  return useMutation<Purchase, { id: string; actualDeliveryDate?: string }>(
    async ({ id, actualDeliveryDate }) => {
      const response = await api.post(`/purchases/${id}/complete`, { actualDeliveryDate });
      return response.data.data;
    }
  );
};

// Cancel purchase mutation
export const useCancelPurchase = () => {
  return useMutation<Purchase, { id: string; cancellationReason?: string }>(
    async ({ id, cancellationReason }) => {
      const response = await api.post(`/purchases/${id}/cancel`, { cancellationReason });
      return response.data.data;
    }
  );
};

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    office_supplies: 'Materiales de Oficina',
    educational_materials: 'Materiales Educativos',
    technology: 'Tecnología',
    maintenance: 'Mantenimiento',
    cleaning_supplies: 'Productos de Limpieza',
    food_services: 'Servicios de Alimentación',
    transportation: 'Transporte',
    other: 'Otros'
  };
  return labels[category] || category;
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    completed: 'Completado',
    cancelled: 'Cancelado'
  };
  return labels[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    cash: 'Efectivo',
    bank_transfer: 'Transferencia Bancaria',
    check: 'Cheque',
    credit_card: 'Tarjeta de Crédito',
    other: 'Otro'
  };
  return labels[method] || method;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES');
};
