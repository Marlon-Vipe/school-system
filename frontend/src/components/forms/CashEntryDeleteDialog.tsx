import React from 'react';
import { X, AlertTriangle, DollarSign, Calendar, FileText } from 'lucide-react';
import type { CashEntry } from '../../types/api';
import { formatCurrency, getCategoryLabel, getTypeLabel } from '../../hooks/useCash';

interface CashEntryDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  cashEntry: CashEntry | null;
  isLoading: boolean;
}

const CashEntryDeleteDialog: React.FC<CashEntryDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  cashEntry,
  isLoading
}) => {
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  if (!isOpen || !cashEntry) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Eliminar Movimiento de Caja
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            ¿Está seguro de que desea eliminar este movimiento de caja? Esta acción no se puede deshacer.
          </p>

          {/* Cash Entry Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Detalles del Movimiento:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className={`font-medium ${cashEntry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {getTypeLabel(cashEntry.type)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categoría:</span>
                <span className="font-medium text-gray-900">
                  {getCategoryLabel(cashEntry.category)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monto:</span>
                <span className={`font-medium ${cashEntry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(cashEntry.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Descripción:</span>
                <span className="font-medium text-gray-900 text-right max-w-48 truncate">
                  {cashEntry.description}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-medium text-gray-900">
                  {new Date(cashEntry.transactionDate).toLocaleDateString('es-ES')}
                </span>
              </div>
              {cashEntry.reference && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Referencia:</span>
                  <span className="font-medium text-gray-900">
                    {cashEntry.reference}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800">
                  Advertencia
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Al eliminar este movimiento, se perderá toda la información asociada y no podrá ser recuperada.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Eliminando...
                </>
              ) : (
                'Eliminar Movimiento'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashEntryDeleteDialog;
