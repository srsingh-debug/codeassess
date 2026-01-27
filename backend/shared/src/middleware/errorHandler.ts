import { Request, Response, NextFunction } from 'express';
import { ResponseBuilder } from '../utils/response';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      ResponseBuilder.error(err.message, err.code, err.details)
    );
  }

  // Validation errors
  if (err.message.includes('Validation error')) {
    try {
      const parsedError = JSON.parse(err.message);
      return res.status(400).json(
        ResponseBuilder.error(parsedError.message, 'VALIDATION_ERROR', parsedError.details)
      );
    } catch {
      // Fall through to generic error
    }
  }

  // Generic error
  console.error('Unhandled error:', err);
  return res.status(500).json(
    ResponseBuilder.error('Internal server error', 'INTERNAL_ERROR')
  );
};

