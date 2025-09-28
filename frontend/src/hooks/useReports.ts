import { useApi, useMutation } from './useApi';
import { api } from '../services/api';
import type { 
  Report, 
  UpdateReportRequest, 
  ReportQueryParams, 
  ReportResponse,
  ReportStats,
  ReportType,
  ReportStatus,
  ReportFormat
} from '../types/api';

// Local interface for creating reports
export interface CreateReportRequest {
  title: string;
  description: string;
  type: ReportType;
  format: ReportFormat;
  parameters?: Record<string, any>;
  filters?: Record<string, any>;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

// Get all reports
export const useReports = (params: ReportQueryParams = {}) => {
  return useApi<ReportResponse>(
    async () => {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });

      // Add timestamp to prevent caching
      searchParams.append('_t', Date.now().toString());

      const response = await api.get(`/reports?${searchParams.toString()}`);
      
      return response.data;
    },
    [JSON.stringify(params)]
  );
};

// Get report statistics
export const useReportStats = (startDate?: string, endDate?: string) => {
  return useApi<ReportStats>(
    async () => {
      const searchParams = new URLSearchParams();
      
      if (startDate) searchParams.append('startDate', startDate);
      if (endDate) searchParams.append('endDate', endDate);
      
      // Add timestamp to prevent caching
      searchParams.append('_t', Date.now().toString());

      const response = await api.get(`/reports/stats?${searchParams.toString()}`);
      
      return response.data.data;
    },
    [startDate, endDate]
  );
};

// Create report mutation
export const useCreateReport = () => {
  return useMutation<Report, CreateReportRequest>(
    async (data) => {
      const response = await api.post('/reports', data);
      return response.data.data;
    }
  );
};

// Update report mutation
export const useUpdateReport = () => {
  return useMutation<Report, { id: string; data: UpdateReportRequest }>(
    async ({ id, data }) => {
      const response = await api.put(`/reports/${id}`, data);
      return response.data.data;
    }
  );
};

// Delete report mutation
export const useDeleteReport = () => {
  return useMutation<void, string>(
    async (id) => {
      await api.delete(`/reports/${id}`);
    }
  );
};

// Generate report mutation
export const useGenerateReport = () => {
  return useMutation<Report, string>(
    async (id) => {
      const response = await api.post(`/reports/${id}/generate`);
      return response.data.data;
    }
  );
};

// Download report mutation
export const useDownloadReport = () => {
  return useMutation<{ downloadUrl: string; fileName: string; expiresAt: string }, string>(
    async (id) => {
      const response = await api.get(`/reports/${id}/download`);
      return response.data.data;
    }
  );
};

// Utility functions
export const getReportTypeLabel = (type: ReportType): string => {
  const labels: Record<ReportType, string> = {
    [ReportType.FINANCIAL]: 'Reporte Financiero',
    [ReportType.STUDENT_ANALYSIS]: 'Análisis de Estudiantes',
    [ReportType.PAYMENT_SUMMARY]: 'Resumen de Pagos',
    [ReportType.ENROLLMENT_REPORT]: 'Reporte de Matrículas',
    [ReportType.COURSE_PERFORMANCE]: 'Rendimiento de Cursos',
    [ReportType.CASH_FLOW]: 'Flujo de Caja',
    [ReportType.PURCHASE_ANALYSIS]: 'Análisis de Compras',
    [ReportType.CUSTOM]: 'Reporte Personalizado'
  };
  return labels[type] || type;
};

export const getReportStatusLabel = (status: ReportStatus): string => {
  const labels: Record<ReportStatus, string> = {
    [ReportStatus.PENDING]: 'Pendiente',
    [ReportStatus.GENERATING]: 'Generando',
    [ReportStatus.COMPLETED]: 'Completado',
    [ReportStatus.FAILED]: 'Fallido',
    [ReportStatus.EXPIRED]: 'Expirado'
  };
  return labels[status] || status;
};

export const getReportFormatLabel = (format: ReportFormat): string => {
  const labels: Record<ReportFormat, string> = {
    [ReportFormat.PDF]: 'PDF',
    [ReportFormat.EXCEL]: 'Excel',
    [ReportFormat.CSV]: 'CSV',
    [ReportFormat.JSON]: 'JSON'
  };
  return labels[format] || format;
};

export const getReportStatusColor = (status: ReportStatus): string => {
  const colors: Record<ReportStatus, string> = {
    [ReportStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [ReportStatus.GENERATING]: 'bg-blue-100 text-blue-800',
    [ReportStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [ReportStatus.FAILED]: 'bg-red-100 text-red-800',
    [ReportStatus.EXPIRED]: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateOnly = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const isReportExpired = (expiresAt?: string): boolean => {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
};

export const canDownloadReport = (report: Report): boolean => {
  return report.status === ReportStatus.COMPLETED && 
         report.downloadUrl && 
         !isReportExpired(report.expiresAt);
};

export const canGenerateReport = (report: Report): boolean => {
  return report.status === ReportStatus.PENDING;
};

export const canDeleteReport = (report: Report): boolean => {
  return report.status === ReportStatus.PENDING || 
         report.status === ReportStatus.FAILED ||
         isReportExpired(report.expiresAt);
};
