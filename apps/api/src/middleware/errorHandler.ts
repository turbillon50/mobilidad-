import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(422).json({ success: false, error: 'Validation failed', code: 'VALIDATION_ERROR', details: err.flatten().fieldErrors });
    return;
  }
  if (err instanceof AppError) {
    if (!err.isOperational) logger.error('Non-operational error', { message: err.message, stack: err.stack });
    res.status(err.statusCode).json({ success: false, error: err.message, ...(err.code && { code: err.code }) });
    return;
  }
  if ((err as NodeJS.ErrnoException).code === '23505') {
    res.status(409).json({ success: false, error: 'Duplicate entry', code: 'DUPLICATE_ENTRY' });
    return;
  }
  if ((err as NodeJS.ErrnoException).code === '23503') {
    res.status(400).json({ success: false, error: 'Referenced resource not found', code: 'FOREIGN_KEY_VIOLATION' });
    return;
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, error: 'Invalid or expired token', code: 'TOKEN_INVALID' });
    return;
  }
  logger.error('Unhandled error', { message: err.message, stack: err.stack, url: req.url, method: req.method });
  res.status(500).json({ success: false, error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message, code: 'INTERNAL_ERROR' });
}