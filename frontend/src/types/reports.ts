// Report interfaces and types
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

export interface UpdateReportRequest {
  title?: string;
  description?: string;
  status?: ReportStatus;
  filePath?: string;
  downloadUrl?: string;
  generatedAt?: string;
  expiresAt?: string;
  errorMessage?: string;
  notes?: string;
}

export interface ReportFilters {
  type?: ReportType;
  status?: ReportStatus;
  format?: ReportFormat;
  requestedBy?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface ReportQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  type?: ReportType;
  status?: ReportStatus;
  format?: ReportFormat;
  requestedBy?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface ReportStats {
  totalReports: number;
  pendingReports: number;
  completedReports: number;
  failedReports: number;
  totalDownloads: number;
  reportsByType: Record<string, number>;
  reportsByFormat: Record<string, number>;
}

export interface ReportResponse {
  data: Report[];
  pagination: Pagination;
}

// Re-export types from main api.ts
export type { Report, ReportType, ReportStatus, ReportFormat } from './api';
