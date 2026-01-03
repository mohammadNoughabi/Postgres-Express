import type { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service.ts';
import { ENV } from '../config/envVariables.ts';

class AuthController {
  constructor() {}

  async registerControl(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and Password are required to register new user',
        });
      }

      const result = await authService.registerService(username, password);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async loginControl(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and Password are required for login',
        });
      }

      const result = await authService.loginService(username, password);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async logoutControl(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.logoutService();
      res.clearCookie('token');
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

export default new AuthController();
