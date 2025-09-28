import { 
  Users, 
  BookOpen, 
  CreditCard, 
  TrendingUp,
  Calendar,
  DollarSign,
  Loader2
} from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'

const DashboardPage = () => {
  const { stats, loading, error } = useDashboard()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CO').format(num)
  }

  const dashboardStats = [
    {
      title: 'Total Estudiantes',
      value: formatNumber(stats.totalStudents),
      change: `${stats.activeStudents} activos`,
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Cursos Activos',
      value: formatNumber(stats.activeCourses),
      change: `${stats.totalCourses} total`,
      changeType: 'positive' as const,
      icon: BookOpen,
      color: 'bg-green-500'
    },
    {
      title: 'Pagos del Mes',
      value: formatCurrency(stats.monthlyRevenue),
      change: `${stats.completedPayments} completados`,
      changeType: 'positive' as const,
      icon: CreditCard,
      color: 'bg-purple-500'
    },
    {
      title: 'Ingresos Totales',
      value: formatCurrency(stats.totalRevenue),
      change: `${stats.pendingPayments} pendientes`,
      changeType: stats.pendingPayments > 0 ? 'negative' as const : 'positive' as const,
      icon: DollarSign,
      color: 'bg-yellow-500'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Cargando datos del sistema...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-center h-24">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-red-600 mt-2">
            Error al cargar los datos: {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido al Sistema de Gestión Educativa
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm mt-1 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-primary-600 mr-3" />
                <span>Nuevo Estudiante</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 text-primary-600 mr-3" />
                <span>Crear Curso</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-primary-600 mr-3" />
                <span>Registrar Pago</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Sistema</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-600">Estudiantes activos</span>
              </div>
              <span className="font-medium">{stats.activeStudents}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-600">Cursos disponibles</span>
              </div>
              <span className="font-medium">{stats.activeCourses}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-600">Pagos completados</span>
              </div>
              <span className="font-medium">{stats.completedPayments}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-gray-600">Pagos pendientes</span>
              </div>
              <span className="font-medium">{stats.pendingPayments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage