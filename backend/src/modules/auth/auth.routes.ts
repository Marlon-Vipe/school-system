import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middlewares/validateMiddleware';
import { authenticate, authorize } from '../../middlewares/authMiddleware';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from './auth.validation';

const router = Router();
const authController = new AuthController();

// POST /api/auth/register - Register new user (admin only)
router.post(
  '/register',
  authenticate,
  authorize('admin'),
  validate(registerSchema),
  authController.register
);

// POST /api/auth/login - Login user
router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

// GET /api/auth/profile - Get user profile (requires authentication)
router.get(
  '/profile',
  authenticate,
  authController.getProfile
);

// PUT /api/auth/profile - Update user profile (requires authentication)
router.put(
  '/profile',
  authenticate,
  validate(updateProfileSchema),
  authController.updateProfile
);

// POST /api/auth/change-password - Change password (requires authentication)
router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

// POST /api/auth/refresh-token - Refresh JWT token (requires authentication)
router.post(
  '/refresh-token',
  authenticate,
  authController.refreshToken
);

export default router;



