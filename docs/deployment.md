# Deployment Guide

## Prerequisites
- Node.js 18+
- PostgreSQL
- Hedera testnet account

## Steps
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations: `npx prisma db push`
5. Seed the database: `npm run db:seed`
6. Start the backend: `npm run dev`
7. Start the frontend: `cd frontend && npm run dev`

## Production Deployment
- Use Docker: `docker-compose up --build`
- Set up reverse proxy (nginx)
- Configure SSL certificates
- Set up monitoring and logging