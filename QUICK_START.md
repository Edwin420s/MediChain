# MediChain Quick Start Guide

Get MediChain up and running in 5 minutes.

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 15+ ([Download](https://www.postgresql.org/download/))
- **Redis** 7+ ([Download](https://redis.io/download/)) - Optional but recommended
- **Git** ([Download](https://git-scm.com/downloads))

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Edwin420s/MediChain.git
cd MediChain
```

### 2. Install Dependencies

```bash
npm run install:all
```

This installs dependencies for the root, backend, and frontend.

### 3. Database Setup

Create a PostgreSQL database:

```bash
# Using psql
createdb medichain

# Or using SQL
psql -U postgres
CREATE DATABASE medichain;
\q
```

### 4. Environment Configuration

**Backend Configuration:**

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your settings:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/medichain"

# JWT Secrets (generate secure random strings)
JWT_SECRET="your-very-secure-secret-min-32-chars-long"
JWT_REFRESH_SECRET="your-very-secure-refresh-secret-min-32"

# Hedera (testnet for development)
HEDERA_OPERATOR_ID="0.0.YOUR_ACCOUNT_ID"
HEDERA_OPERATOR_KEY="YOUR_PRIVATE_KEY"
HEDERA_NETWORK="testnet"

# IPFS
WEB3_STORAGE_TOKEN="your-web3-storage-token"

# Optional: Redis (for caching)
REDIS_URL="redis://localhost:6379"
```

**Frontend Configuration:**

```bash
cd ../frontend
echo "VITE_API_URL=http://localhost:3001/api" > .env
```

### 5. Database Migration

```bash
cd backend
npx prisma generate
npx prisma db push
```

### 6. Start Development Servers

From the root directory:

```bash
npm run dev
```

This starts both backend and frontend concurrently.

**Access Points:**
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:3001
- 📊 Health Check: http://localhost:3001/health
- 📚 API Docs: http://localhost:3001/api/docs

## Quick Test

### Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# All tests from root
npm test
```

### Verify Installation

```bash
# Check backend health
curl http://localhost:3001/health

# Expected response:
{
  "uptime": 123.456,
  "timestamp": "2024-10-24T...",
  "environment": "development",
  "services": {
    "database": "healthy",
    "hedera": "healthy",
    "cache": "healthy"
  }
}
```

## Common Issues

### Port Already in Use

```bash
# Kill process on port 3000 or 3001
npx kill-port 3000 3001
```

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL in .env is correct
```

### Redis Connection Error

Redis is optional. If not using Redis:
- The app will continue without caching (logs warning)
- Or comment out Redis health check temporarily

### Missing Dependencies

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
npm run install:all
```

## Next Steps

1. **Seed Sample Data:**
   ```bash
   cd backend
   npm run db:seed
   ```

2. **Deploy Smart Contracts:**
   ```bash
   npm run contracts:deploy
   ```

3. **Read Documentation:**
   - [Testing Guide](TESTING.md)
   - [Improvements](docs/IMPROVEMENTS.md)
   - [API Documentation](http://localhost:3001/api/docs)

4. **Configure Production:**
   - See [Deployment Guide](docs/deployment.md)
   - Set up proper SSL certificates
   - Configure production environment variables

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Vite HMR (instant updates)
- Backend: Nodemon (auto-restart on file changes)

### Debug Mode

**Backend:**
```bash
cd backend
DEBUG=* npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev -- --debug
```

### Database Reset

```bash
cd backend
npx prisma migrate reset
npx prisma db push
npm run db:seed
```

### View Logs

```bash
# Backend logs
tail -f backend/logs/combined.log

# Error logs
tail -f backend/logs/error.log
```

## Docker Setup (Alternative)

If you prefer Docker:

```bash
# Build and start all services
npm run docker:up

# Stop services
npm run docker:down
```

Access points remain the same as local development.

## Getting Help

- 📖 [Full Documentation](docs/)
- 🐛 [Report Issues](https://github.com/Edwin420s/MediChain/issues)
- 💬 [Discussions](https://github.com/Edwin420s/MediChain/discussions)
- 📧 Support: support@medichain.com

## License

MIT - See [LICENSE](LICENSE) file for details.
