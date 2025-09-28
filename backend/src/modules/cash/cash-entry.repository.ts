import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { CashEntry, CashEntryType, CashEntryStatus } from './cash-entry.entity';

export interface CashEntryQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  type?: CashEntryType;
  category?: string;
  status?: CashEntryStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface CashEntryStats {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  pendingIncome: number;
  pendingExpenses: number;
  entriesCount: number;
}

export interface CashEntryResponse {
  data: CashEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class CashEntryRepository {
  private repository: Repository<CashEntry>;

  constructor() {
    this.repository = AppDataSource.getRepository(CashEntry);
  }

  async findAll(params: CashEntryQueryParams = {}): Promise<CashEntryResponse> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'transactionDate',
      sortOrder = 'DESC',
      type,
      category,
      status,
      startDate,
      endDate,
      search
    } = params;

    const queryBuilder = this.repository
      .createQueryBuilder('cashEntry')
      .leftJoinAndSelect('cashEntry.user', 'user')
      .orderBy(`cashEntry.${sortBy}`, sortOrder);

    // Apply filters
    if (type) {
      queryBuilder.andWhere('cashEntry.type = :type', { type });
    }

    if (category) {
      queryBuilder.andWhere('cashEntry.category = :category', { category });
    }

    if (status) {
      queryBuilder.andWhere('cashEntry.status = :status', { status });
    }

    if (startDate) {
      queryBuilder.andWhere('cashEntry.transactionDate >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('cashEntry.transactionDate <= :endDate', { endDate });
    }

    if (search) {
      queryBuilder.andWhere(
        '(cashEntry.description ILIKE :search OR cashEntry.reference ILIKE :search OR cashEntry.notes ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    const offset = (page - 1) * limit;
    const data = await queryBuilder
      .skip(offset)
      .take(limit)
      .getMany();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<CashEntry | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async create(cashEntryData: Partial<CashEntry>): Promise<CashEntry> {
    const cashEntry = this.repository.create(cashEntryData);
    return await this.repository.save(cashEntry);
  }

  async update(id: string, cashEntryData: Partial<CashEntry>): Promise<CashEntry | null> {
    await this.repository.update(id, cashEntryData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async getStats(startDate?: string, endDate?: string): Promise<CashEntryStats> {
    const queryBuilder = this.repository.createQueryBuilder('cashEntry');

    if (startDate) {
      queryBuilder.andWhere('cashEntry.transactionDate >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('cashEntry.transactionDate <= :endDate', { endDate });
    }

    const entries = await queryBuilder.getMany();

    const totalIncome = entries
      .filter(entry => entry.type === CashEntryType.INCOME && entry.status === CashEntryStatus.CONFIRMED)
      .reduce((sum, entry) => sum + Number(entry.amount), 0);

    const totalExpenses = entries
      .filter(entry => entry.type === CashEntryType.EXPENSE && entry.status === CashEntryStatus.CONFIRMED)
      .reduce((sum, entry) => sum + Number(entry.amount), 0);

    const pendingIncome = entries
      .filter(entry => entry.type === CashEntryType.INCOME && entry.status === CashEntryStatus.PENDING)
      .reduce((sum, entry) => sum + Number(entry.amount), 0);

    const pendingExpenses = entries
      .filter(entry => entry.type === CashEntryType.EXPENSE && entry.status === CashEntryStatus.PENDING)
      .reduce((sum, entry) => sum + Number(entry.amount), 0);

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      pendingIncome,
      pendingExpenses,
      entriesCount: entries.length,
    };
  }

  async getDailyStats(date: string): Promise<CashEntryStats> {
    return await this.getStats(date, date);
  }

  async getMonthlyStats(year: number, month: number): Promise<CashEntryStats> {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    return await this.getStats(startDate, endDate);
  }

  async getYearlyStats(year: number): Promise<CashEntryStats> {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    return await this.getStats(startDate, endDate);
  }

  async getCategoryStats(startDate?: string, endDate?: string): Promise<Record<string, number>> {
    const queryBuilder = this.repository.createQueryBuilder('cashEntry');

    if (startDate) {
      queryBuilder.andWhere('cashEntry.transactionDate >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('cashEntry.transactionDate <= :endDate', { endDate });
    }

    const entries = await queryBuilder.getMany();

    const stats: Record<string, number> = {};
    
    entries.forEach(entry => {
      if (entry.status === CashEntryStatus.CONFIRMED) {
        const key = `${entry.type}_${entry.category}`;
        stats[key] = (stats[key] || 0) + Number(entry.amount);
      }
    });

    return stats;
  }
}
