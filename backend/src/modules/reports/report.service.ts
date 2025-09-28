import { Repository, DataSource, LessThan, In } from 'typeorm';
import { Report, ReportType, ReportStatus, ReportFormat } from './report.entity';
import { AppError } from '../../utils/appError';

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
  requestedBy: string;
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
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ReportService {
  private repository: Repository<Report>;

  constructor() {
    // Get repository from AppDataSource
    const { AppDataSource } = require('../../config/database');
    this.repository = AppDataSource.getRepository(Report);
  }

  async getAllReports(params: ReportQueryParams = {}): Promise<ReportResponse> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      type,
      status,
      format,
      requestedBy,
      startDate,
      endDate,
      search
    } = params;

    const queryBuilder = this.repository.createQueryBuilder('report')
      .leftJoinAndSelect('report.requester', 'requester');

    // Apply filters
    if (type) {
      queryBuilder.andWhere('report.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('report.status = :status', { status });
    }

    if (format) {
      queryBuilder.andWhere('report.format = :format', { format });
    }

    if (requestedBy) {
      queryBuilder.andWhere('report.requestedBy = :requestedBy', { requestedBy });
    }

    if (startDate) {
      queryBuilder.andWhere('report.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('report.createdAt <= :endDate', { endDate });
    }

    if (search) {
      queryBuilder.andWhere(
        '(report.title ILIKE :search OR report.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`report.${sortBy}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getReportById(id: string): Promise<Report> {
    const report = await this.repository.findOne({
      where: { id },
      relations: ['requester']
    });
    if (!report) {
      throw new AppError('Reporte no encontrado', 404);
    }
    return report;
  }

  async createReport(data: CreateReportRequest): Promise<Report> {
    // Validate required fields
    if (!data.title || !data.description || !data.type || !data.requestedBy) {
      throw new AppError('Todos los campos requeridos deben ser proporcionados', 400);
    }

    // Validate dates if provided
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (data.startDate) {
      startDate = new Date(data.startDate);
      if (isNaN(startDate.getTime())) {
        throw new AppError('Fecha de inicio inválida', 400);
      }
    }

    if (data.endDate) {
      endDate = new Date(data.endDate);
      if (isNaN(endDate.getTime())) {
        throw new AppError('Fecha de fin inválida', 400);
      }
    }

    // Validate date range
    if (startDate && endDate && startDate > endDate) {
      throw new AppError('La fecha de inicio no puede ser posterior a la fecha de fin', 400);
    }

    const reportData = {
      ...data,
      startDate,
      endDate,
      status: ReportStatus.PENDING,
      downloadCount: 0
    };

    const report = this.repository.create(reportData);
    return await this.repository.save(report);
  }

  async updateReport(id: string, data: UpdateReportRequest): Promise<Report> {
    const existingReport = await this.repository.findOne({ where: { id } });
    if (!existingReport) {
      throw new AppError('Reporte no encontrado', 404);
    }

    // Validate dates if provided
    if (data.generatedAt) {
      const generatedAt = new Date(data.generatedAt);
      if (isNaN(generatedAt.getTime())) {
        throw new AppError('Fecha de generación inválida', 400);
      }
      (data as any).generatedAt = generatedAt;
    }

    if (data.expiresAt) {
      const expiresAt = new Date(data.expiresAt);
      if (isNaN(expiresAt.getTime())) {
        throw new AppError('Fecha de expiración inválida', 400);
      }
      (data as any).expiresAt = expiresAt;
    }

    await this.repository.update(id, data);
    const updatedReport = await this.repository.findOne({
      where: { id },
      relations: ['requester']
    });
    
    if (!updatedReport) {
      throw new AppError('Error al actualizar el reporte', 500);
    }
    return updatedReport;
  }

  async deleteReport(id: string): Promise<void> {
    const report = await this.repository.findOne({ where: { id } });
    if (!report) {
      throw new AppError('Reporte no encontrado', 404);
    }

    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new AppError('Error al eliminar el reporte', 500);
    }
  }

  async getReportStats(startDate?: string, endDate?: string): Promise<ReportStats> {
    const queryBuilder = this.repository.createQueryBuilder('report');

    if (startDate) {
      queryBuilder.andWhere('report.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('report.createdAt <= :endDate', { endDate });
    }

    const reports = await queryBuilder.getMany();

    const totalReports = reports.length;
    const pendingReports = reports.filter(r => r.status === ReportStatus.PENDING).length;
    const completedReports = reports.filter(r => r.status === ReportStatus.COMPLETED).length;
    const failedReports = reports.filter(r => r.status === ReportStatus.FAILED).length;
    const totalDownloads = reports.reduce((sum, report) => sum + report.downloadCount, 0);

    // Group by type
    const reportsByType: Record<string, number> = {};
    reports.forEach(report => {
      reportsByType[report.type] = (reportsByType[report.type] || 0) + 1;
    });

    // Group by format
    const reportsByFormat: Record<string, number> = {};
    reports.forEach(report => {
      reportsByFormat[report.format] = (reportsByFormat[report.format] || 0) + 1;
    });

    return {
      totalReports,
      pendingReports,
      completedReports,
      failedReports,
      totalDownloads,
      reportsByType,
      reportsByFormat
    };
  }

  async generateReport(id: string): Promise<Report> {
    const report = await this.repository.findOne({ where: { id } });
    if (!report) {
      throw new AppError('Reporte no encontrado', 404);
    }

    if (report.status !== ReportStatus.PENDING) {
      throw new AppError('Solo se pueden generar reportes pendientes', 400);
    }

    // Update status to generating
    await this.repository.update(id, {
      status: ReportStatus.GENERATING
    });

    try {
      // Simulate report generation (in real implementation, this would generate actual reports)
      const generatedAt = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // Expires in 30 days

      const filePath = `reports/${id}.${report.format}`;
      const downloadUrl = `/api/reports/${id}/download`;

      await this.repository.update(id, {
        status: ReportStatus.COMPLETED,
        filePath,
        downloadUrl,
        generatedAt,
        expiresAt
      });

      const updatedReport = await this.repository.findOne({
        where: { id },
        relations: ['requester']
      });

      return updatedReport as Report;
    } catch (error) {
      // Update status to failed
      await this.repository.update(id, {
        status: ReportStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : 'Error desconocido'
      });

      throw error;
    }
  }

  async incrementDownloadCount(id: string): Promise<void> {
    await this.repository.increment({ id }, 'downloadCount', 1);
  }

  async getReportsByType(type: ReportType): Promise<Report[]> {
    return await this.repository.find({
      where: { type },
      relations: ['requester'],
      order: { createdAt: 'DESC' }
    });
  }

  async getReportsByStatus(status: ReportStatus): Promise<Report[]> {
    return await this.repository.find({
      where: { status },
      relations: ['requester'],
      order: { createdAt: 'DESC' }
    });
  }

  async getReportsByRequester(requestedBy: string): Promise<Report[]> {
    return await this.repository.find({
      where: { requestedBy },
      relations: ['requester'],
      order: { createdAt: 'DESC' }
    });
  }

  async cleanupExpiredReports(): Promise<number> {
    const expiredReports = await this.repository.find({
      where: {
        status: ReportStatus.COMPLETED,
        expiresAt: LessThan(new Date())
      }
    });

    if (expiredReports.length > 0) {
      await this.repository.update(
        { id: In(expiredReports.map(r => r.id)) },
        { status: ReportStatus.EXPIRED }
      );
    }

    return expiredReports.length;
  }
}
