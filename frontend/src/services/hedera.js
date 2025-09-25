import { Client, AccountId, PrivateKey, TopicMessageSubmitTransaction, TopicMessageQuery } from "@hashgraph/sdk";

class HederaService {
  constructor() {
    this.client = null;
    this.accountId = null;
    this.privateKey = null;
  }

  async connectWallet(accountId, privateKey) {
    try {
      this.accountId = AccountId.fromString(accountId);
      this.privateKey = PrivateKey.fromString(privateKey);

      this.client = Client.forTestnet(); // Use forMainnet in production
      this.client.setOperator(this.accountId, this.privateKey);

      return { success: true };
    } catch (error) {
      console.error('Error connecting to Hedera:', error);
      return { success: false, error: error.message };
    }
  }

  async submitMessage(topicId, message) {
    try {
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(JSON.stringify(message));

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      return {
        success: true,
        sequenceNumber: receipt.topicSequenceNumber,
        consensusTimestamp: receipt.consensusTimestamp
      };
    } catch (error) {
      console.error('Error submitting message:', error);
      return { success: false, error: error.message };
    }
  }

  async listenToTopic(topicId, onMessage) {
    try {
      new TopicMessageQuery()
        .setTopicId(topicId)
        .subscribe(this.client, (message) => {
          const messageContent = Buffer.from(message.contents).toString();
          onMessage(JSON.parse(messageContent));
        });
    } catch (error) {
      console.error('Error listening to topic:', error);
    }
  }
}

export default new HederaService();