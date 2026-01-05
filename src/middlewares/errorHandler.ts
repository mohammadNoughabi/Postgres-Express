import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import { ENV } from '../config/envVariables.ts';

export const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const status: number = err.status || 500;
  const message: string = err.message || 'Internal server error';
  res.status(status).json({
    success: false,
    status,
    message,
    stack: ENV.NODE_ENV === 'development' ? err.stack : {},
  });
};
