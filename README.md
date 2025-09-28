# MediChain – Decentralized Health Records on Hedera

A production-ready healthcare platform for secure, patient-owned medical records built on Hedera Hashgraph with IPFS-backed storage.

## 🚀 Features

- **Patient-Owned Data** – Users control access to their health records
- **Hedera Audit Trails** – Immutable logging via HCS and smart contracts
- **IPFS Storage** – Encrypted medical files stored with content addressing
- **Role-Based Access** – Patients, Doctors, Admins with consent-based controls
- **Emergency Access** – Generatable QR codes for critical information
- **Modern UX** – Responsive React app with Tailwind CSS

## 🏗 Architecture

- Frontend (React + Vite + Tailwind) → user interface and DID flows
- Backend (Node.js + Express + Prisma) → API, auth, records, Hedera/IPFS orchestration
- Hedera (HCS, HTS, Smart Contracts) → audit trails, access control, identities
- IPFS (web3.storage) → encrypted medical file storage

`mermaid
flowchart LR
  A[Patient/Doctor/Admin] -->|HTTPS| B[Frontend (React)]
  B -->|REST /api/*| C[Backend (Express)]
  C -->|Prisma| D[(PostgreSQL)]
  C -->|Hedera SDK| E[Hedera (HCS/HTS/SC)]
  C -->|web3.storage| F[IPFS]
  C -->|Redis| G[(Redis Cache)]
`

## 🛠 Tech Stack

- Frontend: eact, ite, 	ailwindcss, xios, @hashgraph/sdk
- Backend: xpress, @prisma/client/prisma, jsonwebtoken, multer, helmet, cors
- Blockchain: Hedera Hashgraph (HCS/HTS/Smart Contracts)
- Storage: IPFS via web3.storage
- Database: PostgreSQL
- Caching: Redis (Docker Compose)
- Monitoring: Prometheus + Grafana (Docker Compose)

## �� Project Structure

`
.
├─ backend/                 # Express API, Prisma, services, routes
│  ├─ src/
│  │  ├─ routes/            # auth, patients, doctors, admin, departments, hedera
│  │  ├─ middleware/
│  │  ├─ config/            # db, hedera, ipfs
│  │  ├─ controllers/
│  │  └─ index.js           # server entry
│  ├─ prisma/schema.prisma
│  ├─ Dockerfile(.prod)
│  └─ .env.example
├─ frontend/               # React app
│  └─ src/
├─ contracts/              # Solidity contracts
├─ scripts/                # DB init/seed, contract deployment, Hedera setup
├─ docs/                   # architecture.md, api.md, deployment.md
├─ docker-compose.yml      # postgres, redis, backend, frontend, nginx, prometheus, grafana
├─ nginx.conf              # example nginx config (align with compose volumes)
└─ package.json            # workspace scripts
`

## 📦 Installation

1. **Clone the repository**
`ash
git clone https://github.com/Edwin420s/MediChain
cd medichain
`

## ⚙️ Setup

1) Install dependencies
`ash
npm run install:all
`

2) Configure environment (copy and edit ackend/.env.example → ackend/.env)
- Database: DATABASE_URL
- JWT: JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN
- Hedera: HEDERA_OPERATOR_ID, HEDERA_OPERATOR_KEY, HEDERA_NETWORK
- Contracts/HCS (after deploy): HEALTH_RECORD_CONTRACT, DOCTOR_REGISTRY_CONTRACT, ACCESS_CONTROL_CONTRACT, HEDERA_AUDIT_TOPIC, HEDERA_RECORD_TOPIC, HEDERA_CONSENT_TOPIC
- IPFS: WEB3_STORAGE_TOKEN
- Email: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
- App: NODE_ENV, PORT (default 3001), CORS_ORIGIN, FRONTEND_URL, API_URL

3) Database
`ash
npm run db:setup
# optional
npm run db:seed
`

4) Smart contracts (optional)
`ash
npm run contracts:deploy
# utilities
npm run hedera:setup
`

5) Run (dev)
`ash
npm run dev
`

Services:
- Backend: http://localhost:3001
- Frontend: http://localhost:3000
- Health: GET http://localhost:3001/health
- API Index: GET http://localhost:3001/api

## 🧰 Workspace Scripts (root package.json)

- install:all – install root, frontend, backend
- dev – run backend and frontend concurrently
- uild, uild:frontend, uild:backend
- 	est, 	est:frontend, 	est:backend
- db:setup – prisma generate + prisma db push
- db:seed – seed data
- contracts:deploy, hedera:setup
- docker:build, docker:up, docker:down

## �� API Overview

- Base URL (local): http://localhost:3001/api
- Base URL (prod): https://api.medichain.com/api
- Auth uses JWT Bearer: Authorization: Bearer <token>
- Route groups: /auth, /patients, /doctors, /admin, /departments, /hedera
- See full details in docs/api.md.

## 🚀 Deployment

### Docker Compose (recommended)
`ash
npm run docker:build
npm run docker:up
`

Exposed ports:
- Backend: 3001:3001
- Frontend: 3000:80
- Nginx: 80:80, 443:443
- Prometheus: 9090:9090
- Grafana: 3002:3000

### Manual
`ash
cd frontend && npm run build
cd ../backend && npm start
`

More details in docs/deployment.md.

## 🔒 Security

- End-to-end encryption before IPFS upload
- JWT-based auth with RBAC
- Hedera-based immutable audit trails (HCS)
- Tamper-evident record hashing anchored on-chain

## 📈 Monitoring

- Health: GET /health
- Metrics (production only): GET /metrics
- Prometheus/Grafana configured via monitoring/

## 📝 Notes & Caveats

- Ensure frontend API base includes /api.
  - Frontend default uses VITE_API_URL || 'http://localhost:3001/api'.
  - In Docker, set VITE_API_URL=https://api.medichain.com/api.
- Frontend patientAPI.getAuditLogs() should call /patients/audit-logs to match backend route.
- IPFS envs: backend uses WEB3_STORAGE_TOKEN; compose references IPFS_API_KEY/IPFS_SECRET — standardize on one.
- Nginx volumes in docker-compose.yml reference ./nginx/nginx.conf; repository includes 
ginx.conf at root — align paths.

## 🤝 Contributing

We welcome contributions. See docs/ for guidance. If present, read CONTRIBUTING.md.

## 📄 License

MIT (see package.json license). If a LICENSE file is missing, one should be added.

## 🆘 Support

Email support@medichain.com or join our Discord.
