import { PurchaseRepository, PurchaseQueryParams, PurchaseStats } from './purchase.repository';
import { Purchase, PurchaseStatus, PurchaseCategory, PaymentMethod } from './purchase.entity';
import { AppError } from '../../utils/appError';

export interface CreatePurchaseRequest {
  title: string;
  description: string;
  category: PurchaseCategory;
  amount: number;
  supplier?: string;
  invoiceNumber?: string;
  paymentMethod: PaymentMethod;
  purchaseDate: string;
  expectedDeliveryDate?: string;
  notes?: string;
  requestedBy: string;
}

export interface UpdatePurchaseRequest {
  title?: string;
  description?: string;
  category?: PurchaseCategory;
  amount?: number;
  supplier?: string;
  invoiceNumber?: string;
  paymentMethod?: PaymentMethod;
  purchaseDate?: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  notes?: string;
  status?: PurchaseStatus;
  rejectionReason?: string;
  attachments?: string;
}

export class PurchaseService {
  private purchaseRepository: PurchaseRepository;

  constructor() {
    this.purchaseRepository = new PurchaseRepository();
  }

  async getAllPurchases(params: PurchaseQueryParams = {}) {
    return await this.purchaseRepository.findAll(params);
  }

  async getPurchaseById(id: string): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new AppError('Compra no encontrada', 404);
    }
    return purchase;
  }

  async createPurchase(data: CreatePurchaseRequest): Promise<Purchase> {
    // Validate required fields
    if (!data.title || !data.description || !data.category || !data.amount || !data.requestedBy) {
      throw new AppError('Todos los campos requeridos deben ser proporcionados', 400);
    }

    // Validate amount
    if (data.amount <= 0) {
      throw new AppError('El monto debe ser mayor a 0', 400);
    }

    // Validate purchase date
    const purchaseDate = new Date(data.purchaseDate);
    if (isNaN(purchaseDate.getTime())) {
      throw new AppError('Fecha de compra inválida', 400);
    }

    // Validate expected delivery date if provided
    if (data.expectedDeliveryDate) {
      const expectedDate = new Date(data.expectedDeliveryDate);
      if (isNaN(expectedDate.getTime())) {
        throw new AppError('Fecha de entrega esperada inválida', 400);
      }
    }

    const purchaseData = {
      ...data,
      purchaseDate,
      expectedDeliveryDate: data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate) : undefined,
      status: PurchaseStatus.PENDING
    };

    return await this.purchaseRepository.create(purchaseData);
  }

  async updatePurchase(id: string, data: UpdatePurchaseRequest): Promise<Purchase> {
    const existingPurchase = await this.purchaseRepository.findById(id);
    if (!existingPurchase) {
      throw new AppError('Compra no encontrada', 404);
    }

    // Validate amount if provided
    if (data.amount !== undefined && data.amount <= 0) {
      throw new AppError('El monto debe ser mayor a 0', 400);
    }

    // Validate dates if provided
    if (data.purchaseDate) {
      const purchaseDate = new Date(data.purchaseDate);
      if (isNaN(purchaseDate.getTime())) {
        throw new AppError('Fecha de compra inválida', 400);
      }
      (data as any).purchaseDate = purchaseDate;
    }

    if (data.expectedDeliveryDate) {
      const expectedDate = new Date(data.expectedDeliveryDate);
      if (isNaN(expectedDate.getTime())) {
        throw new AppError('Fecha de entrega esperada inválida', 400);
      }
      (data as any).expectedDeliveryDate = expectedDate;
    }

    if (data.actualDeliveryDate) {
      const actualDate = new Date(data.actualDeliveryDate);
      if (isNaN(actualDate.getTime())) {
        throw new AppError('Fecha de entrega real inválida', 400);
      }
      (data as any).actualDeliveryDate = actualDate;
    }

    const updatedPurchase = await this.purchaseRepository.update(id, data);
    if (!updatedPurchase) {
      throw new AppError('Error al actualizar la compra', 500);
    }
    return updatedPurchase;
  }

  async deletePurchase(id: string): Promise<void> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new AppError('Compra no encontrada', 404);
    }

    const deleted = await this.purchaseRepository.delete(id);
    if (!deleted) {
      throw new AppError('Error al eliminar la compra', 500);
    }
  }

  async getPurchaseStats(startDate?: string, endDate?: string): Promise<PurchaseStats> {
    return await this.purchaseRepository.getStats(startDate, endDate);
  }

  async approvePurchase(id: string, approvedBy: string): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new AppError('Compra no encontrada', 404);
    }

    if (purchase.status !== PurchaseStatus.PENDING) {
      throw new AppError('Solo se pueden aprobar compras pendientes', 400);
    }

    return await this.purchaseRepository.update(id, {
      status: PurchaseStatus.APPROVED,
      approvedBy
    }) as Purchase;
  }

  async rejectPurchase(id: string, rejectionReason: string, approvedBy: string): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new AppError('Compra no encontrada', 404);
    }

    if (purchase.status !== PurchaseStatus.PENDING) {
      throw new AppError('Solo se pueden rechazar compras pendientes', 400);
    }

    if (!rejectionReason.trim()) {
      throw new AppError('Debe proporcionar una razón para el rechazo', 400);
    }

    return await this.purchaseRepository.update(id, {
      status: PurchaseStatus.REJECTED,
      rejectionReason,
      approvedBy
    }) as Purchase;
  }

  async completePurchase(id: string, actualDeliveryDate?: string): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new AppError('Compra no encontrada', 404);
    }

    if (purchase.status !== PurchaseStatus.APPROVED) {
      throw new AppError('Solo se pueden completar compras aprobadas', 400);
    }

    const updateData: any = {
      status: PurchaseStatus.COMPLETED
    };

    if (actualDeliveryDate) {
      const deliveryDate = new Date(actualDeliveryDate);
      if (isNaN(deliveryDate.getTime())) {
        throw new AppError('Fecha de entrega real inválida', 400);
      }
      updateData.actualDeliveryDate = deliveryDate;
    }

    return await this.purchaseRepository.update(id, updateData) as Purchase;
  }

  async cancelPurchase(id: string, cancellationReason?: string): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new AppError('Compra no encontrada', 404);
    }

    if (purchase.status === PurchaseStatus.COMPLETED) {
      throw new AppError('No se pueden cancelar compras completadas', 400);
    }

    const updateData: any = {
      status: PurchaseStatus.CANCELLED
    };

    if (cancellationReason) {
      updateData.rejectionReason = cancellationReason;
    }

    return await this.purchaseRepository.update(id, updateData) as Purchase;
  }

  async getPurchasesByStatus(status: PurchaseStatus): Promise<Purchase[]> {
    return await this.purchaseRepository.findByStatus(status);
  }

  async getPurchasesByRequester(requestedBy: string): Promise<Purchase[]> {
    return await this.purchaseRepository.findByRequester(requestedBy);
  }
}
