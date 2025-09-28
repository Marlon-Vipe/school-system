import { useApi, useMutation } from './useApi';
import { api } from '../services/api';
import type { 
  CashEntry, 
  CreateCashEntryRequest, 
  UpdateCashEntryRequest, 
  CashEntryQueryParams, 
  CashEntryResponse,
  CashEntryStats 
} from '../types/api';

// Get all cash entries
export const useCashEntries = (params: CashEntryQueryParams = {}) => {
  return useApi<CashEntryResponse>(
    async () => {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });

      // Add timestamp to prevent caching
      searchParams.append('_t', Date.now().toString());

      // Use demo endpoint for development (no authentication required)
      const response = await api.get(`/demo/cash?${searchParams.toString()}`);
      
      // Ensure all amounts are properly converted to numbers
      const data = response.data;
      if (data.data) {
        data.data = data.data.map((entry: any) => ({
          ...entry,
          amount: Number(entry.amount)
        }));
      }
      
      return data;
    },
    [params]
  );
};

// Get cash entry by ID
export const useCashEntry = (id: string) => {
  return useApi<CashEntry>(
    async () => {
      const response = await api.get(`/demo/cash/${id}`);
      return response.data.data;
    },
    [id]
  );
};

// Get cash statistics
export const useCashStats = (startDate?: string, endDate?: string) => {
  return useApi<CashEntryStats>(
    async () => {
      const searchParams = new URLSearchParams();
      if (startDate) searchParams.append('startDate', startDate);
      if (endDate) searchParams.append('endDate', endDate);
      // Add timestamp to prevent caching
      searchParams.append('_t', Date.now().toString());

      // Use demo endpoint for development (no authentication required)
      const response = await api.get(`/demo/cash/stats?${searchParams.toString()}`);
      
      // Ensure all numeric values are properly converted to numbers
      const stats = response.data.data;
      return {
        totalIncome: Number(stats.totalIncome),
        totalExpenses: Number(stats.totalExpenses),
        netBalance: Number(stats.netBalance),
        pendingIncome: Number(stats.pendingIncome),
        pendingExpenses: Number(stats.pendingExpenses),
        entriesCount: Number(stats.entriesCount)
      };
    },
    [startDate, endDate]
  );
};

// Get daily stats
export const useDailyStats = (date: string) => {
  return useApi<CashEntryStats>(
    async () => {
      const response = await api.get(`/demo/cash/stats/daily/${date}`);
      return response.data.data;
    },
    [date]
  );
};

// Get monthly stats
export const useMonthlyStats = (year: number, month: number) => {
  return useApi<CashEntryStats>(
    async () => {
      const response = await api.get(`/demo/cash/stats/monthly/${year}/${month}`);
      return response.data.data;
    },
    [year, month]
  );
};

// Get yearly stats
export const useYearlyStats = (year: number) => {
  return useApi<CashEntryStats>(
    async () => {
      const response = await api.get(`/demo/cash/stats/yearly/${year}`);
      return response.data.data;
    },
    [year]
  );
};

// Get category stats
export const useCategoryStats = (startDate?: string, endDate?: string) => {
  return useApi<Record<string, number>>(
    async () => {
      const searchParams = new URLSearchParams();
      if (startDate) searchParams.append('startDate', startDate);
      if (endDate) searchParams.append('endDate', endDate);

      const response = await api.get(`/demo/cash/stats/categories?${searchParams.toString()}`);
      return response.data.data;
    },
    [startDate, endDate]
  );
};

// Create cash entry mutation
export const useCreateCashEntry = () => {
  return useMutation<CashEntry, CreateCashEntryRequest>(
    async (data) => {
      // Use demo endpoint for development (no authentication required)
      const response = await api.post('/demo/cash', data);
      return response.data.data;
    }
  );
};

// Update cash entry mutation
export const useUpdateCashEntry = () => {
  return useMutation<CashEntry, { id: string; data: UpdateCashEntryRequest }>(
    async ({ id, data }) => {
      const response = await api.put(`/demo/cash/${id}`, data);
      return response.data.data;
    }
  );
};

// Delete cash entry mutation
export const useDeleteCashEntry = () => {
  return useMutation<void, string>(
    async (id) => {
      await api.delete(`/demo/cash/${id}`);
    }
  );
};

// Confirm cash entry mutation
export const useConfirmCashEntry = () => {
  return useMutation<CashEntry, string>(
    async (id) => {
      const response = await api.patch(`/demo/cash/${id}/confirm`);
      return response.data.data;
    }
  );
};

// Cancel cash entry mutation
export const useCancelCashEntry = () => {
  return useMutation<CashEntry, string>(
    async (id) => {
      const response = await api.patch(`/demo/cash/${id}/cancel`);
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
    tuition_payment: 'Pago de Matrícula',
    enrollment_fee: 'Cuota de Inscripción',
    material_fee: 'Cuota de Materiales',
    other_income: 'Otros Ingresos',
    salaries: 'Salarios',
    utilities: 'Servicios Públicos',
    maintenance: 'Mantenimiento',
    supplies: 'Suministros',
    marketing: 'Marketing',
    other_expense: 'Otros Gastos',
  };
  return labels[category] || category;
};

export const getTypeLabel = (type: string): string => {
  return type === 'income' ? 'Ingreso' : 'Egreso';
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    cancelled: 'Cancelado',
  };
  return labels[status] || status;
};
