import hederaService from '../services/hederaService.js';
import hederaConfig from '../config/hedera.js';
import { AccountId, AccountBalanceQuery } from '@hashgraph/sdk';
import { logger } from '../utils/logger.js';

const hederaController = {
  async getNetworkInfo(req, res) {
    try {
      const networkInfo = hederaConfig.getNetworkInfo();
      
      res.json({
        success: true,
        networkInfo
      });

    } catch (error) {
      logger.error('Get network info error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch network information'
      });
    }
  },

  async verifyTransaction(req, res) {
    try {
      const { transactionId } = req.params;

      const result = await hederaService.verifyTransaction(transactionId);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        transaction: {
          id: transactionId,
          status: result.status,
          consensusTimestamp: result.consensusTimestamp
        }
      });

    } catch (error) {
      logger.error('Verify transaction error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to verify transaction'
      });
    }
  },

  async getAccountBalance(req, res) {
    try {
      const { accountId } = req.params;

      const client = hederaConfig.getClient();
      const id = AccountId.fromString(accountId);
      const balance = await new AccountBalanceQuery()
        .setAccountId(id)
        .execute(client);
      
      res.json({
        success: true,
        accountId,
        balance: balance.hbars.toString()
      });

    } catch (error) {
      logger.error('Get account balance error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch account balance'
      });
    }
  },

  async getTopicMessages(req, res) {
    try {
      const { topicId } = req.params;
      const { limit = 10, sequenceNumber } = req.query;

      const result = await hederaService.getTopicMessages(topicId, {
        limit: Number(limit),
        sequenceNumber: sequenceNumber ? Number(sequenceNumber) : undefined
      });

      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error });
      }

      res.json({
        success: true,
        topicId,
        messages: result.messages
      });

    } catch (error) {
      logger.error('Get topic messages error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch topic messages'
      });
    }
  },

  async submitAuditMessage(req, res) {
    try {
      const { topicId, message, type = 'AUDIT' } = req.body;

      const result = await hederaService.submitAuditMessage(
        topicId || process.env.HEDERA_AUDIT_TOPIC,
        {
          type,
          message,
          timestamp: new Date().toISOString(),
          userDid: req.user.did,
          userId: req.user.id
        }
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      logger.auditLog('HEDERA_AUDIT_MESSAGE', req.user.id, {
        topicId,
        sequenceNumber: result.sequenceNumber
      });

      res.json({
        success: true,
        message: 'Audit message submitted successfully',
        transaction: {
          sequenceNumber: result.sequenceNumber,
          consensusTimestamp: result.consensusTimestamp
        }
      });

    } catch (error) {
      logger.error('Submit audit message error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to submit audit message'
      });
    }
  },

  async verifyConsent(req, res) {
    try {
      const { patientDid, doctorDid, recordId } = req.body;

      // This would interact with the smart contract
      // For now, return mock verification
      
      const isConsentValid = true; // This would be from contract call
      
      res.json({
        success: true,
        consent: {
          patientDid,
          doctorDid,
          recordId,
          isValid: isConsentValid,
          verifiedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Verify consent error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to verify consent'
      });
    }
  },

  async getContractInfo(req, res) {
    try {
      const { contractAddress } = req.params;

      // This would interact with the smart contract
      // For now, return basic info
      
      res.json({
        success: true,
        contract: {
          address: contractAddress,
          type: 'HealthRecord',
          deployed: true,
          network: hederaConfig.network
        }
      });

    } catch (error) {
      logger.error('Get contract info error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch contract information'
      });
    }
  },

  async getTokenInfo(req, res) {
    try {
      const { tokenId } = req.params;

      // This would interact with HTS
      // For now, return basic info
      
      res.json({
        success: true,
        token: {
          id: tokenId,
          type: 'ROLE_TOKEN',
          network: hederaConfig.network
        }
      });

    } catch (error) {
      logger.error('Get token info error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch token information'
      });
    }
  }
};

export default hederaController;