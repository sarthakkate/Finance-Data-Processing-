const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);


router.get(
  '/',
  authorizeRoles('Analyst', 'Admin'),
  summaryController.getDashboardSummary
);


router.get(
  '/advanced',
  authorizeRoles('Analyst', 'Admin'),
  summaryController.getAdvancedAnalytics
);


router.get(
  '/admin',
  authorizeRoles('Admin'),
  summaryController.getAdminSummary
);

module.exports = router;
