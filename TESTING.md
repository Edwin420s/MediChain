# MediChain Testing Guide

Complete guide for running and writing tests for MediChain.

## Table of Contents

1. [Setup](#setup)
2. [Running Tests](#running-tests)
3. [Writing Tests](#writing-tests)
4. [Test Coverage](#test-coverage)
5. [CI/CD Integration](#cicd-integration)
6. [Best Practices](#best-practices)

---

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL (for integration tests)
- Redis (for cache tests)

### Installation

```bash
# Install all dependencies
npm run install:all

# Or install separately
cd backend && npm install
cd frontend && npm install
```

### Test Database Setup

Create a separate test database:

```sql
CREATE DATABASE medichain_test;
```

Configure `.env.test` in the backend directory:

```bash
cp backend/.env.example backend/.env.test
# Edit .env.test with test database credentials
```

---

## Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run specific test suites
npm run test:unit              # Unit tests only
npm run test:integration       # Integration tests only

# Watch mode (for development)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- auth.test.js

# Run tests matching pattern
npm test -- --testNamePattern="login"
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# UI mode (interactive)
npm run test:ui

# Run specific test file
npm test -- ProtectedRoute.test.jsx
```

### Full Test Suite

Run all tests from project root:

```bash
npm test
```

---

## Writing Tests

### Backend Unit Tests

**Location:** `backend/src/__tests__/unit/`

**Example: Testing a utility function**

```javascript
// backend/src/__tests__/unit/utils/crypto.test.js
import { describe, it, expect } from '@jest/globals';
import { hashPassword, comparePassword } from '../../../utils/crypto.js';

describe('Crypto Utils', () => {
  describe('hashPassword', () => {
    it('should hash password securely', async () => {
      const password = 'TestPassword123!';
      const hashed = await hashPassword(password);
      
      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(50);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const password = 'TestPassword123!';
      const hashed = await hashPassword(password);
      const isMatch = await comparePassword(password, hashed);
      
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'TestPassword123!';
      const hashed = await hashPassword(password);
      const isMatch = await comparePassword('WrongPassword', hashed);
      
      expect(isMatch).toBe(false);
    });
  });
});
```

### Backend Integration Tests

**Location:** `backend/src/__tests__/integration/`

**Example: Testing an API endpoint**

```javascript
// backend/src/__tests__/integration/patients.test.js
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import app from '../../index.js';
import prisma from '../../config/db.js';

describe('Patient API', () => {
  let authToken;
  let patientId;

  beforeAll(async () => {
    // Create test user and get auth token
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'patient@test.com',
        password: 'TestPassword123!',
        name: 'Test Patient',
        role: 'PATIENT'
      });

    authToken = response.body.token;
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.user.deleteMany({
      where: { email: 'patient@test.com' }
    });
    await prisma.$disconnect();
  });

  describe('GET /api/patients/records', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/patients/records');

      expect(response.status).toBe(401);
    });

    it('should return patient records', async () => {
      const response = await request(app)
        .get('/api/patients/records')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.records)).toBe(true);
    });
  });
});
```

### Frontend Component Tests

**Location:** `frontend/src/__tests__/components/`

**Example: Testing a React component**

```jsx
// frontend/src/__tests__/components/LoginForm.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../../components/LoginForm';

describe('LoginForm', () => {
  it('should render login form', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Trigger blur event

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();
    
    render(<LoginForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123!');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!'
      });
    });
  });

  it('should show loading state during submission', async () => {
    const mockSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
    const user = userEvent.setup();
    
    render(<LoginForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123!');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeDisabled();
  });
});
```

### Frontend Service Tests

**Location:** `frontend/src/__tests__/services/`

**Example: Testing an API service**

```javascript
// frontend/src/__tests__/services/patientService.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { patientAPI } from '../../services/api';
import axios from 'axios';

vi.mock('axios');

describe('Patient Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRecords', () => {
    it('should fetch patient records', async () => {
      const mockRecords = [
        { id: '1', title: 'Lab Result', type: 'LAB_RESULT' },
        { id: '2', title: 'X-Ray', type: 'IMAGING' }
      ];

      axios.get.mockResolvedValue({
        data: { success: true, records: mockRecords }
      });

      const result = await patientAPI.getRecords();

      expect(axios.get).toHaveBeenCalledWith('/patients/records');
      expect(result.data.records).toEqual(mockRecords);
    });

    it('should handle errors', async () => {
      const error = new Error('Network error');
      axios.get.mockRejectedValue(error);

      await expect(patientAPI.getRecords()).rejects.toThrow('Network error');
    });
  });
});
```

---

## Test Coverage

### Viewing Coverage Reports

After running `npm run test:coverage`:

**Backend:**
```bash
# Open HTML report in browser
open backend/coverage/lcov-report/index.html
```

**Frontend:**
```bash
# Open HTML report in browser
open frontend/coverage/index.html
```

### Coverage Requirements

Current thresholds (configured in `jest.config.js`):

- **Branches:** 70%
- **Functions:** 70%
- **Lines:** 70%
- **Statements:** 70%

### Improving Coverage

1. **Identify uncovered code:**
   ```bash
   npm run test:coverage
   # Check the coverage/index.html report
   ```

2. **Focus on:**
   - Critical business logic
   - Error handling paths
   - Edge cases
   - Security-sensitive code

3. **Don't test:**
   - Third-party libraries
   - Configuration files
   - Mock files

---

## CI/CD Integration

### GitHub Actions

Tests run automatically on:
- Push to main/develop branches
- Pull requests
- Manual trigger

### Workflow:

1. **Setup:** Install dependencies, start services
2. **Backend Tests:** Unit + Integration
3. **Frontend Tests:** Component + Service
4. **Coverage:** Upload to Codecov
5. **Build:** Verify production builds

### Local CI Simulation

Run the same tests as CI locally:

```bash
# Backend
cd backend
npm ci
npm run db:generate
npm run test:coverage

# Frontend
cd frontend
npm ci
npm run test:coverage
```

---

## Best Practices

### General

1. **Follow AAA Pattern:**
   ```javascript
   // Arrange - Setup test data
   const input = 'test';
   
   // Act - Execute the code
   const result = functionUnderTest(input);
   
   // Assert - Verify the result
   expect(result).toBe('expected');
   ```

2. **One assertion per test:** Each test should verify one behavior

3. **Use descriptive names:**
   ```javascript
   // Good
   it('should return 401 when user is not authenticated')
   
   // Bad
   it('test auth')
   ```

4. **Clean up after tests:**
   ```javascript
   afterEach(async () => {
     await cleanupTestData();
   });
   ```

### Backend

1. **Isolate database tests:** Use transactions or separate test database

2. **Mock external services:** Don't call real Hedera/IPFS in tests

3. **Test error paths:**
   ```javascript
   it('should handle database errors gracefully', async () => {
     // Simulate database error
     prisma.$queryRaw.mockRejectedValue(new Error('DB Error'));
     
     const response = await request(app).get('/api/patients');
     
     expect(response.status).toBe(500);
     expect(response.body.success).toBe(false);
   });
   ```

### Frontend

1. **Test user behavior, not implementation:**
   ```javascript
   // Good - tests user interaction
   await user.click(screen.getByRole('button', { name: /submit/i }));
   
   // Bad - tests implementation details
   expect(component.state.isSubmitting).toBe(true);
   ```

2. **Use Testing Library queries:**
   - `getByRole` - Preferred (accessibility)
   - `getByLabelText` - For form inputs
   - `getByText` - For text content
   - `getByTestId` - Last resort

3. **Wait for async updates:**
   ```javascript
   await waitFor(() => {
     expect(screen.getByText('Success')).toBeInTheDocument();
   });
   ```

### Performance

1. **Parallelize tests:** Jest/Vitest run tests in parallel by default

2. **Use appropriate test types:**
   - Unit tests: Fast, isolated
   - Integration tests: Slower, more confidence
   - E2E tests: Slowest, highest confidence

3. **Mock heavy dependencies:**
   ```javascript
   vi.mock('../../services/hederaService', () => ({
     submitAuditMessage: vi.fn().mockResolvedValue({ success: true })
   }));
   ```

---

## Troubleshooting

### Common Issues

**Tests timing out:**
```javascript
// Increase timeout for specific test
it('should process large file', async () => {
  // ...
}, 30000); // 30 seconds
```

**Database connection errors:**
```bash
# Ensure test database exists
createdb medichain_test

# Run migrations
cd backend
npx prisma db push
```

**Port already in use:**
```bash
# Kill process on port 3001
npx kill-port 3001
```

**Module not found errors:**
```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Supertest](https://github.com/visionmedia/supertest)

---

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure coverage doesn't drop
3. Run full test suite before pushing
4. Update this guide if adding new test patterns
