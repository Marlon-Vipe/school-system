import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, DollarSign, FileText, Tag } from 'lucide-react';
import type { CashEntry, CreateCashEntryRequest, UpdateCashEntryRequest } from '../../types/api';

interface CashEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCashEntryRequest | UpdateCashEntryRequest) => void;
  entry?: CashEntry | null;
  mode: 'create' | 'edit';
  isLoading?: boolean;
}

const CashEntryForm: React.FC<CashEntryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  entry,
  mode,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CreateCashEntryRequest>({
    type: 'income',
    category: 'tuition_payment',
    amount: 0,
    description: '',
    reference: '',
    notes: '',
    transactionDate: new Date().toISOString().split('T')[0],
    receiptNumber: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when entry changes or mode changes
  useEffect(() => {
    if (mode === 'edit' && entry) {
      setFormData({
        type: entry.type,
        category: entry.category,
        amount: entry.amount,
        description: entry.description,
        reference: entry.reference || '',
        notes: entry.notes || '',
        transactionDate: entry.transactionDate.split('T')[0],
        receiptNumber: entry.receiptNumber || ''
      });
    } else {
      setFormData({
        type: 'income',
        category: 'tuition_payment',
        amount: 0,
        description: '',
        reference: '',
        notes: '',
        transactionDate: new Date().toISOString().split('T')[0],
        receiptNumber: ''
      });
    }
    setErrors({});
  }, [entry, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      // Handle amount input specially
      const numericValue = value === '' ? 0 : parseFloat(value);
      setFormData((prev: CreateCashEntryRequest) => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData((prev: CreateCashEntryRequest) => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }

    if (!formData.transactionDate) {
      newErrors.transactionDate = 'La fecha es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const incomeCategories = [
    { value: 'tuition_payment', label: 'Pago de Matrícula' },
    { value: 'enrollment_fee', label: 'Cuota de Inscripción' },
    { value: 'material_fee', label: 'Cuota de Materiales' },
    { value: 'other_income', label: 'Otros Ingresos' }
  ];

  const expenseCategories = [
    { value: 'salaries', label: 'Salarios' },
    { value: 'utilities', label: 'Servicios Públicos' },
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'supplies', label: 'Suministros' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'other_expense', label: 'Otros Gastos' }
  ];

  const currentCategories = formData.type === 'income' ? incomeCategories : expenseCategories;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Nueva Entrada de Caja' : 'Editar Entrada de Caja'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Transacción
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData((prev: CreateCashEntryRequest) => ({ ...prev, type: 'income' }))}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  formData.type === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={isLoading}
              >
                <DollarSign className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">Ingreso</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev: CreateCashEntryRequest) => ({ ...prev, type: 'expense' }))}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  formData.type === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={isLoading}
              >
                <DollarSign className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">Egreso</span>
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Categoría
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isLoading}
            >
              {currentCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Monto
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount === 0 ? '' : formData.amount}
              onChange={handleChange}
              min="0"
              step="1"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
              disabled={isLoading}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe la transacción..."
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Transaction Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha de Transacción
            </label>
            <input
              type="date"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.transactionDate ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.transactionDate && (
              <p className="mt-1 text-sm text-red-600">{errors.transactionDate}</p>
            )}
          </div>

          {/* Reference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referencia (Opcional)
            </label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Número de referencia..."
              disabled={isLoading}
            />
          </div>

          {/* Receipt Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Recibo (Opcional)
            </label>
            <input
              type="text"
              name="receiptNumber"
              value={formData.receiptNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Número de recibo..."
              disabled={isLoading}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas (Opcional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Notas adicionales..."
              disabled={isLoading}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {mode === 'create' ? 'Crear Entrada' : 'Actualizar Entrada'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CashEntryForm;