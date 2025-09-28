import { body, param, query, validationResult } from 'express-validator';
import { validators } from '../utils/customValidators.js';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Authentication validators
export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('name')
    .isLength({ min: 2, max: 50 })
    .trim()
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('role')
    .isIn(['PATIENT', 'DOCTOR', 'ADMIN'])
    .withMessage('Invalid role specified'),
  
  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Patient record validators
export const validateRecordUpload = [
  body('title')
    .isLength({ min: 5, max: 100 })
    .trim()
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .trim()
    .withMessage('Description must be less than 500 characters'),
  
  body('recordType')
    .isIn(['LAB_RESULT', 'PRESCRIPTION', 'IMAGING', 'DIAGNOSIS', 'TREATMENT', 'OTHER'])
    .withMessage('Invalid record type'),
  
  body('patientDid')
    .optional()
    .custom(validators.hederaDid)
    .withMessage('Invalid Hedera DID format'),
  
  handleValidationErrors
];

// Consent validators
export const validateConsent = [
  body('doctorDid')
    .custom(validators.hederaDid)
    .withMessage('Invalid doctor DID format'),
  
  body('recordIds')
    .isArray({ min: 1 })
    .withMessage('At least one record ID must be provided'),
  
  body('purpose')
    .isLength({ min: 10, max: 200 })
    .trim()
    .withMessage('Purpose must be between 10 and 200 characters'),
  
  body('expiryDate')
    .isISO8601()
    .withMessage('Invalid expiry date format')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Expiry date must be in the future');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Access request validators
export const validateAccessRequest = [
  body('patientDid')
    .custom(validators.hederaDid)
    .withMessage('Invalid patient DID format'),
  
  body('purpose')
    .isLength({ min: 10, max: 200 })
    .trim()
    .withMessage('Purpose must be between 10 and 200 characters'),
  
  body('durationDays')
    .isInt({ min: 1, max: 365 })
    .withMessage('Duration must be between 1 and 365 days'),
  
  handleValidationErrors
];

// Department validators
export const validateDepartmentCreate = [
  body('name')
    .isLength({ min: 3, max: 50 })
    .trim()
    .withMessage('Department name must be between 3 and 50 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 200 })
    .trim()
    .withMessage('Description must be less than 200 characters'),
  
  handleValidationErrors
];

// Patient registration validators (for admins)
export const validatePatientRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('name')
    .isLength({ min: 2, max: 50 })
    .trim()
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Invalid date of birth format')
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      if (dob >= today) {
        throw new Error('Date of birth must be in the past');
      }
      return true;
    }),
  
  body('bloodType')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood type'),
  
  body('allergies')
    .optional()
    .isLength({ max: 500 })
    .trim()
    .withMessage('Allergies description must be less than 500 characters'),
  
  handleValidationErrors
];

// ID parameter validators
export const validateIdParam = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];

export const validateDidParam = [
  param('did')
    .custom(validators.hederaDid)
    .withMessage('Invalid Hedera DID format'),
  
  handleValidationErrors
];

// Pagination validators
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  
  query('sort')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort must be either "asc" or "desc"'),
  
  handleValidationErrors
];

// Search validators
export const validateSearch = [
  query('q')
    .optional()
    .isLength({ min: 2, max: 50 })
    .trim()
    .withMessage('Search query must be between 2 and 50 characters'),
  
  handleValidationErrors
];

export default {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateRecordUpload,
  validateConsent,
  validateAccessRequest,
  validateDepartmentCreate,
  validatePatientRegister,
  validateIdParam,
  validateDidParam,
  validatePagination,
  validateSearch
};