import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { sendSuccess, sendError } from '../utils/response';
import { env } from '../config/env';
import { RegisterRequest, LoginRequest } from '../types';

export class AuthController {
  /**
   * Register a new user
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email, password }: RegisterRequest = req.body;

      const { user, token } = await AuthService.register({ email, password });

      // Set HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: env.COOKIE_SAME_SITE,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return sendSuccess(res, { user }, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email, password }: LoginRequest = req.body;

      const { user, token } = await AuthService.login({ email, password });

      // Set HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: env.COOKIE_SAME_SITE,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return sendSuccess(res, { user }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user
   */
  static async getMe(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return sendError(res, 'User not found', 404);
      }

      const user = await AuthService.getUserById(userId);

      if (!user) {
        return sendError(res, 'User not found', 404);
      }

      return sendSuccess(res, { user }, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   */
  static async logout(_req: Request, res: Response): Promise<Response> {
    // Clear cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      sameSite: env.COOKIE_SAME_SITE,
    });

    return sendSuccess(res, null, 'Logout successful');
  }
}

