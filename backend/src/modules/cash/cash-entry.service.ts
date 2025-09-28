import { CashEntryRepository, CashEntryQueryParams, CashEntryStats } from './cash-entry.repository';
import { CashEntry, CashEntryType, CashEntryCategory, CashEntryStatus } from './cash-entry.entity';
import { AppError } from '../../utils/appError';

export interface CreateCashEntryRequest {
  type: CashEntryType;
  category: CashEntryCategory;
  amount: number;
  description: string;
  reference?: string;
  notes?: string;
  transactionDate: string;
  userId: string;
  paymentId?: string;
  receiptNumber?: string;
  attachments?: string;
}

export interface UpdateCashEntryRequest {
  type?: CashEntryType;
  category?: CashEntryCategory;
  amount?: number;
  description?: string;
  reference?: string;
  notes?: string;
  transactionDate?: string;
  status?: CashEntryStatus;
  receiptNumber?: string;
  attachments?: string;
}

export class CashEntryService {
  private cashEntryRepository: CashEntryRepository;

  constructor() {
    this.cashEntryRepository = new CashEntryRepository();
  }

  async getAllCashEntries(params: CashEntryQueryParams = {}) {
    try {
      return await this.cashEntryRepository.findAll(params);
    } catch (error) {
      throw new AppError('Error al obtener los movimientos de caja', 500);
    }
  }

  async getCashEntryById(id: string): Promise<CashEntry> {
    try {
      const cashEntry = await this.cashEntryRepository.findById(id);
      if (!cashEntry) {
        throw new AppError('Movimiento de caja no encontrado', 404);
      }
      return cashEntry;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al obtener el movimiento de caja', 500);
    }
  }

  async createCashEntry(data: CreateCashEntryRequest): Promise<CashEntry> {
    try {
      // Validate required fields
      if (!data.type || !data.category || !data.amount || !data.description || !data.transactionDate || !data.userId) {
        throw new AppError('Faltan campos requeridos', 400);
      }

      // Validate amount
      if (data.amount <= 0) {
        throw new AppError('El monto debe ser mayor a cero', 400);
      }

      // Validate transaction date
      const transactionDate = new Date(data.transactionDate);
      if (isNaN(transactionDate.getTime())) {
        throw new AppError('Fecha de transacción inválida', 400);
      }

      // Validate type and category match
      const incomeCategories = [
        CashEntryCategory.TUITION_PAYMENT,
        CashEntryCategory.ENROLLMENT_FEE,
        CashEntryCategory.MATERIAL_FEE,
        CashEntryCategory.OTHER_INCOME,
      ];

      const expenseCategories = [
        CashEntryCategory.SALARIES,
        CashEntryCategory.UTILITIES,
        CashEntryCategory.MAINTENANCE,
        CashEntryCategory.SUPPLIES,
        CashEntryCategory.MARKETING,
        CashEntryCategory.OTHER_EXPENSE,
      ];

      if (data.type === CashEntryType.INCOME && !incomeCategories.includes(data.category)) {
        throw new AppError('Categoría inválida para tipo de ingreso', 400);
      }

      if (data.type === CashEntryType.EXPENSE && !expenseCategories.includes(data.category)) {
        throw new AppError('Categoría inválida para tipo de egreso', 400);
      }

      const cashEntryData = {
        ...data,
        transactionDate,
        status: CashEntryStatus.PENDING,
      };

      return await this.cashEntryRepository.create(cashEntryData);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al crear el movimiento de caja', 500);
    }
  }

  async updateCashEntry(id: string, data: UpdateCashEntryRequest): Promise<CashEntry> {
    try {
      const existingCashEntry = await this.cashEntryRepository.findById(id);
      if (!existingCashEntry) {
        throw new AppError('Movimiento de caja no encontrado', 404);
      }

      // Validate amount if provided
      if (data.amount !== undefined && data.amount <= 0) {
        throw new AppError('El monto debe ser mayor a cero', 400);
      }

      // Validate transaction date if provided
      if (data.transactionDate) {
        const transactionDate = new Date(data.transactionDate);
        if (isNaN(transactionDate.getTime())) {
          throw new AppError('Fecha de transacción inválida', 400);
        }
        data.transactionDate = transactionDate.toISOString();
      }

      const updatedCashEntry = await this.cashEntryRepository.update(id, data);
      if (!updatedCashEntry) {
        throw new AppError('Error al actualizar el movimiento de caja', 500);
      }

      return updatedCashEntry;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al actualizar el movimiento de caja', 500);
    }
  }

  async deleteCashEntry(id: string): Promise<void> {
    try {
      const cashEntry = await this.cashEntryRepository.findById(id);
      if (!cashEntry) {
        throw new AppError('Movimiento de caja no encontrado', 404);
      }

      const deleted = await this.cashEntryRepository.delete(id);
      if (!deleted) {
        throw new AppError('Error al eliminar el movimiento de caja', 500);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al eliminar el movimiento de caja', 500);
    }
  }

  async confirmCashEntry(id: string): Promise<CashEntry> {
    try {
      const cashEntry = await this.cashEntryRepository.findById(id);
      if (!cashEntry) {
        throw new AppError('Movimiento de caja no encontrado', 404);
      }

      if (cashEntry.status === CashEntryStatus.CONFIRMED) {
        throw new AppError('El movimiento ya está confirmado', 400);
      }

      return await this.cashEntryRepository.update(id, { status: CashEntryStatus.CONFIRMED });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al confirmar el movimiento de caja', 500);
    }
  }

  async cancelCashEntry(id: string): Promise<CashEntry> {
    try {
      const cashEntry = await this.cashEntryRepository.findById(id);
      if (!cashEntry) {
        throw new AppError('Movimiento de caja no encontrado', 404);
      }

      if (cashEntry.status === CashEntryStatus.CANCELLED) {
        throw new AppError('El movimiento ya está cancelado', 400);
      }

      return await this.cashEntryRepository.update(id, { status: CashEntryStatus.CANCELLED });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al cancelar el movimiento de caja', 500);
    }
  }

  async getCashStats(startDate?: string, endDate?: string): Promise<CashEntryStats> {
    try {
      return await this.cashEntryRepository.getStats(startDate, endDate);
    } catch (error) {
      throw new AppError('Error al obtener estadísticas de caja', 500);
    }
  }

  async getDailyStats(date: string): Promise<CashEntryStats> {
    try {
      return await this.cashEntryRepository.getDailyStats(date);
    } catch (error) {
      throw new AppError('Error al obtener estadísticas diarias', 500);
    }
  }

  async getMonthlyStats(year: number, month: number): Promise<CashEntryStats> {
    try {
      return await this.cashEntryRepository.getMonthlyStats(year, month);
    } catch (error) {
      throw new AppError('Error al obtener estadísticas mensuales', 500);
    }
  }

  async getYearlyStats(year: number): Promise<CashEntryStats> {
    try {
      return await this.cashEntryRepository.getYearlyStats(year);
    } catch (error) {
      throw new AppError('Error al obtener estadísticas anuales', 500);
    }
  }

  async getCategoryStats(startDate?: string, endDate?: string): Promise<Record<string, number>> {
    try {
      return await this.cashEntryRepository.getCategoryStats(startDate, endDate);
    } catch (error) {
      throw new AppError('Error al obtener estadísticas por categoría', 500);
    }
  }
}
