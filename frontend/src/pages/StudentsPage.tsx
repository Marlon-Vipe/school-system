import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  FileSpreadsheet,
  Loader2,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react'
import StatusBadge from '../components/ui/StatusBadge'
import { useState } from 'react'
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from '../hooks/useStudents'
import StudentForm from '../components/forms/StudentForm'
import DeleteConfirmDialog from '../components/forms/DeleteConfirmDialog'
import ErrorBoundary from '../components/ErrorBoundary'
import { exportFilteredStudentsToExcel } from '../utils/exportToExcel'
import type { Student, CreateStudentRequest, UpdateStudentRequest } from '../types/api'

const StudentsPage = () => {
  const { data: students, loading, error, refetch } = useStudents()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  
  // Notification states
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Force re-render key
  const [renderKey, setRenderKey] = useState(0)

  // Mutation hooks
  const createStudentMutation = useCreateStudent()
  const updateStudentMutation = useUpdateStudent()
  const deleteStudentMutation = useDeleteStudent()

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  // Handle export to Excel
  const handleExportToExcel = () => {
    try {
      if (!filteredStudents || filteredStudents.length === 0) {
        showNotification('error', 'No hay estudiantes para exportar')
        return
      }

      const filters = {
        searchTerm: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined
      }

      exportFilteredStudentsToExcel(filteredStudents, filters)
      showNotification('success', `Se exportaron ${filteredStudents.length} estudiantes exitosamente`)
    } catch (error) {
      console.error('Error al exportar:', error)
      showNotification('error', 'Error al exportar los estudiantes')
    }
  }

  // Handle form operations
  const handleCreateStudent = async (data: CreateStudentRequest) => {
    console.log('Creating student with data:', data)
    try {
      const result = await createStudentMutation.mutateAsync(data)
      console.log('Student created successfully:', result)
      showNotification('success', 'Estudiante creado exitosamente')
      refetch()
    } catch (error: any) {
      console.error('Error creating student:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al crear el estudiante'
      showNotification('error', errorMessage)
      throw error
    }
  }

  const handleUpdateStudent = async (data: UpdateStudentRequest) => {
    if (!selectedStudent) return
    
    try {
      await updateStudentMutation.mutateAsync({ id: selectedStudent.id, data })
      showNotification('success', 'Estudiante actualizado exitosamente')
      refetch()
    } catch (error) {
      showNotification('error', 'Error al actualizar el estudiante')
      throw error
    }
  }

  const handleDeleteStudent = async () => {
    if (!selectedStudent) {
      console.log('No hay estudiante seleccionado para eliminar')
      return
    }
    
    console.log('Eliminando estudiante:', selectedStudent.id, selectedStudent.name)
    
    try {
      const result = await deleteStudentMutation.mutateAsync({ id: selectedStudent.id, soft: true })
      console.log('Estudiante eliminado exitosamente:', result)
      showNotification('success', 'Estudiante desactivado exitosamente. Puedes verlo cambiando el filtro a "Inactivo"')
      
      // Refetch data to get updated student status
      console.log('Refetching data...')
      await refetch()
      console.log('Data refetched')
      
      // Force re-render
      setRenderKey(prev => prev + 1)
      console.log('Forced re-render with key:', renderKey + 1)
      
      setIsDeleteDialogOpen(false)
      setSelectedStudent(null)
    } catch (error) {
      console.error('Error al eliminar estudiante:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al eliminar el estudiante'
      showNotification('error', errorMessage)
    }
  }

  // Form handlers
  const openCreateForm = () => {
    setFormMode('create')
    setSelectedStudent(null)
    setIsFormOpen(true)
  }

  const openEditForm = (student: Student) => {
    setFormMode('edit')
    setSelectedStudent(student)
    setIsFormOpen(true)
  }

  const openDeleteDialog = (student: Student) => {
    setSelectedStudent(student)
    setIsDeleteDialogOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setSelectedStudent(null)
  }

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedStudent(null)
  }

  // Filter students based on search and status
  const filteredStudents = students?.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus
    
    return matchesSearch && matchesStatus
  }) || []

  // Debug log for filtering
  console.log('Filter status:', filterStatus, 'Total students:', students?.length || 0, 'Filtered students:', filteredStudents.length)
  console.log('Current filterStatus state:', filterStatus)


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Cargando estudiantes...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-red-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error al cargar estudiantes</h3>
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Estudiantes</h1>
          <p className="text-gray-600 mt-2">
            Administra la información de todos los estudiantes
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={openCreateForm}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Estudiante
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
                placeholder="Buscar estudiantes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => {
                console.log('Filter changed from', filterStatus, 'to', e.target.value)
                setFilterStatus(e.target.value)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="suspended">Suspendido</option>
            </select>
            <button 
              onClick={handleExportToExcel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              disabled={!filteredStudents || filteredStudents.length === 0}
              title="Exportar a Excel"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
              Exportar ({filteredStudents.length})
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div key={renderKey} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Inscripción
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm || filterStatus !== 'all' 
                        ? 'No se encontraron estudiantes con los filtros aplicados'
                        : 'No hay estudiantes registrados'
                      }
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {student.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.email}</div>
                      <div className="text-sm text-gray-500">{student.phone || 'Sin teléfono'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.address || 'Sin dirección'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={student.status as any} size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(student.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => openEditForm(student)}
                          className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditForm(student)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                          title="Editar estudiante"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteDialog(student)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Eliminar estudiante"
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
              Mostrando <span className="font-medium">{filteredStudents.length}</span> de{' '}
              <span className="font-medium">{students?.length || 0}</span> estudiantes
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Anterior
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Siguiente
              </button>
            </nav>
          </div>
        </div>
      </div>

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

      {/* Student Form */}
      <StudentForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={formMode === 'create' ? handleCreateStudent : handleUpdateStudent}
        isLoading={createStudentMutation.isLoading || updateStudentMutation.isLoading}
        mode={formMode}
        student={selectedStudent || undefined}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteStudent}
        title="Eliminar Estudiante"
        message="¿Está seguro de que desea eliminar este estudiante? Esta acción marcará al estudiante como inactivo."
        itemName={selectedStudent ? `${selectedStudent.name} ${selectedStudent.lastName}` : ''}
        isLoading={deleteStudentMutation.isLoading}
        isSoftDelete={true}
      />
      </div>
    </ErrorBoundary>
  )
}

export default StudentsPage