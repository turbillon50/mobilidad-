import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
  meta?: Record<string, unknown>;
}

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200, meta?: Record<string, unknown>): void {
  res.status(statusCode).json({ success: true, data, ...(message && { message }), ...(meta && { meta }) });
}

export function sendCreated<T>(res: Response, data: T, message?: string): void {
  sendSuccess(res, data, message, 201);
}

export const success = <T>(data: T, message?: string) => ({ success: true, data, ...(message && { message }) });
export const created = <T>(data: T, message?: string) => ({ success: true, data, ...(message && { message }) });

export function sendNoContent(res: Response): void { res.status(204).send(); }

export function sendError(res: Response, message: string, statusCode = 500, code?: string): void {
  res.status(statusCode).json({ success: false, error: message, ...(code && { code }) });
}