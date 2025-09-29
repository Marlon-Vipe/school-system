import React from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { X, FileText, Calendar, Download, User, Clock, CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react';
import { Report } from '../../types/reports';
import { 
  getReportTypeLabel, 
  getReportStatusLabel, 
  getReportFormatLabel,
  getReportStatusColor,
  formatDate,
  formatDateOnly,
  canDownloadReport,
  canGenerateReport,
  isReportExpired
} from '../../hooks/useReports';

interface ReportDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
  onGenerate?: (report: Report) => void;
  onDownload?: (report: Report) => void;
  isGenerating?: boolean;
  isDownloading?: boolean;
}

const ReportDetailsDialog: React.FC<ReportDetailsDialogProps> = ({
  isOpen,
  onClose,
  report,
  onGenerate,
  onDownload,
  isGenerating = false,
  isDownloading = false
}) => {
  if (!report) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'generating':
        return <Play className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Transition show={isOpen}>
      <Dialog onClose={onClose} className="relative z-50">
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-primary-600" />
                    Detalles del Reporte
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Información Básica</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Título:</span>
                        <p className="text-sm text-gray-900 mt-1">{report.title}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Tipo:</span>
                        <p className="text-sm text-gray-900 mt-1">{getReportTypeLabel(report.type)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Formato:</span>
                        <p className="text-sm text-gray-900 mt-1">{getReportFormatLabel(report.format)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Estado:</span>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReportStatusColor(report.status)}`}>
                            {getStatusIcon(report.status)}
                            <span className="ml-1">{getReportStatusLabel(report.status)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-sm font-medium text-gray-700">Descripción:</span>
                      <p className="text-sm text-gray-900 mt-1">{report.description}</p>
                    </div>
                  </div>

                  {/* Date Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Fechas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Creado:</span>
                        <p className="text-sm text-gray-900 mt-1">{formatDate(report.createdAt)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Actualizado:</span>
                        <p className="text-sm text-gray-900 mt-1">{formatDate(report.updatedAt)}</p>
                      </div>
                      {report.startDate && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Fecha de Inicio:</span>
                          <p className="text-sm text-gray-900 mt-1">{formatDateOnly(report.startDate)}</p>
                        </div>
                      )}
                      {report.endDate && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Fecha de Fin:</span>
                          <p className="text-sm text-gray-900 mt-1">{formatDateOnly(report.endDate)}</p>
                        </div>
                      )}
                      {report.generatedAt && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Generado:</span>
                          <p className="text-sm text-gray-900 mt-1">{formatDate(report.generatedAt)}</p>
                        </div>
                      )}
                      {report.expiresAt && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Expira:</span>
                          <p className={`text-sm mt-1 ${isReportExpired(report.expiresAt) ? 'text-red-600' : 'text-gray-900'}`}>
                            {formatDate(report.expiresAt)}
                            {isReportExpired(report.expiresAt) && ' (Expirado)'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Información del Usuario</h4>
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {report.requester?.name} {report.requester?.lastName}
                      </span>
                    </div>
                  </div>

                  {/* Download Information */}
                  {report.downloadCount > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Descargas</h4>
                      <div className="flex items-center">
                        <Download className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {report.downloadCount} descarga{report.downloadCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Error Information */}
                  {report.errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-red-900 mb-2">Error</h4>
                      <p className="text-sm text-red-800">{report.errorMessage}</p>
                    </div>
                  )}

                  {/* Notes */}
                  {report.notes && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Notas</h4>
                      <p className="text-sm text-gray-900">{report.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cerrar
                    </button>
                    
                    {canGenerateReport(report) && onGenerate && (
                      <button
                        onClick={() => onGenerate(report)}
                        disabled={isGenerating}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generando...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Generar
                          </>
                        )}
                      </button>
                    )}
                    
                    {canDownloadReport(report) && onDownload && (
                      <button
                        onClick={() => onDownload(report)}
                        disabled={isDownloading}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isDownloading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Descargando...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Descargar
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ReportDetailsDialog;
