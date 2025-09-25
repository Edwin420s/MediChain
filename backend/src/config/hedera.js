import { Client, AccountId, PrivateKey } from "@hashgraph/sdk";

const client = Client.forTestnet(); // Use forMainnet in production

const operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY);

client.setOperator(operatorId, operatorKey);

export default client;