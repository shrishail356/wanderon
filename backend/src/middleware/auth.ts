import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthRequest, JWTPayload } from '../types';
import { AuthenticationError } from '../utils/errors';
import { sendError } from '../utils/response';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from cookie
    const token = req.cookies?.token;

    if (!token) {
      throw new AuthenticationError('Authentication required. Please login.');
    }

    // Verify token
    const decoded = verifyToken(token) as JWTPayload;

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      sendError(res, error.message, error.statusCode);
    } else {
      sendError(res, 'Invalid or expired token', 401);
    }
  }
};

