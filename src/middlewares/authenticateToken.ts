import type { Request, Response, NextFunction } from 'express';
import JwtService from '../services/jwt.service.ts';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    [key: string]: unknown;
  };
}

const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token: string = req.cookies.accessToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Access token is required' });
    }

    try {
      const decoded = JwtService.validateAccessToken(token);
      req.user = {
        id: decoded.id,
        username: decoded.username,
      };
      next();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Access token has expired',
          });
        }

        if (error.name === 'JsonWebTokenError') {
          return res.status(403).json({
            success: false,
            message: 'Invalid access token',
          });
        }
      }

      return res.status(403).json({
        success: false,
        message: 'Failed to authenticate token',
      });
    }
  } catch (error) {
    console.error('Authentication Error :', error);
    next(error);
  }
};

export default authenticateToken;
