import { body, param, query, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Auth validators
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('role')
    .isIn(['PATIENT', 'DOCTOR', 'ADMIN'])
    .withMessage('Invalid role specified'),
  handleValidationErrors
];

// Patient validators
export const validateRecordUpload = [
  body('title')
    .isLength({ min: 5 })
    .withMessage('Title must be at least 5 characters long'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('recordType')
    .isIn(['LAB_RESULT', 'PRESCRIPTION', 'IMAGING', 'DIAGNOSIS', 'TREATMENT', 'OTHER'])
    .withMessage('Invalid record type'),
  handleValidationErrors
];

// Doctor validators
export const validateAccessRequest = [
  body('patientDid')
    .isLength({ min: 10 })
    .withMessage('Valid patient DID is required'),
  body('purpose')
    .isLength({ min: 10 })
    .withMessage('Purpose must be at least 10 characters long'),
  body('durationDays')
    .isInt({ min: 1, max: 365 })
    .withMessage('Duration must be between 1 and 365 days'),
  handleValidationErrors
];

// Admin validators
export const validateDepartmentCreate = [
  body('name')
    .isLength({ min: 3 })
    .withMessage('Department name must be at least 3 characters long'),
  body('description')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Description must be less than 200 characters'),
  handleValidationErrors
];

// ID validators
export const validateIdParam = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];