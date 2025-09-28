import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { 
  useCashStats, 
  useDailyStats, 
  useMonthlyStats, 
  useYearlyStats,
  useCategoryStats,
  formatCurrency 
} from '../hooks/useCash';

const CashDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Get stats based on selected period
  const { data: generalStats } = useCashStats();
  const { data: dailyStats } = useDailyStats(selectedDate);
  const { data: monthlyStats } = useMonthlyStats(selectedYear, selectedMonth);
  const { data: yearlyStats } = useYearlyStats(selectedYear);
  const { data: categoryStats } = useCategoryStats();

  const getCurrentStats = () => {
    switch (selectedPeriod) {
      case 'daily':
        return dailyStats;
      case 'monthly':
        return monthlyStats;
      case 'yearly':
        return yearlyStats;
      default:
        return generalStats;
    }
  };

  const currentStats = getCurrentStats();

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'daily':
        return new Date(selectedDate).toLocaleDateString('es-ES');
      case 'monthly':
        return new Date(selectedYear, selectedMonth - 1).toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long' 
        });
      case 'yearly':
        return selectedYear.toString();
      default:
        return 'General';
    }
  };

  const exportToExcel = () => {
    // TODO: Implement Excel export functionality
    console.log('Exporting cash data to Excel...');
  };

  const refreshData = () => {
    // TODO: Implement refresh functionality
    console.log('Refreshing cash data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard de Caja</h2>
          <p className="text-gray-600 mt-1">
            Resumen financiero y estadísticas de movimientos
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={refreshData}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </button>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Período:</span>
          </div>
          
          <div className="flex space-x-2">
            {(['daily', 'monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {period === 'daily' ? 'Diario' : period === 'monthly' ? 'Mensual' : 'Anual'}
              </button>
            ))}
          </div>

          {selectedPeriod === 'daily' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          )}

          {selectedPeriod === 'monthly' && (
            <div className="flex space-x-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>
                    {new Date(0, month - 1).toLocaleDateString('es-ES', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedPeriod === 'yearly' && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {currentStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(currentStats.totalIncome)}
                </p>
                <p className="text-xs text-gray-500">
                  {currentStats.pendingIncome > 0 && (
                    <span className="text-yellow-600">
                      {formatCurrency(currentStats.pendingIncome)} pendientes
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Egresos</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(currentStats.totalExpenses)}
                </p>
                <p className="text-xs text-gray-500">
                  {currentStats.pendingExpenses > 0 && (
                    <span className="text-yellow-600">
                      {formatCurrency(currentStats.pendingExpenses)} pendientes
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${currentStats.netBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
                <DollarSign className={`w-6 h-6 ${currentStats.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Balance Neto</p>
                <p className={`text-2xl font-bold ${currentStats.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {formatCurrency(currentStats.netBalance)}
                </p>
                <p className="text-xs text-gray-500">
                  {getPeriodLabel()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Movimientos</p>
                <p className="text-2xl font-bold text-purple-600">
                  {currentStats.entriesCount}
                </p>
                <p className="text-xs text-gray-500">
                  Total registrados
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {categoryStats && Object.keys(categoryStats).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Desglose por Categoría</h3>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {Object.entries(categoryStats).map(([category, amount]) => {
              const [type, categoryKey] = category.split('_');
              const isIncome = type === 'income';
              
              return (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${isIncome ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm font-medium text-gray-900">
                      {categoryKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <span className={`text-sm font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Nuevo Ingreso</p>
                <p className="text-sm text-gray-500">Registrar un ingreso</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Nuevo Egreso</p>
                <p className="text-sm text-gray-500">Registrar un egreso</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Ver Reportes</p>
                <p className="text-sm text-gray-500">Generar reportes detallados</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashDashboard;
