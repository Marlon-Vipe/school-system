import { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  useCashEntries, 
  useCashStats, 
  useCreateCashEntry, 
  useUpdateCashEntry, 
  useDeleteCashEntry,
  useConfirmCashEntry,
  useCancelCashEntry,
  formatCurrency,
  getCategoryLabel,
  getTypeLabel,
  getStatusLabel
} from '../hooks/useCash';
import CashEntryForm from '../components/forms/CashEntryForm';
import CashStatusConfirmDialog from '../components/forms/CashStatusConfirmDialog';
import type { CashEntry, CreateCashEntryRequest, CashEntryQueryParams } from '../types/api';

const CashPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<CashEntry | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  
  // Status confirmation dialog states
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<'confirm' | 'cancel'>('confirm');

  // Query parameters for API calls
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: 50,
    sortBy: 'transactionDate' as const,
    sortOrder: 'DESC' as const,
    ...(filterType !== 'all' && { type: filterType }),
    ...(filterStatus !== 'all' && { status: filterStatus }),
    ...(searchTerm && { search: searchTerm })
  }), [currentPage, filterType, filterStatus, searchTerm]);

  // API hooks
  const { data: cashData, loading: cashLoading, error: cashError, refetch: refetchCash } = useCashEntries(queryParams);
  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useCashStats();
  
  // Mutation hooks
  const createCashEntryMutation = useCreateCashEntry();
  const updateCashEntryMutation = useUpdateCashEntry();
  const deleteCashEntryMutation = useDeleteCashEntry();
  const confirmCashEntryMutation = useConfirmCashEntry();
  const cancelCashEntryMutation = useCancelCashEntry();

  // Handle form submission
  const handleSubmit = async (data: CreateCashEntryRequest) => {
    try {
      if (formMode === 'create') {
        await createCashEntryMutation.mutateAsync(data);
      } else if (selectedEntry) {
        await updateCashEntryMutation.mutateAsync({ id: selectedEntry.id, data });
      }
      
      setIsFormOpen(false);
      setSelectedEntry(null);
      refetchCash();
      refetchStats();
    } catch (error) {
      console.error('Error saving cash entry:', error);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
      try {
        await deleteCashEntryMutation.mutateAsync(id);
        refetchCash();
        refetchStats();
      } catch (error) {
        console.error('Error deleting cash entry:', error);
      }
    }
  };

  // Handle confirm
  const handleConfirm = async (notes?: string) => {
    if (!selectedEntry) return;
    try {
      await confirmCashEntryMutation.mutateAsync(selectedEntry.id);
      refetchCash();
      refetchStats();
    } catch (error) {
      console.error('Error confirming cash entry:', error);
    }
  };

  // Handle cancel
  const handleCancel = async (notes?: string) => {
    if (!selectedEntry) return;
    try {
      await cancelCashEntryMutation.mutateAsync(selectedEntry.id);
      refetchCash();
      refetchStats();
    } catch (error) {
      console.error('Error cancelling cash entry:', error);
    }
  };

  // Open status dialog
  const openStatusDialog = (entry: CashEntry, action: 'confirm' | 'cancel') => {
    setSelectedEntry(entry);
    setStatusAction(action);
    setIsStatusDialogOpen(true);
  };

  // Open form for editing
  const openEditForm = (entry: CashEntry) => {
    setSelectedEntry(entry);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  // Open form for creating
  const openCreateForm = () => {
    setSelectedEntry(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  if (cashLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Cargando datos de caja...</span>
      </div>
    );
  }

  if (cashError || statsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="ml-2 text-red-600">Error al cargar los datos de caja</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-primary-600" />
            Control de Caja
          </h1>
          <p className="text-gray-600 mt-1">
            Módulo de gestión de ingresos y egresos
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={openCreateForm}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Entrada
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Ingresos</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalIncome)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <TrendingDown className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Egresos</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.totalExpenses)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Balance Neto</p>
                <p className={`text-2xl font-bold ${stats.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(stats.netBalance)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entradas Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.entriesCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="income">Ingresos</option>
              <option value="expense">Egresos</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cash Entries Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Entradas de Caja</h3>
        </div>
        
        {cashData?.data && cashData.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cashData.data.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(entry.transactionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getTypeColor(entry.type)}`}>
                        {getTypeLabel(entry.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCategoryLabel(entry.category)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={entry.description}>
                        {entry.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(entry.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entry.status)}`}>
                        {getStatusLabel(entry.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {entry.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openStatusDialog(entry, 'confirm')}
                              className="text-green-600 hover:text-green-900"
                              title="Confirmar entrada"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openStatusDialog(entry, 'cancel')}
                              className="text-red-600 hover:text-red-900"
                              title="Cancelar entrada"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openEditForm(entry)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar entrada"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar entrada"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay entradas de caja</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando una nueva entrada de caja.
            </p>
            <div className="mt-6">
              <button
                onClick={openCreateForm}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Entrada
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {cashData?.pagination && cashData.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {((currentPage - 1) * 50) + 1} a {Math.min(currentPage * 50, cashData.pagination.total)} de {cashData.pagination.total} entradas
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="px-3 py-1 text-sm">
              Página {currentPage} de {cashData.pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, cashData.pagination.totalPages))}
              disabled={currentPage === cashData.pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Cash Entry Form */}
      <CashEntryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedEntry(null);
        }}
        onSubmit={handleSubmit}
        entry={selectedEntry}
        mode={formMode}
        isLoading={createCashEntryMutation.loading || updateCashEntryMutation.loading}
      />

      {/* Cash Status Confirm Dialog */}
      <CashStatusConfirmDialog
        isOpen={isStatusDialogOpen}
        onClose={() => {
          setIsStatusDialogOpen(false);
          setSelectedEntry(null);
        }}
        onConfirm={statusAction === 'confirm' ? handleConfirm : handleCancel}
        entry={selectedEntry}
        action={statusAction}
        isLoading={confirmCashEntryMutation.loading || cancelCashEntryMutation.loading}
      />
    </div>
  );
};

export default CashPage;