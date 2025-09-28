import { Request, Response, NextFunction } from 'express';
import { PaymentService } from './payment.service';
import { PaymentMethod, PaymentStatus } from './payment.entity';
import { validate } from '../../middlewares/validateMiddleware';
import { validateParams, validateQuery } from '../../middlewares/validateMiddleware';
import {
  createPaymentSchema,
  updatePaymentSchema,
  updatePaymentStatusSchema,
  paymentParamsSchema,
  studentParamsSchema,
  getPaymentsQuerySchema,
} from './payment.validation';
import { ApiResponse } from '../../types/common';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  // GET /api/payments - Get all payments with pagination and filters
  getPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryParams = req.query;
      const payments = await this.paymentService.getPayments(queryParams);

      const response: ApiResponse<any> = {
        success: true,
        data: payments,
        message: 'Payments retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  // GET /api/payments/stats - Get payment statistics
  getPaymentStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.paymentService.getPaymentStats();

      const response: ApiResponse<any> = {
        success: true,
        data: stats,
        message: 'Payment statistics retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  // GET /api/payments/recent - Get recent payments
  getRecentPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryParams = req.query;
      const payments = await this.paymentService.getRecentPayments(queryParams);

      const response: ApiResponse<any> = {
        success: true,
        data: payments,
        message: 'Recent payments retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  // GET /api/payments/:id - Get payment by ID
  getPaymentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const payment = await this.paymentService.getPaymentById(id);

      const response: ApiResponse<any> = {
        success: true,
        data: payment,
        message: 'Payment retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  // GET /api/payments/student/:studentId - Get payments by student
  getPaymentsByStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { studentId } = req.params;
      const queryParams = req.query;
      const payments = await this.paymentService.getPaymentsByStudent(studentId, queryParams);

      const response: ApiResponse<any> = {
        success: true,
        data: payments,
        message: 'Student payments retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  // POST /api/payments - Create new payment
  createPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paymentData = req.body;
      const payment = await this.paymentService.createPayment(paymentData);

      const response: ApiResponse<any> = {
        success: true,
        data: payment,
        message: 'Payment created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  // PUT /api/payments/:id - Update payment
  updatePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const payment = await this.paymentService.updatePayment(id, updateData);

      const response: ApiResponse<any> = {
        success: true,
        data: payment,
        message: 'Payment updated successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  // DELETE /api/payments/:id - Delete payment
  deletePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.paymentService.deletePayment(id);

      const response: ApiResponse<void> = {
        success: true,
        message: 'Payment deleted successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  // POST /api/payments/:id/status - Update payment status
  updatePaymentStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const payment = await this.paymentService.updatePaymentStatus(id, status, notes);

      const response: ApiResponse<any> = {
        success: true,
        data: payment,
        message: 'Payment status updated successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  // POST /api/payments/:id/complete - Mark payment as completed
  completePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const payment = await this.paymentService.updatePaymentStatus(id, PaymentStatus.COMPLETED, notes);

      const response: ApiResponse<any> = {
        success: true,
        data: payment,
        message: 'Payment marked as completed successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  // POST /api/payments/:id/fail - Mark payment as failed
  failPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const payment = await this.paymentService.updatePaymentStatus(id, PaymentStatus.FAILED, notes);

      const response: ApiResponse<any> = {
        success: true,
        data: payment,
        message: 'Payment marked as failed successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  // POST /api/payments/:id/refund - Mark payment as refunded
  refundPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const payment = await this.paymentService.updatePaymentStatus(id, PaymentStatus.REFUNDED, notes);

      const response: ApiResponse<any> = {
        success: true,
        data: payment,
        message: 'Payment marked as refunded successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}



