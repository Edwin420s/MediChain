# MediChain Architecture

## System Overview
MediChain is a decentralized health record system built on Hedera Hashgraph. It provides secure, immutable, and patient-controlled medical records across a modern web stack.

## Architecture

- **Frontend (React + Vite + Tailwind)** → user interface and wallet/DID flows
- **Backend (Node.js + Express + Prisma)** → API, auth, records, Hedera/IPFS orchestration
- **Hedera Blockchain (HCS, HTS, Smart Contracts)** → audit trails, access control, identities
- **IPFS Storage (web3.storage)** → encrypted medical file storage

### High-level Diagram

```mermaid
flowchart LR
  A[Patient/Doctor/Admin] -->|HTTPS| B[Frontend (React)]
  B -->|REST /api/*| C[Backend (Express)]
  C -->|Prisma| D[(PostgreSQL)]
  C -->|Hedera SDK| E[Hedera (HCS/HTS/SC)]
  C -->|web3.storage| F[IPFS]
  C -->|Redis| G[(Redis Cache)]
```

## Components

### Smart Contracts (`contracts/`)
- `PatientRegistry.sol` → patient identities/DIDs
- `DoctorRegistry.sol` → doctor onboarding/verification
- `HealthRecord.sol` → record anchoring and references
- `AccessControl.sol` → consent and permission logic

### Backend Services (`backend/src/`)
- **Auth** → JWT issuance and verification (`/api/auth/*`)
- **Records/Patients** → record upload, list, consent (`/api/patients/*`)
- **Doctors** → access requests and patient lists (`/api/doctors/*`)
- **Admin** → approvals and system stats (`/api/admin/*`)
- **Departments** → department-level management (`/api/departments/*`)
- **Hedera** → blockchain interactions (`/api/hedera/*`)
- Health/metrics → `/health`, `/metrics` (prod only)

### Frontend (`frontend/src/`)
- React app with pages for Patient, Doctor, and Admin dashboards
- Hedera SDK integration and API client
- Encryption helpers before IPFS upload

## Usage Flows

### Patient Registration
- Create account via frontend (`/api/auth/register`)
- Backend issues Hedera identity (DID/association)
- Set up profile and preferences
- Generate emergency QR code (frontend feature)

### Doctor Onboarding
- Department/admin approval flow (`/api/admin/*`, `/api/departments/*`)
- Credential verification recorded on-chain
- Access permissions configured via smart contracts

### Record Management
- Files encrypted client-side and uploaded to IPFS
- Metadata anchored to Hedera (HCS/SC)
- Grant/revoke access using consent smart contracts

## Data Flow

1. User registers and authenticates (JWT) via `Auth Service`.
2. Patient records are encrypted client-side and uploaded to IPFS; CID returned.
3. Metadata (hash, CID, owner DID) is anchored to Hedera HCS/smart contracts.
4. Patient grants consent to a doctor; `AccessControl` updates permissions.
5. Doctor fetches authorized records; access is verified against on-chain consent; audit events logged to HCS.

## Security

- End-to-end encryption for medical records prior to IPFS upload
- JWT authentication and role-based access control (RBAC)
- Hedera-based immutable audit trails (HCS)
- Tamper-evident record hashing and on-chain anchoring
- Secure secret management via environment variables

## Scalability & Reliability

- Stateless backend suitable for horizontal scaling; behind a load balancer
- PostgreSQL via Prisma with connection pooling
- Redis for caching (docker-compose service included)
- High-throughput event logging via HCS
- Docker Compose orchestration; optional Nginx reverse proxy

## License

MIT License. See the root `LICENSE`.

## Contributing

Please read `CONTRIBUTING.md` for code of conduct and PR process.

## Support

Email `support@medichain.com` or join our Discord channel.