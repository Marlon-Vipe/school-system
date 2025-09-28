import { Repository, SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Payment, PaymentStatus, PaymentMethod } from './payment.entity';
import { Student } from '../students/student.entity';
import { AppError } from '../../utils/appError';

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  method?: PaymentMethod;
  studentId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaymentStats {
  total: number;
  pending: number;
  completed: number;
  failed: number;
  refunded: number;
  totalAmount: number;
  completedAmount: number;
  pendingAmount: number;
  averageAmount: number;
}

export class PaymentService {
  private paymentRepository: Repository<Payment>;
  private studentRepository: Repository<Student>;

  constructor() {
    this.paymentRepository = AppDataSource.getRepository(Payment);
    this.studentRepository = AppDataSource.getRepository(Student);
  }

  async createPayment(paymentData: {
    studentId: string;
    amount: number;
    method: PaymentMethod;
    description?: string;
    dueDate?: Date;
    reference?: string;
  }): Promise<Payment> {
    try {
      // Verify student exists
      const student = await this.studentRepository.findOne({
        where: { id: paymentData.studentId }
      });

      if (!student) {
        throw AppError.notFound('Student not found');
      }

      // Create payment
      const payment = this.paymentRepository.create({
        studentId: paymentData.studentId,
        amount: paymentData.amount,
        method: paymentData.method,
        description: paymentData.description,
        dueDate: paymentData.dueDate || new Date(),
        reference: paymentData.reference,
        status: PaymentStatus.PENDING,
      });

      const savedPayment = await this.paymentRepository.save(payment);
      
      // Return payment with student data
      return this.paymentRepository.findOne({
        where: { id: savedPayment.id },
        relations: ['student']
      }) as Promise<Payment>;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw AppError.internal('Failed to create payment');
    }
  }

  async getPayments(queryParams: PaymentQueryParams = {}): Promise<{ payments: Payment[]; total: number; page: number; limit: number }> {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        method,
        studentId,
        startDate,
        endDate,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = queryParams;

      const queryBuilder = this.paymentRepository
        .createQueryBuilder('payment')
        .leftJoinAndSelect('payment.student', 'student');

      // Apply filters
      if (status) {
        queryBuilder.andWhere('payment.status = :status', { status });
      }

      if (method) {
        queryBuilder.andWhere('payment.method = :method', { method });
      }

      if (studentId) {
        queryBuilder.andWhere('payment.studentId = :studentId', { studentId });
      }

      if (startDate) {
        queryBuilder.andWhere('payment.createdAt >= :startDate', { startDate });
      }

      if (endDate) {
        queryBuilder.andWhere('payment.createdAt <= :endDate', { endDate });
      }

      // Apply sorting
      queryBuilder.orderBy(`payment.${sortBy}`, sortOrder);

      // Apply pagination
      const offset = (page - 1) * limit;
      queryBuilder.skip(offset).take(limit);

      const [payments, total] = await queryBuilder.getManyAndCount();

      return {
        payments,
        total,
        page,
        limit
      };
    } catch (error) {
      throw AppError.internal('Failed to get payments');
    }
  }

  async getPaymentsByStudent(studentId: string, queryParams: PaymentQueryParams = {}): Promise<Payment[]> {
    try {
      // Verify student exists
      const student = await this.studentRepository.findOne({
        where: { id: studentId }
      });

      if (!student) {
        throw AppError.notFound('Student not found');
      }

      const queryBuilder = this.paymentRepository
        .createQueryBuilder('payment')
        .leftJoinAndSelect('payment.student', 'student')
        .where('payment.studentId = :studentId', { studentId });

      // Apply filters
      if (queryParams.status) {
        queryBuilder.andWhere('payment.status = :status', { status: queryParams.status });
      }

      if (queryParams.method) {
        queryBuilder.andWhere('payment.method = :method', { method: queryParams.method });
      }

      if (queryParams.startDate) {
        queryBuilder.andWhere('payment.createdAt >= :startDate', { startDate: queryParams.startDate });
      }

      if (queryParams.endDate) {
        queryBuilder.andWhere('payment.createdAt <= :endDate', { endDate: queryParams.endDate });
      }

      // Apply sorting
      const sortBy = queryParams.sortBy || 'createdAt';
      const sortOrder = queryParams.sortOrder || 'DESC';
      queryBuilder.orderBy(`payment.${sortBy}`, sortOrder);

      // Apply limit
      if (queryParams.limit) {
        queryBuilder.take(queryParams.limit);
      }

      return await queryBuilder.getMany();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw AppError.internal('Failed to get payments by student');
    }
  }

  async getRecentPayments(queryParams: PaymentQueryParams = {}): Promise<Payment[]> {
    try {
      const limit = queryParams.limit || 10;
      
      const queryBuilder = this.paymentRepository
        .createQueryBuilder('payment')
        .leftJoinAndSelect('payment.student', 'student')
        .orderBy('payment.createdAt', 'DESC')
        .take(limit);

      // Apply filters
      if (queryParams.status) {
        queryBuilder.andWhere('payment.status = :status', { status: queryParams.status });
      }

      if (queryParams.method) {
        queryBuilder.andWhere('payment.method = :method', { method: queryParams.method });
      }

      return await queryBuilder.getMany();
    } catch (error) {
      throw AppError.internal('Failed to get recent payments');
    }
  }

  async getPaymentById(id: string): Promise<Payment> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id },
        relations: ['student']
      });

      if (!payment) {
        throw AppError.notFound('Payment not found');
      }

      return payment;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw AppError.internal('Failed to get payment');
    }
  }

  async updatePayment(id: string, updateData: Partial<Payment>): Promise<Payment> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id }
      });

      if (!payment) {
        throw AppError.notFound('Payment not found');
      }

      // Update payment fields
      Object.assign(payment, updateData);

      const updatedPayment = await this.paymentRepository.save(payment);
      
      // Return payment with student data
      return this.paymentRepository.findOne({
        where: { id: updatedPayment.id },
        relations: ['student']
      }) as Promise<Payment>;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw AppError.internal('Failed to update payment');
    }
  }

  async updatePaymentStatus(id: string, status: PaymentStatus, notes?: string): Promise<Payment> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id }
      });

      if (!payment) {
        throw AppError.notFound('Payment not found');
      }

      payment.status = status;
      
      if (status === PaymentStatus.COMPLETED) {
        payment.paidAt = new Date();
      }

      if (notes) {
        payment.description = payment.description 
          ? `${payment.description}\n[${new Date().toISOString()}] ${notes}`
          : `[${new Date().toISOString()}] ${notes}`;
      }

      const updatedPayment = await this.paymentRepository.save(payment);
      
      // Return payment with student data
      return this.paymentRepository.findOne({
        where: { id: updatedPayment.id },
        relations: ['student']
      }) as Promise<Payment>;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw AppError.internal('Failed to update payment status');
    }
  }

  async deletePayment(id: string): Promise<void> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id }
      });

      if (!payment) {
        throw AppError.notFound('Payment not found');
      }

      await this.paymentRepository.remove(payment);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw AppError.internal('Failed to delete payment');
    }
  }

  async getPaymentStats(): Promise<PaymentStats> {
    try {
      const [
        total,
        pending,
        completed,
        failed,
        refunded,
        totalAmountResult,
        completedAmountResult,
        pendingAmountResult
      ] = await Promise.all([
        this.paymentRepository.count(),
        this.paymentRepository.count({ where: { status: PaymentStatus.PENDING } }),
        this.paymentRepository.count({ where: { status: PaymentStatus.COMPLETED } }),
        this.paymentRepository.count({ where: { status: PaymentStatus.FAILED } }),
        this.paymentRepository.count({ where: { status: PaymentStatus.REFUNDED } }),
        this.paymentRepository
          .createQueryBuilder('payment')
          .select('SUM(payment.amount)', 'total')
          .getRawOne(),
        this.paymentRepository
          .createQueryBuilder('payment')
          .select('SUM(payment.amount)', 'total')
          .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
          .getRawOne(),
        this.paymentRepository
          .createQueryBuilder('payment')
          .select('SUM(payment.amount)', 'total')
          .where('payment.status = :status', { status: PaymentStatus.PENDING })
          .getRawOne(),
      ]);

      const totalAmount = parseFloat(totalAmountResult?.total || '0');
      const completedAmount = parseFloat(completedAmountResult?.total || '0');
      const pendingAmount = parseFloat(pendingAmountResult?.total || '0');
      const averageAmount = total > 0 ? totalAmount / total : 0;

      return {
        total,
        pending,
        completed,
        failed,
        refunded,
        totalAmount,
        completedAmount,
        pendingAmount,
        averageAmount
      };
    } catch (error) {
      throw AppError.internal('Failed to get payment statistics');
    }
  }

  async getAllPayments(): Promise<Payment[]> {
    try {
      return await this.paymentRepository.find({
        relations: ['student'],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw AppError.internal('Failed to get payments');
    }
  }
}



