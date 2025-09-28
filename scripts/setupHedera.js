import { Client, AccountId, PrivateKey, TopicCreateTransaction, TokenCreateTransaction, Hbar } from '@hashgraph/sdk';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function setupHedera() {
  try {
    console.log('🚀 Setting up Hedera for MediChain...\n');

    // Validate environment variables
    if (!process.env.HEDERA_OPERATOR_ID || !process.env.HEDERA_OPERATOR_KEY) {
      throw new Error('Hedera operator credentials not found in environment variables');
    }

    // Initialize client
    const client = Client.forTestnet(); // Use forMainnet() in production
    client.setOperator(
      AccountId.fromString(process.env.HEDERA_OPERATOR_ID),
      PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY)
    );

    console.log('✅ Hedera client initialized');
    console.log(`   Network: ${client.network.toString()}`);
    console.log(`   Operator: ${process.env.HEDERA_OPERATOR_ID}\n`);

    // Create HCS topics
    console.log('📝 Creating HCS topics...');
    
    const topics = {
      AUDIT_TOPIC: 'MediChain Audit Logs',
      RECORD_TOPIC: 'Medical Record Anchors', 
      CONSENT_TOPIC: 'Consent Management Logs',
      EMERGENCY_TOPIC: 'Emergency Access Logs'
    };

    const createdTopics = {};

    for (const [topicName, memo] of Object.entries(topics)) {
      console.log(`   Creating topic: ${memo}`);
      
      const transaction = await new TopicCreateTransaction()
        .setTopicMemo(memo)
        .setMaxTransactionFee(new Hbar(2))
        .execute(client);

      const receipt = await transaction.getReceipt(client);
      createdTopics[topicName] = receipt.topicId.toString();
      
      console.log(`   ✅ Created: ${receipt.topicId}`);
    }

    // Create role tokens
    console.log('\n🎫 Creating role tokens...');
    
    const tokens = [
      { name: 'MediChain Patient Token', symbol: 'MCPT', initialSupply: 0 },
      { name: 'MediChain Doctor Token', symbol: 'MCDT', initialSupply: 0 },
      { name: 'MediChain Admin Token', symbol: 'MCAT', initialSupply: 0 }
    ];

    const createdTokens = {};

    for (const token of tokens) {
      console.log(`   Creating token: ${token.name}`);
      
      const transaction = await new TokenCreateTransaction()
        .setTokenName(token.name)
        .setTokenSymbol(token.symbol)
        .setDecimals(0)
        .setInitialSupply(token.initialSupply)
        .setTreasuryAccountId(AccountId.fromString(process.env.HEDERA_OPERATOR_ID))
        .setAdminKey(PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY).publicKey)
        .freezeWith(client);

      const signTx = await transaction.sign(PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY));
      const txResponse = await signTx.execute(client);
      const receipt = await txResponse.getReceipt(client);
      
      createdTokens[token.symbol] = receipt.tokenId.toString();
      console.log(`   ✅ Created: ${receipt.tokenId}`);
    }

    // Save deployment information
    const deploymentInfo = {
      network: 'testnet',
      operatorId: process.env.HEDERA_OPERATOR_ID,
      timestamp: new Date().toISOString(),
      topics: createdTopics,
      tokens: createdTokens
    };

    fs.writeFileSync('./hedera-deployment.json', JSON.stringify(deploymentInfo, null, 2));
    console.log('\n📄 Deployment information saved to hedera-deployment.json');

    // Generate environment file
    const envContent = `
# Hedera Configuration
HEDERA_OPERATOR_ID=${process.env.HEDERA_OPERATOR_ID}
HEDERA_OPERATOR_KEY=${process.env.HEDERA_OPERATOR_KEY}
HEDERA_NETWORK=testnet

# HCS Topics
HEDERA_AUDIT_TOPIC=${createdTopics.AUDIT_TOPIC}
HEDERA_RECORD_TOPIC=${createdTopics.RECORD_TOPIC}
HEDERA_CONSENT_TOPIC=${createdTopics.CONSENT_TOPIC}
HEDERA_EMERGENCY_TOPIC=${createdTopics.EMERGENCY_TOPIC}

# HTS Tokens
PATIENT_TOKEN_ID=${createdTokens.MCPT}
DOCTOR_TOKEN_ID=${createdTokens.MCDT}
ADMIN_TOKEN_ID=${createdTokens.MCAT}
    `.trim();

    fs.writeFileSync('./.hedera.env', envContent);
    console.log('📄 Hedera environment file saved to .hedera.env');

    console.log('\n🎉 Hedera setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Deploy smart contracts using: npm run deploy:contracts');
    console.log('2. Update your .env file with the generated topic IDs');
    console.log('3. Start the application: npm run dev');

  } catch (error) {
    console.error('❌ Hedera setup failed:', error);
    process.exit(1);
  }
}

setupHedera();