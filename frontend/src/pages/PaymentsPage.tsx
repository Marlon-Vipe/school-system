import {
  CreditCard,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  DollarSign,
  Calendar,
  User
} from 'lucide-react'
import StatusBadge from '../components/ui/StatusBadge'
import { useState } from 'react'
import { usePayments, useCreatePayment, useUpdatePayment, useDeletePayment, useUpdatePaymentStatus, useCompletePayment, useFailPayment, useRefundPayment } from '../hooks/usePayments'
import PaymentForm from '../components/forms/PaymentForm'
import DeleteConfirmDialog from '../components/forms/DeleteConfirmDialog'
import PaymentStatusConfirmDialog from '../components/forms/PaymentStatusConfirmDialog'
import ErrorBoundary from '../components/ErrorBoundary'
import type { Payment, CreatePaymentRequest, UpdatePaymentRequest, PaymentQueryParams } from '../types/api'

const PaymentsPage = () => {
  console.log('PaymentsPage: Component rendering...')
  
  const [queryParams, setQueryParams] = useState<PaymentQueryParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  })

  console.log('PaymentsPage: Calling usePayments hook...')
  const { data: paymentsResponse, loading, error, refetch } = usePayments(queryParams)
  
  console.log('PaymentsPage: Hook result:', { paymentsResponse, loading, error })
  const payments = paymentsResponse?.data || []
  const pagination = paymentsResponse?.pagination

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMethod, setFilterMethod] = useState('all')

  // Notification states
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Force re-render key
  const [renderKey, setRenderKey] = useState(0)

  // Status confirmation dialog states
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [statusAction, setStatusAction] = useState<'complete' | 'fail' | 'refund'>('complete')

  // Mutation hooks
  const createPaymentMutation = useCreatePayment()
  const updatePaymentMutation = useUpdatePayment()
  const deletePaymentMutation = useDeletePayment()
  const updateStatusMutation = useUpdatePaymentStatus()
  const completePaymentMutation = useCompletePayment()
  const failPaymentMutation = useFailPayment()
  const refundPaymentMutation = useRefundPayment()

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  // Handle form operations
  const handleCreatePayment = async (data: CreatePaymentRequest) => {
    try {
      await createPaymentMutation.mutateAsync(data)
      showNotification('success', 'Pago creado exitosamente')
      refetch()
      setRenderKey(prev => prev + 1)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al crear el pago'
      showNotification('error', errorMessage)
      throw error
    }
  }

  const handleUpdatePayment = async (data: UpdatePaymentRequest) => {
    if (!selectedPayment) return

    try {
      await updatePaymentMutation.mutateAsync({ id: selectedPayment.id, data })
      showNotification('success', 'Pago actualizado exitosamente')
      refetch()
      setRenderKey(prev => prev + 1)
    } catch (error) {
      showNotification('error', 'Error al actualizar el pago')
      throw error
    }
  }

  const handleDeletePayment = async () => {
    if (!selectedPayment) return

    try {
      await deletePaymentMutation.mutateAsync({ id: selectedPayment.id })
      showNotification('success', 'Pago eliminado exitosamente')
      refetch()
      setRenderKey(prev => prev + 1)
      setIsDeleteDialogOpen(false)
      setSelectedPayment(null)
    } catch (error) {
      showNotification('error', 'Error al eliminar el pago')
    }
  }

  const handleUpdateStatus = async (paymentId: string, status: 'pending' | 'completed' | 'failed' | 'refunded') => {
    try {
      await updateStatusMutation.mutateAsync({ 
        id: paymentId, 
        data: { status, notes: `Estado cambiado a ${status}` }
      })
      showNotification('success', `Pago marcado como ${status}`)
      refetch()
      setRenderKey(prev => prev + 1)
    } catch (error) {
      showNotification('error', 'Error al actualizar el estado del pago')
    }
  }

  // Form handlers
  const openCreateForm = () => {
    setFormMode('create')
    setSelectedPayment(null)
    setIsFormOpen(true)
  }

  const openEditForm = (payment: Payment) => {
    setFormMode('edit')
    setSelectedPayment(payment)
    setIsFormOpen(true)
  }

  const openDeleteDialog = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsDeleteDialogOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setSelectedPayment(null)
  }

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedPayment(null)
  }

  // Status action handlers
  const openStatusDialog = (payment: Payment, action: 'complete' | 'fail' | 'refund') => {
    setSelectedPayment(payment)
    setStatusAction(action)
    setIsStatusDialogOpen(true)
  }

  const closeStatusDialog = () => {
    setIsStatusDialogOpen(false)
    setSelectedPayment(null)
  }

  const handleStatusAction = async (notes?: string) => {
    if (!selectedPayment) return

    try {
      let result
      switch (statusAction) {
        case 'complete':
          result = await completePaymentMutation.mutateAsync({ id: selectedPayment.id, notes })
          showNotification('success', 'Pago completado exitosamente')
          break
        case 'fail':
          result = await failPaymentMutation.mutateAsync({ id: selectedPayment.id, notes })
          showNotification('success', 'Pago marcado como fallido')
          break
        case 'refund':
          result = await refundPaymentMutation.mutateAsync({ id: selectedPayment.id, notes })
          showNotification('success', 'Pago reembolsado exitosamente')
          break
      }
      
      // Refetch data to show updated status
      await refetch()
      setRenderKey(prev => prev + 1)
    } catch (error) {
      console.error('Error updating payment status:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al actualizar el estado del pago'
      showNotification('error', errorMessage)
      throw error
    }
  }

  // Filter payments based on search and filters
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus
    const matchesMethod = filterMethod === 'all' || payment.method === filterMethod

    return matchesSearch && matchesStatus && matchesMethod
  })


  const getMethodText = (method: string) => {
    switch (method) {
      case 'cash': return 'Efectivo'
      case 'card': return 'Tarjeta'
      case 'transfer': return 'Transferencia'
      case 'check': return 'Cheque'
      default: return method
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Cargando pagos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-red-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error al cargar pagos</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={refetch}
              className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Pagos</h1>
            <p className="text-gray-600 mt-2">
              Administra todos los pagos de estudiantes
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={openCreateForm}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Pago
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar pagos..."
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="completed">Completado</option>
                <option value="failed">Fallido</option>
                <option value="refunded">Reembolsado</option>
              </select>
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Todos los métodos</option>
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta</option>
                <option value="transfer">Transferencia</option>
                <option value="check">Cheque</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div key={renderKey} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Vencimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referencia
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        {searchTerm || filterStatus !== 'all' || filterMethod !== 'all'
                          ? 'No se encontraron pagos con los filtros aplicados'
                          : 'No hay pagos registrados'
                        }
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.student?.name} {payment.student?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.student?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                          <span className="text-sm font-medium text-gray-900">
                            ${Number(payment.amount).toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getMethodText(payment.method)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={payment.status as any} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(payment.dueDate).toLocaleDateString('es-ES')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.reference || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openEditForm(payment)}
                            className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditForm(payment)}
                            className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                            title="Editar pago"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {payment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => openStatusDialog(payment, 'complete')}
                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                title="Marcar como completado"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openStatusDialog(payment, 'fail')}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                title="Marcar como fallido"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {payment.status === 'completed' && (
                            <button
                              onClick={() => openStatusDialog(payment, 'refund')}
                              className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50"
                              title="Reembolsar pago"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => openDeleteDialog(payment)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Eliminar pago"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Anterior
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{filteredPayments.length}</span> de{' '}
                  <span className="font-medium">{pagination.total}</span> pagos
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Anterior
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    {pagination.page}
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Siguiente
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 ${
            notification.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Payment Form */}
        <PaymentForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onSubmit={formMode === 'create' ? handleCreatePayment : handleUpdatePayment}
          isLoading={createPaymentMutation.isLoading || updatePaymentMutation.isLoading}
          mode={formMode}
          payment={selectedPayment || undefined}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDeletePayment}
          title="Eliminar Pago"
          message="¿Está seguro de que desea eliminar este pago? Esta acción no se puede deshacer."
          itemName={selectedPayment ? `Pago de ${selectedPayment.student?.name} ${selectedPayment.student?.lastName} - $${selectedPayment.amount}` : ''}
          isLoading={deletePaymentMutation.isLoading}
          isSoftDelete={false}
        />

        {/* Payment Status Confirmation Dialog */}
        <PaymentStatusConfirmDialog
          isOpen={isStatusDialogOpen}
          onClose={closeStatusDialog}
          onConfirm={handleStatusAction}
          payment={selectedPayment}
          action={statusAction}
          isLoading={completePaymentMutation.isLoading || failPaymentMutation.isLoading || refundPaymentMutation.isLoading}
        />
      </div>
    </ErrorBoundary>
  )
}

export default PaymentsPage