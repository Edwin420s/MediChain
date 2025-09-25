import { Client, AccountId, PrivateKey, TopicCreateTransaction, TopicMessageSubmitTransaction } from '@hashgraph/sdk'

class HederaService {
  constructor() {
    this.client = null
    this.accountId = null
    this.privateKey = null
  }

  async connectWallet(accountId, privateKey) {
    try {
      this.accountId = AccountId.fromString(accountId)
      this.privateKey = PrivateKey.fromString(privateKey)
      
      this.client = Client.forTestnet() // Use forMainnet in production
      this.client.setOperator(this.accountId, this.privateKey)
      
      return { success: true }
    } catch (error) {
      console.error('Error connecting to Hedera:', error)
      return { success: false, error: error.message }
    }
  }

  async createAuditTopic() {
    if (!this.client) throw new Error('Hedera client not connected')

    try {
      const transaction = new TopicCreateTransaction()
        .setTopicMemo('MediChain Audit Logs')

      const txResponse = await transaction.execute(this.client)
      const receipt = await txResponse.getReceipt(this.client)
      
      return {
        success: true,
        topicId: receipt.topicId.toString()
      }
    } catch (error) {
      console.error('Error creating HCS topic:', error)
      return { success: false, error: error.message }
    }
  }

  async submitAuditMessage(topicId, message) {
    if (!this.client) throw new Error('Hedera client not connected')

    try {
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(JSON.stringify(message))

      const txResponse = await transaction.execute(this.client)
      const receipt = await txResponse.getReceipt(this.client)
      
      return {
        success: true,
        sequenceNumber: receipt.topicSequenceNumber,
        consensusTimestamp: receipt.consensusTimestamp
      }
    } catch (error) {
      console.error('Error submitting HCS message:', error)
      return { success: false, error: error.message }
    }
  }
}

export default new HederaService()