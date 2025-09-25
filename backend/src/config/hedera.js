import { Client, AccountId, PrivateKey } from '@hashgraph/sdk'

const hederaConfig = {
  operatorId: AccountId.fromString(process.env.HEDERA_OPERATOR_ID),
  operatorKey: PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY),
  network: process.env.HEDERA_NETWORK || 'testnet'
}

const client = Client.forName(hederaConfig.network)
client.setOperator(hederaConfig.operatorId, hederaConfig.operatorKey)

export { client, hederaConfig }