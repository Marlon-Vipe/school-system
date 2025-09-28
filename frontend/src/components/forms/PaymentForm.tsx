import { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, CreditCard, User } from 'lucide-react';
import { useStudents } from "../../hooks/useStudents";
import type { Payment, CreatePaymentRequest, UpdatePaymentRequest } from '../types/api';

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePaymentRequest | UpdatePaymentRequest) => Promise<void>;
  isLoading: boolean;
  mode: 'create' | 'edit';
  payment?: Payment;
}

const PaymentForm = ({ isOpen, onClose, onSubmit, isLoading, mode, payment }: PaymentFormProps) => {
  const { data: students } = useStudents();
  
  console.log('PaymentForm: Students loaded:', students?.length || 0);
  console.log('PaymentForm: Students data:', students);
  
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    method: 'cash' as 'cash' | 'card' | 'transfer' | 'check',
    description: '',
    dueDate: '',
    reference: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && payment) {
        setFormData({
          studentId: payment.studentId,
          amount: payment.amount.toString(),
          method: payment.method,
          description: payment.description || '',
          dueDate: payment.dueDate ? new Date(payment.dueDate).toISOString().split('T')[0] : '',
          reference: payment.reference || '',
        });
      } else {
        setFormData({
          studentId: '',
          amount: '',
          method: 'cash',
          description: '',
          dueDate: '',
          reference: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, payment]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentId) {
      newErrors.studentId = 'Selecciona un estudiante';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }

    if (!formData.method) {
      newErrors.method = 'Selecciona un método de pago';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'La fecha de vencimiento es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting payment:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Crear Pago' : 'Editar Pago'}
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
          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Estudiante *
            </label>
            <select
              value={formData.studentId}
              onChange={(e) => handleChange('studentId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.studentId ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            >
              <option value="">Selecciona un estudiante</option>
              {students?.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} {student.lastName} - {student.email}
                </option>
              ))}
            </select>
            {errors.studentId && (
              <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Monto *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
              disabled={isLoading}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="w-4 h-4 inline mr-2" />
              Método de Pago *
            </label>
            <select
              value={formData.method}
              onChange={(e) => handleChange('method', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.method ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            >
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="transfer">Transferencia</option>
              <option value="check">Cheque</option>
            </select>
            {errors.method && (
              <p className="mt-1 text-sm text-red-600">{errors.method}</p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Fecha de Vencimiento *
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.dueDate ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
            )}
          </div>

          {/* Reference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referencia
            </label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => handleChange('reference', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ej: MAT-2024-001"
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Descripción del pago..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : mode === 'create' ? 'Crear Pago' : 'Actualizar Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
