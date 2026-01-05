import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JWTPayload } from '../types';

export const generateToken = (userId: string, email: string): string => {
  const payload = {
    userId,
    email,
  };

  // jwt.sign accepts string for expiresIn (e.g., "7d", "1h", "30m")
  // TypeScript's SignOptions is overly strict, but runtime accepts string
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as Parameters<typeof jwt.sign>[2]);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
