import xss from 'xss';
import sanitize from 'mongo-sanitize';

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return input;
  }
  return xss(input, {
    whiteList: {}, // No HTML tags allowed
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script'],
  });
};

/**
 * Sanitize object to prevent NoSQL injection
 */
export const sanitizeObject = <T>(obj: T): T => {
  return sanitize(obj) as T;
};

/**
 * Sanitize all string fields in an object
 */
export const sanitizeObjectStrings = <T extends Record<string, any>>(obj: T): T => {
  const sanitized = { ...obj } as any;
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]);
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObjectStrings(sanitized[key]);
    }
  }
  
  return sanitized as T;
};

