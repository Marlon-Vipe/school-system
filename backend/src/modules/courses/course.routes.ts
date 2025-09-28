import { Router } from 'express';
import { CourseController } from './course.controller';
import { authenticate, authorize } from '../../middlewares/authMiddleware';
import { validate, validateParams } from '../../middlewares/validateMiddleware';
import { 
  createCourseSchema, 
  updateCourseSchema, 
  courseIdSchema 
} from './course.validation';

const router = Router();
const courseController = new CourseController();

// Apply authentication to all routes
router.use(authenticate);

// GET /api/courses - Get all courses
router.get('/', courseController.getCourses);

// GET /api/courses/:id - Get course by ID
router.get(
  '/:id',
  validateParams(courseIdSchema),
  courseController.getCourseById
);

// POST /api/courses - Create new course
router.post(
  '/',
  authorize('admin', 'teacher'),
  validate(createCourseSchema),
  courseController.createCourse
);

// PUT /api/courses/:id - Update course
router.put(
  '/:id',
  authorize('admin', 'teacher'),
  validateParams(courseIdSchema),
  validate(updateCourseSchema),
  courseController.updateCourse
);

// DELETE /api/courses/:id - Delete course
router.delete(
  '/:id',
  authorize('admin'),
  validateParams(courseIdSchema),
  courseController.deleteCourse
);

export default router;



