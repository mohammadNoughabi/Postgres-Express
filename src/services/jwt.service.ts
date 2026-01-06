import jwt from 'jsonwebtoken';
import type { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { ENV } from '../config/envVariables.ts';

class JwtService {
  static generateAccessToken(payload: JwtPayload): string {
    const options: SignOptions = {};

    if (ENV.ACCESS_TOKEN_EXPIRES_IN) {
      options.expiresIn =
        ENV.ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn'];
    }

    return jwt.sign(payload, ENV.ACCESS_TOKEN_SECRET as Secret, options);
  }

  static generateRefreshToken(payload: JwtPayload): string {
    const options: SignOptions = {};

    // Only add expiresIn if it's defined
    if (ENV.REFRESH_TOKEN_EXPIRES_IN) {
      options.expiresIn =
        ENV.REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn'];
    }

    return jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET as Secret, options);
  }

  static validateAccessToken(token: string): JwtPayload {
    return jwt.verify(token, ENV.ACCESS_TOKEN_SECRET) as JwtPayload;
  }

  static validateRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, ENV.REFRESH_TOKEN_SECRET) as JwtPayload;
  }
}

export default JwtService;
