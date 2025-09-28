import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate, authorize } from '../../middlewares/authMiddleware';

const router = Router();
const userController = new UserController();

// Apply authentication to all routes
router.use(authenticate);

// GET /api/users - Get all users
router.get(
  '/',
  authorize('admin'),
  userController.getUsers
);

// POST /api/users - Create new user
router.post(
  '/',
  authorize('admin'),
  userController.createUser
);

export default router;



