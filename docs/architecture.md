# MediChain Architecture

## Overview
MediChain is a decentralized health record system built on Hedera Hashgraph. It provides secure, immutable, and patient-controlled medical records.

## System Architecture
- **Frontend**: React.js application with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Hedera Hashgraph (HCS, HTS, Smart Contracts)
- **Storage**: IPFS for file storage

## Components
### Smart Contracts
- `PatientRegistry.sol`: Manages patient identities
- `DoctorRegistry.sol`: Manages doctor verification
- `HealthRecord.sol`: Handles medical record anchoring
- `AccessControl.sol`: Manages consent and access control

### Backend Services
- **Auth Service**: Handles user authentication and JWT tokens
- **Hedera Service**: Interacts with Hedera blockchain
- **IPFS Service**: Manages file uploads and retrievals
- **Email Service**: Sends notifications

### Frontend Components
- **Landing Page**: Marketing and information
- **Patient Dashboard**: Record management and sharing
- **Doctor Dashboard**: Patient record access
- **Admin Dashboard**: System management

## Data Flow
1. Patient registers and creates a Hedera DID
2. Medical records are encrypted and stored on IPFS
3. Record metadata is anchored on Hedera HCS
4. Patients grant consent to doctors via smart contracts
5. Doctors access records with patient consent

## Security
- End-to-end encryption for medical records
- Hedera-based audit trails
- JWT authentication
- Role-based access control