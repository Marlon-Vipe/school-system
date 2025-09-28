import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  Play,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { 
  useReports, 
  useReportStats, 
  useCreateReport, 
  useDeleteReport, 
  useGenerateReport, 
  useDownloadReport,
  getReportTypeLabel,
  getReportStatusLabel,
  getReportFormatLabel,
  getReportStatusColor,
  formatDate,
  formatDateOnly,
  canDownloadReport,
  canGenerateReport,
  canDeleteReport,
  ReportType,
  ReportStatus,
  ReportFormat,
  ReportQueryParams
} from '../hooks/useReports';
import type { Report, ReportFilters } from '../types/api';
import ReportForm from '../components/forms/ReportForm';
import ReportDetailsDialog from '../components/forms/ReportDetailsDialog';
import ReportDeleteConfirmDialog from '../components/forms/ReportDeleteConfirmDialog';

const ReportsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ReportFilters>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  // Query parameters
  const queryParams: ReportQueryParams = useMemo(() => ({
    page: currentPage,
    limit: pageSize,
    ...filters,
    search: searchTerm || undefined
  }), [currentPage, pageSize, filters, searchTerm]);

  // API hooks
  const { data: reportsData, loading, error, refetch } = useReports(queryParams);
  const { data: stats } = useReportStats();
  const createReportMutation = useCreateReport();
  const deleteReportMutation = useDeleteReport();
  const generateReportMutation = useGenerateReport();
  const downloadReportMutation = useDownloadReport();

  // Handlers
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof ReportFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
    setCurrentPage(1);
  };

  const handleCreateReport = async (data: any) => {
    try {
      await createReportMutation.mutateAsync(data);
      setShowCreateForm(false);
      refetch();
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  const handleDeleteReport = async () => {
    if (!reportToDelete) return;
    
    try {
      await deleteReportMutation.mutateAsync(reportToDelete.id);
      setShowDeleteDialog(false);
      setReportToDelete(null);
      refetch();
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const handleGenerateReport = async (report: Report) => {
    try {
      await generateReportMutation.mutateAsync(report.id);
      refetch();
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleDownloadReport = async (report: Report) => {
    try {
      const result = await downloadReportMutation.mutateAsync(report.id);
      // In a real implementation, you would trigger the download
      console.log('Download result:', result);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const openDeleteDialog = (report: Report) => {
    setReportToDelete(report);
    setShowDeleteDialog(true);
  };

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.PENDING:
        return <Clock className="w-4 h-4" />;
      case ReportStatus.GENERATING:
        return <Play className="w-4 h-4" />;
      case ReportStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4" />;
      case ReportStatus.FAILED:
        return <XCircle className="w-4 h-4" />;
      case ReportStatus.EXPIRED:
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800">Error al cargar los reportes: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-primary-600" />
            Reportes
          </h1>
          <p className="text-gray-600 mt-1">
            Genera y gestiona reportes del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Reporte
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reportes</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalReports}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completedReports}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pendingReports}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Download className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Descargas</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalDownloads}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar reportes..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los tipos</option>
            {Object.values(ReportType).map(type => (
              <option key={type} value={type}>
                {getReportTypeLabel(type)}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            {Object.values(ReportStatus).map(status => (
              <option key={status} value={status}>
                {getReportStatusLabel(status)}
              </option>
            ))}
          </select>

          {/* Format Filter */}
          <select
            value={filters.format || ''}
            onChange={(e) => handleFilterChange('format', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los formatos</option>
            {Object.values(ReportFormat).map(format => (
              <option key={format} value={format}>
                {getReportFormatLabel(format)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Reportes</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Cargando reportes...</p>
          </div>
        ) : reportsData?.data && reportsData.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Formato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descargas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportsData.data.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {report.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {getReportTypeLabel(report.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReportStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        <span className="ml-1">{getReportStatusLabel(report.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getReportFormatLabel(report.format)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.downloadCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {canGenerateReport(report) && (
                          <button
                            onClick={() => handleGenerateReport(report)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Generar reporte"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        
                        {canDownloadReport(report) && (
                          <button
                            onClick={() => handleDownloadReport(report)}
                            className="text-green-600 hover:text-green-900"
                            title="Descargar reporte"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {canDeleteReport(report) && (
                          <button
                            onClick={() => openDeleteDialog(report)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar reporte"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No se encontraron reportes</p>
            <p className="text-sm text-gray-500 mt-1">
              Crea tu primer reporte para comenzar
            </p>
          </div>
        )}

        {/* Pagination */}
        {reportsData?.pagination && reportsData.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, reportsData.pagination.total)} de {reportsData.pagination.total} resultados
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Anterior
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Página {currentPage} de {reportsData.pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, reportsData.pagination.totalPages))}
                  disabled={currentPage === reportsData.pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ReportForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateReport}
        isLoading={createReportMutation.isPending}
      />

      <ReportDetailsDialog
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
        onGenerate={handleGenerateReport}
        onDownload={handleDownloadReport}
        isGenerating={generateReportMutation.isPending}
        isDownloading={downloadReportMutation.isPending}
      />

      <ReportDeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteReport}
        report={reportToDelete}
        isLoading={deleteReportMutation.isPending}
      />
    </div>
  );
};

export default ReportsPage;