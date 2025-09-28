import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Clock, DollarSign, User } from 'lucide-react';
import type { Payment } from '../types/api';

interface PaymentStatusConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => Promise<void>;
  payment: Payment | null;
  action: 'complete' | 'fail' | 'refund';
  isLoading: boolean;
}

const PaymentStatusConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  payment,
  action,
  isLoading
}: PaymentStatusConfirmDialogProps) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !payment) return null;

  const getActionConfig = () => {
    switch (action) {
      case 'complete':
        return {
          title: 'Completar Pago',
          message: '¿Está seguro de que desea marcar este pago como completado?',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          buttonText: 'Completar Pago'
        };
      case 'fail':
        return {
          title: 'Marcar como Fallido',
          message: '¿Está seguro de que desea marcar este pago como fallido?',
          icon: AlertCircle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          buttonText: 'Marcar como Fallido'
        };
      case 'refund':
        return {
          title: 'Reembolsar Pago',
          message: '¿Está seguro de que desea reembolsar este pago?',
          icon: DollarSign,
          iconColor: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          buttonColor: 'bg-orange-600 hover:bg-orange-700',
          buttonText: 'Reembolsar Pago'
        };
      default:
        return {
          title: 'Actualizar Estado',
          message: '¿Está seguro de que desea actualizar el estado de este pago?',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onConfirm(notes.trim() || undefined);
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Error updating payment status:', error);
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

          {/* Payment Details */}
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Detalles del Pago:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {payment.student?.name} {payment.student?.lastName}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  ${Number(payment.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  Método: {payment.method === 'cash' ? 'Efectivo' : 
                          payment.method === 'card' ? 'Tarjeta' :
                          payment.method === 'transfer' ? 'Transferencia' : 'Cheque'}
                </span>
              </div>
              {payment.reference && (
                <div className="text-gray-600">
                  Referencia: {payment.reference}
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

export default PaymentStatusConfirmDialog;

