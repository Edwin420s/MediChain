import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import net from 'net';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Load environment variables
config();

// Import routes
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import hederaRoutes from './routes/hederaRoutes.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

// Import services
import hederaConfig from './config/hedera.js';
import prisma from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class MediChainServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.env = process.env.NODE_ENV || 'development';

    this.initializeServices();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  async initializeServices() {
    try {
      hederaConfig.initialize();
      logger.info('Hedera service initialized');

      await prisma.$connect();
      logger.info('Database connected successfully');

      await this.healthCheck();
    } catch (error) {
      logger.error('Service initialization failed:', error);
      process.exit(1);
    }
  }

  initializeMiddleware() {
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    }));

    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    }));

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: this.env === 'production' ? 100 : 1000,
      message: { success: false, error: 'Too many requests from this IP, please try again later.' },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);

    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(compression());

    this.app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        logger.apiLog(req, res, null, duration);
      });
      next();
    });

    // Health check endpoint
    this.app.get('/health', async (req, res) => {
      const healthcheck = {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: this.env,
        services: {},
      };
      try {
        await prisma.$queryRaw`SELECT 1`;
        healthcheck.services.database = 'healthy';

        const hederaHealth = await hederaConfig.healthCheck();
        healthcheck.services.hedera = hederaHealth.healthy ? 'healthy' : 'unhealthy';

        healthcheck.services.redis = await this.checkRedisHealth();
        res.status(200).json(healthcheck);
      } catch (error) {
        healthcheck.services.database = 'unhealthy';
        logger.error('Health check failed:', error);
        res.status(503).json(healthcheck);
      }
    });

    // Metrics endpoint
    this.app.get('/metrics', async (req, res) => {
      if (this.env !== 'production') return res.status(404).json({ error: 'Not found' });
      try {
        const metrics = {
          timestamp: new Date().toISOString(),
          memory: process.memoryUsage(),
          uptime: process.uptime(),
          database: { connections: await this.getDatabaseMetrics() },
        };
        res.json(metrics);
      } catch (error) {
        logger.error('Metrics collection failed:', error);
        res.status(500).json({ error: 'Metrics unavailable' });
      }
    });

    // Swagger (OpenAPI)
    const swaggerSpec = swaggerJsdoc({
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'MediChain API',
          version: '1.0.0',
          description: 'Decentralized Health Records on Hedera',
        },
        servers: [
          { url: process.env.API_URL ? `${process.env.API_URL}/api` : 'http://localhost:3001/api' },
        ],
      },
      apis: [
        join(__dirname, './routes/*.js'),
      ],
    });
    this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  initializeRoutes() {
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/patients', patientRoutes);
    this.app.use('/api/doctors', doctorRoutes);
    this.app.use('/api/admin', adminRoutes);
    this.app.use('/api/departments', departmentRoutes);
    this.app.use('/api/hedera', hederaRoutes);

    this.app.get('/', (req, res) => {
      res.json({
        message: 'MediChain API Server',
        version: '1.0.0',
        environment: this.env,
        timestamp: new Date().toISOString(),
        documentation: '/api/docs',
      });
    });

    this.app.get('/api', (req, res) => {
      res.json({
        name: 'MediChain API',
        version: '1.0.0',
        description: 'Decentralized Health Records on Hedera',
        endpoints: {
          auth: '/api/auth',
          patients: '/api/patients',
          doctors: '/api/doctors',
          admin: '/api/admin',
          departments: '/api/departments',
          hedera: '/api/hedera',
        },
      });
    });
  }

  initializeErrorHandling() {
    this.app.use(notFound);
    this.app.use(errorHandler);

    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Promise Rejection:', err);
      process.exit(1);
    });
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      process.exit(1);
    });
  }

  async getDatabaseMetrics() {
    try {
      const rows = await prisma.$queryRawUnsafe(`
        SELECT 
          COUNT(*)::int AS total_connections,
          COUNT(*) FILTER (WHERE state = 'active')::int AS active_connections,
          COUNT(*) FILTER (WHERE state = 'idle')::int AS idle_connections
        FROM pg_stat_activity 
        WHERE datname = current_database()
      `);
      return rows && rows[0] ? rows[0] : { total_connections: 0, active_connections: 0, idle_connections: 0 };
    } catch (error) {
      logger.error('Database metrics error:', error);
      return { total_connections: 0, active_connections: 0, idle_connections: 0 };
    }
  }

  async healthCheck() {
    const checks = [];
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.push({ service: 'database', status: 'healthy' });
    } catch (error) {
      checks.push({ service: 'database', status: 'unhealthy', error: error.message });
    }

    try {
      const hederaHealth = await hederaConfig.healthCheck();
      checks.push({ service: 'hedera', status: hederaHealth.healthy ? 'healthy' : 'unhealthy' });
    } catch (error) {
      checks.push({ service: 'hedera', status: 'unhealthy', error: error.message });
    }

    try {
      const redisStatus = await this.checkRedisHealth();
      checks.push({ service: 'redis', status: redisStatus });
    } catch (error) {
      checks.push({ service: 'redis', status: 'unhealthy', error: error.message });
    }

    return checks;
  }

  checkRedisHealth() {
    return new Promise((resolve) => {
      try {
        const url = new URL(process.env.REDIS_URL || 'redis://localhost:6379');
        const host = url.hostname || 'localhost';
        const port = parseInt(url.port || '6379', 10);
        const socket = new net.Socket();
        let finished = false;
        const cleanup = (status) => {
          if (finished) return;
          finished = true;
          try { socket.destroy(); } catch (_) {}
          resolve(status);
        };
        socket.setTimeout(2000);
        socket.once('error', () => cleanup('unhealthy'));
        socket.once('timeout', () => cleanup('unhealthy'));
        socket.connect(port, host, () => cleanup('healthy'));
      } catch (_) {
        resolve('unhealthy');
      }
    });
  }

  start() {
    this.server = this.app.listen(this.port, () => {
      logger.info(`MediChain Server running in ${this.env} mode on port ${this.port}`);
      logger.info(`Health check available at http://localhost:${this.port}/health`);
      logger.info(`API documentation available at http://localhost:${this.port}/api/docs`);
    });

    const gracefulShutdown = async (signal) => {
      logger.info(`Received ${signal}, starting graceful shutdown...`);
      this.server.close(async () => {
        logger.info('HTTP server closed.');
        try {
          await prisma.$disconnect();
          logger.info('Database connections closed.');
        } catch (error) {
          logger.error('Error closing database connections:', error);
        }
        logger.info('Graceful shutdown completed.');
        process.exit(0);
      });
      setTimeout(() => {
        logger.error('Forcing shutdown after timeout...');
        process.exit(1);
      }, 30000);
    };
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  }
}

const server = new MediChainServer();
server.start();

export default server;
