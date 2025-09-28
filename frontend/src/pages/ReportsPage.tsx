import { BarChart3 } from 'lucide-react'

const ReportsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <BarChart3 className="w-8 h-8 text-primary-600 mr-3" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
          <p className="text-gray-600 mt-2">
            Genera reportes y estadísticas del sistema
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Centro de Reportes
        </h3>
        <p className="text-gray-500">
          Aquí se implementará el sistema de generación de reportes
        </p>
      </div>
    </div>
  )
}

export default ReportsPage