import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { X, ShoppingCart, Package, DollarSign, Calendar, FileText, User, CreditCard, Building } from 'lucide-react';
import type { Purchase, CreatePurchaseRequest, UpdatePurchaseRequest } from '../../types/api';

interface PurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePurchaseRequest | UpdatePurchaseRequest) => void;
  purchase: Purchase | null;
  mode: 'create' | 'edit';
  isLoading: boolean;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({ isOpen, onClose, onSubmit, purchase, mode, isLoading }) => {
  const initialFormData: CreatePurchaseRequest = {
    title: '',
    description: '',
    category: 'office_supplies' as any,
    amount: 0,
    supplier: '',
    invoiceNumber: '',
    paymentMethod: 'cash' as any,
    purchaseDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    notes: '',
    requestedBy: '', // This will be set by the backend or auth context
  };

  const [formData, setFormData] = useState<CreatePurchaseRequest | UpdatePurchaseRequest>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && purchase) {
        setFormData({
          title: purchase.title,
          description: purchase.description,
          category: purchase.category,
          amount: parseFloat(purchase.amount.toString()),
          supplier: purchase.supplier || '',
          invoiceNumber: purchase.invoiceNumber || '',
          paymentMethod: purchase.paymentMethod,
          purchaseDate: new Date(purchase.purchaseDate).toISOString().split('T')[0],
          expectedDeliveryDate: purchase.expectedDeliveryDate ? new Date(purchase.expectedDeliveryDate).toISOString().split('T')[0] : '',
          notes: purchase.notes || '',
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, purchase, mode]);

  const categories = [
    { value: 'office_supplies', label: 'Materiales de Oficina' },
    { value: 'educational_materials', label: 'Materiales Educativos' },
    { value: 'technology', label: 'Tecnología' },
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'cleaning_supplies', label: 'Productos de Limpieza' },
    { value: 'food_services', label: 'Servicios de Alimentación' },
    { value: 'transportation', label: 'Transporte' },
    { value: 'other', label: 'Otros' },
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Efectivo' },
    { value: 'bank_transfer', label: 'Transferencia Bancaria' },
    { value: 'check', label: 'Cheque' },
    { value: 'credit_card', label: 'Tarjeta de Crédito' },
    { value: 'other', label: 'Otro' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      // Handle amount input specially
      const numericValue = value === '' ? 0 : parseFloat(value);
      setFormData((prev: CreatePurchaseRequest) => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData((prev: CreatePurchaseRequest) => ({
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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'El título es requerido';
    if (!formData.description) newErrors.description = 'La descripción es requerida';
    if (!formData.category) newErrors.category = 'La categoría es requerida';
    if (!formData.amount || parseFloat(formData.amount.toString()) <= 0) newErrors.amount = 'El monto debe ser un número positivo';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'El método de pago es requerido';
    if (!formData.purchaseDate) newErrors.purchaseDate = 'La fecha de compra es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(formData);
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Cerrar</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ShoppingCart className="h-6 w-6 text-primary-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {mode === 'create' ? 'Nueva Compra' : 'Editar Compra'}
                    </DialogTitle>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Title */}
                          <div className="md:col-span-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <FileText className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                placeholder="Título de la compra"
                              />
                            </div>
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                          </div>

                          {/* Category */}
                          <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Package className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              >
                                <option value="">Selecciona una categoría</option>
                                {categories.map((cat) => (
                                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                              </select>
                            </div>
                            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                          </div>

                          {/* Amount */}
                          <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Monto</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={formData.amount === 0 ? '' : formData.amount}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                placeholder="0"
                                min="0"
                                step="1"
                              />
                            </div>
                            {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
                          </div>

                          {/* Supplier */}
                          <div>
                            <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Proveedor</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Building className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                type="text"
                                id="supplier"
                                name="supplier"
                                value={formData.supplier || ''}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                placeholder="Nombre del proveedor"
                              />
                            </div>
                          </div>

                          {/* Payment Method */}
                          <div>
                            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Método de Pago</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <CreditCard className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <select
                                id="paymentMethod"
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              >
                                <option value="">Selecciona método de pago</option>
                                {paymentMethods.map((method) => (
                                  <option key={method.value} value={method.value}>{method.label}</option>
                                ))}
                              </select>
                            </div>
                            {errors.paymentMethod && <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>}
                          </div>

                          {/* Purchase Date */}
                          <div>
                            <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">Fecha de Compra</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                type="date"
                                id="purchaseDate"
                                name="purchaseDate"
                                value={formData.purchaseDate}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              />
                            </div>
                            {errors.purchaseDate && <p className="mt-1 text-sm text-red-600">{errors.purchaseDate}</p>}
                          </div>

                          {/* Expected Delivery Date */}
                          <div>
                            <label htmlFor="expectedDeliveryDate" className="block text-sm font-medium text-gray-700">Fecha de Entrega Esperada</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                type="date"
                                id="expectedDeliveryDate"
                                name="expectedDeliveryDate"
                                value={formData.expectedDeliveryDate || ''}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          {/* Invoice Number */}
                          <div>
                            <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">Número de Factura</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <FileText className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                type="text"
                                id="invoiceNumber"
                                name="invoiceNumber"
                                value={formData.invoiceNumber || ''}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                placeholder="Número de factura"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-3">
                              <FileText className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <textarea
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              rows={3}
                              className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              placeholder="Descripción detallada de la compra"
                            />
                          </div>
                          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        {/* Notes */}
                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notas (Opcional)</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-3">
                              <FileText className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <textarea
                              id="notes"
                              name="notes"
                              value={formData.notes || ''}
                              onChange={handleChange}
                              rows={2}
                              className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              placeholder="Notas adicionales"
                            />
                          </div>
                        </div>

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2"
                            disabled={isLoading}
                          >
                            {isLoading ? 'Guardando...' : (mode === 'create' ? 'Crear Compra' : 'Actualizar Compra')}
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                            onClick={onClose}
                            disabled={isLoading}
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PurchaseForm;
