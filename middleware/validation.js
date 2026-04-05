const { body, param, query, validationResult } = require('express-validator');

/**
 * Handle validation errors and return formatted response
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validation: User Registration
 */
exports.validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['Admin', 'Analyst', 'Viewer'])
    .withMessage('Invalid role'),
  handleValidationErrors,
];

/**
 * Validation: User Login
 */
exports.validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

/**
 * Validation: Create Record
 */
exports.validateCreateRecord = [
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['Income', 'Expense'])
    .withMessage('Type must be either Income or Expense'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'Salary',
      'Bonus',
      'Investment',
      'Other Income',
      'Food',
      'Transport',
      'Utilities',
      'Entertainment',
      'Healthcare',
      'Education',
      'Other Expense',
    ])
    .withMessage('Invalid category'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  handleValidationErrors,
];

/**
 * Validation: Update Record
 */
exports.validateUpdateRecord = [
  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .optional()
    .isIn(['Income', 'Expense'])
    .withMessage('Type must be either Income or Expense'),
  body('category')
    .optional()
    .isIn([
      'Salary',
      'Bonus',
      'Investment',
      'Other Income',
      'Food',
      'Transport',
      'Utilities',
      'Entertainment',
      'Healthcare',
      'Education',
      'Other Expense',
    ])
    .withMessage('Invalid category'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  handleValidationErrors,
];

/**
 * Validation: Record ID parameter
 */
exports.validateRecordId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid record ID'),
  handleValidationErrors,
];

/**
 * Validation: Query parameters for filtering records
 */
exports.validateFilterParams = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('startDate must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('endDate must be a valid ISO 8601 date'),
  query('category')
    .optional()
    .isIn([
      'Salary',
      'Bonus',
      'Investment',
      'Other Income',
      'Food',
      'Transport',
      'Utilities',
      'Entertainment',
      'Healthcare',
      'Education',
      'Other Expense',
    ])
    .withMessage('Invalid category'),
  query('type')
    .optional()
    .isIn(['Income', 'Expense'])
    .withMessage('Type must be either Income or Expense'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors,
];
