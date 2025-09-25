# MediChain Architecture

## System Overview

MediChain is a decentralized healthcare records platform built on Hedera Hashgraph. The system provides secure, patient-owned medical records with immutable audit trails and granular access control.

## Components

### 1. Frontend (React.js)
- **Patient Portal**: Record management and access control
- **Doctor Portal**: Patient records viewing and management
- **Admin Portal**: System and user management
- **Landing Page**: Marketing and information

### 2. Backend (Node.js/Express)
- **REST API**: JSON API for all operations
- **Authentication**: JWT-based auth with Hedera DID
- **Business Logic**: Record processing and access control
- **Hedera Integration**: Blockchain operations

### 3. Blockchain (Hedera Hashgraph)
- **HCS (Hedera Consensus Service)**: Audit trails and event logging
- **Smart Contracts**: Access control and verification
- **HTS (Hedera Token Service)**: Role-based tokens

### 4. Storage
- **IPFS**: Decentralized file storage for medical records
- **PostgreSQL**: Relational database for metadata
- **Hedera**: Immutable metadata and audit logs

## Data Flow

### Record Upload
1. Patient uploads file through frontend
2. File encrypted client-side
3. Encrypted file stored on IPFS
4. Metadata and hash anchored to Hedera HCS
5. Database updated with record metadata

### Access Granting
1. Patient selects record and doctor
2. Consent recorded on Hedera smart contract
3. Access rule created in database
4. Doctor notified of access grant

### Record Access
1. Doctor requests record access
2. System verifies consent on Hedera
3. IPFS file retrieved and decrypted
4. Access logged to HCS audit trail

## Security Features

- **End-to-End Encryption**: Files encrypted before upload
- **Hedera DID**: Decentralized identity management
- **Immutable Audit Trail**: All actions logged to HCS
- **Role-Based Access**: Granular permissions system
- **HIPAA Compliance**: Designed for healthcare regulations