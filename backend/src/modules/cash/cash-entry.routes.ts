import { Router } from 'express';
import { CashEntryController } from './cash-entry.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { validateMiddleware } from '../../middlewares/validateMiddleware';
import { body, param, query } from 'express-validator';

const router = Router();
const cashEntryController = new CashEntryController();

// Validation schemas
const createCashEntryValidation = [
  body('type').isIn(['income', 'expense']).withMessage('Tipo debe ser income o expense'),
  body('category').isIn([
    'tuition_payment', 'enrollment_fee', 'material_fee', 'other_income',
    'salaries', 'utilities', 'maintenance', 'supplies', 'marketing', 'other_expense'
  ]).withMessage('Categoría inválida'),
  body('amount').isNumeric().isFloat({ min: 0.01 }).withMessage('Monto debe ser un número mayor a 0'),
  body('description').isString().isLength({ min: 1, max: 255 }).withMessage('Descripción es requerida'),
  body('reference').optional().isString().isLength({ max: 100 }).withMessage('Referencia inválida'),
  body('notes').optional().isString().isLength({ max: 1000 }).withMessage('Notas inválidas'),
  body('transactionDate').isISO8601().withMessage('Fecha de transacción inválida'),
  body('paymentId').optional().isUUID().withMessage('ID de pago inválido'),
  body('receiptNumber').optional().isString().isLength({ max: 255 }).withMessage('Número de recibo inválido'),
  body('attachments').optional().isString().withMessage('Adjuntos inválidos'),
];

const updateCashEntryValidation = [
  body('type').optional().isIn(['income', 'expense']).withMessage('Tipo debe ser income o expense'),
  body('category').optional().isIn([
    'tuition_payment', 'enrollment_fee', 'material_fee', 'other_income',
    'salaries', 'utilities', 'maintenance', 'supplies', 'marketing', 'other_expense'
  ]).withMessage('Categoría inválida'),
  body('amount').optional().isNumeric().isFloat({ min: 0.01 }).withMessage('Monto debe ser un número mayor a 0'),
  body('description').optional().isString().isLength({ min: 1, max: 255 }).withMessage('Descripción inválida'),
  body('reference').optional().isString().isLength({ max: 100 }).withMessage('Referencia inválida'),
  body('notes').optional().isString().isLength({ max: 1000 }).withMessage('Notas inválidas'),
  body('transactionDate').optional().isISO8601().withMessage('Fecha de transacción inválida'),
  body('status').optional().isIn(['pending', 'confirmed', 'cancelled']).withMessage('Estado inválido'),
  body('receiptNumber').optional().isString().isLength({ max: 255 }).withMessage('Número de recibo inválido'),
  body('attachments').optional().isString().withMessage('Adjuntos inválidos'),
];

const queryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Página debe ser un número entero mayor a 0'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite debe ser entre 1 y 100'),
  query('sortBy').optional().isIn(['transactionDate', 'amount', 'createdAt', 'description']).withMessage('Campo de ordenamiento inválido'),
  query('sortOrder').optional().isIn(['ASC', 'DESC']).withMessage('Orden debe ser ASC o DESC'),
  query('type').optional().isIn(['income', 'expense']).withMessage('Tipo debe ser income o expense'),
  query('status').optional().isIn(['pending', 'confirmed', 'cancelled']).withMessage('Estado inválido'),
  query('startDate').optional().isISO8601().withMessage('Fecha de inicio inválida'),
  query('endDate').optional().isISO8601().withMessage('Fecha de fin inválida'),
  query('search').optional().isString().isLength({ max: 255 }).withMessage('Búsqueda inválida'),
];

const idValidation = [
  param('id').isUUID().withMessage('ID inválido'),
];

const dateValidation = [
  param('date').isISO8601().withMessage('Fecha inválida'),
];

const yearMonthValidation = [
  param('year').isInt({ min: 2000, max: 2100 }).withMessage('Año inválido'),
  param('month').isInt({ min: 1, max: 12 }).withMessage('Mes inválido'),
];

const yearValidation = [
  param('year').isInt({ min: 2000, max: 2100 }).withMessage('Año inválido'),
];

// Apply auth middleware to all routes
router.use(authMiddleware);

// CRUD routes
router.get('/', queryValidation, validateMiddleware, cashEntryController.getAllCashEntries);
router.get('/stats', queryValidation, validateMiddleware, cashEntryController.getCashStats);
router.get('/stats/daily/:date', dateValidation, validateMiddleware, cashEntryController.getDailyStats);
router.get('/stats/monthly/:year/:month', yearMonthValidation, validateMiddleware, cashEntryController.getMonthlyStats);
router.get('/stats/yearly/:year', yearValidation, validateMiddleware, cashEntryController.getYearlyStats);
router.get('/stats/categories', queryValidation, validateMiddleware, cashEntryController.getCategoryStats);
router.get('/:id', idValidation, validateMiddleware, cashEntryController.getCashEntryById);

router.post('/', createCashEntryValidation, validateMiddleware, cashEntryController.createCashEntry);

router.put('/:id', [...idValidation, ...updateCashEntryValidation], validateMiddleware, cashEntryController.updateCashEntry);
router.patch('/:id/confirm', idValidation, validateMiddleware, cashEntryController.confirmCashEntry);
router.patch('/:id/cancel', idValidation, validateMiddleware, cashEntryController.cancelCashEntry);

router.delete('/:id', idValidation, validateMiddleware, cashEntryController.deleteCashEntry);

export default router;
