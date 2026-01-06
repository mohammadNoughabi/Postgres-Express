import type { Request, Response, NextFunction } from 'express';
import User from '../repositories/user.repository.ts';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    [key: string]: unknown;
  };
}

const authorizeRole = (...allowedRoles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // Check if user is authenticated first
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      // Fetch user role from database
      const userRole = await User.getUserRoleById(req.user.id);

      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: 'User not found or role not assigned',
        });
      }

      // Check if user's role is in the allowed roles
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
      }

      // Attach role to request object for downstream use
      req.user.role = userRole;

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      next(error);
    }
  };
};

export { authorizeRole };
