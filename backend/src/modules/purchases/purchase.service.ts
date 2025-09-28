import { Repository, DataSource } from 'typeorm';
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

export interface PurchaseQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: PurchaseStatus;
  category?: PurchaseCategory;
  requestedBy?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface PurchaseStats {
  totalPurchases: number;
  totalAmount: number;
  pendingPurchases: number;
  approvedPurchases: number;
  completedPurchases: number;
  rejectedPurchases: number;
  averageAmount: number;
}

export interface PurchaseResponse {
  data: Purchase[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class PurchaseService {
  private repository: Repository<Purchase>;

  constructor() {
    // Get repository from AppDataSource
    const { AppDataSource } = require('../../config/database');
    this.repository = AppDataSource.getRepository(Purchase);
  }

  async getAllPurchases(params: PurchaseQueryParams = {}): Promise<PurchaseResponse> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      status,
      category,
      requestedBy,
      startDate,
      endDate,
      search
    } = params;

    const queryBuilder = this.repository.createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.requester', 'requester')
      .leftJoinAndSelect('purchase.approver', 'approver');

    // Apply filters
    if (status) {
      queryBuilder.andWhere('purchase.status = :status', { status });
    }

    if (category) {
      queryBuilder.andWhere('purchase.category = :category', { category });
    }

    if (requestedBy) {
      queryBuilder.andWhere('purchase.requestedBy = :requestedBy', { requestedBy });
    }

    if (startDate) {
      queryBuilder.andWhere('purchase.purchaseDate >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('purchase.purchaseDate <= :endDate', { endDate });
    }

    if (search) {
      queryBuilder.andWhere(
        '(purchase.title ILIKE :search OR purchase.description ILIKE :search OR purchase.supplier ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`purchase.${sortBy}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getPurchaseById(id: string): Promise<Purchase> {
    const purchase = await this.repository.findOne({
      where: { id },
      relations: ['requester', 'approver']
    });
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

    const purchase = this.repository.create(purchaseData);
    return await this.repository.save(purchase);
  }

  async updatePurchase(id: string, data: UpdatePurchaseRequest): Promise<Purchase> {
    const existingPurchase = await this.repository.findOne({ where: { id } });
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

    await this.repository.update(id, data);
    const updatedPurchase = await this.repository.findOne({
      where: { id },
      relations: ['requester', 'approver']
    });
    
    if (!updatedPurchase) {
      throw new AppError('Error al actualizar la compra', 500);
    }
    return updatedPurchase;
  }

  async deletePurchase(id: string): Promise<void> {
    const purchase = await this.repository.findOne({ where: { id } });
    if (!purchase) {
      throw new AppError('Compra no encontrada', 404);
    }

    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new AppError('Error al eliminar la compra', 500);
    }
  }

  async getPurchaseStats(startDate?: string, endDate?: string): Promise<PurchaseStats> {
    const queryBuilder = this.repository.createQueryBuilder('purchase');

    if (startDate) {
      queryBuilder.andWhere('purchase.purchaseDate >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('purchase.purchaseDate <= :endDate', { endDate });
    }

    const purchases = await queryBuilder.getMany();

    const totalPurchases = purchases.length;
    const totalAmount = purchases.reduce((sum, purchase) => sum + Number(purchase.amount), 0);
    const pendingPurchases = purchases.filter(p => p.status === PurchaseStatus.PENDING).length;
    const approvedPurchases = purchases.filter(p => p.status === PurchaseStatus.APPROVED).length;
    const completedPurchases = purchases.filter(p => p.status === PurchaseStatus.COMPLETED).length;
    const rejectedPurchases = purchases.filter(p => p.status === PurchaseStatus.REJECTED).length;
    const averageAmount = totalPurchases > 0 ? totalAmount / totalPurchases : 0;

    return {
      totalPurchases,
      totalAmount,
      pendingPurchases,
      approvedPurchases,
      completedPurchases,
      rejectedPurchases,
      averageAmount
    };
  }

  async approvePurchase(id: string, approvedBy: string): Promise<Purchase> {
    const purchase = await this.repository.findOne({ where: { id } });
    if (!purchase) {
      throw new AppError('Compra no encontrada', 404);
    }

    if (purchase.status !== PurchaseStatus.PENDING) {
      throw new AppError('Solo se pueden aprobar compras pendientes', 400);
    }

    await this.repository.update(id, {
      status: PurchaseStatus.APPROVED,
      approvedBy
    });

    const updatedPurchase = await this.repository.findOne({
      where: { id },
      relations: ['requester', 'approver']
    });

    return updatedPurchase as Purchase;
  }

  async rejectPurchase(id: string, rejectionReason: string, approvedBy: string): Promise<Purchase> {
    const purchase = await this.repository.findOne({ where: { id } });
    if (!purchase) {
      throw new AppError('Compra no encontrada', 404);
    }

    if (purchase.status !== PurchaseStatus.PENDING) {
      throw new AppError('Solo se pueden rechazar compras pendientes', 400);
    }

    if (!rejectionReason.trim()) {
      throw new AppError('Debe proporcionar una razón para el rechazo', 400);
    }

    await this.repository.update(id, {
      status: PurchaseStatus.REJECTED,
      rejectionReason,
      approvedBy
    });

    const updatedPurchase = await this.repository.findOne({
      where: { id },
      relations: ['requester', 'approver']
    });

    return updatedPurchase as Purchase;
  }

  async completePurchase(id: string, actualDeliveryDate?: string): Promise<Purchase> {
    const purchase = await this.repository.findOne({ where: { id } });
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

    await this.repository.update(id, updateData);

    const updatedPurchase = await this.repository.findOne({
      where: { id },
      relations: ['requester', 'approver']
    });

    return updatedPurchase as Purchase;
  }

  async cancelPurchase(id: string, cancellationReason?: string): Promise<Purchase> {
    const purchase = await this.repository.findOne({ where: { id } });
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

    await this.repository.update(id, updateData);

    const updatedPurchase = await this.repository.findOne({
      where: { id },
      relations: ['requester', 'approver']
    });

    return updatedPurchase as Purchase;
  }

  async getPurchasesByStatus(status: PurchaseStatus): Promise<Purchase[]> {
    return await this.repository.find({
      where: { status },
      relations: ['requester', 'approver'],
      order: { createdAt: 'DESC' }
    });
  }

  async getPurchasesByRequester(requestedBy: string): Promise<Purchase[]> {
    return await this.repository.find({
      where: { requestedBy },
      relations: ['requester', 'approver'],
      order: { createdAt: 'DESC' }
    });
  }
}
