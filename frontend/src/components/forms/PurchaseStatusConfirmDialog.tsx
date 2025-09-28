import { useState } from 'react';
import { X, CheckCircle, AlertCircle, ShoppingCart, Clock, Calendar, DollarSign, Package } from 'lucide-react';
import type { Purchase } from '../../types/api';
import { formatCurrency, getCategoryLabel, getPaymentMethodLabel } from '../../hooks/usePurchases';

interface PurchaseStatusConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => Promise<void>;
  purchase: Purchase | null;
  action: 'approve' | 'reject' | 'complete' | 'cancel';
  isLoading: boolean;
}

const PurchaseStatusConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  purchase,
  action,
  isLoading
}: PurchaseStatusConfirmDialogProps) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !purchase) return null;

  const getActionConfig = () => {
    switch (action) {
      case 'approve':
        return {
          title: 'Aprobar Compra',
          message: '¿Está seguro de que desea aprobar esta compra?',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          buttonText: 'Aprobar Compra'
        };
      case 'reject':
        return {
          title: 'Rechazar Compra',
          message: '¿Está seguro de que desea rechazar esta compra?',
          icon: AlertCircle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          buttonText: 'Rechazar Compra'
        };
      case 'complete':
        return {
          title: 'Completar Compra',
          message: '¿Está seguro de que desea marcar esta compra como completada?',
          icon: CheckCircle,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          buttonText: 'Completar Compra'
        };
      case 'cancel':
        return {
          title: 'Cancelar Compra',
          message: '¿Está seguro de que desea cancelar esta compra?',
          icon: AlertCircle,
          iconColor: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          buttonColor: 'bg-orange-600 hover:bg-orange-700',
          buttonText: 'Cancelar Compra'
        };
      default:
        return {
          title: 'Actualizar Estado',
          message: '¿Está seguro de que desea actualizar el estado de esta compra?',
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
      console.error(`Error ${action}ing purchase:`, error);
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

          {/* Purchase Details */}
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Detalles de la Compra:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  Título: {purchase.title}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  Categoría: {getCategoryLabel(purchase.category)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  Monto: {formatCurrency(purchase.amount)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  Fecha: {new Date(purchase.purchaseDate).toLocaleDateString('es-ES')}
                </span>
              </div>
              {purchase.supplier && (
                <div className="text-gray-600">
                  Proveedor: {purchase.supplier}
                </div>
              )}
              {purchase.paymentMethod && (
                <div className="text-gray-600">
                  Método de Pago: {getPaymentMethodLabel(purchase.paymentMethod)}
                </div>
              )}
              <div className="text-gray-600">
                Descripción: {purchase.description}
              </div>
            </div>
          </div>

          {/* Notes Input */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                {action === 'reject' ? 'Razón del rechazo (requerido)' : 'Notas (opcional)'}
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={action === 'reject' ? 'Explique por qué se rechaza esta compra...' : 'Agregar comentarios sobre esta acción...'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={3}
                disabled={isSubmitting}
                required={action === 'reject'}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (action === 'reject' && !notes.trim())}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 ${config.buttonColor}`}
              >
                {isSubmitting ? 'Procesando...' : config.buttonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PurchaseStatusConfirmDialog;
