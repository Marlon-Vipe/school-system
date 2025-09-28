import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { authenticate, authorize } from '../../middlewares/authMiddleware';
import { validate, validateParams, validateQuery } from '../../middlewares/validateMiddleware';
import {
  createPaymentSchema,
  updatePaymentSchema,
  updatePaymentStatusSchema,
  paymentParamsSchema,
  studentParamsSchema,
  getPaymentsQuerySchema,
} from './payment.validation';

const router = Router();
const paymentController = new PaymentController();

// Apply authentication to all routes
router.use(authenticate);

// GET /api/payments - Get all payments with pagination and filters
router.get(
  '/',
  validateQuery(getPaymentsQuerySchema),
  paymentController.getPayments
);

// GET /api/payments/stats - Get payment statistics
router.get(
  '/stats',
  paymentController.getPaymentStats
);

// GET /api/payments/recent - Get recent payments
router.get(
  '/recent',
  validateQuery(getPaymentsQuerySchema),
  paymentController.getRecentPayments
);

// GET /api/payments/:id - Get payment by ID
router.get(
  '/:id',
  validateParams(paymentParamsSchema),
  paymentController.getPaymentById
);

// GET /api/payments/student/:studentId - Get payments by student
router.get(
  '/student/:studentId',
  validateParams(studentParamsSchema),
  validateQuery(getPaymentsQuerySchema),
  paymentController.getPaymentsByStudent
);

// POST /api/payments - Create new payment
router.post(
  '/',
  authorize('admin', 'teacher'),
  validate(createPaymentSchema),
  paymentController.createPayment
);

// PUT /api/payments/:id - Update payment
router.put(
  '/:id',
  authorize('admin', 'teacher'),
  validateParams(paymentParamsSchema),
  validate(updatePaymentSchema),
  paymentController.updatePayment
);

// DELETE /api/payments/:id - Delete payment
router.delete(
  '/:id',
  authorize('admin'),
  validateParams(paymentParamsSchema),
  paymentController.deletePayment
);

// POST /api/payments/:id/status - Update payment status
router.post(
  '/:id/status',
  authorize('admin', 'teacher'),
  validateParams(paymentParamsSchema),
  validate(updatePaymentStatusSchema),
  paymentController.updatePaymentStatus
);

// POST /api/payments/:id/complete - Mark payment as completed
router.post(
  '/:id/complete',
  authorize('admin', 'teacher'),
  validateParams(paymentParamsSchema),
  paymentController.completePayment
);

// POST /api/payments/:id/fail - Mark payment as failed
router.post(
  '/:id/fail',
  authorize('admin', 'teacher'),
  validateParams(paymentParamsSchema),
  paymentController.failPayment
);

// POST /api/payments/:id/refund - Mark payment as refunded
router.post(
  '/:id/refund',
  authorize('admin', 'teacher'),
  validateParams(paymentParamsSchema),
  paymentController.refundPayment
);

export default router;



