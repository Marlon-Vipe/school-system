import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('Access token is required');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw AppError.unauthorized('Access token is required');
    }

    // Mock authentication - accept any token that starts with 'mock'
    if (token.startsWith('mock')) {
      req.user = {
        id: 'mock-admin-1',
        email: 'admin@vipeschool.com',
        role: 'admin',
      };
      next();
    } else {
      throw AppError.unauthorized('Invalid access token');
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw AppError.unauthorized('User not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw AppError.forbidden('Insufficient permissions');
    }

    next();
  };
};



