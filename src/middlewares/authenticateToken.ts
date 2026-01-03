import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { ENV } from '../config/envVariables.ts';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Access denied. No token provided' });
    }
    jwt.verify(
      token,
      ENV.JWT_SECRET,
      (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
        if (err) {
          return res
            .status(403)
            .json({ success: false, message: 'Invalid or expired token' });
        }
        // Assign decoded payload to req.user
        req.user = decoded as JwtPayload;
        next();
      },
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
};
