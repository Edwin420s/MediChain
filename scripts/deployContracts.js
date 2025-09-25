import { Client, AccountId, PrivateKey, ContractCreateFlow } from '@hashgraph/sdk'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

async function deployContracts() {
  try {
    // Setup Hedera client
    const client = Client.forTestnet()
    client.setOperator(
      AccountId.fromString(process.env.HEDERA_OPERATOR_ID),
      PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY)
    )

    // Read contract bytecode
    const healthRecordBytecode = fs.readFileSync('./contracts/HealthRecord.bin').toString()
    const doctorRegistryBytecode = fs.readFileSync('./contracts/DoctorRegistry.bin').toString()
    const accessControlBytecode = fs.readFileSync('./contracts/AccessControl.bin').toString()

    // Deploy HealthRecord contract
    const healthRecordTx = new ContractCreateFlow()
      .setBytecode(healthRecordBytecode)
      .setGas(1000000)

    const healthRecordTxResponse = await healthRecordTx.execute(client)
    const healthRecordReceipt = await healthRecordTxResponse.getReceipt(client)
    const healthRecordContractId = healthRecordReceipt.contractId

    console.log('HealthRecord contract deployed:', healthRecordContractId.toString())

    // Deploy DoctorRegistry contract
    const doctorRegistryTx = new ContractCreateFlow()
      .setBytecode(doctorRegistryBytecode)
      .setGas(1000000)

    const doctorRegistryTxResponse = await doctorRegistryTx.execute(client)
    const doctorRegistryReceipt = await doctorRegistryTxResponse.getReceipt(client)
    const doctorRegistryContractId = doctorRegistryReceipt.contractId

    console.log('DoctorRegistry contract deployed:', doctorRegistryContractId.toString())

    // Deploy AccessControl contract
    const accessControlTx = new ContractCreateFlow()
      .setBytecode(accessControlBytecode)
      .setGas(1000000)

    const accessControlTxResponse = await accessControlTx.execute(client)
    const accessControlReceipt = await accessControlTxResponse.getReceipt(client)
    const accessControlContractId = accessControlReceipt.contractId

    console.log('AccessControl contract deployed:', accessControlContractId.toString())

    // Save contract addresses to file
    const contracts = {
      healthRecord: healthRecordContractId.toString(),
      doctorRegistry: doctorRegistryContractId.toString(),
      accessControl: accessControlContractId.toString()
    }

    fs.writeFileSync('./contracts/deployed.json', JSON.stringify(contracts, null, 2))
    console.log('Contract addresses saved to contracts/deployed.json')

  } catch (error) {
    console.error('Error deploying contracts:', error)
  }
}

deployContracts()