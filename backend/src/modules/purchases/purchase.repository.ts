import { Repository, DataSource } from 'typeorm';
import { Purchase, PurchaseStatus, PurchaseCategory } from './purchase.entity';

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

export class PurchaseRepository {
  private repository: Repository<Purchase>;

  constructor() {
    // This will be initialized when the database connection is available
    this.repository = null as any;
  }

  async initialize(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Purchase);
  }

  async findAll(params: PurchaseQueryParams = {}): Promise<PurchaseResponse> {
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

  async findById(id: string): Promise<Purchase | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['requester', 'approver']
    });
  }

  async create(purchaseData: Partial<Purchase>): Promise<Purchase> {
    const purchase = this.repository.create(purchaseData);
    return await this.repository.save(purchase);
  }

  async update(id: string, purchaseData: Partial<Purchase>): Promise<Purchase | null> {
    await this.repository.update(id, purchaseData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async getStats(startDate?: string, endDate?: string): Promise<PurchaseStats> {
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

  async findByStatus(status: PurchaseStatus): Promise<Purchase[]> {
    return await this.repository.find({
      where: { status },
      relations: ['requester', 'approver'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByRequester(requestedBy: string): Promise<Purchase[]> {
    return await this.repository.find({
      where: { requestedBy },
      relations: ['requester', 'approver'],
      order: { createdAt: 'DESC' }
    });
  }
}
