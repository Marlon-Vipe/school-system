import { Router } from 'express';
import { EnrollmentController } from './enrollment.controller';
import { validate, validateQuery, validateParams } from '../../middlewares/validateMiddleware';
import { authenticate, authorize } from '../../middlewares/authMiddleware';
import {
  createEnrollmentSchema,
  updateEnrollmentSchema,
  getEnrollmentsQuerySchema,
  enrollmentParamsSchema,
  studentParamsSchema,
  courseParamsSchema,
  completeEnrollmentSchema,
  cancelEnrollmentSchema,
} from './enrollment.validation';

const router = Router();
const enrollmentController = new EnrollmentController();

// Apply authentication to all routes
router.use(authenticate);

// GET /api/enrollments - Get all enrollments with pagination and filters
router.get(
  '/',
  validateQuery(getEnrollmentsQuerySchema),
  enrollmentController.getEnrollments
);

// GET /api/enrollments/stats - Get enrollment statistics
router.get(
  '/stats',
  enrollmentController.getEnrollmentStats
);

// GET /api/enrollments/recent - Get recent enrollments
router.get(
  '/recent',
  validateQuery(getEnrollmentsQuerySchema),
  enrollmentController.getRecentEnrollments
);

// GET /api/enrollments/student/:studentId - Get enrollments by student
router.get(
  '/student/:studentId',
  validateParams(studentParamsSchema),
  enrollmentController.getEnrollmentsByStudent
);

// GET /api/enrollments/course/:courseId - Get enrollments by course
router.get(
  '/course/:courseId',
  validateParams(courseParamsSchema),
  enrollmentController.getEnrollmentsByCourse
);

// GET /api/enrollments/:id - Get enrollment by ID
router.get(
  '/:id',
  validateParams(enrollmentParamsSchema),
  enrollmentController.getEnrollmentById
);

// POST /api/enrollments - Create new enrollment
router.post(
  '/',
  authorize('admin', 'teacher'),
  validate(createEnrollmentSchema),
  enrollmentController.createEnrollment
);

// PUT /api/enrollments/:id - Update enrollment
router.put(
  '/:id',
  authorize('admin', 'teacher'),
  validateParams(enrollmentParamsSchema),
  validate(updateEnrollmentSchema),
  enrollmentController.updateEnrollment
);

// DELETE /api/enrollments/:id - Delete enrollment
router.delete(
  '/:id',
  authorize('admin'),
  validateParams(enrollmentParamsSchema),
  enrollmentController.deleteEnrollment
);

// POST /api/enrollments/:id/approve - Approve enrollment
router.post(
  '/:id/approve',
  authorize('admin', 'teacher'),
  validateParams(enrollmentParamsSchema),
  enrollmentController.approveEnrollment
);

// POST /api/enrollments/:id/complete - Complete enrollment
router.post(
  '/:id/complete',
  authorize('admin', 'teacher'),
  validateParams(enrollmentParamsSchema),
  validate(completeEnrollmentSchema),
  enrollmentController.completeEnrollment
);

// POST /api/enrollments/:id/cancel - Cancel enrollment
router.post(
  '/:id/cancel',
  authorize('admin', 'teacher'),
  validateParams(enrollmentParamsSchema),
  validate(cancelEnrollmentSchema),
  enrollmentController.cancelEnrollment
);

export default router;



