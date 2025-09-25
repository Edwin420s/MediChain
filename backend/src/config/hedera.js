import { Client, AccountId, PrivateKey } from '@hashgraph/sdk';
import { logger } from '../utils/logger.js';

class HederaConfig {
  constructor() {
    this.client = null;
    this.operatorId = null;
    this.operatorKey = null;
    this.network = process.env.HEDERA_NETWORK || 'testnet';
    this.isInitialized = false;
  }

  initialize() {
    try {
      if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_OPERATOR_KEY) {
        throw new Error('Hedera operator credentials not found in environment variables');
      }

      this.operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
      this.operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY);

      // Initialize client based on network
      switch (this.network.toLowerCase()) {
        case 'mainnet':
          this.client = Client.forMainnet();
          break;
        case 'previewnet':
          this.client = Client.forPreviewnet();
          break;
        default:
          this.client = Client.forTestnet();
      }

      this.client.setOperator(this.operatorId, this.operatorKey);
      
      // Configure client options
      this.client.setMaxAttempts(5);
      this.client.setMaxNodeWaitTime(15000); // 15 seconds
      
      this.isInitialized = true;
      
      logger.info(`Hedera client initialized for ${this.network} network`);
      logger.info(`Operator: ${this.operatorId.toString()}`);
      
    } catch (error) {
      logger.error('Failed to initialize Hedera client:', error);
      throw error;
    }
  }

  getClient() {
    if (!this.isInitialized) {
      this.initialize();
    }
    return this.client;
  }

  getOperator() {
    return {
      id: this.operatorId,
      key: this.operatorKey
    };
  }

  // Health check for Hedera network
  async healthCheck() {
    try {
      const client = this.getClient();
      const accountBalance = await client.getAccountBalance(this.operatorId);
      
      return {
        healthy: true,
        network: this.network,
        operatorId: this.operatorId.toString(),
        balance: accountBalance.toString(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Hedera health check failed:', error);
      return {
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get network information
  getNetworkInfo() {
    const client = this.getClient();
    const network = client.network;
    
    return {
      network: this.network,
      nodes: Object.keys(network),
      nodeCount: Object.keys(network).length
    };
  }
}

// Create singleton instance
const hederaConfig = new HederaConfig();
export default hederaConfig;