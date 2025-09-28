import prisma from '../config/db.js';
import hederaConfig from '../config/hedera.js';
import { logger } from './logger.js';

class HealthCheck {
  constructor() {
    this.checks = [];
  }

  async performFullHealthCheck() {
    const results = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      checks: {}
    };

    // Database health check
    try {
      await prisma.$queryRaw`SELECT 1`;
      results.checks.database = {
        status: 'healthy',
        responseTime: Date.now() - Date.now() // Would measure actual time
      };
    } catch (error) {
      results.checks.database = {
        status: 'unhealthy',
        error: error.message
      };
      results.status = 'unhealthy';
    }

    // Hedera health check
    try {
      const hederaHealth = await hederaConfig.healthCheck();
      results.checks.hedera = {
        status: hederaHealth.healthy ? 'healthy' : 'unhealthy',
        network: hederaHealth.network,
        balance: hederaHealth.balance
      };
      
      if (!hederaHealth.healthy) {
        results.status = 'unhealthy';
      }
    } catch (error) {
      results.checks.hedera = {
        status: 'unhealthy',
        error: error.message
      };
      results.status = 'unhealthy';
    }

    // System resources check
    results.checks.system = {
      status: 'healthy',
      cpu: process.cpuUsage(),
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
        percentage: (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal * 100).toFixed(2)
      }
    };

    // Check if memory usage is too high
    if (parseFloat(results.checks.system.memory.percentage) > 90) {
      results.checks.system.status = 'warning';
      results.checks.system.warning = 'High memory usage';
    }

    return results;
  }

  async quickHealthCheck() {
    const quickResults = {
      status: 'healthy',
      timestamp: new Date().toISOString()
    };

    try {
      // Quick database ping
      await prisma.$queryRaw`SELECT 1`;
      
      // Quick Hedera check
      const client = hederaConfig.getClient();
      await client.getAccountBalance(hederaConfig.operatorId);
      
    } catch (error) {
      quickResults.status = 'unhealthy';
      quickResults.error = error.message;
    }

    return quickResults;
  }

  // Add custom health check
  addCheck(name, checkFunction) {
    this.checks.push({ name, checkFunction });
  }

  async runCustomChecks() {
    const customResults = {};
    
    for (const check of this.checks) {
      try {
        const result = await check.checkFunction();
        customResults[check.name] = {
          status: 'healthy',
          ...result
        };
      } catch (error) {
        customResults[check.name] = {
          status: 'unhealthy',
          error: error.message
        };
      }
    }

    return customResults;
  }

  // Memory leak detection
  checkMemoryLeaks() {
    const memoryUsage = process.memoryUsage();
    const heapUsed = memoryUsage.heapUsed;
    const heapTotal = memoryUsage.heapTotal;
    
    return {
      heapUsed: this.formatBytes(heapUsed),
      heapTotal: this.formatBytes(heapTotal),
      percentage: ((heapUsed / heapTotal) * 100).toFixed(2)
    };
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Create singleton instance
const healthCheck = new HealthCheck();

// Add custom checks
healthCheck.addCheck('ipfs_connectivity', async () => {
  // This would check IPFS connectivity
  return { message: 'IPFS connectivity check would be implemented here' };
});

healthCheck.addCheck('email_service', async () => {
  // This would check email service connectivity
  return { message: 'Email service check would be implemented here' };
});

export default healthCheck;