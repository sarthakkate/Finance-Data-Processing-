/**
 * Application Constants
 * Centralized definitions for roles, categories, and other constants
 */

const ROLES = {
  ADMIN: 'Admin',
  ANALYST: 'Analyst',
  VIEWER: 'Viewer',
};

const RECORD_TYPES = {
  INCOME: 'Income',
  EXPENSE: 'Expense',
};

const INCOME_CATEGORIES = [
  'Salary',
  'Bonus',
  'Investment',
  'Other Income',
];

const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Other Expense',
];

const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

const USER_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Not authenticated. Please log in.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_EXISTS: 'Email already registered.',
  VALIDATION_FAILED: 'Validation failed. Please check your input.',
  SERVER_ERROR: 'An unexpected error occurred.',
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

const JWT_CONFIG = {
  EXPIRATION: process.env.JWT_EXPIRE || '7d',
};

module.exports = {
  ROLES,
  RECORD_TYPES,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  ALL_CATEGORIES,
  USER_STATUS,
  HTTP_STATUS_CODES,
  ERROR_MESSAGES,
  PAGINATION,
  JWT_CONFIG,
};
