import { useState, useEffect } from 'react'
import { X, Loader2, User, BookOpen, Calendar, FileText, Star } from 'lucide-react'
import { useStudents } from '../../hooks/useStudents'
import { useCourses } from '../../hooks/useCourses'
import type { 
  Enrollment, 
  CreateEnrollmentRequest, 
  UpdateEnrollmentRequest,
  Student,
  Course
} from '../../types/api'

interface EnrollmentFormProps {
  mode: 'create' | 'edit'
  enrollment?: Enrollment | null
  onSubmit: (data: CreateEnrollmentRequest | UpdateEnrollmentRequest) => Promise<void>
  onClose: () => void
  isLoading?: boolean
}

const EnrollmentForm = ({ mode, enrollment, onSubmit, onClose, isLoading }: EnrollmentFormProps) => {
  const { data: students } = useStudents()
  const { data: courses } = useCourses()
  
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    status: 'pending' as 'pending' | 'active' | 'completed' | 'cancelled',
    enrolledAt: '',
    completedAt: '',
    finalGrade: '',
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (mode === 'edit' && enrollment) {
      setFormData({
        studentId: enrollment.studentId || '',
        courseId: enrollment.courseId || '',
        status: enrollment.status || 'pending',
        enrolledAt: enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toISOString().split('T')[0] : '',
        completedAt: enrollment.completedAt ? new Date(enrollment.completedAt).toISOString().split('T')[0] : '',
        finalGrade: enrollment.finalGrade?.toString() || '',
        notes: enrollment.notes || ''
      })
    }
  }, [mode, enrollment])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.studentId) {
      newErrors.studentId = 'El estudiante es requerido'
    }

    if (!formData.courseId) {
      newErrors.courseId = 'El curso es requerido'
    }

    if (formData.finalGrade && (isNaN(Number(formData.finalGrade)) || Number(formData.finalGrade) < 0 || Number(formData.finalGrade) > 100)) {
      newErrors.finalGrade = 'La nota final debe ser un número entre 0 y 100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const submitData = {
      ...formData,
      finalGrade: formData.finalGrade ? Number(formData.finalGrade) : undefined,
      enrolledAt: formData.enrolledAt || undefined,
      completedAt: formData.completedAt || undefined,
    }

    // Remove empty strings
    Object.keys(submitData).forEach(key => {
      if (submitData[key as keyof typeof submitData] === '') {
        delete submitData[key as keyof typeof submitData]
      }
    })

    await onSubmit(submitData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getStudentName = (studentId: string) => {
    const student = students?.find(s => s.id === studentId)
    return student ? `${student.name} ${student.lastName}` : ''
  }

  const getCourseName = (courseId: string) => {
    const course = courses?.find(c => c.id === courseId)
    return course ? `${course.name} (${course.code})` : ''
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Nueva Inscripción' : 'Editar Inscripción'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Estudiante *
            </label>
            <select
              value={formData.studentId}
              onChange={(e) => handleInputChange('studentId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.studentId ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            >
              <option value="">Seleccionar estudiante</option>
              {students?.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} {student.lastName} - {student.email}
                </option>
              ))}
            </select>
            {errors.studentId && (
              <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>
            )}
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Curso *
            </label>
            <select
              value={formData.courseId}
              onChange={(e) => handleInputChange('courseId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.courseId ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            >
              <option value="">Seleccionar curso</option>
              {courses?.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code}) - ${course.price}
                </option>
              ))}
            </select>
            {errors.courseId && (
              <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="pending">Pendiente</option>
              <option value="active">Activo</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          {/* Enrollment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha de Inscripción
            </label>
            <input
              type="date"
              value={formData.enrolledAt}
              onChange={(e) => handleInputChange('enrolledAt', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Completion Date */}
          {formData.status === 'completed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha de Finalización
              </label>
              <input
                type="date"
                value={formData.completedAt}
                onChange={(e) => handleInputChange('completedAt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Final Grade */}
          {formData.status === 'completed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Star className="w-4 h-4 inline mr-1" />
                Nota Final
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.finalGrade}
                onChange={(e) => handleInputChange('finalGrade', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.finalGrade ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0-100"
                disabled={isLoading}
              />
              {errors.finalGrade && (
                <p className="text-red-500 text-sm mt-1">{errors.finalGrade}</p>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Notas
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Notas adicionales sobre la inscripción..."
              disabled={isLoading}
            />
          </div>

          {/* Selected Info */}
          {(formData.studentId || formData.courseId) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Resumen de la Inscripción</h3>
              <div className="space-y-1 text-sm text-gray-600">
                {formData.studentId && (
                  <p><strong>Estudiante:</strong> {getStudentName(formData.studentId)}</p>
                )}
                {formData.courseId && (
                  <p><strong>Curso:</strong> {getCourseName(formData.courseId)}</p>
                )}
                <p><strong>Estado:</strong> {
                  formData.status === 'pending' ? 'Pendiente' :
                  formData.status === 'active' ? 'Activo' :
                  formData.status === 'completed' ? 'Completado' : 'Cancelado'
                }</p>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === 'create' ? 'Creando...' : 'Actualizando...'}
                </>
              ) : (
                mode === 'create' ? 'Crear Inscripción' : 'Actualizar Inscripción'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EnrollmentForm

