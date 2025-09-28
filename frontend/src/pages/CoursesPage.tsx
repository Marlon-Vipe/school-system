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
  Clock,
  Users,
  Calendar
} from 'lucide-react'
import StatusBadge from '../components/ui/StatusBadge'
import { useState } from 'react'
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '../hooks/useCourses'
import CourseForm from '../components/forms/CourseForm'
import DeleteConfirmModal from '../components/forms/DeleteConfirmModal'
import type { Course, CreateCourseRequest } from '../types/api'

const CoursesPage = () => {
  const { data: courses, loading, error, refetch } = useCourses()
  const createCourseMutation = useCreateCourse()
  const updateCourseMutation = useUpdateCourse()
  const deleteCourseMutation = useDeleteCourse()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null)

  // Filter courses based on search and status
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus
    
    return matchesSearch && matchesStatus
  }) || []


  // CRUD handlers
  const handleCreateCourse = async (data: CreateCourseRequest) => {
    await createCourseMutation.mutateAsync(data)
    refetch()
  }

  const handleUpdateCourse = async (data: CreateCourseRequest) => {
    if (!editingCourse) return
    await updateCourseMutation.mutateAsync({ id: editingCourse.id, data })
    refetch()
    setEditingCourse(null)
  }

  const handleDeleteCourse = async () => {
    if (!deletingCourse) return
    await deleteCourseMutation.mutateAsync(deletingCourse.id)
    refetch()
    setDeletingCourse(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Cargando cursos...</span>
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
            <h3 className="text-sm font-medium text-red-800">Error al cargar cursos</h3>
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <BookOpen className="w-8 h-8 text-primary-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Cursos</h1>
            <p className="text-gray-600 mt-2">
              Administra los cursos disponibles en el sistema
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Curso
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar cursos..."
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
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="draft">Borrador</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' 
                ? 'No se encontraron cursos con los filtros aplicados'
                : 'No hay cursos registrados'
              }
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando tu primer curso'
              }
            </p>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-500">Código: {course.code}</p>
                  </div>
                </div>
                <StatusBadge status={course.status as any} size="sm" />
              </div>
              
              {course.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
              )}
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.duration}h</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{course.maxStudents}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {course.category && `Categoría: ${course.category}`}
                  </span>
                  <span className="font-semibold text-primary-600">
                    ${course.price.toLocaleString()}
                  </span>
                </div>
                {course.startDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Inicio: {new Date(course.startDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setEditingCourse(course)}
                  className="text-gray-600 hover:text-gray-900 p-1"
                  title="Editar curso"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setDeletingCourse(course)}
                  className="text-red-600 hover:text-red-900 p-1"
                  title="Eliminar curso"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Course Modal */}
      <CourseForm
        course={editingCourse}
        isOpen={showCreateModal || !!editingCourse}
        onClose={() => {
          setShowCreateModal(false)
          setEditingCourse(null)
        }}
        onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
        isLoading={createCourseMutation.isPending || updateCourseMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingCourse}
        onClose={() => setDeletingCourse(null)}
        onConfirm={handleDeleteCourse}
        title="Eliminar Curso"
        message="¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer."
        itemName={deletingCourse?.name || ''}
        isLoading={deleteCourseMutation.isPending}
      />
    </div>
  )
}

export default CoursesPage