import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  User,
  Calendar,
  GraduationCap
} from 'lucide-react'
import { useState } from 'react'
import { useEnrollments, useCreateEnrollment, useUpdateEnrollment, useDeleteEnrollment } from '../hooks/useEnrollments'
import EnrollmentForm from '../components/forms/EnrollmentForm'
import DeleteConfirmDialog from '../components/forms/DeleteConfirmDialog'
import ErrorBoundary from '../components/ErrorBoundary'
import type { Enrollment, CreateEnrollmentRequest, UpdateEnrollmentRequest } from '../types/api'

const EnrollmentPage = () => {
  const { data: enrollments, loading, error, refetch } = useEnrollments()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  
  // Notification states
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Local state to track deleted enrollments
  const [deletedEnrollmentIds, setDeletedEnrollmentIds] = useState<Set<string>>(new Set())
  
  // Force re-render key
  const [renderKey, setRenderKey] = useState(0)

  // Mutation hooks
  const createEnrollmentMutation = useCreateEnrollment()
  const updateEnrollmentMutation = useUpdateEnrollment()
  const deleteEnrollmentMutation = useDeleteEnrollment()

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  // Handle form operations
  const handleCreateEnrollment = async (data: CreateEnrollmentRequest) => {
    try {
      await createEnrollmentMutation.mutateAsync(data)
      showNotification('success', 'Inscripción creada exitosamente')
      setIsFormOpen(false)
      refetch()
    } catch (error) {
      showNotification('error', 'Error al crear la inscripción')
      throw error
    }
  }

  const handleUpdateEnrollment = async (data: UpdateEnrollmentRequest) => {
    if (!selectedEnrollment) return
    
    try {
      await updateEnrollmentMutation.mutateAsync({ id: selectedEnrollment.id, data })
      showNotification('success', 'Inscripción actualizada exitosamente')
      setIsFormOpen(false)
      refetch()
    } catch (error) {
      showNotification('error', 'Error al actualizar la inscripción')
      throw error
    }
  }

  const handleDeleteEnrollment = async () => {
    if (!selectedEnrollment) {
      console.log('No hay inscripción seleccionada para eliminar')
      return
    }
    
    console.log('Eliminando inscripción:', selectedEnrollment.id)
    
    try {
      const result = await deleteEnrollmentMutation.mutateAsync({ id: selectedEnrollment.id })
      console.log('Inscripción eliminada exitosamente:', result)
      showNotification('success', 'Inscripción eliminada exitosamente')
      
      // Add enrollment to deleted list for immediate UI feedback
      console.log('Adding enrollment to deleted list:', selectedEnrollment.id)
      setDeletedEnrollmentIds(prev => new Set([...prev, selectedEnrollment.id]))
      
      // Force re-render
      setRenderKey(prev => prev + 1)
      console.log('Forced re-render with key:', renderKey + 1)
      
      // Refetch data to ensure consistency
      console.log('Refetching data...')
      await refetch()
      console.log('Data refetched')
      
      setIsDeleteDialogOpen(false)
      setSelectedEnrollment(null)
    } catch (error) {
      console.error('Error al eliminar inscripción:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al eliminar la inscripción'
      showNotification('error', errorMessage)
    }
  }

  // Form handlers
  const openCreateForm = () => {
    setFormMode('create')
    setSelectedEnrollment(null)
    setIsFormOpen(true)
  }

  const openEditForm = (enrollment: Enrollment) => {
    setFormMode('edit')
    setSelectedEnrollment(enrollment)
    setIsFormOpen(true)
  }

  const openDeleteDialog = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment)
    setIsDeleteDialogOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setSelectedEnrollment(null)
  }

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedEnrollment(null)
  }

  // Filter enrollments based on search and status
  const filteredEnrollments = enrollments?.filter(enrollment => {
    // Skip deleted enrollments
    if (deletedEnrollmentIds.has(enrollment.id)) {
      return false
    }
    
    const matchesSearch = 
      enrollment.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.student?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.course?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.course?.code.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || enrollment.status === filterStatus
    
    return matchesSearch && matchesStatus
  }) || []

  // Debug log for filtering
  console.log('Filter status:', filterStatus, 'Total enrollments:', enrollments?.length || 0, 'Filtered enrollments:', filteredEnrollments.length)

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'completed':
        return `${baseClasses} bg-blue-100 text-blue-800`
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente'
      case 'active': return 'Activo'
      case 'completed': return 'Completado'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Cargando inscripciones...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="ml-2 text-red-600">Error al cargar las inscripciones</span>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6" key={renderKey}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-primary-600" />
              Inscripciones
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona las inscripciones de estudiantes a cursos
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={openCreateForm}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Inscripción
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
                  placeholder="Buscar por estudiante o curso..."
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
                <option value="active">Activo</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Enrollments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => (
            <div key={enrollment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">
                      {enrollment.student?.name} {enrollment.student?.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{enrollment.course?.name}</p>
                  </div>
                </div>
                <span className={getStatusBadge(enrollment.status)}>
                  {getStatusText(enrollment.status)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>{enrollment.student?.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>{enrollment.course?.code}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Inscrito: {formatDate(enrollment.enrolledAt)}</span>
                </div>
                {enrollment.finalGrade && (
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    <span>Nota final: {enrollment.finalGrade}</span>
                  </div>
                )}
              </div>

              {enrollment.notes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {enrollment.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => openEditForm(enrollment)}
                  className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => openDeleteDialog(enrollment)}
                  className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEnrollments.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay inscripciones</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'No se encontraron inscripciones con los filtros aplicados'
                : 'Comienza creando una nueva inscripción'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={openCreateForm}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Nueva Inscripción
              </button>
            )}
          </div>
        )}

        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center ${
            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 hover:bg-white hover:bg-opacity-20 rounded p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Forms */}
        {isFormOpen && (
          <EnrollmentForm
            mode={formMode}
            enrollment={selectedEnrollment}
            onSubmit={formMode === 'create' ? handleCreateEnrollment : handleUpdateEnrollment}
            onClose={closeForm}
            isLoading={createEnrollmentMutation.isPending || updateEnrollmentMutation.isPending}
          />
        )}

        {isDeleteDialogOpen && selectedEnrollment && (
          <DeleteConfirmDialog
            title="Eliminar Inscripción"
            message={`¿Estás seguro de que quieres eliminar la inscripción de ${selectedEnrollment.student?.name} ${selectedEnrollment.student?.lastName} en ${selectedEnrollment.course?.name}?`}
            onConfirm={handleDeleteEnrollment}
            onCancel={closeDeleteDialog}
            isLoading={deleteEnrollmentMutation.isPending}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}

export default EnrollmentPage