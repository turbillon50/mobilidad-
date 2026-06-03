import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try { req.body = schema.parse(req.body); next(); }
    catch (error) {
      if (error instanceof ZodError) { res.status(422).json({ success: false, error: 'Validation failed', code: 'VALIDATION_ERROR', details: error.flatten().fieldErrors }); return; }
      next(error);
    }
  };
}