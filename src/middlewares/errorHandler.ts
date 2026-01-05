import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';

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
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
};
