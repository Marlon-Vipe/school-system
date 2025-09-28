import Joi from 'joi';
import { PaymentMethod, PaymentStatus } from './payment.entity';

export const createPaymentSchema = Joi.object({
  studentId: Joi.string().uuid().required().messages({
    'string.uuid': 'Student ID must be a valid UUID',
    'any.required': 'Student ID is required',
  }),
  amount: Joi.number().positive().precision(2).required().messages({
    'number.positive': 'Amount must be greater than 0',
    'any.required': 'Amount is required',
  }),
  method: Joi.string().valid(...Object.values(PaymentMethod)).required().messages({
    'any.only': 'Payment method must be one of: cash, card, transfer, check',
    'any.required': 'Payment method is required',
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': 'Description must not exceed 500 characters',
  }),
  dueDate: Joi.date().iso().optional().messages({
    'date.format': 'Due date must be a valid ISO date',
  }),
  reference: Joi.string().max(100).optional().messages({
    'string.max': 'Reference must not exceed 100 characters',
  }),
});

export const updatePaymentSchema = Joi.object({
  amount: Joi.number().positive().precision(2).optional().messages({
    'number.positive': 'Amount must be greater than 0',
  }),
  method: Joi.string().valid(...Object.values(PaymentMethod)).optional().messages({
    'any.only': 'Payment method must be one of: cash, card, transfer, check',
  }),
  status: Joi.string().valid(...Object.values(PaymentStatus)).optional().messages({
    'any.only': 'Payment status must be one of: pending, completed, failed, refunded',
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': 'Description must not exceed 500 characters',
  }),
  dueDate: Joi.date().iso().optional().messages({
    'date.format': 'Due date must be a valid ISO date',
  }),
  reference: Joi.string().max(100).optional().messages({
    'string.max': 'Reference must not exceed 100 characters',
  }),
});

export const updatePaymentStatusSchema = Joi.object({
  status: Joi.string().valid(...Object.values(PaymentStatus)).required().messages({
    'any.only': 'Payment status must be one of: pending, completed, failed, refunded',
    'any.required': 'Payment status is required',
  }),
  notes: Joi.string().max(500).optional().messages({
    'string.max': 'Notes must not exceed 500 characters',
  }),
});

export const paymentParamsSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.uuid': 'Payment ID must be a valid UUID',
    'any.required': 'Payment ID is required',
  }),
});

export const studentParamsSchema = Joi.object({
  studentId: Joi.string().uuid().required().messages({
    'string.uuid': 'Student ID must be a valid UUID',
    'any.required': 'Student ID is required',
  }),
});

export const getPaymentsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).max(100).optional().messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit must not exceed 100',
  }),
  status: Joi.string().valid(...Object.values(PaymentStatus)).optional().messages({
    'any.only': 'Status must be one of: pending, completed, failed, refunded',
  }),
  method: Joi.string().valid(...Object.values(PaymentMethod)).optional().messages({
    'any.only': 'Method must be one of: cash, card, transfer, check',
  }),
  studentId: Joi.string().uuid().optional().messages({
    'string.uuid': 'Student ID must be a valid UUID',
  }),
  startDate: Joi.date().iso().optional().messages({
    'date.format': 'Start date must be a valid ISO date',
  }),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional().messages({
    'date.format': 'End date must be a valid ISO date',
    'date.min': 'End date must be after start date',
  }),
  sortBy: Joi.string().valid('createdAt', 'amount', 'dueDate', 'paidAt').optional().messages({
    'any.only': 'Sort by must be one of: createdAt, amount, dueDate, paidAt',
  }),
  sortOrder: Joi.string().valid('ASC', 'DESC').optional().messages({
    'any.only': 'Sort order must be ASC or DESC',
  }),
});

