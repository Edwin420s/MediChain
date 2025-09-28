import { Client, AccountId, PrivateKey, TopicCreateTransaction } from '@hashgraph/sdk';
import dotenv from 'dotenv';

dotenv.config();

async function setupHedera() {
  try {
    // Initialize client
    const client = Client.forTestnet();
    client.setOperator(
      AccountId.fromString(process.env.HEDERA_OPERATOR_ID),
      PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY)
    );

    console.log('Setting up Hedera topics for MediChain...');

    // Create topics for different types of events
    const topics = [
      { name: 'AUDIT_TOPIC', memo: 'MediChain Audit Logs' },
      { name: 'RECORD_TOPIC', memo: 'Medical Record Anchors' },
      { name: 'CONSENT_TOPIC', memo: 'Consent Management Logs' },
      { name: 'ACCESS_TOPIC', memo: 'Access Control Events' }
    ];

    const topicIds = {};

    for (const topic of topics) {
      const transaction = new TopicCreateTransaction()
        .setTopicMemo(topic.memo)
        .setMaxTransactionFee(100000000); // 1 HBAR

      const txResponse = await transaction.execute(client);
      const receipt = await txResponse.getReceipt(client);
      
      topicIds[topic.name] = receipt.topicId.toString();
      console.log(`${topic.name}: ${receipt.topicId}`);
    }

    console.log('\nHedera setup completed successfully!');
    console.log('Topic IDs:', topicIds);

    // Save to environment file
    const envUpdates = Object.entries(topicIds)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    console.log('\nAdd these to your .env file:');
    console.log(envUpdates);

  } catch (error) {
    console.error('Hedera setup failed:', error);
    process.exit(1);
  }
}

setupHedera();