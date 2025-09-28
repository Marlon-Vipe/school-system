import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { config } from '../config';

interface ErrorResponse {
  success: false;
  error: {
    type: string;
    message: string;
    statusCode: number;
    stack?: string;
  };
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let appError: AppError;

  // Si el error ya es un AppError, lo usamos directamente
  if (error instanceof AppError) {
    appError = error;
  } else {
    // Si no, creamos un AppError genérico
    appError = AppError.internal(
      config.nodeEnv === 'production' 
        ? 'Something went wrong!' 
        : error.message
    );
  }

  // Log del error
  console.error('Error:', {
    type: appError.type,
    message: appError.message,
    statusCode: appError.statusCode,
    stack: appError.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Respuesta del error
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      type: appError.type,
      message: appError.message,
      statusCode: appError.statusCode,
      ...(config.nodeEnv === 'development' && { stack: appError.stack }),
    },
  };

  res.status(appError.statusCode).json(errorResponse);
};

// Middleware para manejar rutas no encontradas
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = AppError.notFound(`Route ${req.originalUrl} not found`);
  next(error);
};
