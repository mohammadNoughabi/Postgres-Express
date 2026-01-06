import type { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service.ts';
import { ENV } from '../config/envVariables.ts';

class AuthController {
  async registerControl(req: Request, res: Response, next: NextFunction) {
    try {
      const username: string = req.body.username;
      const password: string = req.body.password;
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
      const username: string = req.body.username;
      const password: string = req.body.password;
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

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.cookie('refreshToken', result.refreshToken, {
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

  logoutControl(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res
        .status(200)
        .json({ success: true, message: 'Logout successful' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

export default new AuthController();
