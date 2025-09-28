import express from 'express';
import hederaController from '../controllers/hederaController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authMiddleware);

// Hedera network information
router.get('/network-info', 
  hederaController.getNetworkInfo
);

// Transaction verification
router.get('/transactions/:transactionId',
  hederaController.verifyTransaction
);

// Account balance
router.get('/account/:accountId/balance',
  hederaController.getAccountBalance
);

// HCS topic messages
router.get('/topics/:topicId/messages',
  roleMiddleware(['ADMIN', 'SUPER_ADMIN']),
  hederaController.getTopicMessages
);

// Submit audit message
router.post('/audit',
  roleMiddleware(['ADMIN', 'SUPER_ADMIN']),
  hederaController.submitAuditMessage
);

// Verify consent on-chain
router.post('/verify-consent',
  hederaController.verifyConsent
);

// Contract interactions
router.get('/contracts/:contractAddress',
  roleMiddleware(['ADMIN', 'SUPER_ADMIN']),
  hederaController.getContractInfo
);

// Token operations
router.get('/tokens/:tokenId',
  roleMiddleware(['ADMIN', 'SUPER_ADMIN']),
  hederaController.getTokenInfo
);

export default router;