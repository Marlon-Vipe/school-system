import { CashEntryRepository, CashEntryQueryParams, CashEntryStats } from './cash-entry.repository';
import { CashEntry, CashEntryType, CashEntryCategory, CashEntryStatus } from './cash-entry.entity';

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
      throw new Error('Error al obtener los movimientos de caja');
    }
  }

  async getCashEntryById(id: string): Promise<CashEntry> {
    try {
      const cashEntry = await this.cashEntryRepository.findById(id);
      if (!cashEntry) {
        throw new Error('Movimiento de caja no encontrado');
      }
      return cashEntry;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Error al obtener el movimiento de caja');
    }
  }

  async createCashEntry(data: CreateCashEntryRequest): Promise<CashEntry> {
    try {
      // Validate required fields
      if (!data.type || !data.category || !data.amount || !data.description || !data.transactionDate || !data.userId) {
        throw new Error('Faltan campos requeridos');
      }

      // Validate amount
      if (data.amount <= 0) {
        throw new Error('El monto debe ser mayor a cero');
      }

      // Validate transaction date
      const transactionDate = new Date(data.transactionDate);
      if (isNaN(transactionDate.getTime())) {
        throw new Error('Fecha de transacción inválida');
      }

      const cashEntryData = {
        ...data,
        transactionDate,
        status: CashEntryStatus.PENDING,
      };

      return await this.cashEntryRepository.create(cashEntryData);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Error al crear el movimiento de caja');
    }
  }

  async updateCashEntry(id: string, data: UpdateCashEntryRequest): Promise<CashEntry> {
    try {
      const existingCashEntry = await this.cashEntryRepository.findById(id);
      if (!existingCashEntry) {
        throw new Error('Movimiento de caja no encontrado');
      }

      // Validate amount if provided
      if (data.amount !== undefined && data.amount <= 0) {
        throw new Error('El monto debe ser mayor a cero');
      }

      // Prepare update data
      const updateData: any = { ...data };
      
      // Validate transaction date if provided
      if (data.transactionDate) {
        const transactionDate = new Date(data.transactionDate);
        if (isNaN(transactionDate.getTime())) {
          throw new Error('Fecha de transacción inválida');
        }
        updateData.transactionDate = transactionDate;
      }

      const updatedCashEntry = await this.cashEntryRepository.update(id, updateData);
      if (!updatedCashEntry) {
        throw new Error('Error al actualizar el movimiento de caja');
      }

      return updatedCashEntry;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Error al actualizar el movimiento de caja');
    }
  }

  async deleteCashEntry(id: string): Promise<void> {
    try {
      const cashEntry = await this.cashEntryRepository.findById(id);
      if (!cashEntry) {
        throw new Error('Movimiento de caja no encontrado');
      }

      const deleted = await this.cashEntryRepository.delete(id);
      if (!deleted) {
        throw new Error('Error al eliminar el movimiento de caja');
      }
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Error al eliminar el movimiento de caja');
    }
  }

  async getCashStats(startDate?: string, endDate?: string): Promise<CashEntryStats> {
    try {
      return await this.cashEntryRepository.getStats(startDate, endDate);
    } catch (error) {
      throw new Error('Error al obtener estadísticas de caja');
    }
  }
}