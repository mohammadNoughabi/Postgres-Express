import jwt from 'jsonwebtoken';
import type { JwtPayload, Secret } from 'jsonwebtoken';
import { ENV } from '../config/envVariables.ts';

class JwtService {
  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, ENV.ACCESS_TOKEN_SECRET as Secret, {
      expiresIn: ENV.ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET as Secret, {
      expiresIn: ENV.REFRESH_TOKEN_EXPIRES_IN,
    });
  }

  static validateAccessToken(token: string): JwtPayload {
    return jwt.verify(token, ENV.ACCESS_TOKEN_SECRET) as JwtPayload;
  }

  static validateRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, ENV.REFRESH_TOKEN_SECRET) as JwtPayload;
  }
}

export default JwtService;
