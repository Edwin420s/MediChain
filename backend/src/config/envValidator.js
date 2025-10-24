import { logger } from '../utils/logger.js';

/**
 * Environment variable validator with type checking and required field validation
 * Ensures all critical environment variables are set before application starts
 */
class EnvironmentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate that a required environment variable exists
   */
  required(key, description = '') {
    const value = process.env[key];
    if (!value || value.trim() === '') {
      this.errors.push(`Missing required environment variable: ${key}${description ? ` (${description})` : ''}`);
      return null;
    }
    return value;
  }

  /**
   * Validate optional environment variable with default value
   */
  optional(key, defaultValue = '', description = '') {
    const value = process.env[key];
    if (!value || value.trim() === '') {
      if (description) {
        this.warnings.push(`Using default for ${key}: ${defaultValue} (${description})`);
      }
      return defaultValue;
    }
    return value;
  }

  /**
   * Validate URL format
   */
  url(key, required = true) {
    const value = required ? this.required(key, 'must be a valid URL') : this.optional(key);
    if (!value) return null;

    try {
      new URL(value);
      return value;
    } catch (error) {
      this.errors.push(`Invalid URL format for ${key}: ${value}`);
      return null;
    }
  }

  /**
   * Validate integer value
   */
  integer(key, min = null, max = null, defaultValue = null) {
    const value = defaultValue !== null ? this.optional(key, String(defaultValue)) : this.required(key);
    if (!value) return defaultValue;

    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      this.errors.push(`${key} must be a valid integer, got: ${value}`);
      return defaultValue;
    }

    if (min !== null && parsed < min) {
      this.errors.push(`${key} must be at least ${min}, got: ${parsed}`);
      return defaultValue;
    }

    if (max !== null && parsed > max) {
      this.errors.push(`${key} must be at most ${max}, got: ${parsed}`);
      return defaultValue;
    }

    return parsed;
  }

  /**
   * Validate enum values
   */
  enum(key, allowedValues, defaultValue = null) {
    const value = defaultValue ? this.optional(key, defaultValue) : this.required(key);
    if (!value) return defaultValue;

    if (!allowedValues.includes(value)) {
      this.errors.push(`${key} must be one of: ${allowedValues.join(', ')}, got: ${value}`);
      return defaultValue;
    }

    return value;
  }

  /**
   * Validate boolean value
   */
  boolean(key, defaultValue = false) {
    const value = this.optional(key, String(defaultValue));
    return value === 'true' || value === '1' || value === 'yes';
  }

  /**
   * Validate email format
   */
  email(key, required = true) {
    const value = required ? this.required(key) : this.optional(key);
    if (!value) return null;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      this.errors.push(`Invalid email format for ${key}: ${value}`);
      return null;
    }

    return value;
  }

  /**
   * Validate JWT secret (minimum length requirement)
   */
  jwtSecret(key, minLength = 32) {
    const value = this.required(key, 'JWT secret for token signing');
    if (!value) return null;

    if (value.length < minLength) {
      this.errors.push(`${key} must be at least ${minLength} characters long for security`);
      return null;
    }

    return value;
  }

  /**
   * Check if validation passed
   */
  isValid() {
    return this.errors.length === 0;
  }

  /**
   * Get validation results
   */
  getResults() {
    return {
      valid: this.isValid(),
      errors: this.errors,
      warnings: this.warnings
    };
  }

  /**
   * Log validation results
   */
  logResults() {
    if (this.warnings.length > 0) {
      this.warnings.forEach(warning => logger.warn(warning));
    }

    if (this.errors.length > 0) {
      logger.error('Environment validation failed:');
      this.errors.forEach(error => logger.error(`  - ${error}`));
      return false;
    }

    logger.info('Environment validation passed');
    return true;
  }
}

/**
 * Validate all required environment variables for MediChain
 */
export function validateEnvironment() {
  const validator = new EnvironmentValidator();

  // Database
  validator.required('DATABASE_URL', 'PostgreSQL connection string');

  // JWT Secrets
  validator.jwtSecret('JWT_SECRET', 32);
  validator.jwtSecret('JWT_REFRESH_SECRET', 32);
  validator.optional('JWT_EXPIRES_IN', '24h', 'JWT token expiration');
  validator.optional('JWT_REFRESH_EXPIRES_IN', '7d', 'Refresh token expiration');

  // Hedera Configuration
  validator.required('HEDERA_OPERATOR_ID', 'Hedera account ID');
  validator.required('HEDERA_OPERATOR_KEY', 'Hedera private key');
  validator.enum('HEDERA_NETWORK', ['mainnet', 'testnet', 'previewnet'], 'testnet');

  // Hedera Topics (optional, can be created)
  validator.optional('HEDERA_AUDIT_TOPIC', '', 'Audit trail topic ID');
  validator.optional('HEDERA_RECORD_TOPIC', '', 'Medical records topic ID');
  validator.optional('HEDERA_CONSENT_TOPIC', '', 'Consent management topic ID');

  // Smart Contracts (optional)
  validator.optional('HEALTH_RECORD_CONTRACT', '', 'Health record contract address');
  validator.optional('DOCTOR_REGISTRY_CONTRACT', '', 'Doctor registry contract address');
  validator.optional('ACCESS_CONTROL_CONTRACT', '', 'Access control contract address');

  // IPFS Configuration
  validator.required('WEB3_STORAGE_TOKEN', 'Web3.Storage API token');

  // Email Configuration (optional for development)
  const nodeEnv = validator.enum('NODE_ENV', ['development', 'test', 'production'], 'development');
  if (nodeEnv === 'production') {
    validator.required('SMTP_HOST', 'SMTP server host');
    validator.integer('SMTP_PORT', 1, 65535, 587);
    validator.required('SMTP_USER', 'SMTP username');
    validator.required('SMTP_PASS', 'SMTP password');
    validator.email('SMTP_FROM', true);
  }

  // Application Configuration
  validator.integer('PORT', 1, 65535, 3001);
  validator.optional('CORS_ORIGIN', 'http://localhost:3000', 'Allowed CORS origin');
  validator.optional('FRONTEND_URL', 'http://localhost:3000', 'Frontend application URL');
  validator.optional('API_URL', 'http://localhost:3001', 'Backend API URL');

  // Redis Configuration (optional)
  validator.optional('REDIS_URL', 'redis://localhost:6379', 'Redis connection URL');

  // Security Configuration
  validator.integer('RATE_LIMIT_WINDOW_MS', 1000, null, 900000); // 15 minutes
  validator.integer('RATE_LIMIT_MAX_REQUESTS', 1, null, 100);
  validator.integer('MAX_FILE_SIZE_MB', 1, 100, 10);

  // Log results and throw error if validation fails
  if (!validator.logResults()) {
    const results = validator.getResults();
    throw new Error(`Environment validation failed:\n${results.errors.join('\n')}`);
  }

  return validator.getResults();
}

export default EnvironmentValidator;
