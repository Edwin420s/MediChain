import { 
  Client, 
  AccountId, 
  PrivateKey, 
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicMessageQuery,
  Hbar 
} from '@hashgraph/sdk';

class HederaService {
  constructor() {
    this.client = null;
    this.accountId = null;
    this.privateKey = null;
    this.isConnected = false;
  }

  async connectWallet(accountId, privateKey) {
    try {
      this.accountId = AccountId.fromString(accountId);
      this.privateKey = PrivateKey.fromString(privateKey);

      // Use testnet for development, mainnet for production
      this.client = Client.forTestnet();
      this.client.setOperator(this.accountId, this.privateKey);
      
      // Set default max transaction fee
      this.client.setDefaultMaxTransactionFee(new Hbar(2));
      this.client.setDefaultMaxQueryPayment(new Hbar(1));

      this.isConnected = true;
      
      console.log('Hedera wallet connected:', this.accountId.toString());
      return { success: true, accountId: this.accountId.toString() };
    } catch (error) {
      console.error('Error connecting to Hedera:', error);
      return { success: false, error: error.message };
    }
  }

  async createAuditTopic() {
    try {
      const transaction = new TopicCreateTransaction()
        .setTopicMemo('MediChain Audit Logs')
        .setMaxTransactionFee(new Hbar(2));

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);
      
      return {
        success: true,
        topicId: receipt.topicId.toString()
      };
    } catch (error) {
      console.error('Error creating audit topic:', error);
      return { success: false, error: error.message };
    }
  }

  async submitAuditMessage(topicId, message) {
    try {
      const messageString = typeof message === 'string' ? message : JSON.stringify(message);
      
      const transaction = await new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(messageString)
        .setMaxTransactionFee(new Hbar(2))
        .execute(this.client);

      const receipt = await transaction.getReceipt(this.client);
      
      return {
        success: true,
        sequenceNumber: receipt.topicSequenceNumber?.toString() || receipt.topicSequenceNumber,
        consensusTimestamp: receipt.consensusTimestamp.toString(),
        transactionId: transaction.transactionId.toString()
      };
    } catch (error) {
      console.error('Error submitting audit message:', error);
      return { success: false, error: error.message };
    }
  }

  async listenToTopic(topicId, onMessage, onError) {
    try {
      new TopicMessageQuery()
        .setTopicId(topicId)
        .subscribe(
          this.client,
          (error) => {
            if (onError) onError(error);
            else console.error('Topic subscription error:', error);
          },
          (message) => {
            try {
              const messageContent = Buffer.from(message.contents, 'utf8').toString();
              const parsedMessage = JSON.parse(messageContent);
              
              onMessage({
                ...parsedMessage,
                consensusTimestamp: message.consensusTimestamp.toString(),
                sequenceNumber: message.sequenceNumber.toString()
              });
            } catch (parseError) {
              console.error('Error parsing topic message:', parseError);
            }
          }
        );
      
      return { success: true };
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      return { success: false, error: error.message };
    }
  }

  async getAccountBalance() {
    try {
      const balance = await this.client.getAccountBalance(this.accountId);
      return {
        success: true,
        balance: balance.toString()
      };
    } catch (error) {
      console.error('Error getting account balance:', error);
      return { success: false, error: error.message };
    }
  }

  async verifyTransaction(transactionId) {
    try {
      const transaction = await this.client.getTransaction(transactionId);
      const receipt = await transaction.getReceipt(this.client);
      
      return {
        success: true,
        status: receipt.status.toString(),
        consensusTimestamp: receipt.consensusTimestamp?.toString()
      };
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return { success: false, error: error.message };
    }
  }

  disconnect() {
    this.client = null;
    this.accountId = null;
    this.privateKey = null;
    this.isConnected = false;
  }

  // Utility method to generate a new Hedera account (for testing)
  async generateTestAccount() {
    try {
      const privateKey = PrivateKey.generate();
      const publicKey = privateKey.publicKey;

      const transaction = new AccountCreateTransaction()
        .setKey(publicKey)
        .setInitialBalance(new Hbar(10));

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);
      const newAccountId = receipt.accountId;

      return {
        success: true,
        accountId: newAccountId.toString(),
        privateKey: privateKey.toString(),
        publicKey: publicKey.toString()
      };
    } catch (error) {
      console.error('Error generating test account:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create a singleton instance
const hederaService = new HederaService();
export default hederaService;