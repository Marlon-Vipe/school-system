export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    type: ErrorType = ErrorType.INTERNAL_SERVER_ERROR,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  static validation(message: string): AppError {
    return new AppError(message, ErrorType.VALIDATION_ERROR, 400);
  }

  static notFound(message: string = 'Resource not found'): AppError {
    return new AppError(message, ErrorType.NOT_FOUND, 404);
  }

  static unauthorized(message: string = 'Unauthorized'): AppError {
    return new AppError(message, ErrorType.UNAUTHORIZED, 401);
  }

  static forbidden(message: string = 'Forbidden'): AppError {
    return new AppError(message, ErrorType.FORBIDDEN, 403);
  }

  static conflict(message: string): AppError {
    return new AppError(message, ErrorType.CONFLICT, 409);
  }

  static badRequest(message: string): AppError {
    return new AppError(message, ErrorType.BAD_REQUEST, 400);
  }

  static internal(message: string = 'Internal server error'): AppError {
    return new AppError(message, ErrorType.INTERNAL_SERVER_ERROR, 500);
  }

  static notImplemented(message: string = 'Not implemented'): AppError {
    return new AppError(message, ErrorType.NOT_IMPLEMENTED, 501);
  }
}



