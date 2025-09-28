import { Web3Storage } from 'web3.storage';
import axios from 'axios';
import { logger } from '../utils/logger.js';

class IPFSConfig {
  constructor() {
    this.clients = {};
    this.isInitialized = false;
  }

  initialize() {
    try {
      // Initialize Web3.Storage client
      if (process.env.WEB3_STORAGE_TOKEN) {
        this.clients.web3 = new Web3Storage({ 
          token: process.env.WEB3_STORAGE_TOKEN 
        });
        logger.info('Web3.Storage client initialized');
      }

      // Initialize Pinata client configuration
      if (process.env.PINATA_API_KEY && process.env.PINATA_SECRET_API_KEY) {
        this.clients.pinata = {
          apiKey: process.env.PINATA_API_KEY,
          secretKey: process.env.PINATA_SECRET_API_KEY,
          jwt: process.env.PINATA_JWT
        };
        logger.info('Pinata client configured');
      }

      // Set primary client (Web3.Storage as default)
      this.primaryClient = 'web3';
      this.isInitialized = true;

      logger.info('IPFS configuration completed');

    } catch (error) {
      logger.error('IPFS configuration failed:', error);
      throw error;
    }
  }

  getClient(clientName = null) {
    if (!this.isInitialized) {
      this.initialize();
    }

    const client = clientName ? this.clients[clientName] : this.clients[this.primaryClient];
    
    if (!client) {
      throw new Error(`IPFS client ${clientName || this.primaryClient} not available`);
    }

    return client;
  }

  async healthCheck() {
    const health = {
      healthy: false,
      clients: {},
      timestamp: new Date().toISOString()
    };

    try {
      // Check Web3.Storage
      if (this.clients.web3) {
        try {
          // Simple check by getting user info
          await this.clients.web3.getUser();
          health.clients.web3 = { status: 'healthy' };
        } catch (error) {
          health.clients.web3 = { status: 'unhealthy', error: error.message };
        }
      }

      // Check Pinata
      if (this.clients.pinata) {
        try {
          const response = await axios.get(
            'https://api.pinata.cloud/data/testAuthentication',
            {
              headers: {
                'pinata_api_key': this.clients.pinata.apiKey,
                'pinata_secret_api_key': this.clients.pinata.secretKey
              }
            }
          );
          health.clients.pinata = { status: 'healthy' };
        } catch (error) {
          health.clients.pinata = { status: 'unhealthy', error: error.message };
        }
      }

      // Overall health based on primary client
      const primaryClientHealth = health.clients[this.primaryClient];
      health.healthy = primaryClientHealth && primaryClientHealth.status === 'healthy';

      return health;

    } catch (error) {
      logger.error('IPFS health check failed:', error);
      return {
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  getGateways() {
    return [
      'https://ipfs.io/ipfs/',
      'https://cloudflare-ipfs.com/ipfs/',
      'https://dweb.link/ipfs/',
      'https://gateway.pinata.cloud/ipfs/',
      'https://w3s.link/ipfs/'
    ];
  }

  // Get preferred gateway based on performance
  getOptimalGateway() {
    // In production, this could implement performance testing
    return 'https://w3s.link/ipfs/';
  }

  // Get upload options based on file type
  getUploadOptions(fileType, isSensitive = false) {
    const baseOptions = {
      wrapWithDirectory: false,
      maxRetries: 3
    };

    if (isSensitive) {
      baseOptions.name = `encrypted_${Date.now()}`;
    }

    // Type-specific options
    switch (fileType) {
      case 'image':
        baseOptions.maxRetries = 5; // More retries for images
        break;
      case 'document':
        baseOptions.name = `document_${Date.now()}`;
        break;
      default:
        baseOptions.name = `file_${Date.now()}`;
    }

    return baseOptions;
  }
}

// Create singleton instance
const ipfsConfig = new IPFSConfig();
export default ipfsConfig;