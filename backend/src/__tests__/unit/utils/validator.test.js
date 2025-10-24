import { validators } from '../../../utils/customValidators.js';

describe('Custom Validators', () => {
  describe('hederaDid', () => {
    it('should validate correct Hedera DID format', () => {
      const validDid = 'did:hedera:testnet:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK_0.0.123456';
      expect(() => validators.hederaDid(validDid)).not.toThrow();
    });

    it('should reject invalid DID format', () => {
      const invalidDid = 'invalid-did-format';
      expect(() => validators.hederaDid(invalidDid)).toThrow();
    });

    it('should reject empty DID', () => {
      expect(() => validators.hederaDid('')).toThrow();
    });
  });

  describe('bloodType', () => {
    it('should validate correct blood types', () => {
      const validTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      validTypes.forEach(type => {
        expect(() => validators.bloodType(type)).not.toThrow();
      });
    });

    it('should reject invalid blood types', () => {
      expect(() => validators.bloodType('C+')).toThrow();
      expect(() => validators.bloodType('invalid')).toThrow();
    });
  });

  describe('recordType', () => {
    it('should validate correct record types', () => {
      const validTypes = ['LAB_RESULT', 'PRESCRIPTION', 'IMAGING', 'DIAGNOSIS', 'TREATMENT', 'OTHER'];
      validTypes.forEach(type => {
        expect(() => validators.recordType(type)).not.toThrow();
      });
    });

    it('should reject invalid record types', () => {
      expect(() => validators.recordType('INVALID_TYPE')).toThrow();
    });
  });
});
