import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Calendar,
  DollarSign,
  Package,
  User,
  FileText
} from 'lucide-react';
import { 
  usePurchases, 
  usePurchaseStats, 
  useCreatePurchase, 
  useUpdatePurchase, 
  useDeletePurchase,
  useApprovePurchase,
  useRejectPurchase,
  useCompletePurchase,
  useCancelPurchase,
  formatCurrency, 
  getCategoryLabel, 
  getStatusLabel, 
  getStatusColor,
  getPaymentMethodLabel,
  formatDate
} from '../hooks/usePurchases';
import type { Purchase, CreatePurchaseRequest, UpdatePurchaseRequest } from '../types/api';
import PurchaseForm from '../components/forms/PurchaseForm';
import PurchaseStatusConfirmDialog from '../components/forms/PurchaseStatusConfirmDialog';

const PurchasesPage = () => {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<'approve' | 'reject' | 'complete' | 'cancel'>('approve');

  // Query parameters for API calls
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: 50,
    sortBy: 'createdAt' as const,
    sortOrder: 'DESC' as const,
    ...(filterStatus !== 'all' && { status: filterStatus }),
    ...(filterCategory !== 'all' && { category: filterCategory }),
    ...(searchTerm && { search: searchTerm })
  }), [currentPage, filterStatus, filterCategory, searchTerm]);

  // API hooks
  const { data: purchasesData, loading: purchasesLoading, error: purchasesError, refetch: refetchPurchases } = usePurchases(queryParams);
  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = usePurchaseStats();
  
  // Mutations
  const createPurchaseMutation = useCreatePurchase();
  const updatePurchaseMutation = useUpdatePurchase();
  const deletePurchaseMutation = useDeletePurchase();
  const approvePurchaseMutation = useApprovePurchase();
  const rejectPurchaseMutation = useRejectPurchase();
  const completePurchaseMutation = useCompletePurchase();
  const cancelPurchaseMutation = useCancelPurchase();

  // Handle form submission
  const handleSubmit = async (data: CreatePurchaseRequest | UpdatePurchaseRequest) => {
    try {
      if (formMode === 'create') {
        await createPurchaseMutation.mutateAsync(data as CreatePurchaseRequest);
      } else if (selectedPurchase) {
        await updatePurchaseMutation.mutateAsync({ id: selectedPurchase.id, data });
      }
      
      setIsFormOpen(false);
      setSelectedPurchase(null);
      refetchPurchases();
      refetchStats();
    } catch (error) {
      console.error('Error saving purchase:', error);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta compra?')) {
      try {
        await deletePurchaseMutation.mutateAsync(id);
        refetchPurchases();
        refetchStats();
      } catch (error) {
        console.error('Error deleting purchase:', error);
      }
    }
  };

  // Handle status actions
  const handleStatusAction = async (notes?: string) => {
    if (!selectedPurchase) return;

    try {
      switch (statusAction) {
        case 'approve':
          await approvePurchaseMutation.mutateAsync({ id: selectedPurchase.id });
          break;
        case 'reject':
          await rejectPurchaseMutation.mutateAsync({ 
            id: selectedPurchase.id, 
            rejectionReason: notes || 'Sin razón especificada' 
          });
          break;
        case 'complete':
          await completePurchaseMutation.mutateAsync({ id: selectedPurchase.id });
          break;
        case 'cancel':
          await cancelPurchaseMutation.mutateAsync({ 
            id: selectedPurchase.id, 
            cancellationReason: notes 
          });
          break;
      }
      
      setIsStatusDialogOpen(false);
      setSelectedPurchase(null);
      refetchPurchases();
      refetchStats();
    } catch (error) {
      console.error(`Error ${statusAction}ing purchase:`, error);
    }
  };

  // Form handlers
  const openCreateForm = () => {
    setFormMode('create');
    setSelectedPurchase(null);
    setIsFormOpen(true);
  };

  const openEditForm = (purchase: Purchase) => {
    setFormMode('edit');
    setSelectedPurchase(purchase);
    setIsFormOpen(true);
  };

  const openStatusDialog = (purchase: Purchase, action: 'approve' | 'reject' | 'complete' | 'cancel') => {
    setSelectedPurchase(purchase);
    setStatusAction(action);
    setIsStatusDialogOpen(true);
  };

  // Loading and error states
  if (purchasesLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Cargando compras...</span>
      </div>
    );
  }

  if (purchasesError || statsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <XCircle className="w-8 h-8 text-red-500" />
        <span className="ml-2 text-red-600">Error al cargar las compras</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2 text-primary-600" />
            Gestión de Compras
          </h1>
          <p className="text-gray-600 mt-1">
            Módulo de gestión de compras y adquisiciones
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={openCreateForm}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Compra
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Compras</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalPurchases}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monto Total</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalAmount)}
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
                  {stats.pendingPurchases}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completedPurchases}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar compras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="approved">Aprobado</option>
              <option value="rejected">Rechazado</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todas las categorías</option>
              <option value="office_supplies">Materiales de Oficina</option>
              <option value="educational_materials">Materiales Educativos</option>
              <option value="technology">Tecnología</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="cleaning_supplies">Productos de Limpieza</option>
              <option value="food_services">Servicios de Alimentación</option>
              <option value="transportation">Transporte</option>
              <option value="other">Otros</option>
            </select>
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Compras</h3>
        </div>
        
        {purchasesData?.data && purchasesData.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchasesData.data.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={purchase.title}>
                        {purchase.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCategoryLabel(purchase.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.supplier || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(purchase.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(purchase.status)}`}>
                        {getStatusLabel(purchase.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(purchase.purchaseDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {purchase.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openStatusDialog(purchase, 'approve')}
                              className="text-green-600 hover:text-green-900"
                              title="Aprobar"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openStatusDialog(purchase, 'reject')}
                              className="text-red-600 hover:text-red-900"
                              title="Rechazar"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {purchase.status === 'approved' && (
                          <button
                            onClick={() => openStatusDialog(purchase, 'complete')}
                            className="text-blue-600 hover:text-blue-900"
                            title="Completar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditForm(purchase)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(purchase.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
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
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay compras</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva compra.</p>
          </div>
        )}

        {/* Pagination */}
        {purchasesData?.pagination && purchasesData.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Mostrando {((currentPage - 1) * 50) + 1} a {Math.min(currentPage * 50, purchasesData.pagination.total)} de {purchasesData.pagination.total} compras
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-md">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, purchasesData.pagination.totalPages))}
                disabled={currentPage === purchasesData.pagination.totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Forms and Dialogs */}
      <PurchaseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedPurchase(null);
        }}
        onSubmit={handleSubmit}
        purchase={selectedPurchase}
        mode={formMode}
        isLoading={createPurchaseMutation.loading || updatePurchaseMutation.loading}
      />

      <PurchaseStatusConfirmDialog
        isOpen={isStatusDialogOpen}
        onClose={() => {
          setIsStatusDialogOpen(false);
          setSelectedPurchase(null);
        }}
        onConfirm={handleStatusAction}
        purchase={selectedPurchase}
        action={statusAction}
        isLoading={approvePurchaseMutation.loading || rejectPurchaseMutation.loading || completePurchaseMutation.loading || cancelPurchaseMutation.loading}
      />
    </div>
  );
};

export default PurchasesPage;
