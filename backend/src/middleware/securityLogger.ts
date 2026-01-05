import { Request, Response, NextFunction } from 'express';

interface SecurityEvent {
  type: 'LOGIN_ATTEMPT' | 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'REGISTER_ATTEMPT' | 'REGISTER_SUCCESS' | 'REGISTER_FAILURE' | 'ACCOUNT_LOCKED' | 'RATE_LIMIT_EXCEEDED';
  ip: string;
  userAgent?: string;
  email?: string;
  timestamp: Date;
  details?: any;
}

/**
 * Security logging middleware
 * Logs all authentication-related events for security monitoring
 */
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  
  res.send = function (body: any) {
    // Log security events
    if (req.path.includes('/auth/login') || req.path.includes('/auth/register')) {
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.get('user-agent');
      const email = req.body?.email;
      
      let eventType: SecurityEvent['type'];
      let details: any = {};
      
      if (req.path.includes('/auth/login')) {
        if (res.statusCode === 200) {
          eventType = 'LOGIN_SUCCESS';
        } else if (res.statusCode === 401) {
          eventType = 'LOGIN_FAILURE';
          try {
            const responseBody = typeof body === 'string' ? JSON.parse(body) : body;
            if (responseBody.errorCode === 'ACCOUNT_LOCKED') {
              eventType = 'ACCOUNT_LOCKED';
            }
          } catch (e) {
            // Ignore parse errors
          }
        } else {
          eventType = 'LOGIN_ATTEMPT';
        }
      } else if (req.path.includes('/auth/register')) {
        if (res.statusCode === 201) {
          eventType = 'REGISTER_SUCCESS';
        } else if (res.statusCode === 400 || res.statusCode === 409) {
          eventType = 'REGISTER_FAILURE';
        } else {
          eventType = 'REGISTER_ATTEMPT';
        }
      }
      
      // Log to console (in production, this should go to a proper logging service)
      const event: SecurityEvent = {
        type: eventType!,
        ip,
        userAgent,
        email: email ? email.substring(0, 3) + '***' : undefined, // Partial email for privacy
        timestamp: new Date(),
        details: {
          statusCode: res.statusCode,
          path: req.path,
        },
      };
      
      // In production, send to logging service (e.g., Winston, CloudWatch, etc.)
      if (process.env.NODE_ENV === 'production') {
        // TODO: Send to logging service
        console.log('[SECURITY]', JSON.stringify(event));
      } else {
        console.log('[SECURITY]', event);
      }
    }
    
    return originalSend.call(this, body);
  };
  
  next();
};

/**
 * Get client IP address (handles proxies)
 */
export const getClientIp = (req: Request): string => {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    (req.headers['x-real-ip'] as string) ||
    req.socket.remoteAddress ||
    'unknown'
  );
};

