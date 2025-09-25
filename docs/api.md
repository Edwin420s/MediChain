# MediChain API Documentation

## Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

## Patients
- `GET /api/patients/records` - Get patient records
- `POST /api/patients/records` - Upload a new record
- `POST /api/patients/consent` - Grant consent to doctor

## Doctors
- `GET /api/doctors/patients` - Get accessible patients
- `GET /api/doctors/records/:patientDid` - Get patient records
- `POST /api/doctors/request-access` - Request access to records

## Admin
- `GET /api/admin/stats` - Get system statistics
- `POST /api/admin/doctors/:id/approve` - Approve doctor registration