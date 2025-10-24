import { createClient } from 'redis';
import { logger } from '../utils/logger.js';

/**
 * Redis caching service for performance optimization
 * Implements caching strategies for frequently accessed data
 */
class CacheService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.retryAttempts = 0;
    this.maxRetries = 5;
  }

  /**
   * Initialize Redis client
   */
  async initialize() {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.client = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > this.maxRetries) {
              logger.error('Max Redis reconnection attempts reached');
              return new Error('Max reconnection attempts reached');
            }
            const delay = Math.min(retries * 100, 3000);
            logger.info(`Reconnecting to Redis in ${delay}ms (attempt ${retries})`);
            return delay;
          }
        }
      });

      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err);
        this.connected = false;
      });

      this.client.on('connect', () => {
        logger.info('Redis client connecting...');
      });

      this.client.on('ready', () => {
        logger.info('Redis client connected and ready');
        this.connected = true;
        this.retryAttempts = 0;
      });

      this.client.on('reconnecting', () => {
        logger.warn('Redis client reconnecting...');
        this.retryAttempts++;
      });

      await this.client.connect();
      
      return true;
    } catch (error) {
      logger.error('Failed to initialize Redis client:', error);
      this.connected = false;
      return false;
    }
  }

  /**
   * Check if cache is available
   */
  isAvailable() {
    return this.connected && this.client?.isReady;
  }

  /**
   * Get value from cache
   */
  async get(key) {
    if (!this.isAvailable()) {
      logger.debug('Cache not available, skipping get');
      return null;
    }

    try {
      const value = await this.client.get(key);
      if (value) {
        logger.debug(`Cache hit: ${key}`);
        return JSON.parse(value);
      }
      logger.debug(`Cache miss: ${key}`);
      return null;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache with TTL (time to live in seconds)
   */
  async set(key, value, ttl = 3600) {
    if (!this.isAvailable()) {
      logger.debug('Cache not available, skipping set');
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      await this.client.setEx(key, ttl, serialized);
      logger.debug(`Cache set: ${key} (TTL: ${ttl}s)`);
      return true;
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      await this.client.del(key);
      logger.debug(`Cache deleted: ${key}`);
      return true;
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete multiple keys matching pattern
   */
  async deletePattern(pattern) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
        logger.debug(`Cache pattern deleted: ${pattern} (${keys.length} keys)`);
      }
      return true;
    } catch (error) {
      logger.error(`Cache pattern delete error for ${pattern}:`, error);
      return false;
    }
  }

  /**
   * Clear all cache
   */
  async flush() {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      await this.client.flushDb();
      logger.info('Cache flushed');
      return true;
    } catch (error) {
      logger.error('Cache flush error:', error);
      return false;
    }
  }

  /**
   * Cache middleware for Express routes
   * Usage: router.get('/path', cacheService.middleware(300), handler)
   */
  middleware(ttl = 300) {
    return async (req, res, next) => {
      if (!this.isAvailable()) {
        return next();
      }

      // Generate cache key from request
      const key = this.generateKey(req);

      try {
        const cached = await this.get(key);
        if (cached) {
          logger.debug(`Serving from cache: ${key}`);
          return res.json(cached);
        }

        // Store original json method
        const originalJson = res.json.bind(res);

        // Override json method to cache response
        res.json = (data) => {
          if (res.statusCode === 200 && data) {
            this.set(key, data, ttl).catch(err => {
              logger.error('Error caching response:', err);
            });
          }
          return originalJson(data);
        };

        next();
      } catch (error) {
        logger.error('Cache middleware error:', error);
        next();
      }
    };
  }

  /**
   * Generate cache key from request
   */
  generateKey(req) {
    const userId = req.user?.id || 'anonymous';
    const url = req.originalUrl || req.url;
    const method = req.method;
    return `cache:${method}:${url}:${userId}`;
  }

  /**
   * Invalidate cache for specific user
   */
  async invalidateUser(userId) {
    return this.deletePattern(`cache:*:*:${userId}`);
  }

  /**
   * Invalidate cache for specific endpoint
   */
  async invalidateEndpoint(endpoint) {
    return this.deletePattern(`cache:*:${endpoint}*`);
  }

  /**
   * Get cache statistics
   */
  async getStats() {
    if (!this.isAvailable()) {
      return { connected: false };
    }

    try {
      const info = await this.client.info('stats');
      const dbSize = await this.client.dbSize();
      
      return {
        connected: true,
        dbSize,
        info: this.parseRedisInfo(info)
      };
    } catch (error) {
      logger.error('Error getting cache stats:', error);
      return { connected: false, error: error.message };
    }
  }

  /**
   * Parse Redis INFO command output
   */
  parseRedisInfo(info) {
    const lines = info.split('\r\n');
    const stats = {};
    
    lines.forEach(line => {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split(':');
        if (key && value) {
          stats[key] = value;
        }
      }
    });

    return stats;
  }

  /**
   * Close Redis connection
   */
  async close() {
    if (this.client) {
      await this.client.quit();
      this.connected = false;
      logger.info('Redis client disconnected');
    }
  }

  /**
   * Health check for Redis
   */
  async healthCheck() {
    if (!this.isAvailable()) {
      return { healthy: false, message: 'Redis not connected' };
    }

    try {
      await this.client.ping();
      return { healthy: true, message: 'Redis is healthy' };
    } catch (error) {
      return { healthy: false, message: error.message };
    }
  }
}

// Create singleton instance
const cacheService = new CacheService();

export default cacheService;
export { CacheService };
