# MediChain – Decentralized Health Records on Hedera

A production-ready healthcare platform for secure, patient-owned medical records, built on Hedera Hashgraph and IPFS, with a modern React + Node/Express stack. It provides end-to-end encrypted storage, consent-based access control, immutable audit trails, and production-grade deployment/monitoring.

## 🌍 Non‑Technical Summary

MediChain is a digital health record system that puts patients in control of their medical information. Instead of paper files that get lost or repeating the same tests at every clinic, your records are stored safely, can be shared only with your permission, and follow you wherever you go. Doctors get the right information at the right time, patients save money and time, and hospitals reduce fraud and errors. Everything is designed for real-world use across clinics and regions, with privacy and transparency built in.

### Who it’s for

- Patients who want their medical history to travel with them across clinics and cities.
- Doctors and hospitals needing fast, verified access to patient records (with consent).
- Health programs and insurers that must reduce fraud and duplicate tests.

### Benefits

- Fewer repeated tests and faster care at new clinics.
- Clear, permission-based sharing you can turn on or off anytime.
- A tamper-evident history of who accessed what and when.
- Works across regions and providers without locking you into one hospital.

## 🚀 Summary

- **Purpose**: Patient-owned health records with granular, consent-based sharing.
- **Core**: React frontend, Express/Prisma backend, Hedera (HCS/HTS/SC), IPFS (web3.storage), PostgreSQL, Redis.
- **Security**: JWT + RBAC, Helmet/CSP, rate limiting, on-chain audit, E2E encryption before IPFS.
- **Ops**: Docker Compose, Nginx proxy/SSL, Prometheus + Grafana, health + metrics endpoints, graceful shutdown.
- **Smart Contracts**: Patient/Doctor registries, HealthRecord metadata anchoring, AccessControl permissions.

## 🏗 Architecture

- Frontend (React + Vite + Tailwind) → UI, auth, DID/flows
- Backend (Node.js + Express + Prisma) → API, auth, records, Hedera/IPFS orchestration
- Hedera (HCS, HTS, Smart Contracts) → audit trails, identities, access control
- IPFS (web3.storage) → encrypted medical file storage

```
mermaid
flowchart LR

  A[Patient/Doctor/Admin] -->|HTTPS| B[Frontend (React)]
  B -->|REST /api/*| C[Backend (Express)]
  C -->|Prisma| D[(PostgreSQL)]
  C -->|Hedera SDK| E[Hedera (HCS/HTS/SC)]
  C -->|web3.storage| F[IPFS]
  C -->|Redis| G[(Redis Cache)]

```

## 📁 Project Structure

```
MediChain
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  │  ├─ db.js                 # Prisma client + logging helpers
│  │  │  ├─ hedera.js             # Hedera client init + health
│  │  │  └─ ipfs.js               # web3.storage IPFS client
│  │  ├─ controllers/             # auth, patient, doctor, admin, hedera, dept
│  │  ├─ middleware/              # auth, role, rateLimit, error handlers
│  │  ├─ routes/                  # authRoutes.js, patientRoutes.js, ...
│  │  ├─ utils/                   # logger, validators, helpers
│  │  └─ index.js                 # server entry, health/metrics, swagger
│  ├─ prisma/
│  │  └─ schema.prisma            # DB schema (users, records, consents, logs)
│  ├─ Dockerfile(.prod)
│  ├─ package.json
│  └─ .env.example
├─ frontend/
│  ├─ src/
│  │  ├─ pages/                   # dashboards & pages
│  │  ├─ components/              # UI components
│  │  ├─ context/                 # Auth/Theme/User contexts
│  │  ├─ services/                # api.js (Axios), hedera.js, ipfs.js
│  │  ├─ utils/                   # encryption, validators
│  │  ├─ router.jsx               # routes + guards
│  │  └─ App.jsx / main.jsx
│  └─ package.json
├─ contracts/
│  ├─ PatientRegistry.sol
│  ├─ DoctorRegistry.sol
│  ├─ HealthRecord.sol
│  ├─ AccessControl.sol
│  └─ utils/Strings.sol
├─ scripts/
│  ├─ deployContracts.js          # deploy contracts
│  ├─ setupHedera.js              # setup utilities
│  ├─ init-db.sql                 # DB init
│  └─ seedDatabase.js             # seeding
├─ docs/
│  ├─ architecture.md
│  ├─ api.md
│  └─ deployment.md
├─ monitoring/
│  ├─ prometheus.yml              # scrape backend metrics
│  └─ grafana/                    # dashboards & provisioning
├─ kubernetes/                    # (scaffolding if used)
├─ docker-compose.yml             # postgres, redis, backend, frontend, nginx, prometheus, grafana, exporters
├─ nginx.conf                     # reverse proxy, rate-limits
├─ LICENSE                        # MIT
└─ package.json                   # workspace scripts
```

## 🛠 Tech Stack

- Frontend: 
eact, ite, 	ailwindcss, xios, @hashgraph/sdk
- Backend: xpress, @prisma/client/prisma, helmet, jsonwebtoken, multer, cors, swagger-jsdoc, swagger-ui-express
- Blockchain: Hedera Hashgraph (HCS/HTS/Smart Contracts)
- Storage: IPFS (web3.storage)
- Database: PostgreSQL
- Cache: Redis
- Proxy: Nginx
- Monitoring: Prometheus + Grafana

## 📦 Getting Started

1) Clone & install
```
git clone https://github.com/Edwin420s/MediChain
cd medichain

npm run install:all
```

2) Configure environment
- Copy ackend/.env.example → ackend/.env and fill:
  ```
  - DB: DATABASE_URL
  - JWT: JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN
  - Hedera: HEDERA_OPERATOR_ID, HEDERA_OPERATOR_KEY, HEDERA_NETWORK
  - Contracts/HCS (post-deploy): HEALTH_RECORD_CONTRACT, DOCTOR_REGISTRY_CONTRACT, ACCESS_CONTROL_CONTRACT, HEDERA_AUDIT_TOPIC, HEDERA_RECORD_TOPIC, HEDERA_CONSENT_TOPIC
  - IPFS: WEB3_STORAGE_TOKEN
  - Email: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
  - App: NODE_ENV, PORT (default 3001), CORS_ORIGIN, FRONTEND_URL, API_URL

3) Database
```
npm run db:setup
```
# optional
```
npm run db:seed
```

4) Contracts (optional)
```
npm run contracts:deploy
# utilities
npm run hedera:setup
```

5) Run dev
```
npm run dev
```
- Backend: http://localhost:3001
- Frontend: http://localhost:3000
- Health: GET http://localhost:3001/health
- API Index: GET http://localhost:3001/api
- Swagger UI: http://localhost:3001/api/docs

## 🧰 Workspace Scripts (root package.json)

- install:all – install root, frontend, backend
- dev – run backend and frontend concurrently
- uild, uild:frontend, uild:backend
- 	est, 	est:frontend, 	est:backend
- db:setup, db:seed
- contracts:deploy, hedera:setup
- docker:build, docker:up, docker:down

## 📚 API Overview

- Base URL (local): http://localhost:3001/api
- Base URL (prod): https://api.medichain.com/api
- Auth: Authorization: Bearer <jwt_token>
- Route groups: /auth, /patients, /doctors, /admin, /departments, /hedera
- Swagger: GET /api/docs
- See full endpoint list: docs/api.md

## 🚀 Deployment

### Docker Compose
```
npm run docker:build
npm run docker:up
```
Ports:
- Backend: 3001:3001
- Frontend: 3000:80
- Nginx: 80:80, 443:443
- Prometheus: 9090:9090
- Grafana: 3002:3000
- Node Exporter: 9100:9100
- Nginx Exporter: 9113:9113

Nginx volumes (ensure exist):
- ./nginx.conf → /etc/nginx/nginx.conf
- ./nginx/ssl → /etc/nginx/ssl (place cert.pem/key.pem)
- ./nginx/logs → /var/log/nginx

Nginx stub status for exporter: add in 
ginx.conf (example)
```
ginx
server {
  listen 8080;
  location /stub_status {
    stub_status;
    allow 127.0.0.1;
    allow 172.20.0.0/16; # docker network
    deny all;
  }
}
```
And ensure 
ginx-exporter points to -nginx.scrape-uri=http://nginx:8080/stub_status.

### Manual
```
cd frontend && npm run build
cd ../backend && npm start
```

## 🔒 Security

- Helmet/CSP, CORS, compression
- JWT auth + RBAC, route-level rate limits
- On-chain audit trails (HCS) and tamper-evident hashes
- End-to-end encryption before IPFS upload

## 📈 Monitoring

- Health: GET /health
- Metrics (prod): GET /metrics
- Prometheus stack: monitoring/prometheus.yml
- Grafana: pre-provisioned dashboards (monitoring/grafana/)

## 🧪 Testing & CI/CD (recommended)

- Add unit/integration tests for controllers/services and contract tests (Hardhat/Foundry)
- CI for lint/test/build, image publish, and security scanning

## 📝 Troubleshooting

- Ensure VITE_API_URL includes /api in prod
- Provide TLS certs in ./nginx/ssl for 443 or use HTTP-only
- Ensure WEB3_STORAGE_TOKEN is set for IPFS
- Redis health is checked via TCP (uses REDIS_URL)
- Prometheus exporters require stub_status config in Nginx

## 🤝 Contributing

PRs welcome. Please follow code style and include tests where applicable.

## 📄 License

MIT – see LICENSE.

## 🆘 Support

Email support@medichain.com or join our Discord: https://discord.gg/medichain
