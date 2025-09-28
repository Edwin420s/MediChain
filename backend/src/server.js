import { createServer } from 'http';
import { config } from 'dotenv';
import app from './index.js';
import { logger } from './utils/logger.js';
import prisma from './config/db.js';

// Load environment variables
config();

class MediChainServer {
  constructor() {
    this.app = app;
    this.port = process.env.PORT || 3001;
    this.server = null;
    this.env = process.env.NODE_ENV || 'development';
  }

  async initialize() {
    try {
      logger.info('Initializing MediChain Server...');

      // Validate required environment variables
      this.validateEnvironment();

      // Test database connection
      await this.testDatabaseConnection();

      // Initialize Hedera client
      await this.initializeHedera();

      logger.info('MediChain Server initialized successfully');

    } catch (error) {
      logger.error('Server initialization failed:', error);
      process.exit(1);
    }
  }

  validateEnvironment() {
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'HEDERA_OPERATOR_ID',
      'HEDERA_OPERATOR_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    logger.info('Environment validation passed');
  }

  async testDatabaseConnection() {
    try {
      await prisma.$connect();
      logger.info('Database connection established');

      // Test database operations
      await prisma.$queryRaw`SELECT 1`;
      logger.info('Database operations test passed');

    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  async initializeHedera() {
    try {
      // Hedera initialization is handled in the config
      // This is a placeholder for any additional Hedera setup
      logger.info('Hedera client ready');
    } catch (error) {
      logger.error('Hedera initialization failed:', error);
      throw error;
    }
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server = createServer(this.app);

      this.server.listen(this.port, (error) => {
        if (error) {
          logger.error('Server failed to start:', error);
          return reject(error);
        }

        logger.info(`🚀 MediChain Server running in ${this.env} mode`);
        logger.info(`📍 Port: ${this.port}`);
        logger.info(`🌐 Environment: ${this.env}`);
        logger.info(`📊 Process ID: ${process.pid}`);
        logger.info(`⏰ Start Time: ${new Date().toISOString()}`);

        // Log server information
        this.logServerInfo();

        resolve(this.server);
      });

      // Handle server errors
      this.server.on('error', (error) => {
        logger.error('Server error:', error);
        this.gracefulShutdown();
      });

      // Handle graceful shutdown
      this.setupGracefulShutdown();
    });
  }

  logServerInfo() {
    const serverInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      environment: this.env
    };

    logger.info('Server Information:', serverInfo);
  }

  setupGracefulShutdown() {
    const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
    
    signals.forEach(signal => {
      process.on(signal, async () => {
        logger.info(`Received ${signal}, starting graceful shutdown...`);
        await this.gracefulShutdown();
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      this.gracefulShutdown();
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Promise Rejection:', { reason, promise });
      this.gracefulShutdown();
    });
  }

  async gracefulShutdown() {
    logger.info('Starting graceful shutdown...');

    try {
      // Close HTTP server
      if (this.server) {
        this.server.close(() => {
          logger.info('HTTP server closed');
        });
      }

      // Close database connections
      await prisma.$disconnect();
      logger.info('Database connections closed');

      // Close other resources (Redis, etc.)
      logger.info('All resources closed');

      process.exit(0);

    } catch (error) {
      logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }

  getServer() {
    return this.server;
  }
}

// Create server instance
const mediChainServer = new MediChainServer();

// Initialize and start server
mediChainServer.initialize()
  .then(() => mediChainServer.start())
  .catch(error => {
    logger.error('Failed to start server:', error);
    process.exit(1);
  });

export default mediChainServer;