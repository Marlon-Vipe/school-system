import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Clock, DollarSign, Tag, Calendar } from 'lucide-react';
import type { CashEntry } from '../../types/api';

interface CashStatusConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => Promise<void>;
  entry: CashEntry | null;
  action: 'confirm' | 'cancel';
  isLoading: boolean;
}

const CashStatusConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  entry,
  action,
  isLoading
}: CashStatusConfirmDialogProps) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !entry) return null;

  const getActionConfig = () => {
    switch (action) {
      case 'confirm':
        return {
          title: 'Confirmar Entrada de Caja',
          message: '¿Está seguro de que desea confirmar esta entrada de caja?',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          buttonText: 'Confirmar Entrada'
        };
      case 'cancel':
        return {
          title: 'Cancelar Entrada de Caja',
          message: '¿Está seguro de que desea cancelar esta entrada de caja?',
          icon: AlertCircle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          buttonText: 'Cancelar Entrada'
        };
      default:
        return {
          title: 'Actualizar Estado',
          message: '¿Está seguro de que desea actualizar el estado de esta entrada?',
          icon: Clock,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          buttonText: 'Actualizar Estado'
        };
    }
  };

  const config = getActionConfig();
  const IconComponent = config.icon;

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      tuition_payment: 'Pago de Matrícula',
      enrollment_fee: 'Cuota de Inscripción',
      material_fee: 'Cuota de Materiales',
      other_income: 'Otros Ingresos',
      salaries: 'Salarios',
      utilities: 'Servicios Públicos',
      maintenance: 'Mantenimiento',
      supplies: 'Suministros',
      marketing: 'Marketing',
      other_expense: 'Otros Gastos',
    };
    return labels[category] || category;
  };

  const getTypeLabel = (type: string): string => {
    return type === 'income' ? 'Ingreso' : 'Egreso';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onConfirm(notes.trim() || undefined);
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Error updating cash entry status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setNotes('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 ${config.bgColor} ${config.borderColor} border-2`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
            <h3 className="text-lg font-semibold text-gray-900">
              {config.title}
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            {config.message}
          </p>

          {/* Cash Entry Details */}
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Detalles de la Entrada:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {formatCurrency(entry.amount)}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  entry.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {getTypeLabel(entry.type)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {getCategoryLabel(entry.category)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {new Date(entry.transactionDate).toLocaleDateString('es-ES')}
                </span>
              </div>
              <div className="text-gray-600">
                <strong>Descripción:</strong> {entry.description}
              </div>
              {entry.reference && (
                <div className="text-gray-600">
                  <strong>Referencia:</strong> {entry.reference}
                </div>
              )}
            </div>
          </div>

          {/* Notes Input */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notas (opcional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agregar comentarios sobre esta acción..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 ${config.buttonColor}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  config.buttonText
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CashStatusConfirmDialog;
