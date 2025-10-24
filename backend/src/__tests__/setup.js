import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medichain_test';

// Global test timeout
jest.setTimeout(30000);

// Mock external services in test environment
global.mockHederaService = {
  submitAuditMessage: jest.fn().mockResolvedValue({ success: true, sequenceNumber: '123' }),
  healthCheck: jest.fn().mockResolvedValue({ healthy: true })
};

global.mockIPFSService = {
  uploadFile: jest.fn().mockResolvedValue({ success: true, cid: 'test-cid-123' })
};

// Clean up after all tests
afterAll(async () => {
  // Close database connections, clean up resources
  await new Promise(resolve => setTimeout(resolve, 500));
});
