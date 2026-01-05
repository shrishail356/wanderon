import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

/**
 * Request validation middleware
 * Validates request structure and prevents common attacks
 */
export const requestValidator = (req: Request, _res: Response, next: NextFunction) => {
  // Check for suspicious patterns in request body
  if (req.body && typeof req.body === 'object') {
    // Fields that are allowed to contain special characters (like email, description)
    const allowedFields = ['email', 'description', 'name'];
    
    // Check each field individually for better context
    for (const [key, value] of Object.entries(req.body)) {
      // Skip validation for allowed fields (they're validated elsewhere)
      if (allowedFields.includes(key.toLowerCase())) {
        continue;
      }
      
      // Only check string values
      if (typeof value !== 'string') {
        continue;
      }
      
      const valueStr = value as string;
      
      // Check for SQL injection patterns (only in suspicious contexts)
      const sqlPatterns = [
        /\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\s+.*\bFROM\b/i,
        /\b(UNION|OR|AND)\s+\d+\s*=\s*\d+/i,
        /;\s*(DROP|DELETE|UPDATE|INSERT|CREATE|ALTER)/i,
      ];
      
      // Check for XSS patterns
      const xssPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:\s*[^'"]/gi,
        /on\w+\s*=\s*['"]/gi,
        /<iframe[^>]*>/gi,
        /<object[^>]*>/gi,
        /<embed[^>]*>/gi,
      ];
      
      // Check for NoSQL injection patterns (MongoDB operators)
      const nosqlPatterns = [
        /\$where\s*[:=]/i,
        /\$\s*(ne|gt|lt|gte|lte|regex|exists|in|nin|or|and|not|nor)\s*[:=]/i,
      ];
      
      // Check for command injection patterns (only in suspicious contexts)
      const commandPatterns = [
        /[;&|`]\s*\w+\s*\(/,
        /\|\s*\w+\s*\(/,
        /;\s*\w+\s*\(/,
        /\$\s*\(\s*\w+/,
        /`\s*\w+\s*`/,
      ];
      
      // Validate against patterns
      const allPatterns = [...sqlPatterns, ...xssPatterns, ...nosqlPatterns, ...commandPatterns];
      
      for (const pattern of allPatterns) {
        if (pattern.test(valueStr)) {
          // Log suspicious activity
          console.warn('[SECURITY] Suspicious request pattern detected:', {
            ip: req.ip,
            path: req.path,
            field: key,
            pattern: pattern.toString(),
          });
          
          throw new ValidationError('Invalid request format', 'INVALID_REQUEST');
        }
      }
    }
  }
  
  // Validate Content-Type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new ValidationError('Content-Type must be application/json', 'INVALID_CONTENT_TYPE');
    }
  }
  
  // Validate request size
  const contentLength = req.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > 10 * 1024 * 1024) { // 10MB limit
    throw new ValidationError('Request payload too large', 'PAYLOAD_TOO_LARGE');
  }
  
  next();
};

