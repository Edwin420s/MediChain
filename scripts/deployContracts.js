import { Client, AccountId, PrivateKey, ContractCreateFlow, FileCreateTransaction, Hbar } from '@hashgraph/sdk';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

async function deployContracts() {
  try {
    // Setup client
    const client = Client.forTestnet();
    client.setOperator(
      AccountId.fromString(process.env.HEDERA_OPERATOR_ID),
      PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY)
    );

    console.log('Deploying MediChain smart contracts...');

    // Read contract files
    const contractFiles = {
      HealthRecord: './contracts/HealthRecord.sol',
      DoctorRegistry: './contracts/DoctorRegistry.sol',
      AccessControl: './contracts/AccessControl.sol'
    };

    const deployedContracts = {};

    for (const [contractName, filePath] of Object.entries(contractFiles)) {
      console.log(`\nDeploying ${contractName}...`);
      
      // In a real deployment, you would compile the Solidity code first
      // For this example, we'll create placeholder contracts
      const contractBytecode = '0x' + '00'.repeat(100); // Placeholder bytecode

      const contractCreate = new ContractCreateFlow()
        .setBytecode(contractBytecode)
        .setGas(1000000)
        .setConstructorParameters(new Uint8Array([]));

      const txResponse = await contractCreate.execute(client);
      const receipt = await txResponse.getReceipt(client);
      
      deployedContracts[contractName] = receipt.contractId.toString();
      console.log(`${contractName} deployed at: ${receipt.contractId}`);
    }

    // Create HCS topics for audit logs
    console.log('\nCreating HCS topics...');
    
    const topics = {
      AUDIT_TOPIC: 'MediChain Audit Logs',
      RECORD_TOPIC: 'Medical Record Anchors',
      CONSENT_TOPIC: 'Consent Management Logs'
    };

    const deployedTopics = {};

    for (const [topicName, memo] of Object.entries(topics)) {
      const topicCreate = new TopicCreateTransaction()
        .setTopicMemo(memo)
        .setMaxTransactionFee(new Hbar(2));

      const txResponse = await topicCreate.execute(client);
      const receipt = await txResponse.getReceipt(client);
      
      deployedTopics[topicName] = receipt.topicId.toString();
      console.log(`${topicName} created: ${receipt.topicId}`);
    }

    // Save deployment info
    const deploymentInfo = {
      contracts: deployedContracts,
      topics: deployedTopics,
      network: 'testnet',
      timestamp: new Date().toISOString(),
      operatorId: process.env.HEDERA_OPERATOR_ID
    };

    fs.writeFileSync('./deployment.json', JSON.stringify(deploymentInfo, null, 2));
    console.log('\nDeployment information saved to deployment.json');

    // Create environment file template
    const envTemplate = `
# Hedera Configuration
HEDERA_OPERATOR_ID=${process.env.HEDERA_OPERATOR_ID}
HEDERA_OPERATOR_KEY=${process.env.HEDERA_OPERATOR_KEY}
HEDERA_NETWORK=testnet

# Contract Addresses
HEALTH_RECORD_CONTRACT=${deployedContracts.HealthRecord}
DOCTOR_REGISTRY_CONTRACT=${deployedContracts.DoctorRegistry}
ACCESS_CONTROL_CONTRACT=${deployedContracts.AccessControl}

# HCS Topics
HEDERA_AUDIT_TOPIC=${deployedTopics.AUDIT_TOPIC}
HEDERA_RECORD_TOPIC=${deployedTopics.RECORD_TOPIC}
HEDERA_CONSENT_TOPIC=${deployedTopics.CONSENT_TOPIC}

# IPFS Configuration
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret
WEB3_STORAGE_TOKEN=your_web3_storage_token

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/medichain"

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# SMTP Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@medichain.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
    `.trim();

    fs.writeFileSync('./.env.example', envTemplate);
    console.log('Environment template saved to .env.example');

    console.log('\n🎉 Deployment completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Copy .env.example to .env and fill in your configuration');
    console.log('2. Run database migrations: npx prisma db push');
    console.log('3. Start the backend: npm run dev');
    console.log('4. Start the frontend: cd frontend && npm run dev');

  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deployContracts();