export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password) => {
    return password.length >= 8;
  },

  did: (did) => {
    const didRegex = /^did:hedera:testnet:[a-zA-Z0-9._-]+_\d+\.\d+\.\d+$/;
    return didRegex.test(did);
  },

  hederaAccountId: (accountId) => {
    const accountRegex = /^\d+\.\d+\.\d+$/;
    return accountRegex.test(accountId);
  },

  cid: (cid) => {
    const cidRegex = /^[a-zA-Z0-9]{46}$/;
    return cidRegex.test(cid);
  },

  fileType: (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
  },

  fileSize: (file, maxSizeMB) => {
    return file.size <= maxSizeMB * 1024 * 1024;
  },

  required: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },

  minLength: (value, min) => {
    return value.length >= min;
  },

  maxLength: (value, max) => {
    return value.length <= max;
  },

  numeric: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },

  date: (value) => {
    return !isNaN(Date.parse(value));
  },

  phone: (phone) => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  }
};

export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];
    
    for (const rule of fieldRules) {
      if (rule.required && !validators.required(value)) {
        errors[field] = rule.message || `${field} is required`;
        break;
      }
      
      if (rule.minLength && !validators.minLength(value, rule.minLength)) {
        errors[field] = rule.message || `${field} must be at least ${rule.minLength} characters`;
        break;
      }
      
      if (rule.maxLength && !validators.maxLength(value, rule.maxLength)) {
        errors[field] = rule.message || `${field} must be at most ${rule.maxLength} characters`;
        break;
      }
      
      if (rule.type === 'email' && !validators.email(value)) {
        errors[field] = rule.message || 'Invalid email address';
        break;
      }
      
      if (rule.type === 'password' && !validators.password(value)) {
        errors[field] = rule.message || 'Password must be at least 8 characters';
        break;
      }
      
      if (rule.custom && !rule.validator(value)) {
        errors[field] = rule.message || `Invalid ${field}`;
        break;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Predefined validation rules
export const validationRules = {
  email: [
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Invalid email address' }
  ],
  password: [
    { required: true, message: 'Password is required' },
    { type: 'password', message: 'Password must be at least 8 characters' }
  ],
  name: [
    { required: true, message: 'Name is required' },
    { minLength: 2, message: 'Name must be at least 2 characters' },
    { maxLength: 50, message: 'Name must be less than 50 characters' }
  ],
  did: [
    { required: true, message: 'DID is required' },
    { custom: true, validator: validators.did, message: 'Invalid DID format' }
  ],
  medicalRecord: [
    { required: true, message: 'Record title is required' },
    { minLength: 5, message: 'Title must be at least 5 characters' }
  ]
};

export default validators;