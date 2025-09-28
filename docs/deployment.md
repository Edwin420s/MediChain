# Deployment Guide

## Prerequisites

- Node.js 18+
- Docker and Docker Compose (recommended for prod)
- PostgreSQL 14+ (if running outside Docker)
- Redis 7+ (if running outside Docker)
- Hedera Testnet/Mainnet operator account (ID + Private Key)
- IPFS pinning/token (web3.storage supported)

## Environment Variables

Create `backend/.env` from `backend/.env.example` and fill values:

- Database: `DATABASE_URL`
- JWT: `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN`
- Hedera: `HEDERA_OPERATOR_ID`, `HEDERA_OPERATOR_KEY`, `HEDERA_NETWORK`
- Contracts/HCS (after deploy): `HEALTH_RECORD_CONTRACT`, `DOCTOR_REGISTRY_CONTRACT`, `ACCESS_CONTROL_CONTRACT`, `HEDERA_AUDIT_TOPIC`, `HEDERA_RECORD_TOPIC`, `HEDERA_CONSENT_TOPIC`
- IPFS: `WEB3_STORAGE_TOKEN` (used by `backend/src/config/ipfs.js`)
- Email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- App: `NODE_ENV`, `PORT` (default 3001), `CORS_ORIGIN`, `FRONTEND_URL`, `API_URL`
- Logging/Rate limit: `LOG_LEVEL`, `RATE_LIMIT_WINDOW`, `RATE_LIMIT_MAX`

Note: The Docker Compose file also references `IPFS_API_KEY` and `IPFS_SECRET`. The backend currently uses `WEB3_STORAGE_TOKEN`. Provide the appropriate token(s) as needed.

## Local Development

1. Install all dependencies from repo root:
```bash
npm run install:all
```
2. Set up the database schema:
```bash
npm run db:setup
```
3. Seed sample data (optional):
```bash
npm run db:seed
```
4. Run both backend and frontend in dev mode:
```bash
npm run dev
```

Services:
- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3000`
- Health: `GET http://localhost:3001/health`
- API Index: `GET http://localhost:3001/api`

## Smart Contracts

Deploy contracts and write addresses to environment:
```bash
npm run contracts:deploy
```
Optional Hedera setup utilities:
```bash
npm run hedera:setup
```

## Docker Deployment

Build and run using Compose from repo root:
```bash
npm run docker:build
npm run docker:up
```

Exposed ports (from `docker-compose.yml`):
- Backend API: `3001:3001`
- Frontend (static): `3000:80`
- Nginx reverse proxy: `80:80`, `443:443`
- Prometheus: `9090:9090`
- Grafana: `3002:3000`

Services:
- `postgres` → PostgreSQL with initialized DB
- `redis` → Redis cache
- `backend` → Node.js API (Express)
- `frontend` → Built React app (served by nginx inside image)
- `nginx` → Reverse proxy/SSL termination (ensure `./nginx/` paths exist)
- `prometheus`, `grafana` → Monitoring stack

Health checks:
- Backend: `GET /health` (used by Compose healthcheck)
- Metrics: `GET /metrics` (enabled in production mode)

Logs/Monitoring:
- Prometheus configuration: `monitoring/prometheus.yml`
- Grafana dashboards/provisioning: `monitoring/grafana/*`

## Manual Production Deployment (alternative)

Build frontend and start backend manually:
```bash
cd frontend && npm run build
cd ../backend && npm start
```

Put a reverse proxy (e.g., Nginx) in front and terminate TLS.

## Backups

- Database (example):
```bash
pg_dump medichain > backup.sql
```
- IPFS: use pinning provider redundancy; keep track of important CIDs
- Hedera: HCS topics are immutable; rely on mirror node providers for archival

## Troubleshooting

- Verify `.env` values and network access to PostgreSQL/Redis
- Check `GET /health` for component status (DB/Hedera/Redis)
- Ensure `WEB3_STORAGE_TOKEN` is set for IPFS operations