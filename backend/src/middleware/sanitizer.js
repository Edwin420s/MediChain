import { logger } from '../utils/logger.js';

/**
 * Input sanitization middleware to prevent XSS and injection attacks
 * Sanitizes request body, query parameters, and URL parameters
 */

/**
 * Remove HTML tags and script content from string
 */
function sanitizeString(value) {
  if (typeof value !== 'string') return value;

  // Remove HTML tags
  let sanitized = value.replace(/<[^>]*>/g, '');

  // Remove script content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Sanitize object recursively
 */
function sanitizeObject(obj) {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      // Sanitize the key as well to prevent prototype pollution
      const sanitizedKey = sanitizeString(key);
      
      // Skip __proto__, constructor, and prototype
      if (sanitizedKey === '__proto__' || sanitizedKey === 'constructor' || sanitizedKey === 'prototype') {
        logger.warn(`Attempted prototype pollution detected: ${sanitizedKey}`);
        continue;
      }

      sanitized[sanitizedKey] = sanitizeObject(value);
    }
    return sanitized;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  return obj;
}

/**
 * Validate and sanitize email addresses
 */
function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') return email;

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return email;
  }

  // Convert to lowercase and trim
  return email.toLowerCase().trim();
}

/**
 * Validate and sanitize URLs
 */
function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return url;

  try {
    const parsed = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      logger.warn(`Invalid URL protocol detected: ${parsed.protocol}`);
      return '';
    }

    return parsed.href;
  } catch (error) {
    logger.warn(`Invalid URL format: ${url}`);
    return url;
  }
}

/**
 * Sanitize SQL-like strings (basic protection, Prisma handles parameterization)
 */
function sanitizeSql(value) {
  if (typeof value !== 'string') return value;

  // Remove SQL comment markers
  let sanitized = value.replace(/--/g, '');
  sanitized = sanitized.replace(/\/\*/g, '');
  sanitized = sanitized.replace(/\*\//g, '');

  // Remove potential SQL injection patterns
  sanitized = sanitized.replace(/;\s*$/g, '');

  return sanitized;
}

/**
 * Sanitize NoSQL injection attempts
 */
function sanitizeNoSql(value) {
  if (typeof value === 'object' && value !== null) {
    // Remove MongoDB operators
    const operators = ['$where', '$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$regex'];
    const sanitized = { ...value };
    
    operators.forEach(op => {
      if (op in sanitized) {
        logger.warn(`NoSQL injection attempt detected: ${op}`);
        delete sanitized[op];
      }
    });

    return sanitized;
  }

  return value;
}

/**
 * Main sanitization middleware
 */
export const sanitizeInput = (req, res, next) => {
  try {
    // Sanitize body
    if (req.body) {
      req.body = sanitizeObject(req.body);
      req.body = sanitizeNoSql(req.body);
    }

    // Sanitize query parameters
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params) {
      req.params = sanitizeObject(req.params);
    }

    // Special handling for email fields
    if (req.body && req.body.email) {
      req.body.email = sanitizeEmail(req.body.email);
    }

    // Special handling for URL fields
    if (req.body && req.body.url) {
      req.body.url = sanitizeUrl(req.body.url);
    }

    next();
  } catch (error) {
    logger.error('Input sanitization error:', error);
    return res.status(400).json({
      success: false,
      error: 'Invalid input data'
    });
  }
};

/**
 * Middleware to detect and block potential attacks
 */
export const detectAttacks = (req, res, next) => {
  const suspiciousPatterns = [
    // XSS patterns
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    
    // SQL injection patterns
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b).*(\bFROM\b|\bWHERE\b|\bINTO\b)/gi,
    
    // Command injection patterns
    /[;&|`$()]/g,
    
    // Path traversal patterns
    /\.\.[\/\\]/g,
  ];

  const checkString = (str) => {
    if (typeof str !== 'string') return false;
    return suspiciousPatterns.some(pattern => pattern.test(str));
  };

  const checkObject = (obj) => {
    if (obj === null || obj === undefined) return false;

    if (Array.isArray(obj)) {
      return obj.some(item => checkObject(item));
    }

    if (typeof obj === 'object') {
      return Object.values(obj).some(value => checkObject(value));
    }

    return checkString(obj);
  };

  // Check all input sources
  const isSuspicious = checkObject(req.body) || checkObject(req.query) || checkObject(req.params);

  if (isSuspicious) {
    logger.warn('Potential attack detected', {
      ip: req.ip,
      url: req.url,
      method: req.method,
      userId: req.user?.id,
      userAgent: req.get('User-Agent')
    });

    return res.status(400).json({
      success: false,
      error: 'Invalid request: suspicious input detected'
    });
  }

  next();
};

export default { sanitizeInput, detectAttacks };
