const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const {
  validateCreateRecord,
  validateUpdateRecord,
  validateRecordId,
  validateFilterParams,
} = require('../middleware/validation');

// All routes require authentication
router.use(authenticate);


router.get(
  '/',
  validateFilterParams,
  recordController.getRecords
);


 
router.get('/:id', validateRecordId, recordController.getRecord);


router.post(
  '/',
  authorizeRoles('Analyst', 'Admin'),
  validateCreateRecord,
  recordController.createRecord
);


router.put(
  '/:id',
  authorizeRoles('Analyst', 'Admin'),
  validateRecordId,
  validateUpdateRecord,
  recordController.updateRecord
);


router.delete(
  '/:id',
  authorizeRoles('Admin'),
  validateRecordId,
  recordController.deleteRecord
);


router.get(
  '/user/:userId',
  authorizeRoles('Admin'),
  recordController.getUserRecords
);

module.exports = router;
