// Custom validation functions
export const validators = {
  // Hedera DID validation
  hederaDid: (value) => {
    const didRegex = /^did:hedera:(testnet|mainnet|previewnet):[a-zA-Z0-9._-]+_\d+\.\d+\.\d+$/;
    return didRegex.test(value);
  },

  // Hedera account ID validation
  hederaAccountId: (value) => {
    const accountRegex = /^\d+\.\d+\.\d+$/;
    return accountRegex.test(value);
  },

  // IPFS CID validation
  ipfsCid: (value) => {
    const cidRegex = /^[a-zA-Z0-9]{46}$/;
    return cidRegex.test(value);
  },

  // File type validation
  fileType: (file, allowedTypes) => {
    return allowedTypes.includes(file.mimetype);
  },

  // File size validation (in MB)
  fileSize: (file, maxSizeMB) => {
    return file.size <= maxSizeMB * 1024 * 1024;
  },

  // Date validation (must be in past)
  pastDate: (value) => {
    return new Date(value) < new Date();
  },

  // Date validation (must be in future)
  futureDate: (value) => {
    return new Date(value) > new Date();
  },

  // Phone number validation (international format)
  phoneNumber: (value) => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(value);
  },

  // Blood type validation
  bloodType: (value) => {
    const validTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    return validTypes.includes(value);
  },

  // Medical license number validation
  medicalLicense: (value) => {
    const licenseRegex = /^[A-Z0-9]{6,20}$/;
    return licenseRegex.test(value);
  },

  // Emergency contact validation
  emergencyContact: (value) => {
    return typeof value === 'object' && 
           value.name && 
           value.relationship && 
           validators.phoneNumber(value.phone);
  }
};

// Sanitization functions
export const sanitizers = {
  // Trim and remove extra spaces
  trim: (value) => {
    return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value;
  },

  // Convert to lowercase
  toLowerCase: (value) => {
    return typeof value === 'string' ? value.toLowerCase() : value;
  },

  // Convert to uppercase
  toUpperCase: (value) => {
    return typeof value === 'string' ? value.toUpperCase() : value;
  },

  // Remove special characters (keep only letters, numbers, and basic punctuation)
  removeSpecialChars: (value) => {
    return typeof value === 'string' ? value.replace(/[^a-zA-Z0-9\s.,!?@#%&*()-]/g, '') : value;
  },

  // Normalize email
  normalizeEmail: (value) => {
    return typeof value === 'string' ? value.toLowerCase().trim() : value;
  },

  // Sanitize HTML (basic)
  sanitizeHTML: (value) => {
    if (typeof value !== 'string') return value;
    return value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
};

// Utility functions for validation
export const validationUtils = {
  // Check if value is empty
  isEmpty: (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  },

  // Check if value is numeric
  isNumeric: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },

  // Check if value is within range
  isInRange: (value, min, max) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
  },

  // Validate object structure
  hasRequiredFields: (obj, requiredFields) => {
    if (typeof obj !== 'object') return false;
    return requiredFields.every(field => obj.hasOwnProperty(field) && !validationUtils.isEmpty(obj[field]));
  },

  // Validate array contents
  arrayContains: (array, validator) => {
    if (!Array.isArray(array)) return false;
    return array.every(item => validator(item));
  }
};

export default {
  validators,
  sanitizers,
  validationUtils
};