# MediChain API Documentation

## Base URL

- Local: `http://localhost:3001`
- Production: `https://api.medichain.com`

All API routes are prefixed with `/api/*` per `backend/src/index.js`.

## Authentication

JWT Bearer tokens are required for all protected endpoints.

```
Authorization: Bearer <jwt_token>
```

### Auth Endpoints (`/api/auth`)
- `POST /register` → Register a new user
- `POST /login` → Login and receive JWT
- `POST /refresh-token` → Refresh JWT
- `POST /forgot-password` → Start password reset flow
- `POST /reset-password` → Complete password reset
- `GET /profile` → Get current user profile (auth required)
- `PUT /profile` → Update current user profile (auth required)
- `POST /change-password` → Change password (auth required)
- `POST /logout` → Revoke session (auth required)
- `GET /users` → List users (roles: `ADMIN`, `SUPER_ADMIN`)
- `PUT /users/:userId/status` → Update user status (roles: `ADMIN`, `SUPER_ADMIN`)

### Patient Endpoints (`/api/patients`) [role: `PATIENT`]
- `GET /records` → List own records
- `GET /records/:id` → Get a specific record
- `POST /records` → Upload a record (multipart form field `file`)
- `DELETE /records/:id` → Delete a record
- `GET /consents` → List granted consents
- `POST /consent` → Grant consent
- `PUT /consent/:consentId` → Update consent
- `DELETE /consent/:consentId` → Revoke consent
- `GET /access-requests` → List access requests
- `PUT /access-requests/:requestId` → Respond to access request
- `GET /audit-logs` → View audit logs
- `POST /emergency-qr` → Generate emergency QR code
- `GET /emergency-info` → Get emergency info
- `GET /profile` → Get patient profile
- `PUT /profile` → Update patient profile

### Doctor Endpoints (`/api/doctors`) [role: `DOCTOR`]
- `GET /patients` → List patients with granted access
- `GET /patients/:patientDid` → Get patient profile
- `GET /patients/:patientDid/records` → Get patient records
- `POST /access-requests` → Request access
- `GET /access-requests` → List own access requests
- `POST /records` → Upload a record on behalf of a patient (multipart `file`)
- `GET /consents` → List consents relevant to doctor
- `GET /audit-logs` → View audit logs
- `GET /dashboard` → Dashboard stats
- `GET /profile` → Get doctor profile
- `PUT /profile` → Update doctor profile

### Admin Endpoints (`/api/admin`) [roles: `ADMIN`, `SUPER_ADMIN`]
- `GET /stats` → System statistics
- `GET /departments` → List departments
- `POST /departments` → Create department
- `PUT /departments/:departmentId` → Update department
- `GET /doctors` → List doctors
- `POST /doctors/:doctorId/approve` → Approve doctor
- `POST /doctors/:doctorId/reject` → Reject doctor
- `PUT /doctors/:doctorId` → Update doctor
- `GET /patients` → List patients
- `POST /patients` → Register patient
- `PUT /patients/:patientId` → Update patient
- `GET /users` → List users (role: `SUPER_ADMIN`)
- `PUT /users/:userId/role` → Update user role (role: `SUPER_ADMIN`)
- `GET /system-logs` → System logs
- `GET /hedera-status` → Hedera network status
- `POST /hedera-topup` → Top up Hedera account (role: `SUPER_ADMIN`)

### Department Endpoints (`/api/departments`)
- `GET /` → List departments (authenticated)
- `POST /` → Create department (roles: `ADMIN`, `SUPER_ADMIN`)
- `PUT /:departmentId` → Update department (roles: `ADMIN`, `SUPER_ADMIN`)
- `DELETE /:departmentId` → Delete department (role: `SUPER_ADMIN`)
- `GET /:departmentId/stats` → Department stats
- `GET /:departmentId/doctors` → Department doctors

### Hedera Endpoints (`/api/hedera`)
- `GET /network-info` → Network information
- `GET /transactions/:transactionId` → Verify transaction
- `GET /account/:accountId/balance` → Account balance
- `GET /topics/:topicId/messages` → Topic messages (roles: `ADMIN`, `SUPER_ADMIN`)
- `POST /audit` → Submit audit message (roles: `ADMIN`, `SUPER_ADMIN`)
- `POST /verify-consent` → Verify consent on-chain
- `GET /contracts/:contractAddress` → Contract info (roles: `ADMIN`, `SUPER_ADMIN`)
- `GET /tokens/:tokenId` → Token info (roles: `ADMIN`, `SUPER_ADMIN`)

## Service Endpoints
- `GET /health` → Uptime and service health (DB, Hedera, Redis)
- `GET /metrics` → Metrics (production only)
- `GET /` → API root info
- `GET /api` → API index with base paths

## Rate Limiting

From `backend/src/middleware/rateLimit.js` and global limiter in `index.js`:
- **General**: 100 requests / 15 minutes (prod; higher in dev)
- **Auth**: 5 requests / 15 minutes (`/api/auth/login`, etc.)
- **Upload**: 20 uploads / hour (file uploads)
- **Hedera**: 30 tx / minute (blockchain-related)

## Request/Response Examples

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Success Response
```json
{
  "success": true,
  "data": { /* resource */ }
}
```

Note: Exact response shapes may vary by endpoint; refer to controllers in `backend/src/controllers/` for full details.