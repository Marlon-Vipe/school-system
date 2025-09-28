import { Router } from 'express';
import { StudentController } from './student.controller';
import { validate, validateQuery, validateParams } from '../../middlewares/validateMiddleware';
import { authenticate, authorize } from '../../middlewares/authMiddleware';
import {
  createStudentSchema,
  updateStudentSchema,
  getStudentsQuerySchema,
  studentParamsSchema,
} from './student.validation';

const router = Router();
const studentController = new StudentController();

// Apply authentication to all routes
router.use(authenticate);

// GET /api/students - Get all students with pagination and filters
router.get(
  '/',
  validateQuery(getStudentsQuerySchema),
  studentController.getStudents
);

// GET /api/students/stats - Get student statistics
router.get(
  '/stats',
  studentController.getStudentStats
);

// GET /api/students/recent - Get recent students
router.get(
  '/recent',
  validateQuery(getStudentsQuerySchema),
  studentController.getRecentStudents
);

// GET /api/students/course/:courseId - Get students by course
router.get(
  '/course/:courseId',
  validateParams(studentParamsSchema),
  studentController.getStudentsByCourse
);

// GET /api/students/:id - Get student by ID
router.get(
  '/:id',
  validateParams(studentParamsSchema),
  studentController.getStudentById
);

// POST /api/students - Create new student
router.post(
  '/',
  authorize('admin', 'teacher'),
  validate(createStudentSchema),
  studentController.createStudent
);

// PUT /api/students/:id - Update student
router.put(
  '/:id',
  authorize('admin', 'teacher'),
  validateParams(studentParamsSchema),
  validate(updateStudentSchema),
  studentController.updateStudent
);

// DELETE /api/students/:id - Delete student (soft delete by default)
router.delete(
  '/:id',
  authorize('admin'),
  validateParams(studentParamsSchema),
  studentController.deleteStudent
);

export default router;
