import { Client, AccountId, PrivateKey, TopicCreateTransaction } from '@hashgraph/sdk'
import dotenv from 'dotenv'

dotenv.config()

async function setupHedera() {
  try {
    const client = Client.forTestnet()
    client.setOperator(
      AccountId.fromString(process.env.HEDERA_OPERATOR_ID),
      PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY)
    )

    // Create HCS topic for audit logs
    const topicTx = await new TopicCreateTransaction()
      .setTopicMemo('MediChain Audit Logs')
      .execute(client)

    const topicReceipt = await topicTx.getReceipt(client)
    const topicId = topicReceipt.topicId

    console.log('HCS Topic created:', topicId.toString())

    // Create HCS topic for consent logs
    const consentTopicTx = await new TopicCreateTransaction()
      .setTopicMemo('MediChain Consent Logs')
      .execute(client)

    const consentTopicReceipt = await consentTopicTx.getReceipt(client)
    const consentTopicId = consentTopicReceipt.topicId

    console.log('Consent HCS Topic created:', consentTopicId.toString())

    const config = {
      auditTopicId: topicId.toString(),
      consentTopicId: consentTopicId.toString()
    }

    console.log('Hedera setup completed successfully')
    console.log('Configuration:', config)

    return config

  } catch (error) {
    console.error('Error setting up Hedera:', error)
  }
}

setupHedera()