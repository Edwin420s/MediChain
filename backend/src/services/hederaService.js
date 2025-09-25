import { Client, AccountId, PrivateKey, TopicCreateTransaction, 
         TopicMessageSubmitTransaction, TokenCreateTransaction, 
         TokenAssociateTransaction, TransferTransaction, Hbar } from '@hashgraph/sdk';

class HederaService {
  constructor() {
    this.client = Client.forTestnet(); // Use forMainnet() in production
    this.operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
    this.operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY);
    this.client.setOperator(this.operatorId, this.operatorKey);
  }

  // Create HCS topic for audit logs
  async createAuditTopic() {
    try {
      const transaction = new TopicCreateTransaction()
        .setTopicMemo('MediChain Audit Logs')
        .setAdminKey(this.operatorKey.publicKey);

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);
      
      return {
        success: true,
        topicId: receipt.topicId.toString()
      };
    } catch (error) {
      console.error('Error creating HCS topic:', error);
      return { success: false, error: error.message };
    }
  }

  // Submit message to HCS topic
  async submitAuditMessage(topicId, message) {
    try {
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(JSON.stringify(message));

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);
      
      return {
        success: true,
        sequenceNumber: receipt.topicSequenceNumber,
        consensusTimestamp: receipt.consensusTimestamp
      };
    } catch (error) {
      console.error('Error submitting HCS message:', error);
      return { success: false, error: error.message };
    }
  }

  // Create role token for access control
  async createRoleToken(tokenName, symbol, initialSupply) {
    try {
      const transaction = await new TokenCreateTransaction()
        .setTokenName(tokenName)
        .setTokenSymbol(symbol)
        .setDecimals(0)
        .setInitialSupply(initialSupply)
        .setTreasuryAccountId(this.operatorId)
        .setAdminKey(this.operatorKey)
        .freezeWith(this.client);

      const signTx = await transaction.sign(this.operatorKey);
      const txResponse = await signTx.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);
      
      return {
        success: true,
        tokenId: receipt.tokenId.toString()
      };
    } catch (error) {
      console.error('Error creating token:', error);
      return { success: false, error: error.message };
    }
  }

  // Associate token with account
  async associateToken(accountId, tokenId) {
    try {
      const transaction = await new TokenAssociateTransaction()
        .setAccountId(accountId)
        .setTokenIds([tokenId])
        .freezeWith(this.client);

      const signTx = await transaction.sign(this.operatorKey);
      const txResponse = await signTx.execute(this.client);
      await txResponse.getReceipt(this.client);
      
      return { success: true };
    } catch (error) {
      console.error('Error associating token:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new HederaService();