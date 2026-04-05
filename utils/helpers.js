
const successResponse = (data, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};


const errorResponse = (message = 'Error', errors = null, statusCode = 500) => {
  return {
    success: false,
    message,
    ...(errors && { errors }),
    timestamp: new Date().toISOString(),
  };
};


const getPaginationParams = (page = 1, limit = 10) => {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (parsedPage - 1) * parsedLimit;

  return { page: parsedPage, limit: parsedLimit, skip };
};


const getDateRange = (startDate, endDate) => {
  const range = {};

  if (startDate) {
    range.$gte = new Date(startDate);
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    range.$lte = end;
  }

  return Object.keys(range).length > 0 ? range : null;
};


const calculateSummaryStats = (records) => {
  const stats = {
    totalAmount: 0,
    count: records.length,
    byType: {},
    byCategory: {},
  };

  records.forEach((record) => {
    stats.totalAmount += record.amount;

    
    if (!stats.byType[record.type]) {
      stats.byType[record.type] = { total: 0, count: 0 };
    }
    stats.byType[record.type].total += record.amount;
    stats.byType[record.type].count += 1;

    
    if (!stats.byCategory[record.category]) {
      stats.byCategory[record.category] = { total: 0, count: 0 };
    }
    stats.byCategory[record.category].total += record.amount;
    stats.byCategory[record.category].count += 1;
  });

  return stats;
};


const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};


const isValidRole = (role) => {
  return ['Admin', 'Analyst', 'Viewer'].includes(role);
};


const isValidType = (type) => {
  return ['Income', 'Expense'].includes(type);
};


const isValidCategory = (category) => {
  const validCategories = [
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
  ];
  return validCategories.includes(category);
};

const checkAuthorization = (userRole, requiredRoles) => {
  return requiredRoles.includes(userRole);
};

module.exports = {
  successResponse,
  errorResponse,
  getPaginationParams,
  getDateRange,
  calculateSummaryStats,
  formatCurrency,
  isValidRole,
  isValidType,
  isValidCategory,
  checkAuthorization,
};
