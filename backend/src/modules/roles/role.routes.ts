import { Router } from 'express';
import { RoleController } from './role.controller';
import { authenticate, authorize } from '../../middlewares/authMiddleware';

const router = Router();
const roleController = new RoleController();

// Apply authentication to all routes
router.use(authenticate);

// GET /api/roles - Get all roles
router.get(
  '/',
  authorize('admin'),
  roleController.getRoles
);

// GET /api/permissions - Get all permissions
router.get(
  '/permissions',
  authorize('admin'),
  roleController.getPermissions
);

export default router;



