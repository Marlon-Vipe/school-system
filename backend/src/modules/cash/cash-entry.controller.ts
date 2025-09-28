import { Request, Response } from 'express';
import { CashEntryService, CreateCashEntryRequest, UpdateCashEntryRequest } from './cash-entry.service';
import { CashEntryType, CashEntryCategory, CashEntryStatus } from './cash-entry.entity';

export class CashEntryController {
  private cashEntryService: CashEntryService;

  constructor() {
    this.cashEntryService = new CashEntryService();
  }

  getAllCashEntries = async (req: Request, res: Response) => {
    try {
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
      } = req.query;

      const params = {
        page: Number(page),
        limit: Number(limit),
        sortBy: String(sortBy),
        sortOrder: sortOrder as 'ASC' | 'DESC',
        type: type as CashEntryType,
        category: category as string,
        status: status as CashEntryStatus,
        startDate: startDate as string,
        endDate: endDate as string,
        search: search as string,
      };

      const result = await this.cashEntryService.getAllCashEntries(params);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error interno del servidor',
      });
    }
  };

  getCashEntryById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const cashEntry = await this.cashEntryService.getCashEntryById(id);
      res.json(cashEntry);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error interno del servidor',
      });
    }
  };

  createCashEntry = async (req: Request, res: Response) => {
    try {
      const data: CreateCashEntryRequest = {
        ...req.body,
        userId: req.user?.id, // Assuming user is attached to request by auth middleware
      };

      const cashEntry = await this.cashEntryService.createCashEntry(data);
      res.status(201).json(cashEntry);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error interno del servidor',
      });
    }
  };

  updateCashEntry = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data: UpdateCashEntryRequest = req.body;

      const cashEntry = await this.cashEntryService.updateCashEntry(id, data);
      res.json(cashEntry);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error interno del servidor',
      });
    }
  };

  deleteCashEntry = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.cashEntryService.deleteCashEntry(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error interno del servidor',
      });
    }
  };

  confirmCashEntry = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const cashEntry = await this.cashEntryService.confirmCashEntry(id);
      res.json(cashEntry);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error interno del servidor',
      });
    }
  };

  cancelCashEntry = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const cashEntry = await this.cashEntryService.cancelCashEntry(id);
      res.json(cashEntry);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error interno del servidor',
      });
    }
  };

  getCashStats = async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;
      const stats = await this.cashEntryService.getCashStats(
        startDate as string,
        endDate as string
      );
      res.json(stats);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error interno del servidor',
      });
    }
  };

  getDailyStats = async (req: Request, res: Response) => {
    try {
      const { date } = req.params;
      const stats = await this.cashEntryService.getDailyStats(date);
      res.json(stats);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error interno del servidor',
      });
    }
  };

  getMonthlyStats = async (req: Request, res: Response) => {
    try {
      const { year, month } = req.params;
      const stats = await this.cashEntryService.getMonthlyStats(
        Number(year),
        Number(month)
      );
      res.json(stats);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error interno del servidor',
      });
    }
  };

  getYearlyStats = async (req: Request, res: Response) => {
    try {
      const { year } = req.params;
      const stats = await this.cashEntryService.getYearlyStats(Number(year));
      res.json(stats);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error interno del servidor',
      });
    }
  };

  getCategoryStats = async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;
      const stats = await this.cashEntryService.getCategoryStats(
        startDate as string,
        endDate as string
      );
      res.json(stats);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error interno del servidor',
      });
    }
  };
}
